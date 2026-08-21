import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { db } from "@/lib/firebase";
import { withProductSeoDefaults } from "./productSeoModel";
import type { AdminBlogPost, AdminCategory, AdminProduct } from "@/types/admin";

export interface ImportOptions {
  createNewProducts: boolean;
  updateExistingProducts: boolean;
  skipExistingProducts: boolean;
  replaceExistingProducts: boolean;
  updateOnlySeo: boolean;
  updateOnlyPrice: boolean;
  updateOnlyStock: boolean;
  dryRun: boolean;
  generateMissingSeo: boolean;
}

export interface BlogImportOptions {
  createNewArticles: boolean;
  updateExistingArticles: boolean;
  dryRun: boolean;
}

export interface ImportColumnMapping {
  [field: string]: string | null;
}

export interface ImportIssue {
  row: number;
  type: "error" | "warning";
  message: string;
}

export interface ParsedImportFile {
  headers: string[];
  rows: Array<Record<string, unknown>>;
  sheetName: string;
  sourceFileName: string;
}

export interface ImportRowForValidation<T = AdminProduct> {
  rowNumber: number;
  sourceRow: Record<string, unknown>;
  normalizedValues: Partial<T> & Record<string, unknown>;
  issues: ImportIssue[];
  action: "create" | "update" | "skip";
  existingProduct?: (T & { id: string }) | null;
}

export interface ImportValidationResult<T = AdminProduct> {
  rows: ImportRowForValidation<T>[];
  summary: {
    rowsToCreate: number;
    rowsToUpdate: number;
    rowsToSkip: number;
    errors: number;
    warnings: number;
  };
}

export interface ImportReport {
  sourceFileName: string;
  importType?: "products" | "knowledgeHub";
  importDate: string;
  adminEmail: string;
  totalRows?: number;
  rowsImported: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  durationMs: number;
  warnings: ImportIssue[];
  errors: ImportIssue[];
}

const TARGET_FIELDS = [
  "sku",
  "name",
  "category",
  "categoryId",
  "categoryIds",
  "price",
  "description",
  "overview",
  "subCategory",
  "brand",
  "metaTitle",
  "metaDescription",
  "focusKeyword",
  "keywords",
  "seoSlug",
  "canonicalUrl",
  "openGraphTitle",
  "openGraphDescription",
  "twitterTitle",
  "twitterDescription",
  "features",
  "specifications",
  "compatibility",
  "applications",
  "packageContents",
  "faq",
  "tags",
  "skillLevel",
  "stock",
  "originalPrice",
  "discount",
  "availability",
  "currency",
  "imageAltText",
  "gtin",
  "mpn",
  "warranty",
  "material",
  "weight",
  "dimensions",
  "countryOfOrigin",
  "manufacturer",
  "difficulty",
  "images",
  "gallery",
  "downloads",
  "documents",
  "certifications",
] as const;
// extend with common media/document fields that may be present in Excel
const EXTENDED_ARRAY_FIELDS = [
  "images",
  "gallery",
  "downloads",
  "documents",
  "certifications",
];

const FIELD_ALIASES: Record<string, string[]> = {
  sku: ["sku", "productsku", "itemsku", "item_sku"],
  name: ["name", "productname", "product_name", "title"],
  category: ["category", "productcategory", "product_category"],
  categoryId: ["categoryid", "category_id", "category id", "catid", "categoryidentifier"],
  categoryIds: ["categoryids", "category_ids", "category ids", "categories", "category_list", "categorylist"],
  price: ["price", "unitprice", "sellingprice", "saleprice"],
  description: ["description", "productdescription", "product_description"],
  overview: ["overview", "shortoverview", "short_overview"],
  subCategory: ["subcategory", "sub_category", "subcat"],
  brand: ["brand", "manufacturerbrand", "vendor"],
  metaTitle: ["metatitle", "meta_title", "seo_title"],
  metaDescription: ["metadescription", "meta_description", "seo_description"],
  focusKeyword: ["focuskeyword", "focus_keyword", "focus_keyword_phrase"],
  keywords: ["keywords", "seo_keywords", "tags"],
  seoSlug: ["seoslug", "slug", "seo_slug"],
  canonicalUrl: ["canonicalurl", "canonical_url", "canonical"],
  openGraphTitle: ["opengraphtitle", "ogtitle", "og_title"],
  openGraphDescription: ["opengraphdescription", "ogdescription", "og_description"],
  twitterTitle: ["twittertitle", "twitter_title"],
  twitterDescription: ["twitterdescription", "twitter_description"],
  features: ["features", "productfeatures", "highlights"],
  specifications: ["specifications", "specs"],
  compatibility: ["compatibility", "compatiblewith"],
  applications: ["applications", "usecases", "uses"],
  packageContents: ["packagecontents", "contents", "whatsincluded"],
  faq: ["faq", "faqs", "frequentlyaskedquestions"],
  tags: ["tags", "customtags"],
  skillLevel: ["skilllevel", "skill_level"],
  stock: ["stock", "stockquantity", "availablequantity", "quantity"],
  originalPrice: ["originalprice", "mrp", "listprice"],
  discount: ["discount", "discountpercent", "discount_percentage"],
  availability: ["availability", "status", "instock"],
  currency: ["currency", "currencycode"],
  imageAltText: ["imagealttext", "alttext", "image_alt_text"],
  images: ["images", "image urls", "image_urls", "image list", "gallery images"],
  gallery: ["gallery", "gallery images", "gallery_images"],
  downloads: ["downloads", "download_urls", "download links"],
  documents: ["documents", "document urls", "document_links"],
  gtin: ["gtin", "ean", "barcode"],
  mpn: ["mpn", "partnumber"],
  warranty: ["warranty"],
  material: ["material"],
  weight: ["weight"],
  dimensions: ["dimensions", "size"],
  countryOfOrigin: ["countryoforigin", "country", "origin"],
  manufacturer: ["manufacturer", "vendor"],
  difficulty: ["difficulty"],
};

export const BLOG_TARGET_FIELDS = [
  "title",
  "slug",
  "seoSlug",
  "metaTitle",
  "metaDescription",
  "focusKeyword",
  "author",
  "authorBio",
  "authorImage",
  "authorLinkedIn",
  "authorGithub",
  "authorWebsite",
  "category",
  "categories",
  "subCategory",
  "articleType",
  "content",
  "excerpt",
  "summary",
  "featuredImage",
  "thumbnail",
  "images",
  "gallery",
  "featuredVideo",
  "status",
  "tags",
  "keywords",
  "secondaryKeywords",
  "canonicalUrl",
  "openGraphTitle",
  "openGraphDescription",
  "twitterTitle",
  "twitterDescription",
  "twitterImage",
  "programmingLanguage",
  "circuitDiagramUrl",
  "wiringDiagramUrl",
  "githubRepository",
  "sourceCodeUrl",
  "simulationUrl",
  "datasheets",
  "references",
  "relatedProducts",
  "recommendedProducts",
  "resources",
  "faqItems",
  "publishedAt",
  "publishedDate",
  "readingTime",
  "difficulty",
  "skillLevel",
  "targetAudience",
  "keyTakeaways",
  "prerequisites",
  "estimatedBuildTime",
  "estimatedProjectCost",
  "relatedBlogs",
  "ctaTitle",
  "ctaDescription",
  "ctaButtonText",
  "ctaButtonLink",
  "robots",
  "lastUpdated",
  "aiSummary",
] as const;

