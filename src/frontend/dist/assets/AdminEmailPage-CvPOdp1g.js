import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence, x as ue } from "./index-BSySFNaW.js";
import { R as subscribeToEmailTemplates, S as updateEmailTemplate, T as addEmailTemplate, U as deleteEmailTemplate } from "./adminService-C_DVe4vg.js";
import { R as Root$1, P as Portal, O as Overlay, C as Content, T as Title, a as Close, b as Root2$1, c as Portal2, d as Overlay2, e as Content2$1, f as Title2, D as Description2, g as Cancel, A as Action } from "./index-B2YutIn3.js";
import { R as Root2, T as Trigger, V as Value, I as Icon, P as Portal$1, C as Content2, a as Viewport, b as Item, c as ItemText } from "./index-BEKNyHJC.js";
import { R as Root, T as Thumb } from "./index-CCeh3MPJ.js";
import { A as AdminLayout } from "./AdminLayout-2gYHCLuq.js";
import "./Combination-uBPLZVtz.js";
import "./index-CJTyfxIJ.js";
import "./external-link-BGGFFOjs.js";
import "./ticket-BmOHArP0.js";
const TEMPLATE_TYPES = [
  {
    type: "orderPlaced",
    label: "Order Placed",
    color: "oklch(0.65 0.15 240)",
    bg: "oklch(0.65 0.15 240 / 0.12)",
    border: "oklch(0.65 0.15 240 / 0.25)",
    icon: "📦"
  },
  {
    type: "orderShipped",
    label: "Order Shipped",
    color: "oklch(0.78 0.16 75)",
    bg: "oklch(0.78 0.16 75 / 0.12)",
    border: "oklch(0.78 0.16 75 / 0.25)",
    icon: "🚚"
  },
  {
    type: "orderDelivered",
    label: "Order Delivered",
    color: "oklch(0.72 0.17 155)",
    bg: "oklch(0.72 0.17 155 / 0.12)",
    border: "oklch(0.72 0.17 155 / 0.25)",
    icon: "✅"
  },
  {
    type: "orderCancelled",
    label: "Order Cancelled",
    color: "oklch(0.63 0.20 25)",
    bg: "oklch(0.63 0.20 25 / 0.12)",
    border: "oklch(0.63 0.20 25 / 0.25)",
    icon: "❌"
  }
];
const TEMPLATE_VARIABLES = [
  { key: "{{orderId}}", desc: "Order ID" },
  { key: "{{customerName}}", desc: "Customer name" },
  { key: "{{orderTotal}}", desc: "Total amount" },
  { key: "{{orderDate}}", desc: "Order date" },
  { key: "{{trackingId}}", desc: "Tracking ID" },
  { key: "{{deliveryDate}}", desc: "Delivery date" },
  { key: "{{items}}", desc: "Order items list" }
];
const SKELETON_KEYS = ["sk-email-a", "sk-email-b", "sk-email-c"];
const EMPTY_FORM = {
  type: "orderPlaced",
  name: "",
  fromName: "Tinkro Robotics",
  fromEmail: "",
  subject: "",
  htmlContent: "",
  isActive: true
};
function getTypeInfo(type) {
  return TEMPLATE_TYPES.find((t) => t.type === type) ?? TEMPLATE_TYPES[0];
}
function formatDate(val) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return val;
  }
}
function AdminEmailPage() {
  const [templates, setTemplates] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(
    null
  );
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [errors, setErrors] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  const [apiConfig, setApiConfig] = reactExports.useState({
    apiKey: "",
    fromEmail: "",
    fromName: "Tinkro Robotics",
    saving: false
  });
  const unsubRef = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    unsubRef.current = subscribeToEmailTemplates((t) => {
      setTemplates(t);
      setLoading(false);
    });
    return () => {
      var _a;
      return (_a = unsubRef.current) == null ? void 0 : _a.call(unsubRef);
    };
  }, []);
  function openCreate(defaultType) {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, type: defaultType ?? "orderPlaced" });
    setErrors({});
    setPreviewOpen(false);
    setDialogOpen(true);
  }
  function openEdit(tpl) {
    setEditTarget(tpl);
    setForm({
      type: tpl.type,
      name: tpl.name,
      fromName: tpl.fromName ?? "Tinkro Robotics",
      fromEmail: tpl.fromEmail ?? "",
      subject: tpl.subject,
      htmlContent: tpl.htmlContent,
      isActive: tpl.isActive
    });
    setErrors({});
    setPreviewOpen(false);
    setDialogOpen(true);
  }
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Template name is required";
    if (!form.subject.trim()) e.subject = "Subject line is required";
    if (!form.htmlContent.trim()) e.htmlContent = "HTML content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        name: form.name.trim(),
        fromName: form.fromName.trim() || void 0,
        fromEmail: form.fromEmail.trim() || void 0,
        subject: form.subject.trim(),
        htmlContent: form.htmlContent.trim(),
        isActive: form.isActive
      };
      if (editTarget) {
        await updateEmailTemplate(editTarget.id, payload);
        ue.success("Template updated successfully");
      } else {
        await addEmailTemplate(payload);
        ue.success("Template created successfully");
      }
      setDialogOpen(false);
    } catch {
      ue.error("Failed to save template. Please try again.");
    } finally {
      setSaving(false);
    }
  }
  async function handleToggleActive(tpl, value) {
    try {
      await updateEmailTemplate(tpl.id, { isActive: value });
      ue.success(value ? "Template activated" : "Template deactivated");
    } catch {
      ue.error("Failed to update template status");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteEmailTemplate(deleteTarget.id);
      ue.success("Template deleted");
    } catch {
      ue.error("Failed to delete template");
    } finally {
      setDeleteTarget(null);
    }
  }
  function handleSendTest() {
    ue.info(
      "Email sending is not enabled. Templates will activate when email is turned on."
    );
  }
  async function handleSaveApiConfig() {
    setApiConfig((prev) => ({ ...prev, saving: true }));
    try {
      localStorage.setItem(
        "tinkro_email_config",
        JSON.stringify({
          fromEmail: apiConfig.fromEmail,
          fromName: apiConfig.fromName,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        })
      );
      ue.success("Email configuration saved. Contact support to activate.");
    } catch {
      ue.error("Failed to save email configuration");
    } finally {
      setApiConfig((prev) => ({ ...prev, saving: false }));
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Email Automation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: { color: "oklch(0.55 0.04 243)" }, children: "Manage automated email templates for order notifications" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "flex items-start gap-3 p-4 rounded-xl border",
          style: {
            background: "oklch(0.65 0.15 240 / 0.10)",
            borderColor: "oklch(0.65 0.15 240 / 0.30)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl mt-0.5", children: "ℹ️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm font-semibold",
                  style: { color: "oklch(0.80 0.10 240)" },
                  children: "Email automation is ready to activate"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs mt-0.5",
                  style: { color: "oklch(0.55 0.05 243)" },
                  children: "Templates are stored and will be sent automatically when email is enabled. Contact support to enable email sending."
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "text-sm font-semibold uppercase tracking-widest mb-3",
            style: { color: "oklch(0.50 0.04 243)" },
            children: "Template Types"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: TEMPLATE_TYPES.map((tt, i) => {
          const configured = templates.find((t) => t.type === tt.type);
          const isActive = (configured == null ? void 0 : configured.isActive) ?? false;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.05 * i },
              className: "relative rounded-xl p-4 border flex flex-col gap-3",
              style: { background: tt.bg, borderColor: tt.border },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: tt.icon }),
                  configured ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      style: {
                        background: isActive ? "oklch(0.72 0.17 155 / 0.20)" : "oklch(0.45 0.05 243 / 0.25)",
                        color: isActive ? "oklch(0.80 0.14 155)" : "oklch(0.50 0.04 243)"
                      },
                      children: isActive ? "● ACTIVE" : "○ INACTIVE"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      style: {
                        background: "oklch(0.30 0.04 243 / 0.25)",
                        color: "oklch(0.45 0.04 243)"
                      },
                      children: "○ NOT SET"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: tt.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[11px] mt-0.5",
                      style: { color: "oklch(0.50 0.04 243)" },
                      children: configured ? `Template: ${configured.name}` : "No template configured"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `configure-${tt.type}`,
                    onClick: () => configured ? openEdit(configured) : openCreate(tt.type),
                    className: "w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90",
                    style: {
                      background: tt.bg,
                      border: `1px solid ${tt.border}`,
                      color: tt.color
                    },
                    children: configured ? "Edit Template" : "Configure"
                  }
                )
              ]
            },
            tt.type
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-sm font-semibold uppercase tracking-widest",
              style: { color: "oklch(0.50 0.04 243)" },
              children: "Configured Templates"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "email-add-template",
              onClick: () => openCreate(),
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90",
              style: {
                background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                color: "oklch(0.10 0.02 250)"
              },
              children: "+ New Template"
            }
          )
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-16 rounded-xl animate-pulse",
            style: { background: "oklch(0.16 0.04 243 / 0.5)" }
          },
          k
        )) }) : templates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            "data-ocid": "email-empty-state",
            className: "flex flex-col items-center justify-center py-16 rounded-xl border text-center",
            style: {
              background: "oklch(0.13 0.03 243 / 0.5)",
              borderColor: "oklch(0.22 0.05 243 / 0.3)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl mb-3", children: "✉️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white/60", children: "No email templates configured yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs mt-1 mb-4",
                  style: { color: "oklch(0.45 0.04 243)" },
                  children: "Click Configure on any template type to get started"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => openCreate(),
                  className: "px-4 py-2 rounded-lg text-xs font-semibold",
                  style: {
                    background: "oklch(0.71 0.17 48 / 0.15)",
                    border: "1px solid oklch(0.71 0.17 48 / 0.30)",
                    color: "oklch(0.85 0.12 48)"
                  },
                  children: "+ Create First Template"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: templates.map((tpl) => {
          const info = getTypeInfo(tpl.type);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, x: -20 },
              transition: { duration: 0.2 },
              "data-ocid": `email-row-${tpl.id}`,
              className: "flex items-center gap-4 p-4 rounded-xl border",
              style: {
                background: "oklch(0.13 0.03 243 / 0.6)",
                borderColor: "oklch(0.22 0.05 243 / 0.3)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", children: info.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        style: {
                          background: info.bg,
                          color: info.color,
                          border: `1px solid ${info.border}`
                        },
                        children: info.label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white truncate", children: tpl.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs mt-0.5 truncate",
                      style: { color: "oklch(0.50 0.04 243)" },
                      children: [
                        "Subject: ",
                        tpl.subject
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-[10px] mt-0.5",
                      style: { color: "oklch(0.40 0.03 243)" },
                      children: [
                        "Updated: ",
                        formatDate(tpl.updatedAt ?? tpl.createdAt)
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: `toggle-${tpl.id}`,
                      className: "text-xs",
                      style: { color: "oklch(0.50 0.04 243)" },
                      children: tpl.isActive ? "Active" : "Inactive"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Root,
                    {
                      id: `toggle-${tpl.id}`,
                      checked: tpl.isActive,
                      onCheckedChange: (val) => handleToggleActive(tpl, val),
                      "data-ocid": `email-toggle-${tpl.id}`,
                      className: "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 outline-none",
                      style: {
                        background: tpl.isActive ? "oklch(0.72 0.17 155 / 0.7)" : "oklch(0.25 0.04 243)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Thumb,
                        {
                          className: "block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                          style: {
                            transform: tpl.isActive ? "translateX(18px)" : "translateX(2px)"
                          }
                        }
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `email-test-${tpl.id}`,
                      onClick: handleSendTest,
                      className: "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80",
                      style: {
                        background: "oklch(0.65 0.15 240 / 0.12)",
                        border: "1px solid oklch(0.65 0.15 240 / 0.25)",
                        color: "oklch(0.70 0.10 240)"
                      },
                      children: "Test"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `email-edit-${tpl.id}`,
                      onClick: () => openEdit(tpl),
                      className: "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80",
                      style: {
                        background: "oklch(0.71 0.17 48 / 0.12)",
                        border: "1px solid oklch(0.71 0.17 48 / 0.25)",
                        color: "oklch(0.85 0.12 48)"
                      },
                      children: "Edit"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `email-delete-${tpl.id}`,
                      onClick: () => setDeleteTarget(tpl),
                      className: "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80",
                      style: {
                        background: "oklch(0.63 0.20 25 / 0.12)",
                        border: "1px solid oklch(0.63 0.20 25 / 0.25)",
                        color: "oklch(0.75 0.15 25)"
                      },
                      children: "Delete"
                    }
                  )
                ] })
              ]
            },
            tpl.id
          );
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "rounded-xl border p-5",
          style: {
            background: "oklch(0.13 0.03 243 / 0.6)",
            borderColor: "oklch(0.22 0.05 243 / 0.3)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-white", children: "Resend API Configuration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs mt-0.5",
                    style: { color: "oklch(0.50 0.04 243)" },
                    children: "Resend is the email provider used for automated notifications."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] font-bold px-2 py-1 rounded-full",
                  style: {
                    background: "oklch(0.63 0.20 25 / 0.12)",
                    border: "1px solid oklch(0.63 0.20 25 / 0.25)",
                    color: "oklch(0.75 0.15 25)"
                  },
                  children: "NOT CONFIGURED"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "cfg-api-key",
                    className: "block text-xs font-medium mb-1.5",
                    style: { color: "oklch(0.65 0.04 243)" },
                    children: "API Key"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "cfg-api-key",
                    type: "password",
                    placeholder: "sk-resend-xxxx",
                    value: apiConfig.apiKey,
                    onChange: (e) => setApiConfig((p) => ({ ...p, apiKey: e.target.value })),
                    "data-ocid": "email-api-key",
                    className: "w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-1",
                    style: {
                      background: "oklch(0.10 0.03 250)",
                      border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                      color: "oklch(0.85 0.04 243)"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "cfg-from-email",
                    className: "block text-xs font-medium mb-1.5",
                    style: { color: "oklch(0.65 0.04 243)" },
                    children: "From Email"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "cfg-from-email",
                    type: "email",
                    placeholder: "orders@tinkro.in",
                    value: apiConfig.fromEmail,
                    onChange: (e) => setApiConfig((p) => ({ ...p, fromEmail: e.target.value })),
                    "data-ocid": "email-from-email",
                    className: "w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-1",
                    style: {
                      background: "oklch(0.10 0.03 250)",
                      border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                      color: "oklch(0.85 0.04 243)"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "cfg-from-name",
                    className: "block text-xs font-medium mb-1.5",
                    style: { color: "oklch(0.65 0.04 243)" },
                    children: "From Name"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "cfg-from-name",
                    type: "text",
                    placeholder: "Tinkro Robotics",
                    value: apiConfig.fromName,
                    onChange: (e) => setApiConfig((p) => ({ ...p, fromName: e.target.value })),
                    "data-ocid": "email-from-name",
                    className: "w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-1",
                    style: {
                      background: "oklch(0.10 0.03 250)",
                      border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                      color: "oklch(0.85 0.04 243)"
                    }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "oklch(0.40 0.03 243)" }, children: "Note: Actual activation requires platform-level email feature flag. Contact support to enable." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "email-save-config",
                  onClick: handleSaveApiConfig,
                  disabled: apiConfig.saving,
                  className: "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                    color: "oklch(0.10 0.02 250)"
                  },
                  children: apiConfig.saving ? "Saving…" : "Save API Config"
                }
              )
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Root$1, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Overlay,
        {
          className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
          style: { animation: "fadeIn 0.2s ease" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Content,
        {
          className: "fixed inset-0 z-50 flex items-center justify-center p-4",
          "aria-describedby": "email-dialog-desc",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.97, y: 10 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.97 },
              transition: { duration: 0.2 },
              className: "w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border",
              style: {
                background: "oklch(0.11 0.04 243)",
                borderColor: "oklch(0.22 0.05 243 / 0.5)",
                boxShadow: "0 25px 60px oklch(0.05 0.03 250 / 0.8)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "sticky top-0 z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b",
                    style: {
                      borderColor: "oklch(0.20 0.04 243 / 0.5)",
                      background: "oklch(0.11 0.04 243)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { className: "text-lg font-bold text-white", children: editTarget ? "Edit Email Template" : "New Email Template" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Close,
                        {
                          "data-ocid": "email-dialog-close",
                          className: "p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all",
                          children: "✕"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "email-dialog-desc", className: "sr-only", children: "Create or edit an email template for automated notifications" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: "block text-xs font-medium mb-1.5",
                          style: { color: "oklch(0.65 0.04 243)" },
                          children: [
                            "Template Type ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Root2,
                        {
                          value: form.type,
                          onValueChange: (v) => setForm((p) => ({ ...p, type: v })),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Trigger,
                              {
                                "data-ocid": "email-type-select",
                                className: "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm outline-none",
                                style: {
                                  background: "oklch(0.10 0.03 250)",
                                  border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                                  color: "oklch(0.85 0.04 243)"
                                },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Value, {}),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "ml-2 text-white/40", children: "▾" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Content2,
                              {
                                className: "z-[200] rounded-xl border overflow-hidden",
                                style: {
                                  background: "oklch(0.13 0.04 243)",
                                  borderColor: "oklch(0.22 0.05 243 / 0.5)"
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "p-1", children: TEMPLATE_TYPES.map((tt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Item,
                                  {
                                    value: tt.type,
                                    className: "px-3 py-2 rounded-lg text-sm cursor-pointer outline-none select-none hover:bg-white/5",
                                    style: { color: "oklch(0.80 0.04 243)" },
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ItemText, { children: [
                                      tt.icon,
                                      " ",
                                      tt.label
                                    ] })
                                  },
                                  tt.type
                                )) })
                              }
                            ) })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          htmlFor: "tpl-name",
                          className: "block text-xs font-medium mb-1.5",
                          style: { color: "oklch(0.65 0.04 243)" },
                          children: [
                            "Template Name ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "tpl-name",
                          type: "text",
                          placeholder: "e.g. Order Placed Confirmation",
                          value: form.name,
                          onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
                          "data-ocid": "email-template-name",
                          className: "w-full px-3 py-2 rounded-lg text-sm outline-none",
                          style: {
                            background: "oklch(0.10 0.03 250)",
                            border: `1px solid ${errors.name ? "oklch(0.63 0.20 25)" : "oklch(0.22 0.05 243 / 0.5)"}`,
                            color: "oklch(0.85 0.04 243)"
                          }
                        }
                      ),
                      errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 text-red-400", children: errors.name })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          htmlFor: "tpl-from-name",
                          className: "block text-xs font-medium mb-1.5",
                          style: { color: "oklch(0.65 0.04 243)" },
                          children: [
                            "From Name",
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "(optional)" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "tpl-from-name",
                          type: "text",
                          placeholder: "Tinkro Robotics",
                          value: form.fromName,
                          onChange: (e) => setForm((p) => ({ ...p, fromName: e.target.value })),
                          "data-ocid": "email-from-name-field",
                          className: "w-full px-3 py-2 rounded-lg text-sm outline-none",
                          style: {
                            background: "oklch(0.10 0.03 250)",
                            border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                            color: "oklch(0.85 0.04 243)"
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          htmlFor: "tpl-from-email",
                          className: "block text-xs font-medium mb-1.5",
                          style: { color: "oklch(0.65 0.04 243)" },
                          children: [
                            "From Email",
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "(optional)" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "tpl-from-email",
                          type: "email",
                          placeholder: "Will use platform default when email is enabled",
                          value: form.fromEmail,
                          onChange: (e) => setForm((p) => ({ ...p, fromEmail: e.target.value })),
                          "data-ocid": "email-from-email-field",
                          className: "w-full px-3 py-2 rounded-lg text-sm outline-none",
                          style: {
                            background: "oklch(0.10 0.03 250)",
                            border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                            color: "oklch(0.85 0.04 243)"
                          }
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "label",
                      {
                        htmlFor: "tpl-subject",
                        className: "block text-xs font-medium mb-1.5",
                        style: { color: "oklch(0.65 0.04 243)" },
                        children: [
                          "Subject Line ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "*" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "tpl-subject",
                        type: "text",
                        placeholder: "Your order {{orderId}} has been placed!",
                        value: form.subject,
                        onChange: (e) => setForm((p) => ({ ...p, subject: e.target.value })),
                        "data-ocid": "email-subject",
                        className: "w-full px-3 py-2 rounded-lg text-sm outline-none",
                        style: {
                          background: "oklch(0.10 0.03 250)",
                          border: `1px solid ${errors.subject ? "oklch(0.63 0.20 25)" : "oklch(0.22 0.05 243 / 0.5)"}`,
                          color: "oklch(0.85 0.04 243)"
                        }
                      }
                    ),
                    errors.subject && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 text-red-400", children: errors.subject })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "rounded-xl p-3",
                      style: {
                        background: "oklch(0.08 0.03 250)",
                        border: "1px solid oklch(0.18 0.04 243 / 0.5)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[10px] font-semibold uppercase tracking-widest mb-2",
                            style: { color: "oklch(0.50 0.04 243)" },
                            children: "Available Variables"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: TEMPLATE_VARIABLES.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            title: v.desc,
                            onClick: () => setForm((p) => ({
                              ...p,
                              htmlContent: `${p.htmlContent}${v.key}`
                            })),
                            className: "text-[10px] px-2 py-0.5 rounded font-mono hover:opacity-80 transition-opacity cursor-pointer",
                            style: {
                              background: "oklch(0.65 0.15 240 / 0.12)",
                              border: "1px solid oklch(0.65 0.15 240 / 0.25)",
                              color: "oklch(0.75 0.10 240)"
                            },
                            children: v.key
                          },
                          v.key
                        )) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-[10px] mt-1.5",
                            style: { color: "oklch(0.40 0.03 243)" },
                            children: "Click a variable to insert it into the HTML content"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "label",
                      {
                        htmlFor: "tpl-html-content",
                        className: "block text-xs font-medium mb-1.5",
                        style: { color: "oklch(0.65 0.04 243)" },
                        children: [
                          "HTML Email Content ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "*" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        id: "tpl-html-content",
                        rows: 12,
                        placeholder: "<!DOCTYPE html>\n<html>\n<body>\n  <h1>Order Confirmed!</h1>\n  <p>Hi {{customerName}}, your order {{orderId}} has been placed.</p>\n</body>\n</html>",
                        value: form.htmlContent,
                        onChange: (e) => setForm((p) => ({ ...p, htmlContent: e.target.value })),
                        "data-ocid": "email-html-content",
                        className: "w-full px-3 py-2 rounded-lg text-sm outline-none resize-y font-mono",
                        style: {
                          background: "oklch(0.08 0.03 250)",
                          border: `1px solid ${errors.htmlContent ? "oklch(0.63 0.20 25)" : "oklch(0.22 0.05 243 / 0.5)"}`,
                          color: "oklch(0.82 0.04 243)",
                          minHeight: "200px"
                        }
                      }
                    ),
                    errors.htmlContent && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 text-red-400", children: errors.htmlContent })
                  ] }),
                  form.htmlContent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "email-toggle-preview",
                        onClick: () => setPreviewOpen((p) => !p),
                        className: "text-xs font-medium hover:opacity-80 transition-opacity",
                        style: { color: "oklch(0.65 0.15 240)" },
                        children: previewOpen ? "▲ Hide Preview" : "▼ Show HTML Preview"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: previewOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, height: 0 },
                        animate: { opacity: 1, height: "auto" },
                        exit: { opacity: 0, height: 0 },
                        transition: { duration: 0.2 },
                        className: "overflow-hidden mt-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "rounded-xl p-4 border overflow-auto",
                              style: {
                                background: "#ffffff",
                                borderColor: "oklch(0.22 0.05 243 / 0.5)",
                                maxHeight: "320px"
                              },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "iframe",
                                {
                                  srcDoc: form.htmlContent,
                                  title: "Email preview",
                                  className: "w-full border-0",
                                  style: { minHeight: "240px" },
                                  sandbox: ""
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-[10px] mt-1",
                              style: { color: "oklch(0.40 0.03 243)" },
                              children: "Preview renders raw HTML. Variables shown as-is (not substituted)."
                            }
                          )
                        ]
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Root,
                      {
                        id: "email-active-toggle",
                        checked: form.isActive,
                        onCheckedChange: (val) => setForm((p) => ({ ...p, isActive: val })),
                        "data-ocid": "email-active-switch",
                        className: "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 outline-none",
                        style: {
                          background: form.isActive ? "oklch(0.72 0.17 155 / 0.7)" : "oklch(0.25 0.04 243)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Thumb,
                          {
                            className: "block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                            style: {
                              transform: form.isActive ? "translateX(18px)" : "translateX(2px)"
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "email-active-toggle",
                        className: "text-sm",
                        style: { color: "oklch(0.65 0.04 243)" },
                        children: form.isActive ? "Template Active" : "Template Inactive"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "sticky bottom-0 flex items-center justify-between px-6 pb-6 pt-4 border-t gap-3",
                    style: {
                      borderColor: "oklch(0.20 0.04 243 / 0.5)",
                      background: "oklch(0.11 0.04 243)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "email-send-test",
                          onClick: handleSendTest,
                          className: "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80",
                          style: {
                            background: "oklch(0.65 0.15 240 / 0.12)",
                            border: "1px solid oklch(0.65 0.15 240 / 0.25)",
                            color: "oklch(0.70 0.10 240)"
                          },
                          children: "Send Test"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Close,
                          {
                            className: "px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-all",
                            style: { color: "oklch(0.55 0.04 243)" },
                            children: "Cancel"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": "email-save-template",
                            onClick: handleSave,
                            disabled: saving,
                            className: "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50",
                            style: {
                              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                              color: "oklch(0.10 0.02 250)"
                            },
                            children: saving ? "Saving…" : editTarget ? "Update Template" : "Create Template"
                          }
                        )
                      ] })
                    ]
                  }
                )
              ]
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root2$1,
      {
        open: !!deleteTarget,
        onOpenChange: (v) => !v && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal2, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay2, { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Content2$1,
            {
              className: "fixed inset-0 z-50 flex items-center justify-center p-4",
              "aria-describedby": "email-delete-desc",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.97 },
                  animate: { opacity: 1, scale: 1 },
                  className: "w-full max-w-sm rounded-2xl border p-6",
                  style: {
                    background: "oklch(0.11 0.04 243)",
                    borderColor: "oklch(0.63 0.20 25 / 0.4)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Title2, { className: "text-base font-bold text-white mb-1", children: "Delete Template?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Description2,
                      {
                        id: "email-delete-desc",
                        className: "text-sm mb-5",
                        style: { color: "oklch(0.55 0.04 243)" },
                        children: [
                          '"',
                          deleteTarget == null ? void 0 : deleteTarget.name,
                          '" will be permanently deleted. This cannot be undone.'
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Cancel,
                        {
                          "data-ocid": "email-delete-cancel",
                          className: "flex-1 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-all",
                          style: {
                            color: "oklch(0.55 0.04 243)",
                            border: "1px solid oklch(0.22 0.05 243 / 0.4)"
                          },
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Action,
                        {
                          "data-ocid": "email-delete-confirm",
                          onClick: handleDelete,
                          className: "flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90",
                          style: {
                            background: "oklch(0.63 0.20 25)",
                            color: "oklch(0.98 0.01 60)"
                          },
                          children: "Delete"
                        }
                      )
                    ] })
                  ]
                }
              )
            }
          )
        ] })
      }
    )
  ] });
}
export {
  AdminEmailPage as default
};
