import { h as createLucideIcon, aw as create, r as reactExports, Q as useAdminAuth, R as useRouter, j as jsxRuntimeExports, L as Link, m as motion, q as LogOut, A as AnimatePresence, X, t as Menu, v as LayoutDashboard, P as Package, T as Tag, S as ShoppingCart, a9 as FlaskConical, ak as Users, H as Mail, x as Truck } from "./index-O-oxzsBJ.js";
import { E as ExternalLink } from "./external-link-0xBpMtII.js";
import { T as Ticket } from "./ticket-DhyR_LGt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const useAdminStore = create((set) => ({
  currentSection: "dashboard",
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentSection: (section) => set({ currentSection: section })
}));
const CORE_NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 18 }),
    path: "/admin/dashboard"
  },
  {
    id: "products",
    label: "Products",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 18 }),
    path: "/admin/products"
  },
  {
    id: "categories",
    label: "Categories",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 18 }),
    path: "/admin/categories"
  },
  {
    id: "orders",
    label: "Orders",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 18 }),
    path: "/admin/orders"
  },
  {
    id: "lab-setup",
    label: "Lab Setup",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { size: 18 }),
    path: "/admin/lab-setup"
  },
  {
    id: "coupons",
    label: "Coupons",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { size: 18 }),
    path: "/admin/coupons"
  },
  {
    id: "users",
    label: "Users",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18 }),
    path: "/admin/users"
  },
  {
    id: "blog",
    label: "Blog / CMS",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 18 }),
    path: "/admin/blog"
  },
  {
    id: "banners",
    label: "Banners & Popups",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 18 }),
    path: "/admin/banners"
  },
  {
    id: "enquiries",
    label: "Enquiries & Leads",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 18 }),
    path: "/admin/enquiries"
  },
  {
    id: "media",
    label: "Media Library",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { size: 18 }),
    path: "/admin/media"
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 18 }),
    path: "/admin/shipping"
  },
  {
    id: "export",
    label: "Export Data",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 18 }),
    path: "/admin/export"
  },
  {
    id: "email",
    label: "Email Automation",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 }),
    path: "/admin/email"
  }
];
const FUTURE_NAV = [];
function AdminLayout({ children }) {
  var _a;
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const { adminUser, logout } = useAdminAuth();
  const { currentSection } = useAdminStore();
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  function getActiveId() {
    const allNav = [...CORE_NAV, ...FUTURE_NAV];
    const match = allNav.find((n) => n.path === currentPath);
    return (match == null ? void 0 : match.id) ?? currentSection;
  }
  const activeId = getActiveId();
  async function handleLogout() {
    await logout();
    router.navigate({ to: "/admin/login" });
  }
  const sidebarContent = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full w-[260px]",
      style: {
        background: "linear-gradient(180deg, oklch(0.11 0.04 243) 0%, oklch(0.08 0.03 250) 100%)",
        borderRight: "1px solid oklch(0.22 0.05 243 / 0.5)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-5 border-b border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0",
              style: {
                background: "linear-gradient(135deg, oklch(0.45 0.12 243), oklch(0.7 0.13 195))"
              },
              children: "T"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-white tracking-wide", children: "Tinkro" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded",
                style: {
                  background: "oklch(0.71 0.17 48 / 0.2)",
                  color: "oklch(0.88 0.12 48)",
                  border: "1px solid oklch(0.71 0.17 48 / 0.3)"
                },
                children: "ADMIN"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 px-3 py-4 space-y-0.5 overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25", children: "Core Modules" }),
          CORE_NAV.map((item) => {
            const isActive = activeId === item.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: item.path,
                "data-ocid": `admin-nav-${item.id}`,
                onClick: () => setMobileOpen(false),
                className: "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group no-underline",
                style: isActive ? {
                  background: "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.18), oklch(0.76 0.16 72 / 0.10))",
                  color: "oklch(0.90 0.10 48)",
                  boxShadow: "0 0 14px oklch(0.71 0.17 48 / 0.12)"
                } : { color: "oklch(0.60 0.02 243)" },
                children: [
                  isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      layoutId: "admin-active-bar",
                      className: "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full",
                      style: {
                        background: "linear-gradient(180deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                        boxShadow: "0 0 8px oklch(0.71 0.17 48 / 0.7)"
                      }
                    }
                  ),
                  !isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                      style: { background: "oklch(0.45 0.12 243 / 0.10)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `relative z-10 transition-colors duration-200 ${isActive ? "text-orange-400" : "text-white/35 group-hover:text-white/65"}`,
                      children: item.icon
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: item.label })
                ]
              },
              item.id
            );
          }),
          FUTURE_NAV.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/20", children: "Coming Soon" }) }),
            FUTURE_NAV.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium opacity-35 cursor-not-allowed select-none",
                style: { color: "oklch(0.55 0.02 243)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/25", children: item.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
                ]
              },
              item.id
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-4 pt-2 border-t border-white/5 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/",
              className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border",
              style: {
                background: "oklch(0.14 0.03 243 / 0.5)",
                borderColor: "oklch(0.25 0.05 243 / 0.35)",
                color: "oklch(0.55 0.04 243)"
              },
              "data-ocid": "admin-sidebar-view-website",
              "aria-label": "View public website",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View Website" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-2.5 rounded-lg",
              style: { background: "oklch(0.15 0.03 243 / 0.6)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 uppercase tracking-widest mb-0.5", children: "Signed in as" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/70 truncate font-medium", children: (adminUser == null ? void 0 : adminUser.displayName) || (adminUser == null ? void 0 : adminUser.email) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-semibold capitalize mt-0.5",
                    style: { color: "oklch(0.75 0.14 195)" },
                    children: adminUser == null ? void 0 : adminUser.role
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "admin-logout",
              onClick: handleLogout,
              className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LogOut,
                  {
                    size: 18,
                    className: "group-hover:text-red-400 transition-colors"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign Out" })
              ]
            }
          )
        ] })
      ]
    }
  );
  const breadcrumbLabel = ((_a = CORE_NAV.find((n) => n.id === activeId)) == null ? void 0 : _a.label) ?? "Admin";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex",
      style: {
        background: "linear-gradient(135deg, oklch(0.09 0.03 250) 0%, oklch(0.07 0.02 243) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:flex flex-col shrink-0", children: sidebarContent }),
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
            },
            "overlay"
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
                sidebarContent
              ]
            },
            "drawer"
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "header",
            {
              className: "flex items-center justify-between px-4 md:px-6 py-3.5 border-b",
              style: {
                background: "oklch(0.11 0.04 243 / 0.85)",
                borderColor: "oklch(0.22 0.05 243 / 0.4)",
                backdropFilter: "blur(12px)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "admin-mobile-menu",
                      onClick: () => setMobileOpen(true),
                      className: "lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 20 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "Admin" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/20", children: "/" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-semibold",
                        style: { color: "oklch(0.88 0.10 48)" },
                        children: breadcrumbLabel
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: "/",
                      className: "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                      style: {
                        background: "oklch(0.16 0.04 243 / 0.6)",
                        borderColor: "oklch(0.30 0.06 243 / 0.5)",
                        color: "oklch(0.60 0.04 243)"
                      },
                      "data-ocid": "admin-view-website",
                      "aria-label": "View public website",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 }),
                        "View Website"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
                      style: {
                        background: "oklch(0.16 0.04 243 / 0.8)",
                        border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                        color: "oklch(0.70 0.05 243)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold",
                            style: {
                              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))"
                            },
                            children: ((adminUser == null ? void 0 : adminUser.displayName) || (adminUser == null ? void 0 : adminUser.email) || "A")[0].toUpperCase()
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:block truncate max-w-[140px]", children: (adminUser == null ? void 0 : adminUser.displayName) || (adminUser == null ? void 0 : adminUser.email) })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8", children })
        ] })
      ]
    }
  );
}
export {
  AdminLayout as A,
  Download as D,
  FileText as F,
  Image as I
};
