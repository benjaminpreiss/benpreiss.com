import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { checkMarkdoc } from "./markdoc-hygiene.ts";

const mode = process.argv[2];
if (mode !== "--write" && mode !== "--check") throw new Error("Expected --write or --check");
const supplied = process.argv.slice(3);
const files = supplied.length
  ? supplied
  : [
      ...readdirSync(".", { withFileTypes: true })
        .filter((file) => file.isFile())
        .map((file) => file.name),
      ...[
        "src",
        "scripts",
        "tests",
        "content",
        "styles",
        ...(existsSync("docs") ? ["docs"] : []),
      ].flatMap((dir) =>
        readdirSync(dir, { recursive: true, encoding: "utf8" }).map((file) => `${dir}/${file}`),
      ),
    ];
function run(bin: string, args: string[]) {
  const result = spawnSync(`node_modules/.bin/${bin}`, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const astro = files.filter((file) => file.endsWith(".astro"));
const markdoc = files.filter((file) => file.endsWith(".mdoc"));
const other = files.filter(
  (file) =>
    /\.(?:[cm]?js|ts|svelte|json|css|md|yaml)$/.test(file) && !file.endsWith("pnpm-lock.yaml"),
);
if (other.length) run("oxfmt", [mode, ...other]);
if (astro.length) run("prettier", [mode, ...astro]);
checkMarkdoc(markdoc, mode === "--write");
