const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE = path.join(__dirname, '..', 'bulk-import-test.xlsx');
if (!fs.existsSync(FILE)) {
  console.error('File not found:', FILE);
  process.exit(2);
}

const TARGET_FIELDS = [
  "sku","name","category","categoryId","categoryIds","price","description","overview","subCategory","brand","metaTitle","metaDescription","focusKeyword","keywords","seoSlug","canonicalUrl","openGraphTitle","openGraphDescription","twitterTitle","twitterDescription","features","specifications","compatibility","applications","packageContents","faq","tags","skillLevel","stock","originalPrice","discount","availability","currency","imageAltText","gtin","mpn","warranty","material","weight","dimensions","countryOfOrigin","manufacturer","difficulty","images","gallery","downloads","documents","certifications"
];

const FIELD_ALIASES = {
  sku: ["sku","productsku","itemsku","item_sku"],
  name: ["name","productname","product_name","title"],
  category: ["category","productcategory","product_category"],
  categoryId: ["categoryid","category_id","category id","catid","categoryidentifier"],
  categoryIds: ["categoryids","category_ids","category ids","categories","category_list","categorylist"],
  price: ["price","unitprice","sellingprice","saleprice"],
  description: ["description","productdescription","product_description"],
  overview: ["overview","shortoverview","short_overview"],
  subCategory: ["subcategory","sub_category","subcat"],
  brand: ["brand","manufacturerbrand","vendor"],
  metaTitle: ["metatitle","meta_title","seo_title"],
  metaDescription: ["metadescription","meta_description","seo_description"],
  focusKeyword: ["focuskeyword","focus_keyword","focus_keyword_phrase"],
  keywords: ["keywords","seo_keywords","tags"],
  seoSlug: ["seoslug","slug","seo_slug"],
  canonicalUrl: ["canonicalurl","canonical_url","canonical"],
  openGraphTitle: ["opengraphtitle","ogtitle","og_title"],
  openGraphDescription: ["opengraphdescription","ogdescription","og_description"],
  twitterTitle: ["twittertitle","twitter_title"],
  twitterDescription: ["twitterdescription","twitter_description"],
  features: ["features","productfeatures","highlights"],
  specifications: ["specifications","specs"],
  compatibility: ["compatibility","compatiblewith"],
  applications: ["applications","usecases","uses"],
  packageContents: ["packagecontents","contents","whatsincluded"],
  faq: ["faq","faqs","frequentlyaskedquestions"],
  tags: ["tags","customtags"],
  skillLevel: ["skilllevel","skill_level"],
  stock: ["stock","stockquantity","availablequantity","quantity"],
  originalPrice: ["originalprice","mrp","listprice"],
  discount: ["discount","discountpercent","discount_percentage"],
  availability: ["availability","status","instock"],
  currency: ["currency","currencycode"],
  imageAltText: ["imagealttext","alttext","image_alt_text"],
  images: ["images","image urls","image_urls","image list","gallery images"],
  gallery: ["gallery","gallery images","gallery_images"],
  downloads: ["downloads","download_urls","download links"],
  documents: ["documents","document urls","document_links"],
  gtin: ["gtin","ean","barcode"],
  mpn: ["mpn","partnumber"],
  warranty: ["warranty"],
  material: ["material"],
  weight: ["weight"],
  dimensions: ["dimensions","size"],
  countryOfOrigin: ["countryoforigin","country","origin"],
  manufacturer: ["manufacturer","vendor"],
  difficulty: ["difficulty"]
};

function normalizeHeader(value) {
  return String(value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '_');
}
function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}
function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}
function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    let str = value.replace(/\u00A0/g, ' ').trim();
    if (!str) return null;
    str = str.replace(/[^\d\.\-,()]/g, '');
    let negative = false;
    if (/^\(.+\)$/.test(str)) {
      negative = true;
      str = str.replace(/^\(|\)$/g, '');
    }
    str = str.replace(/,/g, '');
    if (!str) return null;
    const parsed = Number(str);
    if (!Number.isFinite(parsed)) return null;
    return negative ? -parsed : parsed;
  }
  return null;
}
function toArray(value) {
  if (Array.isArray(value)) return value.map(e=>cleanText(e)).filter(Boolean);
  if (typeof value === 'string') return value.split(/[|,;\n]+/).map(e=>cleanText(e)).filter(Boolean);
  return [];
}

// read file
const workbook = XLSX.readFile(FILE, { cellDates: false });
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: '' });
if (!rows || rows.length === 0) {
  console.error('No rows in sheet');
  process.exit(2);
}
const headers = rows[0].map(h => cleanText(h));
const dataRows = rows.slice(1).map(r => {
  const item = {};
  headers.forEach((h, i) => item[h] = r[i]);
  return item;
});
if (dataRows.length === 0) {
  console.error('No data rows');
  process.exit(2);
}

// build mapping
const normalizedHeaders = headers.map(h => normalizeHeader(h));
const normalizedToHeader = new Map();
headers.forEach((header, idx) => normalizedToHeader.set(normalizedHeaders[idx], header));

const mapping = {};
TARGET_FIELDS.forEach(field => {
  const fieldAliases = (FIELD_ALIASES[field] || []).map(a => normalizeHeader(a));
  fieldAliases.push(normalizeHeader(field));
  // Try exact normalized match first, then substring fallback (handles "Price (INR)")
  let matchedNormalized = normalizedHeaders.find(h => fieldAliases.includes(h));
  if (!matchedNormalized) {
    matchedNormalized = normalizedHeaders.find(h => fieldAliases.some(alias => h.split('_').includes(alias)));
  }
  mapping[field] = matchedNormalized ? (normalizedToHeader.get(matchedNormalized) || null) : null;
});

