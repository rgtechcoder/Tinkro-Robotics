import { h as createLucideIcon, r as reactExports, p as getUserId, j as jsxRuntimeExports, m as motion, q as LogOut, A as AnimatePresence, X, t as Menu, v as LayoutDashboard, w as ShoppingBag, x as Truck, M as MapPin, T as Tag, U as User, y as subscribeToUserOrders, z as ArrowRight, P as Package, D as ChevronDown, E as CircleCheckBig, F as Star, G as Check, H as Mail, I as Phone } from "./index-O-oxzsBJ.js";
import { C as ChevronUp } from "./chevron-up-Id0BodQe.js";
import { P as Plus } from "./plus-DaZED7tD.js";
import { P as Pencil } from "./pencil-B8gfMpCg.js";
import { T as Trash2 } from "./trash-2-CTLSMskq.js";
import { T as Ticket } from "./ticket-DhyR_LGt.js";
import { C as Copy } from "./copy-CO8xLQDX.js";
import { S as Shield } from "./shield-BAuywxHN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode);
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 18 }) },
  { id: "orders", label: "Orders", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 18 }) },
  { id: "tracking", label: "Order Tracking", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 18 }) },
  { id: "addresses", label: "Addresses", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18 }) },
  { id: "coupons", label: "Coupons & Offers", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 18 }) },
  { id: "profile", label: "Profile Settings", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 18 }) }
];
function getInitials$1(id) {
  return id.slice(0, 2).toUpperCase();
}
function truncateId(id) {
  return id.length > 16 ? `${id.slice(0, 8)}...${id.slice(-4)}` : id;
}
function DashboardLayout({
  children,
  activeSection,
  onSectionChange
}) {
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const userId = getUserId();
  function handleNav(id) {
    onSectionChange(id);
    setMobileOpen(false);
  }
  const sidebar = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full w-[260px]",
      style: {
        background: "linear-gradient(180deg, oklch(0.13 0.04 243) 0%, oklch(0.10 0.03 243) 100%)",
        borderRight: "1px solid oklch(0.25 0.05 243 / 0.6)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-6 border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
              style: {
                background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                boxShadow: "0 0 16px oklch(0.71 0.17 48 / 0.4)"
              },
              children: getInitials$1(userId)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 uppercase tracking-widest mb-0.5", children: "My Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60 truncate font-mono", children: truncateId(userId) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto", children: NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `nav-${item.id}`,
              onClick: () => handleNav(item.id),
              className: "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              style: isActive ? {
                background: "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.25), oklch(0.76 0.16 72 / 0.15))",
                color: "oklch(0.88 0.10 48)",
                boxShadow: "0 0 12px oklch(0.71 0.17 48 / 0.15)"
              } : {
                color: "oklch(0.65 0.02 243)"
              },
              children: [
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    layoutId: "active-bar",
                    className: "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full",
                    style: {
                      background: "linear-gradient(180deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                      boxShadow: "0 0 8px oklch(0.71 0.17 48 / 0.6)"
                    }
                  }
                ),
                !isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.45 0.12 243 / 0.12), oklch(0.7 0.13 195 / 0.08))"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `relative z-10 ${isActive ? "text-orange-400" : "text-white/40 group-hover:text-white/70"} transition-colors duration-200`,
                    children: item.icon
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: item.label })
              ]
            },
            item.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-5 pt-2 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "nav-logout",
            className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group",
            onClick: () => {
              localStorage.removeItem("tinkro_user_id");
              window.location.href = "/";
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                LogOut,
                {
                  size: 18,
                  className: "group-hover:text-red-400 transition-colors"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Logout" })
            ]
          }
        ) })
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex",
      style: {
        background: "linear-gradient(135deg, oklch(0.09 0.03 243) 0%, oklch(0.07 0.02 250) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:flex flex-col shrink-0", children: sidebar }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: { duration: 0.2 },
              className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden",
              onClick: () => setMobileOpen(false)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.aside,
            {
              initial: { x: -280 },
              animate: { x: 0 },
              exit: { x: -280 },
              transition: { type: "spring", stiffness: 300, damping: 30 },
              className: "fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "absolute top-4 right-[-40px] z-50 p-2 rounded-full bg-white/10 text-white",
                    onClick: () => setMobileOpen(false),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
                  }
                ) }),
                sidebar
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5",
              style: { background: "oklch(0.12 0.03 243 / 0.9)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "mobile-menu-toggle",
                    onClick: () => setMobileOpen(true),
                    className: "p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 20 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "oklch(0.88 0.10 48)" },
                    children: "Tinkro Dashboard"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8", children })
        ] })
      ]
    }
  );
}
const STATUS_COLORS = {
  placed: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  shipped: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  delivered: "bg-green-500/20 text-green-300 border border-green-500/30"
};
function SkeletonCard$1() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-5 animate-pulse space-y-3 bg-white/5 border border-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white/10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/2 rounded-full bg-white/10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-1/3 rounded-full bg-white/10" })
  ] });
}
function SkeletonRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 py-3 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-24 rounded bg-white/10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-20 rounded bg-white/10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-16 rounded bg-white/10 ml-auto" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-16 rounded-full bg-white/10" })
  ] });
}
function formatDate$2(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function formatPrice$1(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function DashboardOverview({ addressCount = 0, onNavigate }) {
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const userId = getUserId();
    const unsub = subscribeToUserOrders(userId, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  const recentOrder = orders[0];
  const recentOrders = orders.slice(0, 3);
  const cards = [
    {
      label: "Total Orders",
      value: loading ? "—" : String(orders.length),
      icon: ShoppingBag,
      gradient: "from-blue-600/30 to-blue-800/10",
      glow: "shadow-blue-500/10",
      iconColor: "text-blue-400",
      section: "orders"
    },
    {
      label: "Recent Order",
      value: loading ? "—" : recentOrder ? recentOrder.status.charAt(0).toUpperCase() + recentOrder.status.slice(1) : "No orders",
      icon: Truck,
      gradient: "from-orange-600/30 to-orange-800/10",
      glow: "shadow-orange-500/10",
      iconColor: "text-orange-400",
      section: "tracking"
    },
    {
      label: "Saved Addresses",
      value: loading ? "—" : String(addressCount),
      icon: MapPin,
      gradient: "from-teal-600/30 to-teal-800/10",
      glow: "shadow-teal-500/10",
      iconColor: "text-teal-400",
      section: "addresses"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Welcome back 👋" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-400", children: "Here's what's happening with your account today." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: loading ? [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard$1, {}, i)) : cards.map((card, i) => {
      const Icon = card.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.button,
        {
          "data-ocid": `overview-card-${card.section}`,
          onClick: () => onNavigate == null ? void 0 : onNavigate(card.section),
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.1 },
          whileHover: { y: -4, scale: 1.01 },
          className: `w-full text-left rounded-2xl p-5 bg-gradient-to-br ${card.gradient} border border-white/10 backdrop-blur-sm shadow-lg ${card.glow} transition-all duration-200 cursor-pointer`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 mb-3 ${card.iconColor}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 font-medium uppercase tracking-wider mb-1", children: card.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-white", children: card.value })
          ]
        },
        card.label
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.35 },
        className: "rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-white", children: "Recent Orders" }),
            orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "overview-view-all-orders",
                onClick: () => onNavigate == null ? void 0 : onNavigate("orders"),
                className: "flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors",
                children: [
                  "View All ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12 })
                ]
              }
            )
          ] }),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 divide-y divide-white/5", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}, i)) }) : recentOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-14 px-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl mb-4", children: "🛒" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-lg", children: "No orders yet. Start shopping!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mt-1 mb-5", children: "Your order history will appear here once you place your first order." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "/products",
                "data-ocid": "overview-browse-products",
                className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all",
                children: [
                  "Browse Products ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/5", children: recentOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-white/5 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-slate-300", children: [
                  "#",
                  order.id.slice(-8).toUpperCase()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: formatDate$2(order.createdAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white ml-auto", children: formatPrice$1(order.total) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-white/10 text-white"}`,
                    children: order.status.charAt(0).toUpperCase() + order.status.slice(1)
                  }
                )
              ]
            },
            order.id
          )) })
        ]
      }
    )
  ] });
}
const products = [
  {
    id: "tinkro-starter-kit",
    name: "Tinkro Starter Robotics Kit",
    price: 4999,
    originalPrice: 6999,
    image: "/images/products/starter-kit.jpg",
    category: "Robotics Kits",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 342,
    description: "The perfect entry point into robotics. Build your first robot, learn programming fundamentals, and explore electronics — all in one complete kit designed for students aged 10 and above.",
    inStock: true
  },
  {
    id: "tinkro-ai-vision",
    name: "Tinkro AI Vision Kit",
    price: 12999,
    originalPrice: 16999,
    image: "/images/products/ai-vision-kit.jpg",
    category: "AI & Vision Kits",
    badge: "Premium",
    rating: 4.9,
    reviews: 128,
    description: "Explore the future of artificial intelligence with computer vision. This advanced kit teaches object detection, face recognition, and real-time AI processing — perfect for students aged 14 and above.",
    inStock: true
  },
  {
    id: "tinkro-iot-smarthome",
    name: "Tinkro IoT Smart Home Kit",
    price: 7499,
    originalPrice: 9999,
    image: "/images/products/iot-smarthome-kit.jpg",
    category: "IoT & Smart Kits",
    badge: "Popular",
    rating: 4.7,
    reviews: 215,
    description: "Build and automate a smart home model with sensors, actuators, and Wi-Fi connectivity. Learn IoT concepts, cloud integration, and real-world automation through hands-on projects.",
    inStock: true
  },
  {
    id: "tinkro-sensor-pack",
    name: "Tinkro Sensor Explorer Pack",
    price: 2999,
    originalPrice: 3999,
    image: "/images/products/sensor-pack.jpg",
    category: "Sensors & Components",
    badge: "Value Pack",
    rating: 4.6,
    reviews: 189,
    description: "A comprehensive collection of 30+ sensors for hands-on learning. Includes ultrasonic, infrared, temperature, flame, gas, and more. Perfect for school projects, hackathons, and STEM experiments.",
    inStock: true
  },
  {
    id: "tinkro-arduino-pro",
    name: "Tinkro Arduino Pro Learning Kit",
    price: 5999,
    originalPrice: 7999,
    image: "/images/products/arduino-pro-kit.jpg",
    category: "Arduino & Programming",
    badge: "Top Rated",
    rating: 4.8,
    reviews: 276,
    description: "Master Arduino programming with 50+ guided projects. From LED blink to advanced robotics control — this comprehensive kit takes students from zero to hero in embedded programming.",
    inStock: true
  },
  {
    id: "tinkro-drone-kit",
    name: "Tinkro Drone Build Kit",
    price: 15999,
    originalPrice: 19999,
    image: "/images/products/drone-kit.jpg",
    category: "Drones & Aerial",
    badge: "Advanced",
    rating: 4.9,
    reviews: 87,
    description: "Build, program, and fly your own drone from scratch. Learn aerodynamics, flight controllers, PID tuning, and drone programming. Ideal for advanced students and school drone clubs.",
    inStock: true
  },
  {
    id: "tinkro-stem-lab-pack",
    name: "Tinkro School STEM Pack",
    price: 24999,
    originalPrice: 34999,
    image: "/images/products/stem-lab-pack.jpg",
    category: "Lab Kits",
    badge: "School Pack",
    rating: 5,
    reviews: 64,
    description: "Everything a school needs to kickstart a STEM lab. Includes 5 Starter Kits, sensor packs, and curriculum guide for 20 students. Comes with GST invoice and installation support.",
    inStock: true
  },
  {
    id: "tinkro-raspberry-kit",
    name: "Tinkro Raspberry Pi AI Kit",
    price: 8999,
    originalPrice: 11999,
    image: "/images/products/raspberry-kit.jpg",
    category: "AI & Vision Kits",
    badge: "New",
    rating: 4.8,
    reviews: 94,
    description: "Complete Raspberry Pi 4 bundle with 4GB RAM, pre-configured AI environment, camera module, and 10 guided AI projects. Ideal for IoT and machine learning applications.",
    inStock: true
  }
];
const FILTERS = [
  { key: "all", label: "All" },
  { key: "recent", label: "Recent" },
  { key: "delivered", label: "Delivered" },
  { key: "pending", label: "Pending" }
];
const STATUS_PILL = {
  placed: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  shipped: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  delivered: "bg-green-500/20 text-green-300 border border-green-500/30"
};
function productImage(name) {
  const match = products.find(
    (p) => p.name.toLowerCase().includes(name.toLowerCase().split(" ")[0])
  );
  return (match == null ? void 0 : match.image) ?? "/assets/brand/product-robot-chassis.jpg";
}
function formatDate$1(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function formatPrice(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function filterOrders(orders, filter) {
  switch (filter) {
    case "recent":
      return orders.slice(0, 5);
    case "delivered":
      return orders.filter((o) => o.status === "delivered");
    case "pending":
      return orders.filter(
        (o) => o.status === "placed" || o.status === "shipped"
      );
    default:
      return orders;
  }
}
function SkeletonOrderCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white/5 border border-white/10 p-5 animate-pulse space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-xl bg-white/10 flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/3 bg-white/10 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/4 bg-white/10 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/2 bg-white/10 rounded" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-20 bg-white/10 rounded-full" })
  ] }) });
}
function OrderCard({ order, expanded, onToggle }) {
  const firstItem = order.items[0];
  const img = firstItem ? productImage(firstItem.name) : "/assets/brand/product-robot-chassis.jpg";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      className: `rounded-2xl bg-white/5 border transition-colors duration-200 overflow-hidden ${expanded ? "border-orange-500/40" : "border-white/10 hover:border-white/20"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img,
              alt: (firstItem == null ? void 0 : firstItem.name) ?? "Product",
              className: "w-16 h-16 rounded-xl object-contain bg-white/5 flex-shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white font-semibold text-sm truncate", children: [
              (firstItem == null ? void 0 : firstItem.name) ?? "Order",
              order.items.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400 font-normal", children: [
                " ",
                "+",
                order.items.length - 1,
                " more"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [
              "#",
              order.id.slice(-8).toUpperCase(),
              " · ",
              formatDate$1(order.createdAt)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: [
              order.items.length,
              " item",
              order.items.length !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold", children: formatPrice(order.total) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_PILL[order.status]}`,
                  children: order.status.charAt(0).toUpperCase() + order.status.slice(1)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `order-view-details-${order.id}`,
                onClick: onToggle,
                className: "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs hover:bg-white/20 transition-colors",
                children: [
                  expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }),
                  expanded ? "Hide" : "Details"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.25 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10 px-5 py-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium", children: "Items" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex justify-between items-center text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 truncate max-w-[60%]", children: item.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400 text-xs", children: [
                        item.quantity,
                        "x ·",
                        " ",
                        formatPrice(item.price * item.quantity)
                      ] })
                    ]
                  },
                  `${item.productId}-${item.name}`
                )) })
              ] }),
              order.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 uppercase tracking-wider mb-1 font-medium", children: "Delivery Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-300", children: [
                  order.address.name,
                  ", ",
                  order.address.line1,
                  ",",
                  " ",
                  order.address.city,
                  " – ",
                  order.address.pincode
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-6 text-xs text-slate-400", children: [
                order.razorpayPaymentId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Payment ID: " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    order.razorpayPaymentId.slice(0, 18),
                    "…"
                  ] })
                ] }),
                order.estimatedDelivery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Est. Delivery: " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: order.estimatedDelivery })
                ] })
              ] })
            ] })
          },
          "details"
        ) })
      ]
    }
  );
}
function DashboardOrders() {
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const [expandedId, setExpandedId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const userId = getUserId();
    const unsub = subscribeToUserOrders(userId, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  const filtered = filterOrders(orders, activeFilter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-400", children: "Your full order history" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `orders-filter-${f.key}`,
        onClick: () => setActiveFilter(f.key),
        className: `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === f.key ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20" : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"}`,
        children: f.label
      },
      f.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: loading ? [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonOrderCard, {}, i)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "flex flex-col items-center py-16 text-center",
        "data-ocid": "orders-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 48, className: "text-slate-600 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white font-semibold text-lg", children: [
            "No ",
            activeFilter !== "all" ? activeFilter : "",
            " orders found"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mt-1", children: activeFilter === "all" ? "Place your first order to see it here." : "Try a different filter." })
        ]
      }
    ) : filtered.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrderCard,
      {
        order,
        expanded: expandedId === order.id,
        onToggle: () => setExpandedId(expandedId === order.id ? null : order.id)
      },
      order.id
    )) })
  ] });
}
const STAGES = [
  { label: "Order Placed", icon: CircleCheckBig, key: "placed" },
  { label: "Processing", icon: Package, key: "processing" },
  { label: "Shipped", icon: Truck, key: "shipped" },
  { label: "Delivered", icon: House, key: "delivered" }
];
function stageIndex(status) {
  switch (status) {
    case "placed":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function SkeletonTimeline() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-1/3 bg-white/10 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-white/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-16 bg-white/10 rounded" })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/2 bg-white/10 rounded" })
  ] });
}
function OrderTimeline({ order }) {
  const currentStage = stageIndex(order.status);
  const isDelivered = order.status === "delivered";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      className: "rounded-2xl bg-white/5 border border-white/10 p-6 space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white font-semibold", children: [
              "Order #",
              order.id.slice(-8).toUpperCase()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [
              "Placed on ",
              formatDate(order.createdAt)
            ] })
          ] }),
          isDelivered && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 12 }),
            " Delivered ✓"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-5 left-5 right-5 h-0.5 bg-white/10 z-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-5 left-5 h-0.5 bg-gradient-to-r from-orange-500 to-green-500 z-0 transition-all duration-700",
              style: {
                width: `${Math.min(currentStage / (STAGES.length - 1) * 100, 100)}%`
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 flex justify-between items-start", children: STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isComplete = i < currentStage;
            const isCurrent = i === currentStage;
            const isFuture = i > currentStage;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-2 flex-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        animate: { scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] },
                        transition: {
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY
                        },
                        className: "absolute inset-0 rounded-full bg-orange-500"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isComplete ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30" : isCurrent ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40" : "bg-white/10 text-slate-600"}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18, className: isFuture ? "opacity-40" : "" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `text-xs text-center leading-tight font-medium hidden sm:block ${isComplete || isCurrent ? "text-white" : "text-slate-600"}`,
                      children: stage.label
                    }
                  )
                ]
              },
              stage.key
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden", children: STAGES.map((stage, i) => {
          const isComplete = i < currentStage;
          const isCurrent = i === currentStage;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `text-xs ${isComplete || isCurrent ? "text-white" : "text-slate-600"} text-center`,
              children: isCurrent ? `▸ ${stage.label}` : stage.label
            },
            stage.key
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-6 pt-2 border-t border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-slate-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs", children: "Tracking ID:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 text-xs font-mono", children: order.trackingId ?? "Available after dispatch" })
          ] }),
          order.estimatedDelivery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 14, className: "text-slate-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs", children: "Est. Delivery:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-300 text-xs font-medium", children: order.estimatedDelivery })
          ] })
        ] })
      ]
    }
  );
}
function DashboardTracking() {
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const userId = getUserId();
    const unsub = subscribeToUserOrders(userId, (data) => {
      const active = data.filter((o) => o.status !== "delivered");
      setOrders(active.length > 0 ? active : data);
      setLoading(false);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    if (orders.length > 0 && !selectedId) {
      setSelectedId(orders[0].id);
    }
  }, [orders, selectedId]);
  const selectedOrder = orders.find((o) => o.id === selectedId) ?? orders[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Order Tracking" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-400", children: "Live status and delivery updates" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white/5 border border-white/10 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonTimeline, {}) }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        "data-ocid": "tracking-empty-state",
        className: "flex flex-col items-center py-16 text-center rounded-2xl bg-white/5 border border-white/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 48, className: "text-slate-600 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-lg", children: "No active orders to track" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mt-1 mb-5", children: "Your shipments will appear here once you place an order." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/products",
              className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all",
              children: "Browse Products"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      orders.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `tracking-select-${order.id}`,
          onClick: () => setSelectedId(order.id),
          className: `px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${selectedId === order.id ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"}`,
          children: [
            "#",
            order.id.slice(-8).toUpperCase()
          ]
        },
        order.id
      )) }),
      selectedOrder && /* @__PURE__ */ jsxRuntimeExports.jsx(OrderTimeline, { order: selectedOrder })
    ] })
  ] });
}
async function getUserAddresses(_userId) {
  return [];
}
async function saveAddress(_userId, _address) {
  return `mock-address-${Date.now()}`;
}
async function updateAddress(_userId, _addressId, _data) {
  return Promise.resolve();
}
async function deleteAddress(_userId, _addressId) {
  return Promise.resolve();
}
const EMPTY_FORM = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false
};
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh"
];
function Toast$1({ msg, onClose }) {
  reactExports.useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      className: "fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
        " ",
        msg
      ]
    }
  );
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/5 border border-white/10 p-5 animate-pulse space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/2 bg-white/10 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3/4 bg-white/10 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-2/3 bg-white/10 rounded" })
  ] });
}
function FormField({
  id,
  label,
  value,
  placeholder,
  error,
  optional,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: id, className: "text-xs text-slate-400 font-medium", children: [
      label,
      " ",
      optional && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "(optional)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id,
        "data-ocid": id,
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        className: `w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 transition-colors ${error ? "border-red-500/60 focus:border-red-400 focus:ring-red-500/30" : "border-white/10 focus:border-orange-500/60 focus:ring-orange-500/20"}`
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: error })
  ] });
}
function AddressForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saving
}) {
  const [form, setForm] = reactExports.useState(initial);
  const [errors, setErrors] = reactExports.useState(
    {}
  );
  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: void 0 }));
  }
  function validate() {
    const required = [
      "name",
      "phone",
      "line1",
      "city",
      "state",
      "pincode"
    ];
    const errs = {};
    for (const k of required) {
      if (!String(form[k]).trim()) errs[k] = "Required";
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode))
      errs.pincode = "Enter a valid 6-digit pincode";
    if (form.phone && !/^\d{10}$/.test(form.phone))
      errs.phone = "Enter a valid 10-digit phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.form,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      onSubmit: handleSubmit,
      className: "rounded-2xl bg-white/5 border border-orange-500/30 p-5 space-y-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: initial === EMPTY_FORM ? "Add New Address" : "Edit Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              id: "address-input-name",
              label: "Full Name",
              value: form.name,
              placeholder: "John Doe",
              error: errors.name,
              onChange: (v) => set("name", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              id: "address-input-phone",
              label: "Phone Number",
              value: form.phone,
              placeholder: "9876543210",
              error: errors.phone,
              onChange: (v) => set("phone", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              id: "address-input-line1",
              label: "Address Line 1",
              value: form.line1,
              placeholder: "House / Flat / Street",
              error: errors.line1,
              onChange: (v) => set("line1", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              id: "address-input-line2",
              label: "Address Line 2",
              value: form.line2 ?? "",
              placeholder: "Area / Locality",
              optional: true,
              onChange: (v) => set("line2", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              id: "address-input-city",
              label: "City",
              value: form.city,
              placeholder: "Mumbai",
              error: errors.city,
              onChange: (v) => set("city", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "address-input-state",
                className: "text-xs text-slate-400 font-medium",
                children: "State"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "address-input-state",
                "data-ocid": "address-input-state",
                value: form.state,
                onChange: (e) => set("state", e.target.value),
                className: `w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 transition-colors ${errors.state ? "border-red-500/60 focus:border-red-400 focus:ring-red-500/30" : "border-white/10 focus:border-orange-500/60 focus:ring-orange-500/20"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-slate-900", children: "Select state" }),
                  INDIAN_STATES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, className: "bg-slate-900", children: s }, s))
                ]
              }
            ),
            errors.state && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errors.state })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              id: "address-input-pincode",
              label: "Pincode",
              value: form.pincode,
              placeholder: "400001",
              error: errors.pincode,
              onChange: (v) => set("pincode", v)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "address-input-isDefault",
            className: "flex items-center gap-2 cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "address-input-isDefault",
                  "data-ocid": "address-input-isDefault",
                  type: "checkbox",
                  checked: form.isDefault,
                  onChange: (e) => set("isDefault", e.target.checked),
                  className: "accent-orange-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-300", children: "Set as default address" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              "data-ocid": "address-save-btn",
              disabled: saving,
              className: "flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all disabled:opacity-60",
              children: saving ? "Saving…" : "Save Address"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onCancel,
              className: "px-5 py-2 rounded-full bg-white/10 text-slate-300 text-sm hover:bg-white/20 transition-colors",
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  );
}
function DashboardAddresses() {
  const [addresses, setAddresses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const reload = reactExports.useCallback(async () => {
    const data = await getUserAddresses(getUserId());
    setAddresses(data);
  }, []);
  reactExports.useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);
  async function handleAdd(data) {
    setSaving(true);
    await saveAddress(getUserId());
    await reload();
    setSaving(false);
    setShowAddForm(false);
    setToast("Address saved successfully!");
  }
  async function handleEdit(id, data) {
    setSaving(true);
    await updateAddress(getUserId());
    await reload();
    setSaving(false);
    setEditId(null);
    setToast("Address updated!");
  }
  async function handleDelete(id) {
    await deleteAddress(getUserId());
    await reload();
    setConfirmDeleteId(null);
    setToast("Address removed.");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast$1, { msg: toast, onClose: () => setToast(null) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Addresses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-400", children: "Manage your saved delivery addresses" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "addresses-add-btn",
          onClick: () => {
            setShowAddForm(true);
            setEditId(null);
          },
          className: "flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            " Add New"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddressForm,
      {
        onSave: handleAdd,
        onCancel: () => setShowAddForm(false),
        saving
      }
    ) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)) }) : addresses.length === 0 && !showAddForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        "data-ocid": "addresses-empty-state",
        className: "flex flex-col items-center py-16 text-center rounded-2xl bg-white/5 border border-white/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 48, className: "text-slate-600 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-lg", children: "No saved addresses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Add your first address to speed up checkout." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: addresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        layout: true,
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
        className: "rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 relative",
        children: [
          editId === addr.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            AddressForm,
            {
              initial: {
                name: addr.name,
                phone: addr.phone,
                line1: addr.line1,
                line2: addr.line2 ?? "",
                city: addr.city,
                state: addr.state,
                pincode: addr.pincode,
                isDefault: addr.isDefault
              },
              onSave: (data) => handleEdit(addr.id),
              onCancel: () => setEditId(null),
              saving
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-sm", children: addr.name }),
                  addr.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs border border-orange-500/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10 }),
                    " Default"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: addr.phone })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `address-edit-${addr.id}`,
                    onClick: () => {
                      setEditId(addr.id);
                      setShowAddForm(false);
                    },
                    className: "p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `address-delete-${addr.id}`,
                    onClick: () => setConfirmDeleteId(addr.id),
                    className: "p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-300 leading-relaxed", children: [
              addr.line1,
              addr.line2 ? `, ${addr.line2}` : "",
              ", ",
              addr.city,
              ",",
              " ",
              addr.state,
              " – ",
              addr.pincode
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: confirmDeleteId === addr.id && editId !== addr.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "absolute inset-0 rounded-2xl bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm font-medium text-center", children: "Remove this address?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `address-confirm-delete-${addr.id}`,
                      onClick: () => handleDelete(addr.id),
                      className: "px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-colors",
                      children: "Remove"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setConfirmDeleteId(null),
                      className: "px-4 py-1.5 rounded-full bg-white/10 text-slate-300 text-xs hover:bg-white/20 transition-colors",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12, className: "inline" }),
                        " Cancel"
                      ]
                    }
                  )
                ] })
              ]
            }
          ) })
        ]
      },
      addr.id
    )) }) })
  ] });
}
const AVAILABLE_COUPONS = [
  {
    code: "TINKRO10",
    title: "10% Off Everything",
    description: "Flat 10% off on all orders. No category restrictions.",
    discountLabel: "10% OFF",
    minOrder: "₹500",
    validUntil: "31 Dec 2025",
    gradient: "from-blue-600/20 to-blue-800/10",
    accentColor: "text-blue-400",
    borderColor: "border-blue-500/30"
  },
  {
    code: "STEM20",
    title: "STEM Kit Special",
    description: "Extra 20% off on all STEM kit purchases.",
    discountLabel: "20% OFF",
    minOrder: "₹1,000",
    validUntil: "31 Dec 2025",
    gradient: "from-purple-600/20 to-purple-800/10",
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/30"
  },
  {
    code: "ROBO15",
    title: "Robotics Discount",
    description: "15% off on all robotics kit orders.",
    discountLabel: "15% OFF",
    minOrder: "₹800",
    validUntil: "31 Dec 2025",
    gradient: "from-teal-600/20 to-teal-800/10",
    accentColor: "text-teal-400",
    borderColor: "border-teal-500/30"
  },
  {
    code: "FIRST50",
    title: "First Order Offer",
    description: "Exclusive 50% off on your very first order.",
    discountLabel: "50% OFF",
    minOrder: "₹200",
    validUntil: "31 Dec 2025",
    gradient: "from-orange-600/20 to-orange-800/10",
    accentColor: "text-orange-400",
    borderColor: "border-orange-500/30"
  }
];
function CopyToast({ onClose }) {
  reactExports.useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      className: "fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
        " Code copied to clipboard!"
      ]
    }
  );
}
function SkeletonCoupon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/5 border border-white/10 p-5 animate-pulse space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-1/4 bg-white/10 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/2 bg-white/10 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-2/3 bg-white/10 rounded-lg" })
  ] });
}
function CouponCard({ coupon, onCopy, copied }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      whileHover: { y: -2 },
      className: `rounded-2xl bg-gradient-to-br ${coupon.gradient} border ${coupon.borderColor} p-5 space-y-4 transition-all duration-200`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-bold uppercase tracking-wider ${coupon.accentColor}`,
                children: coupon.discountLabel
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-sm mt-0.5", children: coupon.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-xs mt-1", children: coupon.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 ${coupon.accentColor}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center justify-between gap-2 rounded-xl border-2 border-dashed ${coupon.borderColor} bg-white/5 px-4 py-2.5`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-mono font-bold tracking-widest text-sm ${coupon.accentColor}`,
                  children: coupon.code
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `coupon-copy-${coupon.code}`,
                  onClick: () => onCopy(coupon.code),
                  className: `flex items-center gap-1.5 text-xs px-3 py-1 rounded-full transition-all duration-200 ${copied ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10"}`,
                  children: [
                    copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 }),
                    copied ? "Copied!" : "Copy"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Min. order: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: coupon.minOrder })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Valid till:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: coupon.validUntil })
          ] })
        ] })
      ]
    }
  );
}
function DashboardCoupons() {
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [copiedCode, setCopiedCode] = reactExports.useState(null);
  const [showToast, setShowToast] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const userId = getUserId();
    const unsub = subscribeToUserOrders(userId, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  function handleCopy(code) {
    navigator.clipboard.writeText(code).catch(() => {
    });
    setCopiedCode(code);
    setShowToast(true);
    setTimeout(() => setCopiedCode(null), 2500);
  }
  const appliedCoupons = orders.filter((o) => o.coupon).map((o) => ({
    code: o.coupon,
    orderId: o.id,
    date: o.createdAt
  }));
  const uniqueApplied = appliedCoupons.filter(
    (c, i, arr) => arr.findIndex((x) => x.code === c.code) === i
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showToast && /* @__PURE__ */ jsxRuntimeExports.jsx(CopyToast, { onClose: () => setShowToast(false) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Coupons & Offers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-400", children: "Your rewards and available discounts" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 16, className: "text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-white", children: "Available Coupons" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCoupon, {}, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: AVAILABLE_COUPONS.map((coupon) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CouponCard,
        {
          coupon,
          onCopy: handleCopy,
          copied: copiedCode === coupon.code
        },
        coupon.code
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16, className: "text-green-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-white", children: "Applied Coupons" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCoupon, {}, i)) }) : uniqueApplied.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          "data-ocid": "coupons-applied-empty",
          className: "rounded-2xl bg-white/5 border border-white/10 px-5 py-10 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl mb-3 block", children: "🎫" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm", children: "No coupons applied yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs mt-1", children: "Use a coupon code at checkout to see it here." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: uniqueApplied.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16, className: "text-green-400 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-300 font-mono font-bold text-sm", children: c.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs truncate", children: [
                "Used in order #",
                c.orderId.slice(-8).toUpperCase()
              ] })
            ] })
          ]
        },
        c.code
      )) })
    ] })
  ] });
}
const LS_KEYS = {
  displayName: "tinkro_display_name",
  email: "tinkro_email",
  phone: "tinkro_phone",
  memberSince: "tinkro_member_since"
};
function loadProfile() {
  return {
    displayName: localStorage.getItem(LS_KEYS.displayName) ?? "",
    email: localStorage.getItem(LS_KEYS.email) ?? "",
    phone: localStorage.getItem(LS_KEYS.phone) ?? ""
  };
}
function saveProfile(data) {
  localStorage.setItem(LS_KEYS.displayName, data.displayName);
  localStorage.setItem(LS_KEYS.email, data.email);
  localStorage.setItem(LS_KEYS.phone, data.phone);
}
function getMemberSince() {
  let ms = localStorage.getItem(LS_KEYS.memberSince);
  if (!ms) {
    ms = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric"
    });
    localStorage.setItem(LS_KEYS.memberSince, ms);
  }
  return ms;
}
function getInitials(name) {
  if (!name.trim()) return "TR";
  return name.split(" ").slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("");
}
function Toast({ msg, onClose }) {
  reactExports.useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      className: "fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
        " ",
        msg
      ]
    }
  );
}
function SkeletonProfile() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-white/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-32 bg-white/10 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-24 bg-white/10 rounded" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-white/10 rounded-xl" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 bg-white/10 rounded-xl" }, i)) })
  ] });
}
function DashboardProfile() {
  const [profile, setProfile] = reactExports.useState(loadProfile());
  const [editMode, setEditMode] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState(loadProfile());
  const [orderCount, setOrderCount] = reactExports.useState(0);
  const [addressCount, setAddressCount] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  const [toast, setToast] = reactExports.useState(null);
  const userId = getUserId();
  const memberSince = getMemberSince();
  reactExports.useEffect(() => {
    let ready = { orders: false, addresses: false };
    function checkDone() {
      if (ready.orders && ready.addresses) setLoading(false);
    }
    const unsub = subscribeToUserOrders(userId, (orders) => {
      setOrderCount(orders.length);
      ready.orders = true;
      checkDone();
    });
    getUserAddresses().then((addrs) => {
      setAddressCount(addrs.length);
      ready.addresses = true;
      checkDone();
    });
    return unsub;
  }, [userId]);
  function startEdit() {
    setDraft({ ...profile });
    setEditMode(true);
  }
  function cancelEdit() {
    setDraft({ ...profile });
    setEditMode(false);
  }
  function saveEdit() {
    saveProfile(draft);
    setProfile({ ...draft });
    setEditMode(false);
    setToast("Profile updated successfully!");
  }
  const initials = getInitials(profile.displayName);
  const fields = [
    {
      key: "displayName",
      label: "Display Name",
      icon: User,
      placeholder: "Your full name",
      type: "text"
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      placeholder: "you@example.com",
      type: "email"
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      placeholder: "9876543210",
      type: "tel"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { msg: toast, onClose: () => setToast(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Profile Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-400", children: "Manage your account details" })
      ] }),
      !editMode && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "profile-edit-btn",
          onClick: startEdit,
          className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-slate-300 text-sm hover:bg-white/20 hover:text-white transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 }),
            " Edit Profile"
          ]
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white/5 border border-white/10 p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonProfile, {}) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        className: "rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 space-y-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-orange-500 text-white text-2xl font-bold shadow-xl shadow-blue-500/20 select-none", children: initials }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-lg", children: profile.displayName || "Tinkro User" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs mt-0.5", children: [
                "Member since ",
                memberSince
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-white", children: orderCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Total Orders" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-white", children: addressCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Saved Addresses" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            fields.map((f) => {
              const Icon = f.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: `profile-input-${f.key}`,
                    className: "flex items-center gap-1.5 text-xs text-slate-500 font-medium",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 12 }),
                      " ",
                      f.label
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: `profile-input-${f.key}`,
                    "data-ocid": `profile-input-${f.key}`,
                    type: f.type,
                    value: editMode ? draft[f.key] : profile[f.key],
                    readOnly: !editMode,
                    placeholder: f.placeholder,
                    onChange: (e) => setDraft((d) => ({ ...d, [f.key]: e.target.value })),
                    className: `w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${editMode ? "border-white/10 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 text-white placeholder-slate-600" : "border-white/10 text-slate-300 cursor-default"} ${!profile[f.key] && !editMode ? "italic text-slate-600" : ""}`
                  }
                ),
                !editMode && !profile[f.key] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Not set" })
              ] }, f.key);
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-slate-500 font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 12 }),
                " Account ID"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  id: "profile-account-id",
                  "aria-label": "Account ID",
                  className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-500 flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: userId }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-600 flex-shrink-0", children: "Read only" })
                  ]
                }
              )
            ] })
          ] }),
          editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              className: "flex gap-3 pt-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "profile-save-btn",
                    onClick: saveEdit,
                    className: "flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
                      " Save Changes"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: cancelEdit,
                    "data-ocid": "profile-cancel-btn",
                    className: "flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-slate-300 text-sm hover:bg-white/20 transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }),
                      " Cancel"
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
const SECTION_COMPONENTS = {
  overview: DashboardOverview,
  orders: DashboardOrders,
  tracking: DashboardTracking,
  addresses: DashboardAddresses,
  coupons: DashboardCoupons,
  profile: DashboardProfile
};
function DashboardPage() {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  const SectionComponent = SECTION_COMPONENTS[activeSection];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DashboardLayout,
    {
      activeSection,
      onSectionChange: (s) => setActiveSection(s),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -8 },
          transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionComponent, {})
        },
        activeSection
      ) })
    }
  );
}
export {
  DashboardPage
};
