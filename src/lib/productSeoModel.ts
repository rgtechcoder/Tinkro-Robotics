import type { AdminProduct } from "@/types/admin";

const DEFAULT_BRAND = "Tinkro";
const DEFAULT_CATEGORY = "STEM Products";
const DEFAULT_SKILL_LEVEL = "Beginner";
const DEFAULT_DIFFICULTY = "Beginner";
const DEFAULT_WARRANTY = "Standard warranty as per Tinkro policy";
const DEFAULT_COUNTRY_OF_ORIGIN = "Not specified";
const DEFAULT_MATERIAL = "Not specified";

type ProductInput = Partial<AdminProduct> & {
  id?: string;
  name?: string;
  description?: string;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function truncate(value: string, maxLength: number) {
  const clean = cleanText(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd().replace(/[,.!?;:]$/, "")}...`;
}

function cleanArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of value) {
    const clean = cleanText(item);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) continue;
    seen.add(key);
    result.push(clean);
  }
  return result;
}

function cleanSpecifications(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const specifications: NonNullable<AdminProduct["specifications"]> = {};
  for (const [key, rawValue] of Object.entries(value)) {
    const cleanKey = cleanText(key);
    if (!cleanKey || rawValue === undefined) continue;
    specifications[cleanKey] = rawValue as NonNullable<
      AdminProduct["specifications"]
    >[string];
  }
  return specifications;
}

function fallbackMetaTitle(productName: string, brand: string, category: string) {
  return truncate(`${productName} | ${brand} ${category} | Tinkro`, 60);
}

function fallbackMetaDescription(
  productName: string,
  brand: string,
  category: string,
  description: string,
) {
  const explicit = truncate(description, 155);
  if (explicit) return explicit;
  return truncate(
    `Buy ${productName} by ${brand} online from Tinkro. Explore ${category} for STEM, robotics, electronics, and learning projects in India.`,
    155,
  );
}

function fallbackKeywords(product: ProductInput, productName: string) {
  return cleanArray([
    productName,
    product.brand,
    product.category,
    product.subCategory,
    ...(Array.isArray(product.tags) ? product.tags : []),
    ...(Array.isArray(product.features) ? product.features : []),
    "robotics",
    "STEM",
    "electronics",
    "Tinkro",
  ]).slice(0, 20);
}

function fallbackFeatures(product: ProductInput) {
  return cleanArray([
    ...(Array.isArray(product.features) ? product.features : []),
    ...(Array.isArray(product.kitContents) ? product.kitContents : []),
  ]).slice(0, 12);
}

export function withProductSeoDefaults<T extends ProductInput>(product: T): T {
  const productName = cleanText(product.name) || "Tinkro Product";
  const brand = cleanText(product.brand) || DEFAULT_BRAND;
  const category = cleanText(product.category) || DEFAULT_CATEGORY;
  const subCategory = cleanText(product.subCategory) || category;
  const description = cleanText(product.description);
  const tags = cleanArray(product.tags);
  const features = fallbackFeatures(product);
  const packageContents = cleanArray(
    product.packageContents?.length ? product.packageContents : product.kitContents,
  );

  return {
    ...product,
    name: productName,
    description,
    metaTitle:
      cleanText(product.metaTitle) ||
      fallbackMetaTitle(productName, brand, category),
    metaDescription:
      cleanText(product.metaDescription) ||
      fallbackMetaDescription(productName, brand, category, description),
    keywords: cleanArray(product.keywords).length
      ? cleanArray(product.keywords)
      : fallbackKeywords({ ...product, brand, category, subCategory }, productName),
    brand,
    sku: cleanText(product.sku) || cleanText(product.id) || productName,
    gtin: cleanText(product.gtin),
    mpn: cleanText(product.mpn) || cleanText(product.sku) || cleanText(product.id),
    category,
    subCategory,
    tags: tags.length ? tags : fallbackKeywords(product, productName).slice(0, 8),
    features,
    specifications: cleanSpecifications(product.specifications),
    compatibility: cleanArray(product.compatibility),
    applications: cleanArray(product.applications),
    certifications: cleanArray(product.certifications),
    warranty: cleanText(product.warranty) || DEFAULT_WARRANTY,
    packageContents,
    skillLevel: cleanText(product.skillLevel) || DEFAULT_SKILL_LEVEL,
    difficulty: cleanText(product.difficulty) || DEFAULT_DIFFICULTY,
    weight: product.weight ?? "Not specified",
    dimensions: product.dimensions ?? "Not specified",
    material: cleanText(product.material) || DEFAULT_MATERIAL,
    countryOfOrigin:
      cleanText(product.countryOfOrigin) || DEFAULT_COUNTRY_OF_ORIGIN,
    manufacturer: cleanText(product.manufacturer) || brand,
  } as T;
}

export function normalizeProducts<T extends ProductInput>(products: T[]) {
  return products.map((product) => withProductSeoDefaults(product));
}
