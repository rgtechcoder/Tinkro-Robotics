import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

export function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-5">
          <Heart className="w-10 h-10 text-orange-400" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2 text-foreground">
          Your wishlist is empty
        </h2>
        <p className="text-muted-foreground text-base mb-6 max-w-md">
          Save your favorite items here and grab them anytime.
        </p>
        <Button
          size="lg"
          className="gradient-orange text-white border-0 shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-smooth"
          onClick={() => navigate({ to: "/products" })}
        >
          Browse Products
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Wishlist
              </h1>
              <p className="text-sm text-muted-foreground">
                {items.length} item{items.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4 flex flex-col"
            >
              <div className="w-full h-48 rounded-xl bg-white/5 border border-border/40 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-foreground line-clamp-2">
                {item.name}
              </h3>
              <p className="mt-1 text-base font-bold text-foreground">
                ₹{item.price.toLocaleString("en-IN")}
              </p>

              <div className="mt-auto pt-4 flex items-center gap-2">
                <Button
                  className="flex-1 gradient-orange text-white border-0"
                  onClick={() =>
                    addItem(
                      {
                        productId: item.productId,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                      },
                      1,
                    )
                  }
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => removeItem(item.productId)}
                  className="border-border/60"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
