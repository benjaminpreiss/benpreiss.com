import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { cpSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { createFixtureSite } from "./support/site.ts";

// Exercise Cloudflare's local asset server, not Astro's different preview routing.
// No credentials, uploads, DNS changes or owner-managed server processes.
test(
  "Cloudflare static hosting preserves routes, noindex, assets and real 404s",
  { timeout: 120000 },
  async () => {
    const root = resolve(import.meta.dirname, "..");
    const site = createFixtureSite({ productionContent: true });
    let server: ReturnType<typeof spawn> | undefined;
    let log = "";
    try {
      cpSync(join(root, "wrangler.json"), join(site.dir, "wrangler.json"));
      const built = site.build();
      assert.equal(built.status, 0, built.stdout + built.stderr);
      const output = join(site.dir, "dist");
      const files = readdirSync(output, { recursive: true, encoding: "utf8" }).filter((file) =>
        statSync(join(output, file)).isFile(),
      );
      assert.ok(files.length <= 20000, "Within Cloudflare's free-plan asset count limit");
      for (const file of files)
        assert.ok(
          statSync(join(output, file)).size <= 25 * 1024 * 1024,
          `Asset exceeds 25 MiB: ${file}`,
        );

      server = spawn(
        process.execPath,
        [
          join(root, "node_modules/wrangler/wrangler-dist/cli.js"),
          "dev",
          "--local",
          "--ip",
          "127.0.0.1",
          "--port",
          "0",
          "--inspector-port",
          "0",
        ],
        {
          cwd: site.dir,
          env: {
            ...process.env,
            CI: "true",
            WRANGLER_SEND_METRICS: "false",
            XDG_CONFIG_HOME: join(site.dir, ".wrangler/config"),
            WRANGLER_LOG_PATH: join(site.dir, ".wrangler/test.log"),
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
      let base: string | undefined;
      for (let attempt = 0; attempt < 200; attempt++) {
        assert.equal(server.exitCode, null, log);
        const match = log.match(/Ready on (http:\/\/127\.0\.0\.1:\d+)/);
        if (match) {
          base = match[1];
          break;
        }
        await sleep(100);
      }
      assert.ok(base, log);
      const request = (path: string) =>
        fetch(base + path, {
          redirect: "manual",
          signal: AbortSignal.timeout(5000),
        });
      for (const path of ["/", "/en", "/privacy", "/en/privacy"]) {
        const response = await request(path);
        assert.equal(response.status, 200, path);
        assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
        const html = await response.text();
        assert.match(html, /name="robots" content="noindex, nofollow"/);
        assert.doesNotMatch(html, /rel="canonical"/, "Preview origin is not a canonical origin");
      }
      for (const [from, to] of [
        ["/en/", "/en"],
        ["/en/index.html", "/en"],
        ["/privacy/", "/privacy"],
        ["/en/privacy/", "/en/privacy"],
        ["/en/?check=1", "/en?check=1"],
      ]) {
        const response = await request(from!);
        assert.equal(response.status, 307, from);
        assert.equal(new URL(response.headers.get("location")!, base).href, base + to);
        await response.arrayBuffer();
      }
      for (const path of ["/not-a-real-page", "/en/not-a-real-page"]) {
        const response = await request(path);
        assert.equal(response.status, 404);
        assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
        assert.match(await response.text(), /<html/);
      }
      const malformed = await request("/%ZZ");
      assert.equal(malformed.status, 307);
      assert.equal(new URL(malformed.headers.get("location")!, base).href, `${base}/%25ZZ`);
      await malformed.arrayBuffer();
      const normalized = await request("/%25ZZ");
      assert.equal(
        normalized.status,
        404,
        "Malformed encoding normalizes to a real 404, not a 500",
      );
      await normalized.arrayBuffer();
      for (const path of [
        "/fonts/onest/benpreiss-700.woff2",
        "/fonts/onest/OFL.txt",
        "/THIRD-PARTY-NOTICES.txt",
        "/robots.txt",
        "/sitemap.xml",
      ]) {
        const response = await request(path);
        assert.equal(response.status, 200, path);
        assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
        await response.arrayBuffer();
      }
      assert.equal(
        (await request("/_headers")).status,
        404,
        "Provider config is not a public asset",
      );
    } finally {
      if (server && server.exitCode === null && server.signalCode === null) {
        const exited = once(server, "exit");
        server.kill("SIGTERM");
        const timer = setTimeout(() => server!.kill("SIGKILL"), 3000);
        try {
          await exited;
        } finally {
          clearTimeout(timer);
        }
      }
      site.cleanup();
    }
  },
);
