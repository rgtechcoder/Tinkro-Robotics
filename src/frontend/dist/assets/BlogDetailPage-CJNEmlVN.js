import { h as createLucideIcon, u as useParams, J as useBlogPostById, K as useBlogPosts, j as jsxRuntimeExports, m as motion, U as User, N as Calendar, O as Clock, T as Tag } from "./index-O-oxzsBJ.js";
import { E as Eye } from "./eye-CghO3a5D.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
const CATEGORY_COLORS = {
  Tutorials: {
    bg: "rgba(59,191,191,0.15)",
    text: "#3BBFBF",
    border: "rgba(59,191,191,0.35)"
  },
  "Case Studies": {
    bg: "rgba(244,123,32,0.15)",
    text: "#F47B20",
    border: "rgba(244,123,32,0.35)"
  },
  News: {
    bg: "rgba(245,166,35,0.15)",
    text: "#F5A623",
    border: "rgba(245,166,35,0.35)"
  },
  Guides: {
    bg: "rgba(46,109,164,0.15)",
    text: "#5b9fd4",
    border: "rgba(46,109,164,0.4)"
  }
};
const DEFAULT_COLORS = {
  bg: "rgba(59,191,191,0.15)",
  text: "#3BBFBF",
  border: "rgba(59,191,191,0.35)"
};
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
}
function estimateReadTime(content) {
  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}
