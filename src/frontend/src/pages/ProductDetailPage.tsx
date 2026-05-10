import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToastContext } from "../components/Layout";
import { useCategories, useProductById } from "../lib/publicDataService";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { KitContentItem, ProductReview, UseCase } from "../types";
import type { AdminCategory, AdminProduct } from "../types/admin";

// ─── Fallback static content ──────────────────────────────────────────────────

const FALLBACK_KIT_CONTENTS: KitContentItem[] = [
  {
    iconName: "cpu",
    label: "Arduino Uno R3",
    description: "ATmega328P microcontroller",
    quantity: 1,
  },
  {
    iconName: "truck",
    label: "Smart Car Chassis",
    description: "Transparent acrylic, 4-wheel",
    quantity: 1,
  },
  {
    iconName: "zap",
    label: "DC Gear Motors",
    description: "TT motor, 1:48 reduction",
    quantity: 4,
  },
  {
    iconName: "radio",
    label: "Ultrasonic Sensor",
    description: "HC-SR04, 2–400 cm range",
    quantity: 1,
  },
  {
    iconName: "bluetooth",
    label: "Bluetooth Module",
    description: "HC-05, Class 2, 10m range",
    quantity: 1,
  },
  {
    iconName: "activity",
    label: "IR Line Sensor",
    description: "TCRT5000, 5-channel array",
    quantity: 1,
  },
  {
    iconName: "layers",
    label: "L298N Motor Driver",
    description: "Dual H-Bridge, 2A/channel",
    quantity: 1,
  },
  {
    iconName: "book-open",
    label: "Project Guidebook",
    description: "8 illustrated projects",
    quantity: 1,
  },
];

const FALLBACK_USE_CASES: UseCase[] = [
  {
    id: "students",
    audience: "students",
    icon: "🎓",
    title: "For Students",
    description:
      "Learn real robotics from scratch — no background needed. Build progressively complex projects and gain skills that are valued globally.",
    benefit: "STEM curriculum aligned",
  },
  {
    id: "schools",
    audience: "schools",
    icon: "🏫",
    title: "For Schools",
    description:
      "Bring robotics into every classroom. Our kit supports ATL, STEM Lab, and PM SHRI initiatives with ready-to-teach project packs.",
    benefit: "Bulk pricing available",
  },
  {
    id: "beginners",
    audience: "beginners",
    icon: "🚀",
    title: "For Beginners",
    description:
      "Never touched a microcontroller? That's perfect. The guided path takes you from zero to autonomous robot in under 4 weeks.",
    benefit: "No prior experience needed",
  },
];

