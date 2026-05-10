import { useBlogPosts } from "@/lib/publicDataService";
import type { AdminBlogPost } from "@/types/admin";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Calendar, Search, Tag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Tutorials: {
    bg: "rgba(59,191,191,0.15)",
    text: "#3BBFBF",
    border: "rgba(59,191,191,0.35)",
  },
  "Case Studies": {
    bg: "rgba(244,123,32,0.15)",
    text: "#F47B20",
    border: "rgba(244,123,32,0.35)",
  },
  News: {
    bg: "rgba(245,166,35,0.15)",
    text: "#F5A623",
    border: "rgba(245,166,35,0.35)",
  },
  Guides: {
    bg: "rgba(46,109,164,0.15)",
    text: "#5b9fd4",
    border: "rgba(46,109,164,0.4)",
  },
};

const DEFAULT_CATEGORY_COLORS = {
  bg: "rgba(59,191,191,0.15)",
  text: "#3BBFBF",
  border: "rgba(59,191,191,0.35)",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 flex flex-col"
      style={{
        background:
          "linear-gradient(145deg, rgba(15,39,68,0.92) 0%, rgba(10,22,40,0.96) 100%)",
      }}
    >
      <div className="h-44 bg-white/5 animate-pulse" />
      <div className="p-6 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-white/10 animate-pulse" />
          <div className="h-5 w-16 rounded-full bg-white/5 animate-pulse" />
        </div>
        <div className="h-5 w-full rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-4/5 rounded bg-white/8 animate-pulse" />
        <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
        <div className="flex justify-between pt-4 border-t border-white/10">
          <div className="h-4 w-24 rounded bg-white/8 animate-pulse" />
          <div className="h-4 w-16 rounded bg-white/8 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/15 mb-16"
      style={{
        background:
          "linear-gradient(135deg, rgba(15,39,68,0.95) 0%, rgba(10,22,40,0.98) 100%)",
      }}
    >
      <div className="grid md:grid-cols-2 gap-0">
        <div className="h-64 md:h-80 bg-white/5 animate-pulse" />
        <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
          <div className="h-6 w-28 rounded-full bg-white/10 animate-pulse" />
          <div className="h-8 w-full rounded bg-white/10 animate-pulse" />
          <div className="h-8 w-3/4 rounded bg-white/10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-white/6 animate-pulse" />
            <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-white/5 animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-24 rounded bg-white/8 animate-pulse" />
            <div className="h-4 w-24 rounded bg-white/8 animate-pulse" />
          </div>
          <div className="h-11 w-36 rounded-xl bg-white/10 animate-pulse mt-2" />
        </div>
      </div>
    </div>
  );
}

// ─── Featured Article ─────────────────────────────────────────────────────────

