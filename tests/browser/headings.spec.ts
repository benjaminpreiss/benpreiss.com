import { test, expect } from "./support";

test("headings use semibold Work Sans across localized pages and 404", async ({ page }) => {
  for (const route of ["/", "/hello", "/privacy", "/en/privacy", "/unknown-heading-check"]) {
    await page.goto(route);
    const headings = page.getByRole("heading");
    expect(await headings.count()).toBeGreaterThan(0);
    for (const heading of await headings.all()) {
      await expect(heading).toHaveCSS("font-weight", "600");
      await expect(heading).toHaveCSS("font-family", '"Work Sans", Arial, sans-serif');
    }
  }
});
