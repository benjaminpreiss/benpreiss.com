import { test, expect } from "./support";

for (const route of ["/", "/hello"]) {
  for (const width of [390, 1440]) {
    test(`original text-link focus and pressed styles: ${route} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      for (const [selector, rgb] of [
        ["#work article h2 + a", "33, 33, 33"],
        ["#work article p a", "33, 33, 33"],
        ['footer a[href$="privacy"]', "255, 255, 255"],
        ['#contact a[href$="privacy"]', "33, 33, 33"],
        ['#contact a[href^="mailto:"]', "33, 33, 33"],
        ['footer dd a[href^="mailto:"]', "255, 255, 255"],
      ]) {
        const link = page.locator(selector).first();
        await link.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        await link.focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        await expect(link).toBeFocused();
        await expect(link).toHaveCSS("background-color", `rgba(${rgb}, 0.05)`);
        // Tailwind's original outline-none keeps a transparent outline for forced colors.
        await expect(link).toHaveCSS("outline-color", "rgba(0, 0, 0, 0)");
        const brackets = await link.evaluate((element) =>
          ["::before", "::after"].map((pseudo) => {
            const style = getComputedStyle(element, pseudo);
            return {
              content: style.content,
              padding: style.padding,
              left: style.marginLeft,
              right: style.marginRight,
              top: style.borderTopWidth,
              color: style.borderTopColor,
              open: pseudo === "::before" ? style.borderRightColor : style.borderLeftColor,
            };
          }),
        );
        for (const bracket of brackets) {
          expect(bracket).toEqual({
            content: '""',
            padding: "2px",
            left: "-3px",
            right: "-3px",
            top: "1px",
            color: `rgb(${rgb})`,
            open: "rgba(0, 0, 0, 0)",
          });
        }
        await link.hover();
        await expect(link).toHaveCSS("text-decoration-line", "none");
        await expect(link).toHaveCSS("border-bottom-color", `rgb(${rgb})`);
        await expect(link).toHaveCSS("color", `rgb(${rgb})`);
        await page.mouse.down();
        await expect(link).toHaveCSS("background-color", `rgba(${rgb}, 0.1)`);
        // Release away from the link so this regression test never follows it.
        await page.mouse.move(0, 0);
        await page.mouse.up();
        await link.evaluate((element) => (element as HTMLElement).blur());
        await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        expect(
          await link.evaluate((element) => getComputedStyle(element, "::before").content),
        ).toBe("none");
      }
    });
  }
}
