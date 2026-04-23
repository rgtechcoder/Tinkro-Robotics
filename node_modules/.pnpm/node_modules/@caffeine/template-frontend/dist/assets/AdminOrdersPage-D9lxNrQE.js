import { k as createLucideIcon, r as reactExports, x as ue, j as jsxRuntimeExports, m as motion, ag as Search, S as ShoppingCart, t as Badge, B as Button, ao as ChevronLeft, q as ChevronRight, ah as Skeleton, Q as Check, A as AnimatePresence, X, M as MapPin, H as Truck, P as Package } from "./index-BSySFNaW.js";
import { A as AdminLayout } from "./AdminLayout-2gYHCLuq.js";
import { I as Input } from "./input-WvrEKfGt.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DYWDmQv_.js";
import { a as subscribeToAllOrders, i as updateOrderStatus } from "./adminService-C_DVe4vg.js";
import { E as Eye } from "./eye-FTLbX1Rh.js";
import "./external-link-BGGFFOjs.js";
import "./ticket-BmOHArP0.js";
import "./index-BEKNyHJC.js";
import "./Combination-uBPLZVtz.js";
import "./index-CJTyfxIJ.js";
import "./chevron-up-D7f72QkX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2", key: "4jdomd" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4", key: "3hqy98" }],
  ["path", { d: "M21 14H11", key: "1bme5i" }],
  ["path", { d: "m15 10-4 4 4 4", key: "5dvupr" }]
];
const ClipboardCopy = createLucideIcon("clipboard-copy", __iconNode);
function formatDate(val) {
  if (!val) return "—";
  const d = typeof val === "string" ? new Date(val) : val.toDate();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatCurrency(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function truncateId(id) {
  return id.length > 12 ? `#${id.slice(0, 8)}…` : `#${id}`;
}
const STATUS_CONFIG = {
  placed: {
    label: "Placed",
    bg: "oklch(0.35 0.12 243 / 0.3)",
    color: "oklch(0.78 0.12 243)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 11 })
  },
  processing: {
    label: "Processing",
    bg: "oklch(0.40 0.14 72 / 0.3)",
    color: "oklch(0.85 0.14 72)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 11 })
  },
  shipped: {
    label: "Shipped",
    bg: "oklch(0.35 0.10 195 / 0.3)",
    color: "oklch(0.76 0.13 195)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 11 })
  },
  delivered: {
    label: "Delivered",
    bg: "oklch(0.30 0.10 145 / 0.3)",
    color: "oklch(0.72 0.14 145)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 11 })
  }
};
const TIMELINE_STEPS = [
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" }
];
function getStepIndex(status) {
  return TIMELINE_STEPS.findIndex((s) => s.key === status);
}
function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.placed;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
      style: { background: cfg.bg, color: cfg.color },
      children: [
        cfg.icon,
        cfg.label
      ]
    }
  );
}
function CopyableId({
  id,
  truncate = false
}) {
  const [copied, setCopied] = reactExports.useState(false);
  function handleCopy() {
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: handleCopy,
      title: "Click to copy",
      className: "inline-flex items-center gap-1.5 group cursor-pointer",
      "data-ocid": "copy-order-id",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-xs",
            style: { color: "oklch(0.70 0.08 243)" },
            children: truncate ? truncateId(id) : `#${id}`
          }
        ),
        copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12, className: "text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          ClipboardCopy,
          {
            size: 12,
            className: "opacity-0 group-hover:opacity-60 transition-opacity",
            style: { color: "oklch(0.70 0.08 243)" }
          }
        )
      ]
    }
  );
}
function SkeletonRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["col1", "col2", "col3", "col4", "col5", "col6", "col7"].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Skeleton,
    {
      className: "h-4 w-full rounded",
      style: { background: "oklch(0.20 0.03 243 / 0.6)" }
    }
  ) }, col)) });
}
function OrderTimeline({ status }) {
  const activeIdx = getStepIndex(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0", children: TIMELINE_STEPS.map((step, i) => {
    const done = i <= activeIdx;
    const isCurrent = i === activeIdx;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
            style: done ? isCurrent ? {
              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
              boxShadow: "0 0 10px oklch(0.71 0.17 48 / 0.5)",
              color: "white"
            } : {
              background: "oklch(0.45 0.10 145 / 0.7)",
              color: "oklch(0.80 0.14 145)"
            } : {
              background: "oklch(0.18 0.03 243)",
              color: "oklch(0.40 0.04 243)"
            },
            children: done && !isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13 }) : i + 1
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] mt-1 font-medium whitespace-nowrap",
            style: {
              color: done ? "oklch(0.78 0.06 243)" : "oklch(0.38 0.03 243)"
            },
            children: step.label
          }
        )
      ] }),
      i < TIMELINE_STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-0.5 flex-1 mx-1 rounded transition-all",
          style: {
            background: i < activeIdx ? "oklch(0.45 0.10 145 / 0.5)" : "oklch(0.18 0.03 243)"
          }
        }
      )
    ] }, step.key);
  }) });
}
function OrderDetailDrawer({ order, onClose }) {
  const [newStatus, setNewStatus] = reactExports.useState("");
  const [trackingId, setTrackingId] = reactExports.useState("");
  const [estimatedDelivery, setEstimatedDelivery] = reactExports.useState("");
  const [updatingStatus, setUpdatingStatus] = reactExports.useState(false);
  const [savingTracking, setSavingTracking] = reactExports.useState(false);
  const orderId = order == null ? void 0 : order.id;
  const orderStatus = (order == null ? void 0 : order.status) ?? "";
  const orderTrackingId = (order == null ? void 0 : order.trackingId) ?? "";
  const orderEstimatedDelivery = (order == null ? void 0 : order.estimatedDelivery) ?? "";
  reactExports.useEffect(() => {
    if (orderId) {
      setNewStatus(orderStatus);
      setTrackingId(orderTrackingId);
      setEstimatedDelivery(orderEstimatedDelivery);
    }
  }, [orderId, orderStatus, orderTrackingId, orderEstimatedDelivery]);
  async function handleStatusUpdate() {
    if (!order || !newStatus) return;
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(
        order.id,
        newStatus
      );
      ue.success("Order status updated successfully");
    } catch {
      ue.error("Failed to update order. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  }
  async function handleSaveTracking() {
    if (!order) return;
    setSavingTracking(true);
    try {
      await updateOrderStatus(
        order.id,
        newStatus || order.status,
        trackingId,
        estimatedDelivery
      );
      ue.success("Tracking info saved");
    } catch {
      ue.error("Failed to save tracking info. Please try again.");
    } finally {
      setSavingTracking(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: order && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
        className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm",
        onClick: onClose
      },
      "drawer-overlay"
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.aside,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { type: "spring", stiffness: 280, damping: 30 },
        className: "fixed inset-y-0 right-0 z-50 w-full max-w-[520px] flex flex-col overflow-y-auto",
        style: {
          background: "linear-gradient(180deg, oklch(0.11 0.04 243) 0%, oklch(0.09 0.03 250) 100%)",
          borderLeft: "1px solid oklch(0.22 0.05 243 / 0.5)"
        },
        "data-ocid": "order-detail-drawer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10",
              style: {
                background: "oklch(0.11 0.04 243 / 0.95)",
                borderColor: "oklch(0.22 0.05 243 / 0.4)",
                backdropFilter: "blur(12px)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-white", children: "Order Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CopyableId, { id: order.id })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all",
                    "data-ocid": "drawer-close",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-5 py-5 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                className: "rounded-xl p-4 space-y-2.5",
                style: {
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest",
                      style: { color: "oklch(0.55 0.05 243)" },
                      children: "Order Info"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Date", value: formatDate(order.createdAt) }),
                  order.razorpayPaymentId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      label: "Payment ID",
                      value: order.razorpayPaymentId,
                      mono: true
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      label: "Customer",
                      value: order.customerEmail ?? order.userId,
                      mono: true
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40", children: "Status" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: order.status })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                className: "rounded-xl p-4",
                style: {
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest mb-4",
                      style: { color: "oklch(0.55 0.05 243)" },
                      children: "Order Timeline"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(OrderTimeline, { status: order.status })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                className: "rounded-xl p-4",
                style: {
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest mb-3",
                      style: { color: "oklch(0.55 0.05 243)" },
                      children: "Items"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-3 py-1.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: item.image,
                            alt: item.name,
                            className: "w-9 h-9 rounded-lg object-cover shrink-0",
                            style: {
                              border: "1px solid oklch(0.22 0.05 243 / 0.3)"
                            },
                            onError: (e) => {
                              e.target.src = "/assets/images/placeholder.svg";
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/80 font-medium truncate", children: item.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-white/35", children: [
                            formatCurrency(item.price),
                            " × ",
                            item.quantity
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-xs font-semibold",
                            style: { color: "oklch(0.85 0.12 72)" },
                            children: formatCurrency(item.price * item.quantity)
                          }
                        )
                      ]
                    },
                    item.productId
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "mt-3 pt-3 space-y-1.5",
                      style: { borderTop: "1px solid oklch(0.22 0.05 243 / 0.3)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-white/40", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCurrency(order.subtotal ?? order.total) })
                        ] }),
                        order.discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "flex justify-between text-xs",
                            style: { color: "oklch(0.72 0.14 145)" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                "Discount",
                                order.coupon ? ` (${order.coupon})` : ""
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                "−",
                                formatCurrency(order.discount)
                              ] })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-bold text-white pt-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.85 0.14 72)" }, children: formatCurrency(order.total) })
                        ] })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                className: "rounded-xl p-4",
                style: {
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "h3",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5",
                      style: { color: "oklch(0.55 0.05 243)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                        " Delivery Address"
                      ]
                    }
                  ),
                  order.address ? /* @__PURE__ */ jsxRuntimeExports.jsxs("address", { className: "not-italic text-xs leading-relaxed text-white/60 space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white/80", children: order.address.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: order.address.line1 }),
                    order.address.line2 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: order.address.line2 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      order.address.city,
                      ", ",
                      order.address.state,
                      " —",
                      " ",
                      order.address.pincode
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      "📞 ",
                      order.address.phone
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/30", children: "No address on file" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                className: "rounded-xl p-4 space-y-3",
                style: {
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest",
                      style: { color: "oklch(0.55 0.05 243)" },
                      children: "Update Status"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newStatus, onValueChange: setNewStatus, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "order-status-select",
                        className: "text-sm border-slate-700/50",
                        style: {
                          background: "oklch(0.13 0.03 243 / 0.8)",
                          color: "white"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select status" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectContent,
                      {
                        style: {
                          background: "oklch(0.13 0.03 243)",
                          border: "1px solid oklch(0.22 0.05 243 / 0.5)"
                        },
                        children: ["placed", "processing", "shipped", "delivered"].map(
                          (s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectItem,
                            {
                              value: s,
                              className: "text-white/80 capitalize",
                              children: s.charAt(0).toUpperCase() + s.slice(1)
                            },
                            s
                          )
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: updatingStatus || newStatus === order.status,
                      onClick: () => void handleStatusUpdate(),
                      "data-ocid": "update-order-status",
                      className: "w-full py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                        boxShadow: "0 0 12px oklch(0.71 0.17 48 / 0.3)"
                      },
                      children: updatingStatus ? "Updating…" : "Update Status"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "section",
              {
                className: "rounded-xl p-4 space-y-3",
                style: {
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest",
                      style: { color: "oklch(0.55 0.05 243)" },
                      children: "Tracking Info"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "tracking-id",
                          className: "text-[11px] text-white/40 mb-1 block",
                          children: "Tracking ID"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "tracking-id",
                          value: trackingId,
                          onChange: (e) => setTrackingId(e.target.value),
                          placeholder: "Enter tracking ID",
                          "data-ocid": "tracking-id-input",
                          className: "text-sm border-slate-700/50 text-white placeholder:text-white/20",
                          style: { background: "oklch(0.13 0.03 243 / 0.8)" }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "estimated-delivery",
                          className: "text-[11px] text-white/40 mb-1 block",
                          children: "Estimated Delivery"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "estimated-delivery",
                          type: "date",
                          value: estimatedDelivery,
                          onChange: (e) => setEstimatedDelivery(e.target.value),
                          "data-ocid": "estimated-delivery-input",
                          className: "text-sm border-slate-700/50 text-white",
                          style: {
                            background: "oklch(0.13 0.03 243 / 0.8)",
                            colorScheme: "dark"
                          }
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: savingTracking,
                      onClick: () => void handleSaveTracking(),
                      "data-ocid": "save-tracking-info",
                      className: "w-full py-2 rounded-lg text-sm font-semibold text-white/80 border transition-all disabled:opacity-50 hover:text-white",
                      style: {
                        border: "1px solid oklch(0.71 0.17 48 / 0.4)",
                        background: "oklch(0.71 0.17 48 / 0.08)"
                      },
                      children: savingTracking ? "Saving…" : "Save Tracking Info"
                    }
                  )
                ]
              }
            )
          ] })
        ]
      },
      "drawer-panel"
    )
  ] }) });
}
function InfoRow({
  label,
  value,
  mono = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40 shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `text-xs text-white/70 text-right truncate ${mono ? "font-mono" : ""}`,
        children: value
      }
    )
  ] });
}
const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" }
];
const PAGE_SIZE = 20;
function AdminOrdersPage() {
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const [rowStatus, setRowStatus] = reactExports.useState({});
  const [rowUpdating, setRowUpdating] = reactExports.useState(null);
  const searchRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const unsub = subscribeToAllOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    setRowStatus((prev) => {
      const next = { ...prev };
      orders.forEach((order) => {
        const current = next[order.id];
        if (!current || current !== order.status) {
          next[order.id] = order.status;
        }
      });
      return next;
    });
  }, [orders]);
  const tabCounts = reactExports.useMemo(() => {
    const counts = { all: orders.length };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    }
    return counts;
  }, [orders]);
  const filterKey = `${activeTab}::${search}`;
  const prevFilterKeyRef = reactExports.useRef(filterKey);
  if (prevFilterKeyRef.current !== filterKey) {
    prevFilterKeyRef.current = filterKey;
    setPage(1);
  }
  const filtered = reactExports.useMemo(() => {
    let list = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) => o.id.toLowerCase().includes(q) || o.userId.toLowerCase().includes(q) || (o.customerEmail ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, activeTab, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleTabChange = reactExports.useCallback((tab) => {
    setActiveTab(tab);
  }, []);
  const handleQuickStatusUpdate = reactExports.useCallback(async (order) => {
    const nextStatus = rowStatus[order.id] ?? order.status;
    if (nextStatus === order.status) return;
    setRowUpdating(order.id);
    try {
      await updateOrderStatus(order.id, nextStatus);
      ue.success("Order status updated");
    } catch {
      ue.error("Failed to update order. Please try again.");
    } finally {
      setRowUpdating(null);
    }
  }, [rowStatus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin-orders-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-white", children: "Orders" }),
              !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-2 py-0.5 rounded-full text-xs font-bold",
                  style: {
                    background: "oklch(0.71 0.17 48 / 0.2)",
                    color: "oklch(0.88 0.12 48)"
                  },
                  children: orders.length
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Search,
                {
                  size: 14,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ref: searchRef,
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search by order ID or customer…",
                  "data-ocid": "orders-search",
                  className: "pl-9 pr-4 py-2 w-full sm:w-64 text-sm border-slate-700/50 text-white placeholder:text-white/20",
                  style: { background: "oklch(0.13 0.03 243 / 0.8)" }
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, delay: 0.05 },
          className: "flex flex-wrap gap-2",
          role: "tablist",
          "aria-label": "Filter orders by status",
          children: FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = tabCounts[tab.key] ?? 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": isActive,
                onClick: () => handleTabChange(tab.key),
                "data-ocid": `orders-tab-${tab.key}`,
                className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                style: isActive ? {
                  background: "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.25), oklch(0.76 0.16 72 / 0.15))",
                  color: "oklch(0.90 0.12 48)",
                  border: "1px solid oklch(0.71 0.17 48 / 0.4)",
                  boxShadow: "0 0 10px oklch(0.71 0.17 48 / 0.15)"
                } : {
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  color: "oklch(0.55 0.03 243)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)"
                },
                children: [
                  tab.label,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-1.5 py-0 rounded-full text-[10px] font-bold",
                      style: isActive ? {
                        background: "oklch(0.71 0.17 48 / 0.3)",
                        color: "oklch(0.92 0.12 48)"
                      } : {
                        background: "oklch(0.20 0.03 243)",
                        color: "oklch(0.45 0.03 243)"
                      },
                      children: count
                    }
                  )
                ]
              },
              tab.key
            );
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay: 0.1 },
          className: "rounded-2xl overflow-hidden",
          style: {
            background: "oklch(0.12 0.03 243 / 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "tr",
                {
                  style: {
                    borderBottom: "1px solid oklch(0.22 0.05 243 / 0.35)"
                  },
                  children: [
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                    "Action"
                  ].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest",
                      style: { color: "oklch(0.45 0.05 243)" },
                      children: col
                    },
                    col
                  ))
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {})
              ] }) : paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "inline-flex flex-col items-center gap-3",
                  "data-ocid": "orders-empty-state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-14 h-14 rounded-full flex items-center justify-center",
                        style: { background: "oklch(0.18 0.03 243)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ShoppingCart,
                          {
                            size: 24,
                            style: { color: "oklch(0.40 0.05 243)" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white/40", children: search ? "No orders match your search" : `No ${activeTab === "all" ? "" : activeTab} orders yet` }),
                    search && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setSearch(""),
                        className: "text-xs font-medium hover:underline",
                        style: { color: "oklch(0.71 0.17 48)" },
                        children: "Clear search"
                      }
                    )
                  ]
                }
              ) }) }) : paginated.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.tr,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 0.2, delay: i * 0.03 },
                  className: "group transition-colors duration-150 cursor-pointer",
                  style: {
                    borderBottom: "1px solid oklch(0.18 0.03 243 / 0.6)"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "oklch(0.15 0.03 243 / 0.4)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "transparent";
                  },
                  onClick: () => setSelectedOrder(order),
                  "data-ocid": `order-row-${order.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CopyableId, { id: order.id, truncate: true }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/60 truncate max-w-[160px] block", children: order.customerEmail ?? order.userId }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        className: "text-[11px] font-medium",
                        style: {
                          background: "oklch(0.20 0.04 243)",
                          color: "oklch(0.65 0.06 243)",
                          border: "1px solid oklch(0.25 0.05 243 / 0.4)"
                        },
                        children: [
                          order.items.reduce((s, it) => s + it.quantity, 0),
                          " ",
                          "items"
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-semibold",
                        style: { color: "oklch(0.85 0.14 72)" },
                        children: formatCurrency(order.total)
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: order.status }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40", children: formatDate(order.createdAt) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-2",
                        onClick: (e) => e.stopPropagation(),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Select,
                            {
                              value: rowStatus[order.id] ?? order.status,
                              onValueChange: (value) => setRowStatus((prev) => ({
                                ...prev,
                                [order.id]: value
                              })),
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectTrigger,
                                  {
                                    "data-ocid": `order-row-status-${order.id}`,
                                    className: "h-8 w-[132px] text-xs border-slate-700/50",
                                    style: {
                                      background: "oklch(0.13 0.03 243 / 0.8)",
                                      color: "white"
                                    },
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectContent,
                                  {
                                    style: {
                                      background: "oklch(0.13 0.03 243)",
                                      border: "1px solid oklch(0.22 0.05 243 / 0.5)"
                                    },
                                    children: [
                                      "placed",
                                      "processing",
                                      "shipped",
                                      "delivered"
                                    ].map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      SelectItem,
                                      {
                                        value: status,
                                        className: "text-white/80 capitalize",
                                        children: status.charAt(0).toUpperCase() + status.slice(1)
                                      },
                                      status
                                    ))
                                  }
                                )
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => void handleQuickStatusUpdate(order),
                              disabled: rowUpdating === order.id || (rowStatus[order.id] ?? order.status) === order.status,
                              "data-ocid": `order-row-update-${order.id}`,
                              className: "h-8 px-3 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50",
                              style: {
                                background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                                boxShadow: "0 0 10px oklch(0.71 0.17 48 / 0.3)"
                              },
                              children: rowUpdating === order.id ? "Saving…" : "Update"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setSelectedOrder(order),
                              className: "p-1.5 rounded-lg transition-all",
                              style: { color: "oklch(0.55 0.05 243)" },
                              "aria-label": "View order details",
                              "data-ocid": `view-order-${order.id}`,
                              onMouseEnter: (e) => {
                                e.currentTarget.style.background = "oklch(0.71 0.17 48 / 0.15)";
                                e.currentTarget.style.color = "oklch(0.85 0.14 48)";
                              },
                              onMouseLeave: (e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "oklch(0.55 0.05 243)";
                              },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 15 })
                            }
                          )
                        ]
                      }
                    ) })
                  ]
                },
                order.id
              )) })
            ] }) }),
            !loading && totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-4 py-3",
                style: { borderTop: "1px solid oklch(0.18 0.03 243 / 0.6)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-white/30", children: [
                    "Showing ",
                    (page - 1) * PAGE_SIZE + 1,
                    "–",
                    Math.min(page * PAGE_SIZE, filtered.length),
                    " of",
                    " ",
                    filtered.length
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        disabled: page === 1,
                        onClick: () => setPage((p) => p - 1),
                        "data-ocid": "orders-prev-page",
                        className: "h-7 w-7 text-white/40 hover:text-white disabled:opacity-30",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 })
                      }
                    ),
                    Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const pageNum = i + 1;
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setPage(pageNum),
                          "data-ocid": `orders-page-${pageNum}`,
                          className: "h-7 w-7 rounded-md text-xs font-medium transition-all",
                          style: page === pageNum ? {
                            background: "oklch(0.71 0.17 48 / 0.25)",
                            color: "oklch(0.90 0.12 48)"
                          } : { color: "oklch(0.50 0.04 243)" },
                          children: pageNum
                        },
                        pageNum
                      );
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        disabled: page === totalPages,
                        onClick: () => setPage((p) => p + 1),
                        "data-ocid": "orders-next-page",
                        className: "h-7 w-7 text-white/40 hover:text-white disabled:opacity-30",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrderDetailDrawer,
      {
        order: selectedOrder,
        onClose: () => setSelectedOrder(null)
      }
    )
  ] });
}
export {
  AdminOrdersPage as default
};
