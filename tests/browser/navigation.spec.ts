import { expect, test } from "./support";

for (const [route, locale, otherLocale] of [
  ["/", "de", "en"],
  ["/hello", "en", "de"],
] as const) {
  test(`${locale} navigation and translation links work without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
      viewport: { width: 390, height: 844 },
    });
    try {
      const page = await context.newPage();
      await page.goto(route);
      await page.locator(".mobile-menu summary").click();
      const translation = page.locator(`.mobile-menu a[hreflang="${otherLocale}"]`);
      await translation.focus();
      await translation.click();
      await expect(page.locator("html")).toHaveAttribute("lang", otherLocale);
      await expect(page).toHaveURL(/#start$/);
    } finally {
      await context.close();
    }
  });

  test(`${locale} menu supports keyboard, focus return and responsive changes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    // Wait for Astro's public hydration event before testing enhanced behavior.
    await page
      .locator("astro-island")
      .first()
      .evaluate(async (island) => {
        if (island.hasAttribute("ssr"))
          await new Promise<void>((resolve) =>
            island.addEventListener("astro:hydrate", () => resolve(), { once: true }),
          );
      });
    const menu = page.locator(".mobile-menu");
    const toggle = menu.locator("summary");
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("open", "");
    await expect(page.locator("main")).toHaveAttribute("inert", "");
    await expect(page.locator("footer")).toHaveAttribute("inert", "");
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator(".brand")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(menu.locator("a[hreflang]").last()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator(".brand")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).not.toHaveAttribute("open");
    await expect(toggle).toBeFocused();
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    await expect(page.locator("footer")).not.toHaveAttribute("inert");
    await toggle.click();
    await menu.locator('a[href$="#start"]').first().click();
    await expect(menu).not.toHaveAttribute("open");
    await expect(page).toHaveURL(/#start$/);
    await toggle.click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(menu).not.toHaveAttribute("open");
    await expect(page.locator("header > a")).toBeFocused();
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(toggle).toBeVisible();
    await expect(menu).not.toHaveAttribute("open");
  });
}

for (const width of [390, 1440]) {
  test(`navigation stays sticky without a shadow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 400 });
    await page.goto("/long-english");
    const header = page.locator("header");
    await expect(header).toHaveCSS("position", "sticky");
    await expect(header).toHaveCSS("height", width >= 768 ? "88px" : "68px");
    await expect(header).toHaveCSS("padding-top", width >= 768 ? "24px" : "10px");
    await expect(header).toHaveCSS("padding-left", width >= 768 ? "144px" : "16px");
    await expect(header).toHaveCSS("padding-right", width >= 768 ? "144px" : "8px");
    expect((await header.boundingBox())?.width).toBe(width);
    await expect(header).toHaveCSS("box-shadow", "none");
    await page.evaluate(() => window.scrollTo(0, 150));
    await expect(header).toHaveCSS("box-shadow", "none");
    expect((await header.boundingBox())?.y).toBe(0);
  });
}

test("navigation only links to existing section destinations", async ({ page }) => {
  await page.goto("/hello");
  const fragments = await page
    .locator('header a[href*="#"]')
    .evaluateAll((links) =>
      links.map((link) => new URL((link as HTMLAnchorElement).href).hash.slice(1)),
    );
  expect(fragments.length).toBeGreaterThan(0);
  for (const fragment of fragments) await expect(page.locator(`[id="${fragment}"]`)).toHaveCount(1);
});

test("browser language does not redirect an explicitly localized route", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ baseURL, locale: "en-US" });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page).toHaveURL(`${baseURL}/`);
  } finally {
    await context.close();
  }
});
