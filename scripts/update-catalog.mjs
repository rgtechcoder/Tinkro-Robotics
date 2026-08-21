import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

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

/* -------------------------------------------------------
   Read VITE_* values directly from the existing .env
------------------------------------------------------- */

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`.env file not found: ${filePath}`);
  }

  const text = fs.readFileSync(filePath, "utf8");
  const env = {};

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/
    );

    if (!match) continue;

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

const env = loadEnvFile(path.join(ROOT, ".env"));

const requiredEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingEnv = requiredEnv.filter((key) => !env[key]);

if (missingEnv.length) {
  throw new Error(
    `Missing Firebase .env values:\n${missingEnv.join("\n")}`
  );
}

/* -------------------------------------------------------
   Firebase
------------------------------------------------------- */

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  ...(env.VITE_FIREBASE_MEASUREMENT_ID
    ? { measurementId: env.VITE_FIREBASE_MEASUREMENT_ID }
    : {}),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

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

function getProductImage(product) {
  if (
    Array.isArray(product.images) &&
    typeof product.images[0] === "string" &&
    product.images[0].trim()
  ) {
    return product.images[0].trim();
  }

  if (typeof product.image === "string" && product.image.trim()) {
    return product.image.trim();
  }

  return "";
}

/* -------------------------------------------------------
   Read products array from HTML
------------------------------------------------------- */