function RelatedCard({ post }) {
  const colors = CATEGORY_COLORS[post.category] ?? DEFAULT_COLORS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.a,
    {
      href: `/blog/${post.id}`,
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.45, ease: "easeOut" },
      className: "group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-1",
      style: {
        background: "linear-gradient(145deg, rgba(15,39,68,0.92) 0%, rgba(10,22,40,0.96) 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        textDecoration: "none"
      },
      "data-ocid": `blog-related-card-${post.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden h-40", children: [
          post.featuredImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: post.featuredImage,
              alt: post.title,
              className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-full h-full",
              style: {
                background: "linear-gradient(135deg, #0f2744 0%, #1a4a8c 100%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0",
              style: {
                background: "linear-gradient(to bottom, transparent 50%, rgba(10,22,40,0.9) 100%)"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "self-start text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider",
              style: {
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`
              },
              children: post.category
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-display font-bold text-white line-clamp-2 group-hover:text-[#F5A623] transition-colors duration-300", children: post.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs line-clamp-2 flex-1", children: post.excerpt }),
          post.publishedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-white/35 flex items-center gap-1 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
            formatDate(post.publishedAt)
          ] })
        ] })
      ]
    }
  );
}
function BlogDetailPage() {
  const { id } = useParams({ from: "/blog/$id" });
  const { post } = useBlogPostById(id);
  const { posts: allPosts } = useBlogPosts();
  if (!post) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6",
        style: {
          background: "linear-gradient(180deg, #060d1a 0%, #0a1628 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl", children: "📭" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-white", children: "Post not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-base max-w-sm", children: "This article may have been removed or the link is incorrect." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/blog",
              className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90",
              style: {
                background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                boxShadow: "0 0 20px rgba(244,123,32,0.35)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Back to Blog"
              ]
            }
          )
        ]
      }
    );
  }
  const colors = CATEGORY_COLORS[post.category] ?? DEFAULT_COLORS;
  const readTime = estimateReadTime(post.content);
  const relatedPosts = allPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
      className: "min-h-screen",
      style: {
        background: "linear-gradient(180deg, #060d1a 0%, #0a1628 40%, #07111f 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-6 max-w-5xl pt-24 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "/blog",
            className: "inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-[#3BBFBF] transition-colors duration-200",
            "data-ocid": "blog-detail-back",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Back to Blog"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative overflow-hidden",
            style: { height: "clamp(280px, 50vh, 520px)" },
            children: [
              post.featuredImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.img,
                {
                  src: post.featuredImage,
                  alt: post.title,
                  className: "absolute inset-0 w-full h-full object-cover",
                  initial: { scale: 1.06 },
                  animate: { scale: 1 },
                  transition: { duration: 1.2, ease: "easeOut" }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0",
                  style: {
                    background: "linear-gradient(135deg, #0f2744 0%, #1a4a8c 50%, #0a1628 100%)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0",
                  style: {
                    background: "linear-gradient(to bottom, rgba(6,13,26,0.3) 0%, rgba(6,13,26,0.65) 60%, rgba(6,13,26,0.97) 100%)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0",
                  style: {
                    background: "radial-gradient(ellipse at 30% 80%, rgba(244,123,32,0.15) 0%, transparent 60%)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 container mx-auto px-6 max-w-5xl pb-8 md:pb-12", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 24 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.65, delay: 0.2 },
                    className: "flex items-center gap-3 mb-4",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider",
                        style: {
                          background: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                          backdropFilter: "blur(8px)"
                        },
                        children: post.category
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.h1,
                  {
                    initial: { opacity: 0, y: 24 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.7, delay: 0.3 },
                    className: "text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight mb-4 max-w-3xl",
                    children: post.title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 16 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 0.4 },
                    className: "flex flex-wrap items-center gap-4 text-xs text-white/55",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5 text-[#3BBFBF]" }),
                        post.author
                      ] }),
                      post.publishedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-[#3BBFBF]" }),
                        formatDate(post.publishedAt)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-[#3BBFBF]" }),
                        readTime
                      ] }),
                      post.views > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5 text-[#3BBFBF]" }),
                        post.views.toLocaleString(),
                        " views"
                      ] })
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 max-w-3xl py-14", children: [
          post.excerpt && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.55, delay: 0.1 },
              className: "mb-10 p-5 rounded-2xl",
              style: {
                background: "rgba(59,191,191,0.07)",
                border: "1px solid rgba(59,191,191,0.2)",
                borderLeft: "4px solid #3BBFBF"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-base md:text-lg leading-relaxed italic font-light", children: post.excerpt })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.2 },
              className: "prose-blog",
              dangerouslySetInnerHTML: { __html: post.content }
            }
          ),
          post.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, delay: 0.3 },
              className: "flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/10",
              "data-ocid": "blog-detail-tags",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-white/40 mr-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5" }),
                  " Tags:"
                ] }),
                post.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs px-3 py-1 rounded-full transition-colors duration-200 hover:border-[#3BBFBF]/40",
                    style: {
                      background: "rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.15)"
                    },
                    children: [
                      "#",
                      tag
                    ]
                  },
                  tag
                ))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.55, delay: 0.4 },
              className: "mt-12 p-6 rounded-2xl flex items-start gap-4",
              style: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)"
              },
              "data-ocid": "blog-detail-author",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-display font-bold text-lg",
                    style: {
                      background: "linear-gradient(135deg, #1a4a8c 0%, #0f2744 100%)",
                      color: "#3BBFBF",
                      border: "2px solid rgba(59,191,191,0.3)"
                    },
                    children: post.author.charAt(0).toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-sm mb-0.5", children: post.author }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-xs", children: "Author at Tinkro Learning Hub" }),
                  post.publishedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/30 text-xs mt-1", children: [
                    "Published ",
                    formatDate(post.publishedAt)
                  ] })
                ] })
              ]
            }
          )
        ] }),
        relatedPosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "section",
          {
            className: "py-16",
            style: {
              background: "linear-gradient(135deg, #0a1628 0%, #0f1e3a 50%, #0a1628 100%)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-6 max-w-5xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.h2,
                {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.5 },
                  className: "text-2xl font-display font-bold text-white mb-8",
                  children: [
                    "Related ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text-orange", children: "Articles" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: relatedPosts.map((related) => /* @__PURE__ */ jsxRuntimeExports.jsx(RelatedCard, { post: related }, related.id)) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            className: "py-16 text-center",
            style: {
              background: "linear-gradient(135deg, #0f2744 0%, #142e56 50%, #0f2744 100%)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: {
                    background: "radial-gradient(ellipse at 50% 100%, rgba(244,123,32,0.12) 0%, transparent 60%)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.55 },
                  className: "container mx-auto px-6 max-w-xl relative z-10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-display font-bold text-white mb-3", children: "Enjoyed this article?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/55 text-sm mb-6", children: "Explore more tutorials, guides, and robotics news in the Tinkro Learning Hub." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: "/blog",
                        className: "inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90",
                        style: {
                          background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                          boxShadow: "0 0 20px rgba(244,123,32,0.35)"
                        },
                        "data-ocid": "blog-detail-back-cta",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                          "Back to Blog"
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
      ` })
      ]
    }
  );
}
export {
  BlogDetailPage
};
