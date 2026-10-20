import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

test("formatter discovers source files without the optional ignored docs directory", () => {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-format-checkout-"));
  try {
    for (const file of [
      "scripts",
      "package.json",
      ".oxfmtrc.json",
      ".oxlintrc.json",
      ".prettierrc.json",
    ])
      cpSync(file, join(dir, file), { recursive: true });
    for (const folder of ["src", "tests", "content", "styles"]) mkdirSync(join(dir, folder));
    symlinkSync(resolve("node_modules"), join(dir, "node_modules"), "dir");
    const run = (mode: string) =>
      spawnSync(process.execPath, ["scripts/format.ts", mode], { cwd: dir, encoding: "utf8" });
    let result = run("--check");
    assert.equal(result.status, 0, result.stdout + result.stderr);
    writeFileSync(join(dir, "src/sample.ts"), "export const value={a:1}\n");
    assert.notEqual(run("--check").status, 0);
    result = run("--write");
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(run("--check").status, 0);
    mkdirSync(join(dir, "docs"));
    writeFileSync(join(dir, "docs/sample.ts"), "export const example={b:2}\n");
    assert.notEqual(run("--check").status, 0, "Local docs are still checked when present");
    result = run("--write");
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(run("--check").status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("formatter ownership is complete and idempotent; Oxlint checks framework scripts", () => {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-quality-"));
  try {
    for (const file of ["scripts", ".oxfmtrc.json", ".oxlintrc.json", ".prettierrc.json"])
      cpSync(file, join(dir, file), { recursive: true });
    symlinkSync(resolve("node_modules"), join(dir, "node_modules"), "dir");
    writeFileSync(join(dir, "package.json"), '{"type":"module"}\n');
    const fixtures = {
      "sample.ts": "export const value={a:1}\n",
      "Sample.svelte":
        '<script lang="ts">let count=$state(0)</script>\n<button onclick={()=>count++}>{count}</button>',
      "Sample.astro": '---\nconst title="hello"\n---\n<h1>{title}</h1>',
      "home.mdoc": "intentional break  \r\nnext line\r\n\r\n",
    };
    const files = Object.keys(fixtures);
    for (const [file, source] of Object.entries(fixtures)) writeFileSync(join(dir, file), source);
    const run = (args: string[]) =>
      spawnSync(process.execPath, args, { cwd: dir, encoding: "utf8" });
    assert.notEqual(run(["scripts/format.ts", "--check", ...files]).status, 0);
    let result = run(["scripts/format.ts", "--write", ...files]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const once = files.map((file) => readFileSync(join(dir, file), "utf8"));
    result = run(["scripts/format.ts", "--write", ...files]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.deepEqual(
      files.map((file) => readFileSync(join(dir, file), "utf8")),
      once,
    );
    assert.equal(run(["scripts/format.ts", "--check", ...files]).status, 0);
    assert.equal(readFileSync(join(dir, "home.mdoc"), "utf8"), "intentional break  \nnext line\n");
    for (const [file, source] of Object.entries({
      "bad.ts": "const value = 1; value = 2;",
      "Bad.astro": "---\nconst value = 1; value = 2;\n---\n<p>{value}</p>",
      "Bad.svelte": "<script>const value = 1; value = 2;</script><p>{value}</p>",
    })) {
      writeFileSync(join(dir, file), source);
      const lint = spawnSync(resolve("node_modules/.bin/oxlint"), ["--deny-warnings", file], {
        cwd: dir,
        encoding: "utf8",
      });
      assert.notEqual(lint.status, 0, `Oxlint must catch const reassignment in ${file}`);
      assert.match(lint.stdout + lint.stderr, /const|assign/i);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
