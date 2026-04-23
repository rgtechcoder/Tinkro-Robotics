import { k as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a2 as Clock, v as CircleCheck, m as motion, ag as Search, V as Mail, W as Phone, x as ue, K as ChevronDown, X } from "./index-BSySFNaW.js";
import { A as AdminLayout } from "./AdminLayout-2gYHCLuq.js";
import { C as subscribeToEnquiries, D as updateEnquiry, E as deleteEnquiry } from "./adminService-C_DVe4vg.js";
import { R as Root, P as Portal$1, O as Overlay, C as Content, T as Title, a as Close, b as Root2$1, c as Portal2, d as Overlay2, e as Content2$1, f as Title2, D as Description2, g as Cancel, A as Action } from "./index-B2YutIn3.js";
import { R as Root2, T as Trigger, V as Value, I as Icon, P as Portal, C as Content2, a as Viewport, b as Item, c as ItemText } from "./index-BEKNyHJC.js";
import { T as Trash2 } from "./trash-2-BR965pIM.js";
import { T as TriangleAlert } from "./triangle-alert-N_HXXdkp.js";
import "./external-link-BGGFFOjs.js";
import "./ticket-BmOHArP0.js";
import "./Combination-uBPLZVtz.js";
import "./index-CJTyfxIJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: diffDays > 365 ? "numeric" : void 0
  });
}
function getPriorityBorderColor(priority) {
  if (priority === "high") return "oklch(0.63 0.23 25)";
  if (priority === "medium") return "oklch(0.76 0.17 68)";
  return "oklch(0.60 0.14 243)";
}
function getPriorityBg(priority) {
  if (priority === "high") return "oklch(0.63 0.23 25 / 0.06)";
  return "transparent";
}
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];
function EnquirySkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: SKELETON_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "rounded-xl border-l-4 animate-pulse",
      style: {
        background: "oklch(0.14 0.03 243 / 0.6)",
        borderColor: "oklch(0.22 0.05 243)",
        borderWidth: "1px",
        borderLeftWidth: "4px"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col sm:flex-row sm:items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-4 rounded w-48",
              style: { background: "oklch(0.20 0.04 243)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-3 rounded w-32",
              style: { background: "oklch(0.18 0.03 243)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-6 w-20 rounded-full",
              style: { background: "oklch(0.18 0.03 243)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-6 w-16 rounded-full",
              style: { background: "oklch(0.18 0.03 243)" }
            }
          )
        ] })
      ] })
    },
    key
  )) });
}
function StatusBadge({ status }) {
  const config = {
    new: {
      label: "New",
      bg: "oklch(0.50 0.14 243 / 0.18)",
      color: "oklch(0.72 0.14 243)",
      border: "oklch(0.50 0.14 243 / 0.35)"
    },
    contacted: {
      label: "Contacted",
      bg: "oklch(0.76 0.17 68 / 0.15)",
      color: "oklch(0.82 0.14 68)",
      border: "oklch(0.76 0.17 68 / 0.30)"
    },
    closed: {
      label: "Closed",
      bg: "oklch(0.55 0.17 145 / 0.15)",
      color: "oklch(0.72 0.17 145)",
      border: "oklch(0.55 0.17 145 / 0.30)"
    }
  }[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
      style: {
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`
      },
      children: [
        status === "new" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "w-1.5 h-1.5 rounded-full animate-pulse",
            style: { background: config.color }
          }
        ),
        config.label
      ]
    }
  );
}
function PriorityBadge({ priority }) {
  const config = {
    high: {
      label: "High",
      bg: "oklch(0.63 0.23 25 / 0.15)",
      color: "oklch(0.75 0.18 25)",
      border: "oklch(0.63 0.23 25 / 0.30)"
    },
    medium: {
      label: "Medium",
      bg: "oklch(0.76 0.17 68 / 0.15)",
      color: "oklch(0.82 0.14 68)",
      border: "oklch(0.76 0.17 68 / 0.30)"
    },
    low: {
      label: "Low",
      bg: "oklch(0.50 0.14 243 / 0.15)",
      color: "oklch(0.70 0.12 243)",
      border: "oklch(0.50 0.14 243 / 0.30)"
    }
  }[priority];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
      style: {
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`
      },
      children: config.label
    }
  );
}
function LabTypeBadge({ labType }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold",
      style: {
        background: "oklch(0.71 0.17 48 / 0.12)",
        color: "oklch(0.82 0.13 48)",
        border: "1px solid oklch(0.71 0.17 48 / 0.25)"
      },
      children: labType
    }
  );
}
function StyledSelect({
  value,
  onChange,
  options,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Root2, { value, onValueChange: onChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Trigger,
      {
        className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer focus:outline-none",
        style: {
          background: "oklch(0.14 0.03 243 / 0.8)",
          border: "1px solid oklch(0.25 0.05 243 / 0.6)",
          color: "oklch(0.75 0.04 243)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Value, { placeholder }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        className: "rounded-xl overflow-hidden z-[200] shadow-2xl",
        style: {
          background: "oklch(0.13 0.04 243)",
          border: "1px solid oklch(0.22 0.05 243 / 0.6)"
        },
        position: "popper",
        sideOffset: 4,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "p-1", children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Item,
          {
            value: opt.value,
            className: "flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer focus:outline-none data-[highlighted]:bg-white/5",
            style: { color: "oklch(0.75 0.04 243)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children: opt.label })
          },
          opt.value
        )) })
      }
    ) })
  ] });
}
function EnquiryDetailDialog({
  enquiry,
  onClose,
  onDelete
}) {
  const [status, setStatus] = reactExports.useState(enquiry.status);
  const [priority, setPriority] = reactExports.useState(
    enquiry.priority
  );
  const [notes, setNotes] = reactExports.useState(enquiry.notes ?? "");
  const [saving, setSaving] = reactExports.useState(false);
  const [confirmDelete, setConfirmDelete] = reactExports.useState(false);
  async function handleSave() {
    setSaving(true);
    try {
      const updates = { status, priority, notes };
      if (enquiry.status === "new" && status !== "new" && !enquiry.respondedAt) {
        updates.respondedAt = (/* @__PURE__ */ new Date()).toISOString();
      }
      await updateEnquiry(enquiry.id, updates);
      ue.success("Enquiry updated successfully");
      onClose();
    } catch {
      ue.error("Failed to update enquiry");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { open: true, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal$1, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Overlay,
        {
          className: "fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm",
          style: { animation: "fadeIn 0.2s ease" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Content,
        {
          className: "fixed inset-0 z-[110] flex items-center justify-center p-4",
          style: { animation: "slideUp 0.25s ease" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl",
              style: {
                background: "oklch(0.11 0.04 243)",
                border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                boxShadow: "0 24px 80px oklch(0.05 0.02 243 / 0.8)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start justify-between p-5 border-b",
                    style: { borderColor: "oklch(0.20 0.04 243 / 0.6)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Title,
                          {
                            className: "text-lg font-bold text-white",
                            style: { color: "oklch(0.92 0.04 243)" },
                            children: enquiry.name
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "p",
                          {
                            className: "text-sm mt-0.5",
                            style: { color: "oklch(0.60 0.04 243)" },
                            children: [
                              "Received ",
                              formatDate(enquiry.createdAt),
                              enquiry.respondedAt && ` · Responded ${formatDate(enquiry.respondedAt)}`
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "p-2 rounded-lg hover:bg-white/10 transition-colors",
                          style: { color: "oklch(0.55 0.04 243)" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-2.5 px-3 py-2.5 rounded-lg",
                        style: { background: "oklch(0.14 0.03 243 / 0.7)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 15, style: { color: "oklch(0.60 0.12 243)" } }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: "text-[10px] uppercase tracking-widest font-semibold",
                                style: { color: "oklch(0.45 0.04 243)" },
                                children: "Email"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: "text-sm font-medium",
                                style: { color: "oklch(0.82 0.04 243)" },
                                children: enquiry.email
                              }
                            )
                          ] })
                        ]
                      }
                    ),
                    enquiry.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-2.5 px-3 py-2.5 rounded-lg",
                        style: { background: "oklch(0.14 0.03 243 / 0.7)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Phone,
                            {
                              size: 15,
                              style: { color: "oklch(0.60 0.12 243)" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: "text-[10px] uppercase tracking-widest font-semibold",
                                style: { color: "oklch(0.45 0.04 243)" },
                                children: "Phone"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: "text-sm font-medium",
                                style: { color: "oklch(0.82 0.04 243)" },
                                children: enquiry.phone
                              }
                            )
                          ] })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LabTypeBadge, { labType: enquiry.labType }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityBadge, { priority })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs font-semibold uppercase tracking-widest mb-2",
                        style: { color: "oklch(0.45 0.04 243)" },
                        children: "Message"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "p-4 rounded-xl text-sm leading-relaxed",
                        style: {
                          background: "oklch(0.14 0.03 243 / 0.6)",
                          color: "oklch(0.78 0.04 243)",
                          border: "1px solid oklch(0.22 0.04 243 / 0.4)"
                        },
                        children: enquiry.message
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-semibold uppercase tracking-widest mb-2",
                          style: { color: "oklch(0.45 0.04 243)" },
                          children: "Status"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        StyledSelect,
                        {
                          value: status,
                          onChange: (v) => setStatus(v),
                          options: [
                            { value: "new", label: "New" },
                            { value: "contacted", label: "Contacted" },
                            { value: "closed", label: "Closed" }
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-semibold uppercase tracking-widest mb-2",
                          style: { color: "oklch(0.45 0.04 243)" },
                          children: "Priority"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        StyledSelect,
                        {
                          value: priority,
                          onChange: (v) => setPriority(v),
                          options: [
                            { value: "high", label: "High" },
                            { value: "medium", label: "Medium" },
                            { value: "low", label: "Low" }
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "enquiry-notes",
                        className: "text-xs font-semibold uppercase tracking-widest mb-2 block",
                        style: { color: "oklch(0.45 0.04 243)" },
                        children: "Internal Notes"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        id: "enquiry-notes",
                        value: notes,
                        onChange: (e) => setNotes(e.target.value),
                        rows: 3,
                        placeholder: "Add internal notes here…",
                        className: "w-full rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/50",
                        style: {
                          background: "oklch(0.14 0.03 243 / 0.7)",
                          border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                          color: "oklch(0.80 0.04 243)"
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between gap-3 px-5 py-4 border-t",
                    style: { borderColor: "oklch(0.20 0.04 243 / 0.6)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setConfirmDelete(true),
                          className: "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          style: { color: "oklch(0.65 0.18 25)" },
                          "data-ocid": "enquiry-delete-trigger",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 }),
                            "Delete"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5",
                            style: { color: "oklch(0.55 0.04 243)" },
                            "data-ocid": "enquiry-detail-cancel",
                            children: "Cancel"
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: handleSave,
                            disabled: saving,
                            className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50",
                            style: {
                              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                              color: "white",
                              boxShadow: "0 4px 16px oklch(0.71 0.17 48 / 0.35)"
                            },
                            "data-ocid": "enquiry-save",
                            children: saving ? "Saving…" : "Save Changes"
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
    confirmDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { open: confirmDelete, onOpenChange: setConfirmDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal2, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay2, { className: "fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Content2$1,
        {
          className: "fixed z-[210] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-2xl p-6",
          style: {
            background: "oklch(0.12 0.04 243)",
            border: "1px solid oklch(0.22 0.05 243 / 0.5)",
            boxShadow: "0 24px 60px oklch(0.05 0.02 243 / 0.8)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  style: { background: "oklch(0.63 0.23 25 / 0.15)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TriangleAlert,
                    {
                      size: 20,
                      style: { color: "oklch(0.72 0.18 25)" }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Title2,
                {
                  className: "text-base font-bold",
                  style: { color: "oklch(0.90 0.04 243)" },
                  children: "Delete Enquiry?"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Description2,
              {
                className: "text-sm mb-5",
                style: { color: "oklch(0.60 0.04 243)" },
                children: [
                  "This will permanently delete the enquiry from",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "oklch(0.78 0.04 243)" }, children: enquiry.name }),
                  ". This action cannot be undone."
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Cancel, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors",
                  style: { color: "oklch(0.55 0.04 243)" },
                  children: "Cancel"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onDelete(enquiry.id),
                  className: "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  style: {
                    background: "oklch(0.63 0.23 25)",
                    color: "white"
                  },
                  "data-ocid": "enquiry-delete-confirm",
                  children: "Delete"
                }
              ) })
            ] })
          ]
        }
      )
    ] }) })
  ] });
}
const LAB_TYPE_OPTIONS = [
  { value: "all", label: "All Lab Types" },
  { value: "ATL Lab", label: "ATL Lab" },
  { value: "STEM Lab", label: "STEM Lab" },
  { value: "PM SHRI", label: "PM SHRI" },
  { value: "Robotics Lab", label: "Robotics Lab" },
  { value: "Custom", label: "Custom" }
];
function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [priorityFilter, setPriorityFilter] = reactExports.useState("all");
  const [labTypeFilter, setLabTypeFilter] = reactExports.useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = reactExports.useState(
    null
  );
  reactExports.useEffect(() => {
    const unsub = subscribeToEnquiries((data) => {
      setEnquiries(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return enquiries.filter((e) => {
      if (q && !e.name.toLowerCase().includes(q) && !e.email.toLowerCase().includes(q) && !e.labType.toLowerCase().includes(q)) {
        return false;
      }
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (priorityFilter !== "all" && e.priority !== priorityFilter)
        return false;
      if (labTypeFilter !== "all" && e.labType !== labTypeFilter) return false;
      return true;
    });
  }, [enquiries, search, statusFilter, priorityFilter, labTypeFilter]);
  const stats = reactExports.useMemo(
    () => ({
      total: enquiries.length,
      newCount: enquiries.filter((e) => e.status === "new").length,
      contacted: enquiries.filter((e) => e.status === "contacted").length,
      closed: enquiries.filter((e) => e.status === "closed").length
    }),
    [enquiries]
  );
  async function handleQuickStatus(enquiry, newStatus) {
    try {
      const updates = { status: newStatus };
      if (enquiry.status === "new" && !enquiry.respondedAt) {
        updates.respondedAt = (/* @__PURE__ */ new Date()).toISOString();
      }
      await updateEnquiry(enquiry.id, updates);
      ue.success(`Marked as ${newStatus}`);
    } catch {
      ue.error("Failed to update status");
    }
  }
  async function handleDelete(id) {
    try {
      await deleteEnquiry(id);
      ue.success("Enquiry deleted");
      setSelectedEnquiry(null);
    } catch {
      ue.error("Failed to delete enquiry");
    }
  }
  const statCards = [
    {
      key: "total",
      label: "Total Enquiries",
      value: stats.total,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { size: 18 }),
      color: "oklch(0.60 0.14 243)",
      glow: "oklch(0.50 0.14 243 / 0.15)"
    },
    {
      key: "new",
      label: "New / Unread",
      value: stats.newCount,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 18 }),
      color: "oklch(0.72 0.14 243)",
      glow: "oklch(0.50 0.14 243 / 0.12)"
    },
    {
      key: "contacted",
      label: "Contacted",
      value: stats.contacted,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18 }),
      color: "oklch(0.82 0.14 68)",
      glow: "oklch(0.76 0.17 68 / 0.12)"
    },
    {
      key: "closed",
      label: "Closed",
      value: stats.closed,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
      color: "oklch(0.72 0.17 145)",
      glow: "oklch(0.55 0.17 145 / 0.12)"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35 },
          className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "text-2xl font-bold tracking-tight",
                  style: { color: "oklch(0.92 0.06 243)" },
                  children: "Enquiries & Leads"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm mt-0.5",
                  style: { color: "oklch(0.55 0.04 243)" },
                  children: "Manage lab setup enquiries and customer leads"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold self-start sm:self-auto",
                style: {
                  background: "oklch(0.71 0.17 48 / 0.12)",
                  color: "oklch(0.82 0.13 48)",
                  border: "1px solid oklch(0.71 0.17 48 / 0.25)"
                },
                "data-ocid": "enquiries-total-badge",
                children: [
                  stats.total,
                  " total"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay: 0.05 },
          className: "grid grid-cols-2 lg:grid-cols-4 gap-3",
          children: statCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4",
              style: {
                background: "oklch(0.13 0.04 243 / 0.8)",
                border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                boxShadow: `0 4px 20px ${card.glow}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-semibold uppercase tracking-widest",
                      style: { color: "oklch(0.45 0.04 243)" },
                      children: card.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: card.color }, children: card.icon })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", style: { color: card.color }, children: card.value })
              ]
            },
            card.key
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3, delay: 0.1 },
          className: "rounded-xl p-4",
          style: {
            background: "oklch(0.12 0.04 243 / 0.9)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Search,
                {
                  size: 15,
                  className: "absolute left-3 top-1/2 -translate-y-1/2",
                  style: { color: "oklch(0.45 0.04 243)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search by name, email, or lab type…",
                  className: "w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2",
                  style: {
                    background: "oklch(0.14 0.03 243 / 0.8)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                    color: "oklch(0.78 0.04 243)"
                  },
                  "data-ocid": "enquiries-search"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StyledSelect,
              {
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: "all", label: "All Status" },
                  { value: "new", label: "New" },
                  { value: "contacted", label: "Contacted" },
                  { value: "closed", label: "Closed" }
                ],
                placeholder: "All Status"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StyledSelect,
              {
                value: priorityFilter,
                onChange: setPriorityFilter,
                options: [
                  { value: "all", label: "All Priority" },
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" }
                ],
                placeholder: "All Priority"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StyledSelect,
              {
                value: labTypeFilter,
                onChange: setLabTypeFilter,
                options: LAB_TYPE_OPTIONS,
                placeholder: "All Lab Types"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3, delay: 0.15 },
          children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(EnquirySkeleton, {}) : filtered.length === 0 ? (
            /* Empty State */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-2xl p-12 flex flex-col items-center justify-center text-center",
                style: {
                  background: "oklch(0.12 0.04 243 / 0.6)",
                  border: "1px dashed oklch(0.25 0.05 243 / 0.5)"
                },
                "data-ocid": "enquiries-empty",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                      style: { background: "oklch(0.50 0.14 243 / 0.12)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { size: 28, style: { color: "oklch(0.60 0.12 243)" } })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "text-base font-semibold mb-1",
                      style: { color: "oklch(0.70 0.04 243)" },
                      children: search || statusFilter !== "all" || priorityFilter !== "all" ? "No matching enquiries" : "No enquiries yet"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "oklch(0.45 0.04 243)" }, children: search || statusFilter !== "all" || priorityFilter !== "all" ? "Try adjusting your filters to see more results." : "Lab setup enquiries from the website will appear here." })
                ]
              }
            )
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((enquiry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: -8 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.25, delay: index * 0.04 },
              className: "rounded-xl overflow-hidden group",
              style: {
                background: `linear-gradient(90deg, ${getPriorityBg(enquiry.priority)}, oklch(0.13 0.04 243 / 0.7))`,
                border: "1px solid oklch(0.20 0.04 243 / 0.6)",
                borderLeft: `4px solid ${getPriorityBorderColor(enquiry.priority)}`
              },
              "data-ocid": `enquiry-row-${enquiry.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-semibold text-sm",
                        style: { color: "oklch(0.88 0.04 243)" },
                        children: enquiry.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: enquiry.status }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityBadge, { priority: enquiry.priority }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LabTypeBadge, { labType: enquiry.labType })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-3 text-xs flex-wrap",
                      style: { color: "oklch(0.52 0.04 243)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 11 }),
                          enquiry.email
                        ] }),
                        enquiry.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                          enquiry.phone
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(enquiry.createdAt) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs leading-relaxed line-clamp-2",
                      style: { color: "oklch(0.60 0.04 243)" },
                      children: enquiry.message.length > 100 ? `${enquiry.message.substring(0, 100)}…` : enquiry.message
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap", children: [
                  enquiry.status === "new" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleQuickStatus(enquiry, "contacted"),
                      className: "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105",
                      style: {
                        background: "oklch(0.76 0.17 68 / 0.15)",
                        color: "oklch(0.82 0.14 68)",
                        border: "1px solid oklch(0.76 0.17 68 / 0.30)"
                      },
                      "data-ocid": `enquiry-contacted-${enquiry.id}`,
                      children: "Mark Contacted"
                    }
                  ),
                  enquiry.status !== "closed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleQuickStatus(enquiry, "closed"),
                      className: "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105",
                      style: {
                        background: "oklch(0.55 0.17 145 / 0.12)",
                        color: "oklch(0.72 0.17 145)",
                        border: "1px solid oklch(0.55 0.17 145 / 0.25)"
                      },
                      "data-ocid": `enquiry-close-${enquiry.id}`,
                      children: "Close"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedEnquiry(enquiry),
                      className: "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.20), oklch(0.76 0.16 72 / 0.15))",
                        color: "oklch(0.85 0.12 48)",
                        border: "1px solid oklch(0.71 0.17 48 / 0.30)"
                      },
                      "data-ocid": `enquiry-view-${enquiry.id}`,
                      children: "View"
                    }
                  )
                ] })
              ] }) })
            },
            enquiry.id
          )) })
        }
      )
    ] }),
    selectedEnquiry && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EnquiryDetailDialog,
      {
        enquiry: selectedEnquiry,
        onClose: () => setSelectedEnquiry(null),
        onDelete: handleDelete
      }
    )
  ] });
}
export {
  AdminEnquiriesPage as default
};
