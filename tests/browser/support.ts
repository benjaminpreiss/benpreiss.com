import { test as base } from "@playwright/test";
export { expect } from "@playwright/test";

export const test = base.extend({
  browser: async ({ playwright }, use) => {
    const browser = process.env.CDP_ENDPOINT
      ? await playwright.chromium.connectOverCDP(process.env.CDP_ENDPOINT)
      : await playwright.chromium.launch();
    try {
      await use(browser);
    } finally {
      await browser.close(); // Disconnects from user-owned CDP; does not stop their browser.
    }
  },
});
