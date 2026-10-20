import Markdoc, { type Node } from "@markdoc/markdoc";
import { z } from "astro/zod";
import type { PageData } from "./pages";

const hrefSchema = z
  .string()
  .refine(
    (href) => /^(?:\/(?!\/)|#[a-z]|https?:\/\/)/.test(href) && !/\s/.test(href),
    "Use a local path, section fragment, or HTTP(S) URL",
  );
export const navigationSchema = z
  .object({
    locale: z.enum(["de", "en"]),
    brand: z.string().trim().min(1),
    brandHref: hrefSchema,
    labels: z
      .object({
        language: z.string().trim().min(1),
        main: z.string().trim().min(1),
        mobile: z.string().trim().min(1),
        menu: z.string().trim().min(1),
      })
      .strict(),
  })
  .strict();

export type NavigationLabels = z.infer<typeof navigationSchema>["labels"];
export type NavigationLink = { label: string; href?: string };
type PageWithSections = { data: PageData; sectionIds: string[] };

export function sectionIds(body: string): string[] {
  const ids: string[] = [];
  for (const node of Markdoc.parse(body).walk()) {
    if (node.type !== "tag" || node.attributes.id === undefined) continue;
    const id: unknown = node.attributes.id;
    if (typeof id !== "string" || !/^[a-z][a-z0-9_-]*$/.test(id))
      throw new Error("Invalid section id");
    if (ids.includes(id)) throw new Error(`Duplicate section id: ${id}`);
    ids.push(id);
  }
  return ids;
}

export function translationLinks(page: PageData, pages: PageWithSections[], fragment = "") {
  return pages
    .filter(({ data }) => data.translationKey === page.translationKey)
    .map(({ data, sectionIds }) => ({
      locale: data.locale,
      href: data.permalink + (sectionIds.includes(fragment) ? `#${fragment}` : ""),
    }));
}

export function validateNavigationHref(
  href: string,
  currentPage: string,
  pages: PageWithSections[],
) {
  hrefSchema.parse(href);
  if (/^https?:\/\//.test(href)) {
    new URL(href);
    return;
  }
  const url = new URL(href, `https://navigation.invalid${currentPage}`);
  const path = decodeURIComponent(url.pathname).replace(/\/$/, "") || "/";
  const page = pages.find(({ data }) => data.permalink === path);
  if (!page) throw new Error(`Navigation links to missing page: ${href}`);
  const fragment = decodeURIComponent(url.hash.slice(1));
  if (fragment && !page.sectionIds.includes(fragment))
    throw new Error(`Navigation links to missing section: ${href}`);
}

function plainText(node: Node): string {
  if (node.type === "text") return String(node.attributes.content);
  if (node.type !== "inline" && node.type !== "link")
    throw new Error("Navigation labels must be plain text");
  return node.children.map(plainText).join("");
}

// A single Markdown list: linked items navigate; plain-text items remain disabled.
export function navigationLinks(
  body: string,
  currentPage: string,
  pages: PageWithSections[],
): NavigationLink[] {
  const document = Markdoc.parse(body);
  if (document.children.length !== 1 || document.children[0]?.type !== "list") {
    throw new Error("Navigation must contain one Markdown list");
  }
  return document.children[0].children.map((item) => {
    const inline = item.children[0];
    if (item.children.length !== 1 || inline?.type !== "inline")
      throw new Error("Each navigation item must contain one label or link");
    const links = inline.children.filter((node) => node.type === "link");
    if (links.length && (links.length !== 1 || inline.children.length !== 1))
      throw new Error("Each navigation item must contain one label or link");
    const label = plainText(inline).trim();
    if (!label) throw new Error("Navigation labels must not be empty");
    if (!links.length) return { label };
    const href = hrefSchema.parse(links[0]!.attributes.href);
    validateNavigationHref(href, currentPage, pages);
    return { label, href };
  });
}
