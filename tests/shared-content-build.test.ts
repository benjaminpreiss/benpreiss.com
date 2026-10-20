import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createFixtureSite } from "./support/site.ts";

test(
  "shared JSON edits render without component changes and invalid translations fail the build",
  { timeout: 60000 },
  () => {
    const site = createFixtureSite();
    try {
      const file = (name: string) => join(site.dir, "content", name);
      const buttons = JSON.parse(readFileSync(file("technology-buttons.json"), "utf8"));
      buttons.figma.label = "Fixture design tool";
      buttons.figma.href = "https://example.org/design-tool";
      writeFileSync(file("technology-buttons.json"), JSON.stringify(buttons));
      const ui = JSON.parse(readFileSync(file("ui.json"), "utf8"));
      ui.en.video.open = "Fixture recording link";
      writeFileSync(file("ui.json"), JSON.stringify(ui));
      let result = site.build();
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const html = readFileSync(join(site.dir, "dist/hello/index.html"), "utf8");
      assert.match(html, /aria-label="Fixture design tool"/);
      assert.match(html, /href="https:\/\/example.org\/design-tool"/);
      assert.match(html, /Fixture recording link/);

      delete ui.en.video.play;
      writeFileSync(file("ui.json"), JSON.stringify(ui));
      result = site.build();
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /Invalid shared JSON content/);
      assert.match(result.stdout + result.stderr, /play/);
    } finally {
      site.cleanup();
    }
  },
);
