import { canonicalOrigin } from "../lib/seo";

export function GET() {
  // Crawlers must be able to read the page-level noindex directive. This is
  // explicitly not access control, and indexing stays disabled until cutover.
  return new Response(
    `User-agent: *\nAllow: /\n${canonicalOrigin ? `Sitemap: ${canonicalOrigin}/sitemap.xml\n` : ""}`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