const FALLBACK_REVIEWS: ProductReview[] = [
  {
    id: "r1",
    name: "Arjun Mehta",
    role: "Student",
    date: "Jan 2025",
    rating: 5,
    title: "Built my first robot in 3 hours!",
    content:
      "I had zero experience. The step-by-step guide made everything so clear. The Bluetooth car project was my favourite — my whole family was impressed!",
    verified: true,
  },
  {
    id: "r2",
    name: "Ms. Priya Sharma",
    role: "STEM Teacher",
    date: "Feb 2025",
    rating: 5,
    title: "Perfect for classroom use",
    content:
      "We ordered 20 kits for our school lab. The quality is top-notch and the teacher guide saved so much prep time. Students love the projects.",
    verified: true,
  },
  {
    id: "r3",
    name: "Rohan Iyer",
    role: "Parent",
    date: "Mar 2025",
    rating: 5,
    title: "Best birthday gift ever",
    content:
      "Bought this for my son's 13th birthday. He's spent every evening building robots. The quality is amazing and customer support was very helpful.",
    verified: true,
  },
  {
    id: "r4",
    name: "Sneha Patel",
    role: "College Student",
    date: "Mar 2025",
    rating: 4,
    title: "Great value for money",
    content:
      "I wanted something more advanced but this kit taught me a lot of fundamentals. The ultrasonic sensor and line-follower projects are very well designed.",
    verified: false,
  },
];

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
                            alt={product.name}
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
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
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
                  alt={product.name}
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
function AnchorNav({ visible }: { visible: boolean }) {
  const links = [
    { id: "overview", label: "Overview" },
    { id: "video-section", label: "Demo Video" },
    { id: "kit-contents", label: "Kit Contents" },
    { id: "use-cases", label: "Use Cases" },
    { id: "reviews", label: "Reviews" },
  ];
  const [active, setActive] = useState("overview");

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
            {links.map((l) => (
              <button
                type="button"
                key={l.id}
                onClick={() => scrollTo(l.id)}
                data-ocid={`anchor-nav-${l.id}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${active === l.id ? "text-white" : "text-white/50 hover:text-white/80"}`}
                style={
                  active === l.id ? { background: "oklch(0.45 0.12 243)" } : {}
                }
              >
                {l.label}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

// ─── Storytelling Sections ────────────────────────────────────────────────────
function StorySection({ description }: { description: string }) {
  return (
    <section id="overview" className="overflow-hidden">
      {/* Problem */}
      <div
        className="py-24 lg:py-32"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.12 0.03 248) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
            <div className="space-y-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  background: "oklch(0.65 0.19 22 / 0.15)",
                  color: "oklch(0.75 0.18 30)",
                  border: "1px solid oklch(0.65 0.19 22 / 0.3)",
                }}
              >
                The Problem
              </span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight">
                Getting started shouldn't feel like <br />
                <span style={{ color: "oklch(0.75 0.18 30)" }}>
                  solving a puzzle blindfolded.
                </span>
              </h2>
              <p className="text-white/65 text-lg leading-relaxed font-body">
                Most beginners buy random components and get stuck. No guidance,
                no context — just confusion.
              </p>
              <ul className="space-y-3">
                {[
                  "No clear starting point",
                  "Too many components with no context",
                  "Tutorials that assume prior knowledge",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-3 text-white/60">
                    <span className="text-red-400 text-lg">✕</span>
                    <span className="font-body">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.15} direction="right">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-2xl opacity-30 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.65 0.19 22) 0%, transparent 70%)",
                }}
              />
              <div
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                style={{ border: "1px solid oklch(0.65 0.19 22 / 0.2)" }}
              >
                <img
                  src="/assets/generated/story-problem-overwhelmed.dim_800x600.jpg"
                  alt="Student overwhelmed by scattered components"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.1 0.04 250) 0%, transparent 40%)",
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Solution */}
      <div
        className="py-24 lg:py-32"
        style={{ background: "oklch(0.96 0.01 250)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-2xl opacity-20 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, #2E6DA4 0%, transparent 70%)",
                }}
              />
              <div
                className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-glow-primary"
                style={{ border: "1px solid oklch(0.45 0.12 243 / 0.25)" }}
              >
                <img
                  src="/assets/generated/story-solution-kit.dim_800x600.jpg"
                  alt="Tinkro kit unboxing — everything organized and labeled"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15} direction="right">
            <div className="space-y-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  background: "oklch(0.7 0.13 195 / 0.12)",
                  color: "#3BBFBF",
                  border: "1px solid oklch(0.7 0.13 195 / 0.3)",
                }}
              >
                The Solution
              </span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-foreground leading-tight">
                32 components. 8 guided projects. <br />
                <span className="gradient-text">One clear path forward.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-body">
                {description ||
                  "Everything you need to go from unboxing to a fully autonomous robot — no experience required."}
              </p>
              <ul className="space-y-3">
                {[
                  "Pre-matched components that work together",
                  "Step-by-step illustrated guidebook",
                  "8 video projects from LED to autonomous robot",
                  "Community support + teacher resources",
                ].map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-3 text-foreground/80"
                  >
                    <span className="text-lg" style={{ color: "#3BBFBF" }}>
                      ✓
                    </span>
                    <span className="font-body">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Outcome */}
      <div
        className="py-24 lg:py-32"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.13 0.04 248) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
            <div className="space-y-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  background: "oklch(0.71 0.17 48 / 0.15)",
                  color: "#F47B20",
                  border: "1px solid oklch(0.71 0.17 48 / 0.3)",
                }}
              >
                The Outcome
              </span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight">
                From zero to autonomous robot
                <br />
                <span className="gradient-text-orange">in one weekend.</span>
              </h2>
              <p className="text-white/65 text-lg leading-relaxed font-body">
                Students across India are completing their first robotics
                projects in days, not months. The confidence boost is real.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} direction="right">
            <div className="space-y-4">
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-5">
                What you'll build
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "Line-Following Robot",
                    icon: "〰️",
                    desc: "Week 1 project",
                  },
                  {
                    name: "Obstacle Avoider",
                    icon: "📡",
                    desc: "Week 2 project",
                  },
                  { name: "Bluetooth Car", icon: "📶", desc: "Week 3 project" },
                  {
                    name: "Light Sensor Bot",
                    icon: "💡",
                    desc: "Week 4 project",
                  },
                ].map((p, i) => (
                  <Reveal key={p.name} delay={i * 0.08} direction="up">
                    <div
                      className="glass-card hover-lift rounded-xl p-4 cursor-default"
                      style={{
                        background: "oklch(0.98 0 0 / 0.05)",
                        border: "1px solid oklch(0.98 0 0 / 0.1)",
                      }}
                    >
                      <div className="text-3xl mb-3">{p.icon}</div>
                      <p className="font-display font-semibold text-white text-sm">
                        {p.name}
                      </p>
                      <p className="text-white/40 text-xs mt-1">{p.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Outcome image full-width */}
      <div className="relative overflow-hidden" style={{ height: 480 }}>
        <img
          src="/assets/generated/story-outcome-success.dim_800x600.jpg"
          alt="Student holding their completed Tinkro robot"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, oklch(0.1 0.04 250 / 0.8) 0%, transparent 50%, oklch(0.1 0.04 250 / 0.6) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <Reveal direction="left">
              <blockquote className="max-w-lg">
                <p className="font-display text-2xl lg:text-3xl font-bold text-white leading-snug mb-4">
                  "I had zero experience. Three hours later, my robot was
                  navigating the floor on its own."
                </p>
                <footer className="text-white/60 font-body">
                  — Arjun Mehta, Student · Grade 10
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Video Section ────────────────────────────────────────────────────────────
function VideoSection() {
  const [isOpen, setIsOpen] = useState(false);

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
                  src="https://www.youtube.com/embed/pijFRN7fq6M?autoplay=1&rel=0&modestbranding=1"
                  title="Tinkro Robotics Kit — Build Walkthrough"
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

// ─── Kit Contents Section ─────────────────────────────────────────────────────
function KitContentsSection({ items }: { items: KitContentItem[] }) {
  const [open, setOpen] = useState(false);
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05} direction="up">
              <div
                className="glass-card hover-lift rounded-xl p-5 cursor-default text-center space-y-2 h-full"
                style={{ border: "1px solid oklch(0.88 0.02 243)" }}
              >
                <div className="flex justify-center mb-1">
                  <KitIcon name={item.iconName} />
                </div>
                <p className="font-display font-semibold text-foreground text-sm leading-snug">
                  {item.label}
                </p>
                {item.quantity && item.quantity > 1 && (
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "oklch(0.7 0.13 195 / 0.12)",
                      color: "#3BBFBF",
                    }}
                  >
                    ×{item.quantity}
                  </span>
                )}
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-2xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              data-ocid="specs-accordion-toggle"
              className="w-full flex items-center justify-between px-6 py-5 bg-card hover:bg-muted/50 transition-colors text-left"
              aria-expanded={open}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🔬</span>
                <span className="font-display font-semibold text-foreground">
                  Technical Specifications
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
                  key="specs"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-6 bg-muted/30 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {[
                      ["Microcontroller", "Arduino Uno R3 (ATmega328P)"],
                      ["Motor Driver", "L298N Dual H-Bridge, 2A per channel"],
                      ["Ultrasonic Range", "2 cm – 400 cm (HC-SR04)"],
                      ["Bluetooth", "HC-05, Class 2, 10m range"],
                      ["Operating Voltage", "7–12V DC (9V recommended)"],
                      ["Programming", "Arduino IDE (C++), Scratch (optional)"],
                      ["Chassis Material", "Transparent Acrylic, 3mm"],
                      ["Motor Speed", "0–200 RPM (PWM controlled)"],
                      ["Dimensions", "21 × 16 × 9 cm (assembled)"],
                      ["Weight", "420g (complete kit)"],
                      ["Warranty", "12 months (components)"],
                      ["Age Recommendation", "12+ years"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          {k}
                        </p>
                        <p className="text-sm text-foreground font-semibold mt-0.5">
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Use Cases Section ────────────────────────────────────────────────────────
function UseCasesSection({ useCases }: { useCases: UseCase[] }) {
  const accent: Record<string, { top: string; bg: string; badge: string }> = {
    students: {
      top: "#2E6DA4",
      bg: "oklch(0.45 0.12 243 / 0.08)",
      badge: "oklch(0.45 0.12 243 / 0.15)",
    },
    schools: {
      top: "#3BBFBF",
      bg: "oklch(0.7 0.13 195 / 0.08)",
      badge: "oklch(0.7 0.13 195 / 0.15)",
    },
    beginners: {
      top: "#F47B20",
      bg: "oklch(0.71 0.17 48 / 0.08)",
      badge: "oklch(0.71 0.17 48 / 0.15)",
    },
  };

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
          {useCases.map((uc, i) => {
            const c = accent[uc.audience] ?? {
              top: "#2E6DA4",
              bg: "oklch(0.45 0.12 243 / 0.08)",
              badge: "oklch(0.45 0.12 243 / 0.15)",
            };
            return (
              <Reveal key={uc.id} delay={i * 0.12} direction="up">
                <div
                  className="glass-card hover-lift rounded-2xl overflow-hidden h-full flex flex-col"
                  style={{ background: c.bg, border: `1px solid ${c.top}30` }}
                >
                  <div className="h-1 w-full" style={{ background: c.top }} />
                  <div className="p-7 flex flex-col gap-5 flex-1">
                    <div className="text-4xl">{uc.icon}</div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-white mb-2">
                        {uc.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed font-body">
                        {uc.description}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <span
                        className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: c.badge, color: c.top }}
                      >
                        ✓ {uc.benefit}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ reviews }: { reviews: ProductReview[] }) {
  const [current, setCurrent] = useState(0);
  const total = Math.max(1, Math.ceil(reviews.length / 2));

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
  const { id } = useParams({ from: "/product/$id" });
  const { product, loading } = useProductById(id);
  const { categories } = useCategories();
  const [anchorVisible, setAnchorVisible] = useState(false);


  // Scroll to top on mount (when navigating to product view)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    function onScroll() {
      setAnchorVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return <ProductNotFound />;

  const heroImage = product.images?.[0] ?? product.image ?? "/placeholder.jpg";

  return (
    <div className="relative" data-ocid="product-detail-page">
      <AnchorNav visible={anchorVisible} />
      <HeroSection
        product={product}
        heroImage={heroImage}
        categories={categories}
      />
      <StorySection description={product.description ?? ""} />
      <VideoSection />
      <KitContentsSection items={FALLBACK_KIT_CONTENTS} />
      <UseCasesSection useCases={FALLBACK_USE_CASES} />
      <ReviewsSection reviews={FALLBACK_REVIEWS} />
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
