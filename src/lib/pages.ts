import { z } from "astro/zod";

export const pageSchema = z
  .object({
    permalink: z
      .string()
      .regex(
        /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/,
        "Use / or an absolute lowercase path without trailing slash, query or fragment",
      )
      .refine((path) => path !== "/404", "The /404 path is reserved for the not-found artifact"),
    locale: z.enum(["de", "en"]),
    translationKey: z
      .string()
      .regex(/^[a-z][a-z0-9-]*$/, "Use a stable translation identity, e.g. home"),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
  })
  .strict();

export type PageData = z.infer<typeof pageSchema>;

export function validatePages<T extends { id: string; data: PageData }>(pages: T[]): T[] {
  const routes = new Map<string, string>();
  const translations = new Map<string, string>();
  for (const page of pages) {
    const result = pageSchema.safeParse(page.data);
    if (!result.success) throw new Error(`${page.id}: ${result.error.message}`);
    const { permalink, locale, translationKey } = result.data;
    const identity = `${translationKey}:${locale}`;
    for (const [map, key, label] of [
      [routes, permalink, "permalink"],
      [translations, identity, "translation identity"],
    ] as const) {
      const previous = map.get(key);
      if (previous)
        throw new Error(`${page.id}: duplicate ${label} "${key}" (also in ${previous})`);
      map.set(key, page.id);
    }
  }
  for (const page of pages) {
    for (const locale of ["de", "en"]) {
      if (!translations.has(`${page.data.translationKey}:${locale}`))
        throw new Error(
          `${page.id}: missing ${locale} translation for ${page.data.translationKey}`,
        );
    }
  }
  return pages;
}
