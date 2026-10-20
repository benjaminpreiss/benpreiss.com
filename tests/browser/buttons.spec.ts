import { test, expect } from "./support";

for (const [route, variant] of [
  ["/hello", "outline"],
  ["/long-english", "filled"],
]) {
  for (const width of [390, 1440]) {
    test(`Penpot ${variant} button states at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route!);
      await page.evaluate(() => document.fonts.ready);
      const button = page.locator("#start [data-text-button]");
      await expect(button).toHaveAttribute("data-variant", variant!);
      await expect(button).toHaveCSS("height", "44px");
      await expect(button).toHaveCSS("padding-top", "10px");
      await expect(button).toHaveCSS("padding-left", "16px");
      await expect(button).toHaveCSS("border-radius", "16px");
      await expect(button).toHaveCSS("font-weight", "500");
      await expect(button).toHaveCSS("font-size", "15.75px");
      await expect(button.locator("img")).toHaveJSProperty("naturalWidth", 24);
      const documentBox = () =>
        button.evaluate((el) => {
          const box = el.getBoundingClientRect();
          return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
        });
      const box = await documentBox();
      const outline = await button.evaluate((el) => getComputedStyle(el).boxShadow);
      await button.hover();
      if (variant === "outline") {
        expect(outline).toContain("inset");
        expect(outline).toContain("1.5px");
        await expect(button).toHaveCSS("box-shadow", outline);
      }
      await expect(button).toHaveCSS(
        "background-color",
        variant === "outline" ? "rgb(244, 244, 244)" : "rgb(85, 85, 85)",
      );
      await page.mouse.down();
      await expect(button).toHaveCSS(
        "background-color",
        variant === "outline" ? "rgb(233, 233, 233)" : "rgb(55, 55, 55)",
      );
      await page.mouse.move(0, 0);
      await page.mouse.up();
      await button.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(button).toBeFocused();
      await expect(button).toHaveCSS("border-radius", "0px");
      await expect(button).toHaveCSS("background-color", "rgb(244, 244, 244)");
      await expect(button).toHaveCSS("color", "rgb(33, 33, 33)");
      const brackets = await button.evaluate((el) =>
        ["::before", "::after"].map((pseudo) => {
          const s = getComputedStyle(el, pseudo);
          return {
            content: s.content,
            width: s.width,
            top: s.borderTopWidth,
            bottom: s.borderBottomWidth,
          };
        }),
      );
      expect(brackets).toEqual(
        Array(2).fill({ content: '""', width: "5px", top: "1px", bottom: "1px" }),
      );
      expect(await documentBox()).toEqual(box);
      await button.screenshot({ path: testInfo.outputPath("button-focus.png") });
    });
  }
}

test("booking is a normal no-JS link, retains its fragment, and makes no background booking request", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const remote: string[] = [];
    page.on("request", (request) => {
      if (request.url().startsWith("https://example.org/booking")) remote.push(request.url());
    });
    await page.goto("/hello");
    const button = page.getByRole("link", { name: "Fixture booking" });
    await expect(button).toHaveAttribute("href", "https://example.org/booking#fixture-token=");
    expect(remote).toEqual([]);
    await page.route("https://example.org/booking", (route) =>
      route.fulfill({ contentType: "text/html", body: "<h1>Booking fixture</h1>" }),
    );
    await button.click();
    await expect(page).toHaveURL("https://example.org/booking#fixture-token=");
  } finally {
    await context.close();
  }
});
