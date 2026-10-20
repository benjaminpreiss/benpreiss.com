import { test, expect } from "./support";

for (const route of ["/", "/hello"]) {
  test(`mouse clicks do not leave focus decoration; Tab restores it: ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => {} },
      });
      document.addEventListener("click", (event) => {
        if ((event.target as Element).closest("a")) event.preventDefault();
      });
    });
    await page.goto(route);
    const selectors = [
      "#work article h2 + a",
      "#work article p a",
      "#work article a[aria-label]:has(img)",
      '#contact a[href$="privacy"]',
      '#contact a[href^="tel:"]',
      "#contact button[aria-label]",
      'footer a[href$="privacy"]',
      "footer a[aria-label]:has(img)",
    ];
    for (const selector of selectors) {
      const control = page.locator(selector).first();
      await control.click();
      await page.mouse.move(0, 0);
      await expect(control).toBeFocused();
      const pointer = await control.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          visible: element.matches(":focus-visible"),
          outlineHidden:
            style.outlineStyle === "none" ||
            style.outlineWidth === "0px" ||
            style.outlineColor === "rgba(0, 0, 0, 0)",
          before: getComputedStyle(element, "::before").content,
          after: getComputedStyle(element, "::after").content,
        };
      });
      expect(pointer).toEqual({
        visible: false,
        outlineHidden: true,
        before: "none",
        after: "none",
      });
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(control).toBeFocused();
      expect(await control.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
      // Each control must show either its custom brackets or a nontransparent outline.
      expect(
        await control.evaluate((element) => {
          const style = getComputedStyle(element);
          return (
            getComputedStyle(element, "::before").content === '""' ||
            (style.outlineStyle !== "none" &&
              style.outlineWidth !== "0px" &&
              style.outlineColor !== "rgba(0, 0, 0, 0)")
          );
        }),
      ).toBe(true);
    }
  });
}
