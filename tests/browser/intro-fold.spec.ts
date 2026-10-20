import { test, expect } from "./support";

for (const path of ["/", "/hello"]) {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 1000 },
  ]) {
    test(`intro cue fits above fold when space permits: ${path} ${viewport.width}`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({ baseURL, viewport, javaScriptEnabled: false });
      try {
        const page = await context.newPage();
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const arrow = page.locator('img[src="/thin-long-arrow-down.svg"]');
        const bounds = await arrow.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height - 16);
        const intro = await page.locator("#start").boundingBox();
        expect(bounds!.y).toBeGreaterThan(intro!.y + intro!.height);
      } finally {
        await context.close();
      }
    });
  }
}

for (const path of ["/long", "/long-english"]) {
  test(`intro grows without overlap on short screens with enlarged text: ${path}`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 390, height: 400 },
      javaScriptEnabled: false,
    });
    try {
      const page = await context.newPage();
      await page.goto(path);
      await page.locator("#start p").evaluateAll((paragraphs) => {
        for (const paragraph of paragraphs) paragraph.setAttribute("style", "font-size: 200%");
      });
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.locator("#start").evaluate((intro) => {
        const screen = intro.parentElement!;
        const cue = screen.querySelector('img[src="/thin-long-arrow-down.svg"]')!.parentElement!;
        return {
          introBottom: intro.getBoundingClientRect().bottom,
          contentBottom: Math.max(
            ...Array.from(intro.querySelectorAll("img, p, a")).map(
              (node) => node.getBoundingClientRect().bottom,
            ),
          ),
          cueTop: cue.getBoundingClientRect().top,
          cueBottom: cue.getBoundingClientRect().bottom,
          screenBottom: screen.getBoundingClientRect().bottom,
          viewport: innerHeight,
        };
      });
      expect(geometry.cueTop).toBeGreaterThanOrEqual(geometry.introBottom - 1);
      expect(geometry.introBottom).toBeGreaterThanOrEqual(geometry.contentBottom);
      expect(geometry.screenBottom).toBeGreaterThan(geometry.viewport);
      expect(geometry.screenBottom).toBeGreaterThanOrEqual(geometry.cueBottom);
    } finally {
      await context.close();
    }
  });
}
