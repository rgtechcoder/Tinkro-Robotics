import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Load environment variables from .env.local or .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const envPathDefault = path.join(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else if (fs.existsSync(envPathDefault)) {
  config({ path: envPathDefault });
}

// Firebase client SDK (will work in Node.js)
import { discoverRoutes } from "./route-discovery.mjs";

// Exact slugify logic from frontend
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Exact getProductRouteParam logic from frontend
function getProductRouteParam(product) {
  const nameSlug = slugify(product.name);
  return nameSlug ? nameSlug : product.id;
}

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("❌ Firebase configuration not found in environment variables");
  console.error("Make sure .env.local or .env contains VITE_FIREBASE_* variables");
  process.exit(1);
}

console.log("📋 Firebase Config:");
console.log(`   API Key: ${firebaseConfig.apiKey.substring(0, 10)}...`);
console.log(`   Project ID: ${firebaseConfig.projectId}`);
console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);

// route-discovery handles Firebase initialization and queries

const HOSTNAME = "https://tinkro.in";

// XML escape function
function escapeXml(str) {
  return str
    .replace(/[<]/g, "&lt;")
    .replace(/[>]/g, "&gt;")
    .replace(/[&]/g, "&amp;")
    .replace(/["]/g, "&quot;")
    .replace(/[']/g, "&apos;");
}

// Generate sitemap XML
function generateSitemapXml(urls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach((url) => {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(url)}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += "    <priority>0.8</priority>\n";
    xml += "  </url>\n";
  });

  xml += "</urlset>";
  return xml;
}

async function generateSitemap() {
  try {
    console.log("\n🔄 Starting sitemap generation...");
    console.log(`📍 Target hostname: ${HOSTNAME}`);

    // Use centralized route discovery (queries Firestore once)
    console.log("\n📦 Discovering routes (products + blogs + static)...");
    const discovery = await discoverRoutes();
    console.log(`✅ Discovered ${discovery.routes.length} total routes`);

    // Build absolute URLs
    const urls = discovery.routes.map((p) => `${HOSTNAME}${p}`);

    const productCount = discovery.productPaths ? discovery.productPaths.length : 0;
    const blogCount = discovery.blogPaths ? discovery.blogPaths.length : 0;

    console.log(`\n🔗 Generated ${urls.length} total URLs:`);
    console.log(`   Static pages: ${discovery.staticPaths.length}`);
    console.log(`   Product pages: ${productCount}`);
    console.log(`   Blog pages: ${blogCount}`);

    // Also write discovery JSON for downstream consumers (prerender)
    const outDir = path.join(__dirname, "..", "public");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const discoveryOut = path.join(outDir, "route-discovery.json");
    fs.writeFileSync(discoveryOut, JSON.stringify(discovery, null, 2), "utf8");
    console.log(`✅ Route discovery written to ${discoveryOut}`);

    // Generate XML
    const sitemapXml = generateSitemapXml(urls);

    // Write to public/sitemap.xml
    const outputDir = path.join(__dirname, "..", "public");
    const outputPath = path.join(outputDir, "sitemap.xml");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, sitemapXml, "utf8");
    console.log(`\n✅ Sitemap written to: ${outputPath}`);
    console.log(`   File size: ${(sitemapXml.length / 1024).toFixed(2)} KB`);
    console.log(`   Total entries: ${urls.length}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error generating sitemap:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

generateSitemap();
