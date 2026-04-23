import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Carousel with dots for product card
function ProductImageCarousel({
  images,
  productName,
  priority,
}: {
  images: string[];
  productName: string;
  priority?: boolean;
}) {
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
    if (!api || images.length <= 1) return;
    stopAutoSlide();
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 3500);
  }, [api, images.length, stopAutoSlide]);

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
    <div
      className="relative w-full h-full flex flex-col items-center"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
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
          {images.map((img, idx) => {
            const shouldLoad = idx === 0 || idx === selected;
            return (
            <CarouselItem key={img} className="flex items-center justify-center h-52">
              <img
                src={shouldLoad ? img : "/placeholder.jpg"}
                alt={productName}
                loading={priority && idx === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />
            </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      {/* Dots indicator */}
      <div className="flex justify-center gap-1 mt-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`View image ${idx + 1}`}
            onClick={() => api?.scrollTo?.(idx)}
            className={`w-2 h-2 rounded-full ${selected === idx ? "bg-primary" : "bg-muted-foreground/30"} inline-block`}
          />
        ))}
      </div>
    </div>
  );
}
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ChevronDown,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToastContext } from "../components/Layout";
import { useCategories, useProducts } from "../lib/publicDataService";
import { useCartStore } from "../store/cartStore";
import type { AdminProduct } from "../types/admin";

// ─── Static filter data ───────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
  "sk-i",
  "sk-j",
  "sk-k",
  "sk-l",
];

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= Math.round(rating)
              ? "fill-[#F47B20] text-[#F47B20]"
              : "fill-muted text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: AdminProduct;
  index: number;
  onAddToCart: (product: AdminProduct) => void;
  onBuyNow: (product: AdminProduct) => void;
}

