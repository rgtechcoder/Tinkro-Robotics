# Automated Sitemap Generation

## Overview

This project uses an automated sitemap generation system that creates a complete `sitemap.xml` file during the build process. The sitemap includes:

- Static pages (homepage, products, labs, blog, about, contact, FAQ, policies, etc.)
- **All product URLs** dynamically fetched from Firestore
- Proper XML formatting for search engines (Google, Bing, etc.)

## How It Works

### URL Generation Logic

Product URLs are generated using the exact same logic as the frontend application:

1. **Slugification**: Product names are converted to URL-safe slugs
   - Lowercase all characters
   - Remove special characters (quotes, backticks)
   - Replace spaces and special characters with hyphens
   - Remove leading/trailing hyphens
   - Example: `"Servo Motor SG90"` → `"servo-motor-sg90"`

2. **Fallback**: If the slug is empty, use the product ID
3. **URL Format**: `/product/{slug}` (e.g., `/product/servo-motor-sg90`)

This ensures the **sitemap URLs exactly match the live app routes**.

### Files Involved

| File | Purpose |
|------|---------|
| `scripts/generate-sitemap.mjs` | Main Node.js script that generates sitemap.xml |
| `src/lib/slug.ts` | Frontend slug functions (source of truth) |
| `package.json` | Build script configuration |
| `public/sitemap.xml` | Generated sitemap (created during build) |

### Build Pipeline

The `pnpm build` command runs in this order:

1. **`pnpm generate:sitemap`** ← Fetches Firestore products → Generates `public/sitemap.xml`
2. `vite build` ← Bundles React app into `dist/`
3. `pnpm copy:env` ← Copies `env.json` to build output
4. `pnpm prerender` ← Pre-renders critical routes with Puppeteer

## Usage

### Manual Sitemap Generation

```bash
cd src/frontend
pnpm generate:sitemap
```

### Automatic During Build

```bash
cd src/frontend
pnpm build
```

The sitemap is automatically generated before Vite build and placed in `public/sitemap.xml`.

### Development

To test sitemap generation without a full build:

```bash
cd src/frontend
npm run generate:sitemap
```

Then check the generated file:

```bash
# View the sitemap
cat public/sitemap.xml
```

## Configuration

### Firebase Credentials

The script reads Firebase configuration from environment variables:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

These are automatically loaded from `.env` or `.env.local` in the frontend directory.

### Hostname

The sitemap uses the production hostname: `https://tinkro.in`

To change it, edit `generate-sitemap.mjs`:

```javascript
const HOSTNAME = "https://yourdomain.com";
```

## Troubleshooting

### No Products in Sitemap

**Symptom**: Sitemap contains only static pages, no product URLs.

**Causes**:
- Firestore `products` collection is empty
- Firebase credentials are missing or invalid
- Network connectivity issue

**Solution**:
1. Verify `.env` has correct Firebase credentials
2. Check Firestore console for products in the `products` collection
3. Run script with debug output:
   ```bash
   npm run generate:sitemap
   ```

### Build Script Fails

**Symptom**: `pnpm build` fails at sitemap generation step.

**Causes**:
- Missing npm dependencies
- Invalid Firebase credentials
- File system permissions

**Solution**:
1. Ensure dependencies are installed: `pnpm install`
2. Verify `.env` is configured correctly
3. Check `public/` directory exists and is writable

## Deployment

### Pre-Deployment Checklist

- [ ] `.env` has correct Firebase credentials
- [ ] `public/sitemap.xml` is generated and valid
- [ ] All product URLs in sitemap are accessible
- [ ] Static pages are correctly included

### Production Build

```bash
cd src/frontend
pnpm build
```

This generates `dist/` with:
- `sitemap.xml` (copied from `public/`)
- Pre-rendered HTML pages
- Optimized JavaScript bundles

### Serving Sitemap

The `public/sitemap.xml` is served at:
```
https://tinkro.in/sitemap.xml
```

## SEO Best Practices

The generated sitemap follows XML Sitemap protocol specifications:

- **`<changefreq>`**: Set to `weekly` for all URLs
- **`<priority>`**: Set to `0.8` for products and static pages
- **XML Declaration**: Proper UTF-8 encoding
- **Namespace**: Correct sitemap xmlns attribute

### Robots.txt Integration

Add this to `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://tinkro.in/sitemap.xml
```

## Monitoring

### Check Sitemap Generation Logs

```bash
# In package.json build output, look for:
# 🔄 Fetching products from Firestore...
# ✓ Found X products
# ✓ Generated Y total URLs
# ✓ Sitemap written to: ...
```

### Validate Sitemap

Online tools for validation:
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Google Search Console](https://search.google.com/search-console)

## Future Enhancements

Potential improvements:

- [ ] Blog posts included in sitemap
- [ ] Lab setups included in sitemap
- [ ] Dynamic priority based on product popularity
- [ ] Sitemap index for large product catalogs (>50K URLs)
- [ ] Gzip compression for larger sitemaps
- [ ] Lastmod timestamps for cache invalidation