console.log('Headers and mapping:');
headers.forEach(h => console.log('  -', h));
console.log('\nAuto mapping (field -> Excel header):');
Object.keys(mapping).forEach(f => { if (mapping[f]) console.log(`${f} -> ${mapping[f]}`); });

// trace first data row
const row = dataRows[0];
console.log('\n--- First data row raw entries ---');
Object.keys(row).forEach(k => console.log(`${k}: (${typeof row[k]}) -> ${JSON.stringify(row[k])}`));

// normalizedValues build (replicate validation switch)
const normalizedValues = {};
const issues = [];
TARGET_FIELDS.forEach(field => {
  const sourceHeader = mapping[field];
  if (!sourceHeader) return;
  const rawValue = row[sourceHeader];
  if (rawValue === null || rawValue === undefined || rawValue === '') return;
  switch(field) {
    case 'price': {
      const priceValue = toNumber(rawValue);
      console.log(`\n[TRACE] price raw="${String(rawValue)}" (type=${typeof rawValue}) parsed=${priceValue}`);
      if (priceValue === null && typeof rawValue === 'string' && rawValue.trim() !== '') {
        issues.push({row:2,type:'error',message:`Invalid numeric value for price: ${String(rawValue)}`});
      } else {
        normalizedValues.price = priceValue ?? 0;
      }
      break;
    }
    case 'originalPrice': {
      const originalPriceValue = toNumber(rawValue);
      console.log(`\n[TRACE] originalPrice raw="${String(rawValue)}" (type=${typeof rawValue}) parsed=${originalPriceValue}`);
      if (originalPriceValue === null && typeof rawValue === 'string' && rawValue.trim() !== '') {
        issues.push({row:2,type:'error',message:`Invalid numeric value for MRP/originalPrice: ${String(rawValue)}`});
      } else {
        normalizedValues.originalPrice = originalPriceValue ?? 0;
      }
      break;
    }
    case 'stock': {
      const stockValue = toNumber(rawValue);
      console.log(`\n[TRACE] stock raw="${String(rawValue)}" (type=${typeof rawValue}) parsed=${stockValue}`);
      if (stockValue === null && typeof rawValue === 'string' && rawValue.trim() !== '') {
        issues.push({row:2,type:'error',message:`Invalid numeric value for stock: ${String(rawValue)}`});
      } else {
        normalizedValues.stock = Math.max(0, stockValue ?? 0);
      }
      break;
    }
    case 'discount': {
      const discountValue = toNumber(rawValue);
      console.log(`\n[TRACE] discount raw="${String(rawValue)}" (type=${typeof rawValue}) parsed=${discountValue}`);
      if (discountValue === null && typeof rawValue === 'string' && rawValue.trim() !== '') {
        issues.push({row:2,type:'error',message:`Invalid numeric value for discount: ${String(rawValue)}`});
      } else {
        normalizedValues.discount = discountValue ?? 0;
      }
      break;
    }
    case 'images': {
      normalizedValues.images = toArray(rawValue);
      console.log(`\n[TRACE] images raw="${String(rawValue)}" -> ${JSON.stringify(normalizedValues.images)}`);
      break;
    }
    case 'gallery': {
      normalizedValues.gallery = toArray(rawValue);
      console.log(`\n[TRACE] gallery raw="${String(rawValue)}" -> ${JSON.stringify(normalizedValues.gallery)}`);
      break;
    }
    case 'availability': {
      const v = cleanText(rawValue).toLowerCase();
      normalizedValues.availability = v || undefined;
      console.log(`\n[TRACE] availability raw="${String(rawValue)}" -> ${normalizedValues.availability}`);
      break;
    }
    default: {
      // default assign cleaned strings
      normalizedValues[field] = typeof rawValue === 'string' ? cleanText(rawValue) : rawValue;
      break;
    }
  }
});

console.log('\nNormalized values:');
console.log(JSON.stringify(normalizedValues, null, 2));

// simulate buildImportPayload minimal behavior for new product (no existingProduct)
const payloadWithExisting = { ...normalizedValues };
// apply defaults as in code
payloadWithExisting.price = hasValue(payloadWithExisting.price) ? payloadWithExisting.price : 0;
payloadWithExisting.originalPrice = hasValue(payloadWithExisting.originalPrice) ? payloadWithExisting.originalPrice : 0;
payloadWithExisting.stock = hasValue(payloadWithExisting.stock) ? payloadWithExisting.stock : 0;
payloadWithExisting.discount = hasValue(payloadWithExisting.discount) ? payloadWithExisting.discount : 0;
payloadWithExisting.inStock = hasValue(payloadWithExisting.inStock) ? payloadWithExisting.inStock : false;

// apply defaults for new products to match importer behavior
payloadWithExisting.isActive = hasValue(payloadWithExisting.isActive) ? payloadWithExisting.isActive : true;
payloadWithExisting.status = hasValue(payloadWithExisting.status) ? payloadWithExisting.status : "active";
payloadWithExisting.visibility = hasValue(payloadWithExisting.visibility) ? payloadWithExisting.visibility : "public";
payloadWithExisting.published = hasValue(payloadWithExisting.published) ? payloadWithExisting.published : true;
payloadWithExisting.availability = hasValue(payloadWithExisting.availability) ? payloadWithExisting.availability : "in_stock";

console.log('\nPayload to be written (simulated for NEW product):');
console.log(JSON.stringify(payloadWithExisting, null, 2));

process.exit(0);
