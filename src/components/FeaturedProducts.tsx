import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { memo, useCallback, useState } from "react";
import { useToastContext } from "../components/Layout";
import { getProductRouteParam } from "../lib/slug";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { AdminProduct } from "../types/admin";

// Explicit skeleton key list — avoids no-array-index-key
const SKELETON_KEYS = [
  "sk-fp-0",
  "sk-fp-1",
  "sk-fp-2",
  "sk-fp-3",
  "sk-fp-4",
  "sk-fp-5",
];

interface ProductCardProps {
  product: AdminProduct;
  index: number;
  isHovered: boolean;
  onHoverEnter: (id: string) => void;
  onHoverLeave: () => void;
  onBuyNow: (product: AdminProduct) => void;
  onAddToCart: (product: AdminProduct) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  index,
  isHovered,
  onHoverEnter,
  onHoverLeave,
  onBuyNow,
  onAddToCart,
}: ProductCardProps) {
  const productParam = getProductRouteParam(product);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const wishlisted = isInWishlist(product.id);
  const productImage =
    product.images?.[0] || product.image || "/dp.jpg";
  const hasMultipleImages = (product.images?.length ?? 0) > 1;
  const discountPct =
    product.discount > 0
      ? product.discount
      : product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      layout={false}
      onMouseEnter={() => onHoverEnter(product.id)}
      onMouseLeave={onHoverLeave}
      className="group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative h-[460px]"
      style={{
        willChange: "transform, opacity",
        background:
          "linear-gradient(165deg, #ffffff 0%, #ffffff 62%, rgba(59,191,191,0.06) 100%)",
        border: "1px solid",
        borderColor: isHovered ? "rgba(59,191,191,0.4)" : "rgba(46,109,164,0.12)",
        boxShadow: isHovered
          ? "0 20px 44px rgba(59, 191, 191, 0.22), 0 6px 16px rgba(46,109,164,0.12)"
          : "0 4px 16px rgba(15,23,42,0.06)",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
      }}
      data-ocid="product-card"
    >
      {/* Premium gradient accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{
          background:
            "linear-gradient(90deg, #2E6DA4 0%, #3BBFBF 50%, #F47B20 100%)",
          opacity: isHovered ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        }}
      />
      <Link to="/product/$slug" params={{ slug: productParam }} className="block">
        <div className="relative overflow-hidden flex items-center justify-center" style={{ height: "220px", background: "#ffffff", padding: 12, borderRadius: 16 }}>
          <img
            src={productImage}
            alt={`${product.name} from Tinkro`}
            loading="lazy"
            decoding="async"
            width={240}
            height={200}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "160px",
              maxHeight: "160px",
              objectFit: "contain",
              objectPosition: "center",
              boxShadow: "0 12px 36px rgba(15,23,42,0.08)",
              borderRadius: "12px",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.06)" : "scale(1)",
              background: "#ffffff"
            }}
          />
          {hasMultipleImages && (
            <div className="absolute bottom-3 right-3 z-10">
              <Badge
                className="border-0 text-[10px] font-semibold text-white"
                style={{ background: "rgba(15, 23, 42, 0.65)" }}
              >
                +{(product.images?.length ?? 0) - 1}
              </Badge>
            </div>
          )}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <Badge
                className="border-0 text-xs font-semibold shadow-sm text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #2E6DA4 0%, #3BBFBF 100%)",
                }}
              >
                {product.badge}
              </Badge>
            </div>
          )}
          {discountPct > 0 && (
            <div className="absolute bottom-3 right-3 z-10">
              <Badge
                className="border-0 text-xs text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                }}
              >
                {discountPct}% OFF
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        aria-label="Add to wishlist"
        onClick={() =>
          toggleItem({
            productId: product.id,
            name: product.name,
            image: productImage,
            price: product.price,
          })
        }
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-white hover:text-destructive z-10"
      >
        <Heart
          className={`w-4 h-4 ${
            wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </button>

      <div className="p-5 flex flex-col flex-1 min-h-0 gap-2">
        <Link
          to="/product/$slug"
          params={{ slug: productParam }}
          className="block space-y-1 hover:no-underline"
        >
          <p
            className="text-xs font-medium uppercase tracking-wide line-clamp-1 min-h-[16px]"
            style={{ color: "#3BBFBF" }}
          >
            {product.category}
          </p>
          <h3 className="font-display font-semibold text-foreground leading-tight line-clamp-2 text-sm min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* SKU — always the real Firestore value, never fabricated. The line
            is always reserved (even when empty) so every card lines up. */}
        <p className="text-xs text-muted-foreground line-clamp-1 min-h-[16px]">
          {product.sku ? `SKU: ${product.sku}` : "\u00A0"}
        </p>

        <div className="flex items-center gap-1.5 min-h-[18px]">
          {product.rating > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">
                {product.rating.toFixed(1)}
              </span>
              {product.reviews > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground/60">&nbsp;</span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border/10 flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span
              className="font-display font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, #2E6DA4 0%, #3BBFBF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => onAddToCart(product)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-1.5 text-sm h-10 rounded-lg font-semibold transition-colors"
              style={{
                background: "rgba(46,109,164,0.08)",
                border: "1.5px solid rgba(46,109,164,0.35)",
                color: "#2E6DA4",
              }}
              data-ocid="product-add-to-cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </motion.button>

            <motion.button
              type="button"
              onClick={() => onBuyNow(product)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-1.5 text-white text-sm h-10 rounded-lg font-semibold"
              style={{
                background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                boxShadow: "0 6px 16px rgba(244,123,32,0.28)",
              }}
              data-ocid="product-buy-now"
              aria-label={`Buy ${product.name} now`}
            >
              <Zap className="w-4 h-4" />
              Buy
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

interface FeaturedProductsProps {
  products: AdminProduct[];
  loading?: boolean;
}

export const FeaturedProducts = memo(function FeaturedProducts({
  products,
  loading = false,
}: FeaturedProductsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { addToast } = useToastContext();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const handleBuyNow = useCallback(
    (product: AdminProduct) => {
      addItem(
        {
          productId: product.id,
          name: product.name,
          image:
            product.images[0] ||
            product.image ||
            "/assets/images/placeholder.svg",
          price: product.price,
        },
        1,
      );
      addToast(`${product.name} added to cart`, "success");
      navigate({ to: "/checkout" });
    },
    [addItem, addToast, navigate],
  );

  const handleAddToCart = useCallback(
    (product: AdminProduct) => {
      addItem(
        {
          productId: product.id,
          name: product.name,
          image:
            product.images[0] ||
            product.image ||
            "/assets/images/placeholder.svg",
          price: product.price,
        },
        1,
      );
      addToast(`${product.name} added to cart`, "success");
    },
    [addItem, addToast],
  );

  const handleHoverEnter = useCallback((id: string) => setHoveredId(id), []);
  const handleHoverLeave = useCallback(() => setHoveredId(null), []);

  return (
    <section className="py-24 bg-muted/30" id="products">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          layout={false}
          className="text-center mb-16 space-y-4"
        >
          <p
            className="font-semibold text-sm tracking-widest uppercase"
            style={{ color: "#3BBFBF" }}
          >
            Products
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground">
            Featured{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E6DA4 0%, #3BBFBF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Premium Products
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Handpicked best-sellers trusted by schools and students across
            India.
          </p>
        </motion.div>

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-[460px]"
              >
                <Skeleton className="h-[220px] w-full rounded-none shrink-0" />
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-3 w-8 rounded" />
                  </div>
                  <div className="mt-auto flex flex-col gap-3 pt-4">
                    <Skeleton className="h-5 w-16 rounded" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-full rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 space-y-4"
            data-ocid="products-empty-state"
          >
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="font-display font-semibold text-xl text-foreground">
              Featured products coming soon
            </h3>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm">
              Our team is curating the best robotics products. Check back
              shortly!
            </p>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/products" })}
              className="mt-4"
              style={{ borderColor: "rgba(46,109,164,0.35)", color: "#2E6DA4" }}
            >
              Browse All Products
            </Button>
          </motion.div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  isHovered={hoveredId === product.id}
                  onHoverEnter={handleHoverEnter}
                  onHoverLeave={handleHoverLeave}
                  onBuyNow={handleBuyNow}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              layout={false}
              className="text-center mt-12"
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/products" })}
                className="transition-smooth px-8"
                style={{
                  borderColor: "rgba(46,109,164,0.35)",
                  color: "#2E6DA4",
                }}
                data-ocid="products-view-all"
              >
                View All Products
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
});
