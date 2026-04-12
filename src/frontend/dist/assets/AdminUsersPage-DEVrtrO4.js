import { r as reactExports, o as ue, j as jsxRuntimeExports, m as motion, l as Badge, ak as Users, U as User, a0 as Search, P as Package, B as Button, a1 as Skeleton, H as Mail, I as Phone, N as Calendar, w as ShoppingBag, M as MapPin, X } from "./index-O-oxzsBJ.js";
import { A as AdminLayout } from "./AdminLayout-DnmFTD6u.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction, D as Dialog, h as DialogContent, i as DialogHeader, j as DialogTitle } from "./dialog-Doq3vSOq.js";
import { I as Input } from "./input-CA2Kh0PP.js";
import { L as Label } from "./label-CaWhKRKy.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D6lSXJPm.js";
import { S as Switch } from "./switch-zaxM8ZEj.js";
import { T as TrendingUp } from "./trending-up-B8aJPrG9.js";
import "./external-link-0xBpMtII.js";
import "./ticket-DhyR_LGt.js";
import "./index-Cu6viimg.js";
import "./index-IUus9vKR.js";
import "./index-CSV6Uy9i.js";
import "./index-DszSdnxd.js";
import "./chevron-up-Id0BodQe.js";
import "./index-ljXxS_F9.js";
function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatCurrency(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function getInitials(user) {
  if (user.displayName) {
    const parts = user.displayName.trim().split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : parts[0].slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}
function formatOrderDate(val) {
  if (!val) return "—";
  const d = typeof val === "string" ? new Date(val) : val.toDate();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
const ORDER_STATUS_CONFIG = {
  placed: { label: "Placed", color: "oklch(0.78 0.12 243)" },
  processing: { label: "Processing", color: "oklch(0.85 0.14 72)" },
  shipped: { label: "Shipped", color: "oklch(0.76 0.13 195)" },
  delivered: { label: "Delivered", color: "oklch(0.72 0.15 145)" },
  cancelled: { label: "Cancelled", color: "oklch(0.65 0.18 22)" }
};
const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h"
];
function SkeletonRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 border-b border-border/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-10 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-52" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 hidden sm:block" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 hidden md:block" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 hidden lg:block" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 hidden xl:block" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-12 rounded-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-lg" })
  ] });
}
function UserAvatar({
  user,
  size = "md"
}) {
  const sizeClass = size === "lg" ? "size-14 text-lg" : size === "sm" ? "size-8 text-xs" : "size-10 text-sm";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `${sizeClass} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`,
      style: {
        background: "linear-gradient(135deg, oklch(0.45 0.12 243) 0%, oklch(0.7 0.13 195) 100%)"
      },
      children: getInitials(user)
    }
  );
}
function OrderStatusBadge({ status }) {
  const cfg = ORDER_STATUS_CONFIG[status] ?? {
    label: status,
    color: "oklch(0.6 0 0)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
      style: {
        background: `${cfg.color}22`,
        color: cfg.color,
        border: `1px solid ${cfg.color}44`
      },
      children: cfg.label
    }
  );
}
function UserDetailDialog({ user, open, onClose }) {
  const [orders, setOrders] = reactExports.useState([]);
  const [loadingOrders, setLoadingOrders] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user || !open) return;
    setLoadingOrders(true);
    setOrders([]);
    getUserOrders(user.uid).then((result) => setOrders(result.slice(0, 10))).catch(() => ue.error("Failed to load orders")).finally(() => setLoadingOrders(false));
  }, [user, open]);
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[85vh] overflow-y-auto glass-card border-border/60 p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-6 border-b border-border/40",
            style: {
              background: "linear-gradient(135deg, oklch(0.45 0.12 243 / 0.08) 0%, oklch(0.7 0.13 195 / 0.06) 100%)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { user, size: "lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-semibold text-foreground", children: user.displayName ?? "No Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 13 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: user.email })
                  ] }),
                  user.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 13 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: user.phone })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Joined ",
                      formatDate(user.createdAt)
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `size-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-muted-foreground"}`
                      }
                    ),
                    user.isActive ? "Active" : "Inactive"
                  ]
                }
              ) })
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
            {
              label: "Total Orders",
              value: user.totalOrders,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16 })
            },
            {
              label: "Total Spent",
              value: formatCurrency(user.totalSpent),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16 })
            },
            {
              label: "Last Order",
              value: user.lastOrderDate ? formatDate(user.lastOrderDate) : "—",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 16 })
            }
          ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-3 text-center space-y-1",
              style: {
                background: "oklch(0.45 0.12 243 / 0.06)",
                border: "1px solid oklch(0.45 0.12 243 / 0.12)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center text-primary/70", children: stat.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: stat.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: stat.label })
              ]
            },
            stat.label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 15, className: "text-primary" }),
              "Recent Orders"
            ] }),
            loadingOrders ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["o1", "o2", "o3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, k)) }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl p-6 text-center border border-dashed border-border/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Package,
                {
                  size: 28,
                  className: "mx-auto mb-2 text-muted-foreground/40"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No orders yet" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5",
                style: {
                  background: "oklch(0.98 0 0 / 0.6)",
                  border: "1px solid oklch(0.88 0.02 243 / 0.5)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-foreground truncate", children: [
                      "#",
                      order.id.slice(0, 10),
                      "…"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatOrderDate(order.createdAt) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground flex-shrink-0", children: formatCurrency(order.total) })
                ]
              },
              order.id
            )) })
          ] }),
          user.addresses && user.addresses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 15, className: "text-primary" }),
              "Saved Addresses"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: user.addresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg px-3 py-2.5",
                style: {
                  background: "oklch(0.98 0 0 / 0.6)",
                  border: "1px solid oklch(0.88 0.02 243 / 0.5)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs px-1.5 py-0", children: addr.label }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: addr.street }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    addr.city,
                    ", ",
                    addr.state,
                    " — ",
                    addr.pincode
                  ] })
                ]
              },
              addr.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full", onClick: onClose, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14, className: "mr-1.5" }),
          " Close"
        ] }) })
      ] })
    }
  );
}
function AdminUsersPage() {
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedUser, setSelectedUser] = reactExports.useState(
    null
  );
  const [detailOpen, setDetailOpen] = reactExports.useState(false);
  const [toggleTarget, setToggleTarget] = reactExports.useState(
    null
  );
  const [confirmOpen, setConfirmOpen] = reactExports.useState(false);
  const [togglingUid, setTogglingUid] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const unsub = subscribeToUsers((data) => {
      setUsers(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  const stats = reactExports.useMemo(() => {
    const activeCount = users.filter((u) => u.isActive).length;
    const revenue = users.reduce((sum, u) => sum + (u.totalSpent ?? 0), 0);
    return { total: users.length, active: activeCount, revenue };
  }, [users]);
  const filtered = reactExports.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || (u.displayName ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || statusFilter === "active" && u.isActive || statusFilter === "inactive" && !u.isActive;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);
  const handleViewDetails = reactExports.useCallback((user) => {
    setSelectedUser(user);
    setDetailOpen(true);
  }, []);
  const handleToggleRequest = reactExports.useCallback((user) => {
    setToggleTarget(user);
    setConfirmOpen(true);
  }, []);
  const handleToggleConfirm = reactExports.useCallback(async () => {
    if (!toggleTarget) return;
    setTogglingUid(toggleTarget.uid);
    setConfirmOpen(false);
    try {
      await updateUser(toggleTarget.uid, { isActive: !toggleTarget.isActive });
      ue.success(
        `User ${toggleTarget.isActive ? "deactivated" : "activated"} successfully`
      );
    } catch {
      ue.error("Failed to update user status");
    } finally {
      setTogglingUid(null);
      setToggleTarget(null);
    }
  }, [toggleTarget]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      className: "p-6 space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "User Management" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5 text-sm", children: "Manage registered customers and their activity" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-sm px-3 py-1.5 font-medium",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14, className: "mr-1.5" }),
                stats.total,
                " users"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
          {
            label: "Total Users",
            value: stats.total,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 }),
            gradient: "oklch(0.45 0.12 243 / 0.1)",
            border: "oklch(0.45 0.12 243 / 0.2)"
          },
          {
            label: "Active Users",
            value: stats.active,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 20 }),
            gradient: "oklch(0.55 0.15 145 / 0.1)",
            border: "oklch(0.55 0.15 145 / 0.2)"
          },
          {
            label: "Total Revenue",
            value: formatCurrency(stats.revenue),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20 }),
            gradient: "oklch(0.71 0.17 48 / 0.1)",
            border: "oklch(0.71 0.17 48 / 0.2)"
          }
        ].map((card, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: idx * 0.08, duration: 0.35 },
            className: "rounded-xl p-5 glass-card",
            style: { background: card.gradient, borderColor: card.border },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: card.icon }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: card.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: card.label })
            ]
          },
          card.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Search,
              {
                size: 15,
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search by name or email…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-9 bg-card border-border/60",
                "data-ocid": "users-search"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: statusFilter,
              onValueChange: (v) => setStatusFilter(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-40 bg-card border-border/60",
                    "data-ocid": "users-status-filter",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Users" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden glass-card border border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_auto] gap-3 px-4 py-3 border-b border-border/40 bg-muted/30", children: ["User", "Phone", "Orders", "Spent", "Joined", "Status", ""].map(
            (col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                children: col
              },
              col
            )
          ) }),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: SKELETON_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}, key)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 px-4 text-center",
              "data-ocid": "users-empty-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 40, className: "text-muted-foreground/30 mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground", children: search || statusFilter !== "all" ? "No matching users" : "No users yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: search || statusFilter !== "all" ? "Try adjusting your search or filter." : "Users will appear here once they register." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "users-list", children: filtered.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: idx * 0.03, duration: 0.25 },
              className: "grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_auto] gap-3 items-center px-4 py-3 border-b border-border/30 hover:bg-primary/5 transition-colors group",
              "data-ocid": `user-row-${user.uid}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserAvatar, { user }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: user.displayName ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "No Name" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: user.email })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: user.phone ?? "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 12, className: "text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: user.totalOrders })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: formatCurrency(user.totalSpent) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDate(user.createdAt) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2",
                    "data-ocid": `user-toggle-${user.uid}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `hidden md:inline-flex items-center gap-1 text-xs ${user.isActive ? "text-emerald-600" : "text-muted-foreground"}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: `size-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-muted-foreground/50"}`
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: `switch-${user.uid}`, className: "sr-only", children: [
                        "Toggle active status for ",
                        user.email
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          id: `switch-${user.uid}`,
                          checked: user.isActive,
                          disabled: togglingUid === user.uid,
                          onCheckedChange: () => handleToggleRequest(user)
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "text-xs h-8 border-border/60 hover:border-primary/50 hover:text-primary",
                    onClick: () => handleViewDetails(user),
                    "data-ocid": `user-view-${user.uid}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12, className: "mr-1" }),
                      "Details"
                    ]
                  }
                )
              ]
            },
            user.uid
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserDetailDialog,
          {
            user: selectedUser,
            open: detailOpen,
            onClose: () => {
              setDetailOpen(false);
              setSelectedUser(null);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmOpen, onOpenChange: setConfirmOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "glass-card border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: (toggleTarget == null ? void 0 : toggleTarget.isActive) ? "Deactivate User?" : "Activate User?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: (toggleTarget == null ? void 0 : toggleTarget.isActive) ? `This will deactivate ${toggleTarget == null ? void 0 : toggleTarget.email}. They will not be able to log in.` : `This will activate ${toggleTarget == null ? void 0 : toggleTarget.email} and restore their access.` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { onClick: () => setToggleTarget(null), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleToggleConfirm,
                className: (toggleTarget == null ? void 0 : toggleTarget.isActive) ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "gradient-primary text-white",
                "data-ocid": "user-toggle-confirm",
                children: (toggleTarget == null ? void 0 : toggleTarget.isActive) ? "Deactivate" : "Activate"
              }
            )
          ] })
        ] }) })
      ]
    }
  ) });
}
export {
  AdminUsersPage as default
};
