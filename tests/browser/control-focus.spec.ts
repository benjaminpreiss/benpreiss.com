import { test, expect } from "./support";

for (const width of [390, 1440]) {
  test(`Penpot brackets are absent until keyboard focus at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(() => {
      document.addEventListener("click", (event) => {
        if ((event.target as Element).closest("a")) event.preventDefault();
      });
    });
    await page.goto("/hello");
    const controls = page.locator(
      "header a:visible, header summary:visible, #start [data-text-button]",
    );
    const decoration = (control: ReturnType<typeof page.locator>) =>
      control.evaluate((el) =>
        ["::before", "::after"].map((pseudo) => {
          const style = getComputedStyle(el, pseudo);
          return { content: style.content, display: style.display };
        }),
      );
    for (const control of await controls.all()) {
      expect(await decoration(control)).toEqual(
        Array(2).fill({ content: "none", display: "none" }),
      );
      await control.hover();
      expect(await decoration(control)).toEqual(
        Array(2).fill({ content: "none", display: "none" }),
      );
    }
    const button = page.locator("#start [data-text-button]");
    await button.click();
    expect(await decoration(button)).toEqual(Array(2).fill({ content: "none", display: "none" }));
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(button).toBeFocused();
    expect(await decoration(button)).toEqual(Array(2).fill({ content: '""', display: "block" }));
    await page.keyboard.press("Tab");
    expect(await decoration(button)).toEqual(Array(2).fill({ content: "none", display: "none" }));
  });
}
