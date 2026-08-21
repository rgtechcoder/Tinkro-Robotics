export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getProductRouteParam(product: { id: string; name: string; seoSlug?: string }): string {
  const slugSource = product.seoSlug ? product.seoSlug : product.name;
  const nameSlug = slugify(slugSource);
  // Prefer an id-prefixed URL segment so the product page can resolve
  // the document by id immediately on load (works reliably on refresh).
  // Format: "{id}--{slug}" when a readable slug exists, otherwise just the id.
  return nameSlug ? `${product.id}--${nameSlug}` : product.id;
}

export function parseProductRouteParam(param: string): {
  id: string;
  slug?: string;
  hasIdPrefix: boolean;
} {
  const trimmed = param.trim();
  if (!trimmed) return { id: "", hasIdPrefix: false };
  if (trimmed.includes("--")) {
    const [id, ...slugParts] = trimmed.split("--");
    const slug = slugParts.join("--");
    return { id, slug: slug || undefined, hasIdPrefix: true };
  }
  // No explicit id prefix — treat the whole value as a slug only.
  return { id: trimmed, slug: trimmed, hasIdPrefix: false };
}