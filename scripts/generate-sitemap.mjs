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
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

try {
  const app = initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
  process.exit(1);
}

const db = getFirestore();
console.log("✅ Firestore instance created");

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

    // Step 1: Create collection reference
    console.log("\n📦 Fetching products from Firestore...");
    let productsRef;
    try {
      productsRef = collection(db, "products");
      console.log("✅ Collection reference created for 'products'");
    } catch (error) {
      console.error("❌ Failed to create collection reference:", error.message);
      throw error;
    }

    // Step 2: Execute query
    let querySnapshot;
    try {
      console.log("🔍 Executing getDocs query...");
      querySnapshot = await getDocs(productsRef);
      console.log(`✅ Query executed successfully`);
      console.log(`   Snapshot size: ${querySnapshot.size} documents`);
      console.log(`   Empty: ${querySnapshot.empty}`);
    } catch (error) {
      console.error("❌ Firestore query failed:", error.message);
      console.error("   Error code:", error.code);
      console.error("   Full error:", error);
      throw error;
    }

    // Step 3: Parse documents
    const products = [];
    console.log("\n📄 Parsing documents...");
    let docCount = 0;
    querySnapshot.forEach((doc) => {
      docCount++;
      const data = doc.data();
      console.log(`   Doc ${docCount}: ID=${doc.id}, Keys=${Object.keys(data).join(", ")}`);
      
      if (docCount === 1) {
        // Log first document structure for debugging
        console.log(`   📍 First document structure:`);
        console.log(`      ${JSON.stringify(data, null, 2)}`);
      }

      // FIX: Only check for 'name' field (id comes from doc.id, not from document data)
      if (data.name) {
        products.push({
          id: doc.id,
          name: data.name,
        });
        console.log(`      ✅ ADDED: "${data.name}" (id: ${doc.id})`);
      } else {
        console.log(`      ⚠️  Skipped (missing name field)`);
      }
    });

    console.log(`\n📊 Results:`);
    console.log(`   Total documents in collection: ${docCount}`);
    console.log(`   Products with name+id: ${products.length}`);
    
    if (querySnapshot.size > 0 && products.length === 0) {
      console.warn("⚠️  WARNING: Documents found but no valid products!");
      console.warn("   Check that documents have 'name' and 'id' fields");
    }

    if (products.length === 0) {
      console.warn("\n⚠️  No products found in Firestore collection 'products'");
      console.warn("   This is normal if the database is empty.");
      console.warn("   Continuing with static pages only...");
    }

    // Build URL list
    const urls = [
      `${HOSTNAME}/`,
      `${HOSTNAME}/products`,
      `${HOSTNAME}/labs`,
      `${HOSTNAME}/blog`,
      `${HOSTNAME}/about`,
      `${HOSTNAME}/contact`,
      `${HOSTNAME}/faq`,
      `${HOSTNAME}/shipping-policy`,
      `${HOSTNAME}/returns`,
      `${HOSTNAME}/warranty`,
      `${HOSTNAME}/track-order`,
      `${HOSTNAME}/wishlist`,
    ];

    // Add product URLs using exact same logic as frontend
    products.forEach((product) => {
      const slug = getProductRouteParam(product);
      urls.push(`${HOSTNAME}/product/${slug}`);
    });

    console.log(`\n🔗 Generated ${urls.length} total URLs:`);
    console.log(`   Static pages: 12`);
    console.log(`   Product pages: ${products.length}`);

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
