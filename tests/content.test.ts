import assert from "node:assert/strict";
import { test } from "node:test";
import { pageSchema, validatePages } from "../src/lib/pages.ts";
import { normalizeMarkdoc } from "../scripts/markdoc-hygiene.ts";

const valid = {
  permalink: "/",
  locale: "de",
  translationKey: "home",
  title: "Ben Preiss",
  description: "Fixture description",
};
test("metadata is explicit and independent of path prefixes", () => {
  assert.equal(pageSchema.parse({ ...valid, permalink: "/about", locale: "en" }).locale, "en");
  assert.equal(pageSchema.parse({ ...valid, permalink: "/en", locale: "de" }).locale, "de");
});
test("invalid metadata fixtures are rejected", () => {
  for (const patch of [
    { locale: "fr" },
    { locale: undefined },
    { translationKey: "" },
    { translationKey: undefined },
    { permalink: undefined },
    { permalink: "en" },
    { permalink: "//en" },
    { permalink: "/en/" },
    { permalink: "/404" },
    { permalink: "/en?x=1" },
    { permalink: "/a/../b" },
    { title: "" },
    { description: "" },
    { description: undefined },
    { typo: true },
  ]) {
    assert.equal(
      pageSchema.safeParse({ ...valid, ...patch }).success,
      false,
      JSON.stringify(patch),
    );
  }
});
test("route and translation collisions name both documents", () => {
  const first = { id: "de/home", data: pageSchema.parse(valid) };
  assert.throws(
    () => validatePages([first, { id: "en/home", data: { ...first.data, locale: "en" } }]),
    /en\/home: duplicate permalink.*de\/home/,
  );
  assert.throws(
    () => validatePages([first, { id: "de/other", data: { ...first.data, permalink: "/other" } }]),
    /duplicate translation identity/,
  );
});
test("Markdoc hygiene is idempotent and preserves intentional hard breaks", () => {
  const formatted = normalizeMarkdoc("hello  \r\nworld\r\n\r\n");
  assert.equal(formatted, "hello  \nworld\n");
  assert.equal(normalizeMarkdoc(formatted), formatted);
});
