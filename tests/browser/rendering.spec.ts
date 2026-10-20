import { expect, test } from "./support";

// These are controlled fixture routes, not the owner's editable homepage copy.
for (const route of ["/", "/hello", "/long", "/long-english"]) {
  for (const width of [390, 1440]) {
    test(`introduction ${route} at ${width}px preserves readable layout`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const intro = page.locator("main");
      const portrait = intro.getByRole("img").first();
      const prose = intro.locator("#start p").first().locator("..");
      await expect(prose.locator("p").first()).toBeVisible();
      const image = await portrait.boundingBox();
      const text = await prose.boundingBox();
      expect(image).not.toBeNull();
      expect(text).not.toBeNull();
      if (!image || !text) throw new Error("Introduction must be laid out");
      if (width < 768) {
        expect(image.y + image.height).toBeLessThanOrEqual(text.y);
        expect(Math.abs(image.x + image.width / 2 - width / 2)).toBeLessThan(2);
      } else {
        expect(image.x + image.width).toBeLessThanOrEqual(text.x);
        expect(Math.min(image.y + image.height, text.y + text.height)).toBeGreaterThan(
          Math.max(image.y, text.y),
        );
      }
      const naturalRatio = await portrait.evaluate(
        (element: HTMLImageElement) => element.naturalWidth / element.naturalHeight,
      );
      expect(image.width / image.height).toBeCloseTo(naturalRatio, 2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      // Evidence for review, not a pixel snapshot that freezes every design decision.
      await intro.screenshot({ path: testInfo.outputPath("introduction.png") });
    });
  }
}

test("Markdoc renders semantic prose without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/hello");
    const social = page.getByRole("link", { name: "Fixture social profile", exact: true });
    await expect(social).toHaveAttribute("href", "https://example.org/social");
    await expect(social).toHaveAttribute("target", "_blank");
    await expect(social).toHaveAttribute("rel", "noopener noreferrer");
    await expect(social.locator("img")).toHaveAttribute("src", "/social/github-black.svg");
    await expect(social.locator("img")).toHaveAttribute("alt", "");
    const prose = page.locator("#start p").first().locator("..");
    await expect(prose.locator("strong")).toHaveText("Strong fixture text");
    await expect(prose.locator("em")).toHaveText("Emphasized fixture text");
    await expect(prose.locator("br")).toHaveCount(1);
    await expect(prose.locator("em")).toHaveCSS("font-style", "italic");
    const weights = await prose.evaluate((element) => ({
      body: Number(getComputedStyle(element.querySelector("p")!).fontWeight),
      strong: Number(getComputedStyle(element.querySelector("strong")!).fontWeight),
    }));
    expect(weights.strong).toBeGreaterThan(weights.body);
    const paragraphs = prose.locator("p");
    const first = await paragraphs.nth(0).boundingBox();
    const second = await paragraphs.nth(1).boundingBox();
    if (!first || !second) throw new Error("Fixture paragraphs must be laid out");
    expect(second.y).toBeGreaterThan(first.y + first.height);
    await expect(prose.getByRole("link", { name: "Fixture link" })).toHaveAttribute(
      "href",
      "https://example.org/",
    );
  } finally {
    await context.close();
  }
});
