import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* =========================================================
   TINKRO CATALOG AUTO SYNC
   ---------------------------------------------------------
   What this script does:

   1. Reads current Admin + Customer catalog HTML
   2. Reads ALL Firebase products
   3. Matches existing catalog products by SKU
   4. Falls back to exact name
   5. Falls back to very safe fuzzy name match
   6. Updates images of existing products
   7. AUTOMATICALLY ADDS Firebase products missing
      from the catalog
   8. Preserves the rest of the HTML/Admin system
   9. Creates a detailed report
   ========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

/* =========================================================
   FILE PATHS
   ========================================================= */

const INPUT_HTML = path.join(
  ROOT,
  "catalog",
  "Tinkro_Catalog_Admin.html"
);

const OUTPUT_HTML = path.join(
  ROOT,
  "catalog",
  "Tinkro_Catalog_Admin_Final.html"
);

const REPORT_FILE = path.join(
  ROOT,
  "catalog",
  "catalog-image-match-report.json"
);

/* =========================================================
   ENV LOADER
   ========================================================= */

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`.env file not found:\n${filePath}`);
  }

  const text = fs.readFileSync(filePath, "utf8");
  const env = {};

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/
    );

    if (!match) {
      continue;
    }

    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[match[1]] = value;
  }

  return env;
}

const env = loadEnvFile(
  path.join(ROOT, ".env")
);

/* =========================================================
   REQUIRED FIREBASE ENV
   ========================================================= */

const requiredEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingEnv = requiredEnv.filter(
  (key) => !env[key]
);

if (missingEnv.length) {
  throw new Error(
    `Missing Firebase .env values:\n${missingEnv.join("\n")}`
  );
}

/* =========================================================
   FIREBASE
   ========================================================= */

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,

  ...(env.VITE_FIREBASE_MEASUREMENT_ID
    ? {
        measurementId:
          env.VITE_FIREBASE_MEASUREMENT_ID,
      }
    : {}),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================================================
   HELPERS
   ========================================================= */

function cleanString(value) {
  return String(value ?? "")
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u00d7/g, "x")
    .replace(/&amp;/gi, "&")
    .trim();
}

