import { existsSync, lstatSync } from "node:fs";
import husky from "husky";
import "./fonts.mjs";

// A linked worktree shares Git configuration with the preserved original.
// Never let Husky mutate that shared core.hooksPath during this migration.
if (existsSync(".git") && lstatSync(".git").isDirectory()) {
  console.log(husky());
} else {
  console.log(
    "Linked worktree: hook installation skipped to preserve shared Git config. See README.",
  );
}
