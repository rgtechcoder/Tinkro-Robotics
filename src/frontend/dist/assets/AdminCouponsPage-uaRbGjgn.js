import { k as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, B as Button, T as Tag, ag as Search, A as AnimatePresence, x as ue, t as Badge } from "./index-BSySFNaW.js";
import { A as AdminLayout } from "./AdminLayout-2gYHCLuq.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction, D as Dialog, h as DialogContent, i as DialogHeader, j as DialogTitle } from "./dialog-vtjwttq7.js";
import { I as Input } from "./input-WvrEKfGt.js";
import { L as Label } from "./label-S94IPwXu.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DYWDmQv_.js";
import { S as Switch, T as Textarea } from "./textarea-DyCuiXHu.js";
import { s as subscribeToCoupons, z as updateCoupon, A as deleteCoupon, B as addCoupon } from "./adminService-C_DVe4vg.js";
import { P as Plus } from "./plus-BF_zKn_b.js";
import { P as Pencil } from "./pencil-BAiZLvDM.js";
import { T as Trash2 } from "./trash-2-BR965pIM.js";
import "./external-link-BGGFFOjs.js";
import "./ticket-BmOHArP0.js";
import "./index-B2YutIn3.js";
import "./Combination-uBPLZVtz.js";
import "./index-BEKNyHJC.js";
import "./index-CJTyfxIJ.js";
import "./chevron-up-D7f72QkX.js";
import "./index-CCeh3MPJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19", key: "1x9vlm" }],
  ["circle", { cx: "6.5", cy: "6.5", r: "2.5", key: "4mh3h7" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "2.5", key: "1mdrzq" }]
];
const Percent = createLucideIcon("percent", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
      key: "1l48ns"
    }
  ],
  ["path", { d: "M9 9h.01", key: "1q5me6" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "M15 15h.01", key: "lqbp3k" }]
];
const TicketPercent = createLucideIcon("ticket-percent", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
function isExpired(expiresAt) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < /* @__PURE__ */ new Date();
}
function formatExpiry(expiresAt) {
  if (!expiresAt) return "No Expiry";
  return new Date(expiresAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatDiscount(coupon) {
  return coupon.discountType === "percent" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`;
}
function getCouponStatus(coupon) {
  if (isExpired(coupon.expiresAt)) return "expired";
  return coupon.isActive ? "active" : "inactive";
}
function validateForm(values) {
  const errors = {};
  if (!values.code.trim()) {
    errors.code = "Coupon code is required";
  }
  const val = Number(values.discountValue);
  if (!values.discountValue || Number.isNaN(val) || val <= 0) {
    errors.discountValue = "Must be a positive number";
  } else if (values.discountType === "percent" && val > 100) {
    errors.discountValue = "Percent discount must be 1–100";
  }
  return errors;
}
const DEFAULT_FORM = {
  code: "",
  discountType: "percent",
  discountValue: "10",
  minOrderAmount: "0",
  usageLimit: "0",
  expiresAt: "",
  description: "",
  isActive: true,
  audience: "all",
  activityDays: "60",
  oneTimePerUser: true
};
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e"];
function SkeletonRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-24 animate-pulse rounded-md bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-20 animate-pulse rounded-md bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-16 animate-pulse rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-16 animate-pulse rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-20 animate-pulse rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-pulse rounded-lg bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-pulse rounded-lg bg-muted" })
    ] })
  ] });
}
function StatsCard({ label, value, icon, accent = "blue" }) {
  const accentClasses = {
    blue: "from-primary/20 to-primary/5 border-primary/20",
    green: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    red: "from-destructive/20 to-destructive/5 border-destructive/20"
  };
  const iconClasses = {
    blue: "text-primary",
    green: "text-emerald-500",
    red: "text-destructive"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-xl border bg-gradient-to-br p-5 backdrop-blur-sm ${accentClasses[accent]}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: iconClasses[accent], children: icon })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-foreground", children: value })
      ]
    }
  );
}
function CouponRow({ coupon, onEdit, onDelete, onToggle }) {
  const status = getCouponStatus(coupon);
  const statusStyles = {
    active: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    inactive: "bg-muted text-muted-foreground border-border",
    expired: "bg-destructive/15 text-destructive border-destructive/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
      className: "flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm transition-colors hover:bg-card/80",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-[120px] items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4 shrink-0 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold uppercase tracking-widest text-foreground", children: coupon.code })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: "border border-primary/30 bg-primary/10 font-semibold text-primary",
            variant: "outline",
            children: formatDiscount(coupon)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: `border text-xs font-medium ${statusStyles[status]}`,
            variant: "outline",
            children: `${status.charAt(0).toUpperCase()}${status.slice(1)}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3.5 w-3.5" }),
            `Min ₹${coupon.minOrderAmount}`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
            formatExpiry(coupon.expiresAt)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-3.5 w-3.5" }),
            `${coupon.usedCount}/${coupon.usageLimit === 0 ? "∞" : coupon.usageLimit}`
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: `switch-${coupon.id}`,
              checked: coupon.isActive,
              disabled: status === "expired",
              onCheckedChange: () => onToggle(coupon)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `switch-${coupon.id}`, className: "sr-only", children: `Toggle ${coupon.code}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "h-8 w-8 hover:bg-primary/10 hover:text-primary",
              onClick: () => onEdit(coupon),
              "aria-label": `Edit ${coupon.code}`,
              "data-ocid": "coupon-edit-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "h-8 w-8 hover:bg-destructive/10 hover:text-destructive",
              onClick: () => onDelete(coupon),
              "aria-label": `Delete ${coupon.code}`,
              "data-ocid": "coupon-delete-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ]
    }
  );
}
function CouponDialog({ open, editTarget, onClose }) {
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(DEFAULT_FORM);
  const [errors, setErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (!open) return;
    if (editTarget) {
      setForm({
        code: editTarget.code,
        discountType: editTarget.discountType,
        discountValue: String(editTarget.discountValue),
        minOrderAmount: String(editTarget.minOrderAmount),
        usageLimit: String(editTarget.usageLimit),
        expiresAt: editTarget.expiresAt ?? "",
        description: editTarget.description ?? "",
        isActive: editTarget.isActive,
        audience: editTarget.audience ?? "all",
        activityDays: String(editTarget.activityDays ?? 60),
        oneTimePerUser: editTarget.oneTimePerUser ?? true
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [open, editTarget]);
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const fieldErrors = validateForm(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        usageLimit: Number(form.usageLimit) || 0,
        expiresAt: form.expiresAt || void 0,
        description: form.description || void 0,
        isActive: form.isActive,
        audience: form.audience,
        activityDays: form.audience === "active" || form.audience === "inactive" ? Number(form.activityDays) || 60 : void 0,
        oneTimePerUser: form.oneTimePerUser
      };
      if (editTarget) {
        await updateCoupon(editTarget.id, payload);
        ue.success("Coupon updated successfully");
      } else {
        await addCoupon(payload);
        ue.success("Coupon created successfully");
      }
      onClose();
    } catch {
      ue.error(
        editTarget ? "Failed to update coupon" : "Failed to create coupon"
      );
    } finally {
      setIsSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] max-w-lg overflow-y-auto border-border/60 bg-background/95 text-foreground backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-bold", children: editTarget ? "Edit Coupon" : "Create Coupon" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "mt-2 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coupon-code", children: "Coupon Code *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "coupon-code",
            value: form.code,
            onChange: (e) => handleChange("code", e.target.value.toUpperCase()),
            placeholder: "e.g. SAVE20",
            className: "bg-background/60 font-mono uppercase",
            "data-ocid": "coupon-code-input"
          }
        ),
        errors.code && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.code })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Discount Type *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.discountType,
              onValueChange: (v) => handleChange("discountType", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "bg-background/60",
                    "data-ocid": "coupon-type-select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "percent", children: "Percentage (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "flat", children: "Flat Amount (₹)" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coupon-value", children: form.discountType === "percent" ? "Discount % *" : "Discount ₹ *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "coupon-value",
              type: "number",
              value: form.discountValue,
              onChange: (e) => handleChange("discountValue", e.target.value),
              placeholder: form.discountType === "percent" ? "1–100" : "e.g. 200",
              className: "bg-background/60",
              "data-ocid": "coupon-value-input"
            }
          ),
          errors.discountValue && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.discountValue })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coupon-min", children: "Min Order Amount (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "coupon-min",
              type: "number",
              value: form.minOrderAmount,
              onChange: (e) => handleChange("minOrderAmount", e.target.value),
              placeholder: "0",
              className: "bg-background/60",
              "data-ocid": "coupon-min-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coupon-limit", children: "Usage Limit (0 = unlimited)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "coupon-limit",
              type: "number",
              value: form.usageLimit,
              onChange: (e) => handleChange("usageLimit", e.target.value),
              placeholder: "0",
              className: "bg-background/60",
              "data-ocid": "coupon-limit-input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coupon-expiry", children: "Expiry Date (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "coupon-expiry",
            type: "date",
            value: form.expiresAt,
            onChange: (e) => handleChange("expiresAt", e.target.value),
            className: "bg-background/60",
            "data-ocid": "coupon-expiry-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coupon-desc", children: "Description (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "coupon-desc",
            value: form.description,
            onChange: (e) => handleChange("description", e.target.value),
            placeholder: "e.g. 20% off for first-time buyers",
            rows: 2,
            className: "bg-background/60",
            "data-ocid": "coupon-desc-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Audience" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.audience,
            onValueChange: (v) => handleChange("audience", v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "bg-background/60",
                  "data-ocid": "coupon-audience-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All users" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new", children: "New users (no orders)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive users" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active users" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "New = no orders. Inactive/Active are based on last order date." })
      ] }),
      (form.audience === "inactive" || form.audience === "active") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "coupon-activity-days", children: "Activity window (days)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "coupon-activity-days",
            type: "number",
            value: form.activityDays,
            onChange: (e) => handleChange("activityDays", e.target.value),
            placeholder: "60",
            className: "bg-background/60",
            "data-ocid": "coupon-activity-days-input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active = ordered within last N days. Inactive = no order in last N days." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "coupon-onetime",
            checked: form.oneTimePerUser,
            onCheckedChange: (v) => handleChange("oneTimePerUser", v),
            "data-ocid": "coupon-onetime-toggle"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "coupon-onetime",
            className: "cursor-pointer text-sm font-medium",
            children: "One-time per user"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "coupon-active",
            checked: form.isActive,
            onCheckedChange: (v) => handleChange("isActive", v),
            "data-ocid": "coupon-active-toggle"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "coupon-active",
            className: "cursor-pointer text-sm font-medium",
            children: "Active — coupon is usable at checkout"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSaving,
            className: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600",
            "data-ocid": "coupon-save-btn",
            children: isSaving ? "Saving…" : editTarget ? "Save Changes" : "Create Coupon"
          }
        )
      ] })
    ] })
  ] }) });
}
function AdminCouponsPage() {
  const [coupons, setCoupons] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const unsub = subscribeToCoupons((data) => {
      setCoupons(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  const stats = reactExports.useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(
      (c) => getCouponStatus(c) === "active"
    ).length;
    const expired = coupons.filter(
      (c) => getCouponStatus(c) === "expired"
    ).length;
    return { total, active, expired };
  }, [coupons]);
  const filtered = reactExports.useMemo(() => {
    let list = coupons;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.code.toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((c) => getCouponStatus(c) === statusFilter);
    }
    return list;
  }, [coupons, search, statusFilter]);
  function openCreate() {
    setEditTarget(null);
    setDialogOpen(true);
  }
  function openEdit(coupon) {
    setEditTarget(coupon);
    setDialogOpen(true);
  }
  async function handleToggle(coupon) {
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      ue.success(`Coupon ${coupon.isActive ? "deactivated" : "activated"}`);
    } catch {
      ue.error("Failed to update coupon status");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCoupon(deleteTarget.id);
      ue.success(`Coupon "${deleteTarget.code}" deleted`);
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete coupon");
    } finally {
      setIsDeleting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" },
        className: "space-y-6 p-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 text-2xl font-bold text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TicketPercent, { className: "h-6 w-6 text-primary" }),
                "Coupon Management"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Create and manage discount codes for your store" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: openCreate,
                className: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600",
                "data-ocid": "create-coupon-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                  "Create Coupon"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatsCard,
              {
                label: "Total Coupons",
                value: stats.total,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TicketPercent, { className: "h-5 w-5" }),
                accent: "blue"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatsCard,
              {
                label: "Active Coupons",
                value: stats.active,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-5 w-5" }),
                accent: "green"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatsCard,
              {
                label: "Expired Coupons",
                value: stats.expired,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5" }),
                accent: "red"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[220px] flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search by code or description…",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "pl-9",
                  "data-ocid": "coupon-search-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: statusFilter,
                onValueChange: (v) => setStatusFilter(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44", "data-ocid": "coupon-status-filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by status" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Coupons" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "expired", children: "Expired" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: loading ? SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}, k)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 py-16 text-center",
              "data-ocid": "coupon-empty-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TicketPercent, { className: "h-12 w-12 text-muted-foreground/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-base font-semibold text-foreground", children: search || statusFilter !== "all" ? "No coupons match your filters" : "No coupons yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-xs text-sm text-muted-foreground", children: search || statusFilter !== "all" ? "Try adjusting your search or filter criteria." : "Create your first discount coupon to boost conversions." }),
                !search && statusFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "mt-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600",
                    onClick: openCreate,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                      "Create Coupon"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((coupon) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CouponRow,
            {
              coupon,
              onEdit: openEdit,
              onDelete: setDeleteTarget,
              onToggle: handleToggle
            },
            coupon.id
          )) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CouponDialog,
      {
        open: dialogOpen,
        editTarget,
        onClose: () => setDialogOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (v) => !v && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "border-border/60 bg-card/95 backdrop-blur-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Coupon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              "Are you sure you want to delete coupon",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold", children: deleteTarget == null ? void 0 : deleteTarget.code }),
              "? This action cannot be undone."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleDelete,
                disabled: isDeleting,
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                "data-ocid": "coupon-delete-confirm-btn",
                children: isDeleting ? "Deleting…" : "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminCouponsPage as default
};
