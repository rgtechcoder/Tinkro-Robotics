import { r as reactExports, j as jsxRuntimeExports, m as motion, ap as FlaskConical, A as AnimatePresence, x as ue, T as Tag, v as CircleCheck, X } from "./index-BSySFNaW.js";
import { A as AdminLayout } from "./AdminLayout-2gYHCLuq.js";
import { j as subscribeToLabSetups, k as updateLabSetup, l as deleteLabSetup, m as addLabSetup } from "./adminService-C_DVe4vg.js";
import { R as Root$1, P as Portal, O as Overlay, C as Content, T as Title, a as Close, b as Root2, c as Portal2, d as Overlay2, e as Content2, f as Title2, D as Description2, g as Cancel, A as Action } from "./index-B2YutIn3.js";
import { R as Root, T as Thumb } from "./index-CCeh3MPJ.js";
import { u as useForm } from "./index.esm-samkm5yO.js";
import { P as Plus } from "./plus-BF_zKn_b.js";
import { P as Pencil } from "./pencil-BAiZLvDM.js";
import { T as Trash2 } from "./trash-2-BR965pIM.js";
import "./external-link-BGGFFOjs.js";
import "./ticket-BmOHArP0.js";
import "./Combination-uBPLZVtz.js";
import "./index-CJTyfxIJ.js";
const LAB_TYPE_META = {
  atl: {
    label: "ATL Lab",
    color: "oklch(0.60 0.15 240)",
    bg: "oklch(0.45 0.12 240 / 0.15)",
    border: "oklch(0.45 0.12 240 / 0.55)",
    glow: "oklch(0.45 0.12 240 / 0.20)"
  },
  pmshri: {
    label: "PM SHRI",
    color: "oklch(0.68 0.14 195)",
    bg: "oklch(0.50 0.13 195 / 0.15)",
    border: "oklch(0.50 0.13 195 / 0.55)",
    glow: "oklch(0.50 0.13 195 / 0.20)"
  },
  stem: {
    label: "STEM Lab",
    color: "oklch(0.72 0.16 48)",
    bg: "oklch(0.71 0.17 48 / 0.15)",
    border: "oklch(0.71 0.17 48 / 0.55)",
    glow: "oklch(0.71 0.17 48 / 0.20)"
  },
  robotics: {
    label: "Robotics",
    color: "oklch(0.62 0.19 295)",
    bg: "oklch(0.50 0.18 295 / 0.15)",
    border: "oklch(0.50 0.18 295 / 0.55)",
    glow: "oklch(0.50 0.18 295 / 0.20)"
  }
};
function TypeBadge({ type }) {
  const meta = LAB_TYPE_META[type];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
      style: {
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`
      },
      children: meta.label
    }
  );
}
function ItemChip({
  label,
  onRemove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
      style: {
        background: "oklch(0.22 0.04 243 / 0.7)",
        border: "1px solid oklch(0.35 0.05 243 / 0.4)",
        color: "oklch(0.78 0.05 243)"
      },
      children: [
        label,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            className: "hover:text-red-400 transition-colors",
            "aria-label": `Remove ${label}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 })
          }
        )
      ]
    }
  );
}
function LabPreviewCard({
  name,
  type,
  priceMin,
  priceMax,
  items
}) {
  const meta = LAB_TYPE_META[type];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl p-4",
      style: {
        background: "oklch(0.14 0.03 243 / 0.6)",
        border: `1px solid ${meta.border}`,
        borderLeft: `4px solid ${meta.color}`,
        boxShadow: `0 0 20px ${meta.glow}`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/30 font-mono", children: "Preview" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-white mt-2 mb-1", children: name || "Lab Tier Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-base font-bold mb-2",
            style: {
              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            },
            children: priceMin && priceMax ? `₹${priceMin.toLocaleString("en-IN")} – ₹${priceMax.toLocaleString("en-IN")}` : "₹-- – ₹--"
          }
        ),
        items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-0.5 mb-3", children: [
          items.slice(0, 3).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center gap-1.5 text-[11px] text-white/55",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 10, style: { color: meta.color } }),
                item
              ]
            },
            item
          )),
          items.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-[11px] text-white/35 pl-4", children: [
            "+",
            items.length - 3,
            " more items"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-all",
            style: {
              background: "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.7), oklch(0.76 0.16 72 / 0.7))",
              border: "1px solid oklch(0.71 0.17 48 / 0.35)"
            },
            children: "Get Quote"
          }
        )
      ]
    }
  );
}
function LabSetupModal({ open, onClose, editing }) {
  const [items, setItems] = reactExports.useState([]);
  const [itemInput, setItemInput] = reactExports.useState("");
  const [isActive, setIsActive] = reactExports.useState(true);
  const itemInputRef = reactExports.useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      type: "atl",
      description: "",
      targetAudience: "",
      priceMin: 0,
      priceMax: 0,
      order: 1,
      isActive: true
    }
  });
  const watchedName = watch("name");
  const watchedType = watch("type");
  const watchedMin = watch("priceMin");
  const watchedMax = watch("priceMax");
  reactExports.useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          name: editing.name,
          type: editing.type,
          description: editing.description,
          targetAudience: editing.targetAudience,
          priceMin: editing.priceRange.min,
          priceMax: editing.priceRange.max,
          order: editing.order,
          isActive: editing.isActive
        });
        setItems([...editing.includedItems]);
        setIsActive(editing.isActive);
      } else {
        reset({
          name: "",
          type: "atl",
          description: "",
          targetAudience: "",
          priceMin: 0,
          priceMax: 0,
          order: 1,
          isActive: true
        });
        setItems([]);
        setIsActive(true);
      }
      setItemInput("");
    }
  }, [open, editing, reset]);
  function addItem() {
    var _a;
    const trimmed = itemInput.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
      setItemInput("");
      (_a = itemInputRef.current) == null ? void 0 : _a.focus();
    }
  }
  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }
  async function onSubmit(data) {
    if (items.length < 3) {
      ue.error("Add at least 3 included items.");
      return;
    }
    try {
      const payload = {
        name: data.name,
        type: data.type,
        description: data.description,
        targetAudience: data.targetAudience,
        priceRange: { min: Number(data.priceMin), max: Number(data.priceMax) },
        includedItems: items,
        isActive,
        order: Number(data.order)
      };
      if (editing) {
        await updateLabSetup(editing.id, payload);
        ue.success("Lab tier updated");
      } else {
        await addLabSetup(payload);
        ue.success("Lab tier added successfully");
      }
      onClose();
    } catch {
      ue.error("Failed to save. Please try again.");
    }
  }
  const overlayStyle = {
    background: "oklch(0.05 0.02 243 / 0.80)",
    backdropFilter: "blur(8px)"
  };
  const contentStyle = {
    background: "linear-gradient(160deg, oklch(0.13 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
    boxShadow: "0 25px 60px oklch(0.04 0.02 243 / 0.9), 0 0 0 1px oklch(0.45 0.12 243 / 0.08)"
  };
  const inputStyle = {
    background: "oklch(0.16 0.03 243 / 0.6)",
    border: "1px solid oklch(0.28 0.05 243 / 0.5)",
    color: "oklch(0.90 0.02 243)",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    width: "100%",
    fontSize: "0.875rem",
    outline: "none"
  };
  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "oklch(0.62 0.05 243)",
    marginBottom: "0.35rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };
  const sectionHeadStyle = {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "oklch(0.50 0.08 243)",
    marginBottom: "0.75rem",
    paddingBottom: "0.4rem",
    borderBottom: "1px solid oklch(0.22 0.04 243 / 0.5)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root$1, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { className: "fixed inset-0 z-50", style: overlayStyle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl",
        style: contentStyle,
        "aria-describedby": void 0,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-6 py-4 sticky top-0 z-10",
              style: {
                background: "oklch(0.13 0.04 243 / 0.95)",
                borderBottom: "1px solid oklch(0.22 0.05 243 / 0.4)",
                backdropFilter: "blur(12px)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { className: "text-base font-bold text-white", children: editing ? "Edit Lab Tier" : "Add New Lab Tier" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/35 mt-0.5", children: editing ? `Editing: ${editing.name}` : "Configure a new lab tier for the Labs page" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all",
                    "aria-label": "Close",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: sectionHeadStyle, children: "Basic Info" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lab-name", style: labelStyle, children: "Lab Name *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "lab-name",
                          ...register("name", {
                            required: "Lab name is required"
                          }),
                          placeholder: "e.g. ATL Lab Setup, STEM Lab - Starter Pack",
                          style: inputStyle,
                          "data-ocid": "lab-name-input"
                        }
                      ),
                      errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-1", children: errors.name.message })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lab-type", style: labelStyle, children: "Lab Type *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          id: "lab-type",
                          ...register("type", { required: true }),
                          style: { ...inputStyle, cursor: "pointer" },
                          "data-ocid": "lab-type-select",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "atl", children: "ATL Lab" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pmshri", children: "PM SHRI" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "stem", children: "STEM Lab" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "robotics", children: "Robotics" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lab-description", style: labelStyle, children: "Description" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          id: "lab-description",
                          ...register("description"),
                          rows: 3,
                          placeholder: "Brief description of this lab tier...",
                          style: { ...inputStyle, resize: "vertical" },
                          "data-ocid": "lab-description-input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lab-audience", style: labelStyle, children: "Target Audience" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "lab-audience",
                          ...register("targetAudience"),
                          placeholder: "e.g. Schools, ATL Labs, CBSE schools",
                          style: inputStyle,
                          "data-ocid": "lab-audience-input"
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: sectionHeadStyle, children: "Pricing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lab-price-min", style: labelStyle, children: "Price Min ₹ *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "lab-price-min",
                          type: "number",
                          ...register("priceMin", {
                            required: "Required",
                            min: { value: 0, message: "Must be ≥ 0" },
                            valueAsNumber: true
                          }),
                          placeholder: "50000",
                          style: inputStyle,
                          "data-ocid": "lab-price-min-input"
                        }
                      ),
                      errors.priceMin && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-1", children: errors.priceMin.message })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lab-price-max", style: labelStyle, children: "Price Max ₹ *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "lab-price-max",
                          type: "number",
                          ...register("priceMax", {
                            required: "Required",
                            validate: (v) => Number(v) >= Number(watchedMin) || "Must be ≥ min price",
                            valueAsNumber: true
                          }),
                          placeholder: "150000",
                          style: inputStyle,
                          "data-ocid": "lab-price-max-input"
                        }
                      ),
                      errors.priceMax && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-1", children: errors.priceMax.message })
                    ] })
                  ] }),
                  watchedMin > 0 && watchedMax >= watchedMin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "mt-2 text-sm font-bold",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      },
                      children: [
                        "₹",
                        Number(watchedMin).toLocaleString("en-IN"),
                        " – ₹",
                        Number(watchedMax).toLocaleString("en-IN")
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: sectionHeadStyle, children: [
                    "Included Items",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case font-normal text-white/25 ml-1", children: "(min 3)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: itemInputRef,
                        value: itemInput,
                        onChange: (e) => setItemInput(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addItem();
                          }
                        },
                        placeholder: "e.g. Arduino Mega 2560",
                        style: { ...inputStyle, flex: 1 },
                        "data-ocid": "lab-item-input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: addItem,
                        className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90",
                        style: {
                          background: "linear-gradient(135deg, oklch(0.45 0.12 243), oklch(0.55 0.13 195))",
                          border: "1px solid oklch(0.45 0.12 243 / 0.4)",
                          whiteSpace: "nowrap"
                        },
                        "data-ocid": "lab-add-item-btn",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                          "Add"
                        ]
                      }
                    )
                  ] }),
                  items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/30 italic", children: "No items added yet. Add at least 3." }),
                  items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ItemChip,
                    {
                      label: item,
                      onRemove: () => removeItem(items.indexOf(item))
                    },
                    item
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: sectionHeadStyle, children: "Settings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lab-order", style: labelStyle, children: "Display Order" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          id: "lab-order",
                          type: "number",
                          ...register("order", { valueAsNumber: true, min: 1 }),
                          placeholder: "1",
                          style: { ...inputStyle },
                          "data-ocid": "lab-order-input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/25 mt-1", children: "Lower number = appears first on Labs page" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "lab-active-toggle", style: labelStyle, children: "Active on Frontend" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Root,
                          {
                            checked: isActive,
                            onCheckedChange: setIsActive,
                            "data-ocid": "lab-active-toggle",
                            className: "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none",
                            style: {
                              background: isActive ? "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.60 0.16 155))" : "oklch(0.25 0.03 243)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { className: "block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 data-[state=checked]:translate-x-5" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-xs font-semibold",
                            style: {
                              color: isActive ? "oklch(0.72 0.16 145)" : "oklch(0.45 0.03 243)"
                            },
                            children: isActive ? "Active" : "Inactive"
                          }
                        )
                      ] })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: sectionHeadStyle, children: "Frontend Preview" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LabPreviewCard,
                  {
                    name: watchedName,
                    type: watchedType,
                    priceMin: Number(watchedMin),
                    priceMax: Number(watchedMax),
                    items
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/25 text-center", children: "This is how the tier will appear on the Labs page" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-end gap-3 px-6 py-4 sticky bottom-0",
                style: {
                  background: "oklch(0.11 0.04 243 / 0.95)",
                  borderTop: "1px solid oklch(0.22 0.05 243 / 0.4)",
                  backdropFilter: "blur(12px)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all",
                      children: "Cancel"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "submit",
                      disabled: isSubmitting,
                      className: "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                        boxShadow: "0 0 16px oklch(0.71 0.17 48 / 0.35)"
                      },
                      "data-ocid": "lab-save-btn",
                      children: [
                        isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15 }),
                        editing ? "Save Changes" : "Add Lab Tier"
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
function DeleteDialog({
  open,
  labName,
  onConfirm,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { open, onOpenChange: (v) => !v && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal2, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Overlay2,
      {
        className: "fixed inset-0 z-50",
        style: {
          background: "oklch(0.05 0.02 243 / 0.75)",
          backdropFilter: "blur(6px)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content2,
      {
        className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm rounded-2xl p-6",
        style: {
          background: "linear-gradient(160deg, oklch(0.13 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
          border: "1px solid oklch(0.55 0.22 25 / 0.3)",
          boxShadow: "0 20px 50px oklch(0.04 0.02 243 / 0.9)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-10 h-10 rounded-full flex items-center justify-center mb-4",
              style: {
                background: "oklch(0.55 0.22 25 / 0.15)",
                border: "1px solid oklch(0.55 0.22 25 / 0.3)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 18, style: { color: "oklch(0.68 0.20 25)" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Title2, { className: "text-base font-bold text-white mb-1.5", children: [
            "Delete ",
            labName,
            "?"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Description2, { className: "text-sm text-white/45 mb-5", children: "This will permanently remove it from the Labs page. This action cannot be undone." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cancel, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onCancel,
                className: "flex-1 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white transition-all",
                style: {
                  background: "oklch(0.18 0.03 243)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.4)"
                },
                children: "Cancel"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onConfirm,
                className: "flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90",
                style: {
                  background: "linear-gradient(135deg, oklch(0.50 0.22 25), oklch(0.55 0.20 30))"
                },
                "data-ocid": "lab-delete-confirm-btn",
                children: "Delete"
              }
            ) })
          ] })
        ]
      }
    )
  ] }) });
}
function LabCard({
  lab,
  index,
  onEdit,
  onDelete,
  onToggleActive
}) {
  const meta = LAB_TYPE_META[lab.type];
  const PREVIEW_COUNT = 4;
  const extraCount = lab.includedItems.length - PREVIEW_COUNT;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.07 },
      className: "relative rounded-2xl overflow-hidden",
      style: {
        background: "linear-gradient(160deg, oklch(0.14 0.04 243 / 0.85) 0%, oklch(0.11 0.03 250 / 0.90) 100%)",
        border: `1px solid ${meta.border}`,
        borderLeft: `4px solid ${meta.color}`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 8px 30px ${meta.glow}, 0 0 0 1px oklch(0.25 0.05 243 / 0.08)`
      },
      "data-ocid": `lab-card-${lab.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between px-5 pt-4 pb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: lab.type }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[10px] font-mono px-2 py-0.5 rounded",
                style: {
                  background: "oklch(0.20 0.03 243)",
                  color: "oklch(0.45 0.05 243)"
                },
                children: [
                  "Order #",
                  lab.order
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Root,
              {
                checked: lab.isActive,
                onCheckedChange: () => onToggleActive(lab),
                "data-ocid": `lab-toggle-${lab.id}`,
                className: "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                style: {
                  background: lab.isActive ? "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.60 0.16 155))" : "oklch(0.22 0.03 243)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { className: "block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 data-[state=checked]:translate-x-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-3 pb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-white leading-tight truncate", children: lab.name }),
          lab.targetAudience && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40 mt-0.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 10, className: "shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: lab.targetAudience })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-xl font-bold tracking-tight",
            style: {
              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            },
            children: [
              "₹",
              lab.priceRange.min.toLocaleString("en-IN"),
              " – ₹",
              lab.priceRange.max.toLocaleString("en-IN")
            ]
          }
        ) }),
        lab.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 pb-2 text-xs text-white/40 line-clamp-2", children: lab.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-[10px] font-semibold uppercase tracking-wider mb-2",
              style: { color: "oklch(0.48 0.06 243)" },
              children: [
                "Included Items (",
                lab.includedItems.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: lab.includedItems.slice(0, PREVIEW_COUNT).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center gap-1.5 text-xs text-white/55",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleCheck,
                  {
                    size: 11,
                    style: { color: meta.color, flexShrink: 0 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: item })
              ]
            },
            item
          )) }),
          extraCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-white/30 mt-1 pl-5", children: [
            "+",
            extraCount,
            " more"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-5 py-3",
            style: { borderTop: "1px solid oklch(0.22 0.04 243 / 0.5)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                  style: lab.isActive ? {
                    background: "oklch(0.55 0.18 145 / 0.15)",
                    color: "oklch(0.70 0.16 145)",
                    border: "1px solid oklch(0.55 0.18 145 / 0.3)"
                  } : {
                    background: "oklch(0.22 0.03 243 / 0.5)",
                    color: "oklch(0.45 0.03 243)",
                    border: "1px solid oklch(0.30 0.04 243 / 0.4)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "w-1.5 h-1.5 rounded-full",
                        style: {
                          background: lab.isActive ? "oklch(0.65 0.18 145)" : "oklch(0.35 0.03 243)"
                        }
                      }
                    ),
                    lab.isActive ? "Active" : "Inactive"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onEdit(lab),
                    className: "p-2 rounded-lg transition-all",
                    style: { color: "oklch(0.55 0.05 243)", background: "transparent" },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = "oklch(0.71 0.17 48 / 0.12)";
                      e.currentTarget.style.color = "oklch(0.80 0.14 48)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "oklch(0.55 0.05 243)";
                    },
                    "aria-label": `Edit ${lab.name}`,
                    "data-ocid": `lab-edit-${lab.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 15 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onDelete(lab),
                    className: "p-2 rounded-lg transition-all",
                    style: { color: "oklch(0.55 0.05 243)", background: "transparent" },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = "oklch(0.55 0.22 25 / 0.12)";
                      e.currentTarget.style.color = "oklch(0.68 0.20 25)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "oklch(0.55 0.05 243)";
                    },
                    "aria-label": `Delete ${lab.name}`,
                    "data-ocid": `lab-delete-${lab.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 })
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function EmptyState({ onAdd }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "col-span-2 rounded-2xl p-16 flex flex-col items-center justify-center text-center",
      style: {
        background: "oklch(0.12 0.03 243 / 0.5)",
        border: "1px dashed oklch(0.28 0.05 243 / 0.5)"
      },
      "data-ocid": "lab-empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full",
            style: {
              background: "oklch(0.20 0.04 243 / 0.6)",
              border: "1px solid oklch(0.30 0.05 243 / 0.4)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              FlaskConical,
              {
                className: "h-8 w-8",
                style: { color: "oklch(0.55 0.10 243)" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-white mb-2", children: "No Lab Tiers Yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/40 max-w-xs mb-5", children: "Add your first lab tier to start showcasing lab packages on the Labs page." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: onAdd,
            className: "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90",
            style: {
              background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
              boxShadow: "0 0 20px oklch(0.71 0.17 48 / 0.30)"
            },
            "data-ocid": "lab-empty-add-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
              "Add First Lab Tier"
            ]
          }
        )
      ]
    }
  );
}
function LabCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl overflow-hidden animate-pulse",
      style: {
        background: "oklch(0.13 0.03 243 / 0.6)",
        border: "1px solid oklch(0.22 0.04 243 / 0.5)",
        borderLeft: "4px solid oklch(0.22 0.04 243 / 0.5)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4 pb-2 flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-5 w-20 rounded-full",
              style: { background: "oklch(0.22 0.04 243)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-5 w-16 rounded",
              style: { background: "oklch(0.22 0.04 243)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-2 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-5 w-3/4 rounded",
              style: { background: "oklch(0.20 0.03 243)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-4 w-1/2 rounded",
              style: { background: "oklch(0.18 0.03 243)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-7 w-40 rounded",
              style: { background: "oklch(0.20 0.03 243)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 space-y-1.5", children: ["70%", "60%", "50%"].map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-3.5 rounded",
            style: {
              background: "oklch(0.18 0.03 243)",
              width: w
            }
          },
          w
        )) })
      ]
    }
  );
}
function AdminLabSetupPage() {
  const [labs, setLabs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editingLab, setEditingLab] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const unsub = subscribeToLabSetups((data) => {
      setLabs(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  function handleAdd() {
    setEditingLab(null);
    setModalOpen(true);
  }
  function handleEdit(lab) {
    setEditingLab(lab);
    setModalOpen(true);
  }
  function handleDelete(lab) {
    setDeleteTarget(lab);
  }
  async function handleToggleActive(lab) {
    try {
      await updateLabSetup(lab.id, { isActive: !lab.isActive });
    } catch {
      ue.error("Failed to update status.");
    }
  }
  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteLabSetup(deleteTarget.id);
      ue.success("Lab tier deleted");
    } catch {
      ue.error("Failed to delete. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  }
  const activeCount = labs.filter((l) => l.isActive).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin-lab-setup-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "p-2 rounded-lg",
                    style: {
                      background: "oklch(0.45 0.12 243 / 0.15)",
                      border: "1px solid oklch(0.45 0.12 243 / 0.3)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FlaskConical,
                      {
                        size: 18,
                        style: { color: "oklch(0.68 0.12 243)" }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-white", children: "Lab Setup Management" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/40 ml-0.5", children: [
                "Manage lab tier configurations shown on the Labs page",
                !loading && labs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "ml-2 font-medium",
                    style: { color: "oklch(0.65 0.10 195)" },
                    children: [
                      "· ",
                      labs.length,
                      " tiers, ",
                      activeCount,
                      " active"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleAdd,
                className: "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0",
                style: {
                  background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                  boxShadow: "0 0 20px oklch(0.71 0.17 48 / 0.30)",
                  border: "1px solid oklch(0.71 0.17 48 / 0.35)"
                },
                "data-ocid": "lab-add-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                  "Add Lab Tier"
                ]
              }
            )
          ]
        }
      ),
      !loading && labs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3, delay: 0.1 },
          className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
          children: ["atl", "pmshri", "stem", "robotics"].map(
            (type) => {
              const count = labs.filter((l) => l.type === type).length;
              const meta = LAB_TYPE_META[type];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-xl px-4 py-3",
                  style: {
                    background: "oklch(0.13 0.03 243 / 0.7)",
                    border: `1px solid ${meta.border}`
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[10px] uppercase tracking-wider font-semibold mb-0.5",
                        style: { color: meta.color },
                        children: meta.label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-white", children: count }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/30", children: count === 1 ? "tier" : "tiers" })
                  ]
                },
                type
              );
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: ["sk1", "sk2", "sk3", "sk4"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(LabCardSkeleton, {}, sk)) }) : labs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onAdd: handleAdd }) : labs.map((lab, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        LabCard,
        {
          lab,
          index: idx,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onToggleActive: handleToggleActive
        },
        lab.id
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LabSetupModal,
      {
        open: modalOpen,
        onClose: () => setModalOpen(false),
        editing: editingLab
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteDialog,
      {
        open: !!deleteTarget,
        labName: (deleteTarget == null ? void 0 : deleteTarget.name) ?? "",
        onConfirm: confirmDelete,
        onCancel: () => setDeleteTarget(null)
      }
    )
  ] });
}
export {
  AdminLabSetupPage as default
};
