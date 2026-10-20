import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

// Package versions are pinned in package.json/pnpm-lock.yaml. This script never
// fetches fonts from the network; it generates reviewable, versioned assets.
const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const assets = new Map();
for (const style of ["normal", "italic"]) {
  for (const subset of ["latin", "latin-ext"]) {
    const source = `@fontsource-variable/work-sans/files/work-sans-${subset}-wght-${style}.woff2`;
    const name = `WorkSans${style === "italic" ? "-Italic" : ""}-${subset}.woff2`;
    assets.set(`work-sans/${name}`, readFileSync(require.resolve(source)));
  }
}
assets.set(
  "work-sans/OFL.txt",
  readFileSync(require.resolve("@fontsource-variable/work-sans/LICENSE")),
);
assets.set("onest/OFL.txt", readFileSync(require.resolve("@fontsource/onest/LICENSE")));
const logo = await subsetFont(
  readFileSync(require.resolve("@fontsource/onest/files/onest-latin-700-normal.woff2")),
  "benpreiss",
  {
    targetFormat: "woff2",
    // Retain copyright, identity, license and license-URL metadata.
    preserveNameIds: [0, 1, 2, 3, 4, 5, 6, 13, 14],
  },
);
assets.set("onest/benpreiss-700.woff2", logo);
for (const [name, bytes] of assets) {
  const path = resolve(root, "public/fonts", name);
  const matches = existsSync(path) && readFileSync(path).equals(bytes);
  if (check && !matches)
    throw new Error(
      `Font asset differs from pinned Fontsource inputs: ${name}. Run pnpm fonts:generate.`,
    );
  if (!check && !matches) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, bytes);
  }
}
console.log(
  `${check ? "Verified" : "Generated"} ${assets.size} Fontsource assets; Onest logo subset: ${logo.length} bytes.`,
);
