import { useBlogPostById, useBlogPosts } from "@/lib/publicDataService";
import type { AdminBlogPost } from "@/types/admin";
import { useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Eye, Tag, User } from "lucide-react";
import { motion } from "motion/react";

// ─── Constants ────────────────────────────────────────────────────────────────

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

const DEFAULT_COLORS = {
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

function estimateReadTime(content: string): string {
  const words = content
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BlogDetailSkeleton() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #060d1a 0%, #0a1628 40%, #07111f 100%)",
      }}
    >
      {/* Hero skeleton */}
      <div className="relative h-[55vh] min-h-[380px] bg-white/5 animate-pulse" />

      <div className="container mx-auto px-6 max-w-3xl py-16">
        {/* Title */}
        <div className="space-y-3 mb-8">
          <div className="h-8 w-3/4 rounded bg-white/10 animate-pulse" />
          <div className="h-8 w-1/2 rounded bg-white/8 animate-pulse" />
        </div>
        {/* Meta */}
        <div className="flex gap-6 mb-10">
          <div className="h-4 w-28 rounded bg-white/8 animate-pulse" />
          <div className="h-4 w-24 rounded bg-white/8 animate-pulse" />
          <div className="h-4 w-20 rounded bg-white/8 animate-pulse" />
        </div>
        {/* Content */}
        <div className="space-y-4">
          {["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"].map((k) => (
            <div
              key={k}
              className="h-4 rounded bg-white/6 animate-pulse"
              style={{ width: `${85 + (k.charCodeAt(1) % 15)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Related Post Card ────────────────────────────────────────────────────────

function RelatedCard({ post }: { post: AdminBlogPost }) {
  const colors = CATEGORY_COLORS[post.category] ?? DEFAULT_COLORS;

  return (
    <motion.a
      href={`/blog/${post.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-1"
      style={{
        background:
          "linear-gradient(145deg, rgba(15,39,68,0.92) 0%, rgba(10,22,40,0.96) 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        textDecoration: "none",
      }}
      data-ocid={`blog-related-card-${post.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-40">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, #0f2744 0%, #1a4a8c 100%)",
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(10,22,40,0.9) 100%)",
          }}
        />
      </div>
      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <span
          className="self-start text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
          style={{
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        >
          {post.category}
        </span>
        <h4 className="text-sm font-display font-bold text-white line-clamp-2 group-hover:text-[#F5A623] transition-colors duration-300">
          {post.title}
        </h4>
        <p className="text-white/50 text-xs line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        {post.publishedAt && (
          <span className="text-[11px] text-white/35 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </span>
        )}
      </div>
    </motion.a>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BlogDetailPage() {
  const { id } = useParams({ from: "/blog/$id" });
  const { post, loading } = useBlogPostById(id);
  const { posts: allPosts } = useBlogPosts();

  if (loading) return <BlogDetailSkeleton />;

  if (!post) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6"
        style={{
          background: "linear-gradient(180deg, #060d1a 0%, #0a1628 100%)",
        }}
      >
        <div className="text-6xl">📭</div>
        <h1 className="text-3xl font-display font-bold text-white">
          Post not found
        </h1>
        <p className="text-white/50 text-base max-w-sm">
          This article may have been removed or the link is incorrect.
        </p>
        <a
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
            boxShadow: "0 0 20px rgba(244,123,32,0.35)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </a>
      </div>
    );
  }

  const colors = CATEGORY_COLORS[post.category] ?? DEFAULT_COLORS;
  const readTime = estimateReadTime(post.content);
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #060d1a 0%, #0a1628 40%, #07111f 100%)",
      }}
    >
      {/* ── Back Button ── */}
      <div className="container mx-auto px-6 max-w-5xl pt-24 pb-4">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-[#3BBFBF] transition-colors duration-200"
          data-ocid="blog-detail-back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </a>
      </div>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(280px, 50vh, 520px)" }}
      >
        {post.featuredImage ? (
          <motion.img
            src={post.featuredImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0f2744 0%, #1a4a8c 50%, #0a1628 100%)",
            }}
          />
        )}
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,13,26,0.3) 0%, rgba(6,13,26,0.65) 60%, rgba(6,13,26,0.97) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 80%, rgba(244,123,32,0.15) 0%, transparent 60%)",
          }}
        />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 max-w-5xl pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                backdropFilter: "blur(8px)",
              }}
            >
              {post.category}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight mb-4 max-w-3xl"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 text-xs text-white/55"
          >
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
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#3BBFBF]" />
              {readTime}
            </span>
            {post.views > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#3BBFBF]" />
                {post.views.toLocaleString()} views
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="container mx-auto px-6 max-w-3xl py-14">
        {/* Excerpt highlight */}
        {post.excerpt && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mb-10 p-5 rounded-2xl"
            style={{
              background: "rgba(59,191,191,0.07)",
              border: "1px solid rgba(59,191,191,0.2)",
              borderLeft: "4px solid #3BBFBF",
            }}
          >
            <p className="text-white/80 text-base md:text-lg leading-relaxed italic font-light">
              {post.excerpt}
            </p>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose-blog"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: CMS content from admin panel
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/10"
            data-ocid="blog-detail-tags"
          >
            <span className="flex items-center gap-1 text-xs text-white/40 mr-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full transition-colors duration-200 hover:border-[#3BBFBF]/40"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Author Block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="mt-12 p-6 rounded-2xl flex items-start gap-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          data-ocid="blog-detail-author"
        >
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-display font-bold text-lg"
            style={{
              background: "linear-gradient(135deg, #1a4a8c 0%, #0f2744 100%)",
              color: "#3BBFBF",
              border: "2px solid rgba(59,191,191,0.3)",
            }}
          >
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">
              {post.author}
            </p>
            <p className="text-white/40 text-xs">
              Author at Tinkro Learning Hub
            </p>
            {post.publishedAt && (
              <p className="text-white/30 text-xs mt-1">
                Published {formatDate(post.publishedAt)}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <section
          className="py-16"
          style={{
            background:
              "linear-gradient(135deg, #0a1628 0%, #0f1e3a 50%, #0a1628 100%)",
          }}
        >
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-display font-bold text-white mb-8"
            >
              Related <span className="gradient-text-orange">Articles</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <RelatedCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <section
        className="py-16 text-center"
        style={{
          background:
            "linear-gradient(135deg, #0f2744 0%, #142e56 50%, #0f2744 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(244,123,32,0.12) 0%, transparent 60%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="container mx-auto px-6 max-w-xl relative z-10"
        >
          <h3 className="text-2xl font-display font-bold text-white mb-3">
            Enjoyed this article?
          </h3>
          <p className="text-white/55 text-sm mb-6">
            Explore more tutorials, guides, and robotics news in the Tinkro
            Learning Hub.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
              boxShadow: "0 0 20px rgba(244,123,32,0.35)",
            }}
            data-ocid="blog-detail-back-cta"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </a>
        </motion.div>
      </section>

      {/* Prose styles injected inline for CMS content */}
      <style>{`
        .prose-blog {
          color: rgba(255,255,255,0.78);
          font-size: 1.0625rem;
          line-height: 1.85;
        }
        .prose-blog h1, .prose-blog h2, .prose-blog h3,
        .prose-blog h4, .prose-blog h5, .prose-blog h6 {
          color: #fff;
          font-family: var(--font-display, sans-serif);
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .prose-blog h2 { font-size: 1.5rem; }
        .prose-blog h3 { font-size: 1.25rem; }
        .prose-blog p { margin-bottom: 1.25rem; }
        .prose-blog a { color: #3BBFBF; text-decoration: underline; }
        .prose-blog a:hover { color: #F47B20; }
        .prose-blog strong { color: #fff; font-weight: 700; }
        .prose-blog em { color: rgba(255,255,255,0.85); }
        .prose-blog ul, .prose-blog ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose-blog li { margin-bottom: 0.4rem; }
        .prose-blog blockquote {
          border-left: 4px solid #3BBFBF;
          padding: 0.75rem 1.25rem;
          margin: 1.5rem 0;
          background: rgba(59,191,191,0.07);
          border-radius: 0 0.75rem 0.75rem 0;
          color: rgba(255,255,255,0.75);
          font-style: italic;
        }
        .prose-blog code {
          background: rgba(255,255,255,0.08);
          color: #3BBFBF;
          padding: 0.15em 0.45em;
          border-radius: 0.35rem;
          font-size: 0.875em;
        }
        .prose-blog pre {
          background: rgba(10,22,40,0.8);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 0.75rem;
          padding: 1.25rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        .prose-blog pre code { background: none; padding: 0; }
        .prose-blog img {
          border-radius: 0.75rem;
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          display: block;
        }
        .prose-blog hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.12);
          margin: 2rem 0;
        }
      `}</style>
    </motion.div>
  );
}
