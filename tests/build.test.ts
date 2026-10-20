import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createFixtureSite } from "./support/site.ts";

test(
  "real renderer accepts fixture prose and rejects invalid content contracts",
  { timeout: 120000 },
  () => {
    const site = createFixtureSite();
    try {
      let result = site.build();
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const german = readFileSync(join(site.dir, "dist/index.html"), "utf8");
      const english = readFileSync(join(site.dir, "dist/hello/index.html"), "utf8");
      assert.match(german, /lang="de"/);
      assert.match(english, /lang="en"/);
      assert.match(english, /alt="Fixture portrait"/);
      assert.match(english, /width="477"/);
      assert.match(english, /height="595"/);
      assert.match(english, /href="\/fixture-mobile.mp4"/);
      assert.match(english, /background-color:#869B86/);
      assert.match(german, /href="\/hello#start"/);
      // These literals belong to tests/fixtures, never the owner's live copy.
      assert.match(english, /<strong>Strong fixture text<\/strong>/);
      assert.match(english, /<em>Emphasized fixture text<\/em>/);
      assert.match(english, /<br\s*\/?\s*>/);
      assert.match(english, /href="https:\/\/example.org\/"/);

      const document = join(site.dir, "content/pages/en/home.mdoc");
      const original = readFileSync(document, "utf8");
      for (const [source, expected] of [
        [original.replace("locale: en", "locale: fr"), /locale/],
        [original.replace("translationKey: home\n", ""), /translationKey/],
        [original.replace("permalink: /hello", "permalink: /"), /duplicate permalink/],
        [original.replace("locale: en", "locale: de"), /duplicate translation identity/],
        [original + "\n{% UnknownTag /%}\n", /Undefined tag|UnknownTag/],
        [original.replace('color="#869B86"', 'color="bg-invalid"'), /color/],
        [original.replace('"width":632', '"width":0'), /recording/],
        [original.replace("/fixture-mobile.webm", "javascript:alert(1)"), /recording/],
        [original.replace(/desktop=\{[^}]+\}/, ""), /desktop/],
        [original.replace('names=["figma", "nextjs"]', 'names=["unknown"]'), /button/],
        [original.replace('href="https://example.org/"', 'href="javascript:alert(1)"'), /href/],
        [original.replace('title="Fixture project"', 'title=""'), /title/],
        [original.replace('alt="Fixture portrait"', 'alt=""'), /alt/],
        [original.replace('src="/profile-pic.jpg"', 'src="javascript:alert(1)"'), /src/],
        [original.replace("width=477", "width=0"), /dimensions/],
        [original.replace("height=595", "height=1.5"), /dimensions/],
        [original.replace('label="Fixture booking"', 'label=""'), /label/],
        [
          original.replace(
            'href="https://example.org/booking#fixture-token="',
            'href="javascript:alert(1)"',
          ),
          /href/,
        ],
        [
          original.replace('icon="/iconoir/video-camera.svg"', 'icon="//example.org/icon.svg"'),
          /icon/,
        ],
      ] as const) {
        writeFileSync(document, source);
        result = site.build();
        assert.notEqual(result.status, 0, `Expected build failure: ${source}`);
        assert.match(result.stdout + result.stderr, expected);
      }
    } finally {
      site.cleanup();
    }
  },
);