const BLOG_FIELD_ALIASES: Record<string, string[]> = {
  title: ["title", "article title", "headline"],
  slug: ["slug", "article slug", "url slug", "blog slug"],
  seoSlug: ["seo slug", "seo_slug", "seoSlug", "seoslug"],
  metaTitle: ["meta title", "metatitle", "meta_title"],
  metaDescription: ["meta desc", "meta description", "metadescription", "meta_description", "seo description"],
  focusKeyword: ["focus keyword", "focuskeyword", "focus_keyword"],
  author: ["author", "written by", "writer"],
  authorBio: ["author bio", "authorbio", "author biography"],
  authorImage: ["author image", "authorimage", "author_image"],
  authorLinkedIn: ["linkedin", "author linkedin", "authorlinkedin"],
  authorGithub: ["github", "author github", "authorgithub"],
  authorWebsite: ["author website", "website", "author website url"],
  category: ["category", "topic", "section"],
  categories: ["categories", "tags", "topic categories"],
  subCategory: ["sub category", "subcategory", "sub_category"],
  articleType: ["article type", "type", "content type"],
  content: ["content", "body", "article content"],
  excerpt: ["excerpt", "summary", "short description"],
  summary: ["summary", "article summary"],
  featuredImage: ["featured image", "featuredimage", "hero image"],
  thumbnail: ["thumbnail", "thumb"],
  images: ["images", "image urls", "image list"],
  gallery: ["gallery", "gallery images"],
  featuredVideo: ["featured video", "featuredvideo", "video url"],
  status: ["status", "publish status", "published status"],
  tags: ["tags", "keywords"],
  keywords: ["keywords", "seo keywords"],
  secondaryKeywords: ["secondary keywords", "secondarykeywords"],
  canonicalUrl: ["canonical url", "canonicalurl", "canonical_url"],
  openGraphTitle: ["og title", "open graph title", "opengraphtitle"],
  openGraphDescription: ["og description", "open graph description", "opengraphdescription"],
  twitterTitle: ["twitter title", "twittertitle"],
  twitterDescription: ["twitter description", "twitterdescription"],
  twitterImage: ["twitter image", "twitterimage"],
  programmingLanguage: ["programming language", "language", "language used"],
  circuitDiagramUrl: ["circuit diagram", "circuit diagram url", "circuitdiagramurl"],
  wiringDiagramUrl: ["wiring diagram", "wiringdiagramurl"],
  githubRepository: ["github", "github repository", "githubrepository"],
  sourceCodeUrl: ["source code url", "sourcecodeurl"],
  simulationUrl: ["simulation url", "simulationurl"],
  datasheets: ["datasheets", "datasheet", "data sheets"],
  references: ["references", "reference links", "reference"],
  relatedProducts: ["related products", "relatedproducts"],
  recommendedProducts: ["recommended products", "recommendedproducts"],
  resources: ["resources"],
  faqItems: ["faq items", "faqitems", "faqs"],
  publishedAt: ["published at", "publishedat", "publication date", "date published"],
  publishedDate: ["published date", "publisheddate"],
  readingTime: ["readingtime", "reading time", "reading_time", "read time", "minutes"],
  difficulty: ["difficulty", "level"],
  skillLevel: ["skilllevel", "skill level", "skill_level"],
  targetAudience: ["targetaudience", "target audience", "audience", "audience type"],
  keyTakeaways: ["keytakeaways", "key takeaways", "takeaways", "highlights"],
  prerequisites: ["prerequisites", "requirements", "required knowledge"],
  estimatedBuildTime: ["estimatedbuildtime", "build time", "estimated build time", "project duration"],
  estimatedProjectCost: ["estimatedprojectcost", "project cost", "estimated cost", "cost"],
  relatedBlogs: ["relatedblogs", "related blogs", "related articles"],
  ctaTitle: ["ctatitle", "cta title"],
  ctaDescription: ["ctadescription", "cta description"],
  ctaButtonText: ["ctabuttontext", "cta button", "button text"],
  ctaButtonLink: ["ctabuttonlink", "cta url", "button url"],
  robots: ["robots", "index status"],
  lastUpdated: ["lastupdated", "last updated", "updated at"],
  aiSummary: ["aisummary", "ai summary", "summary ai"],
};

const BLOG_ARRAY_FIELDS = new Set([
  "tags",
  "keywords",
  "secondaryKeywords",
  "categories",
  "images",
  "gallery",
  "datasheets",
  "references",
  "relatedProducts",
  "recommendedProducts",
  "resources",
  "targetAudience",
  "keyTakeaways",
  "prerequisites",
  "relatedBlogs",
]);

const BLOG_ALLOWED_DIFFICULTIES = new Set(["Beginner", "Intermediate", "Advanced"]);
const BLOG_ALLOWED_ROBOTS = new Set(["index,follow", "noindex,nofollow"]);

function toIsoDateIfValid(value: unknown): string | null {
  if (!hasValue(value)) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  return null;
}

function normalizeDifficulty(value: unknown): "Beginner" | "Intermediate" | "Advanced" | "" {
  const normalized = cleanText(value).toLowerCase();
  if (!normalized) return "";
  if (normalized === "beginner") return "Beginner";
  if (normalized === "intermediate") return "Intermediate";
  if (normalized === "advanced") return "Advanced";
  return "";
}

function normalizeRobots(value: unknown): "index,follow" | "noindex,nofollow" | "" {
  const normalized = cleanText(value).toLowerCase().replace(/\s+/g, "");
  if (normalized === "index,follow") return "index,follow";
  if (normalized === "noindex,nofollow") return "noindex,nofollow";
  return "";
}

function getAutoColumnMappingForFields(
  headers: string[],
  targetFields: readonly string[],
  aliases: Record<string, string[]>,
): ImportColumnMapping {
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));
  const normalizedToHeader = new Map<string, string>();
  headers.forEach((header, index) => normalizedToHeader.set(normalizedHeaders[index], header));

  const mapping: ImportColumnMapping = {};
  targetFields.forEach((field) => {
    // Normalize aliases the same way headers are normalized so matches succeed
    const fieldAliases = (aliases[field] ?? []).map((a) => normalizeHeader(a));
    // Also include the raw field name as a fallback
    fieldAliases.push(normalizeHeader(field));
    // Try exact normalized match first, then fallback to substring matches so headers like
    // "Price (INR)" or "Original Price / MRP" still map to the canonical field.
    let matchedNormalized = normalizedHeaders.find((header) => fieldAliases.includes(header));
    if (!matchedNormalized) {
      matchedNormalized = normalizedHeaders.find((header) =>
        fieldAliases.some((alias) => header.split("_").includes(alias))
      );
    }
    mapping[field] = matchedNormalized ? normalizedToHeader.get(matchedNormalized) ?? null : null;
  });

  return mapping;
}

export function getAutoColumnMapping(headers: string[], importType: "products" | "knowledgeHub" = "products") {
  if (importType === "knowledgeHub") {
    return getAutoColumnMappingForFields(headers, BLOG_TARGET_FIELDS, BLOG_FIELD_ALIASES);
  }

  return getAutoColumnMappingForFields(headers, TARGET_FIELDS, FIELD_ALIASES);
}

function normalizeHeader(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "_");
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function productNameTokens(value: unknown) {
  return cleanText(value).toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function productNameMatchScore(left: unknown, right: unknown) {
  const leftTokens = new Set(productNameTokens(left));
  const rightTokens = new Set(productNameTokens(right));
  if (leftTokens.size === 0) return 0;
  let common = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) common += 1;
  }
  return common / leftTokens.size;
}

function hasValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    let str = value.replace(/\u00A0/g, " ").trim();
    if (!str) return null;
    // Remove common currency symbols and any non-digit/decimal/comma/paren characters
    // Keep digits, dot, comma, minus, and parentheses (for negative values)
    str = str.replace(/[^\d\.\-,()]/g, "");
    // Handle parentheses for negative numbers e.g. (1,234.56)
    let negative = false;
    if (/^\(.+\)$/.test(str)) {
      negative = true;
      str = str.replace(/^\(|\)$/g, "");
    }
    // Remove thousand separators
    str = str.replace(/,/g, "");
    if (!str) return null;
    const parsed = Number(str);
    if (!Number.isFinite(parsed)) return null;
    return negative ? -parsed : parsed;
  }
  return null;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => cleanText(entry))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[|,;\n]+/)
      .map((entry) => cleanText(entry))
      .filter(Boolean);
  }

  return [];
}

