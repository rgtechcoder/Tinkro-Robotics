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
                alt={`${productName} product view ${idx + 1} from Tinkro`}
                loading={priority && idx === 0 ? "eager" : "lazy"}
                decoding="async"
                width={320}
                height={320}
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
        {images.map((img, idx) => (
          <button
            key={img}
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
  Activity,
  ArrowUpRight,
  BookOpen,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Gauge,
  Heart,
  IndianRupee,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToastContext } from "../components/Layout";
import {
  searchProductsInList,
  useCategories,
  useProducts,
} from "../lib/publicDataService";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  removeJsonLd,
  setJsonLd,
  upsertLinkTag,
  upsertMetaTag,
} from "../lib/seo";
import { getProductRouteParam } from "../lib/slug";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { AdminProduct } from "../types/admin";

// ─── Static filter data ───────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const SHOP_BENEFITS = [
  {
    title: "Best Price",
    eyebrow: "SMART VALUE",
    description: "Fair prices for every project and budget.",
    icon: IndianRupee,
    accent: "text-orange-600 bg-gradient-to-br from-orange-100 to-amber-50",
    gradient: "from-orange-50 via-white to-amber-50",
    glow: "bg-orange-400/20",
  },
  {
    title: "Quality Checked",
    eyebrow: "BUILT TO TRUST",
    description: "Reliable products selected for makers.",
    icon: ShieldCheck,
    accent: "text-primary bg-gradient-to-br from-blue-100 to-cyan-50",
    gradient: "from-blue-50 via-white to-cyan-50",
    glow: "bg-blue-400/20",
  },
  {
    title: "Fast Dispatch",
    eyebrow: "READY TO SHIP",
    description: "Packed carefully and shipped quickly.",
    icon: Truck,
    accent: "text-teal-600 bg-gradient-to-br from-teal-100 to-emerald-50",
    gradient: "from-teal-50 via-white to-emerald-50",
    glow: "bg-teal-400/20",
  },
];

