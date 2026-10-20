import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const config = require("../tailwind.config.cjs");

test("composite typography provides all Penpot sizes/styles without paragraph margins", async () => {
  const sizes = { sm: 12.25, base: 14, lg: 15.75, xl: 17.5, "2xl": 21, "3xl": 26.25 };
  const weights = { regular: "400", semibold: "500", bold: "600", emphasis: "500" };
  const names = Object.keys(sizes).flatMap((size) =>
    Object.keys(weights).map((style) => `type-${size}-${style}`),
  );
  const result = await postcss([
    tailwind({
      ...config,
      content: [{ raw: [...names, "type-wordmark", "px-4", "py-2.5"].join(" ") }],
    }),
  ]).process("@tailwind components; @tailwind utilities;", { from: undefined });
  const rules = new Map<string, Record<string, string>>();
  result.root.walkRules(
    (rule: {
      selector: string;
      walkDecls: (visit: (decl: { prop: string; value: string }) => void) => void;
    }) => {
      const declarations: Record<string, string> = {};
      rule.walkDecls((decl) => {
        declarations[decl.prop] = decl.value;
      });
      rules.set(rule.selector, declarations);
    },
  );
  for (const [size, pixels] of Object.entries(sizes)) {
    for (const [style, weight] of Object.entries(weights)) {
      const rule = rules.get(`.type-${size}-${style}`)!;
      assert.ok(rule);
      assert.equal(rule["font-size"], `${pixels / 16}rem`);
      assert.equal(rule["font-weight"], weight);
      assert.equal(rule["font-style"], style === "emphasis" ? "italic" : "normal");
      assert.equal(rule["line-height"], "1.5");
      assert.match(rule["font-family"]!, /Work Sans/);
      assert.ok(Object.keys(rule).every((property) => !/margin|padding/.test(property)));
    }
  }
  assert.equal(rules.get(".type-wordmark")!["font-weight"], "700");
  assert.equal(rules.get(".px-4")!["padding-left"], "1rem");
  assert.equal(rules.get(".py-2\\.5")!["padding-top"], "0.625rem");
});
