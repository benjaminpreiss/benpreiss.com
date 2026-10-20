import { test, expect } from "./support";

for (const route of ["/", "/hello"]) {
  for (const width of [390, 1440]) {
    test(`Work Sans loads real normal and italic faces: ${route} at ${width}px`, async ({
      page,
      baseURL,
    }, testInfo) => {
      const fontRequests: string[] = [];
      page.on("request", (request) => {
        if (request.resourceType() === "font") fontRequests.push(request.url());
      });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      const faces = await page.evaluate(async () => {
        const sample = "English Deutsch ÄÖÜ äöü ß ẞ €";
        const loaded = await Promise.all(
          ["400", "500", "600", "700", "italic 500", "350", "800"].map(async (style) => {
            const faces = await document.fonts.load(`${style} 16px "Work Sans"`, sample);
            return faces.map((face) => ({
              family: face.family,
              status: face.status,
              weight: face.weight,
              style: face.style,
            }));
          }),
        );
        await document.fonts.ready;
        return loaded;
      });
      for (const face of faces) {
        expect(face).toHaveLength(2); // Latin plus Latin-ext for uppercase ẞ.
        for (const subset of face)
          expect(subset).toMatchObject({
            family: "Work Sans",
            status: "loaded",
            weight: "100 900",
          });
      }
      expect(faces[4]![0]!.style).toBe("italic");
      await expect(page.locator("html")).toHaveCSS("font-synthesis", "none");
      await expect(page.locator("#start p").first()).toHaveCSS(
        "font-family",
        '"Work Sans", Arial, sans-serif',
      );
      await expect(page.locator(".brand")).toHaveCSS(
        "font-family",
        '"Onest Logo", Arial, sans-serif',
      );
      await expect(page.locator(".brand")).toHaveCSS("font-weight", "700");
      const logo = await page.evaluate(async () => ({
        supported: (await document.fonts.load('700 16px "Onest Logo"', "benpreiss")).map(
          (face) => ({ weight: face.weight, status: face.status }),
        ),
        unsupported: (await document.fonts.load('700 16px "Onest Logo"', "a")).length,
      }));
      expect(logo.supported).toEqual([{ weight: "700", status: "loaded" }]);
      expect(logo.unsupported).toBe(0);
      expect(new Set(fontRequests).size).toBe(5);
      for (const request of fontRequests) {
        const url = new URL(request);
        expect(url.origin).toBe(new URL(baseURL!).origin);
        expect(decodeURIComponent(url.pathname)).toMatch(
          /^\/fonts\/(?:work-sans\/WorkSans(?:-Italic)?-latin(?:-ext)?|onest\/benpreiss-700)\.woff2$/,
        );
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      await page.locator("#start").screenshot({ path: testInfo.outputPath("typography.png") });
    });
  }
}
