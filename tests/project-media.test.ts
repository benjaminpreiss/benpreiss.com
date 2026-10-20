import assert from "node:assert/strict";
import { test } from "node:test";
import { projectRecordingSchema } from "../src/lib/project-media.ts";
import { sharedContentSchema, validateSharedContent } from "../src/lib/shared-content.ts";

test("recording attributes validate paths, URLs, dimensions and required formats", () => {
  validateSharedContent();
  const valid = {
    width: 320,
    height: 640,
    poster: "/fixture.jpg",
    webm: "/fixture.webm",
    mp4: "https://example.org/fixture.mp4",
  };
  assert.ok(projectRecordingSchema.safeParse(valid).success);
  for (const change of [
    { width: 0 },
    { height: 1.5 },
    { poster: "javascript:alert(1)" },
    { webm: "//external.test/clip" },
    { mp4: undefined },
  ]) {
    assert.equal(projectRecordingSchema.safeParse({ ...valid, ...change }).success, false);
  }
});

test("HLS recordings require an explicit HTTPS manifest and cannot mix source modes", () => {
  const valid = {
    width: 738,
    height: 1322,
    poster: "/poster.jpg",
    hls: "https://media.example.test/index.m3u8",
  };
  assert.ok(projectRecordingSchema.safeParse(valid).success);
  for (const change of [
    { hls: "http://media.example.test/index.m3u8" },
    { hls: "https://media.example.test/video.mp4" },
    { hls: "javascript:alert(1)" },
    { hls: undefined },
    { mp4: "/local.mp4" },
    { webm: "/local.webm" },
    { width: 0 },
  ])
    assert.equal(projectRecordingSchema.safeParse({ ...valid, ...change }).success, false);
});

test("shared-content schemas reject invalid buttons and incomplete translations", () => {
  const buttons = sharedContentSchema.shape.buttons;
  const valid = {
    sample: {
      label: "Fixture button",
      href: "https://example.org/",
      icon: "/sample.svg",
      size: "small",
    },
  };
  assert.ok(buttons.safeParse(valid).success);
  for (const change of [
    { href: "javascript:alert(1)" },
    { label: " " },
    { size: "arbitrary-css" },
    { icon: "//external.test/icon.svg" },
  ]) {
    assert.equal(buttons.safeParse({ sample: { ...valid.sample, ...change } }).success, false);
  }
  assert.equal(sharedContentSchema.shape.ui.safeParse({ en: {} }).success, false);
});
