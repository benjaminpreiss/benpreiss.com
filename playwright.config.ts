import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  // Multiple CDP clients attach to the same targets and can overwrite media emulation.
  // Locally launched browsers remain isolated and may run in parallel.
  workers: process.env.CDP_ENDPOINT ? 1 : undefined,
  use: { baseURL: "http://127.0.0.1:44321" },
  webServer: {
    command: "node tests/support/serve-site.ts",
    timeout: 120_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
    url: "http://127.0.0.1:44321",
    reuseExistingServer: false,
  },
});
