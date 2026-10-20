import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { createFixtureSite } from "./support/site.ts";
import { auditBuild } from "../scripts/audit-build.ts";

test(
  "redistributable fonts build without proprietary assets; missing fonts or license fail",
  { timeout: 60000 },
  () => {
    const site = createFixtureSite();
    try {
      const result = site.build();
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const output = join(site.dir, "dist");
      const base = "fonts/work-sans/";
      for (const name of [
        "WorkSans-latin.woff2",
        "WorkSans-latin-ext.woff2",
        "WorkSans-Italic-latin.woff2",
        "WorkSans-Italic-latin-ext.woff2",
        "OFL.txt",
      ]) {
        const path = join(output, base, name);
        const bytes = readFileSync(path);
        if (name.endsWith("woff2")) assert.equal(bytes.toString("ascii", 0, 4), "wOF2");
        else assert.match(bytes.toString(), /SIL OPEN FONT LICENSE Version 1.1/);
        rmSync(path);
        assert.throws(() => auditBuild(output), /Missing required font asset/);
        writeFileSync(path, bytes);
      }
      for (const name of ["benpreiss-700.woff2", "OFL.txt"]) {
        const path = join(output, "fonts/onest", name);
        const bytes = readFileSync(path);
        rmSync(path);
        assert.throws(() => auditBuild(output), /Missing required font asset/);
        writeFileSync(path, bytes);
      }
      writeFileSync(join(output, "FoundersGrotesk-Medium.woff2"), "forbidden fixture");
      assert.throws(() => auditBuild(output), /Proprietary font/);
      rmSync(join(site.dir, "public", base, "WorkSans-latin.woff2"));
      const missing = site.build();
      assert.notEqual(missing.status, 0, "Missing replacement font must fail a real build");
      assert.match(missing.stdout + missing.stderr, /Missing required font asset/);
    } finally {
      site.cleanup();
    }
  },
);

test("Fontsource assets reproduce exactly; Onest contains only the logo characters", async () => {
  const root = new URL("../", import.meta.url);
  const check = spawnSync(process.execPath, ["scripts/fonts.mjs", "--check"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(check.status, 0, check.stdout + check.stderr);
  const subsetFont = createRequire(import.meta.url)("subset-font");
  // Decode to SFNT without removing any glyphs, then inspect the real cmap.
  const sfnt: Buffer = await subsetFont(
    readFileSync(new URL("public/fonts/onest/benpreiss-700.woff2", root)),
    undefined,
    { targetFormat: "sfnt", keepAllGlyphs: true },
  );
  let cmap = -1;
  for (let i = 0; i < sfnt.readUInt16BE(4); i++) {
    const entry = 12 + i * 16;
    if (sfnt.toString("ascii", entry, entry + 4) === "cmap") cmap = sfnt.readUInt32BE(entry + 8);
  }
  assert.ok(cmap >= 0);
  const codes = new Set<number>();
  for (let i = 0; i < sfnt.readUInt16BE(cmap + 2); i++) {
    const start = cmap + sfnt.readUInt32BE(cmap + 4 + i * 8 + 4);
    const format = sfnt.readUInt16BE(start);
    if (format !== 4) continue; // BMP Unicode table covers all seven logo letters.
    const count = sfnt.readUInt16BE(start + 6) / 2;
    for (let segment = 0; segment < count; segment++) {
      const end = sfnt.readUInt16BE(start + 14 + segment * 2);
      const begin = sfnt.readUInt16BE(start + 16 + count * 2 + segment * 2);
      const delta = sfnt.readInt16BE(start + 16 + count * 4 + segment * 2);
      const rangeAt = start + 16 + count * 6 + segment * 2;
      const range = sfnt.readUInt16BE(rangeAt);
      for (let code = begin; code <= end; code++) {
        let glyph = range
          ? sfnt.readUInt16BE(rangeAt + range + 2 * (code - begin))
          : (code + delta) & 0xffff;
        if (range && glyph) glyph = (glyph + delta) & 0xffff;
        if (glyph) codes.add(code);
      }
    }
  }
  assert.deepEqual(
    [...codes].sort((a, b) => a - b),
    [...new Set("benpreiss")].map((letter) => letter.charCodeAt(0)).sort((a, b) => a - b),
  );
});
