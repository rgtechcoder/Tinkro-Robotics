import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { memo, useState } from "react";
import type { AdminCategory } from "../types/admin";

// Explicit skeleton key list — avoids no-array-index-key
const SKELETON_KEYS = [
  "sk-cat-0",
  "sk-cat-1",
  "sk-cat-2",
  "sk-cat-3",
  "sk-cat-4",
  "sk-cat-5",
];

interface CategoriesProps {
  categories: AdminCategory[];
  loading?: boolean;
}

export const CategoriesSection = memo(function CategoriesSection({
  categories,
  loading = false,
}: CategoriesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate({ to: "/products", search: { category: slug } });
  };

  return (
    <section className="py-24 bg-background" id="categories">
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
            Collections
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground">
            Shop by{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2E6DA4 0%, #3BBFBF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Category
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Explore our curated range of robotics and STEM products — from first
            experiments to advanced AI projects.
          </p>
        </motion.div>

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card border border-border"
              >
                <Skeleton className="w-full aspect-square rounded-xl" />
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 space-y-4"
            data-ocid="categories-empty-state"
          >
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-display font-semibold text-xl text-foreground">
              Categories coming soon
            </h3>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm">
              We're organizing our collection. Check back soon!
            </p>
          </motion.div>
        )}

        {/* Category horizontal scroll row */}
        {!loading && categories.length > 0 && (
          <>
            <div
              className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  layout={false}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onMouseEnter={() => setHoveredId(cat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="group flex flex-col items-center gap-3 p-4 min-w-[220px] max-w-[240px] rounded-2xl bg-card border border-border transition-all duration-300 text-center overflow-hidden"
                  style={{
                    borderColor:
                      hoveredId === cat.id ? "rgba(244,123,32,0.4)" : undefined,
                    boxShadow:
                      hoveredId === cat.id
                        ? "0 0 20px 4px rgba(244, 123, 32, 0.18), 0 8px 24px rgba(0,0,0,0.06)"
                        : undefined,
                  }}
                  data-ocid="category-card"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted relative">
                    <img
                      src={cat.imageUrl || "/assets/images/placeholder.svg"}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      width={120}
                      height={120}
                      className="w-full h-full transition-smooth"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        transform:
                          hoveredId === cat.id ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background:
                          hoveredId === cat.id
                            ? "linear-gradient(to top, rgba(244,123,32,0.45) 0%, transparent 60%)"
                            : "linear-gradient(to top, rgba(26,46,74,0.4) 0%, transparent 60%)",
                      }}
                    />
                  </div>
                  <div className="space-y-0.5 w-full">
                    <p
                      className="font-display font-semibold text-sm leading-tight truncate transition-colors duration-200"
                      style={{
                        color: hoveredId === cat.id ? "#F47B20" : undefined,
                      }}
                    >
                      {cat.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cat.productCount > 0
                        ? `${cat.productCount} items`
                        : cat.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              layout={false}
              className="text-center mt-10"
            >
              <button
                type="button"
                onClick={() => navigate({ to: "/products" })}
                className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all duration-200 text-sm"
                style={{ color: "#2E6DA4" }}
              >
                View all categories
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
});
