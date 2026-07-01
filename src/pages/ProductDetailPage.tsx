import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToastContext } from "../components/Layout";
import { SEO } from "../components/SEO";
import { useCategories, useProductById } from "../lib/publicDataService";
import { absoluteUrl, normalizeSeoText, truncateSeoText } from "../lib/seo";
import { getProductRouteParam } from "../lib/slug";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { ProductReview } from "../types";
import type { AdminCategory, AdminProduct } from "../types/admin";

function getProductDisplayName(product: AdminProduct) {
  return normalizeSeoText(product.name) || "Tinkro STEM Robotics Product";
}

function getProductSeoDescription(product: AdminProduct, productName: string) {
  const metaDescription = truncateSeoText(product.metaDescription, 160);
  if (metaDescription) return metaDescription;
  const description = truncateSeoText(product.description, 160);
  if (description) return description;
  return truncateSeoText(
    `Shop ${productName} online at Tinkro. Explore STEM, robotics, and electronics learning products with dependable support across India.`,
    160,
  );
}

function getProductImageAlt(productName: string, index?: number) {
  const suffix = typeof index === "number" ? ` - view ${index + 1}` : "";
  return `${productName}${suffix} from Tinkro`;
}

function getProductFaqs(product: AdminProduct) {
  return (product.faqs ?? [])
    .map((faq) => ({
      question: normalizeSeoText(faq.question),
      answer: normalizeSeoText(faq.answer),
    }))
    .filter((faq) => faq.question && faq.answer);
}

function getYouTubeEmbedUrl(videoUrl?: string) {
  if (!videoUrl) return null;
  const trimmed = videoUrl.trim();
  try {
    const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const url = new URL(normalized);
    const hostname = url.hostname.replace("www.", "");
    if (hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) return `https://www.youtube.com/embed/${pathParts[pathParts.length - 1]}`;
    }
    if (hostname.includes("youtu.be")) {
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) return `https://www.youtube.com/embed/${pathParts[0]}`;
    }
    return trimmed;
  } catch {
    return null;
  }
}

