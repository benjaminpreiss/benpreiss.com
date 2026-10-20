import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { pageSchema } from "./lib/pages";
import { validateSharedContent } from "./lib/shared-content";
import { navigationSchema } from "./lib/navigation";

validateSharedContent();

export const collections = {
  system: defineCollection({
    loader: glob({ pattern: "*.mdoc", base: "./content/system" }),
    schema: z
      .object({ title: z.string().trim().min(1), description: z.string().trim().min(1) })
      .strict(),
  }),
  footer: defineCollection({
    loader: glob({ pattern: "**/footer.mdoc", base: "./content/footer" }),
    schema: z.object({ locale: z.enum(["de", "en"]) }).strict(),
  }),
  navigation: defineCollection({
    loader: glob({ pattern: "**/navigation.mdoc", base: "./content/navigation" }),
    schema: navigationSchema,
  }),
  pages: defineCollection({
    loader: glob({ pattern: "**/*.mdoc", base: "./content/pages" }),
    schema: pageSchema,
  }),
};
