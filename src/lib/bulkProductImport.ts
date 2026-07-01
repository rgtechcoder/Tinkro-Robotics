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
import type { AdminCategory, AdminProduct } from "@/types/admin";

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

export interface ImportRowForValidation {
  rowNumber: number;
  sourceRow: Record<string, unknown>;
  normalizedValues: Partial<AdminProduct> & Record<string, unknown>;
  issues: ImportIssue[];
  action: "create" | "update" | "skip";
  existingProduct?: (AdminProduct & { id: string }) | null;
}

export interface ImportValidationResult {
  rows: ImportRowForValidation[];
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
  importDate: string;
  adminEmail: string;
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
] as const;

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
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
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

export function getAutoColumnMapping(headers: string[]): ImportColumnMapping {
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));
  const normalizedToHeader = new Map<string, string>();
  headers.forEach((header, index) => normalizedToHeader.set(normalizedHeaders[index], header));

  const mapping: ImportColumnMapping = {};

  TARGET_FIELDS.forEach((field) => {
    const aliases = FIELD_ALIASES[field] ?? [];
    const matchedNormalized = normalizedHeaders.find((header) => aliases.includes(header));
    mapping[field] = matchedNormalized ? normalizedToHeader.get(matchedNormalized) ?? null : null;
  });

  return mapping;
}

export async function validateBulkImportRows({
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
}): Promise<ImportValidationResult> {
  const validRows: ImportRowForValidation[] = [];
  const seenSkus = new Set<string>();
  const existingSkuMap = new Map(existingProducts.map((product) => [cleanText(product.sku).toLowerCase(), product]));
  const categoryNames = new Set(categories.map((category) => cleanText(category.name).toLowerCase()));
  const categoryIds = new Set(categories.map((category) => cleanText(category.id).toLowerCase()));
  const categoryByNameOrSlug = new Map<string, Pick<AdminCategory, "id" | "name" | "slug">>();
  categories.forEach((category) => {
    categoryByNameOrSlug.set(cleanText(category.name).toLowerCase(), category);
    categoryByNameOrSlug.set(cleanText(category.slug).toLowerCase(), category);
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

    const name = cleanText(normalizedValues.name);
    const sku = cleanText(normalizedValues.sku);
    const category = cleanText(normalizedValues.category);
    const categoryId = cleanText(normalizedValues.categoryId);
    const categoryIdsValue = Array.isArray(normalizedValues.categoryIds)
      ? normalizedValues.categoryIds.map((value) => cleanText(value)).filter(Boolean)
      : [];
    const price = toNumber(normalizedValues.price);

    // Derive categoryId/categoryIds from category name if needed
    const normalizedCategoryValue = category.toLowerCase();
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

    if (category && !categoryNames.has(category.toLowerCase()) && !derivedCategoryId) {
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

    if (category && !categoryNames.has(category.toLowerCase())) {
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
    const existingProduct = normalizedSku ? existingSkuMap.get(normalizedSku) : undefined;

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
  const merged: Partial<AdminProduct> & Record<string, unknown> = {
    ...baseProduct,
    ...(row.normalizedValues as Partial<AdminProduct> & Record<string, unknown>),
  };

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
  fieldsToApply.forEach((field) => {
    const value = (merged as Record<string, unknown>)[field];
    if (hasValue(value)) {
      filteredPayload[field] = value;
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
  }

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
        importDate: new Date().toISOString(),
        adminEmail,
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
    importDate: new Date().toISOString(),
    adminEmail,
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
