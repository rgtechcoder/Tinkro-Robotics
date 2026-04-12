import { h as createLucideIcon, r as reactExports, j as jsxRuntimeExports, al as Zap, x as Truck, B as Button, am as Info, m as motion, A as AnimatePresence, o as ue, l as Badge, O as Clock, M as MapPin } from "./index-O-oxzsBJ.js";
import { A as AdminLayout } from "./AdminLayout-DnmFTD6u.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction, D as Dialog, h as DialogContent, i as DialogHeader, j as DialogTitle } from "./dialog-Doq3vSOq.js";
import { I as Input } from "./input-CA2Kh0PP.js";
import { L as Label } from "./label-CaWhKRKy.js";
import { S as Switch } from "./switch-zaxM8ZEj.js";
import { T as Textarea } from "./textarea-1JrWIcUD.js";
import { P as Plus } from "./plus-DaZED7tD.js";
import { P as Pencil } from "./pencil-B8gfMpCg.js";
import { T as Trash2 } from "./trash-2-CTLSMskq.js";
import "./external-link-0xBpMtII.js";
import "./ticket-DhyR_LGt.js";
import "./index-Cu6viimg.js";
import "./index-IUus9vKR.js";
import "./index-ljXxS_F9.js";
import "./index-DszSdnxd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", key: "1nb95v" }],
  ["line", { x1: "8", x2: "16", y1: "6", y2: "6", key: "x4nwl0" }],
  ["line", { x1: "16", x2: "16", y1: "14", y2: "18", key: "wjye3r" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }]
];
const Calculator = createLucideIcon("calculator", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$1);
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
      d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
      key: "icamh8"
    }
  ],
  ["path", { d: "m14.5 12.5 2-2", key: "inckbg" }],
  ["path", { d: "m11.5 9.5 2-2", key: "fmmyf7" }],
  ["path", { d: "m8.5 6.5 2-2", key: "vc6u1g" }],
  ["path", { d: "m17.5 15.5 2-2", key: "wo5hmg" }]
];
const Ruler = createLucideIcon("ruler", __iconNode);
const SKELETON_KEYS = ["sk-rule-a", "sk-rule-b", "sk-rule-c"];
const DEFAULT_FORM = {
  name: "",
  description: "",
  minOrderAmount: "0",
  maxOrderAmount: "",
  baseCost: "0",
  freeShippingAbove: "",
  estimatedDays: "3",
  estimatedDaysMax: "",
  regions: "All India",
  isActive: true
};
function formatAmount(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
function getAmountRange(rule) {
  const min = formatAmount(rule.minOrderAmount);
  if (rule.maxOrderAmount !== void 0 && rule.maxOrderAmount !== null) {
    return `${min} – ${formatAmount(rule.maxOrderAmount)}`;
  }
  return `${min}+`;
}
function getDeliveryTime(rule) {
  if (rule.estimatedDaysMax) {
    return `${rule.estimatedDays}–${rule.estimatedDaysMax} days`;
  }
  return `${rule.estimatedDays} day${rule.estimatedDays !== 1 ? "s" : ""}`;
}
function calcShipping(rules, amount) {
  const activeRules = rules.filter((r) => r.isActive).sort((a, b) => b.minOrderAmount - a.minOrderAmount);
  for (const rule of activeRules) {
    const aboveMin = amount >= rule.minOrderAmount;
    const belowMax = rule.maxOrderAmount === void 0 || rule.maxOrderAmount === null || amount <= rule.maxOrderAmount;
    if (aboveMin && belowMax) {
      const cost = rule.freeShippingAbove !== void 0 && rule.freeShippingAbove !== null && amount >= rule.freeShippingAbove ? 0 : rule.baseCost;
      return { rule, cost };
    }
  }
  return { rule: null, cost: 0 };
}
function validateForm(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Rule name is required";
  const min = Number(values.minOrderAmount);
  if (Number.isNaN(min) || min < 0)
    errors.minOrderAmount = "Enter a valid amount";
  const cost = Number(values.baseCost);
  if (Number.isNaN(cost) || cost < 0) errors.baseCost = "Enter a valid cost";
  const days = Number(values.estimatedDays);
  if (Number.isNaN(days) || days < 1)
    errors.estimatedDays = "Enter estimated days";
  return errors;
}
function RuleCard({ rule, onEdit, onDelete, onToggle }) {
  const visibleRegions = rule.regions.slice(0, 3);
  const extraCount = rule.regions.length - 3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.97 },
      transition: { duration: 0.22 },
      className: "rounded-xl border p-5 flex flex-col gap-4",
      style: {
        background: "oklch(0.13 0.04 243 / 0.7)",
        borderColor: rule.isActive ? "oklch(0.71 0.17 48 / 0.25)" : "oklch(0.22 0.05 243 / 0.4)",
        backdropFilter: "blur(12px)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white truncate", children: rule.name }),
              rule.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "text-[10px] px-2 py-0",
                  style: {
                    background: "oklch(0.33 0.1 150 / 0.25)",
                    color: "oklch(0.75 0.15 150)",
                    border: "1px solid oklch(0.75 0.15 150 / 0.3)"
                  },
                  children: "Active"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "text-[10px] px-2 py-0",
                  style: {
                    background: "oklch(0.18 0.03 243 / 0.5)",
                    color: "oklch(0.50 0.03 243)",
                    border: "1px solid oklch(0.30 0.05 243 / 0.4)"
                  },
                  children: "Inactive"
                }
              )
            ] }),
            rule.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs mt-0.5 line-clamp-1",
                style: { color: "oklch(0.55 0.03 243)" },
                children: rule.description
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: `shipping-toggle-${rule.id}`,
                checked: rule.isActive,
                onCheckedChange: () => onToggle(rule),
                "data-ocid": `shipping-toggle-${rule.id}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `shipping-edit-${rule.id}`,
                onClick: () => onEdit(rule),
                className: "p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 text-white/40 hover:text-white",
                title: "Edit rule",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `shipping-delete-${rule.id}`,
                onClick: () => onDelete(rule),
                className: "p-1.5 rounded-lg transition-all duration-200 hover:bg-red-500/15 text-white/30 hover:text-red-400",
                title: "Delete rule",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg px-3 py-2.5 flex flex-col gap-0.5",
              style: { background: "oklch(0.10 0.03 243 / 0.6)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] uppercase tracking-wider",
                    style: { color: "oklch(0.45 0.03 243)" },
                    children: "Order Range"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold",
                    style: { color: "oklch(0.80 0.08 243)" },
                    children: getAmountRange(rule)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg px-3 py-2.5 flex flex-col gap-0.5",
              style: { background: "oklch(0.10 0.03 243 / 0.6)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] uppercase tracking-wider",
                    style: { color: "oklch(0.45 0.03 243)" },
                    children: "Shipping Cost"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-bold",
                    style: {
                      color: rule.baseCost === 0 ? "oklch(0.75 0.15 150)" : "oklch(0.88 0.10 48)"
                    },
                    children: rule.baseCost === 0 ? "FREE" : formatAmount(rule.baseCost)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg px-3 py-2.5 flex flex-col gap-0.5",
              style: { background: "oklch(0.10 0.03 243 / 0.6)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] uppercase tracking-wider",
                    style: { color: "oklch(0.45 0.03 243)" },
                    children: "Delivery"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-semibold flex items-center gap-1",
                    style: { color: "oklch(0.80 0.08 243)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                      getDeliveryTime(rule)
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg px-3 py-2.5 flex flex-col gap-0.5",
              style: { background: "oklch(0.10 0.03 243 / 0.6)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] uppercase tracking-wider",
                    style: { color: "oklch(0.45 0.03 243)" },
                    children: "Free Above"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold",
                    style: { color: "oklch(0.75 0.15 150)" },
                    children: rule.freeShippingAbove ? formatAmount(rule.freeShippingAbove) : "—"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MapPin,
            {
              size: 12,
              className: "shrink-0",
              style: { color: "oklch(0.50 0.08 243)" }
            }
          ),
          visibleRegions.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "text-[10px] px-1.5 py-0",
              style: {
                background: "oklch(0.18 0.05 243 / 0.5)",
                color: "oklch(0.65 0.06 243)",
                border: "1px solid oklch(0.28 0.06 243 / 0.4)"
              },
              children: region
            },
            region
          )),
          extraCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-[10px]",
              style: { color: "oklch(0.48 0.04 243)" },
              children: [
                "+",
                extraCount,
                " more"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ShippingFormDialog({
  open,
  onOpenChange,
  editRule,
  onSuccess
}) {
  const [values, setValues] = reactExports.useState(DEFAULT_FORM);
  const [errors, setErrors] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) {
      if (editRule) {
        setValues({
          name: editRule.name,
          description: editRule.description ?? "",
          minOrderAmount: String(editRule.minOrderAmount),
          maxOrderAmount: editRule.maxOrderAmount !== void 0 ? String(editRule.maxOrderAmount) : "",
          baseCost: String(editRule.baseCost),
          freeShippingAbove: editRule.freeShippingAbove !== void 0 ? String(editRule.freeShippingAbove) : "",
          estimatedDays: String(editRule.estimatedDays),
          estimatedDaysMax: editRule.estimatedDaysMax !== void 0 ? String(editRule.estimatedDaysMax) : "",
          regions: editRule.regions.join(", "),
          isActive: editRule.isActive
        });
      } else {
        setValues(DEFAULT_FORM);
      }
      setErrors({});
    }
  }, [open, editRule]);
  function set(field, val) {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: void 0 }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateForm(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const regionsArr = values.regions.split(",").map((r) => r.trim()).filter(Boolean);
    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || void 0,
      minOrderAmount: Number(values.minOrderAmount),
      maxOrderAmount: values.maxOrderAmount !== "" ? Number(values.maxOrderAmount) : void 0,
      baseCost: Number(values.baseCost),
      freeShippingAbove: values.freeShippingAbove !== "" ? Number(values.freeShippingAbove) : void 0,
      estimatedDays: Number(values.estimatedDays),
      estimatedDaysMax: values.estimatedDaysMax !== "" ? Number(values.estimatedDaysMax) : void 0,
      regions: regionsArr.length > 0 ? regionsArr : ["All India"],
      isActive: values.isActive
    };
    setSaving(true);
    try {
      if (editRule) {
        await updateShippingRule(editRule.id, payload);
        ue.success("Shipping rule updated");
      } else {
        await addShippingRule(payload);
        ue.success("Shipping rule created");
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      ue.error("Failed to save shipping rule");
    } finally {
      setSaving(false);
    }
  }
  const inputStyle = {
    background: "oklch(0.10 0.03 250 / 0.8)",
    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
    color: "oklch(0.88 0.04 243)"
  };
  const labelStyle = { color: "oklch(0.65 0.04 243)" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg max-h-[90vh] overflow-y-auto",
      style: {
        background: "linear-gradient(135deg, oklch(0.11 0.04 243), oklch(0.09 0.03 250))",
        border: "1px solid oklch(0.22 0.05 243 / 0.5)",
        color: "oklch(0.88 0.04 243)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-white font-bold", children: editRule ? "Edit Shipping Rule" : "New Shipping Rule" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Rule Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: values.name,
                onChange: (e) => set("name", e.target.value),
                placeholder: "e.g. Standard Shipping",
                style: inputStyle,
                "data-ocid": "shipping-form-name"
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: values.description,
                onChange: (e) => set("description", e.target.value),
                placeholder: "Optional short description",
                rows: 2,
                style: inputStyle
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Min Order Amount (₹) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  value: values.minOrderAmount,
                  onChange: (e) => set("minOrderAmount", e.target.value),
                  style: inputStyle,
                  "data-ocid": "shipping-form-min"
                }
              ),
              errors.minOrderAmount && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errors.minOrderAmount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Max Order Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  value: values.maxOrderAmount,
                  onChange: (e) => set("maxOrderAmount", e.target.value),
                  placeholder: "Leave blank = no max",
                  style: inputStyle
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Base Cost (₹) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  value: values.baseCost,
                  onChange: (e) => set("baseCost", e.target.value),
                  placeholder: "0 = free",
                  style: inputStyle,
                  "data-ocid": "shipping-form-cost"
                }
              ),
              errors.baseCost && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errors.baseCost })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Free Shipping Above (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  value: values.freeShippingAbove,
                  onChange: (e) => set("freeShippingAbove", e.target.value),
                  placeholder: "Optional threshold",
                  style: inputStyle
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Estimated Days *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "1",
                  value: values.estimatedDays,
                  onChange: (e) => set("estimatedDays", e.target.value),
                  style: inputStyle,
                  "data-ocid": "shipping-form-days"
                }
              ),
              errors.estimatedDays && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errors.estimatedDays })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Max Days (for range)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "1",
                  value: values.estimatedDaysMax,
                  onChange: (e) => set("estimatedDaysMax", e.target.value),
                  placeholder: "e.g. 5 for 3–5 days",
                  style: inputStyle
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: labelStyle, children: "Regions (comma-separated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: values.regions,
                onChange: (e) => set("regions", e.target.value),
                placeholder: "All India, Mumbai, Delhi",
                style: inputStyle
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between rounded-lg p-3",
              style: { background: "oklch(0.10 0.03 243 / 0.5)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "shipping-form-active",
                    style: labelStyle,
                    className: "cursor-pointer",
                    children: "Rule Active"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    id: "shipping-form-active",
                    checked: values.isActive,
                    onCheckedChange: (v) => set("isActive", v)
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => onOpenChange(false),
                className: "text-white/50 hover:text-white hover:bg-white/10",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: saving,
                "data-ocid": "shipping-form-submit",
                style: {
                  background: saving ? "oklch(0.50 0.10 48 / 0.5)" : "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.65 0.20 38))",
                  color: "white",
                  border: "none",
                  boxShadow: saving ? "none" : "0 0 18px oklch(0.71 0.17 48 / 0.35)"
                },
                children: saving ? "Saving…" : editRule ? "Save Changes" : "Create Rule"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function AdminShippingPage() {
  const [rules, setRules] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editRule, setEditRule] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(
    null
  );
  const [testAmount, setTestAmount] = reactExports.useState("");
  reactExports.useEffect(() => {
    const unsub = subscribeToShippingRules((data) => {
      setRules(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  const stats = reactExports.useMemo(() => {
    const active = rules.filter((r) => r.isActive);
    const freeThresholds = active.map((r) => r.freeShippingAbove).filter((v) => v !== void 0 && v !== null);
    const lowestFree = freeThresholds.length > 0 ? Math.min(...freeThresholds) : null;
    return { total: rules.length, active: active.length, lowestFree };
  }, [rules]);
  const calcResult = reactExports.useMemo(() => {
    const amount = Number.parseFloat(testAmount);
    if (Number.isNaN(amount) || amount < 0) return null;
    return calcShipping(rules, amount);
  }, [testAmount, rules]);
  function openCreate() {
    setEditRule(null);
    setDialogOpen(true);
  }
  function openEdit(rule) {
    setEditRule(rule);
    setDialogOpen(true);
  }
  async function handleToggle(rule) {
    try {
      await updateShippingRule(rule.id, { isActive: !rule.isActive });
      ue.success(`Rule ${rule.isActive ? "deactivated" : "activated"}`);
    } catch {
      ue.error("Failed to update rule");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteShippingRule(deleteTarget.id);
      ue.success("Shipping rule deleted");
    } catch {
      ue.error("Failed to delete rule");
    } finally {
      setDeleteTarget(null);
    }
  }
  const statCards = [
    {
      key: "total",
      label: "Total Rules",
      value: loading ? "—" : String(stats.total),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Ruler, { size: 16 }),
      color: "oklch(0.71 0.17 48)"
    },
    {
      key: "active",
      label: "Active Rules",
      value: loading ? "—" : String(stats.active),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
      color: "oklch(0.75 0.15 150)"
    },
    {
      key: "free",
      label: "Free Shipping Threshold",
      value: loading ? "—" : stats.lowestFree !== null ? formatAmount(stats.lowestFree) : "Not Set",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16 }),
      color: "oklch(0.72 0.14 195)"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white tracking-tight", children: "Shipping Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm mt-1",
              style: { color: "oklch(0.55 0.04 243)" },
              children: "Configure shipping cost rules for all orders"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openCreate,
            "data-ocid": "shipping-add-btn",
            style: {
              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.65 0.20 38))",
              color: "white",
              border: "none",
              boxShadow: "0 0 18px oklch(0.71 0.17 48 / 0.35)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-2" }),
              "Add Rule"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 rounded-xl p-4",
          style: {
            background: "oklch(0.16 0.06 243 / 0.6)",
            border: "1px solid oklch(0.72 0.14 195 / 0.2)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Info,
              {
                size: 16,
                className: "mt-0.5 shrink-0",
                style: { color: "oklch(0.72 0.14 195)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "oklch(0.65 0.05 243)" }, children: "Define shipping cost rules based on order amount. Rules are matched in order from lowest to highest minimum order amount. When no rule matches, shipping defaults to free." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: statCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25 },
          className: "rounded-xl p-4 flex items-center gap-3",
          style: {
            background: "oklch(0.13 0.04 243 / 0.7)",
            border: `1px solid ${card.color}33`,
            backdropFilter: "blur(12px)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                style: { background: `${card.color}22`, color: card.color },
                children: card.icon
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[11px] uppercase tracking-wide",
                  style: { color: "oklch(0.45 0.03 243)" },
                  children: card.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold mt-0.5 text-white", children: card.value })
            ] })
          ]
        },
        card.key
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "text-sm font-semibold uppercase tracking-widest",
            style: { color: "oklch(0.50 0.04 243)" },
            children: "Shipping Rules"
          }
        ),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: SKELETON_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-xl h-36 animate-pulse",
            style: { background: "oklch(0.13 0.04 243 / 0.5)" }
          },
          key
        )) }) : rules.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            "data-ocid": "shipping-empty-state",
            className: "rounded-xl flex flex-col items-center justify-center py-16 text-center",
            style: {
              background: "oklch(0.12 0.04 243 / 0.5)",
              border: "1px dashed oklch(0.28 0.06 243 / 0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Truck,
                {
                  size: 40,
                  className: "mb-4",
                  style: { color: "oklch(0.40 0.06 243)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-white mb-1", children: "No shipping rules yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm mb-5",
                  style: { color: "oklch(0.50 0.04 243)" },
                  children: "Without rules, all orders default to free shipping."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: openCreate,
                  style: {
                    background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.65 0.20 38))",
                    color: "white",
                    border: "none"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15, className: "mr-2" }),
                    "Add First Rule"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: rules.slice().sort((a, b) => a.minOrderAmount - b.minOrderAmount).map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          RuleCard,
          {
            rule,
            onEdit: openEdit,
            onDelete: setDeleteTarget,
            onToggle: handleToggle
          },
          rule.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "rounded-xl p-5 space-y-4",
          style: {
            background: "oklch(0.13 0.04 243 / 0.7)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { size: 16, style: { color: "oklch(0.72 0.14 195)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white", children: "Shipping Cost Calculator" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "oklch(0.50 0.04 243)" }, children: "Test which rule applies for a given order amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: { color: "oklch(0.60 0.04 243)" }, children: "₹" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  value: testAmount,
                  onChange: (e) => setTestAmount(e.target.value),
                  placeholder: "Enter order amount",
                  "data-ocid": "shipping-calc-input",
                  className: "max-w-[220px]",
                  style: {
                    background: "oklch(0.10 0.03 250 / 0.8)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                    color: "oklch(0.88 0.04 243)"
                  }
                }
              )
            ] }),
            calcResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 6 },
                animate: { opacity: 1, y: 0 },
                className: "rounded-lg p-4 space-y-2",
                style: { background: "oklch(0.10 0.03 243 / 0.6)" },
                children: calcResult.rule ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Globe,
                        {
                          size: 13,
                          style: { color: "oklch(0.72 0.14 195)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white font-medium", children: "Matched rule:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs",
                          style: { color: "oklch(0.71 0.17 48)" },
                          children: calcResult.rule.name
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-sm font-bold",
                        style: {
                          color: calcResult.cost === 0 ? "oklch(0.75 0.15 150)" : "oklch(0.88 0.10 48)"
                        },
                        children: calcResult.cost === 0 ? "FREE" : formatAmount(calcResult.cost)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-[11px]",
                      style: { color: "oklch(0.50 0.04 243)" },
                      children: [
                        "Estimated delivery: ",
                        getDeliveryTime(calcResult.rule),
                        " •",
                        " ",
                        calcResult.rule.regions.join(", ")
                      ]
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 14, style: { color: "oklch(0.75 0.15 150)" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-white", children: [
                    "No rule matched — defaults to ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "FREE" }),
                    " shipping"
                  ] })
                ] })
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShippingFormDialog,
      {
        open: dialogOpen,
        onOpenChange: setDialogOpen,
        editRule,
        onSuccess: () => {
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (v) => !v && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            style: {
              background: "linear-gradient(135deg, oklch(0.11 0.04 243), oklch(0.09 0.03 250))",
              border: "1px solid oklch(0.22 0.05 243 / 0.5)",
              color: "white"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-white", children: "Delete Shipping Rule?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { style: { color: "oklch(0.55 0.04 243)" }, children: [
                  '"',
                  deleteTarget == null ? void 0 : deleteTarget.name,
                  '" will be permanently deleted. This cannot be undone.'
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-white/10 text-white/50 hover:text-white hover:bg-white/10",
                    style: { background: "transparent" },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    "data-ocid": "shipping-delete-confirm",
                    onClick: handleDelete,
                    className: "bg-red-600 hover:bg-red-700 text-white border-none",
                    children: "Delete Rule"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  AdminShippingPage as default
};
