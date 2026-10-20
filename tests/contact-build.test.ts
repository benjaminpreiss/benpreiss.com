import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createFixtureSite } from "./support/site.ts";

test(
  "Markdoc owns contact input labels, placeholders and order; invalid controls fail",
  { timeout: 60000 },
  () => {
    const site = createFixtureSite();
    try {
      const path = join(site.dir, "content/pages/en/home.mdoc");
      const original = readFileSync(path, "utf8");
      const name = original.match(/{% ContactInput id="contact-name"[\s\S]*?\/%}/)![0];
      const email = original.match(/{% ContactInput id="contact-email"[\s\S]*?\/%}/)![0];
      const edited = original
        .replace(
          `${name}\n${email}`,
          `${email}\n${name.replace('label="Name"', 'label="Your full name" placeholder="Alex Example"')}`,
        )
        .replace('copy="Copy phone number"', 'copy="Copy fixture phone"')
        .replace('unavailable="Coming soon"', 'unavailable="Fixture unavailable"')
        .replace("This is not a newsletter sign up form.", "Fixture footnote.")
        .replace("[privacy policy](/en/privacy)", "[Fixture privacy](/privacy?source=fixture)");
      assert.notEqual(edited, original);
      writeFileSync(path, edited);
      let result = site.build();
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const html = readFileSync(join(site.dir, "dist/hello/index.html"), "utf8");
      assert.match(html, /for="contact-name"[^>]*>Your full name<\/label>/);
      assert.match(html, /placeholder="Alex Example"/);
      assert.ok(html.indexOf('id="contact-email"') < html.indexOf('id="contact-name"'));
      assert.match(html, /<fieldset[^>]*disabled/);
      assert.doesNotMatch(html, /<form\b|\/api\/mail/);
      assert.match(html, /Copy fixture phone/);
      assert.match(html, /Fixture unavailable/);
      assert.doesNotMatch(
        html,
        /data-error-|data-contact-error|aria-busy=|Successfully sent email/,
      );
      assert.match(html, /Fixture footnote\./);
      assert.match(html, /href="\/privacy\?source=fixture"/);

      writeFileSync(path, edited.replace('type="email"', 'type="submit"'));
      result = site.build();
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /type|submit/);

      for (const attribute of [
        'copy="Copy fixture phone"',
        'unavailable="Fixture unavailable"',
        'label="Your full name"',
      ]) {
        writeFileSync(path, edited.replace(attribute, attribute.replace(/="[^"]*"/, '=""')));
        result = site.build();
        assert.notEqual(result.status, 0, `Empty ${attribute} must fail`);
      }
    } finally {
      site.cleanup();
    }
  },
);