function toSpecifications(value: unknown): Record<string, string | number | boolean | string[] | number[] | null> {
  if (typeof value === "object" && value && !Array.isArray(value)) {
    return value as Record<string, string | number | boolean | string[] | number[] | null>;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return {};

    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, string | number | boolean | string[] | number[] | null>;
      }
    } catch {
      // fall back to key:value parsing
    }

    const entries: Record<string, string | number | boolean | string[] | number[] | null> = {};
    trimmed.split(/[;|\n]+/).forEach((entry) => {
      const parts = entry.split(":");
      if (parts.length >= 2) {
        const key = cleanText(parts.shift());
        const textValue = cleanText(parts.join(":"));
        if (key) entries[key] = textValue;
      }
    });
    return entries;
  }

  return {};
}

function toFaqs(value: unknown): Array<{ question: string; answer: string }> {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === "object" && entry && "question" in entry && "answer" in entry) {
          return {
            question: cleanText((entry as Record<string, unknown>).question),
            answer: cleanText((entry as Record<string, unknown>).answer),
          };
        }
        return null;
      })
      .filter((entry): entry is { question: string; answer: string } => Boolean(entry?.question && entry.answer));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    const parts = trimmed.split(/[;|\n]+/).filter(Boolean);
    return parts
      .map((entry) => {
        const separatorIndex = entry.indexOf(":");
        if (separatorIndex < 0) return null;
        return {
          question: cleanText(entry.slice(0, separatorIndex)),
          answer: cleanText(entry.slice(separatorIndex + 1)),
        };
      })
      .filter((entry): entry is { question: string; answer: string } => Boolean(entry?.question && entry.answer));
  }

  return [];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createFaqsFromProduct(product: Partial<AdminProduct> & Record<string, unknown>) {
  const name = cleanText(product.name);
  const category = cleanText(product.category);
  const description = cleanText(product.description);
  const baseQuestion = name || "This product";
  return [
    {
      question: `What is ${baseQuestion}?`,
      answer: description || `Learn more about ${baseQuestion} from Tinkro.`,
    },
    {
      question: `What category does ${baseQuestion} belong to?`,
      answer: category || "STEM and robotics products",
    },
    {
      question: `Is ${baseQuestion} available for purchase?`,
      answer: "Yes, it is available through the Tinkro online store.",
    },
  ];
}

function ensureSeoFields(product: Partial<AdminProduct> & Record<string, unknown>) {
  const name = cleanText(product.name) || "Tinkro Product";
  const category = cleanText(product.category) || "STEM Products";
  const brand = cleanText(product.brand) || "Tinkro";
  const description = cleanText(product.description);
  const baseSlug = cleanText(product.seoSlug) || slugify(name);
  const seoProduct = {
    ...product,
    name,
    category,
    brand,
    description,
    seoSlug: baseSlug,
    metaTitle:
      cleanText(product.metaTitle) || `${name} | ${brand} ${category} | Tinkro`.slice(0, 60),
    metaDescription:
      cleanText(product.metaDescription) ||
      `${description || `Explore ${name} from Tinkro.`}`.slice(0, 155),
    focusKeyword: cleanText(product.focusKeyword) || name,
    keywords: Array.isArray(product.keywords) && product.keywords.length > 0
      ? (product.keywords as string[])
      : [name, category, brand].filter(Boolean),
    features: Array.isArray(product.features) && product.features.length > 0
      ? (product.features as string[])
      : [name, category].filter(Boolean),
    faqs:
      Array.isArray(product.faqs) && product.faqs.length > 0
        ? (product.faqs as Array<{ question: string; answer: string }>)
        : createFaqsFromProduct(product),
    openGraphTitle: cleanText(product.openGraphTitle) || cleanText(product.metaTitle) || `${name} | Tinkro`,
    openGraphDescription:
      cleanText(product.openGraphDescription) || cleanText(product.metaDescription) || description,
    twitterTitle: cleanText(product.twitterTitle) || cleanText(product.metaTitle) || `${name} | Tinkro`,
    twitterDescription:
      cleanText(product.twitterDescription) || cleanText(product.metaDescription) || description,
    imageAltText: cleanText(product.imageAltText) || `${name} image`,
  };

  return withProductSeoDefaults(seoProduct as Partial<AdminProduct> & Record<string, unknown>) as Partial<AdminProduct> & Record<string, unknown>;
}

export async function parseBulkImportFile(file: File): Promise<ParsedImportFile> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: "" }) as Array<Array<unknown>>;

  if (rows.length === 0) {
    return {
      headers: [],
      rows: [],
      sheetName,
      sourceFileName: file.name,
    };
  }

  const headers = rows[0].map((header) => cleanText(header));
  const dataRows = rows.slice(1).map((row) => {
    const item: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return item;
  });

  return {
    headers,
    rows: dataRows,
    sheetName,
    sourceFileName: file.name,
  };
}

function getExistingBlogLookup(articles: Array<AdminBlogPost & { id: string }>) {
  const bySlug = new Map<string, AdminBlogPost & { id: string }>();
  const bySeoSlug = new Map<string, AdminBlogPost & { id: string }>();
  const byTitle = new Map<string, AdminBlogPost & { id: string }>();

  articles.forEach((article) => {
    const slug = cleanText(article.slug).toLowerCase();
    const seoSlug = cleanText(article.seoSlug).toLowerCase();
    const title = cleanText(article.title).toLowerCase();
    if (slug) bySlug.set(slug, article);
    if (seoSlug) bySeoSlug.set(seoSlug, article);
    if (title) byTitle.set(title, article);
  });

  return { bySlug, bySeoSlug, byTitle };
}

function isValidUrl(value: unknown) {
  if (!hasValue(value)) return true;
  if (typeof value !== "string") return false;
  try {
    new URL(value.trim());
    return true;
  } catch {
    return false;
  }
}

function parseFaqItems(value: unknown) {
  if (!hasValue(value)) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === "object" && entry && "question" in entry && "answer" in entry) {
          return {
            question: cleanText((entry as Record<string, unknown>).question),
            answer: cleanText((entry as Record<string, unknown>).answer),
          };
        }
        return null;
      })
      .filter((entry): entry is { question: string; answer: string } => Boolean(entry?.question && entry.answer));
  }

  if (typeof value === "string") {
    return value
      .split(/[|,;\n]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [question, ...rest] = entry.split(":");
        return {
          question: cleanText(question),
          answer: cleanText(rest.join(":")),
        };
      })
      .filter((item) => item.question && item.answer);
  }

  return [];
}

const KNOWN_KH_CATEGORIES = [
  "Technology",
  "Education",
  "Products",
  "News",
  "Tutorial",
  "Robotics",
  "STEM",
  "Project",
  "Guide",
];

function buildBlogSlug(title: string, seoSlug?: string, slug?: string) {
  const candidate = cleanText(slug) || cleanText(seoSlug) || cleanText(title);
  if (!candidate) return "";
  return slugify(candidate);
}

