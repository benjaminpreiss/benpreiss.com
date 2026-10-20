import { cpSync, mkdtempSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

// Real renderer/components/styles, but ONLY controlled test documents.
// Never swaps content in the working tree or changes the production build config.
export function createFixtureSite({ productionContent = false } = {}) {
  const root = resolve(import.meta.dirname, "../..");
  // Nested fixture configs trigger Astro/Vite restarts in a running dev server.
  // Keep source, build output and caches outside its watched project tree.
  const dir = mkdtempSync(join(tmpdir(), "portfolio-rendering-"));
  const cleanup = () => rmSync(dir, { recursive: true, force: true });
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
    ])
      cpSync(join(root, file), join(dir, file), { recursive: true });
    cpSync(
      join(root, productionContent ? "content" : "tests/fixtures/content"),
      join(dir, "content"),
      { recursive: true },
    );
    for (const file of readdirSync(join(root, "content"))) {
      if (file.endsWith(".json")) cpSync(join(root, "content", file), join(dir, "content", file));
    }
    cpSync(join(root, "public"), join(dir, "public"), {
      recursive: true,
      filter: (path) => !/\.(?:webm|mp4|mov|woff2)$/i.test(path),
    });
    if (!productionContent) {
      // Asset-existence fixtures only, not playable media. Browser playback tests
      // supply their own media responses. Never copy the owner\'s recordings.
      for (const device of ["mobile", "desktop"])
        for (const extension of ["webm", "mp4"])
          writeFileSync(
            join(dir, "public", `fixture-${device}.${extension}`),
            "Synthetic asset-existence fixture; not playable media.\n",
          );
    }
    symlinkSync(join(root, "node_modules"), join(dir, "node_modules"), "dir");
    // Exercise generation from pinned dependencies, never depend on local font binaries.
    const fonts = spawnSync(process.execPath, ["scripts/fonts.mjs"], {
      cwd: dir,
      encoding: "utf8",
    });
    if (fonts.status !== 0)
      throw new Error(`Fixture font generation failed: ${fonts.stdout}${fonts.stderr}`);
  } catch (error) {
    cleanup();
    throw error;
  }
  const astro = join(root, "node_modules/astro/bin/astro.mjs");
  return {
    dir,
    astro,
    cleanup,
    build: (environment: Record<string, string> = {}) =>
      spawnSync(process.execPath, [astro, "build"], {
        cwd: dir,
        encoding: "utf8",
        env: {
          ...process.env,
          PRODUCTION_ORIGIN: "",
          RELEASE_BUILD: "",
          ...environment,
          ASTRO_TELEMETRY_DISABLED: "1",
        },
      }),
  };
}
