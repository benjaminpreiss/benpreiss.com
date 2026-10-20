import { test, expect } from "./support";

for (const locale of ["de", "en"] as const) {
  for (const width of [390, 1440]) {
    test(`${locale} privacy and footer at ${width}px work without JavaScript`, async ({
      browser,
      baseURL,
    }, testInfo) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        baseURL,
        viewport: { width, height: 900 },
      });
      try {
        const page = await context.newPage();
        const home = locale === "de" ? "/" : "/hello";
        const privacy = locale === "de" ? "/privacy" : "/en/privacy";
        await page.goto(home);
        await page
          .locator("#contact")
          .getByRole("link", { name: locale === "de" ? "Datenschutzerklärung" : "privacy policy" })
          .click();
        await expect(page).toHaveURL(`${baseURL}${privacy}`);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("article h1")).toHaveText(
          locale === "de" ? "Datenschutzprobe" : "Privacy fixture",
        );
        const legal = page.locator("main article:has(> h1)");
        await expect(legal).toHaveCSS("column-count", "auto");
        const sections = legal.locator(".legal-section");
        await expect(sections).toHaveCount(3);
        await expect(legal).toHaveCSS("counter-reset", "legal-section 0");
        await expect(sections.first().locator("h2")).toHaveCount(2);
        for (const heading of await legal.locator("h2").all()) {
          await expect(heading).toHaveCSS("counter-increment", "legal-section 1");
          expect(
            await heading.evaluate((element) => getComputedStyle(element, "::before").content),
          ).toBe('counter(legal-section) ". "');
        }
        const boxes = await sections.evaluateAll((elements) =>
          elements.map((element) => {
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y, bottom: rect.bottom };
          }),
        );
        if (width >= 1024) {
          await expect(legal).toHaveCSS("display", "grid");
          await expect(sections.first()).toHaveCSS("column-count", "2");
          await expect(sections.nth(1)).toHaveCSS("column-count", "auto");
          const flow = legal.locator(":scope > div");
          await expect(flow).toHaveCSS("column-count", "2");
          await expect(flow.locator(".legal-section")).toHaveCount(2);
          expect((await flow.boundingBox())!.y).toBeGreaterThan(boxes[0]!.bottom);
        } else {
          await expect(sections.first()).toHaveCSS("column-count", "auto");
          expect(boxes[0]!.x).toBe(boxes[1]!.x);
          expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.bottom);
        }
        await expect(page.locator("footer")).toContainText(
          locale === "de" ? "Impressum" : "Imprint",
        );
        await expect(page.locator(`footer a[href="${privacy}"]`)).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        ).toBe(true);
        await page.screenshot({
          path: testInfo.outputPath(`privacy-${locale}-${width}.png`),
          fullPage: true,
        });

        const languagePanel = width < 768 ? ".mobile-menu" : ".language-switcher";
        await page.locator(`${languagePanel} summary`).click();
        const prefix = width < 768 ? ".mobile-menu" : "header > nav";
        const other = locale === "de" ? "en" : "de";
        const translated = page.locator(`${languagePanel} a[hreflang="${other}"]`);
        await translated.focus();
        await translated.press("Enter");
        await expect(page.locator("html")).toHaveAttribute("lang", other);
        await expect(page).toHaveURL(
          new RegExp(`${other === "en" ? "/en/privacy" : "/privacy"}#dse_structure_ueberschrift$`),
        );
        if (width < 768) await page.locator(".mobile-menu summary").click();
        await page.locator(`${prefix} a[href$="#work"]`).click();
        await expect(page).toHaveURL(new RegExp(`${other === "en" ? "/hello" : "/"}#work$`));
        await expect(page.locator("#work")).toBeVisible();
      } finally {
        await context.close();
      }
    });
  }
}

test("unknown paths have an accessible bilingual 404, not a homepage fallback", async ({
  page,
}) => {
  const response = await page.goto("/unknown-%C3%A4");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("404");
  await expect(page.locator('section[lang="en"]')).toContainText("Page not found");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