const SKELETON_KEYS = Array.from({ length: 24 }, (_, index) => `sk-${index}`);

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
  const productParam = getProductRouteParam(product);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const wishlisted = isInWishlist(product.id);
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
        <span className="absolute top-3 right-12 z-10 text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          -{discountPct}%
        </span>
      )}
      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() =>
          toggleItem({
            productId: product.id,
            name: product.name,
            image: heroImages[0],
            price: product.price,
          })
        }
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-white"
        data-ocid={`wishlist-toggle-${product.id}`}
      >
        <Heart
          className={`w-4 h-4 ${
            wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Product images carousel */}
      <Link to="/product/$slug" params={{ slug: productParam }} className="block">
        <div className="product-image-container h-64 mx-4 mt-4 rounded-xl relative flex items-center justify-center p-3"
          style={{ background: "#ffffff" }}>
          {heroImages.length > 1 ? (
            <ProductImageCarousel
              images={heroImages}
              productName={product.name}
              priority={isPriority}
            />
          ) : (
              <img
                src={heroImages[0]}
                alt={`${product.name} from Tinkro`}
                loading={isPriority ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={isPriority ? "high" : "low"}
                width={320}
                height={320}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="max-h-full max-w-full object-contain"
                style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.06)", borderRadius: 12, background: "#ffffff" }}
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

          <Link to="/product/$slug" params={{ slug: productParam }}>
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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {SKELETON_KEYS.slice(0, 18).map((key) => (
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

interface CategoryFaq {
  question: string;
  answer: string;
}

function getCategoryCanonicalUrl(category: CategoryOption | null) {
  if (!category) return `${SITE_URL}/products`;
  return `${SITE_URL}/products?category=${encodeURIComponent(category.slug)}`;
}

function getCategoryProductUrl(product: AdminProduct) {
  return `${SITE_URL}/product/${getProductRouteParam(product)}`;
}

function getCategoryImage(product: AdminProduct | null) {
  return absoluteUrl(product?.images?.[0] ?? product?.image ?? "/assets/brand/logo.png");
}

function buildCategorySeoTitle(categoryName: string | null) {
  return categoryName
    ? `Buy ${categoryName} Online in India | ${SITE_NAME}`
    : `Buy Robotics Kits, STEM Products & Electronics Online | ${SITE_NAME}`;
}

function buildCategoryMetaDescription(
  categoryName: string | null,
  productCount: number,
) {
  const name = categoryName ?? "robotics kits, STEM products, sensors, boards, and electronics components";
  const countText =
    productCount > 0 ? ` Browse ${productCount} curated products` : " Browse curated products";
  return `${countText} in ${name} at Tinkro. Shop reliable maker, school, and robotics supplies online in India with clear specs and fast delivery.`;
}

function buildCategoryLongDescription(
  categoryName: string | null,
  products: AdminProduct[],
) {
  const name = categoryName ?? "robotics kits, STEM products, sensors, boards, and electronics components";
  const featuredNames = products
    .slice(0, 5)
    .map((product) => product.name)
    .filter(Boolean)
    .join(", ");
  const featuredSentence = featuredNames
    ? `Featured options in this collection include ${featuredNames}, helping buyers compare practical choices before they order.`
    : "The collection is refreshed as new classroom, maker, and prototyping products become available.";

  return `Buy ${name} online in India from Tinkro, a focused ecommerce store for students, makers, educators, robotics clubs, labs, and engineering teams. This category brings together products selected for real projects, learning outcomes, repair work, experimentation, and repeat classroom use. You can explore parts and kits that support electronics prototyping, automation, coding practice, embedded systems, mechanical builds, sensor experiments, and STEM activities. Each product page is designed to help you evaluate what the item does, how it can be used, and whether it fits your build requirements before adding it to cart. ${featuredSentence} Tinkro keeps the shopping experience practical by grouping related products, showing clear pricing in INR, and maintaining product information that supports informed decisions. Whether you are ordering for a school lab, a workshop, a hobby project, a competition prototype, or a small production run, this category helps you discover compatible tools and components without moving through unrelated listings. Use the product cards to compare prices, ratings, images, availability, and category fit. For best results, review specifications, compatibility, warranty, package contents, and application notes on individual product pages when available.`;
}

function buildCategoryFaqs(categoryName: string | null): CategoryFaq[] {
  const name = categoryName ?? "Tinkro robotics and STEM products";
  return [
    {
      question: `Where can I buy ${name} online in India?`,
      answer: `You can buy ${name} online from Tinkro with category-wise browsing, product images, pricing in INR, and delivery support across India.`,
    },
    {
      question: `How do I choose the right ${name}?`,
      answer:
        "Compare the product description, specifications, compatibility, application notes, package contents, ratings, and stock status before placing an order.",
    },
    {
      question: `Are ${name} suitable for schools and maker projects?`,
      answer:
        "Tinkro curates products for students, educators, makers, robotics clubs, prototyping, workshops, STEM labs, and hands-on electronics learning.",
    },
    {
      question: `Do product pages include technical details for ${name}?`,
      answer:
        "Product pages can include descriptions, images, features, specifications, compatibility, applications, warranty, and related ecommerce details when available in the catalog.",
    },
  ];
}

function buildRelatedCategories(
  selectedCategoryId: string,
  categoryOptions: CategoryOption[],
) {
  return categoryOptions
    .filter((category) => category.id !== selectedCategoryId)
    .slice(0, 8);
}

function buildFeaturedProducts(products: AdminProduct[]) {
  return products
    .filter((product) => product.isActive !== false)
    .slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 8);
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
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
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
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
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
  const search = useSearch({ from: "/products" });
  const categorySlugFromUrl = search.category ?? null;
  const searchTerm = (search.q ?? "").trim();

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
    let result: AdminProduct[] = searchTerm
      ? searchProductsInList(products, searchTerm)
      : [...products];

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
  }, [selectedCategoryId, minPrice, maxPrice, sortBy, products, searchTerm]);

  // Keep each desktop page to six rows with the fixed 3-column sidebar layout.
  const pageSize = 18;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginationResetKey = `${selectedCategoryId}|${minPrice}|${maxPrice}|${sortBy}|${searchTerm}`;

  useEffect(() => {
    void paginationResetKey;
    setCurrentPage(1);
  }, [paginationResetKey]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [currentPage, filteredProducts, pageSize]);

  const goToPage = useCallback((page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    requestAnimationFrame(() => {
      document.getElementById("all-products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [totalPages]);

  // Derive display name for the active category chip
  const selectedCategoryOption = useMemo(() => {
    if (selectedCategoryId === "all") return null;
    return (
      categoryOptions.find((category) => category.id === selectedCategoryId) ??
      null
    );
  }, [selectedCategoryId, categoryOptions]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === "all") return null;
    return selectedCategoryOption?.name ?? selectedCategoryId;
  }, [selectedCategoryId, selectedCategoryOption]);

  useEffect(() => {
    const categoryTitle = buildCategorySeoTitle(selectedCategoryName);
    const description = buildCategoryMetaDescription(
      selectedCategoryName,
      filteredProducts.length,
    );
    const longDescription = buildCategoryLongDescription(
      selectedCategoryName,
      filteredProducts,
    );
    const canonicalUrl = getCategoryCanonicalUrl(selectedCategoryOption);
    const featuredProducts = buildFeaturedProducts(filteredProducts);
    const ogImage = getCategoryImage(featuredProducts[0] ?? null);
    const relatedCategories = buildRelatedCategories(
      selectedCategoryId,
      categoryOptions,
    );
    const faqs = buildCategoryFaqs(selectedCategoryName);
    const relatedCategoryLinks = relatedCategories.map((category) =>
      getCategoryCanonicalUrl(category),
    );
    const featuredProductLinks = featuredProducts.map(getCategoryProductUrl);

    document.title = categoryTitle;
    upsertLinkTag("canonical", canonicalUrl);
    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "robots", "index,follow");
    upsertMetaTag("property", "og:title", categoryTitle);
    upsertMetaTag("property", "og:description", description);
    upsertMetaTag("property", "og:type", "website");
    upsertMetaTag("property", "og:url", canonicalUrl);
    upsertMetaTag("property", "og:image", ogImage);
    upsertMetaTag("property", "og:site_name", SITE_NAME);
    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", categoryTitle);
    upsertMetaTag("name", "twitter:description", description);
    upsertMetaTag("name", "twitter:image", ogImage);

    const listItems = filteredProducts.slice(0, 50).map((p, index) => {
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          "@id": `${getCategoryProductUrl(p)}#product`,
          name: p.name,
          url: getCategoryProductUrl(p),
          image: getCategoryImage(p),
          description: p.metaDescription || p.description || `${p.name} from Tinkro`,
          brand: {
            "@type": "Brand",
            name: p.brand || SITE_NAME,
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: p.price,
            availability:
              p.inStock !== false && p.stock !== 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: getCategoryProductUrl(p),
          },
        },
      };
    });

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalUrl}#collection`,
          name: categoryTitle,
          url: canonicalUrl,
          description: longDescription,
          isPartOf: {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
          },
          mainEntity: {
            "@id": `${canonicalUrl}#itemlist`,
          },
          about: selectedCategoryName ?? "Robotics kits, STEM products, and electronics",
          relatedLink: relatedCategoryLinks,
          significantLink: featuredProductLinks,
        },
        {
          "@type": "ItemList",
          "@id": `${canonicalUrl}#itemlist`,
          name: selectedCategoryName
            ? `${selectedCategoryName} products`
            : "Tinkro products",
          description,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: listItems.length,
          itemListElement: listItems,
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${SITE_URL}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Products",
              item: `${SITE_URL}/products`,
            },
            ...(selectedCategoryName
              ? [
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: selectedCategoryName,
                    item: canonicalUrl,
                  },
                ]
              : []),
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
      ],
    };

    const scriptId = "products-jsonld";
    setJsonLd(scriptId, jsonLd);

    return () => {
      removeJsonLd(scriptId);
    };
  }, [
    categoryOptions,
    filteredProducts,
    selectedCategoryId,
    selectedCategoryName,
    selectedCategoryOption,
  ]);

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
    <div className="relative isolate min-h-screen overflow-clip bg-slate-50/70">
      {/* Soft robotics-inspired canvas behind the shopping content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,109,164,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(46,109,164,0.045) 1px, transparent 1px), radial-gradient(circle at 15% 18%, rgba(59,191,191,0.13), transparent 24%), radial-gradient(circle at 84% 58%, rgba(244,123,32,0.09), transparent 25%)",
          backgroundSize: "44px 44px, 44px 44px, 100% 100%, 100% 100%",
        }}
      />
      <div aria-hidden="true" className="robotics-scan-line pointer-events-none absolute left-0 right-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute left-[7%] top-[32rem] -z-10 h-44 w-44 rounded-full border border-primary/10 opacity-70 motion-safe:animate-[spin_28s_linear_infinite]">
        <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-primary shadow-[0_0_14px_4px_rgba(46,109,164,0.35)]" />
        <span className="absolute left-1/2 -top-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_4px_rgba(59,191,191,0.35)]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[58rem] -z-10 h-56 w-56 rounded-full border border-orange-400/10 opacity-60 motion-safe:animate-[spin_34s_linear_infinite_reverse]">
        <span className="absolute -left-1 top-1/2 h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_14px_4px_rgba(244,123,32,0.3)]" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute left-[12%] top-[43rem] -z-10 hidden h-px w-32 bg-gradient-to-r from-transparent via-primary/25 to-transparent lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[16%] top-[76rem] -z-10 hidden h-px w-40 bg-gradient-to-r from-transparent via-accent/25 to-transparent lg:block" />

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-10 lg:pt-20 lg:pb-12">
        {/* Premium gradient background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(120deg, #f8fafc 0%, #e8f3fa 45%, #fff7ed 100%)",
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

        {/* Animated circuit traces: a quiet robotics signal running behind the hero */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
          <svg viewBox="0 0 1200 430" className="h-full w-full" fill="none" preserveAspectRatio="none">
            <title>Animated Tinkro robotics circuit network</title>
            <defs>
              <linearGradient id="circuit-blue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#2E6DA4" stopOpacity="0" />
                <stop offset="0.45" stopColor="#2E6DA4" stopOpacity="0.45" />
                <stop offset="1" stopColor="#3BBFBF" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="circuit-orange" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#F47B20" stopOpacity="0.05" />
                <stop offset="0.55" stopColor="#F47B20" stopOpacity="0.4" />
                <stop offset="1" stopColor="#F5A623" stopOpacity="0" />
              </linearGradient>
              <filter id="circuit-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path d="M0 112H168L220 62H390L430 102H610" stroke="url(#circuit-blue)" strokeWidth="1.5" />
            <path d="M1200 286H1030L980 336H820L776 292H640" stroke="url(#circuit-orange)" strokeWidth="1.5" />
            <path d="M0 350H112L158 304H280" stroke="url(#circuit-orange)" strokeWidth="1" opacity="0.55" />
            <path d="M1200 92H1105L1060 137H930" stroke="url(#circuit-blue)" strokeWidth="1" opacity="0.55" />
            <motion.path
              d="M0 112H168L220 62H390L430 102H610"
              stroke="#3BBFBF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 180"
              filter="url(#circuit-glow)"
              animate={{ strokeDashoffset: [0, -360] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <motion.path
              d="M1200 286H1030L980 336H820L776 292H640"
              stroke="#F47B20"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 160"
              filter="url(#circuit-glow)"
              animate={{ strokeDashoffset: [0, 320] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 1 }}
            />
            {[
              { cx: 220, cy: 62, color: "#3BBFBF" },
              { cx: 430, cy: 102, color: "#2E6DA4" },
              { cx: 980, cy: 336, color: "#F47B20" },
              { cx: 776, cy: 292, color: "#F5A623" },
            ].map((node) => (
              <motion.circle
                key={`${node.cx}-${node.cy}`}
                cx={node.cx}
                cy={node.cy}
                r="4"
                fill={node.color}
                filter="url(#circuit-glow)"
                animate={{ opacity: [0.35, 1, 0.35], r: [3, 5, 3] }}
                transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: node.cx / 500 }}
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-4">
                🛒 Shop All Products
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.05] mb-4">
                Explore <span className="gradient-text-orange">All Products</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Premium robotics kits, sensors, development boards, and components
                — curated for students, makers, and schools across India.
              </p>
              <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-semibold text-muted-foreground">
                <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">✓ Genuine products</span>
                <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">⚡ Fast dispatch</span>
                <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">₹ Best value</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden min-h-[210px] sm:block"
              aria-label="Why shop with Tinkro"
            >
              <div className="absolute inset-x-8 top-6 h-40 rounded-[2rem] bg-primary/10 blur-2xl" />
              <div className="relative grid gap-3 sm:grid-cols-3 lg:gap-4">
                {SHOP_BENEFITS.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.45 }}
                      className={`group relative min-h-[190px] overflow-hidden rounded-[1.35rem] border border-white/90 bg-gradient-to-br ${benefit.gradient} p-5 shadow-[0_14px_30px_rgba(15,23,42,0.10)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_38px_rgba(15,23,42,0.16)]`}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(46,109,164,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(46,109,164,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
                      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150 ${benefit.glow}`} />
                      <div className="absolute bottom-5 right-5 h-1.5 w-1.5 rounded-full bg-primary/35 shadow-[0_0_12px_3px_rgba(46,109,164,0.2)] motion-safe:animate-pulse" />
                      <div className="relative flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 shadow-sm ${benefit.accent}`}>
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-current/20">
                            <Icon size={21} strokeWidth={2.2} />
                          </div>
                        </div>
                        <span className="rounded-full border border-black/5 bg-white/60 px-2 py-1 text-[9px] font-bold tracking-[0.14em] text-muted-foreground">
                          {benefit.eyebrow}
                        </span>
                      </div>
                      <div className="relative mt-5 h-px w-10 bg-foreground/15 transition-all duration-300 group-hover:w-16" />
                      <h3 className="relative mt-4 text-base font-bold tracking-tight text-foreground">{benefit.title}</h3>
                      <p className="relative mt-2 text-xs leading-relaxed text-muted-foreground">{benefit.description}</p>
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/0 via-primary/30 to-orange-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
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

              <div className="hidden relative mt-4 overflow-hidden rounded-2xl border border-slate-700/60 bg-[#081a2c] p-4 text-white shadow-[0_18px_45px_rgba(8,26,44,0.24)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: "linear-gradient(rgba(59,191,191,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(59,191,191,0.28) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/15 blur-3xl" />
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent shadow-[0_0_18px_rgba(59,191,191,0.16)]">
                      <BookOpen size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Robotics Lab Notes</p>
                      <p className="text-[10px] text-slate-400">Learn. Build. Explore.</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-accent">Guides</span>
                </div>
                <div className="relative z-10 mt-5 space-y-3">
                  {[
                    "How to choose the right sensor",
                    "Arduino vs ESP32: where to start?",
                    "5 tips for a cleaner robot build",
                  ].map((title, index) => (
                    <Link
                      key={title}
                      to="/blog"
                      className="group block rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent/10 hover:shadow-[0_8px_22px_rgba(59,191,191,0.12)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white">0{index + 1}</span>
                        <ArrowUpRight size={14} className="text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                      </div>
                      <p className="mt-3 text-xs font-bold leading-relaxed text-white">{title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">Practical tips for your next project</p>
                    </Link>
                  ))}
                </div>
                <div className="relative z-10 my-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  <span className="h-px flex-1 bg-accent/20" />
                  <Cpu size={14} className="text-accent" />
                  <span className="h-px flex-1 bg-accent/20" />
                </div>
                <Link
                  to="/blog"
                  className="relative z-10 flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2.5 text-[11px] font-bold text-accent transition-all hover:-translate-y-0.5 hover:bg-accent/20"
                >
                  Explore all robotics guides <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="hidden relative mt-4 overflow-hidden rounded-2xl border border-slate-700/60 bg-[#081a2c] p-5 text-white shadow-[0_18px_45px_rgba(8,26,44,0.28)]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: "linear-gradient(rgba(59,191,191,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(59,191,191,0.28) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute -right-12 top-12 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-orange-500/15 blur-3xl" />
                <motion.div
                  aria-hidden="true"
                  className="absolute right-[-34px] top-20 h-44 w-44 rounded-full border border-accent/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <span className="absolute left-1/2 -top-1.5 h-3 w-3 rounded-full bg-accent shadow-[0_0_16px_5px_rgba(59,191,191,0.5)]" />
                </motion.div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                      <Bot size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Tinkro Build Lab</p>
                      <p className="text-[10px] text-slate-400">Your next idea starts here</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 motion-safe:animate-pulse" /> Online
                  </span>
                </div>

                <div className="relative z-10 mt-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">BUILD PROTOCOL / 01</p>
                  <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight">From component<br /><span className="bg-gradient-to-r from-accent to-orange-300 bg-clip-text text-transparent">to creation.</span></h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">Pick the right parts, connect your ideas, and make something that moves.</p>
                </div>

                <div className="relative z-10 mt-9 space-y-5">
                  <div className="absolute left-[15px] top-4 h-[calc(100%-32px)] w-px bg-gradient-to-b from-accent via-primary to-orange-400/20" />
                  {[
                    { icon: CircuitBoard, title: "Choose your brain", detail: "Boards & controllers" },
                    { icon: Gauge, title: "Add perception", detail: "Sensors & modules" },
                    { icon: Zap, title: "Power the idea", detail: "Motors & accessories" },
                  ].map((stage, index) => {
                    const StageIcon = stage.icon;
                    return (
                      <motion.div
                        key={stage.title}
                        className="relative flex items-center gap-3"
                        initial={{ opacity: 0.55, x: -4 }}
                        animate={{ opacity: [0.55, 1, 0.55], x: [-4, 0, -4] }}
                        transition={{ duration: 3, delay: index * 0.7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-accent/40 bg-[#0b2940] text-accent shadow-[0_0_14px_rgba(59,191,191,0.16)]">
                          <StageIcon size={15} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{stage.title}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{stage.detail}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="relative z-10 mt-10 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <span>Build energy</span><span className="text-accent">72%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-orange-400"
                      animate={{ width: ["58%", "72%", "64%", "72%"] }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <Link
                  to="/blog"
                  className="relative z-10 mt-5 flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2.5 text-[11px] font-bold text-accent transition-all hover:bg-accent/20"
                >
                  Open build logs <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="hidden relative mt-4 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-[#0d3150] via-[#0a2339] to-[#081a2c] p-5 text-white shadow-[0_18px_45px_rgba(8,26,44,0.24)]">
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(59,191,191,0.7)_1px,transparent_1px)] [background-size:18px_18px]" />
                <motion.div
                  aria-hidden="true"
                  className="absolute right-[-25px] top-20 h-44 w-44 rounded-full border border-accent/25"
                  animate={{ scale: [0.82, 1, 0.82], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <span className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left bg-gradient-to-r from-accent to-transparent" />
                  <span className="absolute right-1/2 top-1/2 h-2 w-2 rounded-full bg-accent shadow-[0_0_15px_5px_rgba(59,191,191,0.45)]" />
                </motion.div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-300/30 bg-orange-300/10 text-orange-300">
                      <Sparkles size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">Project Signal</p>
                      <p className="text-[10px] text-slate-400">Ideas detected nearby</p>
                    </div>
                  </div>
                  <Activity size={17} className="text-accent motion-safe:animate-pulse" />
                </div>
                <div className="relative z-10 mt-10 max-w-[170px]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">STARTER IDEAS / 03</p>
                  <h3 className="mt-3 text-xl font-bold leading-tight">What will you<br /><span className="text-accent">build next?</span></h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">A small idea today can become a working robot tomorrow.</p>
                </div>
                <div className="relative z-10 mt-8 space-y-2.5">
                  {[
                    ["01", "Smart home", "Sense & automate"],
                    ["02", "Line follower", "Move & navigate"],
                    ["03", "Weather station", "Measure & learn"],
                  ].map(([number, title, detail]) => (
                    <Link
                      key={number}
                      to="/blog"
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent/10"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-[9px] font-bold text-accent">{number}</span>
                      <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-white">{title}</span><span className="mt-0.5 block text-[10px] text-slate-500">{detail}</span></span>
                      <ArrowUpRight size={14} className="text-slate-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </Link>
                  ))}
                </div>
                <Link
                  to="/blog"
                  className="relative z-10 mt-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-3 py-2.5 text-[11px] font-bold text-white shadow-glow-accent transition-all hover:-translate-y-0.5"
                >
                  Discover ideas <ArrowUpRight size={14} />
                </Link>
              </div>
          </aside>

          {/* ── Right column ── */}
          <div className="flex-1 min-w-0">
            {/* Search results banner */}
            {searchTerm && (
              <div
                className="flex flex-wrap items-center justify-between gap-3 mb-5 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5"
                data-ocid="search-results-banner"
              >
                <p className="text-sm text-foreground">
                  Showing results for{" "}
                  <span className="font-semibold">"{searchTerm}"</span>
                  {!productsLoading && (
                    <span className="text-muted-foreground">
                      {" "}
                      — {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "product" : "products"}{" "}
                      found
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/products",
                      search: selectedCategoryId !== "all"
                        ? { category: categorySlugFromUrl ?? undefined }
                        : {},
                    })
                  }
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  data-ocid="clear-search"
                >
                  Clear search ✕
                </button>
              </div>
            )}

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

            {/* Mobile-first discovery card: keeps the robotics content available without the desktop sidebar. */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-[#0d3150] via-[#0a2339] to-[#081a2c] p-4 text-white shadow-[0_14px_32px_rgba(8,26,44,0.18)] lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <Bot size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Tinkro Build Lab</p>
                    <p className="text-[10px] text-slate-400">Build something that moves.</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 motion-safe:animate-pulse" /> Live
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="max-w-[15rem] text-xs leading-relaxed text-slate-400">Explore boards, sensors and motors for your next robotics project.</p>
                <Link to="/blog" className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-accent px-3 py-2 text-[10px] font-bold text-white shadow-glow-accent">
                  Explore <ArrowUpRight size={13} className="ml-1 inline" />
                </Link>
              </div>
            </div>

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
                    key={`grid-${selectedCategoryId}-${minPrice}-${maxPrice}-${sortBy}-${currentPage}`}
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {paginatedProducts.map((product, index) => (
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

            {!productsLoading && filteredProducts.length > 0 && totalPages > 1 && (
              <div className="mt-10 overflow-hidden rounded-2xl border border-white/80 bg-white/70 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">Continue exploring</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} products
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Page {currentPage} <span className="text-muted-foreground">/ {totalPages}</span>
                  </div>
                </div>
                <div className="mb-5 h-1 overflow-hidden rounded-full bg-slate-200/80">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-orange-400"
                    initial={false}
                    animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-10 items-center gap-1.5 rounded-xl border border-border bg-white px-3 text-xs font-semibold text-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous products page"
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        aria-label={`Go to products page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`h-10 min-w-10 rounded-xl px-3 text-xs font-bold transition-all ${currentPage === page ? "gradient-primary text-white shadow-glow-primary" : "border border-transparent text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary"}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-10 items-center gap-1.5 rounded-xl gradient-primary px-3 text-xs font-semibold text-white shadow-glow-primary transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    aria-label="Next products page"
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
