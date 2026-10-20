import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createFixtureSite } from "./support/site.ts";

test(
  "navigation Markdoc targets authored page IDs and dangling links fail the build",
  { timeout: 60000 },
  () => {
    const site = createFixtureSite();
    try {
      const homepage = join(site.dir, "content/pages/en/home.mdoc");
      const navigation = join(site.dir, "content/navigation/en/navigation.mdoc");
      writeFileSync(homepage, readFileSync(homepage, "utf8").replace('id="work"', 'id="gallery"'));
      const nav = readFileSync(navigation, "utf8")
        .replace("Fixture brand", "Authored brand")
        .replace("Fixture work", "Authored gallery")
        .replace("#work", "#gallery");
      writeFileSync(navigation, nav);
      let result = site.build();
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const html = readFileSync(join(site.dir, "dist/hello/index.html"), "utf8");
      assert.match(html, /id="gallery"/);
      assert.match(html, /href="\/hello#gallery"/);
      assert.match(html, /Authored gallery/);
      assert.match(html, /Authored brand/);
      for (const label of [
        "Fixture language",
        "Fixture navigation",
        "Fixture mobile navigation",
        "Fixture menu",
      ]) {
        assert.ok(html.includes(`aria-label="${label}"`));
      }
      writeFileSync(navigation, nav.replace("#gallery", "#missing"));
      result = site.build();
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /Navigation links to missing section/);
      writeFileSync(navigation, nav.replace("  menu: Fixture menu\n", ""));
      result = site.build();
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /labels.menu|labels[\s\S]*menu/);
    } finally {
      site.cleanup();
    }
  },
);