function FeaturedArticle({
  post,
  onNavigate,
}: { post: AdminBlogPost; onNavigate: (id: string) => void }) {
  const colors = CATEGORY_COLORS[post.category] ?? DEFAULT_CATEGORY_COLORS;
  const heroImage = post.featuredImage || post.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden mb-16 group cursor-pointer"
      style={{
        border: "2px solid rgba(244,123,32,0.45)",
        boxShadow: "0 0 50px rgba(244,123,32,0.18), 0 8px 32px rgba(0,0,0,0.4)",
      }}
      onClick={() => onNavigate(post.id)}
      data-ocid="blog-featured-article"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #0f2744 0%, #1a4a8c 50%, #0a1628 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(244,123,32,0.25) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 grid md:grid-cols-2 gap-0">
        {/* Visual side */}
        <div className="relative overflow-hidden min-h-[260px] md:min-h-[380px] bg-[#0a1628]">
          {heroImage ? (
            <img
              src={heroImage}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0f2744 0%, #1a4a8c 60%, #0f2744 100%)",
              }}
            />
          )}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 40% 50%, rgba(244,123,32,0.4) 0%, transparent 65%)",
            }}
          />
          {!heroImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="text-7xl mb-4">📰</div>
                <span className="text-[#3BBFBF] text-xs font-mono uppercase tracking-[0.2em]">
                  Featured Article
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#0f2744]/80 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#0f2744] to-transparent md:hidden" />
        </div>

        {/* Content side */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              {post.category}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-4 group-hover:text-[#F5A623] transition-colors duration-300">
            {post.title}
          </h2>

          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 line-clamp-4">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 mb-6 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#3BBFBF]" />
              {post.author}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#3BBFBF]" />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          <button
            type="button"
            className="self-start flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 group/btn"
            style={{
              background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
              boxShadow: "0 0 20px rgba(244,123,32,0.35)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.boxShadow = "0 0 32px rgba(244,123,32,0.65)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.boxShadow = "0 0 20px rgba(244,123,32,0.35)";
              el.style.transform = "translateY(0)";
            }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(post.id);
            }}
            data-ocid="blog-featured-read-more"
          >
            Read Article
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({
  post,
  index,
  onNavigate,
}: { post: AdminBlogPost; index: number; onNavigate: (id: string) => void }) {
  const colors = CATEGORY_COLORS[post.category] ?? DEFAULT_CATEGORY_COLORS;
  const heroImage = post.featuredImage || post.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      style={{
        background:
          "linear-gradient(145deg, rgba(15,39,68,0.92) 0%, rgba(10,22,40,0.96) 100%)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
      onClick={() => onNavigate(post.id)}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow =
          "0 12px 40px rgba(0,0,0,0.45), 0 0 30px rgba(244,123,32,0.15)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
      }}
      data-ocid={`blog-article-card-${post.id}`}
    >
      {/* Image area */}
      <div className="relative overflow-hidden h-44 flex-shrink-0 bg-[#0a1628]">
        {heroImage ? (
          <img
            src={heroImage}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #0f2744 0%, #1a4a8c 100%)",
            }}
          />
        )}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 60% 60%, rgba(244,123,32,0.25) 0%, transparent 70%)",
          }}
        />
        {!heroImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-70">📰</span>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#0a1628] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Tag className="w-2.5 h-2.5" />
            {post.category}
          </span>
        </div>

        <h3 className="text-base font-display font-bold text-white leading-snug mb-3 group-hover:text-[#F5A623] transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.45)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs text-white/45">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-[#3BBFBF]" />
              {post.author}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#3BBFBF]" />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 hover:gap-2 text-[#F47B20]"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(post.id);
            }}
            data-ocid={`blog-article-read-more-${post.id}`}
          >
            Read More
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BlogPage() {
  const { posts, loading } = useBlogPosts();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const p of posts) {
      cats.add(p.category);
    }
    return ["All", ...Array.from(cats).sort()];
  }, [posts]);

  const featuredPost = useMemo(() => posts[0] ?? null, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const isDefaultView = activeCategory === "All" && searchQuery.trim() === "";
  const gridPosts = isDefaultView ? filteredPosts.slice(1) : filteredPosts;

  function navigateToBlog(id: string) {
    void navigate({ to: "/blog/$id", params: { id } });
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #060d1a 0%, #0a1628 40%, #07111f 100%)",
      }}
    >
      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 20%, rgba(46,109,164,0.35) 0%, rgba(59,191,191,0.12) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 100% 50%, rgba(244,123,32,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5 border"
              style={{
                color: "#3BBFBF",
                borderColor: "rgba(59,191,191,0.3)",
                background: "rgba(59,191,191,0.1)",
              }}
            >
              Tinkro Learning Hub
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white mb-6 leading-tight"
          >
            Learn &amp; <span className="gradient-text-orange">Build</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Robotics tutorials, hands-on guides, school case studies, and the
            latest STEM education news — everything you need to build smarter.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-white placeholder-white/35 text-sm outline-none transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,191,191,0.5)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(59,191,191,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
              data-ocid="blog-search-input"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="container mx-auto px-6 max-w-6xl pb-24">
        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-12 justify-center"
          data-ocid="blog-category-filters"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250 border"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)"
                    : "rgba(255,255,255,0.06)",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                  borderColor: isActive
                    ? "transparent"
                    : "rgba(255,255,255,0.14)",
                  boxShadow: isActive
                    ? "0 0 16px rgba(244,123,32,0.45)"
                    : "none",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}
                data-ocid={`blog-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Loading state */}
        {loading && (
          <>
            <FeaturedSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKELETON_KEYS.map((k) => (
                <ArticleSkeleton key={k} />
              ))}
            </div>
          </>
        )}

        {/* Loaded state */}
        {!loading && (
          <>
            {/* Featured post (only in default All view, no search) */}
            {isDefaultView && featuredPost && (
              <FeaturedArticle
                post={featuredPost}
                onNavigate={navigateToBlog}
              />
            )}

            <AnimatePresence mode="wait">
              {posts.length === 0 ? (
                <motion.div
                  key="empty-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                  data-ocid="blog-empty-state"
                >
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">
                    No blog posts yet
                  </h3>
                  <p className="text-white/50 text-sm">
                    Check back soon — new articles are being published
                    regularly.
                  </p>
                </motion.div>
              ) : filteredPosts.length === 0 ? (
                <motion.div
                  key="empty-filtered"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                  data-ocid="blog-empty-state"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">
                    No articles found
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    Try a different search term or select another category.
                  </p>
                  <button
                    type="button"
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white border border-white/20 hover:border-[#3BBFBF]/50 transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All");
                    }}
                    data-ocid="blog-clear-filters"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`grid-${activeCategory}-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  data-ocid="blog-article-grid"
                >
                  {gridPosts.map((post, index) => (
                    <ArticleCard
                      key={post.id}
                      post={post}
                      index={index}
                      onNavigate={navigateToBlog}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>

      {/* ── Newsletter CTA ── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f2744 0%, #142e56 50%, #0f2744 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(244,123,32,0.15) 0%, transparent 60%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 max-w-2xl text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Stay Ahead in <span className="gradient-text-orange">Robotics</span>
          </h2>
          <p className="text-white/60 mb-8 text-base">
            Get the latest tutorials, case studies, and product guides delivered
            to your inbox every week.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-white placeholder-white/40 text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,191,191,0.5)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              }}
              data-ocid="blog-newsletter-email"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                boxShadow: "0 0 20px rgba(244,123,32,0.35)",
              }}
              data-ocid="blog-newsletter-subscribe"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
