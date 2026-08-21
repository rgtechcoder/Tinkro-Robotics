import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const envPathDefault = path.join(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else if (fs.existsSync(envPathDefault)) {
  config({ path: envPathDefault });
}

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const HOSTNAME = "https://tinkro.in";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getProductRouteParam(product) {
  const nameSlug = slugify(product.name || "");
  return nameSlug ? nameSlug : product.id;
}

function getBlogRouteParam(blog) {
  // Prefer explicit slug field, fall back to title or id
  if (blog.slug && typeof blog.slug === "string" && blog.slug.trim()) {
    return slugify(blog.slug);
  }
  if (blog.title && typeof blog.title === "string") {
    const t = slugify(blog.title);
    if (t) return t;
  }
  return blog.id;
}

// Initialize Firebase
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
  console.error("Route discovery: Firebase env vars not found. Aborting.");
  process.exit(1);
}

try {
  initializeApp(firebaseConfig);
} catch (err) {
  console.error("Route discovery: Firebase init failed:", err.message || err);
  process.exit(1);
}

const db = getFirestore();

export async function discoverRoutes() {
  // Static pages
  const staticPaths = [
    "/",
    "/products",
    "/labs",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/shipping-policy",
    "/returns",
    "/warranty",
    "/track-order",
    "/wishlist",
  ];

  const productPaths = [];
  const blogPaths = [];

  // Query products
  try {
    const productsRef = collection(db, "products");
    const prodSnap = await getDocs(productsRef);
    prodSnap.forEach((doc) => {
      const data = doc.data();
      if (data && (data.name || doc.id)) {
        const slug = getProductRouteParam({ id: doc.id, name: data.name });
        productPaths.push(`/product/${slug}`);
      }
    });
  } catch (err) {
    console.error("Route discovery: Failed to query products:", err.message || err);
    // continue – productPaths may be empty
  }

  // Query blogs
  try {
    const blogsRef = collection(db, "blogs");
    const blogSnap = await getDocs(blogsRef);
    blogSnap.forEach((doc) => {
      const data = doc.data();
      const slug = getBlogRouteParam({ ...(data || {}), id: doc.id });
      blogPaths.push(`/blog/${slug}`);
    });
  } catch (err) {
    console.error("Route discovery: Failed to query blogs:", err.message || err);
    // continue – blogPaths may be empty
  }

  const futureContent = [];

  // Combine unique routes, ensure deterministic ordering
  const routes = Array.from(
    new Set([...staticPaths, ...productPaths.sort(), ...blogPaths.sort(), ...futureContent])
  );

  return {
    hostname: HOSTNAME,
    staticPaths,
    productPaths,
    blogPaths,
    futureContent,
    routes,
  };
}

// If run directly, write discovery to public/route-discovery.json
if (process.argv[1] && process.argv[1].endsWith("route-discovery.mjs")) {
  (async () => {
    try {
      const result = await discoverRoutes();
      const outDir = path.join(__dirname, "..", "public");
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, "route-discovery.json");
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
      console.log(`Wrote route discovery to ${outPath}`);
      process.exit(0);
    } catch (err) {
      console.error("Route discovery failed:", err);
      process.exit(1);
    }
  })();
}
