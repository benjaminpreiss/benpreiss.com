import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
import svelte from "@astrojs/svelte";
import { buildAudit } from "./scripts/audit-build.ts";

export default defineConfig({
  output: "static",
  // Authored/canonical URLs are slashless; local static serving accepts either.
  // Production redirect/header behavior is verified separately in ticket 10.
  trailingSlash: "ignore",
  build: { format: "directory" },
  // Isolated fixture builds share dependencies, but must never share writable caches.
  cacheDir: "./.astro/cache",
  vite: { cacheDir: "./.astro/vite", preview: { strictPort: true } },
  integrations: [markdoc(), svelte(), buildAudit()],
});
