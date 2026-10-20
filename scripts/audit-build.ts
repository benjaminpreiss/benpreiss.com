import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}
function decode(value: string): string {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
    const named: Record<string, string> = {
      "&amp;": "&",
      "&quot;": '"',
      "&apos;": "'",
      "&lt;": "<",
      "&gt;": ">",
    };
    return (
      named[entity] ??
      String.fromCodePoint(
        entity.startsWith("&#x") ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10),
      )
    );
  });
}
export function outputRoute(file: string): string {
  if (file === "index.html") return "/";
  return "/" + file.replace(/\/index\.html$/, "").replace(/\.html$/, "");
}

// Audit generated markup, not source syntax: this also sees links/assets inside
// reusable Markdoc components, the footer, Svelte SSR and Astro's bundles.
export function auditBuild(dir: string, origin = "https://audit.invalid"): void {
  const all = files(dir);
  const notices = join(dir, "THIRD-PARTY-NOTICES.txt");
  if (!existsSync(notices) || !statSync(notices).isFile() || !readFileSync(notices, "utf8").trim())
    throw new Error("Missing required third-party notices in public build output");
  for (const name of [
    "WorkSans-latin.woff2",
    "WorkSans-latin-ext.woff2",
    "WorkSans-Italic-latin.woff2",
    "WorkSans-Italic-latin-ext.woff2",
    "OFL.txt",
  ]) {
    const asset = join(dir, "fonts/work-sans", name);
    if (!existsSync(asset) || !statSync(asset).isFile())
      throw new Error(`Missing required font asset: ${name}`);
  }
  for (const name of ["benpreiss-700.woff2", "OFL.txt"]) {
    const asset = join(dir, "fonts/onest", name);
    if (!existsSync(asset) || !statSync(asset).isFile())
      throw new Error(`Missing required font asset: onest/${name}`);
  }
  if (all.some((file) => /FoundersGrotesk/i.test(file)))
    throw new Error("Proprietary font found in public build output");
  const documents = new Map<string, { html: string; ids: Set<string>; file: string }>();
  for (const file of all.filter((path) => path.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    const ids = new Set<string>();
    for (const match of html.matchAll(/\sid="([^"]+)"/g)) {
      const id = decode(match[1]!);
      if (ids.has(id)) throw new Error(`Duplicate rendered id ${id} in ${file}`);
      ids.add(id);
    }
    documents.set(outputRoute(relative(dir, file)), { html, ids, file });
  }
  function check(reference: string, route: string) {
    const href = decode(reference);
    if (/^(?:mailto:|tel:|data:)/i.test(href)) return;
    const url = new URL(href, origin + route);
    if (!/^https?:$/.test(url.protocol)) throw new Error(`Unsafe URL ${href} in ${route}`);
    if (url.origin !== origin) return;
    let path: string;
    let fragment: string;
    try {
      path = decodeURIComponent(url.pathname);
      fragment = decodeURIComponent(url.hash.slice(1));
    } catch {
      throw new Error(`Malformed URL ${href} in ${route}`);
    }
    const normalized = path.replace(/\/$/, "") || "/";
    const document =
      documents.get(normalized) ??
      (path.endsWith(".html") ? documents.get(outputRoute(path.slice(1))) : undefined);
    if (document) {
      if (fragment && !document.ids.has(fragment))
        throw new Error(`Broken fragment ${href} in ${route}`);
      return;
    }
    const asset = resolve(dir, "." + path);
    if (!asset.startsWith(resolve(dir) + "/")) throw new Error(`Unsafe asset path ${href}`);
    if (existsSync(asset) && statSync(asset).isFile()) return;
    throw new Error(`Broken internal link or asset ${href} in ${route}`);
  }
  for (const [route, { html }] of documents) {
    for (const match of html.matchAll(
      /\s(?:href|src|poster|component-url|renderer-url|before-hydration-url)="([^"]*)"/g,
    ))
      check(match[1]!, route);
    for (const match of html.matchAll(/\ssrcset="([^"]+)"/g)) {
      for (const item of match[1]!.split(",")) check(item.trim().split(/\s+/)[0]!, route);
    }
  }
  for (const file of all.filter((path) => path.endsWith(".css"))) {
    for (const match of readFileSync(file, "utf8").matchAll(/url\(["']?([^"')]+)["']?\)/g))
      check(match[1]!, "/" + relative(dir, file));
  }
}

export function buildAudit(): AstroIntegration {
  return {
    name: "portfolio-build-audit",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        if (!process.env.PRODUCTION_ORIGIN)
          logger.warn(
            "PRODUCTION_ORIGIN is unset: absolute canonical/hreflang metadata and sitemap URLs are intentionally omitted (owner confirmation required)",
          );
        auditBuild(
          fileURLToPath(dir),
          process.env.PRODUCTION_ORIGIN ? new URL(process.env.PRODUCTION_ORIGIN).origin : undefined,
        );
        logger.info("Internal links, rendered anchors and static assets validated");
      },
    },
  };
}
