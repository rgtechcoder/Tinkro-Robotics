import { u as useParams, a as useProductById, b as useCategories, r as reactExports, j as jsxRuntimeExports, m as motion, L as Link, A as AnimatePresence, c as useNavigate, d as useScroll, e as useTransform, f as useToastContext, g as useCartStore } from "./index-O-oxzsBJ.js";
const FALLBACK_KIT_CONTENTS = [
  {
    iconName: "cpu",
    label: "Arduino Uno R3",
    description: "ATmega328P microcontroller",
    quantity: 1
  },
  {
    iconName: "truck",
    label: "Smart Car Chassis",
    description: "Transparent acrylic, 4-wheel",
    quantity: 1
  },
  {
    iconName: "zap",
    label: "DC Gear Motors",
    description: "TT motor, 1:48 reduction",
    quantity: 4
  },
  {
    iconName: "radio",
    label: "Ultrasonic Sensor",
    description: "HC-SR04, 2–400 cm range",
    quantity: 1
  },
  {
    iconName: "bluetooth",
    label: "Bluetooth Module",
    description: "HC-05, Class 2, 10m range",
    quantity: 1
  },
  {
    iconName: "activity",
    label: "IR Line Sensor",
    description: "TCRT5000, 5-channel array",
    quantity: 1
  },
  {
    iconName: "layers",
    label: "L298N Motor Driver",
    description: "Dual H-Bridge, 2A/channel",
    quantity: 1
  },
  {
    iconName: "book-open",
    label: "Project Guidebook",
    description: "8 illustrated projects",
    quantity: 1
  }
];
const FALLBACK_USE_CASES = [
  {
    id: "students",
    audience: "students",
    icon: "🎓",
    title: "For Students",
    description: "Learn real robotics from scratch — no background needed. Build progressively complex projects and gain skills that are valued globally.",
    benefit: "STEM curriculum aligned"
  },
  {
    id: "schools",
    audience: "schools",
    icon: "🏫",
    title: "For Schools",
    description: "Bring robotics into every classroom. Our kit supports ATL, STEM Lab, and PM SHRI initiatives with ready-to-teach project packs.",
    benefit: "Bulk pricing available"
  },
  {
    id: "beginners",
    audience: "beginners",
    icon: "🚀",
    title: "For Beginners",
    description: "Never touched a microcontroller? That's perfect. The guided path takes you from zero to autonomous robot in under 4 weeks.",
    benefit: "No prior experience needed"
  }
];
const FALLBACK_REVIEWS = [
  {
    id: "r1",
    name: "Arjun Mehta",
    role: "Student",
    date: "Jan 2025",
    rating: 5,
    title: "Built my first robot in 3 hours!",
    content: "I had zero experience. The step-by-step guide made everything so clear. The Bluetooth car project was my favourite — my whole family was impressed!",
    verified: true
  },
  {
    id: "r2",
    name: "Ms. Priya Sharma",
    role: "STEM Teacher",
    date: "Feb 2025",
    rating: 5,
    title: "Perfect for classroom use",
    content: "We ordered 20 kits for our school lab. The quality is top-notch and the teacher guide saved so much prep time. Students love the projects.",
    verified: true
  },
  {
    id: "r3",
    name: "Rohan Iyer",
    role: "Parent",
    date: "Mar 2025",
    rating: 5,
    title: "Best birthday gift ever",
    content: "Bought this for my son's 13th birthday. He's spent every evening building robots. The quality is amazing and customer support was very helpful.",
    verified: true
  },
  {
    id: "r4",
    name: "Sneha Patel",
    role: "College Student",
    date: "Mar 2025",
    rating: 4,
    title: "Great value for money",
    content: "I wanted something more advanced but this kit taught me a lot of fundamentals. The ultrasonic sensor and line-follower projects are very well designed.",
    verified: false
  }
];
function KitIcon({ name }) {
  const icons = {
    cpu: "🧠",
    zap: "⚡",
    truck: "🚗",
    radio: "📡",
    activity: "〰️",
    bluetooth: "📶",
    layers: "📐",
    "book-open": "📖",
    shield: "🛡️",
    link: "🔌"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: icons[name] ?? "🔧" });
}
function StarRating({
  rating,
  size = "sm"
}) {
  const cls = size === "lg" ? "text-xl" : "text-sm";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex gap-0.5 ${cls}`,
      "aria-label": `${rating} out of 5 stars`,
      children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: s <= Math.round(rating) ? "text-amber-400" : "text-muted-foreground/30",
          children: "★"
        },
        s
      ))
    }
  );
}
function Reveal({
  children,
  delay = 0,
  direction = "up"
}) {
  const initial = direction === "up" ? { opacity: 0, y: 50 } : direction === "left" ? { opacity: 0, x: -50 } : { opacity: 0, x: 50 };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial,
      whileInView: { opacity: 1, y: 0, x: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
      children
    }
  );
}
function ProductNotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-[60vh] flex flex-col items-center justify-center text-center px-6",
      style: {
        background: "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.14 0.05 240) 100%)"
      },
      "data-ocid": "product-not-found",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-6", children: "🤖" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-white mb-3", children: "Product Not Found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 max-w-sm mb-8", children: "We couldn't find this product. It may have been removed or the link may be incorrect." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/products",
            className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white",
            style: {
              background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)"
            },
            children: "← Browse All Products"
          }
        )
      ]
    }
  );
}
function HeroSection({
  product,
  heroImage,
  categories
}) {
  const ref = reactExports.useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const displayPrice = product.discount > 0 && product.originalPrice > product.price ? product.price : product.price;
  const showOriginal = product.originalPrice > product.price;
  const categoryTags = (() => {
    const ids = Array.isArray(product.categoryIds) && product.categoryIds.length > 0 ? product.categoryIds : product.categoryId ? [product.categoryId] : [];
    if (ids.length > 0 && categories.length > 0) {
      return ids.map((id) => {
        const cat = categories.find((c) => c.id === id);
        return cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null;
      }).filter(Boolean);
    }
    if (product.category) {
      return [
        {
          id: product.category,
          name: product.category,
          slug: product.category.toLowerCase().replace(/[\s&/]+/g, "-")
        }
      ];
    }
    return [];
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      ref,
      className: "relative min-h-screen flex items-center overflow-hidden",
      style: {
        background: "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.14 0.05 240) 40%, oklch(0.12 0.03 260) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-30",
              style: {
                background: "radial-gradient(circle, oklch(0.45 0.12 243) 0%, transparent 70%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-25",
              style: {
                background: "radial-gradient(circle, oklch(0.71 0.17 48) 0%, transparent 70%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10",
              style: {
                background: "radial-gradient(circle, oklch(0.7 0.13 195) 0%, transparent 60%)"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { style: { opacity }, className: "space-y-6 lg:space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5 },
                className: "flex items-center gap-2 text-sm text-white/50 font-body",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-white/80 transition-colors", children: "Home" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/products",
                      className: "hover:text-white/80 transition-colors text-white/40",
                      children: "Products"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 truncate max-w-[180px]", children: product.name })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.4, delay: 0.1 },
                className: "flex items-center gap-2 flex-wrap",
                children: [
                  product.badge && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                      style: {
                        background: "oklch(0.71 0.17 48 / 0.15)",
                        border: "1px solid oklch(0.71 0.17 48 / 0.4)",
                        color: "#F47B20"
                      },
                      children: [
                        "⭐ ",
                        product.badge
                      ]
                    }
                  ),
                  categoryTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => navigate({
                        to: "/products",
                        search: { category: tag.slug }
                      }),
                      "data-ocid": `product-category-tag-${tag.slug}`,
                      className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-smooth hover:opacity-80 cursor-pointer",
                      style: {
                        background: "oklch(0.7 0.13 195 / 0.12)",
                        border: "1px solid oklch(0.7 0.13 195 / 0.3)",
                        color: "#3BBFBF"
                      },
                      "aria-label": `Browse ${tag.name} category`,
                      children: tag.name
                    },
                    tag.id
                  )),
                  categoryTags.length === 0 && product.category && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                      style: {
                        background: "oklch(0.7 0.13 195 / 0.12)",
                        border: "1px solid oklch(0.7 0.13 195 / 0.3)",
                        color: "#3BBFBF"
                      },
                      children: product.category
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                      style: product.stock > 0 ? {
                        background: "oklch(0.55 0.17 145 / 0.15)",
                        border: "1px solid oklch(0.55 0.17 145 / 0.3)",
                        color: "#4ade80"
                      } : {
                        background: "oklch(0.65 0.19 22 / 0.15)",
                        border: "1px solid oklch(0.65 0.19 22 / 0.3)",
                        color: "#f87171"
                      },
                      children: product.stock > 0 ? "✓ In Stock" : "✗ Out of Stock"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.7, delay: 0.15 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white", children: product.name })
              }
            ),
            product.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.7, delay: 0.25 },
                className: "text-lg text-white/75 leading-relaxed font-body max-w-lg",
                children: product.description
              }
            ),
            product.rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.35 },
                className: "flex items-center gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: product.rating, size: "lg" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: product.rating }),
                  product.reviews > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/50 text-sm", children: [
                    "(",
                    product.reviews.toLocaleString(),
                    " reviews)"
                  ] })
                ]
              }
            ),
            product.tags && product.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.4 },
                className: "flex flex-wrap gap-2",
                children: product.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "px-3 py-1 rounded-lg text-xs font-medium text-white/70",
                    style: {
                      background: "oklch(0.98 0 0 / 0.07)",
                      border: "1px solid oklch(0.98 0 0 / 0.12)"
                    },
                    children: tag
                  },
                  tag
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.45 },
                className: "flex items-baseline gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-bold gradient-text-orange", children: [
                    "₹",
                    displayPrice.toLocaleString()
                  ] }),
                  showOriginal && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl text-white/40 line-through", children: [
                    "₹",
                    product.originalPrice.toLocaleString()
                  ] }),
                  product.discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "px-2 py-0.5 rounded-full text-sm font-bold",
                      style: {
                        background: "oklch(0.55 0.17 145 / 0.15)",
                        color: "#4ade80"
                      },
                      children: [
                        product.discount,
                        "% OFF"
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.55 },
                className: "flex flex-wrap gap-3",
                children: [
                  { icon: "🏆", label: "STEM Certified" },
                  { icon: "🏫", label: "School Ready" },
                  { icon: "📦", label: "Free Shipping" },
                  { icon: "↩️", label: "30-Day Returns" }
                ].map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 font-medium",
                    style: {
                      background: "oklch(0.98 0 0 / 0.07)",
                      border: "1px solid oklch(0.98 0 0 / 0.12)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: b.icon }),
                      " ",
                      b.label
                    ]
                  },
                  b.label
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.6, delay: 0.8 },
                className: "flex items-center gap-2 text-white/40 text-sm pt-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      animate: { y: [0, 6, 0] },
                      transition: {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.8,
                        ease: "easeInOut"
                      },
                      children: "↓"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Scroll to explore" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              style: { y },
              className: "relative flex items-center justify-center",
              layout: false,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-80 h-80 rounded-full opacity-40 blur-3xl",
                    style: {
                      background: "radial-gradient(circle, #2E6DA4 0%, #F47B20 60%, transparent 80%)"
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.92, y: 0 },
                    animate: { opacity: 1, scale: 1, y: [0, -16, 0] },
                    transition: {
                      opacity: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                      scale: { duration: 0.9, delay: 0.3 },
                      y: {
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 1
                      }
                    },
                    layout: false,
                    style: { willChange: "transform, opacity" },
                    className: "relative z-10 w-full max-w-lg",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "product-image-container aspect-square shadow-glow-primary",
                        style: {
                          background: "oklch(0.98 0 0 / 0.06)",
                          backdropFilter: "blur(16px)",
                          border: "1px solid oklch(0.98 0 0 / 0.12)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: heroImage,
                            alt: product.name,
                            className: "w-full h-full object-contain",
                            onError: (e) => {
                              e.target.src = "/placeholder.jpg";
                            }
                          }
                        )
                      }
                    )
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
function AnchorNav({ visible }) {
  const links = [
    { id: "overview", label: "Overview" },
    { id: "video-section", label: "Demo Video" },
    { id: "kit-contents", label: "Kit Contents" },
    { id: "use-cases", label: "Use Cases" },
    { id: "reviews", label: "Reviews" }
  ];
  const [active, setActive] = reactExports.useState("overview");
  function scrollTo(id) {
    var _a;
    (_a = document.getElementById(id)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.nav,
    {
      initial: { y: -60, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -60, opacity: 0 },
      transition: { duration: 0.4, ease: "easeOut" },
      className: "fixed top-16 left-0 right-0 z-30 flex justify-center py-3 pointer-events-none",
      "aria-label": "Page section navigation",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-full",
          style: {
            background: "oklch(0.14 0.02 250 / 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid oklch(0.98 0 0 / 0.1)"
          },
          children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => scrollTo(l.id),
              "data-ocid": `anchor-nav-${l.id}`,
              className: `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${active === l.id ? "text-white" : "text-white/50 hover:text-white/80"}`,
              style: active === l.id ? { background: "oklch(0.45 0.12 243)" } : {},
              children: l.label
            },
            l.id
          ))
        }
      )
    }
  ) });
}
function StorySection({ description }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "overview", className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-24 lg:py-32",
        style: {
          background: "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.12 0.03 248) 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { direction: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                style: {
                  background: "oklch(0.65 0.19 22 / 0.15)",
                  color: "oklch(0.75 0.18 30)",
                  border: "1px solid oklch(0.65 0.19 22 / 0.3)"
                },
                children: "The Problem"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-3xl lg:text-4xl text-white leading-tight", children: [
              "Getting started shouldn't feel like ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.75 0.18 30)" }, children: "solving a puzzle blindfolded." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/65 text-lg leading-relaxed font-body", children: "Most beginners buy random components and get stuck. No guidance, no context — just confusion." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: [
              "No clear starting point",
              "Too many components with no context",
              "Tutorials that assume prior knowledge"
            ].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 text-white/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 text-lg", children: "✕" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: p })
            ] }, p)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.15, direction: "right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute -inset-4 rounded-2xl opacity-30 blur-2xl",
                style: {
                  background: "radial-gradient(circle, oklch(0.65 0.19 22) 0%, transparent 70%)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative rounded-2xl overflow-hidden aspect-[4/3]",
                style: { border: "1px solid oklch(0.65 0.19 22 / 0.2)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: "/assets/generated/story-problem-overwhelmed.dim_800x600.jpg",
                      alt: "Student overwhelmed by scattered components",
                      loading: "lazy",
                      decoding: "async",
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0",
                      style: {
                        background: "linear-gradient(to top, oklch(0.1 0.04 250) 0%, transparent 40%)"
                      }
                    }
                  )
                ]
              }
            )
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-24 lg:py-32",
        style: { background: "oklch(0.96 0.01 250)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { direction: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute -inset-4 rounded-2xl opacity-20 blur-2xl",
                style: {
                  background: "radial-gradient(circle, #2E6DA4 0%, transparent 70%)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "relative rounded-2xl overflow-hidden aspect-[4/3] shadow-glow-primary",
                style: { border: "1px solid oklch(0.45 0.12 243 / 0.25)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: "/assets/generated/story-solution-kit.dim_800x600.jpg",
                    alt: "Tinkro kit unboxing — everything organized and labeled",
                    loading: "lazy",
                    decoding: "async",
                    className: "w-full h-full object-cover"
                  }
                )
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.15, direction: "right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                style: {
                  background: "oklch(0.7 0.13 195 / 0.12)",
                  color: "#3BBFBF",
                  border: "1px solid oklch(0.7 0.13 195 / 0.3)"
                },
                children: "The Solution"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-3xl lg:text-4xl text-foreground leading-tight", children: [
              "32 components. 8 guided projects. ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "One clear path forward." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg leading-relaxed font-body", children: description || "Everything you need to go from unboxing to a fully autonomous robot — no experience required." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: [
              "Pre-matched components that work together",
              "Step-by-step illustrated guidebook",
              "8 video projects from LED to autonomous robot",
              "Community support + teacher resources"
            ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center gap-3 text-foreground/80",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", style: { color: "#3BBFBF" }, children: "✓" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body", children: s })
                ]
              },
              s
            )) })
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-24 lg:py-32",
        style: {
          background: "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.13 0.04 248) 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { direction: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                style: {
                  background: "oklch(0.71 0.17 48 / 0.15)",
                  color: "#F47B20",
                  border: "1px solid oklch(0.71 0.17 48 / 0.3)"
                },
                children: "The Outcome"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-3xl lg:text-4xl text-white leading-tight", children: [
              "From zero to autonomous robot",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text-orange", children: "in one weekend." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/65 text-lg leading-relaxed font-body", children: "Students across India are completing their first robotics projects in days, not months. The confidence boost is real." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.1, direction: "right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm font-semibold uppercase tracking-wider mb-5", children: "What you'll build" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: [
              {
                name: "Line-Following Robot",
                icon: "〰️",
                desc: "Week 1 project"
              },
              {
                name: "Obstacle Avoider",
                icon: "📡",
                desc: "Week 2 project"
              },
              { name: "Bluetooth Car", icon: "📶", desc: "Week 3 project" },
              {
                name: "Light Sensor Bot",
                icon: "💡",
                desc: "Week 4 project"
              }
            ].map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: i * 0.08, direction: "up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "glass-card hover-lift rounded-xl p-4 cursor-default",
                style: {
                  background: "oklch(0.98 0 0 / 0.05)",
                  border: "1px solid oklch(0.98 0 0 / 0.1)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-3", children: p.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-white text-sm", children: p.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-xs mt-1", children: p.desc })
                ]
              }
            ) }, p.name)) })
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", style: { height: 480 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/assets/generated/story-outcome-success.dim_800x600.jpg",
          alt: "Student holding their completed Tinkro robot",
          loading: "lazy",
          decoding: "async",
          className: "w-full h-full object-cover object-center"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0",
          style: {
            background: "linear-gradient(to right, oklch(0.1 0.04 250 / 0.8) 0%, transparent 50%, oklch(0.1 0.04 250 / 0.6) 100%)"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 lg:px-12 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { direction: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "max-w-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl lg:text-3xl font-bold text-white leading-snug mb-4", children: '"I had zero experience. Three hours later, my robot was navigating the floor on its own."' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "text-white/60 font-body", children: "— Arjun Mehta, Student · Grade 10" })
      ] }) }) }) })
    ] })
  ] });
}
function VideoSection() {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  reactExports.useEffect(() => {
    function onKey(e) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "video-section",
      className: "py-24 lg:py-32 overflow-hidden relative",
      style: {
        background: "linear-gradient(180deg, oklch(0.13 0.04 248) 0%, oklch(0.1 0.04 250) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full opacity-20",
              style: {
                background: "radial-gradient(circle, oklch(0.71 0.17 48) 0%, transparent 70%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-[-6%] left-[-4%] w-[400px] h-[400px] rounded-full opacity-15",
              style: {
                background: "radial-gradient(circle, oklch(0.45 0.12 243) 0%, transparent 70%)"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-6 lg:px-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-widest text-white/40", children: "Product Demo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-4xl lg:text-5xl mt-3 text-white", children: [
              "See It ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text-orange", children: "In Action" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-white/60 text-lg max-w-2xl mx-auto font-body leading-relaxed", children: "Watch how students build, code, and innovate with the Tinkro Robotics Kit" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-4xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                whileHover: { scale: 1.03 },
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                className: "relative rounded-2xl overflow-hidden shadow-glow-orange group",
                style: {
                  aspectRatio: "16/9",
                  border: "1px solid oklch(0.71 0.17 48 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.15 0.06 240) 30%, oklch(0.12 0.05 220) 60%, oklch(0.08 0.03 260) 100%)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-20", children: [
                    [15, 35, 55, 72, 88].map((top) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute left-0 right-0 h-px",
                        style: {
                          top: `${top}%`,
                          background: "linear-gradient(90deg, transparent 0%, oklch(0.7 0.13 195 / 0.6) 20%, oklch(0.7 0.13 195 / 0.6) 80%, transparent 100%)"
                        }
                      },
                      `h-${top}`
                    )),
                    [12, 28, 50, 72, 88].map((left) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute top-0 bottom-0 w-px",
                        style: {
                          left: `${left}%`,
                          background: "linear-gradient(180deg, transparent 0%, oklch(0.45 0.12 243 / 0.5) 25%, oklch(0.45 0.12 243 / 0.5) 75%, transparent 100%)"
                        }
                      },
                      `v-${left}`
                    ))
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        className: "text-white/15 font-display font-bold text-6xl lg:text-8xl tracking-tight select-none",
                        animate: { opacity: [0.1, 0.18, 0.1] },
                        transition: {
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut"
                        },
                        children: "TINKRO"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/30 font-body text-sm uppercase tracking-widest", children: "Robotics Kit — Build Demo" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-all duration-500 pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      className: "absolute inset-0 flex items-center justify-center pointer-events-none",
                      animate: { opacity: [0.5, 0.9, 0.5] },
                      transition: {
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-40 h-40 rounded-full blur-3xl opacity-40",
                          style: {
                            background: "radial-gradient(circle, oklch(0.71 0.17 48) 0%, transparent 70%)"
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: openModal,
                      "aria-label": "Play product demo video",
                      "data-ocid": "video-play-btn",
                      className: "relative focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/60 rounded-full",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          className: "relative",
                          animate: { scale: [1, 1.06, 1] },
                          transition: {
                            duration: 2.2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut"
                          },
                          whileHover: { scale: 1.15 },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              motion.div,
                              {
                                className: "absolute inset-0 rounded-full",
                                animate: { scale: [1, 1.6], opacity: [0.5, 0] },
                                transition: {
                                  duration: 1.8,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeOut"
                                },
                                style: { background: "oklch(0.71 0.17 48 / 0.4)" }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              motion.div,
                              {
                                className: "absolute inset-0 rounded-full",
                                animate: { scale: [1, 2.1], opacity: [0.3, 0] },
                                transition: {
                                  duration: 1.8,
                                  delay: 0.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeOut"
                                },
                                style: { background: "oklch(0.71 0.17 48 / 0.25)" }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "relative z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-glow-orange",
                                style: {
                                  background: "linear-gradient(135deg, oklch(0.71 0.17 48) 0%, oklch(0.76 0.16 72) 100%)"
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    className: "ml-1.5",
                                    style: {
                                      width: 0,
                                      height: 0,
                                      borderStyle: "solid",
                                      borderWidth: "12px 0 12px 22px",
                                      borderColor: "transparent transparent transparent white"
                                    }
                                  }
                                )
                              }
                            )
                          ]
                        }
                      )
                    }
                  ) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-8 h-0.5 rounded-full",
                  style: {
                    background: "linear-gradient(90deg, oklch(0.71 0.17 48), oklch(0.7 0.13 195))"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm font-body", children: "Click to play · 4 min build walkthrough" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-8 h-0.5 rounded-full",
                  style: {
                    background: "linear-gradient(90deg, oklch(0.7 0.13 195), oklch(0.71 0.17 48))"
                  }
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 },
            className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8",
            style: { background: "rgba(0,0,0,0.92)" },
            onClick: closeModal,
            "data-ocid": "video-modal-overlay",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9, y: 20 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.92, y: 12 },
                transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                className: "relative w-full max-w-5xl rounded-2xl overflow-hidden",
                style: {
                  border: "1px solid oklch(0.71 0.17 48 / 0.4)",
                  boxShadow: "0 0 60px rgba(244,123,32,0.25)"
                },
                onClick: (e) => e.stopPropagation(),
                "data-ocid": "video-modal-content",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: closeModal,
                      "aria-label": "Close video",
                      "data-ocid": "video-modal-close",
                      className: "absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors",
                      style: {
                        background: "oklch(0.1 0.04 250 / 0.85)",
                        border: "1px solid oklch(0.98 0 0 / 0.15)"
                      },
                      children: "✕"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "relative w-full",
                      style: { paddingBottom: "56.25%" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "iframe",
                        {
                          className: "absolute inset-0 w-full h-full",
                          src: "https://www.youtube.com/embed/pijFRN7fq6M?autoplay=1&rel=0&modestbranding=1",
                          title: "Tinkro Robotics Kit — Build Walkthrough",
                          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                          allowFullScreen: true
                        }
                      )
                    }
                  )
                ]
              },
              "video-modal-content"
            )
          },
          "video-modal-overlay"
        ) })
      ]
    }
  );
}
function KitContentsSection({ items }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "kit-contents", className: "py-24 lg:py-32 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-widest text-muted-foreground", children: "What's in the box" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-4xl lg:text-5xl mt-3 text-foreground", children: [
        "Everything ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text-orange", children: "Inside" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground text-lg max-w-xl mx-auto font-body", children: "Premium-grade components, all pre-matched and tested to work together." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6", children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: i * 0.05, direction: "up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass-card hover-lift rounded-xl p-5 cursor-default text-center space-y-2 h-full",
        style: { border: "1px solid oklch(0.88 0.02 243)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KitIcon, { name: item.iconName }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm leading-snug", children: item.label }),
          item.quantity && item.quantity > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-block px-2 py-0.5 rounded-full text-xs font-semibold",
              style: {
                background: "oklch(0.7 0.13 195 / 0.12)",
                color: "#3BBFBF"
              },
              children: [
                "×",
                item.quantity
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs leading-relaxed", children: item.description })
        ]
      }
    ) }, item.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-2xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setOpen((p) => !p),
          "data-ocid": "specs-accordion-toggle",
          className: "w-full flex items-center justify-between px-6 py-5 bg-card hover:bg-muted/50 transition-colors text-left",
          "aria-expanded": open,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🔬" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground", children: "Technical Specifications" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.span,
              {
                animate: { rotate: open ? 180 : 0 },
                transition: { duration: 0.25 },
                className: "text-muted-foreground",
                children: "▾"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          transition: { duration: 0.35, ease: "easeInOut" },
          className: "overflow-hidden",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6 bg-muted/30 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4", children: [
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
            ["Age Recommendation", "12+ years"]
          ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide", children: k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-semibold mt-0.5", children: v })
          ] }, k)) })
        },
        "specs"
      ) })
    ] }) })
  ] }) });
}
function UseCasesSection({ useCases }) {
  const accent = {
    students: {
      top: "#2E6DA4",
      bg: "oklch(0.45 0.12 243 / 0.08)",
      badge: "oklch(0.45 0.12 243 / 0.15)"
    },
    schools: {
      top: "#3BBFBF",
      bg: "oklch(0.7 0.13 195 / 0.08)",
      badge: "oklch(0.7 0.13 195 / 0.15)"
    },
    beginners: {
      top: "#F47B20",
      bg: "oklch(0.71 0.17 48 / 0.08)",
      badge: "oklch(0.71 0.17 48 / 0.15)"
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "use-cases",
      className: "py-24 lg:py-32",
      style: {
        background: "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.12 0.03 248) 100%)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-widest text-white/40", children: "Who it's for" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-4xl lg:text-5xl mt-3 text-white", children: [
            "Built ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "For You" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6 lg:gap-8", children: useCases.map((uc, i) => {
          const c = accent[uc.audience] ?? {
            top: "#2E6DA4",
            bg: "oklch(0.45 0.12 243 / 0.08)",
            badge: "oklch(0.45 0.12 243 / 0.15)"
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: i * 0.12, direction: "up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card hover-lift rounded-2xl overflow-hidden h-full flex flex-col",
              style: { background: c.bg, border: `1px solid ${c.top}30` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full", style: { background: c.top } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-7 flex flex-col gap-5 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: uc.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl text-white mb-2", children: uc.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm leading-relaxed font-body", children: uc.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "inline-block px-3 py-1.5 rounded-lg text-xs font-semibold",
                      style: { background: c.badge, color: c.top },
                      children: [
                        "✓ ",
                        uc.benefit
                      ]
                    }
                  ) })
                ] })
              ]
            }
          ) }, uc.id);
        }) })
      ] })
    }
  );
}
function ReviewsSection({ reviews }) {
  const [current, setCurrent] = reactExports.useState(0);
  const total = Math.max(1, Math.ceil(reviews.length / 2));
  reactExports.useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % total), 5e3);
    return () => clearInterval(t);
  }, [total]);
  const visible = reviews.slice(current * 2, current * 2 + 2);
  const pageKeys = Array.from({ length: total }, (_, i) => `page-${i + 1}`);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "reviews", className: "py-24 lg:py-32 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-widest text-muted-foreground", children: "From the community" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-4xl lg:text-5xl mt-3 text-foreground", children: [
        "What ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "Builders" }),
        " Say"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "reviews-carousel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: visible.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.45 },
          className: "glass-card rounded-2xl p-6 lg:p-8 space-y-4",
          style: { border: "1px solid oklch(0.88 0.02 243)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: r.rating }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-semibold text-foreground text-base", children: [
              '"',
              r.title,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed font-body line-clamp-4", children: r.content }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white",
                  style: {
                    background: "linear-gradient(135deg, #2E6DA4, #3BBFBF)"
                  },
                  children: r.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: r.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs", children: [
                  r.role,
                  " · ",
                  r.date
                ] })
              ] }),
              r.verified && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "ml-auto text-xs px-2 py-0.5 rounded-full font-semibold",
                  style: {
                    background: "oklch(0.7 0.13 195 / 0.12)",
                    color: "#3BBFBF"
                  },
                  children: "✓ Verified"
                }
              )
            ] })
          ]
        },
        r.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setCurrent((p) => (p - 1 + total) % total),
            className: "w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors",
            "aria-label": "Previous reviews",
            "data-ocid": "reviews-prev",
            children: "‹"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: pageKeys.map((key, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setCurrent(idx),
            "data-ocid": `reviews-dot-${idx + 1}`,
            className: "rounded-full transition-all duration-300",
            style: {
              width: idx === current ? 24 : 8,
              height: 8,
              background: idx === current ? "#2E6DA4" : "oklch(0.88 0.02 243)"
            },
            "aria-label": `Go to review page ${idx + 1}`
          },
          key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setCurrent((p) => (p + 1) % total),
            className: "w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors",
            "aria-label": "Next reviews",
            "data-ocid": "reviews-next",
            children: "›"
          }
        )
      ] })
    ] })
  ] }) });
}
function StickyBuyPanel({
  product,
  heroImage
}) {
  const [visible, setVisible] = reactExports.useState(false);
  const [qty, setQty] = reactExports.useState(1);
  const [isAdding, setIsAdding] = reactExports.useState(false);
  const { addToast } = useToastContext();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
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
        price: product.price
      },
      qty
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
        price: product.price
      },
      qty
    );
    navigate({ to: "/checkout" });
  }
  const showOriginal = product.originalPrice > product.price;
  const discountPct = showOriginal ? Math.round(
    (product.originalPrice - product.price) / product.originalPrice * 100
  ) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { y: 120, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 120, opacity: 0 },
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      className: "fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:px-6",
      "data-ocid": "sticky-buy-panel",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "max-w-4xl mx-auto rounded-2xl overflow-hidden",
          style: {
            background: "oklch(0.1 0.04 250 / 0.92)",
            backdropFilter: "blur(20px)",
            borderTop: "2px solid #3BBFBF",
            border: "1px solid oklch(0.7 0.13 195 / 0.3)",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.4)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-white truncate text-sm sm:text-base", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-lg sm:text-xl gradient-text-orange", children: [
                  "₹",
                  product.price.toLocaleString()
                ] }),
                showOriginal && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/40 text-sm line-through", children: [
                  "₹",
                  product.originalPrice.toLocaleString()
                ] }),
                discountPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400 text-xs font-semibold", children: [
                  discountPct,
                  "% OFF"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-0 rounded-xl overflow-hidden shrink-0",
                style: { border: "1px solid oklch(0.98 0 0 / 0.15)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setQty((p) => Math.max(1, p - 1)),
                      className: "w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg",
                      "aria-label": "Decrease quantity",
                      "data-ocid": "qty-decrease",
                      children: "−"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-10 sm:w-12 text-center text-white font-semibold text-sm sm:text-base",
                      "data-ocid": "qty-display",
                      children: qty
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setQty((p) => p + 1),
                      className: "w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg",
                      "aria-label": "Increase quantity",
                      "data-ocid": "qty-increase",
                      children: "+"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  onClick: handleAdd,
                  whileHover: { scale: 1.03 },
                  whileTap: { scale: 0.97 },
                  disabled: isAdding,
                  type: "button",
                  className: "relative overflow-hidden rounded-xl px-5 py-3 sm:py-3.5 font-display font-bold text-sm sm:text-base shadow-sm transition-all duration-200 disabled:opacity-70 border",
                  style: {
                    borderColor: "oklch(0.7 0.13 195 / 0.5)",
                    color: "#3BBFBF",
                    background: "oklch(0.7 0.13 195 / 0.1)",
                    minWidth: 130
                  },
                  "data-ocid": "add-to-cart-btn",
                  children: isAdding ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.span,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin inline-block w-4 h-4 border-2 border-current/40 border-t-current rounded-full" }),
                        "Adding…"
                      ]
                    }
                  ) : "Add to Cart 🛒"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  onClick: handleBuyNow,
                  whileHover: { scale: 1.03 },
                  whileTap: { scale: 0.97 },
                  type: "button",
                  className: "relative overflow-hidden rounded-xl px-6 py-3 sm:py-3.5 font-display font-bold text-white text-sm sm:text-base shadow-glow-orange transition-all duration-200",
                  style: {
                    background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                    minWidth: 120
                  },
                  "data-ocid": "buy-now-btn",
                  children: "Buy Now ⚡"
                }
              )
            ] })
          ] })
        }
      )
    }
  ) });
}
function ProductDetailPage() {
  var _a;
  const { id } = useParams({ from: "/product/$id" });
  const { product } = useProductById(id);
  const { categories } = useCategories();
  const [anchorVisible, setAnchorVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    function onScroll() {
      setAnchorVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!product) return /* @__PURE__ */ jsxRuntimeExports.jsx(ProductNotFound, {});
  const heroImage = ((_a = product.images) == null ? void 0 : _a[0]) ?? product.image ?? "/placeholder.jpg";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "product-detail-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnchorNav, { visible: anchorVisible }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeroSection,
      {
        product,
        heroImage,
        categories
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StorySection, { description: product.description ?? "" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VideoSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(KitContentsSection, { items: FALLBACK_KIT_CONTENTS }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UseCasesSection, { useCases: FALLBACK_USE_CASES }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsSection, { reviews: FALLBACK_REVIEWS }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-24 text-center",
        style: {
          background: "linear-gradient(180deg, oklch(0.1 0.04 250) 0%, oklch(0.14 0.05 240) 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-4xl lg:text-5xl text-white mb-4", children: [
            "Start your robotics journey",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text-orange", children: "today." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-lg mb-8 font-body", children: "Join 10,000+ students, teachers, and makers who've already built with Tinkro." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.97 },
              type: "button",
              className: "inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-display font-bold text-white text-lg shadow-glow-orange bg-[#F47B20]",
              "data-ocid": "final-cta-btn",
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
              children: [
                "Get the Kit — ₹",
                product.price.toLocaleString(),
                " →"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/30 text-sm mt-4", children: "Free shipping · 30-day returns · STEM Certified" })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StickyBuyPanel, { product, heroImage })
  ] });
}
export {
  ProductDetailPage
};
