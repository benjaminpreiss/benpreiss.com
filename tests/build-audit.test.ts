import assert from "node:assert/strict";
import test from "node:test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { auditBuild } from "../scripts/audit-build.ts";
import { createFixtureSite } from "./support/site.ts";

test("build audit rejects missing local videos instead of deferring them", () => {
  const site = createFixtureSite();
  try {
    const output = join(site.dir, "public");
    for (const extension of ["mp4", "webm"]) {
      writeFileSync(join(output, "index.html"), `<video src="/missing.${extension}"></video>`);
      assert.throws(() => auditBuild(output), /Broken internal link or asset/);
    }
  } finally {
    site.cleanup();
  }
});

test("build audit accepts existing synthetic file sources and remote HLS links", () => {
  const site = createFixtureSite();
  try {
    const output = join(site.dir, "public");
    writeFileSync(
      join(output, "index.html"),
      '<a href="https://example.org/video/index.m3u8">HLS</a>' +
        '<video src="/fixture-mobile.webm"></video>' +
        '<a href="/fixture-desktop.mp4">File recording</a>',
    );
    assert.doesNotThrow(() => auditBuild(output));
  } finally {
    site.cleanup();
  }
});