// ─── Icon map for kit contents ───────────────────────────────────────────────
function KitIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    cpu: "🧠",
    zap: "⚡",
    truck: "🚗",
    radio: "📡",
    activity: "〰️",
    bluetooth: "📶",
    layers: "📐",
    "book-open": "📖",
    shield: "🛡️",
    link: "🔌",
  };
  return <span className="text-2xl">{icons[name] ?? "🔧"}</span>;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({
  rating,
  size = "sm",
}: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-xl" : "text-sm";
  return (
    <span
      className={`inline-flex gap-0.5 ${cls}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={
            s <= Math.round(rating)
              ? "text-amber-400"
              : "text-muted-foreground/30"
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const initial =
    direction === "up"
      ? { opacity: 0, y: 50 }
      : direction === "left"
        ? { opacity: 0, x: -50 }
        : { opacity: 0, x: 50 };
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function ProductDetailSkeleton() {
  return (
    <div className="relative" aria-label="Loading product…">
      {/* Hero skeleton */}
      <section
        className="min-h-screen flex items-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.14 0.05 240) 100%)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton
              className="h-4 w-32 rounded"
              style={{ background: "oklch(0.98 0 0 / 0.1)" }}
            />
            <Skeleton
              className="h-14 w-5/6 rounded-xl"
              style={{ background: "oklch(0.98 0 0 / 0.1)" }}
            />
            <Skeleton
              className="h-14 w-3/4 rounded-xl"
              style={{ background: "oklch(0.98 0 0 / 0.08)" }}
            />
            <Skeleton
              className="h-6 w-full rounded"
              style={{ background: "oklch(0.98 0 0 / 0.08)" }}
            />
            <Skeleton
              className="h-6 w-4/5 rounded"
              style={{ background: "oklch(0.98 0 0 / 0.06)" }}
            />
            <div className="flex gap-3 pt-4">
              <Skeleton
                className="h-8 w-28 rounded-full"
                style={{ background: "oklch(0.98 0 0 / 0.08)" }}
              />
              <Skeleton
                className="h-8 w-28 rounded-full"
                style={{ background: "oklch(0.98 0 0 / 0.08)" }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Skeleton
              className="aspect-square w-full max-w-lg rounded-2xl"
              style={{ background: "oklch(0.98 0 0 / 0.06)" }}
            />
          </div>
        </div>
      </section>
      {/* Content skeleton */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          <div className="flex justify-center">
            <Skeleton className="h-10 w-64 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"].map((k) => (
              <Skeleton key={k} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Not Found State ──────────────────────────────────────────────────────────
function ProductNotFound() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.14 0.05 240) 100%)",
      }}
      data-ocid="product-not-found"
    >
      <div className="text-6xl mb-6">🤖</div>
      <h1 className="font-display font-bold text-3xl text-white mb-3">
        Product Not Found
      </h1>
      <p className="text-white/60 max-w-sm mb-8">
        We couldn't find this product. It may have been removed or the link may
        be incorrect.
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
        }}
      >
        ← Browse All Products
      </Link>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({
  product,
  heroImage,
  categories,
}: { product: AdminProduct; heroImage: string; categories: AdminCategory[] }) {
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const wishlisted = useWishlistStore(s => s.isInWishlist(product.id));
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const displayPrice =
    product.discount > 0 && product.originalPrice > product.price
      ? product.price
      : product.price;
  const showOriginal = product.originalPrice > product.price;

  // Resolve category names from categoryIds or fall back to category string
  const categoryTags: { id: string; name: string; slug: string }[] = (() => {
    const ids: string[] =
      Array.isArray(product.categoryIds) && product.categoryIds.length > 0
        ? product.categoryIds
        : product.categoryId
          ? [product.categoryId]
          : [];

    if (ids.length > 0 && categories.length > 0) {
      return ids
        .map((id) => {
          const cat = categories.find((c) => c.id === id);
          return cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null;
        })
        .filter(Boolean) as { id: string; name: string; slug: string }[];
    }
    // Fallback to product.category string
    if (product.category) {
      return [
        {
          id: product.category,
          name: product.category,
          slug: product.category.toLowerCase().replace(/[\s&/]+/g, "-"),
        },
      ];
    }
    return [];
  })();

  // Prepare images for carousel
  const heroImages = product.images && product.images.length > 0 ? product.images : [heroImage];
  const [selected, setSelected] = useState(0);
  const [api, setApi] = useState<any>(null);
  const intervalRef = useRef<number | null>(null);

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoSlide = useCallback(() => {
    if (!api || heroImages.length <= 1) return;
    stopAutoSlide();
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 3500);
  }, [api, heroImages.length, stopAutoSlide]);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  useEffect(() => {
    if (!api) return;
    api.on("pointerDown", stopAutoSlide);
    api.on("pointerUp", startAutoSlide);
    api.on("select", startAutoSlide);
    return () => {
      api.off("pointerDown", stopAutoSlide);
      api.off("pointerUp", startAutoSlide);
      api.off("select", startAutoSlide);
    };
  }, [api, startAutoSlide, stopAutoSlide]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.14 0.05 240) 40%, oklch(0.12 0.03 260) 100%)",
      }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, oklch(0.45 0.12 243) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, oklch(0.71 0.17 48) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.7 0.13 195) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Text */}
        <motion.div style={{ opacity }} className="space-y-6 lg:space-y-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-white/50 font-body"
          >
            <Link to="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="hover:text-white/80 transition-colors text-white/40"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-white/70 truncate max-w-[180px]">
              {product.name}
            </span>
          </motion.div>

          {/* Category tags + Stock badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2 flex-wrap"
          >
            {product.badge && (
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  background: "oklch(0.71 0.17 48 / 0.15)",
                  border: "1px solid oklch(0.71 0.17 48 / 0.4)",
                  color: "#F47B20",
                }}
              >
                ⭐ {product.badge}
              </span>
            )}
            {categoryTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() =>
                  navigate({
                    to: "/products",
                    search: { category: tag.slug },
                  })
                }
                data-ocid={`product-category-tag-${tag.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-smooth hover:opacity-80 cursor-pointer"
                style={{
                  background: "oklch(0.7 0.13 195 / 0.12)",
                  border: "1px solid oklch(0.7 0.13 195 / 0.3)",
                  color: "#3BBFBF",
                }}
                aria-label={`Browse ${tag.name} category`}
              >
                {tag.name}
              </button>
            ))}
            {categoryTags.length === 0 && product.category && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  background: "oklch(0.7 0.13 195 / 0.12)",
                  border: "1px solid oklch(0.7 0.13 195 / 0.3)",
                  color: "#3BBFBF",
                }}
              >
                {product.category}
              </span>
            )}
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white">
              {product.name}
            </h1>
          </motion.div>

          {product.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg text-white/75 leading-relaxed font-body max-w-lg"
            >
              {product.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={
                product.stock > 0
                  ? {
                      background: "oklch(0.55 0.17 145 / 0.15)",
                      border: "1px solid oklch(0.55 0.17 145 / 0.3)",
                      color: "#4ade80",
                    }
                  : {
                      background: "oklch(0.65 0.19 22 / 0.15)",
                      border: "1px solid oklch(0.65 0.19 22 / 0.3)",
                      color: "#f87171",
                    }
              }
            >
              {product.stock > 0 ? "✓ In Stock" : "✗ Out of Stock"}
            </span>
            {product.sku && (
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold"
                style={{
                  background: "rgba(244, 123, 32, 0.12)",
                  border: "1px solid rgba(244, 123, 32, 0.35)",
                  color: "#ffffff",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/70">
                  SKU
                </span>
                <span className="text-sm font-bold text-white">{product.sku}</span>
              </span>
            )}
          </motion.div>

          {/* Rating */}
          {product.rating > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center gap-3"
            >
              <StarRating rating={product.rating} size="lg" />
              <span className="text-white font-semibold">{product.rating}</span>
              {product.reviews > 0 && (
                <span className="text-white/50 text-sm">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
              )}
            </motion.div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-medium text-white/70"
                  style={{
                    background: "oklch(0.98 0 0 / 0.07)",
                    border: "1px solid oklch(0.98 0 0 / 0.12)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold gradient-text-orange">
                ₹{displayPrice.toLocaleString()}
              </span>
              {showOriginal && (
                <span className="text-xl text-white/40 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-sm font-bold"
                  style={{
                    background: "oklch(0.55 0.17 145 / 0.15)",
                    color: "#4ade80",
                  }}
                >
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <button
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() =>
                toggleItem({
                  productId: product.id,
                  name: product.name,
                  image: heroImage,
                  price: product.price,
                })
              }
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-smooth
                ${wishlisted ? "bg-white/90 border-red-500 text-red-500" : "border-white/15 text-white/70 hover:text-white hover:bg-white/10"}`}
              style={wishlisted ? { boxShadow: "0 0 0 2px #ef4444, 0 2px 8px #ef444433" } : {}}
              data-ocid={`product-wishlist-toggle-${product.id}`}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${wishlisted ? "fill-red-500 text-red-500" : "text-white/70"}`}
                fill={wishlisted ? "#ef4444" : "none"}
                stroke={wishlisted ? "#ef4444" : "currentColor"}
              />
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { icon: "🏆", label: "STEM Certified" },
              { icon: "🏫", label: "School Ready" },
              { icon: "📦", label: "Free Shipping" },
              { icon: "↩️", label: "30-Day Returns" },
            ].map((b) => (
              <span
                key={b.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 font-medium"
                style={{
                  background: "oklch(0.98 0 0 / 0.07)",
                  border: "1px solid oklch(0.98 0 0 / 0.12)",
                }}
              >
                <span>{b.icon}</span> {b.label}
              </span>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-2 text-white/40 text-sm pt-2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.8,
                ease: "easeInOut",
              }}
            >
              ↓
            </motion.div>
            <span>Scroll to explore</span>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y }}
          className="relative flex items-center justify-center"
          layout={false}
        >
          {/* Glow halo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-80 h-80 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #2E6DA4 0%, #F47B20 60%, transparent 80%)",
              }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -16, 0] }}
            transition={{
              opacity: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 0.9, delay: 0.3 },
              y: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              },
            }}
            layout={false}
            style={{ willChange: "transform, opacity" }}
            className="relative z-10 w-full max-w-lg"
          >
            <div
              className="product-image-container aspect-square shadow-glow-primary flex flex-col items-center"
              style={{
                background: "oklch(0.98 0 0 / 0.06)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.98 0 0 / 0.12)",
              }}
              onMouseEnter={stopAutoSlide}
              onMouseLeave={startAutoSlide}
            >
              {heroImages.length > 1 ? (
                <>
                  <Carousel
                    className="w-full h-full"
                    opts={{ loop: false }}
                    setApi={(embla) => {
                      if (!embla) return;
                      setApi(embla);
                      embla.on("select", () => setSelected(embla.selectedScrollSnap()));
                    }}
                  >
                    <CarouselContent>
                      {heroImages.map((img, idx) => (
                        <CarouselItem key={img} className="flex items-center justify-center aspect-square">
                          <img
                            src={img}
                            alt={getProductImageAlt(getProductDisplayName(product), idx)}
                            width={800}
                            height={800}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.jpg";
                            }}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  {/* Dots indicator */}
                  <div className="flex justify-center gap-1 mt-2">
                    {heroImages.map((image, idx) => (
                      <button
                        key={`hero-dot-${image}`}
                        type="button"
                        aria-label={`View image ${idx + 1}`}
                        onClick={() => api?.scrollTo?.(idx)}
                        className={`w-2 h-2 rounded-full ${selected === idx ? "bg-primary" : "bg-muted-foreground/30"} inline-block`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <img
                  src={heroImages[0]}
                  alt={getProductImageAlt(getProductDisplayName(product))}
                  width={800}
                  height={800}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Anchor Nav ───────────────────────────────────────────────────────────────
function AnchorNav({
  visible,
  anchors,
}: {
  visible: boolean;
  anchors: Array<{ id: string; label: string }>;
}) {
  const [active, setActive] = useState(anchors[0]?.id ?? "overview");

  useEffect(() => {
    if (!anchors.some((anchor) => anchor.id === active)) {
      setActive(anchors[0]?.id ?? "overview");
    }
  }, [anchors, active]);

  function scrollTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-16 left-0 right-0 z-30 flex justify-center py-3 pointer-events-none"
          aria-label="Page section navigation"
        >
          <div
            className="pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-full"
            style={{
              background: "oklch(0.14 0.02 250 / 0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid oklch(0.98 0 0 / 0.1)",
            }}
          >
            {anchors.map((anchor) => (
              <button
                type="button"
                key={anchor.id}
                onClick={() => scrollTo(anchor.id)}
                data-ocid={`anchor-nav-${anchor.id}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${active === anchor.id ? "text-white" : "text-white/50 hover:text-white/80"}`}
                style={
                  active === anchor.id ? { background: "oklch(0.45 0.12 243)" } : {}
                }
              >
                {anchor.label}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

// ─── Storytelling Sections ────────────────────────────────────────────────────
function StorySection({ overview }: { overview: string }) {
  return (
    <section id="overview" className="py-24 lg:py-32 overflow-hidden">
      <div
        className="max-w-6xl mx-auto px-6 lg:px-12"
        style={{
          background: "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.12 0.03 248) 100%)",
        }}
      >
        <div className="rounded-[2.5rem] border border-border bg-background/90 p-8 lg:p-14 shadow-glow-primary">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Product Overview
              </span>
              <h2 className="font-display font-bold text-4xl lg:text-5xl mt-4 text-foreground">
                What makes this product unique
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed font-body">
              {overview}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Video Section ────────────────────────────────────────────────────────────
function VideoSection({ videoUrl }: { videoUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(videoUrl), [videoUrl]);

  if (!embedUrl) return null;

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <section
      id="video-section"
      className="py-24 lg:py-32 overflow-hidden relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.13 0.04 248) 0%, oklch(0.1 0.04 250) 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.71 0.17 48) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-6%] left-[-4%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, oklch(0.45 0.12 243) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal delay={0.1}>
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest text-white/40">
              Product Demo
            </span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mt-3 text-white">
              See It <span className="gradient-text-orange">In Action</span>
            </h2>
            <p className="mt-4 text-white/60 text-lg max-w-2xl mx-auto font-body leading-relaxed">
              Watch how students build, code, and innovate with the Tinkro
              Robotics Kit
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative mx-auto max-w-4xl">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl overflow-hidden shadow-glow-orange group"
              style={{
                aspectRatio: "16/9",
                border: "1px solid oklch(0.71 0.17 48 / 0.3)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.15 0.06 240) 30%, oklch(0.12 0.05 220) 60%, oklch(0.08 0.03 260) 100%)",
                }}
              />
              <div className="absolute inset-0 opacity-20">
                {[15, 35, 55, 72, 88].map((top) => (
                  <div
                    key={`h-${top}`}
                    className="absolute left-0 right-0 h-px"
                    style={{
                      top: `${top}%`,
                      background:
                        "linear-gradient(90deg, transparent 0%, oklch(0.7 0.13 195 / 0.6) 20%, oklch(0.7 0.13 195 / 0.6) 80%, transparent 100%)",
                    }}
                  />
                ))}
                {[12, 28, 50, 72, 88].map((left) => (
                  <div
                    key={`v-${left}`}
                    className="absolute top-0 bottom-0 w-px"
                    style={{
                      left: `${left}%`,
                      background:
                        "linear-gradient(180deg, transparent 0%, oklch(0.45 0.12 243 / 0.5) 25%, oklch(0.45 0.12 243 / 0.5) 75%, transparent 100%)",
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                <motion.div
                  className="text-white/15 font-display font-bold text-6xl lg:text-8xl tracking-tight select-none"
                  animate={{ opacity: [0.1, 0.18, 0.1] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  TINKRO
                </motion.div>
                <p className="text-white/30 font-body text-sm uppercase tracking-widest">
                  Robotics Kit — Build Demo
                </p>
              </div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-all duration-500 pointer-events-none" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div
                  className="w-40 h-40 rounded-full blur-3xl opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.71 0.17 48) 0%, transparent 70%)",
                  }}
                />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={openModal}
                  aria-label="Play product demo video"
                  data-ocid="video-play-btn"
                  className="relative focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/60 rounded-full"
                >
                  <motion.div
                    className="relative"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{
                      duration: 2.2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                      transition={{
                        duration: 1.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeOut",
                      }}
                      style={{ background: "oklch(0.71 0.17 48 / 0.4)" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{ scale: [1, 2.1], opacity: [0.3, 0] }}
                      transition={{
                        duration: 1.8,
                        delay: 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeOut",
                      }}
                      style={{ background: "oklch(0.71 0.17 48 / 0.25)" }}
                    />
                    <div
                      className="relative z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-glow-orange"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.71 0.17 48) 0%, oklch(0.76 0.16 72) 100%)",
                      }}
                    >
                      <div
                        className="ml-1.5"
                        style={{
                          width: 0,
                          height: 0,
                          borderStyle: "solid",
                          borderWidth: "12px 0 12px 22px",
                          borderColor:
                            "transparent transparent transparent white",
                        }}
                      />
                    </div>
                  </motion.div>
                </button>
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-3 mt-5">
              <div
                className="w-8 h-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.71 0.17 48), oklch(0.7 0.13 195))",
                }}
              />
              <p className="text-white/50 text-sm font-body">
                Click to play · 4 min build walkthrough
              </p>
              <div
                className="w-8 h-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.7 0.13 195), oklch(0.71 0.17 48))",
                }}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={closeModal}
            data-ocid="video-modal-overlay"
          >
            <motion.div
              key="video-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden"
              style={{
                border: "1px solid oklch(0.71 0.17 48 / 0.4)",
                boxShadow: "0 0 60px rgba(244,123,32,0.25)",
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              data-ocid="video-modal-content"
            >
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close video"
                data-ocid="video-modal-close"
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                style={{
                  background: "oklch(0.1 0.04 250 / 0.85)",
                  border: "1px solid oklch(0.98 0 0 / 0.15)",
                }}
              >
                ✕
              </button>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title="Product demo video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function getProductInfoItems(product: AdminProduct) {
  const items: Array<{ label: string; value: string }> = [];

  const addValue = (label: string, value: unknown) => {
    if (value === undefined || value === null) return;

    if (typeof value === "string") {
      const normalized = value.trim();
      if (normalized) {
        items.push({ label, value: normalized });
      }
      return;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      items.push({ label, value: String(value) });
      return;
    }

    if (Array.isArray(value)) {
      const normalized = value
        .filter(
          (entry): entry is string | number =>
            entry !== null && entry !== undefined && String(entry).trim() !== "",
        )
        .map((entry) => String(entry).trim())
        .join(", ");

      if (normalized) {
        items.push({ label, value: normalized });
      }
      return;
    }

    if (typeof value === "object") {
      const normalized = Object.entries(value as Record<string, unknown>)
        .map(([key, entryValue]) => {
          if (entryValue === undefined || entryValue === null) return null;
          if (
            typeof entryValue === "string" ||
            typeof entryValue === "number" ||
            typeof entryValue === "boolean"
          ) {
            return `${key}: ${String(entryValue)}`;
          }
          return null;
        })
        .filter(Boolean)
        .join(", ");

      if (normalized) {
        items.push({ label, value: normalized });
      }
    }
  };

  addValue("SKU", product.sku);
  addValue("Brand", product.brand);
  addValue("Manufacturer", product.manufacturer);
  addValue("Material", product.material);
  addValue("Warranty", product.warranty);
  addValue("Country of Origin", product.countryOfOrigin);
  addValue("Dimensions", product.dimensions);
  addValue("Weight", product.weight);

  if (product.specifications) {
    Object.entries(product.specifications).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const normalizedKey = key.trim();
      if (!normalizedKey) return;
      const ignoredKeys = new Set([
        "sku",
        "brand",
        "manufacturer",
        "material",
        "warranty",
        "countryOfOrigin",
        "dimensions",
        "weight",
      ]);

      if (ignoredKeys.has(normalizedKey.toLowerCase())) return;
      addValue(normalizedKey, value);
    });
  }

  return items;
}

// ─── Kit Contents Section ─────────────────────────────────────────────────────
function KitContentsSection({ product }: { product: AdminProduct }) {
  const [open, setOpen] = useState(false);
  const contents = useMemo(
    () => product.kitContents?.length ? product.kitContents : product.packageContents ?? [],
    [product.kitContents, product.packageContents],
  );
  const productInfoItems = useMemo(() => getProductInfoItems(product), [product]);
  const showProductInformation = productInfoItems.length > 0;

  if (contents.length === 0) return null;

  return (
    <section id="kit-contents" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              What's in the box
            </span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mt-3 text-foreground">
              Everything <span className="gradient-text-orange">Inside</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto font-body">
              Premium-grade components, all pre-matched and tested to work
              together.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {contents.map((label, i) => (
            <Reveal key={`${label}-${i}`} delay={i * 0.05} direction="up">
              <div
                className="glass-card hover-lift rounded-xl p-5 cursor-default text-center space-y-2 h-full"
                style={{ border: "1px solid oklch(0.88 0.02 243)" }}
              >
                <div className="flex justify-center mb-1">
                  <KitIcon name="layers" />
                </div>
                <p className="font-display font-semibold text-foreground text-sm leading-snug">
                  {label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {showProductInformation && (
          <Reveal delay={0.2}>
            <div className="mt-10 rounded-2xl border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                data-ocid="product-info-accordion-toggle"
                className="w-full flex items-center justify-between px-6 py-5 bg-card hover:bg-muted/50 transition-colors text-left"
                aria-expanded={open}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">ℹ️</span>
                  <span className="font-display font-semibold text-foreground">
                    Product Information
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-muted-foreground"
                >
                  ▾
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="product-info"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-6 bg-muted/30 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                      {productInfoItems.map((item) => (
                        <div key={item.label}>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            {item.label}
                          </p>
                          <p className="text-sm text-foreground font-semibold mt-0.5">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

// ─── Use Cases Section ────────────────────────────────────────────────────────
function UseCasesSection({ useCases }: { useCases: string[] }) {
  if (useCases.length === 0) return null;

  return (
    <section
      id="use-cases"
      className="py-24 lg:py-32"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.12 0.03 248) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-sm font-bold uppercase tracking-widest text-white/40">
              Who it's for
            </span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mt-3 text-white">
              Built <span className="gradient-text">For You</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {useCases.map((title, i) => (
            <Reveal key={`${title}-${i}`} delay={i * 0.12} direction="up">
              <div
                className="glass-card hover-lift rounded-2xl overflow-hidden h-full flex flex-col"
                style={{ background: "oklch(0.45 0.12 243 / 0.08)", border: "1px solid #2E6DA430" }}
              >
                <div className="h-1 w-full" style={{ background: "#2E6DA4" }} />
                <div className="p-7 flex flex-col gap-5 flex-1">
                  <div className="text-4xl">💡</div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed font-body">
                      {title}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ reviews }: { reviews: ProductReview[] }) {
  if (reviews.length === 0) return null;
  const [current, setCurrent] = useState(0);
  const total = Math.ceil(reviews.length / 2);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  const visible = reviews.slice(current * 2, current * 2 + 2);
  const pageKeys = Array.from({ length: total }, (_, i) => `page-${i + 1}`);

  return (
    <section id="reviews" className="py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              From the community
            </span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mt-3 text-foreground">
              What <span className="gradient-text">Builders</span> Say
            </h2>
          </div>
        </Reveal>

        <div className="relative" data-ocid="reviews-carousel">
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {visible.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45 }}
                  className="glass-card rounded-2xl p-6 lg:p-8 space-y-4"
                  style={{ border: "1px solid oklch(0.88 0.02 243)" }}
                >
                  <StarRating rating={r.rating} />
                  <p className="font-display font-semibold text-foreground text-base">
                    "{r.title}"
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed font-body line-clamp-4">
                    {r.content}
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                      style={{
                        background: "linear-gradient(135deg, #2E6DA4, #3BBFBF)",
                      }}
                    >
                      {r.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {r.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {r.role} · {r.date}
                      </p>
                    </div>
                    {r.verified && (
                      <span
                        className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: "oklch(0.7 0.13 195 / 0.12)",
                          color: "#3BBFBF",
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => setCurrent((p) => (p - 1 + total) % total)}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              aria-label="Previous reviews"
              data-ocid="reviews-prev"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {pageKeys.map((key, idx) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setCurrent(idx)}
                  data-ocid={`reviews-dot-${idx + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: idx === current ? 24 : 8,
                    height: 8,
                    background:
                      idx === current ? "#2E6DA4" : "oklch(0.88 0.02 243)",
                  }}
                  aria-label={`Go to review page ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrent((p) => (p + 1) % total)}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              aria-label="Next reviews"
              data-ocid="reviews-next"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Sticky Buy Panel ─────────────────────────────────────────────────────────
function StickyBuyPanel({
  product,
  heroImage,
}: { product: AdminProduct; heroImage: string }) {
  const [visible, setVisible] = useState(false);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToast } = useToastContext();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAdd() {
    setIsAdding(true);
    addItem(
      {
        productId: product.id,
        name: product.name,
        image: heroImage,
        price: product.price,
      },
      qty,
    );
    setTimeout(() => {
      setIsAdding(false);
      addToast(`${product.name} added to cart`, "success");
    }, 400);
  }

  function handleBuyNow() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        image: heroImage,
        price: product.price,
      },
      qty,
    );
    navigate({ to: "/checkout" });
  }

  const showOriginal = product.originalPrice > product.price;
  const discountPct = showOriginal
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:px-6"
          data-ocid="sticky-buy-panel"
        >
          <div
            className="max-w-4xl mx-auto rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.1 0.04 250 / 0.92)",
              backdropFilter: "blur(20px)",
              borderTop: "2px solid #3BBFBF",
              border: "1px solid oklch(0.7 0.13 195 / 0.3)",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-5">
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-white truncate text-sm sm:text-base">
                  {product.name}
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-bold text-lg sm:text-xl gradient-text-orange">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {showOriginal && (
                    <span className="text-white/40 text-sm line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {discountPct > 0 && (
                    <span className="text-green-400 text-xs font-semibold">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div
                className="flex items-center gap-0 rounded-xl overflow-hidden shrink-0"
                style={{ border: "1px solid oklch(0.98 0 0 / 0.15)" }}
              >
                <button
                  type="button"
                  onClick={() => setQty((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg"
                  aria-label="Decrease quantity"
                  data-ocid="qty-decrease"
                >
                  −
                </button>
                <span
                  className="w-10 sm:w-12 text-center text-white font-semibold text-sm sm:text-base"
                  data-ocid="qty-display"
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((p) => p + 1)}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg"
                  aria-label="Increase quantity"
                  data-ocid="qty-increase"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  onClick={handleAdd}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isAdding}
                  type="button"
                  className="relative overflow-hidden rounded-xl px-5 py-3 sm:py-3.5 font-display font-bold text-sm sm:text-base shadow-sm transition-all duration-200 disabled:opacity-70 border"
                  style={{
                    borderColor: "oklch(0.7 0.13 195 / 0.5)",
                    color: "#3BBFBF",
                    background: "oklch(0.7 0.13 195 / 0.1)",
                    minWidth: 130,
                  }}
                  data-ocid="add-to-cart-btn"
                >
                  {isAdding ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-current/40 border-t-current rounded-full" />
                      Adding…
                    </motion.span>
                  ) : (
                    "Add to Cart 🛒"
                  )}
                </motion.button>
                <motion.button
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="relative overflow-hidden rounded-xl px-6 py-3 sm:py-3.5 font-display font-bold text-white text-sm sm:text-base shadow-glow-orange transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                    minWidth: 120,
                  }}
                  data-ocid="buy-now-btn"
                >
                  Buy Now ⚡
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ProductDetailPage() {
  const { slug } = useParams({ from: "/product/$slug" });
  const { product, loading } = useProductById(slug);
  const { categories } = useCategories();
  const [anchorVisible, setAnchorVisible] = useState(false);
  const navigate = useNavigate();
  const heroImage = product?.images?.[0] ?? product?.image ?? "/placeholder.jpg";

  const overviewText = useMemo(
    () => (product?.overview?.trim() || product?.description?.trim() || ""),
    [product?.overview, product?.description],
  );

  const videoEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(product?.demoVideoUrl ?? ""),
    [product?.demoVideoUrl],
  );

  const useCases = useMemo(() => product?.useCases ?? [], [product?.useCases]);

  const reviews = useMemo(
    () =>
      (product?.reviewsArray ?? []).map((review, index) => ({
        id: `${review.name}-${index}`,
        name: review.name,
        role: "",
        date: "",
        rating: review.rating,
        title:
          review.content.length > 70
            ? `${review.content.slice(0, 70).trim()}...`
            : review.content,
        content: review.content,
        verified: false,
      })),
    [product?.reviewsArray],
  );

  const anchors = useMemo(() => {
    const list: Array<{ id: string; label: string }> = [];
    if (overviewText) list.push({ id: "overview", label: "Overview" });
    if (videoEmbedUrl) list.push({ id: "video-section", label: "Demo Video" });
    if ((product?.kitContents?.length ?? product?.packageContents?.length ?? 0) > 0)
      list.push({ id: "kit-contents", label: "Kit Contents" });
    if (useCases.length > 0) list.push({ id: "use-cases", label: "Use Cases" });
    if (reviews.length > 0) list.push({ id: "reviews", label: "Reviews" });
    return list;
  }, [overviewText, videoEmbedUrl, product?.kitContents?.length, product?.packageContents?.length, useCases.length, reviews.length]);

  // Scroll to top on mount (when navigating to product view)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    function onScroll() {
      setAnchorVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const canonicalParam = product ? getProductRouteParam(product) : null;
  useEffect(() => {
    if (product && canonicalParam && slug !== canonicalParam) {
      navigate({
        to: "/product/$slug",
        params: { slug: canonicalParam },
        replace: true,
      });
    }
  }, [product, canonicalParam, slug, navigate]);

  const productSeo = useMemo(() => {
    if (!product) return null;

    const productName = getProductDisplayName(product);
    const canonicalSlug = canonicalParam ?? slug;
    const defaultProductUrl = absoluteUrl(`/product/${canonicalSlug}`);
    const productUrl = normalizeSeoText(product.canonicalUrl)
      ? absoluteUrl(product.canonicalUrl)
      : defaultProductUrl;
    const description = getProductSeoDescription(product, productName);
    const title = normalizeSeoText(product.metaTitle) || `${productName} | Tinkro`;
    const productImages = (
      product.openGraphImage
        ? [product.openGraphImage]
        : Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : [heroImage]
    ).map((image) => absoluteUrl(image));
    const brandName = normalizeSeoText(product.brand) || "Tinkro";
    const productPrice = Number.isFinite(Number(product.price))
      ? Number(product.price)
      : 0;
    const isInStock = product.inStock !== false && Number(product.stock ?? 0) > 0;
    const faqs = getProductFaqs(product);
    const graph: unknown[] = [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: productName,
        description,
        image: productImages,
        brand: {
          "@type": "Brand",
          name: brandName,
        },
        category: product.subCategory
          ? `${product.category} > ${product.subCategory}`
          : product.category,
        keywords: product.keywords?.join(", "),
        material: product.material,
        countryOfOrigin: product.countryOfOrigin,
        manufacturer: product.manufacturer
          ? {
              "@type": "Organization",
              name: product.manufacturer,
            }
          : undefined,
        additionalProperty: [
          ...Object.entries(product.specifications ?? {}).map(([name, value]) => ({
            "@type": "PropertyValue",
            name,
            value: Array.isArray(value) ? value.join(", ") : String(value),
          })),
          ...(product.dimensions
            ? [
                {
                  "@type": "PropertyValue",
                  name: "Dimensions",
                  value:
                    typeof product.dimensions === "string"
                      ? product.dimensions
                      : Object.entries(product.dimensions)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", "),
                },
              ]
            : []),
          ...(product.weight
            ? [
                {
                  "@type": "PropertyValue",
                  name: "Weight",
                  value:
                    typeof product.weight === "string"
                      ? product.weight
                      : Object.entries(product.weight)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", "),
                },
              ]
            : []),
        ],
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          price: productPrice,
          availability: isInStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
        ...(product.sku
          ? {
              sku: product.sku,
            }
          : {}),
        ...(product.gtin ? { gtin: product.gtin } : {}),
        ...(product.mpn ? { mpn: product.mpn } : {}),
        ...(product.rating > 0 && product.reviews > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviews,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${productUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: absoluteUrl("/products"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: productName,
            item: productUrl,
          },
        ],
      },
    ];

    if (faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${productUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    return {
      title,
      description,
      canonicalUrl: productUrl,
      image: {
        url: productImages[0] ?? absoluteUrl(heroImage),
        alt: getProductImageAlt(productName),
      },
      openGraphTitle: product.openGraphTitle,
      openGraphDescription: product.openGraphDescription,
      twitterTitle: product.twitterTitle,
      twitterDescription: product.twitterDescription,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": graph,
      },
      metaTags: [
        {
          attrName: "property" as const,
          attrValue: "product:price:amount",
          content: String(productPrice),
        },
        {
          attrName: "property" as const,
          attrValue: "product:price:currency",
          content: "INR",
        },
        {
          attrName: "property" as const,
          attrValue: "product:availability",
          content: isInStock ? "in stock" : "out of stock",
        },
      ],
    };
  }, [product, canonicalParam, slug, heroImage]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return <ProductNotFound />;

  return (
    <div className="relative" data-ocid="product-detail-page">
      {productSeo && (
        <SEO
          title={productSeo.title}
          description={productSeo.description}
          canonicalUrl={productSeo.canonicalUrl}
          image={productSeo.image}
          type="product"
          openGraphTitle={productSeo.openGraphTitle}
          openGraphDescription={productSeo.openGraphDescription}
          twitterTitle={productSeo.twitterTitle}
          twitterDescription={productSeo.twitterDescription}
          jsonLd={productSeo.jsonLd}
          jsonLdId="product-jsonld"
          metaTags={productSeo.metaTags}
        />
      )}
      <AnchorNav visible={anchorVisible && anchors.length > 0} anchors={anchors} />
      <HeroSection
        product={product}
        heroImage={heroImage}
        categories={categories}
      />
      {overviewText && <StorySection overview={overviewText} />}
      {videoEmbedUrl && <VideoSection videoUrl={videoEmbedUrl} />}
      <KitContentsSection product={product} />
      <UseCasesSection useCases={useCases} />
      <ReviewsSection reviews={reviews} />
      {/* Final CTA */}
      <section
        className="py-24 text-center"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.14 0.05 240) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
              Start your robotics journey{" "}
              <span className="gradient-text-orange">today.</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 font-body">
              Join 10,000+ students, teachers, and makers who've already built
              with Tinkro.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-display font-bold text-white text-lg shadow-glow-orange bg-[#F47B20]"
              data-ocid="final-cta-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Get the Kit — ₹{product.price.toLocaleString()} →
            </motion.button>
            <p className="text-white/30 text-sm mt-4">
              Free shipping · 30-day returns · STEM Certified
            </p>
          </Reveal>
        </div>
      </section>
      <StickyBuyPanel product={product} heroImage={heroImage} />
    </div>
  );
}