export function validateBlogImportRows({
  rows,
  mapping,
  options,
  existingArticles,
}: {
  rows: Array<Record<string, unknown>>;
  mapping: ImportColumnMapping;
  options: BlogImportOptions;
  existingArticles: Array<AdminBlogPost & { id: string }>;
}): Promise<ImportValidationResult<AdminBlogPost>> {
  const validRows: ImportRowForValidation<AdminBlogPost>[] = [];
  const { bySlug, bySeoSlug, byTitle } = getExistingBlogLookup(existingArticles);
  const seenTitles = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenSeoSlugs = new Set<string>();

  rows.forEach((row, index) => {
    const issues: ImportIssue[] = [];
    const normalizedValues: Partial<AdminBlogPost> & Record<string, unknown> = {};

    BLOG_TARGET_FIELDS.forEach((field) => {
      const sourceHeader = mapping[field];
      if (!sourceHeader) return;
      const rawValue = row[sourceHeader];
      if (rawValue === null || rawValue === undefined || rawValue === "") return;

      switch (field) {
        case "readingTime": {
          const parsedReadingTime = toNumber(rawValue);
          if (parsedReadingTime === null) {
            issues.push({ row: index + 2, type: "error", message: `Invalid numeric value for readingTime: ${String(rawValue)}` });
          } else {
            normalizedValues.readingTime = Math.floor(parsedReadingTime);
          }
          break;
        }
        case "difficulty": {
          const normalizedDifficulty = normalizeDifficulty(rawValue);
          if (!normalizedDifficulty) {
            issues.push({ row: index + 2, type: "error", message: `Invalid difficulty. Allowed values: Beginner, Intermediate, Advanced.` });
          } else {
            normalizedValues.difficulty = normalizedDifficulty;
          }
          break;
        }
        case "robots": {
          const normalizedRobots = normalizeRobots(rawValue);
          if (!normalizedRobots) {
            issues.push({ row: index + 2, type: "error", message: `Invalid robots value. Allowed values: index,follow or noindex,nofollow.` });
          } else {
            normalizedValues.robots = normalizedRobots;
          }
          break;
        }
        case "lastUpdated": {
          const isoDate = toIsoDateIfValid(rawValue);
          if (!isoDate) {
            issues.push({ row: index + 2, type: "error", message: `Invalid date value for lastUpdated: ${String(rawValue)}` });
          } else {
            normalizedValues.lastUpdated = isoDate;
          }
          break;
        }
        case "faqItems":
          normalizedValues.faqItems = parseFaqItems(rawValue).map((item, idx) => ({ ...item, order: idx + 1 }));
          break;
        case "status": {
          const normalizedStatus = cleanText(rawValue).toLowerCase();
          normalizedValues.status = normalizedStatus as AdminBlogPost["status"];
          break;
        }
        case "ctaButtonLink": {
          const ctaUrl = cleanText(rawValue);
          normalizedValues.ctaButtonLink = ctaUrl;
          break;
        }
        case "estimatedProjectCost":
        case "estimatedBuildTime":
        case "aiSummary":
        case "skillLevel":
        case "ctaTitle":
        case "ctaDescription":
        case "ctaButtonText":
          normalizedValues[field as keyof AdminBlogPost] = cleanText(rawValue) as any;
          break;
        default:
          if (BLOG_ARRAY_FIELDS.has(field)) {
            normalizedValues[field as keyof AdminBlogPost] = toArray(rawValue) as any;
          } else {
            const normalizedValue = cleanText(rawValue);
            normalizedValues[field as keyof AdminBlogPost] = normalizedValue as any;
          }
          break;
      }
    });

    const title = cleanText(normalizedValues.title);
    const slug = buildBlogSlug(title, normalizedValues.seoSlug as string | undefined, normalizedValues.slug as string | undefined);
    const seoSlug = cleanText(normalizedValues.seoSlug) || slug;
    const category = cleanText(normalizedValues.category);
    const tags = Array.isArray(normalizedValues.tags) ? normalizedValues.tags : toArray(normalizedValues.tags);
    const status = (normalizedValues.status as string) || "";
    const readingTime = toNumber(normalizedValues.readingTime);
    const ctaTitle = cleanText(normalizedValues.ctaTitle);
    const ctaDescription = cleanText(normalizedValues.ctaDescription);
    const ctaButtonText = cleanText(normalizedValues.ctaButtonText);
    const ctaButtonLink = cleanText(normalizedValues.ctaButtonLink);
    const targetAudience = Array.isArray(normalizedValues.targetAudience) ? normalizedValues.targetAudience : toArray(normalizedValues.targetAudience);
    const keyTakeaways = Array.isArray(normalizedValues.keyTakeaways) ? normalizedValues.keyTakeaways : toArray(normalizedValues.keyTakeaways);

    if (!title) {
      issues.push({ row: index + 2, type: "error", message: "Missing required field: title." });
    }

    if (readingTime !== null && readingTime < 1) {
      issues.push({ row: index + 2, type: "error", message: `readingTime must be greater than or equal to 1.` });
    }

    if (hasValue(normalizedValues.difficulty) && !BLOG_ALLOWED_DIFFICULTIES.has(String(normalizedValues.difficulty))) {
      issues.push({ row: index + 2, type: "error", message: `Invalid difficulty. Allowed values: Beginner, Intermediate, Advanced.` });
    }

    if (hasValue(normalizedValues.robots) && !BLOG_ALLOWED_ROBOTS.has(String(normalizedValues.robots).toLowerCase().replace(/\s+/g, ""))) {
      issues.push({ row: index + 2, type: "error", message: `Invalid robots value. Allowed values: index,follow or noindex,nofollow.` });
    }

    if (seenTitles.has(title.toLowerCase())) {
      issues.push({ row: index + 2, type: "error", message: `Duplicate title detected: ${title}` });
    } else if (title) {
      seenTitles.add(title.toLowerCase());
    }

    if (slug) {
      if (seenSlugs.has(slug.toLowerCase())) {
        issues.push({ row: index + 2, type: "error", message: `Duplicate slug detected: ${slug}` });
      } else {
        seenSlugs.add(slug.toLowerCase());
      }
    }

    if (seoSlug) {
      if (seenSeoSlugs.has(seoSlug.toLowerCase())) {
        issues.push({ row: index + 2, type: "error", message: `Duplicate SEO slug detected: ${seoSlug}` });
      } else {
        seenSeoSlugs.add(seoSlug.toLowerCase());
      }
    }

    if (category && !KNOWN_KH_CATEGORIES.includes(category)) {
      issues.push({ row: index + 2, type: "warning", message: `Category ${category} may not be a valid Knowledge Hub category.` });
    }

    tags.forEach((tag) => {
      if (tag && !/^[-_\w\s]+$/.test(tag)) {
        issues.push({ row: index + 2, type: "warning", message: `Invalid tag format: ${tag}` });
      }
    });

    [
      "canonicalUrl",
      "openGraphTitle",
      "openGraphDescription",
      "twitterTitle",
      "twitterDescription",
      "twitterImage",
      "featuredImage",
      "thumbnail",
      "authorWebsite",
      "githubRepository",
      "sourceCodeUrl",
      "simulationUrl",
      "circuitDiagramUrl",
      "wiringDiagramUrl",
      "ctaButtonLink",
    ].forEach((field) => {
      const value = normalizedValues[field];
      if (hasValue(value) && !isValidUrl(value)) {
        issues.push({ row: index + 2, type: "error", message: `Invalid URL in ${field}: ${String(value)}` });
      }
    });

    if (hasValue(normalizedValues.lastUpdated) && !toIsoDateIfValid(normalizedValues.lastUpdated)) {
      issues.push({ row: index + 2, type: "error", message: `Invalid date value for lastUpdated: ${String(normalizedValues.lastUpdated)}` });
    }

    const allowedStatus = new Set(["draft", "published", "scheduled", "private"]);
    if (status && !allowedStatus.has(status)) {
      issues.push({ row: index + 2, type: "error", message: `Invalid publish status: ${status}` });
    }

    if (!hasValue(normalizedValues.readingTime)) {
      issues.push({ row: index + 2, type: "warning", message: "readingTime is missing." });
    }

    if (!targetAudience.length) {
      issues.push({ row: index + 2, type: "warning", message: "targetAudience is missing." });
    }

    if (!keyTakeaways.length) {
      issues.push({ row: index + 2, type: "warning", message: "keyTakeaways is missing." });
    }

    const hasAnyCta = Boolean(ctaTitle || ctaDescription || ctaButtonText || ctaButtonLink);
    if (!hasAnyCta) {
      issues.push({ row: index + 2, type: "warning", message: "CTA is missing." });
    }

    const existingArticle = slug && bySlug.get(slug.toLowerCase())
      ? bySlug.get(slug.toLowerCase())
      : seoSlug && bySeoSlug.get(seoSlug.toLowerCase())
      ? bySeoSlug.get(seoSlug.toLowerCase())
      : title && byTitle.get(title.toLowerCase())
      ? byTitle.get(title.toLowerCase())
      : null;

    let action: ImportRowForValidation<AdminBlogPost>["action"] = "skip";
    if (issues.some((issue) => issue.type === "error")) {
      action = "skip";
    } else if (existingArticle) {
      action = options.updateExistingArticles ? "update" : "skip";
    } else {
      action = options.createNewArticles ? "create" : "skip";
    }

    validRows.push({
      rowNumber: index + 2,
      sourceRow: row,
      normalizedValues: {
        ...normalizedValues,
        slug,
        seoSlug,
      },
      issues,
      action,
      existingProduct: existingArticle,
    });
  });

  return Promise.resolve({
    rows: validRows,
    summary: {
      rowsToCreate: validRows.filter((row) => row.action === "create").length,
      rowsToUpdate: validRows.filter((row) => row.action === "update").length,
      rowsToSkip: validRows.filter((row) => row.action === "skip").length,
      errors: validRows.reduce((count, row) => count + row.issues.filter((issue) => issue.type === "error").length, 0),
      warnings: validRows.reduce((count, row) => count + row.issues.filter((issue) => issue.type === "warning").length, 0),
    },
  });
}

