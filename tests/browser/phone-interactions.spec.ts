import { test, expect } from "./support";

for (const route of ["/", "/hello"]) {
  for (const width of [390, 1440]) {
    test(`phone hover, focus and honest copy feedback: ${route} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: (value: string) => {
              if (value !== "+12025550123") throw new Error("Wrong phone number");
              return new Promise<void>((resolve) => {
                document.addEventListener("test-copy-complete", () => resolve(), { once: true });
              });
            },
          },
        });
      });
      await page.goto(route);
      const contact = page.locator("#contact");
      const phone = contact.locator('a[href^="tel:"]');
      const copy = contact.getByRole("button", {
        name: route === "/" ? "Telefonnummer kopieren" : "Copy phone number",
      });
      await phone.hover();
      await expect(phone).toHaveCSS("background-color", "rgb(239, 239, 239)");
      await phone.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(phone).toBeFocused();
      await expect(phone).toHaveCSS("outline-width", "3px");
      await expect(phone).toHaveCSS("outline-color", "rgba(33, 33, 33, 0.2)");
      await page.keyboard.press("Tab");
      await expect(copy).toBeFocused();
      await expect(copy).toHaveCSS("border-color", "rgb(33, 33, 33)");
      await expect(copy).toHaveCSS("outline-width", "3px");
      await expect(copy).toHaveCSS("outline-color", "rgba(33, 33, 33, 0.2)");
      const hint = contact.locator("[data-copy-hint]");
      const confirmation = contact.locator("[data-copy-confirmation]");
      await expect(hint).toHaveCSS("opacity", "1");
      await copy.hover();
      await expect(copy).toHaveCSS("background-color", "rgba(33, 33, 33, 0.05)");
      await page.mouse.down();
      await expect(copy).toHaveCSS("transform", "matrix(0.9, 0, 0, 0.9, 0, 0)");
      await expect(confirmation).toHaveCSS("opacity", "0");
      await page.mouse.up();
      await expect(copy).toBeDisabled();
      await expect(contact.getByRole("status")).toBeEmpty();
      await expect(confirmation).toHaveCSS("opacity", "0");
      await page.evaluate(() => document.dispatchEvent(new Event("test-copy-complete")));
      await expect(copy).toBeEnabled();
      await expect(copy).toBeFocused();
      await expect(confirmation).toHaveCSS("opacity", "1");
      await expect(contact.getByRole("status")).toContainText(
        route === "/" ? "... Kopiert" : "Phone number copied",
      );
      await expect(confirmation).toHaveCSS("opacity", "0", { timeout: 3000 });
      await expect(hint).toHaveCSS("opacity", "1");
    });
  }
}
