import { useBlogPostById, useBlogPosts, useProducts } from "@/lib/publicDataService";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/slug";
import type { AdminBlogPost } from "@/types/admin";
import { useParams } from "@tanstack/react-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Github,
  Link2,
  PlayCircle,
  Share2,
  Tag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useToastContext } from "@/components/Layout";
import {
  absoluteUrl,
  normalizeSeoText,
  removeJsonLd,
  setJsonLd,
  upsertLinkTag,
  upsertMetaTag,
} from "../lib/seo";
import { sanitizeKnowledgeHubHtml } from "@/lib/htmlSanitizer";

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

function splitTextList(value: string | string[] | undefined | null) {
  if (!value) return [] as string[];
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  return value
    .split(/[|,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isTutorialArticle(articleType?: string, tags?: string[]) {
  const normalizedType = normalizeSeoText(articleType).toLowerCase();
  if (normalizedType.includes("tutorial") || normalizedType.includes("guide") || normalizedType.includes("how to")) {
    return true;
  }
  return (tags ?? []).some((tag) => {
    const normalized = normalizeSeoText(tag).toLowerCase();
    return normalized.includes("tutorial") || normalized.includes("guide") || normalized.includes("how-to");
  });
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
  const heroImage = post.featuredImage || post.images?.[0];
  const slug = post.slug || slugify(post.title);

  return (
    <motion.a
      href={`/blog/${slug}`}
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
      <div className="relative overflow-hidden h-40 bg-[#0a1628]">
        {heroImage ? (
          <img
            src={heroImage}
            alt={post.title}
            loading="lazy"
            decoding="async"
            width={640}
            height={360}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
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
        {(post.publishedAt ?? post.publishedDate) && (
          <span className="text-[11px] text-white/35 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt ?? post.publishedDate)}
          </span>
        )}
      </div>
    </motion.a>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BlogDetailPage() {
  const { addToast } = useToastContext();
  const { slug } = useParams({ from: "/blog/$slug" });
  const { post, loading } = useBlogPostById(slug);
  const { posts: allPosts } = useBlogPosts();
  const { products } = useProducts();
  const [tocItems, setTocItems] = useState<Array<{ id: string; title: string; level: 2 | 3 }>>([]);
  const [progress, setProgress] = useState(0);
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${post?.slug || post?.id}`;
    const title = post?.title ?? "Tinkro Blog";
    const text = post?.excerpt
      ? `${post.excerpt.trim().slice(0, 120)}...`
      : "Read this Tinkro blog post.";

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        addToast("Blog link copied to clipboard.", "success");
      }
    } catch (error) {
      console.error("Share failed", error);
      addToast("Unable to share this blog post.", "error");
    }
  };

  const colors = post ? (CATEGORY_COLORS[post.category] ?? DEFAULT_COLORS) : DEFAULT_COLORS;
  const readTime = post
    ? typeof post.readingTime === "number"
      ? `${post.readingTime} min read`
      : estimateReadTime(post.content)
    : "4 min read";
  const heroImage = post
    ? post.featuredImage || post.images?.[0] || post.openGraphImage || post.twitterImage
    : null;
  const relatedPosts = post
    ? allPosts
        .filter((p) => p.id !== post.id)
        .slice()
        .sort((a, b) => {
          const explicitRelated = new Set((post.relatedBlogs ?? []).map((value) => normalizeSeoText(value).toLowerCase()));
          const aSlug = normalizeSeoText(a.slug || a.id).toLowerCase();
          const bSlug = normalizeSeoText(b.slug || b.id).toLowerCase();
          const aExplicit = explicitRelated.has(aSlug) || explicitRelated.has(normalizeSeoText(a.id).toLowerCase());
          const bExplicit = explicitRelated.has(bSlug) || explicitRelated.has(normalizeSeoText(b.id).toLowerCase());
          if (aExplicit && !bExplicit) return -1;
          if (!aExplicit && bExplicit) return 1;

          const aCategoryScore = a.category === post.category ? 3 : 0;
          const bCategoryScore = b.category === post.category ? 3 : 0;
          const postTags = new Set((post.tags ?? []).map((tag) => normalizeSeoText(tag).toLowerCase()));
          const aTagScore = (a.tags ?? []).reduce((score, tag) => score + (postTags.has(normalizeSeoText(tag).toLowerCase()) ? 1 : 0), 0);
          const bTagScore = (b.tags ?? []).reduce((score, tag) => score + (postTags.has(normalizeSeoText(tag).toLowerCase()) ? 1 : 0), 0);
          return (bCategoryScore + bTagScore) - (aCategoryScore + aTagScore);
        })
        .slice(0, 3)
    : [];

  const sanitizedContent = useMemo(
    () => sanitizeKnowledgeHubHtml(post?.content ?? ""),
    [post?.content],
  );

  const readingProgress = useMemo(() => {
    if (!post) return 0;
    const totalWords = post.content
      .replace(/<[^>]*>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    const minutes = Math.max(1, Math.round(totalWords / 200));
    return minutes;
  }, [post]);

  const quickSummary = useMemo(() => {
    if (!post) return "";
    return normalizeSeoText(post.aiSummary) || normalizeSeoText(post.excerpt);
  }, [post]);

  const targetAudience = useMemo(() => splitTextList(post?.targetAudience), [post?.targetAudience]);
  const keyTakeaways = useMemo(() => splitTextList(post?.keyTakeaways), [post?.keyTakeaways]);
  const prerequisites = useMemo(() => splitTextList(post?.prerequisites), [post?.prerequisites]);
  const references = useMemo(() => splitTextList(post?.references), [post?.references]);
  const datasheets = useMemo(() => splitTextList(post?.datasheets), [post?.datasheets]);

  const projectInformation = useMemo(() => {
    if (!post) return [] as Array<{ label: string; value: string }>;
    const rows: Array<{ label: string; value: string }> = [];
    const resolvedReadTime = typeof post.readingTime === "number" && post.readingTime > 0
      ? `${post.readingTime} min`
      : "";
    if (resolvedReadTime) rows.push({ label: "Reading Time", value: resolvedReadTime });
    if (normalizeSeoText(post.difficulty)) rows.push({ label: "Difficulty", value: normalizeSeoText(post.difficulty) });
    if (normalizeSeoText(post.skillLevel)) rows.push({ label: "Skill Level", value: normalizeSeoText(post.skillLevel) });
    if (targetAudience.length > 0) rows.push({ label: "Target Audience", value: targetAudience.join(", ") });
    if (normalizeSeoText(post.estimatedBuildTime)) rows.push({ label: "Estimated Build Time", value: normalizeSeoText(post.estimatedBuildTime) });
    if (normalizeSeoText(post.estimatedProjectCost)) rows.push({ label: "Estimated Project Cost", value: normalizeSeoText(post.estimatedProjectCost) });
    return rows;
  }, [post, targetAudience]);

  const resourceGroups = useMemo(() => {
    if (!post) return [] as Array<{ label: string; icon: typeof Link2; links: Array<{ label: string; href: string }> }>;

    const rows: Array<{ label: string; icon: typeof Link2; links: Array<{ label: string; href: string }> }> = [];
    const maybeUrl = (value: string | undefined | null) => {
      const normalized = normalizeSeoText(value);
      if (!normalized) return "";
      try {
        return new URL(normalized).toString();
      } catch {
        return "";
      }
    };

    const github = maybeUrl(post.githubRepository);
    if (github) rows.push({ label: "GitHub", icon: Github, links: [{ label: "Open Repository", href: github }] });

    const simulation = maybeUrl(post.simulationUrl);
    if (simulation) rows.push({ label: "Simulation", icon: PlayCircle, links: [{ label: "Launch Simulation", href: simulation }] });

    if (datasheets.length > 0) {
      rows.push({
        label: "Datasheets",
        icon: FileText,
        links: datasheets.map((value, index) => ({ label: `Datasheet ${index + 1}`, href: value })).filter((entry) => maybeUrl(entry.href)).map((entry) => ({ ...entry, href: maybeUrl(entry.href) })),
      });
    }

    const circuitDiagram = maybeUrl(post.circuitDiagramUrl);
    if (circuitDiagram) rows.push({ label: "Circuit Diagram", icon: Link2, links: [{ label: "View Circuit Diagram", href: circuitDiagram }] });

    const wiringDiagram = maybeUrl(post.wiringDiagramUrl);
    if (wiringDiagram) rows.push({ label: "Wiring Diagram", icon: Link2, links: [{ label: "View Wiring Diagram", href: wiringDiagram }] });

    if (references.length > 0) {
      rows.push({
        label: "References",
        icon: ExternalLink,
        links: references.map((value, index) => ({ label: `Reference ${index + 1}`, href: value })).filter((entry) => maybeUrl(entry.href)).map((entry) => ({ ...entry, href: maybeUrl(entry.href) })),
      });
    }

    return rows.filter((group) => group.links.length > 0);
  }, [post, datasheets, references]);

  const faqItems = useMemo(() => {
    return (post?.faqItems ?? []).filter((item) => normalizeSeoText(item.question) && normalizeSeoText(item.answer));
  }, [post?.faqItems]);

  const relatedProducts = useMemo(() => {
    if (!post) return [] as Array<{ id: string; title: string; href: string }>;
    const relatedKeys = new Set(splitTextList(post.relatedProducts).map((entry) => normalizeSeoText(entry).toLowerCase()));
    if (!relatedKeys.size || !Array.isArray(products)) return [];

    const matches = products.filter((product: any) => {
      const id = normalizeSeoText(product.id).toLowerCase();
      const slugValue = normalizeSeoText(product.seoSlug || product.slug || "").toLowerCase();
      const name = normalizeSeoText(product.name).toLowerCase();
      return relatedKeys.has(id) || (slugValue && relatedKeys.has(slugValue)) || relatedKeys.has(name);
    });

    return matches.slice(0, 6).map((product: any) => ({
      id: product.id,
      title: product.name,
      href: `/products/${product.seoSlug || product.slug || product.id}`,
    }));
  }, [post, products]);

  const showCta = useMemo(() => {
    if (!post) return false;
    return Boolean(
      normalizeSeoText(post.ctaTitle) &&
      normalizeSeoText(post.ctaDescription) &&
      normalizeSeoText(post.ctaButtonText) &&
      normalizeSeoText(post.ctaButtonLink),
    );
  }, [post]);

  const lastUpdatedText = useMemo(() => {
    const source = post?.lastUpdated || post?.updatedAt || post?.publishedAt || post?.publishedDate || null;
    return source ? formatDate(source) : "";
  }, [post]);

  useEffect(() => {
    if (!post) return;
    const updateToc = () => {
      const headings = Array.from(
        document.querySelectorAll<HTMLHeadingElement>(
          ".prose-blog h2, .prose-blog h3",
        ),
      );
      const items = headings.map((heading) => {
        const id = heading.id || heading.textContent?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "";
        if (!heading.id) heading.id = id;
        return {
          id,
          title: heading.textContent?.trim() || "",
          level: heading.tagName === "H2" ? 2 : 3,
        } as const;
      });
      setTocItems(items);
    };

    const updateProgress = () => {
      if (!contentRef.current) {
        setProgress(0);
        return;
      }
      const content = contentRef.current;
      const rect = content.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const start = rect.top + scrollTop - 120;
      const end = rect.bottom + scrollTop - window.innerHeight + 120;
      const position = scrollTop;
      const percent = end <= start ? 100 : Math.min(100, Math.max(0, ((position - start) / (end - start)) * 100));
      setProgress(percent);
    };

    updateToc();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [post]);

  useEffect(() => {
    if (!post) return;
    const normalizedTitle = normalizeSeoText(post.title);
    const title =
      normalizeSeoText(post.metaTitle) ||
      normalizeSeoText(post.openGraphTitle) ||
      (normalizedTitle ? `${normalizedTitle} | Tinkro Blog` : "Tinkro Blog");
    const description =
      normalizeSeoText(post.metaDescription) ||
      normalizeSeoText(post.openGraphDescription) ||
      normalizeSeoText(post.excerpt).slice(0, 160) ||
      "Read the latest robotics tutorials, STEM guides, and insights from Tinkro.";
    const canonicalUrl = absoluteUrl(post.canonicalUrl || `/blog/${post.slug || post.id}`);
    const ogTitle = normalizeSeoText(post.openGraphTitle) || title;
    const ogDescription = normalizeSeoText(post.openGraphDescription) || description;
    const twitterTitle = normalizeSeoText(post.twitterTitle) || title;
    const twitterDescription = normalizeSeoText(post.twitterDescription) || description;

    document.title = title;
    upsertLinkTag("canonical", canonicalUrl);
    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "robots", normalizeSeoText(post.robots) || "index,follow");
    upsertMetaTag("property", "og:title", ogTitle);
    upsertMetaTag("property", "og:description", ogDescription);
    upsertMetaTag("property", "og:type", "article");
    upsertMetaTag("property", "og:url", canonicalUrl);
    upsertMetaTag("property", "article:published_time", post.publishedAt ?? post.publishedDate ?? "");
    upsertMetaTag("property", "article:modified_time", post.lastUpdated ?? post.updatedAt ?? post.publishedAt ?? post.publishedDate ?? "");
    upsertMetaTag("name", "twitter:url", canonicalUrl);
    if (heroImage) {
      upsertMetaTag("property", "og:image", heroImage);
      upsertMetaTag("name", "twitter:image", heroImage);
    }
    upsertMetaTag("property", "og:site_name", "Tinkro");
    upsertMetaTag("name", "twitter:card", heroImage ? "summary_large_image" : "summary");
    upsertMetaTag("name", "twitter:title", twitterTitle);
    upsertMetaTag("name", "twitter:description", twitterDescription);
    if (lastUpdatedText) {
      upsertMetaTag("name", "last-modified", lastUpdatedText);
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${canonicalUrl}#blogposting`,
          url: canonicalUrl,
          headline: title,
          description,
          speakable: quickSummary
            ? {
                "@type": "SpeakableSpecification",
                cssSelector: [".quick-summary-text"],
              }
            : undefined,
          image: heroImage ? [heroImage] : undefined,
          author: {
            "@type": "Person",
            name: post.author,
          },
          publisher: {
            "@type": "Organization",
            name: "Tinkro",
            logo: {
              "@type": "ImageObject",
              url: "https://tinkro.in/assets/brand/logo.png",
            },
          },
          datePublished: post.publishedAt ?? post.publishedDate ?? undefined,
          dateModified: post.lastUpdated ?? post.updatedAt ?? post.publishedAt ?? post.publishedDate ?? undefined,
          keywords: (post.tags ?? []).join(", ") || undefined,
          articleSection: post.category || undefined,
          mainEntityOfPage: canonicalUrl,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://tinkro.in/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: "https://tinkro.in/blog",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: title,
              item: canonicalUrl,
            },
          ],
        },
        ...(faqItems.length > 0
          ? [
              {
                "@type": "FAQPage",
                "@id": `${canonicalUrl}#faq`,
                mainEntity: faqItems.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              },
            ]
          : []),
        ...(isTutorialArticle(post.articleType, post.tags) && keyTakeaways.length > 0
          ? [
              {
                "@type": "HowTo",
                "@id": `${canonicalUrl}#howto`,
                name: post.title,
                description,
                step: keyTakeaways.map((step, index) => ({
                  "@type": "HowToStep",
                  position: index + 1,
                  name: step,
                  text: step,
                })),
              },
            ]
          : []),
        ...(normalizeSeoText(post.featuredVideo)
          ? [
              {
                "@type": "VideoObject",
                "@id": `${canonicalUrl}#video`,
                name: post.title,
                description,
                thumbnailUrl: heroImage ? [heroImage] : undefined,
                uploadDate: post.publishedAt ?? post.publishedDate ?? undefined,
                contentUrl: normalizeSeoText(post.featuredVideo),
                embedUrl: normalizeSeoText(post.featuredVideo),
              },
            ]
          : []),
      ],
    };

    const scriptId = "blog-post-jsonld";
    setJsonLd(scriptId, jsonLd);
    return () => removeJsonLd(scriptId);
  }, [post, heroImage, faqItems, keyTakeaways, quickSummary, lastUpdatedText]);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = newsletterName.trim();
    const trimmedEmail = newsletterEmail.trim().toLowerCase();

    if (!trimmedName) {
      addToast("Please enter your name.", "error");
      return;
    }

    if (!trimmedEmail) {
      addToast("Please enter your email.", "error");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!isValidEmail) {
      addToast("Please enter a valid email address.", "error");
      return;
    }

    try {
      setIsSubmittingNewsletter(true);
      await addDoc(collection(db, "newsletter_subscribers"), {
        name: trimmedName,
        email: trimmedEmail,
        source: "blog-detail",
        createdAt: serverTimestamp(),
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      });
      setNewsletterName("");
      setNewsletterEmail("");
      addToast("Thanks for subscribing!", "success");
    } catch (error) {
      console.error("Newsletter subscribe failed", error);
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

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
        className="relative overflow-hidden bg-[#0a1628]"
        style={{ height: "clamp(280px, 50vh, 520px)" }}
      >
        {heroImage ? (
          <motion.img
            src={heroImage}
            alt={post.title}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 70vw"
            className="absolute inset-0 w-full h-full object-contain"
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
            {(post.publishedAt ?? post.publishedDate) && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#3BBFBF]" />
                {formatDate(post.publishedAt ?? post.publishedDate)}
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
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-white/90 bg-white/10 border border-white/10 transition-all duration-200 hover:bg-white/15"
              onClick={handleShare}
              data-ocid="blog-detail-share"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Quick Summary ↓ Project Information ↓ Key Takeaways ↓ Prerequisites ↓ TOC ↓ Content ↓ Resources ↓ FAQ ↓ Related Products ↓ CTA ↓ Related Blogs ↓ Author ↓ Newsletter ── */}
      <div className="container mx-auto px-6 max-w-3xl py-14">
        <div className="mb-8">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3BBFBF] to-[#F5A623] transition-all duration-300"
              style={{ width: `${Math.round(progress)}%` }}
              data-ocid="blog-detail-progress-bar"
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] uppercase tracking-[0.22em] text-white/50">
            <span>{Math.max(0, Math.min(100, Math.round(progress)))}% read</span>
            <span>{readingProgress} min read</span>
          </div>
        </div>

        {/* Quick Summary */}
        {quickSummary && (
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
            aria-labelledby="quick-summary-heading"
          >
            <h2 id="quick-summary-heading" className="text-xs uppercase tracking-[0.2em] text-[#3BBFBF] mb-2">Quick Summary</h2>
            <p className="quick-summary-text text-white/80 text-base md:text-lg leading-relaxed italic font-light">
              {quickSummary}
            </p>
          </motion.div>
        )}

        {/* Project Information */}
        {projectInformation.length > 0 && (
          <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-5" aria-labelledby="project-information-heading">
            <h2 id="project-information-heading" className="mb-4 text-lg font-bold text-white">Project Information</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {projectInformation.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-[#0a1628]/70 p-3">
                  <dt className="text-xs uppercase tracking-[0.18em] text-white/45">{item.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-white/85">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Key Takeaways */}
        {keyTakeaways.length > 0 && (
          <section className="mb-10" aria-labelledby="key-takeaways-heading">
            <h2 id="key-takeaways-heading" className="mb-4 text-lg font-bold text-white">Key Takeaways</h2>
            <ul className="space-y-2">
              {keyTakeaways.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-white/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3BBFBF]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <section className="mb-10" aria-labelledby="prerequisites-heading">
            <h2 id="prerequisites-heading" className="mb-4 text-lg font-bold text-white">Prerequisites</h2>
            <ul className="space-y-2">
              {prerequisites.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F5A623]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Gallery */}
        {post.images && post.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10"
            data-ocid="blog-detail-gallery"
          >
            <h3 className="text-base font-semibold text-white mb-4">
              Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.images.map((img) => (
                <div
                  key={img}
                  className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a1628]"
                >
                  <img
                    src={img}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={360}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="w-full h-56 object-contain"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tocItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mb-8 rounded-3xl border border-white/10 bg-[#07121e] p-6"
            data-ocid="blog-detail-toc"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-[#3BBFBF] mb-3">
              On this page
            </p>
            <div className="grid gap-2">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  style={{ paddingLeft: item.level === 3 ? "1.25rem" : "0" }}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </motion.div>
        )}
        <section aria-labelledby="article-content-heading">
          <h2 id="article-content-heading" className="sr-only">Article Content</h2>

          {/* Gallery */}
          {post.images && post.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-10"
              data-ocid="blog-detail-gallery"
            >
              <h3 className="text-base font-semibold text-white mb-4">
                Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.images.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a1628]"
                  >
                    <img
                      src={img}
                      alt={normalizeSeoText(post.metaTitle) || normalizeSeoText(post.title) || "Blog image"}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={360}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="w-full h-56 object-contain"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose-blog"
          ref={contentRef}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: CMS content from admin panel
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

          {/* Tags */}
          {post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/10"
              data-ocid="blog-detail-tags"
              aria-label="Article tags"
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
        </section>

        {/* Resources */}
        {resourceGroups.length > 0 && (
          <section className="mt-12" aria-labelledby="resources-heading">
            <h2 id="resources-heading" className="text-2xl font-display font-bold text-white mb-6">Resources</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {resourceGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <GroupIcon className="h-4 w-4 text-[#3BBFBF]" />
                      {group.label}
                    </h3>
                    <ul className="space-y-2">
                      {group.links.map((entry) => (
                        <li key={`${group.label}-${entry.href}`}>
                          <a
                            href={entry.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-[#F5A623]"
                            aria-label={`${entry.label} (${group.label})`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {entry.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqItems.length > 0 && (
          <section className="mt-12" aria-labelledby="faqs-heading">
            <h2 id="faqs-heading" className="text-2xl font-display font-bold text-white mb-6">FAQs</h2>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <details key={`${item.question}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white">{item.question}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12" aria-labelledby="related-products-heading">
            <h2 id="related-products-heading" className="text-2xl font-display font-bold text-white mb-6">Related Products</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.href}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:border-[#3BBFBF]/40 hover:text-white"
                  aria-label={`View product ${product.title}`}
                >
                  <span>{product.title}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Call To Action */}
        {showCta && (
          <section className="mt-12" aria-labelledby="article-cta-heading">
            <div className="rounded-2xl border border-[#F5A623]/30 bg-gradient-to-r from-[#0f2744] to-[#142e56] p-6">
              <h2 id="article-cta-heading" className="text-2xl font-display font-bold text-white mb-2">{post.ctaTitle}</h2>
              <p className="text-white/75 mb-5">{post.ctaDescription}</p>
              <a
                href={post.ctaButtonLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F47B20] to-[#F5A623] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(244,123,32,0.35)] hover:opacity-90"
                aria-label={post.ctaButtonText || "Call to action"}
              >
                {post.ctaButtonText}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </section>
        )}

        {/* Related Blogs */}
        {relatedPosts.length > 0 && (
          <section className="mt-12" aria-labelledby="related-blogs-heading">
            <h2 id="related-blogs-heading" className="text-2xl font-display font-bold text-white mb-6">Related Blogs</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((related) => (
                <RelatedCard key={related.id} post={related} />
              ))}
            </div>
          </section>
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
          aria-labelledby="author-heading"
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
            <h2 id="author-heading" className="text-white font-semibold text-sm mb-0.5">
              {post.author}
            </h2>
            <p className="text-white/40 text-xs">
              Author at Tinkro Learning Hub
            </p>
            {(post.publishedAt ?? post.publishedDate) && (
              <p className="text-white/30 text-xs mt-1">
                Published {formatDate(post.publishedAt ?? post.publishedDate)}
              </p>
            )}
            {lastUpdatedText && (
              <p className="text-white/30 text-xs mt-1">Last updated {lastUpdatedText}</p>
            )}
          </div>
        </motion.div>

        {/* Newsletter */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-[#08111d] p-6" aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading" className="text-2xl font-display font-bold text-white mb-2">Stay Ahead in Robotics</h2>
          <p className="text-white/60 mb-6 text-sm">Get new tutorials, project guides, and STEM insights directly in your inbox.</p>
          <form className="grid gap-3" onSubmit={handleNewsletterSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Enter your name"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                disabled={isSubmittingNewsletter}
                className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-[#3BBFBF]/50"
                aria-label="Your name"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={isSubmittingNewsletter}
                className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-[#3BBFBF]/50"
                aria-label="Your email"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingNewsletter}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-[#F47B20] to-[#F5A623] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(244,123,32,0.35)] hover:opacity-90"
              data-ocid="blog-detail-newsletter-subscribe"
            >
              {isSubmittingNewsletter ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          <div className="mt-6 border-t border-white/10 pt-5">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/85 hover:border-[#3BBFBF]/50 hover:text-white"
              data-ocid="blog-detail-back-cta"
              aria-label="Back to Blog"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </a>
          </div>
        </section>
      </div>

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
        .prose-blog table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .prose-blog th,
        .prose-blog td {
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.95rem 1rem;
          text-align: left;
        }
        .prose-blog th {
          background: rgba(255,255,255,0.05);
          font-weight: 700;
        }
        .prose-blog .video-embed {
          margin: 1.5rem 0;
          overflow: hidden;
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .prose-blog .video-embed iframe {
          width: 100%;
          min-height: 320px;
        }
        .prose-blog .cta-block {
          border: 1px solid rgba(59,191,191,0.18);
          background: rgba(59,191,191,0.08);
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }
        .prose-blog .cta-block a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.75rem;
          padding: 0.85rem 1.2rem;
          border-radius: 999px;
          background: #3bbfbf;
          color: #041c23;
          font-weight: 700;
          text-decoration: none;
        }
        .prose-blog .download-card,
        .prose-blog .reference-box,
        .prose-blog .robotics-block,
        .prose-blog .note-box {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          border-radius: 1rem;
          padding: 1.2rem;
          margin: 1.5rem 0;
        }
        .prose-blog .download-card a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          background: rgba(59,191,191,0.12);
          color: #3bbfbf;
          font-weight: 700;
          text-decoration: none;
        }
        .prose-blog .reference-box ol {
          margin-top: 0.75rem;
          padding-left: 1.25rem;
        }
        .prose-blog .reference-box li {
          margin-bottom: 0.6rem;
        }
        .prose-blog .robotics-block {
          border-color: rgba(59,191,191,0.25);
          background: rgba(59,191,191,0.07);
        }
        .prose-blog .robotics-block ul {
          margin-top: 0.75rem;
          padding-left: 1.25rem;
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