export function ProductCard({
  product,
  index,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  const isPriority = index < 4;
  const heroImages = product.images && product.images.length > 0 ? product.images : [product.image ?? "/placeholder.jpg"];
  const discountPct =
    product.discount > 0
      ? product.discount
      : product.originalPrice && product.originalPrice > product.price
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100,
          )
        : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      layout={false}
      style={{ willChange: "transform, opacity" }}
      className="group relative glass-card rounded-2xl overflow-hidden hover-lift flex flex-col min-h-[420px]"
      data-ocid={`product-card-${product.id}`}
    >
      {/* Badges */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full gradient-orange text-white shadow-sm">
          {product.badge}
        </span>
      )}
      {discountPct > 0 && (
        <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          -{discountPct}%
        </span>
      )}

      {/* Product images carousel */}
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="product-image-container h-52 mx-4 mt-4 rounded-xl relative">
          {heroImages.length > 1 ? (
            <ProductImageCarousel
              images={heroImages}
              productName={product.name}
              priority={isPriority}
            />
          ) : (
            <img
              src={heroImages[0]}
              alt={product.name}
              loading={isPriority ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.jpg";
              }}
            />
          )}
          {heroImages.length > 1 && (
            <span className="absolute bottom-2 right-2 z-10 text-[10px] font-semibold px-2 py-1 rounded-full bg-black/60 text-white">
              +{heroImages.length - 1}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="space-y-2 min-h-[110px]">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider line-clamp-1 min-h-[16px]">
            {product.category}
          </p>

          <Link to="/product/$id" params={{ id: product.id }}>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors duration-200 min-h-[40px]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 min-h-[18px]">
            {product.rating > 0 ? (
              <>
                <StarRating rating={product.rating} />
                <span className="text-xs text-muted-foreground">
                  {product.rating.toFixed(1)}
                  {product.reviews > 0 && ` (${product.reviews.toLocaleString()})`}
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground/60">&nbsp;</span>
            )}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2 min-h-[44px]">
          <div>
            <span className="text-lg font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-nowrap">
            <button
              type="button"
              onClick={() => onBuyNow(product)}
              data-ocid={`buy-now-${product.id}`}
              className="flex items-center justify-center gap-1 px-2.5 h-8 rounded-xl text-xs font-semibold text-white transition-smooth active:scale-95"
              style={{
                background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
              }}
              aria-label={`Buy ${product.name} now`}
            >
              ⚡ Buy
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              data-ocid={`add-to-cart-${product.id}`}
              className="flex items-center justify-center gap-1.5 px-3 h-8 rounded-xl text-xs font-semibold border transition-smooth active:scale-95"
              style={{
                borderColor: "oklch(0.7 0.13 195 / 0.4)",
                color: "#3BBFBF",
                background: "oklch(0.7 0.13 195 / 0.08)",
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={13} />
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── SkeletonGrid ─────────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {SKELETON_KEYS.map((key) => (
        <div
          key={key}
          className="glass-card rounded-2xl overflow-hidden flex flex-col"
        >
          <Skeleton className="h-52 mx-4 mt-4 rounded-xl" />
          <div className="p-4 flex flex-col gap-3">
            <Skeleton className="h-3 w-1/3 rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
            <div className="flex justify-between mt-2">
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  onReset,
  noData,
}: { onReset: () => void; noData?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
      data-ocid="products-empty-state"
    >
      <div className="text-6xl mb-4">{noData ? "📦" : "🔍"}</div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {noData ? "No products available yet." : "No products found"}
      </h3>
      <p className="text-muted-foreground max-w-xs mb-6">
        {noData
          ? "Check back soon — new products are on their way!"
          : "Try adjusting your filters or browse all categories to find what you're looking for."}
      </p>
      {!noData && (
        <button
          type="button"
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-white shadow-glow-primary hover:opacity-90 transition-smooth"
        >
          Clear Filters
        </button>
      )}
    </motion.div>
  );
}

// ─── Sidebar / Filter Panel content ──────────────────────────────────────────

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface FilterPanelProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  minPrice: string;
  onMinPrice: (v: string) => void;
  maxPrice: string;
  onMaxPrice: (v: string) => void;
  activeFilterCount: number;
  onReset: () => void;
  categoryOptions: CategoryOption[];
}

export function FilterPanelContent({
  selectedCategoryId,
  onSelectCategory,
  minPrice,
  onMinPrice,
  maxPrice,
  onMaxPrice,
  activeFilterCount,
  onReset,
  categoryOptions,
}: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            data-ocid="filter-category-all"
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
              selectedCategoryId === "all"
                ? "gradient-primary text-white shadow-glow-primary"
                : "text-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {categoryOptions.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              data-ocid={`filter-category-${cat.slug}`}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                selectedCategoryId === cat.id
                  ? "gradient-primary text-white shadow-glow-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Price Range (₹)
        </h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="min-price" className="sr-only">
              Minimum price
            </label>
            <input
              id="min-price"
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPrice(e.target.value)}
              data-ocid="filter-price-min"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="max-price" className="sr-only">
              Maximum price
            </label>
            <input
              id="max-price"
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPrice(e.target.value)}
              data-ocid="filter-price-max"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth"
            />
          </div>
        </div>
      </div>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="w-full py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-smooth"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ProductsPage() {
  // Scroll to anchor if hash is present (after navigation)
  useEffect(() => {
    if (window.location.hash === "#all-products") {
      setTimeout(() => {
        const el = document.getElementById("all-products");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, []);
  // Scroll to anchor if hash is present
  useEffect(() => {
    if (window.location.hash === "#all-products") {
      const el = document.getElementById("all-products");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);
  const search = useSearch({ from: "/products" });
  const categorySlugFromUrl = search.category ?? null;

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { addToast } = useToastContext();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const { products, loading: productsLoading } = useProducts();
  const { categories } = useCategories();

  // Build category options from live categories + derive extras from products
  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const fromCategories = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));
    // Also include any product.category strings not represented in categories
    const knownSlugs = new Set(fromCategories.map((c) => c.slug));
    const extras: CategoryOption[] = [];
    const seenNames = new Set(fromCategories.map((c) => c.name));
    for (const p of products) {
      if (p.category && !seenNames.has(p.category)) {
        const slug = p.category.toLowerCase().replace(/[\s&/]+/g, "-");
        if (!knownSlugs.has(slug)) {
          extras.push({ id: p.category, name: p.category, slug });
          seenNames.add(p.category);
        }
      }
    }
    return [...fromCategories, ...extras].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [categories, products]);

  // Auto-select from URL ?category=slug on load or when categories load
  useEffect(() => {
    if (!categorySlugFromUrl) return;
    if (categoryOptions.length === 0) return;
    const match = categoryOptions.find(
      (c) => c.slug === categorySlugFromUrl || c.name === categorySlugFromUrl,
    );
    if (match) {
      setSelectedCategoryId(match.id);
    }
  }, [categorySlugFromUrl, categoryOptions]);

  const handleAddToCart = useCallback(
    (product: AdminProduct) => {
      const heroImage =
        product.images?.[0] ?? product.image ?? "/placeholder.jpg";
      addItem(
        {
          productId: product.id,
          name: product.name,
          image: heroImage,
          price: product.price,
        },
        1,
      );
      addToast(`${product.name} added to cart`, "success");
    },
    [addItem, addToast],
  );

  const handleBuyNow = useCallback(
    (product: AdminProduct) => {
      const heroImage =
        product.images?.[0] ?? product.image ?? "/placeholder.jpg";
      addItem(
        {
          productId: product.id,
          name: product.name,
          image: heroImage,
          price: product.price,
        },
        1,
      );
      navigate({ to: "/checkout" });
    },
    [addItem, navigate],
  );

  const resetFilters = useCallback(() => {
    setSelectedCategoryId("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("relevance");
    navigate({ to: "/products" });
  }, [navigate]);

  const activeFilterCount = [
    selectedCategoryId !== "all",
    minPrice !== "",
    maxPrice !== "",
  ].filter(Boolean).length;

  // Client-side filtering with categoryIds array-contains + string fallback
  const filteredProducts = useMemo(() => {
    let result: AdminProduct[] = [...products];

    if (selectedCategoryId !== "all") {
      result = result.filter((p) => {
        // New-style: categoryIds array
        if (Array.isArray(p.categoryIds) && p.categoryIds.length > 0) {
          return p.categoryIds.includes(selectedCategoryId);
        }
        // Legacy: single categoryId
        if (p.categoryId && p.categoryId === selectedCategoryId) return true;
        // Legacy string name match
        return p.category === selectedCategoryId;
      });
    }

    const min = minPrice !== "" ? Number.parseFloat(minPrice) : null;
    const max = maxPrice !== "" ? Number.parseFloat(maxPrice) : null;
    if (min !== null) result = result.filter((p) => p.price >= min);
    if (max !== null) result = result.filter((p) => p.price <= max);

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating")
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return result;
  }, [selectedCategoryId, minPrice, maxPrice, sortBy, products]);

  // Derive display name for the active category chip
  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === "all") return null;
    return (
      categoryOptions.find((c) => c.id === selectedCategoryId)?.name ??
      selectedCategoryId
    );
  }, [selectedCategoryId, categoryOptions]);

  const filterPanelProps: FilterPanelProps = {
    selectedCategoryId,
    onSelectCategory: setSelectedCategoryId,
    minPrice,
    onMinPrice: setMinPrice,
    maxPrice,
    onMaxPrice: setMaxPrice,
    activeFilterCount,
    onReset: resetFilters,
    categoryOptions,
  };

  return (
    <>
      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16">
        {/* Premium gradient background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(120deg, #f8fafc 0%, #e0e7ef 40%, #f5f7fa 100%)",
          }}
        />
        {/* Soft color overlays for depth */}
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl opacity-60 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(244,123,32,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-120px] right-1/4 w-[600px] h-[350px] rounded-full blur-3xl opacity-50 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(46,109,164,0.13) 0%, transparent 70%)",
          }}
        />
        {/* Subtle white overlay for glass effect */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-5">
              🛒 Shop All Products
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-5">
              <span className="text-gray-900 drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]">Explore</span> <span className="gradient-text-orange drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]">All Products</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Premium robotics kits, sensors, development boards, and components
              — curated for students, makers, and schools across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Products Section ─────────────────────────────────────────────────── */}
      <section id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8 items-start">
          {/* ── Desktop sticky sidebar ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 glass-card rounded-2xl p-5 border border-border/50">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={16} className="text-primary" />
                <h2 className="text-sm font-bold text-foreground">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full gradient-orange text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <FilterPanelContent {...filterPanelProps} />
            </div>
          </aside>

          {/* ── Right column ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                data-ocid="filter-panel-toggle"
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:border-primary transition-smooth"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full gradient-orange text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Results count */}
              {!productsLoading && (
                <p
                  className="text-sm text-muted-foreground"
                  data-ocid="products-count"
                >
                  <span className="font-semibold text-foreground">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
              )}

              {/* Sort dropdown */}
              <div className="ml-auto flex items-center gap-2">
                <label
                  htmlFor="sort-select"
                  className="text-sm text-muted-foreground hidden sm:block"
                >
                  Sort:
                </label>
                <div className="relative">
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    data-ocid="sort-select"
                    className="appearance-none pr-8 pl-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Mobile collapsible filter panel */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="lg:hidden overflow-hidden mb-6"
                >
                  <div className="glass-card rounded-2xl p-5 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal size={16} className="text-primary" />
                        <h2 className="text-sm font-bold text-foreground">
                          Filters
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFiltersOpen(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close filters"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <FilterPanelContent {...filterPanelProps} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCategoryId !== "all" && selectedCategoryName && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId("all");
                      navigate({ to: "/products" });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-smooth"
                  >
                    {selectedCategoryName}
                    <X size={11} />
                  </button>
                )}
                {minPrice !== "" && (
                  <button
                    type="button"
                    onClick={() => setMinPrice("")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-smooth"
                  >
                    Min ₹{minPrice}
                    <X size={11} />
                  </button>
                )}
                {maxPrice !== "" && (
                  <button
                    type="button"
                    onClick={() => setMaxPrice("")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-smooth"
                  >
                    Max ₹{maxPrice}
                    <X size={11} />
                  </button>
                )}
              </div>
            )}

            {/* Loading skeleton */}
            {productsLoading && <SkeletonGrid />}

            {/* Product grid or empty state */}
            {!productsLoading && (
              <AnimatePresence mode="wait">
                {products.length === 0 ? (
                  <EmptyState
                    key="empty-no-data"
                    onReset={resetFilters}
                    noData
                  />
                ) : filteredProducts.length === 0 ? (
                  <EmptyState key="empty" onReset={resetFilters} />
                ) : (
                  <motion.div
                    key={`grid-${selectedCategoryId}-${minPrice}-${maxPrice}-${sortBy}`}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {filteredProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
