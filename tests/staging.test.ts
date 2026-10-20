import assert from "node:assert/strict";
import { test } from "node:test";
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

test(
  "installed Husky hook preserves unstaged hunks and unrelated files",
  { timeout: 30000 },
  () => {
    const dir = mkdtempSync(join(tmpdir(), "portfolio-staging-"));
    const run = (command: string, args: string[]) => {
      const result = spawnSync(command, args, {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, HUSKY: "1" },
      });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      return result.stdout;
    };
    try {
      for (const file of [
        "scripts",
        ".husky",
        ".oxfmtrc.json",
        ".oxlintrc.json",
        ".prettierrc.json",
        "lint-staged.config.mjs",
      ])
        cpSync(file, join(dir, file), { recursive: true });
      symlinkSync(resolve("node_modules"), join(dir, "node_modules"), "dir");
      writeFileSync(join(dir, ".gitignore"), "node_modules/\n.husky/_/\n");
      writeFileSync(
        join(dir, "package.json"),
        JSON.stringify({
          type: "module",
          scripts: {
            typecheck: "node -e \"console.log('fixture typecheck gate')\"",
            test: "node -e \"console.log('fixture test gate')\"",
          },
        }),
      );
      run("git", ["init", "-q"]);
      run("git", ["config", "user.name", "Hook fixture"]);
      run("git", ["config", "user.email", "fixture@example.invalid"]);
      run("git", ["config", "commit.gpgsign", "false"]);
      writeFileSync(
        join(dir, "sample.ts"),
        "export const first = 1;\n\n// separate edit\nexport const second = 2;\n",
      );
      writeFileSync(join(dir, "unrelated.txt"), "original\n");
      run("git", ["add", "."]);
      run("git", ["-c", "core.hooksPath=/dev/null", "commit", "-qm", "fixture baseline"]);
      run(process.execPath, ["scripts/prepare.mjs"]);
      assert.equal(run("git", ["config", "--local", "core.hooksPath"]).trim(), ".husky/_");
      writeFileSync(
        join(dir, "sample.ts"),
        "export const first={value:3}\n\n// separate edit\nexport const second = 2;\n",
      );
      run("git", ["add", "sample.ts"]);
      writeFileSync(
        join(dir, "sample.ts"),
        "export const first={value:3}\n\n// separate edit\nexport const second = 99;\n",
      );
      writeFileSync(join(dir, "unrelated.txt"), "UNSTAGED unrelated change\n");
      run("git", ["commit", "-qm", "exercise actual hook"]);
      const committed = run("git", ["show", "HEAD:sample.ts"]);
      assert.match(committed, /first = \{ value: 3 \};/);
      assert.match(committed, /second = 2;/);
      assert.match(readFileSync(join(dir, "sample.ts"), "utf8"), /second = 99;/);
      assert.equal(run("git", ["show", "HEAD:unrelated.txt"]), "original\n");
      assert.equal(readFileSync(join(dir, "unrelated.txt"), "utf8"), "UNSTAGED unrelated change\n");
      assert.equal(run("git", ["diff", "--cached"]), "");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  },
);
