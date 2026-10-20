import assert from "node:assert/strict";
import test from "node:test";
import { cpSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { once } from "node:events";

// Reproduce concurrent dev + fixture builds in a disposable project, never in
// the owner's running worktree. Copy the real helper so its derived root is here.
test(
  "fixture creation, build and cleanup do not restart a running dev server",
  { timeout: 60000 },
  async () => {
    const root = resolve(import.meta.dirname, "..");
    const dir = mkdtempSync(join(tmpdir(), "portfolio-dev-isolation-"));
    let server: ReturnType<typeof spawn> | undefined;
    let fixture: { cleanup: () => void } | undefined;
    let log = "";
    try {
      for (const file of [
        "package.json",
        "astro.config.mjs",
        "markdoc.config.ts",
        "svelte.config.js",
        "postcss.config.cjs",
        "tailwind.config.cjs",
        "tsconfig.json",
        "src",
        "styles",
        "scripts",
        "tests/support/site.ts",
        "tests/fixtures/content",
      ])
        cpSync(join(root, file), join(dir, file), { recursive: true });
      cpSync(join(root, "tests/fixtures/content"), join(dir, "content"), { recursive: true });
      for (const file of ["ui.json", "technology-buttons.json"])
        cpSync(join(root, "content", file), join(dir, "content", file));
      cpSync(join(root, "public"), join(dir, "public"), {
        recursive: true,
        filter: (path) => !/\.(?:webm|mp4|mov)$/i.test(path),
      });
      symlinkSync(join(root, "node_modules"), join(dir, "node_modules"), "dir");
      server = spawn(
        process.execPath,
        [
          join(root, "node_modules/astro/bin/astro.mjs"),
          "dev",
          "--host",
          "127.0.0.1",
          "--port",
          "44324",
          "--ignore-lock",
        ],
        {
          cwd: dir,
          env: {
            ...process.env,
            ASTRO_TELEMETRY_DISABLED: "1",
            PRODUCTION_ORIGIN: "",
            RELEASE_BUILD: "",
          },
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      server.stdout!.on("data", (data) => {
        log += data.toString();
      });
      server.stderr!.on("data", (data) => {
        log += data.toString();
      });
      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      let ready = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        assert.equal(server.exitCode, null, log);
        if (log.includes("http://127.0.0.1:44324/")) {
          const response = await fetch("http://127.0.0.1:44324/hello", {
            signal: AbortSignal.timeout(5000),
          });
          if (response.ok) {
            await response.text();
            ready = true;
            break;
          }
        }
        await sleep(100);
      }
      assert.ok(ready, log);
      await sleep(500);
      const start = log.length;
      const { createFixtureSite } = await import(
        pathToFileURL(join(dir, "tests/support/site.ts")).href
      );
      const site = createFixtureSite();
      fixture = site;
      const result = site.build();
      assert.equal(result.status, 0, result.stdout + result.stderr);
      site.cleanup();
      fixture = undefined;
      await sleep(1500); // Allow watch events and their debounced restarts to arrive.
      assert.doesNotMatch(
        log.slice(start),
        /Configuration file (?:added|removed)|changed tsconfig file detected|server restarted|module runner has been closed/i,
      );
      const response = await fetch("http://127.0.0.1:44324/hello", {
        signal: AbortSignal.timeout(5000),
      });
      assert.equal(response.status, 200, await response.text());
    } finally {
      fixture?.cleanup();
      if (server && server.exitCode === null && server.signalCode === null) {
        const exit = once(server, "exit");
        server.kill("SIGTERM");
        const timer = setTimeout(() => server!.kill("SIGKILL"), 2000);
        try {
          await exit;
        } finally {
          clearTimeout(timer);
        }
      }
      rmSync(dir, { recursive: true, force: true });
    }
  },
);
