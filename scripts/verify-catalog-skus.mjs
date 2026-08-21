import "dotenv/config";
import { createRequire } from "node:module";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
const inputPath = process.argv[2] ?? "C:/Users/rgrav/Downloads/7 Tinkro_Master_Inventory  (1).xlsx";

const normalizeTokens = (value) =>
  String(value ?? "")
    .toLowerCase()
    .match(/[a-z0-9]+/g) ?? [];

const skuKey = (value) => normalizeTokens(value).join("");

function nameScore(left, right) {
  const leftTokens = new Set(normalizeTokens(left));
  const rightTokens = new Set(normalizeTokens(right));
  let common = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) common += 1;
  }
  return common / Math.max(leftTokens.size, 1);
}

const workbook = XLSX.readFile(inputPath, { cellDates: false });
const catalogSheetName = workbook.SheetNames.find((name) => name.toLowerCase() === "catalog");
if (!catalogSheetName) throw new Error("Catalog sheet was not found.");

const sheetRows = XLSX.utils.sheet_to_json(workbook.Sheets[catalogSheetName], {
  header: 1,
  defval: "",
});
const headerRow = sheetRows.findIndex(
  (row) =>
    String(row[0]).trim().toUpperCase() === "SKU" &&
    String(row[1]).trim().toUpperCase().includes("ITEM NAME"),
);
if (headerRow < 0) throw new Error("Catalog SKU/Item Name header row was not found.");

const catalog = sheetRows
  .slice(headerRow + 1)
  .map((row, index) => ({
    row: headerRow + index + 2,
    sku: String(row[0] ?? "").trim(),
    name: String(row[1] ?? "").replace(/\s+/g, " ").trim(),
  }))
  .filter((row) => row.sku);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const snapshot = await getDocs(collection(getFirestore(firebaseApp), "products"));
const products = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
const productsBySku = new Map();
for (const product of products) {
  const key = skuKey(product.sku);
  if (!key) continue;
  const matches = productsBySku.get(key) ?? [];
  matches.push(product);
  productsBySku.set(key, matches);
}

const skuMatches = [];
const missingSkus = [];
const duplicateSkus = [];
const nameDifferences = [];
const likelySwaps = [];

for (const row of catalog) {
  const matches = productsBySku.get(skuKey(row.sku)) ?? [];
  if (matches.length === 0) {
    missingSkus.push(row);
    continue;
  }
  if (matches.length > 1) {
    duplicateSkus.push({
      catalog: row,
      products: matches.map((product) => ({ id: product.id, name: product.name, sku: product.sku })),
    });
    continue;
  }

  const current = matches[0];
  const currentScore = nameScore(row.name, current.name);
  const match = { catalog: row, product: { id: current.id, name: current.name, sku: current.sku } };
  skuMatches.push(match);
  if (currentScore < 1) nameDifferences.push({ ...match, nameScore: Number(currentScore.toFixed(2)) });

  let best = null;
  for (const product of products) {
    const score = nameScore(row.name, product.name);
    if (!best || score > best.score) best = { score, product };
  }
  if (
    best &&
    best.score >= 0.5 &&
    best.product.id !== current.id &&
    best.score - currentScore >= 0.25
  ) {
    likelySwaps.push({
      catalogRow: row.row,
      catalogName: row.name,
      catalogSku: row.sku,
      currentProduct: { id: current.id, name: current.name, sku: current.sku },
      likelyProduct: { id: best.product.id, name: best.product.name, sku: best.product.sku },
      currentNameScore: Number(currentScore.toFixed(2)),
      likelyNameScore: Number(best.score.toFixed(2)),
    });
  }
}

console.log(
  JSON.stringify(
    {
      inputPath,
      catalogRows: catalog.length,
      firestoreProducts: products.length,
      skuMatches: skuMatches.length,
      missingSkus: missingSkus.length,
      duplicateSkus: duplicateSkus.length,
      nameDifferencesForMatchedSku: nameDifferences.length,
      likelySwaps: likelySwaps.length,
      likelySwapsSample: likelySwaps.slice(0, 100),
      missingSkusSample: missingSkus.slice(0, 50),
      duplicateSkus,
    },
    null,
    2,
  ),
);