function buildBlogPayload({
  row,
  options,
  existingArticle,
}: {
  row: ImportRowForValidation<AdminBlogPost>;
  options: BlogImportOptions;
  existingArticle?: (AdminBlogPost & { id: string }) | null;
}) {
  const baseArticle = existingArticle ? { ...existingArticle } : {};
  const merged: Partial<AdminBlogPost> & Record<string, unknown> = {
    ...baseArticle,
    ...row.normalizedValues,
  };

  const fieldsToApply = [
    "title",
    "slug",
    "seoSlug",
    "metaTitle",
    "metaDescription",
    "focusKeyword",
    "author",
    "authorBio",
    "authorImage",
    "authorLinkedIn",
    "authorGithub",
    "authorWebsite",
    "category",
    "categories",
    "subCategory",
    "articleType",
    "content",
    "excerpt",
    "summary",
    "featuredImage",
    "thumbnail",
    "images",
    "gallery",
    "featuredVideo",
    "status",
    "tags",
    "keywords",
    "secondaryKeywords",
    "canonicalUrl",
    "openGraphTitle",
    "openGraphDescription",
    "twitterTitle",
    "twitterDescription",
    "twitterImage",
    "programmingLanguage",
    "circuitDiagramUrl",
    "wiringDiagramUrl",
    "githubRepository",
    "sourceCodeUrl",
    "simulationUrl",
    "datasheets",
    "references",
    "relatedProducts",
    "recommendedProducts",
    "resources",
    "faqItems",
    "publishedAt",
    "publishedDate",
    "readingTime",
    "difficulty",
    "skillLevel",
    "targetAudience",
    "keyTakeaways",
    "prerequisites",
    "estimatedBuildTime",
    "estimatedProjectCost",
    "relatedBlogs",
    "ctaTitle",
    "ctaDescription",
    "ctaButtonText",
    "ctaButtonLink",
    "robots",
    "lastUpdated",
    "aiSummary",
  ]; 

  const filteredPayload: Partial<AdminBlogPost> & Record<string, unknown> = {};
  fieldsToApply.forEach((field) => {
    const value = merged[field as keyof typeof merged];
    if (hasValue(value)) {
      filteredPayload[field as keyof AdminBlogPost] = value as any;
    }
  });

  const finalPayload = {
    ...(existingArticle ? { ...existingArticle } : {}),
    ...filteredPayload,
    id: existingArticle?.id,
  } as Partial<AdminBlogPost> & Record<string, unknown>;

  return finalPayload;
}

export async function runBulkKnowledgeHubImport({
  rows,
  mapping,
  options,
  adminEmail,
  onProgress,
}: {
  rows: Array<Record<string, unknown>>;
  mapping: ImportColumnMapping;
  options: BlogImportOptions;
  adminEmail: string;
  onProgress?: (progress: number, message: string) => void;
}): Promise<{ report: ImportReport; validation: ImportValidationResult<AdminBlogPost> }> {
  const existingArticlesSnap = await getDocs(collection(db, "blogs"));
  const existingArticles = existingArticlesSnap.docs.map((document) => {
    const rawArticle = document.data() as Omit<AdminBlogPost, "id">;
    return { id: document.id, ...rawArticle } as AdminBlogPost & { id: string };
  });

  const validation = await validateBlogImportRows({
    rows,
    mapping,
    options,
    existingArticles,
  });

  if (options.dryRun) {
    return {
      validation,
      report: {
        sourceFileName: "dry-run",
        importType: "knowledgeHub",
        importDate: new Date().toISOString(),
        adminEmail,
        totalRows: rows.length,
        rowsImported: validation.summary.rowsToCreate + validation.summary.rowsToUpdate,
        created: validation.summary.rowsToCreate,
        updated: validation.summary.rowsToUpdate,
        skipped: validation.summary.rowsToSkip,
        failed: validation.summary.errors,
        durationMs: 0,
        warnings: validation.rows.flatMap((row) => row.issues.filter((issue) => issue.type === "warning")),
        errors: validation.rows.flatMap((row) => row.issues.filter((issue) => issue.type === "error")),
      },
    };
  }

  const start = Date.now();
  const report: ImportReport = {
    sourceFileName: "knowledge-hub-import",
    importType: "knowledgeHub",
    importDate: new Date().toISOString(),
    adminEmail,
    totalRows: rows.length,
    rowsImported: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    durationMs: 0,
    warnings: [],
    errors: [],
  };

  const rowsToProcess = validation.rows.filter((row) => row.action !== "skip");
  const batchSize = 50;

  for (let offset = 0; offset < rowsToProcess.length; offset += batchSize) {
    const batchRows = rowsToProcess.slice(offset, offset + batchSize);
    const batch = writeBatch(db);

    batchRows.forEach((row) => {
      const existingArticle = row.existingProduct;
      const payload = buildBlogPayload({ row, options, existingArticle });
      const entry = {
        ...payload,
        updatedAt: serverTimestamp(),
      } as Record<string, unknown>;

      if (existingArticle) {
        const articleRef = doc(db, "blogs", existingArticle.id);
        batch.update(articleRef, entry);
        report.updated += 1;
      } else {
        const articleRef = doc(collection(db, "blogs"));
        batch.set(articleRef, {
          ...entry,
          createdAt: serverTimestamp(),
          views: 0,
        });
        report.created += 1;
      }
      report.rowsImported += 1;
    });

    await batch.commit();
    const currentProgress = Math.round(((offset + batchRows.length) / Math.max(rowsToProcess.length, 1)) * 100);
    onProgress?.(currentProgress, `Processed ${Math.min(offset + batchRows.length, rowsToProcess.length)} of ${rowsToProcess.length} articles`);
  }

  report.skipped = validation.summary.rowsToSkip;
  report.failed = validation.summary.errors;
  report.durationMs = Date.now() - start;
  report.warnings = validation.rows.flatMap((row) => row.issues.filter((issue) => issue.type === "warning"));
  report.errors = validation.rows.flatMap((row) => row.issues.filter((issue) => issue.type === "error"));

  return { report, validation };
}

