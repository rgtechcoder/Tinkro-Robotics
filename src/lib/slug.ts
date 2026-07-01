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
  return nameSlug ? nameSlug : product.id;
}

export function parseProductRouteParam(param: string): {
  id: string;
  slug?: string;
} {
  const trimmed = param.trim();
  if (!trimmed) return { id: "" };
  if (trimmed.includes("--")) {
    const [id, ...slugParts] = trimmed.split("--");
    const slug = slugParts.join("--");
    return { id, slug: slug || undefined };
  }
  return { id: trimmed, slug: trimmed };
}