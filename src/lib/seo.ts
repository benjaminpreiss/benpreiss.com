// Only explicit owner configuration may supply the canonical origin. Never use
// request headers, preview URLs or CI provider defaults.
export function productionOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "PRODUCTION_ORIGIN must be an HTTPS origin without credentials, path, query or fragment",
    );
  return url.origin;
}
export const canonicalOrigin = productionOrigin(process.env.PRODUCTION_ORIGIN);
if (process.env.RELEASE_BUILD === "1" && !canonicalOrigin)
  throw new Error("RELEASE_BUILD requires an owner-approved PRODUCTION_ORIGIN");

export function canonicalUrl(path: string, origin = canonicalOrigin): string | undefined {
  return origin ? new URL(path, origin).href : undefined;
}