export function validateBulkImportRows({
  rows,
  mapping,
  options,
  existingProducts,
  categories,
}: {
  rows: Array<Record<string, unknown>>;
  mapping: ImportColumnMapping;
  options: ImportOptions;
  existingProducts: Array<AdminProduct & { id: string }>;
  categories: Array<Pick<AdminCategory, "id" | "name" | "slug">>;
}): ImportValidationResult {
  const validRows: ImportRowForValidation[] = [];
  const seenSkus = new Set<string>();
  const existingSkuMap = new Map<string, (AdminProduct & { id: string })[]>();
  const existingNameMap = new Map<string, (AdminProduct & { id: string })[]>();
  for (const product of existingProducts) {
    const skuKey = cleanText(product.sku).toLowerCase();
    const nameKey = cleanText(product.name).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (skuKey) {
      const matches = existingSkuMap.get(skuKey) ?? [];
      matches.push(product);
      existingSkuMap.set(skuKey, matches);
    }
    if (nameKey) {
      const matches = existingNameMap.get(nameKey) ?? [];
      matches.push(product);
      existingNameMap.set(nameKey, matches);
    }
  }
  const categoryNames = new Set(categories.map((category) => (normalizeCategoryKey(category.name)[0] || "")));
  const categoryIds = new Set(categories.map((category) => cleanText(category.id).toLowerCase()));
  function normalizeCategoryKey(value: string) {
    const base = cleanText(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
    if (!base) return "";
    const singular = base.endsWith("s") ? base.slice(0, -1) : base;
    const plural = base.endsWith("s") ? base : `${base}s`;
    return [base, singular, plural];
  }

  const categoryByNameOrSlug = new Map<string, Pick<AdminCategory, "id" | "name" | "slug">>();
  categories.forEach((category) => {
    const keys = [...normalizeCategoryKey(category.name), ...normalizeCategoryKey(category.slug)];
    keys.forEach((k) => {
      if (k) categoryByNameOrSlug.set(k, category);
    });
  });

  rows.forEach((row, index) => {
    const issues: ImportIssue[] = [];
    const normalizedValues: Partial<AdminProduct> & Record<string, unknown> = {};

    TARGET_FIELDS.forEach((field) => {
      const sourceHeader = mapping[field];
      if (!sourceHeader) return;
      const rawValue = row[sourceHeader];
      if (rawValue === null || rawValue === undefined || rawValue === "") return;

      switch (field) {
        case "price":
          const priceValue = toNumber(rawValue);
          if (priceValue === null && typeof rawValue === "string" && rawValue.trim() !== "") {
            issues.push({
              row: index + 2,
              type: "error",
              message: `Invalid numeric value for price: ${String(rawValue)}`,
            });
          } else {
            normalizedValues.price = priceValue ?? 0;
          }
          break;
        case "originalPrice":
          const originalPriceValue = toNumber(rawValue);
          if (originalPriceValue === null && typeof rawValue === "string" && rawValue.trim() !== "") {
            issues.push({
              row: index + 2,
              type: "error",
              message: `Invalid numeric value for MRP/originalPrice: ${String(rawValue)}`,
            });
          } else {
            normalizedValues.originalPrice = originalPriceValue ?? 0;
          }
          break;
        case "discount":
          const discountValue = toNumber(rawValue);
          if (discountValue === null && typeof rawValue === "string" && rawValue.trim() !== "") {
            issues.push({
              row: index + 2,
              type: "error",
              message: `Invalid numeric value for discount: ${String(rawValue)}`,
            });
          } else {
            normalizedValues.discount = discountValue ?? 0;
          }
          break;
        case "stock":
          const stockValue = toNumber(rawValue);
          if (stockValue === null && typeof rawValue === "string" && rawValue.trim() !== "") {
            issues.push({
              row: index + 2,
              type: "error",
              message: `Invalid numeric value for stock: ${String(rawValue)}`,
            });
          } else {
            normalizedValues.stock = Math.max(0, stockValue ?? 0);
          }
          break;
        case "features":
          normalizedValues.features = toArray(rawValue);
          break;
        case "images":
          normalizedValues.images = toArray(rawValue);
          break;
        case "gallery":
          normalizedValues.gallery = toArray(rawValue);
          break;
        case "downloads":
          normalizedValues.downloads = toArray(rawValue);
          break;
        case "documents":
          normalizedValues.documents = toArray(rawValue);
          break;
        case "certifications":
          normalizedValues.certifications = toArray(rawValue);
          break;
        case "compatibility":
          normalizedValues.compatibility = toArray(rawValue);
          break;
        case "applications":
          normalizedValues.applications = toArray(rawValue);
          break;
        case "packageContents":
          normalizedValues.packageContents = toArray(rawValue);
          break;
        case "keywords":
          normalizedValues.keywords = toArray(rawValue);
          break;
        case "tags":
          normalizedValues.tags = toArray(rawValue);
          break;
        case "specifications":
          normalizedValues.specifications = toSpecifications(rawValue);
          break;
        case "faq":
          normalizedValues.faqs = toFaqs(rawValue);
          break;
        case "categoryId":
          normalizedValues.categoryId = cleanText(rawValue);
          break;
        case "categoryIds":
          normalizedValues.categoryIds = toArray(rawValue);
          break;
        case "availability":
          normalizedValues.inStock = cleanText(rawValue).toLowerCase() === "true" || cleanText(rawValue).toLowerCase() === "yes" || cleanText(rawValue).toLowerCase() === "available" || cleanText(rawValue).toLowerCase() === "instock";
          break;
        case "currency":
          normalizedValues.currency = cleanText(rawValue);
          break;
        case "imageAltText":
          normalizedValues.imageAltText = cleanText(rawValue);
          break;
        default:
          normalizedValues[field] = cleanText(rawValue);
          break;
      }
      });

      // no runtime tracing

    const name = cleanText(normalizedValues.name);
    const sku = cleanText(normalizedValues.sku);
    const category = cleanText(normalizedValues.category);
    const categoryId = cleanText(normalizedValues.categoryId);
    const categoryIdsValue = Array.isArray(normalizedValues.categoryIds)
      ? normalizedValues.categoryIds.map((value) => cleanText(value)).filter(Boolean)
      : [];
    const price = toNumber(normalizedValues.price);

    // Derive categoryId/categoryIds from category name if needed
    const normalizedCategoryValue = (normalizeCategoryKey(category)[0] || "");
    if (!categoryId && normalizedCategoryValue) {
      const matchedCategory = categoryByNameOrSlug.get(normalizedCategoryValue);
      if (matchedCategory) {
        normalizedValues.categoryId = matchedCategory.id;
        if (!categoryIdsValue.length) {
          normalizedValues.categoryIds = [matchedCategory.id];
        }
      }
    }

    if (!category && categoryId) {
      const categoryMatch = categories.find((cat) => cleanText(cat.id).toLowerCase() === categoryId.toLowerCase());
      if (categoryMatch) {
        normalizedValues.category = categoryMatch.name;
      }
    }

    if (!categoryId && categoryIdsValue.length) {
      normalizedValues.categoryId = categoryIdsValue[0];
    }

    const derivedCategoryId = cleanText(normalizedValues.categoryId);
    const derivedCategoryIds = Array.isArray(normalizedValues.categoryIds)
      ? normalizedValues.categoryIds.map((value) => cleanText(value)).filter(Boolean)
      : [];

    if (derivedCategoryId && !categoryIds.has(derivedCategoryId.toLowerCase())) {
      issues.push({
        row: index + 2,
        type: "warning",
        message: `Category ID ${derivedCategoryId} does not match an existing category.`,
      });
    }

    if (category && !categoryNames.has(normalizeCategoryKey(category)[0] || "") && !derivedCategoryId) {
      issues.push({
        row: index + 2,
        type: "warning",
        message: `Category ${category} does not match an existing category.`,
      });
    }

    if (!sku || !name) {
      issues.push({
        row: index + 2,
        type: "error",
        message: "Missing required field(s): SKU or Product Name.",
      });
    }

    if (!category && !categoryId && categoryIdsValue.length === 0) {
      issues.push({
        row: index + 2,
        type: "warning",
        message: "No category information provided. Product will be created without assigned categories.",
      });
    }

    if (sku && seenSkus.has(sku.toLowerCase())) {
      issues.push({
        row: index + 2,
        type: "error",
        message: `Duplicate SKU detected: ${sku}`,
      });
    } else if (sku) {
      seenSkus.add(sku.toLowerCase());
    }

    if (category && !categoryNames.has(normalizeCategoryKey(category)[0] || "")) {
      issues.push({
        row: index + 2,
        type: "warning",
        message: `Category ${category} does not match an existing category.`,
      });
    }

    if (price !== null && price < 0) {
      issues.push({
        row: index + 2,
        type: "error",
        message: `Invalid price value: ${price}`,
      });
    }

    const normalizedSku = sku.toLowerCase();
    const skuMatches = normalizedSku ? existingSkuMap.get(normalizedSku) ?? [] : [];
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const nameMatches = normalizedName ? existingNameMap.get(normalizedName) ?? [] : [];
    let existingProduct = skuMatches.length === 1 ? skuMatches[0] : undefined;

    if (skuMatches.length > 1) {
      issues.push({
        row: index + 2,
        type: "error",
        message: `SKU ${sku} already exists on ${skuMatches.length} Firestore products. Import stopped for this row to prevent updating the wrong product.`,
      });
      existingProduct = undefined;
    }

    // A SKU is the update key, but the name is a second identity check. If a
    // file row's SKU belongs to one product and its exact name belongs to a
    // different product, silently writing the row would swap product data.
    if (existingProduct && nameMatches.length === 1 && nameMatches[0].id !== existingProduct.id) {
      issues.push({
        row: index + 2,
        type: "error",
        message: `SKU/name mismatch: SKU ${sku} belongs to “${existingProduct.name}”, but the row name is “${name}”, which belongs to another product. Correct the file before importing.`,
      });
    }

    // Also catch shortened Catalog names (for example, "DIY Drone Kit")
    // whose exact text is not stored on Firestore. If the row clearly matches
    // another product but has no meaningful overlap with the SKU's product,
    // block it instead of allowing a silent SKU/name swap.
    if (existingProduct) {
      const currentNameScore = productNameMatchScore(name, existingProduct.name);
      let bestOtherMatch: { product: AdminProduct & { id: string }; score: number } | null = null;
      for (const candidate of existingProducts) {
        if (candidate.id === existingProduct.id) continue;
        const score = productNameMatchScore(name, candidate.name);
        if (!bestOtherMatch || score > bestOtherMatch.score) {
          bestOtherMatch = { product: candidate, score };
        }
      }
      if (
        bestOtherMatch &&
        bestOtherMatch.score >= 0.5 &&
        bestOtherMatch.score - currentNameScore >= 0.25
      ) {
        issues.push({
          row: index + 2,
          type: "error",
          message: `Likely SKU/name swap: row name “${name}” matches “${bestOtherMatch.product.name}” (${bestOtherMatch.product.sku}), not the product currently assigned to SKU ${sku}.`,
        });
      }
    }

    if (
      (mapping.images && hasValue(normalizedValues.images)) ||
      (mapping.gallery && hasValue(normalizedValues.gallery))
    ) {
      issues.push({
        row: index + 2,
        type: "warning",
        message: "Image/gallery values were provided, but bulk product import does not write images. Verify media separately before importing.",
      });
    }

    if (!existingProduct && nameMatches.length > 1 && skuMatches.length === 0) {
      issues.push({
        row: index + 2,
        type: "error",
        message: `Product name “${name}” matches multiple Firestore products. A unique name or document ID is required for a safe repair.`,
      });
    }

    let action: ImportRowForValidation["action"] = "skip";
    if (issues.some((issue) => issue.type === "error")) {
      action = "skip";
    } else if (existingProduct) {
      if (options.replaceExistingProducts) {
        action = "update";
      } else if (options.updateOnlySeo) {
        action = "update";
      } else if (options.updateOnlyPrice) {
        action = "update";
      } else if (options.updateOnlyStock) {
        action = "update";
      } else if (options.skipExistingProducts) {
        action = "skip";
      } else if (options.updateExistingProducts) {
        action = "update";
      } else {
        action = "skip";
      }
    } else if (options.createNewProducts) {
      action = "create";
    }

    validRows.push({
      rowNumber: index + 2,
      sourceRow: row,
      normalizedValues,
      issues,
      action,
      existingProduct: existingProduct ? { ...existingProduct, id: existingProduct.id } : null,
    });
  });

  return {
    rows: validRows,
    summary: {
      rowsToCreate: validRows.filter((row) => row.action === "create").length,
      rowsToUpdate: validRows.filter((row) => row.action === "update").length,
      rowsToSkip: validRows.filter((row) => row.action === "skip").length,
      errors: validRows.reduce((count, row) => count + row.issues.filter((issue) => issue.type === "error").length, 0),
      warnings: validRows.reduce((count, row) => count + row.issues.filter((issue) => issue.type === "warning").length, 0),
    },
  };
}

function buildImportPayload({
  row,
  options,
  existingProduct,
}: {
  row: ImportRowForValidation;
  options: ImportOptions;
  existingProduct?: (AdminProduct & { id: string }) | null;
}) {
  const baseProduct = existingProduct ? { ...existingProduct } : {};
  // merged is only used as a convenience; presence of a field in row.normalizedValues
  // indicates the Excel provided a value. We must avoid overwriting existing
  // Firestore values with empty Excel values and merge arrays intelligently.
  const merged: Partial<AdminProduct> & Record<string, unknown> = {
    ...baseProduct,
    ...(row.normalizedValues as Partial<AdminProduct> & Record<string, unknown>),
  };

  // Trace logging for first SKU
  // no runtime tracing

  const fieldsToApply = options.updateOnlySeo
    ? [
        "metaTitle",
        "metaDescription",
        "focusKeyword",
        "keywords",
        "seoSlug",
        "canonicalUrl",
        "openGraphTitle",
        "openGraphDescription",
        "twitterTitle",
        "twitterDescription",
        "brand",
        "subCategory",
        "description",
        "name",
        "category",
        "categoryId",
        "categoryIds",
      ]
    : options.updateOnlyPrice
      ? ["price", "originalPrice", "discount"]
      : options.updateOnlyStock
        ? ["stock", "inStock"]
        : [
            "name",
            "description",
            "overview",
            "price",
            "originalPrice",
            "category",
            "categoryId",
            "categoryIds",
            "subCategory",
            "brand",
            "metaTitle",
            "metaDescription",
            "focusKeyword",
            "keywords",
            "seoSlug",
            "canonicalUrl",
            "openGraphTitle",
            "openGraphDescription",
            "twitterTitle",
            "twitterDescription",
            "features",
            "specifications",
            "compatibility",
            "applications",
            "packageContents",
            "faqs",
            "tags",
            "skillLevel",
            "stock",
            "discount",
            "gtin",
            "mpn",
            "warranty",
            "material",
            "weight",
            "dimensions",
            "countryOfOrigin",
            "manufacturer",
            "difficulty",
            "inStock",
            "currency",
            "imageAltText",
            "sku",
          ];

  const filteredPayload: Partial<AdminProduct> & Record<string, unknown> = {};
  const ARRAY_FIELDS = new Set<string>([
    "features",
    "tags",
    "applications",
    "compatibility",
    "packageContents",
    "keywords",
    ...EXTENDED_ARRAY_FIELDS,
  ]);

  fieldsToApply.forEach((field) => {
    const hadExcel = Object.prototype.hasOwnProperty.call(row.normalizedValues, field);
    const existingValue = existingProduct ? (existingProduct as unknown as Record<string, unknown>)[field] : undefined;
    const newValue = (row.normalizedValues as Record<string, unknown>)[field];

    // Array fields: merge existing + new (remove duplicates) unless replaceExistingProducts is true
    if (ARRAY_FIELDS.has(field)) {
      const existingArray = Array.isArray(existingValue) ? existingValue.slice() as string[] : [];
      const providedArray = Array.isArray(newValue) ? newValue as string[] : [];

      if (existingArray.length > 0 && !hadExcel) {
        // Excel did not provide a value; preserve existing array
        filteredPayload[field as keyof AdminProduct] = existingArray as any;
      } else if (options.replaceExistingProducts) {
        // Replace existing entirely if option set and Excel provided values
        if (hadExcel) filteredPayload[field as keyof AdminProduct] = providedArray as any;
      } else {
        // Merge unique values (Excel may add new entries)
        const mergedArr = Array.from(new Set([...(existingArray || []), ...(providedArray || [])])).filter(Boolean);
        if (mergedArr.length > 0) filteredPayload[field as keyof AdminProduct] = mergedArr as any;
      }

      return;
    }

    // Non-array fields: only apply if Excel provided a non-empty value (preserve existing otherwise)
    if (hadExcel) {
      const value = (merged as Record<string, unknown>)[field];
      if (hasValue(value)) {
        filteredPayload[field as keyof AdminProduct] = value as any;
      }
    } else if (existingProduct) {
      // preserve existing product's value when Excel did not provide the field
      const value = existingValue;
      if (hasValue(value)) filteredPayload[field as keyof AdminProduct] = value as any;
    }
  });

  const payloadWithExisting = {
    ...(existingProduct ? { ...existingProduct } : {}),
    ...filteredPayload,
    id: existingProduct?.id,
  } as Partial<AdminProduct> & Record<string, unknown>;

  if (!existingProduct) {
    payloadWithExisting.price = hasValue(payloadWithExisting.price)
      ? payloadWithExisting.price
      : 0;
    payloadWithExisting.originalPrice = hasValue(payloadWithExisting.originalPrice)
      ? payloadWithExisting.originalPrice
      : 0;
    payloadWithExisting.stock = hasValue(payloadWithExisting.stock)
      ? payloadWithExisting.stock
      : 0;
    payloadWithExisting.discount = hasValue(payloadWithExisting.discount)
      ? payloadWithExisting.discount
      : 0;
    payloadWithExisting.inStock = hasValue(payloadWithExisting.inStock)
      ? payloadWithExisting.inStock
      : false;
    // Ensure new products are visible/active by default unless Excel provides explicit values.
    payloadWithExisting.isActive = hasValue(payloadWithExisting.isActive)
      ? payloadWithExisting.isActive
      : true;
    payloadWithExisting.status = hasValue(payloadWithExisting.status)
      ? payloadWithExisting.status
      : "active";
    payloadWithExisting.visibility = hasValue(payloadWithExisting.visibility)
      ? payloadWithExisting.visibility
      : "public";
    payloadWithExisting.published = hasValue(payloadWithExisting.published)
      ? payloadWithExisting.published
      : true;
    payloadWithExisting.availability = hasValue(payloadWithExisting.availability)
      ? payloadWithExisting.availability
      : "in_stock";
  }

  // Log payload details for the traced SKU
  // no runtime tracing

  const withSeo = options.generateMissingSeo
    ? ensureSeoFields(payloadWithExisting)
    : payloadWithExisting;

  const { id: _id, ...productPayload } = withSeo as Partial<AdminProduct> & Record<string, unknown>;
  return productPayload;
}

export async function runBulkProductImport({
  rows,
  mapping,
  options,
  adminEmail,
  onProgress,
}: {
  rows: Array<Record<string, unknown>>;
  mapping: ImportColumnMapping;
  options: ImportOptions;
  adminEmail: string;
  onProgress?: (progress: number, message: string) => void;
}): Promise<{ report: ImportReport; validation: ImportValidationResult }> {
  const existingProductsSnap = await getDocs(collection(db, "products"));
  const existingProducts = existingProductsSnap.docs.map((document) => {
    const rawProduct = document.data() as Omit<AdminProduct, "id">;
    return { id: document.id, ...rawProduct } as AdminProduct & { id: string };
  });
  const categoriesSnap = await getDocs(collection(db, "categories"));
  const categories = categoriesSnap.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      name: (data.name as string) || "",
      slug: (data.slug as string) || "",
    };
  });

  const validation = await validateBulkImportRows({
    rows,
    mapping,
    options,
    existingProducts,
    categories,
  });

  if (options.dryRun) {
    return {
      validation,
      report: {
        sourceFileName: "dry-run",
        importType: "products",
        importDate: new Date().toISOString(),
        adminEmail,
        totalRows: rows.length,
        rowsImported: validation.summary.rowsToCreate + validation.summary.rowsToUpdate,
        created: validation.summary.rowsToCreate,
        updated: validation.summary.rowsToUpdate,
        skipped: validation.summary.rowsToSkip,
        failed: validation.summary.errors,
        durationMs: 0,
        warnings: validation.rows.flatMap((row) => row.issues.filter((issue) => issue.type === "warning")),
        errors: validation.rows.flatMap((row) => row.issues.filter((issue) => issue.type === "error")),
      },
    };
  }

  const start = Date.now();
  const report: ImportReport = {
    sourceFileName: "bulk-import",
    importType: "products",
    importDate: new Date().toISOString(),
    adminEmail,
    totalRows: rows.length,
    rowsImported: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    durationMs: 0,
    warnings: [],
    errors: [],
  };

  const rowsToProcess = validation.rows.filter((row) => row.action !== "skip");
  const batchSize = 50;

  for (let offset = 0; offset < rowsToProcess.length; offset += batchSize) {
    const batchRows = rowsToProcess.slice(offset, offset + batchSize);
    const batch = writeBatch(db);

    batchRows.forEach((row) => {
      const existingProduct = row.existingProduct;
      const payload = buildImportPayload({ row, options, existingProduct });
      const entry = {
        ...payload,
        createdAt: existingProduct ? payload.createdAt ?? serverTimestamp() : serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as Record<string, unknown>;

      // Log Firestore write payload for traced SKU
      // no runtime tracing

      if (existingProduct) {
        const productRef = doc(db, "products", existingProduct.id);
        const { createdAt, ...updateEntry } = entry;
        batch.update(productRef, updateEntry);
        report.updated += 1;
      } else {
        const productRef = doc(collection(db, "products"));
        batch.set(productRef, entry);
        report.created += 1;
      }
      report.rowsImported += 1;
    });

    await batch.commit();
    const currentProgress = Math.round(((offset + batchRows.length) / Math.max(rowsToProcess.length, 1)) * 100);
    onProgress?.(currentProgress, `Imported ${Math.min(offset + batchRows.length, rowsToProcess.length)} of ${rowsToProcess.length} products`);
  }

  report.skipped = validation.summary.rowsToSkip;
  report.failed = validation.summary.errors;
  report.durationMs = Date.now() - start;
  report.warnings = validation.rows.flatMap((row) => row.issues.filter((issue) => issue.type === "warning"));
  report.errors = validation.rows.flatMap((row) => row.issues.filter((issue) => issue.type === "error"));

  return { report, validation };
}

export function downloadImportReport(report: ImportReport) {
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bulk-import-report-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function readImportHistory() {
  try {
    const stored = window.localStorage.getItem("tinkro-bulk-import-history");
    return stored ? (JSON.parse(stored) as ImportReport[]) : [];
  } catch {
    return [];
  }
}

export function saveImportHistory(report: ImportReport) {
  const history = readImportHistory();
  const nextHistory = [report, ...history].slice(0, 10);
  window.localStorage.setItem("tinkro-bulk-import-history", JSON.stringify(nextHistory));
}