function normalizeSku(value) {
  return cleanString(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeName(value) {
  return cleanString(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[–—-]/g, " ")
    .replace(/["'`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   FIREBASE IMAGE
   ========================================================= */

function getProductImage(product) {
  /* Preferred: first image from images[] */

  if (
    Array.isArray(product.images) &&
    typeof product.images[0] === "string" &&
    product.images[0].trim()
  ) {
    return product.images[0].trim();
  }

  /* Fallback: single image field */

  if (
    typeof product.image === "string" &&
    product.image.trim()
  ) {
    return product.image.trim();
  }

  return "";
}

/* =========================================================
   FIREBASE CATEGORY
   ========================================================= */

function getProductCategory(product) {
  const possibleFields = [
    product.category,
    product.cat,
    product.categoryName,
    product.productCategory,
    product.type,
  ];

  for (const value of possibleFields) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "Other";
}

/* =========================================================
   CATEGORY ICON
   ========================================================= */

function getCategoryIcon(category) {
  const icons = {
    "Microcontrollers & Boards": "🔲",
    "Motors & Actuators": "⚙️",
    "Motor Drivers": "🎛️",
    "Sensors": "📡",
    "Displays": "📟",
    "LEDs & Indicators": "💡",
    "Power & Batteries": "🔋",
    "Connectivity": "📶",
    "Switches & Relays": "🔘",
    "Wires & Connectors": "🔗",
    "Prototyping": "🧩",
    "Wheels & Chassis": "🛞",
    "DIY Kits": "🚗",
    "Tools & Accessories": "🔧",
  };

  return icons[category] || "📦";
}

/* =========================================================
   EXTRACT PRODUCTS ARRAY
   ---------------------------------------------------------
   Important:
   The HTML also contains another "products" string inside
   buildCleanHTML(). Therefore we specifically locate the
   REAL:
       const products = [
   ========================================================= */

function extractProductsArray(html) {
  const markerRegex =
    /\bconst\s+products\s*=\s*\[/;

  const match = markerRegex.exec(html);

  if (!match) {
    throw new Error(
      'Could not find "const products = [" in catalog HTML.'
    );
  }

  const arrayStart = html.indexOf(
    "[",
    match.index
  );

  if (arrayStart === -1) {
    throw new Error(
      "Could not find products array start."
    );
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (
    let i = arrayStart;
    i < html.length;
    i++
  ) {
    const char = html[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (
      char === '"' ||
      char === "'" ||
      char === "`"
    ) {
      quote = char;
      continue;
    }

    if (char === "[") {
      depth++;
    } else if (char === "]") {
      depth--;

      if (depth === 0) {
        return {
          start: arrayStart,
          end: i + 1,
          source: html.slice(
            arrayStart,
            i + 1
          ),
        };
      }
    }
  }

  throw new Error(
    "Could not find end of products array."
  );
}

/* =========================================================
   SAFE ARRAY PARSER
   ========================================================= */

function parseCatalogProducts(source) {
  try {
    return Function(
      `"use strict"; return (${source});`
    )();
  } catch (error) {
    throw new Error(
      `Could not parse catalog products array:\n${error.message}`
    );
  }
}

/* =========================================================
   SIMILARITY
   ========================================================= */

function similarityScore(a, b) {
  if (a === b) {
    return 1;
  }

  const aTokens = new Set(
    a.split(" ").filter(Boolean)
  );

  const bTokens = new Set(
    b.split(" ").filter(Boolean)
  );

  if (
    !aTokens.size ||
    !bTokens.size
  ) {
    return 0;
  }

  let intersection = 0;

  for (const token of aTokens) {
    if (bTokens.has(token)) {
      intersection++;
    }
  }

  const union = new Set([
    ...aTokens,
    ...bTokens,
  ]).size;

  const jaccard =
    intersection / union;

  const lengthRatio =
    Math.min(a.length, b.length) /
    Math.max(a.length, b.length);

  return (
    jaccard * 0.75 +
    lengthRatio * 0.25
  );
}

/* =========================================================
   MAIN
   ========================================================= */

async function main() {
  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    " TINKRO CATALOG AUTO SYNC"
  );
  console.log(
    "=============================================="
  );
  console.log("");

  /* -------------------------------------------------------
     CHECK INPUT
     ------------------------------------------------------- */

  if (!fs.existsSync(INPUT_HTML)) {
    throw new Error(
      `Catalog HTML not found:\n${INPUT_HTML}\n\n` +
      `Make sure your latest Admin catalog is named:\n` +
      `Tinkro_Catalog_Admin.html`
    );
  }

  /* -------------------------------------------------------
     READ HTML
     ------------------------------------------------------- */

  const html =
    fs.readFileSync(
      INPUT_HTML,
      "utf8"
    );

  const extracted =
    extractProductsArray(html);

  let catalogProducts =
    parseCatalogProducts(
      extracted.source
    );

  if (!Array.isArray(catalogProducts)) {
    throw new Error(
      "Catalog products is not an array."
    );
  }

  if (
    catalogProducts.length > 0 &&
    !catalogProducts.every(
      (p) =>
        p &&
        typeof p === "object" &&
        typeof p.sku === "string"
    )
  ) {
    throw new Error(
      "Catalog products array contains unexpected data."
    );
  }

  const originalCatalogCount =
    catalogProducts.length;

  console.log(
    `Catalog products found: ${originalCatalogCount}`
  );

  /* -------------------------------------------------------
     FIREBASE
     ------------------------------------------------------- */

  console.log("");
  console.log(
    "Reading Firebase products..."
  );

  const snapshot =
    await getDocs(
      collection(db, "products")
    );

  const firebaseProducts =
    snapshot.docs.map(
      (docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })
    );

  console.log(
    `Firebase products found: ${firebaseProducts.length}`
  );

  /* -------------------------------------------------------
     LOOKUP MAPS
     ------------------------------------------------------- */

  const bySku = new Map();
  const byName = new Map();

  for (
    const product of firebaseProducts
  ) {
    const sku =
      normalizeSku(product.sku);

    const name =
      normalizeName(product.name);

    if (sku) {
      if (!bySku.has(sku)) {
        bySku.set(sku, []);
      }

      bySku
        .get(sku)
        .push(product);
    }

    if (name) {
      if (!byName.has(name)) {
        byName.set(name, []);
      }

      byName
        .get(name)
        .push(product);
    }
  }

  /* -------------------------------------------------------
     REPORT
     ------------------------------------------------------- */

  const report = {
    generatedAt:
      new Date().toISOString(),

    originalCatalogProductCount:
      originalCatalogCount,

    finalCatalogProductCount: 0,

    firebaseProductCount:
      firebaseProducts.length,

    matchedBySku: 0,
    matchedByName: 0,
    matchedBySafeFuzzyName: 0,

    existingImagesAdded: 0,

    matchedWithoutImage: 0,

    newProductsAdded: 0,

    newProductsWithImage: 0,

    newProductsWithoutImage: 0,

    unmatchedExistingCatalogProducts: [],

    ambiguous: [],

    newlyAddedProducts: [],

    results: [],
  };

  /* =======================================================
     TRACK FIREBASE PRODUCTS ALREADY USED
     ======================================================= */

  const matchedFirebaseIds =
    new Set();

  /* =======================================================
     MATCH EXISTING CATALOG PRODUCTS
     ======================================================= */

  for (
    const catalogProduct of catalogProducts
  ) {
    const catalogSku =
      normalizeSku(
        catalogProduct.sku
      );

    const catalogName =
      normalizeName(
        catalogProduct.name
      );

    let match = null;
    let matchType = null;

    /* -----------------------------------------------------
       1. SKU MATCH
       ----------------------------------------------------- */

    if (
      catalogSku &&
      bySku.has(catalogSku)
    ) {
      const skuMatches =
        bySku.get(catalogSku);

      if (
        skuMatches.length === 1
      ) {
        match =
          skuMatches[0];

        matchType = "SKU";
      } else {
        report.ambiguous.push({
          sku: catalogProduct.sku,
          name: catalogProduct.name,
          reason:
            "Multiple Firebase products have the same SKU.",
          firebaseIds:
            skuMatches.map(
              (p) => p.id
            ),
        });
      }
    }

    /* -----------------------------------------------------
       2. EXACT NAME
       ----------------------------------------------------- */

    if (
      !match &&
      catalogName &&
      byName.has(catalogName)
    ) {
      const nameMatches =
        byName.get(catalogName);

      if (
        nameMatches.length === 1
      ) {
        match =
          nameMatches[0];

        matchType = "NAME";
      } else {
        report.ambiguous.push({
          sku: catalogProduct.sku,
          name: catalogProduct.name,
          reason:
            "Multiple Firebase products have the same normalized name.",
          firebaseIds:
            nameMatches.map(
              (p) => p.id
            ),
        });
      }
    }

    /* -----------------------------------------------------
       3. SAFE FUZZY NAME
       ----------------------------------------------------- */

    if (
      !match &&
      catalogName.length >= 8
    ) {
      const candidates =
        firebaseProducts
          .map(
            (product) => ({
              product,
              name:
                normalizeName(
                  product.name
                ),
            })
          )
          .filter(
            (item) =>
              item.name.length >= 8
          );

      const scored =
        candidates
          .map(
            (item) => ({
              ...item,
              score:
                similarityScore(
                  catalogName,
                  item.name
                ),
            })
          )
          .sort(
            (a, b) =>
              b.score - a.score
          );

      const best =
        scored[0];

      const second =
        scored[1];

      if (
        best &&
        best.score >= 0.94 &&
        (
          !second ||
          best.score -
            second.score >=
            0.03
        )
      ) {
        match =
          best.product;

        matchType =
          "SAFE_FUZZY_NAME";
      }
    }

    /* -----------------------------------------------------
       NO MATCH
       ----------------------------------------------------- */

    if (!match) {
      report
        .unmatchedExistingCatalogProducts
        .push({
          sku:
            catalogProduct.sku,
          name:
            catalogProduct.name,
        });

      report.results.push({
        action: "EXISTING_NOT_MATCHED",
        sku:
          catalogProduct.sku,
        name:
          catalogProduct.name,
        matchType: null,
        firebaseId: null,
        imageUrl: null,
      });

      continue;
    }

    /* -----------------------------------------------------
       MATCHED
       ----------------------------------------------------- */

    matchedFirebaseIds.add(
      match.id
    );

    const imageUrl =
      getProductImage(match);

    if (matchType === "SKU") {
      report.matchedBySku++;
    } else if (
      matchType === "NAME"
    ) {
      report.matchedByName++;
    } else if (
      matchType ===
      "SAFE_FUZZY_NAME"
    ) {
      report.matchedBySafeFuzzyName++;
    }

    /* -----------------------------------------------------
       UPDATE EXISTING IMAGE
       ----------------------------------------------------- */

    if (imageUrl) {
      catalogProduct.img =
        imageUrl;

      report.existingImagesAdded++;
    } else {
      report.matchedWithoutImage++;
    }

    report.results.push({
      action:
        "EXISTING_UPDATED",

      sku:
        catalogProduct.sku,

      name:
        catalogProduct.name,

      matchType,

      firebaseId:
        match.id,

      firebaseSku:
        match.sku ?? "",

      firebaseName:
        match.name ?? "",

      imageUrl:
        imageUrl || null,
    });
  }

  /* =======================================================
     ADD NEW FIREBASE PRODUCTS
     -------------------------------------------------------
     THIS IS THE IMPORTANT NEW PART.
     ======================================================= */

  console.log("");
  console.log(
    "Checking for new Firebase products..."
  );

  const newFirebaseProducts =
    firebaseProducts.filter(
      (product) =>
        !matchedFirebaseIds.has(
          product.id
        )
    );

  console.log(
    `New Firebase products to add: ${newFirebaseProducts.length}`
  );

  /* -------------------------------------------------------
     ADD EACH NEW PRODUCT
     ------------------------------------------------------- */

  for (
    const firebaseProduct of
      newFirebaseProducts
  ) {
    const sku =
      cleanString(
        firebaseProduct.sku
      );

    const name =
      cleanString(
        firebaseProduct.name
      );

    /* -----------------------------------------------------
       SAFETY CHECK
       ----------------------------------------------------- */

    if (!sku || !name) {
      report.results.push({
        action:
          "NEW_PRODUCT_SKIPPED",

        sku: sku || "",

        name: name || "",

        firebaseId:
          firebaseProduct.id,

        reason:
          "Firebase product does not have both SKU and Name.",
      });

      continue;
    }

    /* -----------------------------------------------------
       FINAL DUPLICATE SAFETY
       ----------------------------------------------------- */

    const alreadyExists =
      catalogProducts.some(
        (p) =>
          normalizeSku(p.sku) ===
          normalizeSku(sku)
      );

    if (alreadyExists) {
      report.results.push({
        action:
          "NEW_PRODUCT_SKIPPED_DUPLICATE",

        sku,

        name,

        firebaseId:
          firebaseProduct.id,

        reason:
          "SKU already exists in catalog.",
      });

      continue;
    }

    /* -----------------------------------------------------
       CATEGORY
       ----------------------------------------------------- */

    const category =
      getProductCategory(
        firebaseProduct
      );

    /* -----------------------------------------------------
       IMAGE
       ----------------------------------------------------- */

    const imageUrl =
      getProductImage(
        firebaseProduct
      );

    /* -----------------------------------------------------
       ICON
       ----------------------------------------------------- */

    const icon =
      getCategoryIcon(
        category
      );

    /* -----------------------------------------------------
       CREATE CATALOG PRODUCT
       ----------------------------------------------------- */

    const newCatalogProduct = {
      sku,
      name,
      cat: category,
      icon,
      img: imageUrl,
    };

    catalogProducts.push(
      newCatalogProduct
    );

    report.newProductsAdded++;

    if (imageUrl) {
      report.newProductsWithImage++;
    } else {
      report.newProductsWithoutImage++;
    }

    report.newlyAddedProducts.push({
      sku,
      name,
      category,
      icon,
      firebaseId:
        firebaseProduct.id,
      imageUrl:
        imageUrl || null,
      hasImage:
        Boolean(imageUrl),
    });

    report.results.push({
      action:
        "NEW_PRODUCT_ADDED",

      sku,

      name,

      category,

      firebaseId:
        firebaseProduct.id,

      imageUrl:
        imageUrl || null,
    });
  }

  /* =======================================================
     FINAL HTML
     -------------------------------------------------------
     Only the REAL products array is replaced.
     Admin functionality remains untouched.
     ======================================================= */

  const newProductsJson =
    JSON.stringify(
      catalogProducts
    );

  const finalHtml =
    html.slice(
      0,
      extracted.start
    ) +
    newProductsJson +
    html.slice(
      extracted.end
    );

  /* =======================================================
     FINAL COUNTS
     ======================================================= */

  report.finalCatalogProductCount =
    catalogProducts.length;

  /* =======================================================
     WRITE FINAL HTML
     ======================================================= */

  fs.writeFileSync(
    OUTPUT_HTML,
    finalHtml,
    "utf8"
  );

  /* =======================================================
     WRITE REPORT
     ======================================================= */

  fs.writeFileSync(
    REPORT_FILE,
    JSON.stringify(
      report,
      null,
      2
    ),
    "utf8"
  );

  /* =======================================================
     CONSOLE RESULT
     ======================================================= */

  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    " DONE"
  );
  console.log(
    "=============================================="
  );
  console.log("");

  console.log(
    `Original catalog:       ${report.originalCatalogProductCount}`
  );

  console.log(
    `Firebase products:      ${report.firebaseProductCount}`
  );

  console.log(
    `Matched by SKU:         ${report.matchedBySku}`
  );

  console.log(
    `Matched by Name:        ${report.matchedByName}`
  );

  console.log(
    `Matched by Safe Name:   ${report.matchedBySafeFuzzyName}`
  );

  console.log(
    `Existing images added:  ${report.existingImagesAdded}`
  );

  console.log(
    `Matched no image:       ${report.matchedWithoutImage}`
  );

  console.log(
    `NEW products added:     ${report.newProductsAdded}`
  );

  console.log(
    `New products w/image:   ${report.newProductsWithImage}`
  );

  console.log(
    `New products no image:  ${report.newProductsWithoutImage}`
  );

  console.log(
    `Existing not matched:   ${report.unmatchedExistingCatalogProducts.length}`
  );

  console.log(
    `Ambiguous:              ${report.ambiguous.length}`
  );

  console.log(
    `FINAL CATALOG PRODUCTS: ${report.finalCatalogProductCount}`
  );

  console.log("");

  console.log(
    "Final HTML:"
  );

  console.log(
    OUTPUT_HTML
  );

  console.log("");

  console.log(
    "Report:"
  );

  console.log(
    REPORT_FILE
  );

  console.log("");
}

/* =========================================================
   RUN
   ========================================================= */

main().catch(
  (error) => {
    console.error("");
    console.error(
      "=============================================="
    );
    console.error(
      " ERROR"
    );
    console.error(
      "=============================================="
    );
    console.error("");
    console.error(
      error?.stack ||
        error?.message ||
        error
    );
    console.error("");

    process.exit(1);
  }
);