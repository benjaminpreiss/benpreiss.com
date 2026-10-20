import { test, expect } from "./support";

for (const [width, height] of [
  [320, 568],
  [390, 844],
  [667, 375],
]) {
  for (const route of ["/", "/hello"]) {
    test(`mobile menu layout: ${route} at ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(route);
      const brand = page.locator(".brand");
      const menu = page.locator(".mobile-menu");
      const toggle = menu.locator("summary");
      await expect(page.locator(".language-switcher summary")).toBeHidden();
      await expect(toggle.locator('img[src="/iconoir/mobile-menu.svg"]')).toBeVisible();
      const brandBox = await brand.boundingBox();
      const toggleBox = await toggle.boundingBox();
      await toggle.click();
      await expect(brand).toBeVisible();
      expect(await brand.boundingBox()).toEqual(brandBox);
      expect(await toggle.boundingBox()).toEqual(toggleBox);
      await expect(toggle.locator('img[src="/iconoir/language-close.svg"]')).toBeVisible();
      await expect(toggle.locator('img[src="/iconoir/mobile-menu.svg"]')).toBeHidden();
      const fontStart = await brand.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect().x;
      });
      const firstLabel = menu.locator("[data-nav-label]").first();
      const firstBox = (await firstLabel.boundingBox())!;
      expect(firstBox.x).toBeCloseTo(fontStart, 0);
      expect(firstBox.y).toBeGreaterThan(height * 0.2);
      expect(firstBox.y).toBeLessThan(height * 0.4);
      const current = menu.locator('[aria-current="page"]');
      const alternatives = menu.locator("a[hreflang]");
      await expect(current).toHaveText(route === "/" ? "de" : "en");
      await expect(alternatives).toHaveCount(1);
      await expect(current).not.toHaveAttribute("href");
      const currentBox = (await current.boundingBox())!;
      const otherBox = (await alternatives.first().boundingBox())!;
      expect(currentBox.y).toBeCloseTo(otherBox.y, 0);
      expect(currentBox.x).toBeGreaterThan(otherBox.x + otherBox.width);
      expect(currentBox.x + currentBox.width).toBeCloseTo(width - 24, 0);
      expect(otherBox.y + otherBox.height).toBeCloseTo(height - 24, 0);
      for (const label of [alternatives.first().locator("[data-nav-label]")]) {
        const start = await label.evaluate((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return range.getBoundingClientRect().x;
        });
        expect(start).toBeCloseTo(fontStart, 0);
      }
      await brand.click();
      await expect(menu).not.toHaveAttribute("open");
      await expect(page.locator("main")).not.toHaveAttribute("inert");
    });
  }
}