function extractProductsArray(html) {
  /*
    IMPORTANT:

    The Admin catalog contains TWO "products" references:

    1. The real catalog:
       const products = [
         {...}
       ];

    2. Another "const products=" inside buildCleanHTML().

    We MUST select the real top-level catalog array.
  */

  const markerRegex = /\bconst\s+products\s*=\s*\[/;
  const match = markerRegex.exec(html);

  if (!match) {
    throw new Error(
      'Could not find "const products = [" in the catalog HTML.'
    );
  }

  const arrayStart = html.indexOf("[", match.index);

  if (arrayStart === -1) {
    throw new Error("Could not find products array start.");
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = arrayStart; i < html.length; i++) {
    const char = html[i];

    /*
      Handle strings so brackets inside strings don't
      accidentally affect array depth.
    */

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

/* -------------------------------------------------------
   Main
------------------------------------------------------- */

async function main() {
  console.log("");
  console.log("==============================================");
  console.log(" TINKRO CATALOG IMAGE UPDATER");
  console.log("==============================================");
  console.log("");

  if (!fs.existsSync(INPUT_HTML)) {
    throw new Error(
      `Catalog HTML not found:\n${INPUT_HTML}`
    );
  }

  const html = fs.readFileSync(
    INPUT_HTML,
    "utf8"
  );

  const extracted =
    extractProductsArray(html);

  let catalogProducts;

  try {
    /*
      IMPORTANT:

      The catalog uses JavaScript objects:

      {
        sku:"TKR-094",
        name:"Arduino UNO R3",
        ...
      }

      This is valid JavaScript but NOT strict JSON.

      Therefore JSON.parse() cannot be used.

      Function() evaluates ONLY the isolated
      products array extracted above.
    */

    catalogProducts = Function(
      `"use strict"; return (${extracted.source});`
    )();
  } catch (error) {
    throw new Error(
      `Could not parse the catalog products array: ${error.message}`
    );
  }

  if (!Array.isArray(catalogProducts)) {
    throw new Error(
      "Catalog products is not an array."
    );
  }

  /*
    Safety check:
    Make sure we really extracted product objects.
  */

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
      "The extracted products array does not contain the expected catalog product objects."
    );
  }

  console.log(
    `Catalog products found: ${catalogProducts.length}`
  );

  console.log("");
  console.log(
    "Reading Firebase products..."
  );

  const snapshot = await getDocs(
    collection(db, "products")
  );

  const firebaseProducts =
    snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

  console.log(
    `Firebase products found: ${firebaseProducts.length}`
  );

  /* ---------------------------------------------
     Build lookup maps
  --------------------------------------------- */

  const bySku = new Map();
  const byName = new Map();

  for (const product of firebaseProducts) {
    const sku = normalizeSku(
      product.sku
    );

    const name = normalizeName(
      product.name
    );

    /*
      SKU map
    */

    if (sku) {
      if (!bySku.has(sku)) {
        bySku.set(sku, []);
      }

      bySku
        .get(sku)
        .push(product);
    }

    /*
      Name map
    */

    if (name) {
      if (!byName.has(name)) {
        byName.set(name, []);
      }

      byName
        .get(name)
        .push(product);
    }
  }

  /* ---------------------------------------------
     Report
  --------------------------------------------- */

  const report = {
    generatedAt:
      new Date().toISOString(),

    catalogProductCount:
      catalogProducts.length,

    firebaseProductCount:
      firebaseProducts.length,

    matchedBySku: 0,

    matchedByName: 0,

    matchedBySafeFuzzyName: 0,

    matchedWithImage: 0,

    matchedWithoutImage: 0,

    unmatched: [],

    ambiguous: [],

    results: [],
  };

  /* ---------------------------------------------
     Match every catalog product
  --------------------------------------------- */

  for (
    const catalogProduct
    of catalogProducts
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

    /* -----------------------------------------
       1. SKU MATCH
       SKU is strongest match
    ----------------------------------------- */

    if (
      catalogSku &&
      bySku.has(catalogSku)
    ) {
      const skuMatches =
        bySku.get(catalogSku);

      if (
        skuMatches.length === 1
      ) {
        match = skuMatches[0];
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

    /* -----------------------------------------
       2. EXACT NAME MATCH
    ----------------------------------------- */

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
        match = nameMatches[0];
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

    /* -----------------------------------------
       3. SAFE FUZZY NAME MATCH

       Only accept when:

       - high similarity
       - unique best candidate
       - enough difference from second result
    ----------------------------------------- */

    if (
      !match &&
      catalogName.length >= 8
    ) {
      const candidates =
        firebaseProducts
          .map((product) => ({
            product,
            name:
              normalizeName(
                product.name
              ),
          }))
          .filter(
            (item) =>
              item.name.length >= 8
          );

      const scored =
        candidates
          .map((item) => ({
            ...item,
            score:
              similarityScore(
                catalogName,
                item.name
              ),
          }))
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

    /* -----------------------------------------
       NO MATCH
    ----------------------------------------- */

    if (!match) {
      report.unmatched.push({
        sku:
          catalogProduct.sku,

        name:
          catalogProduct.name,
      });

      report.results.push({
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

    /* -----------------------------------------
       GET FIRST FIREBASE IMAGE
    ----------------------------------------- */

    const imageUrl =
      getProductImage(match);

    /* -----------------------------------------
       MATCH COUNTERS
    ----------------------------------------- */

    if (
      matchType === "SKU"
    ) {
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

    if (imageUrl) {
      report.matchedWithImage++;
    } else {
      report.matchedWithoutImage++;
    }

    /* -----------------------------------------
       PUT IMAGE INTO HTML PRODUCT
    ----------------------------------------- */

    catalogProduct.img =
      imageUrl;

    /* -----------------------------------------
       SAVE RESULT
    ----------------------------------------- */

    report.results.push({
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

  /* ---------------------------------------------
     Replace ONLY products array.

     EVERYTHING ELSE in HTML stays unchanged.

     This preserves:

     - Admin Section
     - Customer Catalog
     - CSS
     - Buttons
     - Admin Password
     - Order Form
     - WhatsApp
     - Export Customer Catalog
     - All other functions
  --------------------------------------------- */

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

  /* ---------------------------------------------
     Write FINAL HTML
  --------------------------------------------- */

  fs.writeFileSync(
    OUTPUT_HTML,
    finalHtml,
    "utf8"
  );

  /* ---------------------------------------------
     Write REPORT
  --------------------------------------------- */

  fs.writeFileSync(
    REPORT_FILE,
    JSON.stringify(
      report,
      null,
      2
    ),
    "utf8"
  );

  /* ---------------------------------------------
     FINAL TERMINAL REPORT
  --------------------------------------------- */

  console.log("");

  console.log(
    "=============================================="
  );

  console.log(" DONE");

  console.log(
    "=============================================="
  );

  console.log("");

  console.log(
    `HTML products:          ${report.catalogProductCount}`
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
    `Images added:           ${report.matchedWithImage}`
  );

  console.log(
    `Matched but no image:   ${report.matchedWithoutImage}`
  );

  console.log(
    `Not matched:            ${report.unmatched.length}`
  );

  console.log(
    `Ambiguous:              ${report.ambiguous.length}`
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

/* -------------------------------------------------------
   Similarity helper
------------------------------------------------------- */

function similarityScore(a, b) {
  if (a === b) {
    return 1;
  }

  const aTokens =
    new Set(
      a
        .split(" ")
        .filter(Boolean)
    );

  const bTokens =
    new Set(
      b
        .split(" ")
        .filter(Boolean)
    );

  if (
    !aTokens.size ||
    !bTokens.size
  ) {
    return 0;
  }

  let intersection = 0;

  for (
    const token of aTokens
  ) {
    if (
      bTokens.has(token)
    ) {
      intersection++;
    }
  }

  const union =
    new Set([
      ...aTokens,
      ...bTokens,
    ]).size;

  const jaccard =
    intersection /
    union;

  const lengthRatio =
    Math.min(
      a.length,
      b.length
    ) /
    Math.max(
      a.length,
      b.length
    );

  return (
    jaccard * 0.75 +
    lengthRatio * 0.25
  );
}

/* -------------------------------------------------------
   ERROR HANDLER
------------------------------------------------------- */

main().catch((error) => {
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
});