import { test, expect } from "./support";

for (const width of [768, 1440]) {
  test(`navigation indicator and language disclosure at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/hello");
    const menu = page.locator(".mobile-menu");
    if (width < 768) await menu.locator("summary").click();
    const link = page.locator("a.section-link:visible").first();
    await page.mouse.move(0, 0);
    await expect(link.locator("img")).toHaveCSS("opacity", "0");
    const before = await link.boundingBox();
    await link.hover();
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await expect(link.locator("img")).toHaveAttribute("src", "/iconoir/navigation-indicator.svg");
    await expect(link.locator("img")).toHaveCSS("opacity", "1");
    await expect(link.locator("img")).toHaveCSS("transform", "none");
    await expect(link.locator("[data-nav-label]")).toHaveCSS("transform", "none");
    expect(await link.boundingBox()).toEqual(before);
    await link.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(link).toHaveCSS("border-radius", "0px");
    expect(await link.evaluate((el) => getComputedStyle(el, "::before").borderLeftWidth)).toBe(
      "1px",
    );
    await page.mouse.move(0, 0);
    await expect(link.locator("img")).toHaveCSS("opacity", "1");
    if (width < 768) await page.keyboard.press("Escape");
    const languages = page.locator(".language-switcher");
    const toggle = languages.locator("summary");
    await expect(toggle.locator('img[src="/iconoir/language.svg"]')).toBeVisible();
    await expect(languages.locator("a").first()).toBeHidden();
    await toggle.click();
    await expect(toggle.locator('img[src="/iconoir/language-close.svg"]')).toBeVisible();
    await expect(toggle.locator('img[src="/iconoir/language.svg"]')).toBeHidden();
    await expect(page.locator("a.section-link:visible")).toHaveCount(0);
    await expect(menu.locator("summary")).toBeHidden();
    const options = languages.locator("[data-language-option]");
    await expect(options).toHaveCount(2);
    await expect(options.first()).toHaveAttribute("aria-current", "page");
    expect(await options.first().evaluate((element) => element.tagName)).toBe("SPAN");
    await expect(options.first()).not.toHaveAttribute("tabindex");
    await expect(languages.getByRole("link")).toHaveCount(1);
    expect((await options.first().boundingBox())!.height).toBe(44);
    // Long authored navigation labels may wrap at tablet widths rather than overflow.
    expect(before!.height).toBeGreaterThanOrEqual(44);
    const toggleBox = (await toggle.boundingBox())!;
    for (const option of await options.all()) {
      const box = (await option.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(toggleBox.x);
      await option.hover();
      await expect(option).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      if (await option.getAttribute("aria-current"))
        await expect(option.locator("img")).toHaveCount(0);
      else await expect(option.locator("img")).toHaveCSS("opacity", "1");
      await expect(option).toHaveCSS("text-decoration-line", "none");
    }
    await toggle.focus();
    await page.keyboard.press("Tab");
    await expect(options.last()).toBeFocused();
    await page.mouse.move(0, 0);
    await expect(options.last().locator("img")).toHaveCSS("opacity", "1");
    await page.keyboard.press("Escape");
    await expect(languages).not.toHaveAttribute("open");
    await expect(toggle).toBeFocused();
    if (width >= 768) await expect(page.locator("a.section-link:visible").first()).toBeVisible();
    else await expect(menu.locator("summary")).toBeVisible();
    await toggle.click();
    await page.mouse.click(4, 200);
    await expect(languages).not.toHaveAttribute("open");
  });
}
