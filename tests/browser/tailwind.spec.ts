import { test, expect } from "./support";

for (const width of [390, 768, 769, 1440]) {
  test(`Tailwind prose and video layout at ${width}px`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
      viewport: { width, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto("/hello");
      await expect(page.locator("html")).toHaveCSS("color", "rgb(33, 33, 33)");
      // Font tuning must not scale rem-based widths, spacing or breakpoints.
      await expect(page.locator("html")).toHaveCSS("font-size", "16px");
      await expect(page.locator("body")).toHaveCSS("font-size", "14px");
      await expect(page.locator("#start p").first()).toHaveCSS("font-size", "15.75px");
      await expect(page.locator("#start p").first()).toHaveCSS("margin-top", "0px");
      await expect(page.locator("#work article p").first()).toHaveCSS(
        "margin-top",
        width >= 768 ? "0px" : "24px",
      );
      const prose = page.locator("#work article").first();
      await expect(prose.locator("p").first()).toHaveCSS("font-size", "15.75px");
      await expect(prose.locator("p").first()).toHaveCSS("line-height", "23.625px");
      await expect(prose.locator("p").first()).toHaveCSS("font-weight", "350");
      await expect(prose.locator("em").first()).toHaveCSS("font-weight", "450");
      await expect(prose.locator("em").first()).toHaveCSS("font-style", "italic");
      await expect(prose.locator("strong").first()).toHaveCSS("font-weight", "600");
      await expect(page.locator("#start strong").first()).toHaveCSS("font-weight", "600");
      await expect(page.locator("#start em").first()).toHaveCSS("font-weight", "450");
      const link = page.locator("#work article p a").first();
      await expect(link).toHaveCSS("font-weight", "600");
      await expect(link).toHaveCSS("text-decoration-line", "underline");
      await expect(link).toHaveCSS("padding", "2px");
      await expect(link).toHaveCSS("margin", "-3px");
      await link.hover();
      await expect(link).toHaveCSS("text-decoration-line", "none");
      await expect(link).toHaveCSS("background-color", "rgba(33, 33, 33, 0.05)");
      const mobile = page.locator('[data-device="mobile"]').first();
      const desktop = page.locator('[data-device="desktop"]').first();
      await expect(desktop).toHaveCSS("display", width >= 769 ? "block" : "none");
      const ratio = await mobile.evaluate(
        (element) =>
          element.getBoundingClientRect().width /
          element.closest("astro-island")!.parentElement!.getBoundingClientRect().width,
      );
      expect(ratio).toBeCloseTo(width >= 769 ? 0.15 : 0.65, 2);
      await expect(mobile.locator("video").locator("..")).toHaveCSS(
        "box-shadow",
        /rgba\(0, 0, 0, 0\.25\) 4px 4px 20px 0px$/,
      );
      const footnote = page
        .getByRole("link", { name: "privacy policy", exact: true })
        .locator("../..");
      await expect(footnote.locator("p").first()).toHaveCSS(
        "display",
        width >= 768 ? "inline" : "block",
      );
      expect(
        await footnote
          .locator("p")
          .nth(1)
          .evaluate((element) => getComputedStyle(element, "::before").content),
      ).toBe('" "');
      await page.goto("/en/privacy");
      const legal = page.locator("main article:has(> h1)");
      if (width < 768) {
        await expect(legal).toHaveCSS("max-width", "384px");
      } else {
        await expect(legal).toHaveClass(/\bmd:max-w-prose\b/);
        const legalWidth = (await legal.boundingBox())!.width;
        expect(legalWidth).toBeGreaterThan(384);
        expect(legalWidth).toBeLessThan(width);
      }
      await expect(legal.locator("h1")).toHaveCSS("font-size", "21px");
      await expect(legal.locator("h2").first()).toHaveCSS("margin-top", "0px");
      await expect(legal.locator(":scope > section").first()).toHaveCSS(
        "margin-top",
        width >= 1024 ? "0px" : "80px",
      );
      await expect(legal.locator(":scope > p").first()).toHaveCSS("font-size", "12.25px");
      await expect(legal.locator(":scope > p").first()).toHaveCSS("margin-bottom", "24px");
      await expect(page.locator("footer h2").first()).toHaveCSS(
        "font-size",
        width >= 768 ? "21px" : "15.75px",
      );
    } finally {
      await context.close();
    }
  });
}

test("Tailwind video controls remain available for reduced motion and keyboard", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/hello");
  const frame = page.locator('[data-device="mobile"]').first();
  await frame.scrollIntoViewIfNeeded();
  await expect(frame.locator("button")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(0, 0);
  await expect(frame.locator("button")).toHaveCSS("opacity", "0");
  await frame.locator("button").focus();
  await expect(frame.locator("button")).toHaveCSS("opacity", "1");
});

test("Tailwind video controls stay visible on touch devices without hover", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/hello");
    const frame = page.locator('[data-device="mobile"]').first();
    await frame.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => matchMedia("(hover: none)").matches)).toBe(true);
    await expect(frame.locator("button")).toHaveCSS("opacity", "1");
  } finally {
    await context.close();
  }
});
