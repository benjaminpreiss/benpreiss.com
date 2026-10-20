import { test, expect } from "./support";

for (const route of ["/", "/hello", "/privacy", "/en/privacy"]) {
  for (const width of [390, 768, 1440]) {
    test(`footer columns at ${width}px on ${route}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const footer = page.locator("footer");
      const headings = footer.getByRole("heading", { level: 2 });
      await expect(headings).toHaveCount(3);
      const links = await headings.nth(0).boundingBox();
      const imprint = await headings.nth(2).boundingBox();
      if (!links || !imprint) throw new Error("Footer headings must be laid out");
      if (width >= 768) {
        expect(imprint.x).toBeGreaterThan(links.x + links.width);
        expect(Math.abs(imprint.y - links.y)).toBeLessThan(1);
        const privacy = await footer.locator('a[href$="privacy"]').boundingBox();
        const details = await footer.locator("dl").boundingBox();
        if (!privacy || !details) throw new Error("Footer sections must be laid out");
        // Inline text ink sits inside the paragraph line box: compare its parent.
        const paragraph = await footer.locator('p:has(> a[href$="privacy"])').boundingBox();
        if (!paragraph) throw new Error("Privacy paragraph must be laid out");
        expect(Math.abs(paragraph.y + paragraph.height - details.y - details.height)).toBeLessThan(
          1,
        );
      } else {
        expect(imprint.y).toBeGreaterThan(links.y + links.height);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      await footer.screenshot({ path: testInfo.outputPath("footer.png") });
    });
  }
}
