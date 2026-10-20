import { test, expect } from "./support";

for (const locale of ["de", "en"] as const) {
  for (const width of [390, 1440]) {
    test(`${locale} contact at ${width}px: unavailable without submission`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(locale === "de" ? "/" : "/hello");
      const contact = page.locator("#contact");
      await contact.scrollIntoViewIfNeeded();
      await expect(
        contact.getByRole("button", { name: locale === "de" ? "Bald verfügbar" : "Coming soon" }),
      ).toBeDisabled();
      for (const name of ["Name", "E-Mail", locale === "de" ? "Deine Nachricht" : "Your Message"]) {
        const input = contact.getByRole("textbox", { name, exact: true });
        await expect(input).toBeDisabled();
        await expect(input).toHaveCSS("opacity", "1");
        expect(await input.evaluate((element) => (element as HTMLInputElement).form)).toBeNull();
      }
      const requests: string[] = [];
      page.on("request", (request) => {
        if (request.method() !== "GET") requests.push(request.url());
      });
      await contact.evaluate((element) => {
        element.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        element
          .querySelector("button[disabled]")
          ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      await page.keyboard.press("Enter");
      expect(requests).toEqual([]);
      await expect(contact.locator("form")).toHaveCount(0);
      await expect(contact.locator('a[href^="tel:"]')).toHaveAttribute("href", "tel:+12025550123");
      await expect(
        contact.getByRole("link", {
          name: locale === "de" ? "Datenschutzerklärung" : "privacy policy",
        }),
      ).toHaveAttribute("href", locale === "de" ? "/privacy" : "/en/privacy");
      await expect(contact).not.toContainText(
        locale === "de" ? "Mail erfolgreich" : "Successfully sent",
      );
      await expect(contact).toHaveCSS("padding-top", "208px");
      await page.screenshot({
        path: testInfo.outputPath(`contact-${locale}-${width}.png`),
        fullPage: false,
      });
    });
  }

  for (const outcome of ["success", "rejected", "missing"]) {
    test(`${locale} clipboard ${outcome}`, async ({ page }) => {
      await page.addInitScript((result) => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value:
            result === "missing"
              ? undefined
              : {
                  writeText: async (value: string) => {
                    if (value !== "+12025550123") throw new Error("Unexpected phone number");
                    if (result === "rejected") throw new Error("Denied");
                  },
                },
        });
      }, outcome);
      await page.goto(locale === "de" ? "/" : "/hello");
      const contact = page.locator("#contact");
      const button = contact.getByRole("button", {
        name: locale === "de" ? "Telefonnummer kopieren" : "Copy phone number",
      });
      await button.focus();
      await page.keyboard.press("Enter");
      await expect(contact.getByRole("status")).toContainText(
        outcome === "success"
          ? locale === "de"
            ? "... Kopiert"
            : "Phone number copied"
          : locale === "de"
            ? "Kopieren nicht möglich"
            : "Could not copy",
      );
      await expect(button).toBeFocused();
      if (outcome !== "success") {
        await expect(contact.locator("[data-copy-confirmation]")).toHaveCSS("opacity", "0");
        await expect(contact.getByRole("status")).toBeVisible();
      }
      await expect(contact.locator('a[href^="tel:"]')).toBeVisible();
    });
  }

  test(`${locale} no-JS contact remains safe`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:44321${locale === "de" ? "/" : "/hello"}`);
    const contact = page.locator("#contact");
    await expect(contact.locator("input:disabled, textarea:disabled")).toHaveCount(3);
    await expect(contact.locator("form")).toHaveCount(0);
    await expect(contact.locator("button")).toHaveCount(1);
    await expect(contact.locator('a[href^="tel:"]')).toHaveText("+1 202 555 0123");
    await context.close();
  });
}
