import assert from "node:assert/strict";
import { test } from "node:test";
import {
  navigationLinks,
  sectionIds,
  translationLinks,
  validateNavigationHref,
} from "../src/lib/navigation.ts";
import type { PageData } from "../src/lib/pages.ts";

const german: PageData = {
  permalink: "/",
  locale: "de",
  translationKey: "home",
  title: "Fixture",
  description: "Fixture description",
};
const english: PageData = { ...german, permalink: "/hello", locale: "en" };
const pages = [
  { data: german, sectionIds: ["intro", "portfolio"] },
  { data: english, sectionIds: ["intro", "portfolio", "extra"] },
  { data: { ...english, permalink: "/legal", translationKey: "privacy" }, sectionIds: [] },
];
test("translation pairs preserve only the target page's authored IDs", () => {
  assert.deepEqual(translationLinks(german, pages, "portfolio"), [
    { locale: "de", href: "/#portfolio" },
    { locale: "en", href: "/hello#portfolio" },
  ]);
  assert.equal(translationLinks(english, pages, "extra")[0]?.href, "/");
  assert.equal(translationLinks(german, [pages[0]!]).length, 1);
});
test("section identities come from Markdoc and duplicate IDs fail", () => {
  assert.deepEqual(
    sectionIds(
      '{% Intro id="intro" %}Hello{% /Intro %}\n{% Projects id="portfolio" %}{% /Projects %}',
    ),
    ["intro", "portfolio"],
  );
  assert.throws(
    () => sectionIds('{% Intro id="same" /%}\n{% Projects id="same" /%}'),
    /Duplicate section id/,
  );
  assert.throws(() => sectionIds('{% Intro id="invalid id" /%}'), /Invalid section id/);
});
test("navigation Markdoc controls labels, order, explicit destinations and disabled items", () => {
  assert.deepEqual(
    navigationLinks(
      "- [Portfolio](#portfolio)\n- [Start](/hello#intro)\n- Coming later",
      "/",
      pages,
    ),
    [
      { label: "Portfolio", href: "#portfolio" },
      { label: "Start", href: "/hello#intro" },
      { label: "Coming later" },
    ],
  );
  for (const href of ["/#missing", "/missing", "javascript:alert(1)", "//example.org/"]) {
    assert.throws(() => validateNavigationHref(href, "/", pages));
  }
  assert.throws(() => navigationLinks("Not a list", "/", pages), /one Markdown list/);
  assert.throws(
    () => navigationLinks("- [A](#intro) and [B](#portfolio)", "/", pages),
    /one label or link/,
  );
});
