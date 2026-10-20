import { test, expect } from "./support";

for (const route of ["/", "/hello"]) {
  for (const width of [390, 1440]) {
    test(`technology buttons retain original interaction states: ${route} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const buttons = page.locator("#work article a[aria-label]:has(img)");
      expect(await buttons.count()).toBeGreaterThan(0);
      for (const button of await buttons.all()) {
        await button.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        await button.focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        await expect(button).toBeFocused();
        await expect(button).toHaveCSS("border-color", "rgb(33, 33, 33)");
        await expect(button).toHaveCSS("border-width", "1px");
        await expect(button).toHaveCSS("outline-style", "solid");
        await expect(button).toHaveCSS("outline-width", "3px");
        await expect(button).toHaveCSS("outline-color", "rgba(33, 33, 33, 0.2)");
        await expect(button).toHaveCSS("border-radius", "8px");
        await button.hover();
        await expect(button).toHaveCSS("background-color", "rgba(33, 33, 33, 0.05)");
        await page.mouse.down();
        await expect(button).toHaveCSS("background-color", "rgba(33, 33, 33, 0.1)");
        await expect(button).toHaveCSS("transform", "matrix(0.9, 0, 0, 0.9, 0, 0)");
        await page.mouse.move(0, 0);
        await page.mouse.up();
        await button.evaluate((element) => (element as HTMLElement).blur());
        await expect(button).toHaveCSS("border-color", "rgba(0, 0, 0, 0)");
        await expect(button).toHaveCSS("outline-color", "rgba(0, 0, 0, 0)");
      }
    });
  }
}
