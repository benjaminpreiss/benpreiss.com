import { test, expect } from "./support";

for (const route of ["/", "/hello"]) {
  test(`inline typography inherits responsive prose metrics: ${route}`, async ({ page }) => {
    await page.goto(route);
    const samples = [
      page.locator("#start p").first().locator(".."),
      page.locator("#work article p").first().locator(".."),
      page.locator('img[src="/thin-long-arrow-down.svg"]').locator("..").locator("div").first(),
    ];
    for (const sample of samples)
      await sample.evaluate((element) => element.setAttribute("data-typography-probe", ""));
    // Change only the surrounding typography, as a responsive asset would.
    // Inline emphasis must not pin the old size, family or line-height.
    await page.addStyleTag({
      content: `
      [data-typography-probe] { font-family: serif; font-size: 20px; line-height: 1.8; }
      @media (min-width: 768px) { [data-typography-probe] { font-size: 26px; } }
    `,
    });
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const sample of samples) {
        const surrounding = await sample.evaluate((element) => {
          const style = getComputedStyle(element);
          return { size: style.fontSize, family: style.fontFamily, line: style.lineHeight };
        });
        expect(surrounding.size).toBe(width < 768 ? "20px" : "26px");
        const inline = sample.locator("strong, em, a");
        expect(await inline.count()).toBeGreaterThan(0);
        for (const element of await inline.all()) {
          await expect(element).toHaveCSS("font-size", surrounding.size);
          await expect(element).toHaveCSS("font-family", surrounding.family);
          await expect(element).toHaveCSS("line-height", surrounding.line);
        }
        await expect(sample.locator("strong").first()).toHaveCSS("font-weight", "600");
        await expect(sample.locator("em").first()).toHaveCSS("font-weight", "500");
        await expect(sample.locator("em").first()).toHaveCSS("font-style", "italic");
      }
    }
  });
}
