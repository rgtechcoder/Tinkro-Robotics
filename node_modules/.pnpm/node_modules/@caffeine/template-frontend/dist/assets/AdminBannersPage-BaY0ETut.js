import { h as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, N as Calendar, m as motion, A as AnimatePresence, O as Clock, aj as CircleAlert, o as ue } from "./index-O-oxzsBJ.js";
import { A as AdminLayout, I as Image } from "./AdminLayout-DnmFTD6u.js";
import { D as Dialog, h as DialogContent, i as DialogHeader, j as DialogTitle, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./dialog-Doq3vSOq.js";
import { I as Input } from "./input-CA2Kh0PP.js";
import { L as Label } from "./label-CaWhKRKy.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D6lSXJPm.js";
import { S as Switch } from "./switch-zaxM8ZEj.js";
import { T as Textarea } from "./textarea-1JrWIcUD.js";
import { P as Plus } from "./plus-DaZED7tD.js";
import { E as ExternalLink } from "./external-link-0xBpMtII.js";
import { P as Pencil } from "./pencil-B8gfMpCg.js";
import { T as Trash2 } from "./trash-2-CTLSMskq.js";
import { U as Upload } from "./upload-CzCFB2EH.js";
import "./ticket-DhyR_LGt.js";
import "./index-Cu6viimg.js";
import "./index-IUus9vKR.js";
import "./index-CSV6Uy9i.js";
import "./index-DszSdnxd.js";
import "./chevron-up-Id0BodQe.js";
import "./index-ljXxS_F9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83", key: "1bzlo9" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21", key: "1q0aeu" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15", key: "5mozeu" }],
  [
    "path",
    {
      d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
      key: "mmje98"
    }
  ],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9", key: "43el77" }]
];
const ImageOff = createLucideIcon("image-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m3 11 18-5v12L3 14v-3z", key: "n962bs" }],
  ["path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6", key: "1yl0tm" }]
];
const Megaphone = createLucideIcon("megaphone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M9 21V9", key: "1oto5p" }]
];
const PanelsTopLeft = createLucideIcon("panels-top-left", __iconNode);
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];
function getBannerStatus(banner) {
  if (!banner.isActive) return "inactive";
  const now = /* @__PURE__ */ new Date();
  if (banner.scheduledFrom && new Date(banner.scheduledFrom) > now)
    return "scheduled";
  if (banner.scheduledTo && new Date(banner.scheduledTo) < now)
    return "expired";
  return "active";
}
const STATUS_CONFIG = {
  active: {
    label: "Active",
    borderColor: "border-l-emerald-500",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
  },
  scheduled: {
    label: "Scheduled",
    borderColor: "border-l-amber-500",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30"
  },
  expired: {
    label: "Expired",
    borderColor: "border-l-red-500",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/30"
  },
  inactive: {
    label: "Inactive",
    borderColor: "border-l-muted-foreground",
    badgeClass: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30"
  }
};
const TYPE_CONFIG = {
  banner: {
    label: "Banner",
    badgeClass: "bg-primary/15 text-primary border-primary/30"
  },
  popup: {
    label: "Popup",
    badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30"
  }
};
const EMPTY_FORM = {
  title: "",
  description: "",
  type: "banner",
  position: "center",
  ctaText: "",
  ctaLink: "",
  isActive: true,
  scheduledFrom: "",
  scheduledTo: ""
};
function StatCard({
  label,
  value,
  icon: Icon,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      className: "rounded-xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-2xl font-bold text-foreground", children: value })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg p-2.5 ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) })
      ] })
    }
  );
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse rounded-xl border border-border/40 bg-card/60 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-muted/60" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted/60 rounded w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted/40 rounded w-1/2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 bg-muted/60 rounded-full w-16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 bg-muted/40 rounded-full w-20" })
      ] })
    ] })
  ] });
}
function AdminBannersPage() {
  const [banners, setBanners] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filter, setFilter] = reactExports.useState("all");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editingBanner, setEditingBanner] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [errors, setErrors] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState("");
  const [uploadingImage, setUploadingImage] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const unsub = subscribeToBanners((data) => {
      setBanners(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  const filtered = banners.filter(
    (b) => filter === "all" ? true : b.type === filter
  );
  const stats = {
    total: banners.length,
    active: banners.filter((b) => getBannerStatus(b) === "active").length,
    scheduled: banners.filter((b) => getBannerStatus(b) === "scheduled").length
  };
  function openCreate() {
    setEditingBanner(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  }
  function openEdit(banner) {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      description: banner.description ?? "",
      type: banner.type,
      position: banner.position ?? "center",
      ctaText: banner.ctaText ?? "",
      ctaLink: banner.ctaLink ?? "",
      isActive: banner.isActive,
      scheduledFrom: banner.scheduledFrom ?? "",
      scheduledTo: banner.scheduledTo ?? ""
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(banner.imageUrl ?? "");
    setDialogOpen(true);
  }
  function handleImageChange(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || void 0,
        type: form.type,
        position: form.type === "popup" ? form.position : void 0,
        ctaText: form.ctaText.trim() || void 0,
        ctaLink: form.ctaLink.trim() || void 0,
        isActive: form.isActive,
        scheduledFrom: form.scheduledFrom || void 0,
        scheduledTo: form.scheduledTo || void 0,
        imageUrl: (editingBanner == null ? void 0 : editingBanner.imageUrl) ?? void 0
      };
      let bannerId = (editingBanner == null ? void 0 : editingBanner.id) ?? "";
      if (!editingBanner) {
        bannerId = await addBanner(payload);
      } else {
        await updateBanner(editingBanner.id, payload);
      }
      if (imageFile) {
        setUploadingImage(true);
        const url = await uploadBannerImage(imageFile, bannerId);
        await updateBanner(bannerId, { imageUrl: url });
        setUploadingImage(false);
      }
      ue.success(
        editingBanner ? "Banner updated successfully" : "Banner created successfully"
      );
      setDialogOpen(false);
    } catch (err) {
      ue.error("Failed to save banner. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  }
  async function handleToggleActive(banner) {
    try {
      await updateBanner(banner.id, { isActive: !banner.isActive });
      ue.success(`Banner ${banner.isActive ? "deactivated" : "activated"}`);
    } catch {
      ue.error("Failed to update banner status");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBanner(deleteTarget.id);
      ue.success("Banner deleted successfully");
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Banners & Popups" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage homepage banners, promotional offers, and popup campaigns" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openCreate,
            "data-ocid": "banners-create-btn",
            className: "gap-2 bg-[image:var(--gradient-orange)] text-white shadow-md hover:opacity-90 transition-opacity",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "Create Banner"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Banners",
            value: stats.total,
            icon: PanelsTopLeft,
            color: "bg-primary/10 text-primary"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Active Now",
            value: stats.active,
            icon: Megaphone,
            color: "bg-emerald-500/10 text-emerald-500"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Scheduled",
            value: stats.scheduled,
            icon: Calendar,
            color: "bg-amber-500/10 text-amber-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 border-b border-border/40 pb-1", children: ["all", "banner", "popup"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setFilter(tab),
          "data-ocid": `banners-filter-${tab}`,
          className: `rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${filter === tab ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: tab === "all" ? "All" : `${tab}s`
        },
        tab
      )) }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: SKELETON_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, key)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 py-20 text-center",
          "data-ocid": "banners-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "mb-3 h-10 w-10 text-muted-foreground/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground", children: "No banners found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: filter === "all" ? "Create your first banner or popup to get started" : `No ${filter}s yet. Create one above.` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: openCreate,
                className: "mt-4 gap-2",
                variant: "outline",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  " Create Banner"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: filtered.map((banner, idx) => {
        const status = getBannerStatus(banner);
        const statusCfg = STATUS_CONFIG[status];
        const typeCfg = TYPE_CONFIG[banner.type];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95 },
            transition: { delay: idx * 0.05 },
            className: `rounded-xl border-l-4 border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden ${statusCfg.borderColor}`,
            "data-ocid": `banner-card-${banner.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `relative overflow-hidden bg-muted/30 ${banner.type === "popup" ? "aspect-square" : "aspect-[16/5]"}`,
                  children: [
                    banner.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: banner.imageUrl,
                        alt: banner.title,
                        className: "h-full w-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8 text-muted-foreground/40" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${typeCfg.badgeClass}`,
                        children: typeCfg.label
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground leading-tight line-clamp-1", children: banner.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusCfg.badgeClass}`,
                      children: statusCfg.label
                    }
                  )
                ] }),
                banner.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: banner.description }),
                banner.ctaText && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                    banner.ctaText,
                    banner.ctaLink && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1", children: [
                      "→ ",
                      banner.ctaLink
                    ] })
                  ] })
                ] }),
                (banner.scheduledFrom ?? banner.scheduledTo) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                    banner.scheduledFrom ? new Date(
                      banner.scheduledFrom
                    ).toLocaleDateString() : "∞",
                    " → ",
                    banner.scheduledTo ? new Date(
                      banner.scheduledTo
                    ).toLocaleDateString() : "∞"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border/30 pt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        id: `toggle-${banner.id}`,
                        checked: banner.isActive,
                        onCheckedChange: () => handleToggleActive(banner),
                        "data-ocid": `banner-toggle-${banner.id}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: `toggle-${banner.id}`,
                        className: "text-xs text-muted-foreground cursor-pointer select-none",
                        children: banner.isActive ? "Active" : "Inactive"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        onClick: () => openEdit(banner),
                        "data-ocid": `banner-edit-${banner.id}`,
                        className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                        "aria-label": "Edit banner",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        onClick: () => setDeleteTarget(banner),
                        "data-ocid": `banner-delete-${banner.id}`,
                        className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                        "aria-label": "Delete banner",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] })
                ] })
              ] })
            ]
          },
          banner.id
        );
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingBanner ? "Edit Banner" : "Create Banner" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "banner-title", children: [
            "Title ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "banner-title",
              "data-ocid": "banner-form-title",
              placeholder: "Summer Sale Banner",
              value: form.title,
              onChange: (e) => setForm((f) => ({ ...f, title: e.target.value }))
            }
          ),
          errors.title && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 text-xs text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
            " ",
            errors.title
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "banner-desc", children: "Description (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "banner-desc",
              "data-ocid": "banner-form-description",
              placeholder: "Short description shown on the banner...",
              rows: 2,
              value: form.description,
              onChange: (e) => setForm((f) => ({ ...f, description: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "banner-type", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.type,
                onValueChange: (v) => setForm((f) => ({ ...f, type: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "banner-type", "data-ocid": "banner-form-type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "banner", children: "Banner" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "popup", children: "Popup" })
                  ] })
                ]
              }
            )
          ] }),
          form.type === "popup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "banner-position", children: "Position" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.position,
                onValueChange: (v) => setForm((f) => ({
                  ...f,
                  position: v
                })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "banner-position",
                      "data-ocid": "banner-form-position",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "top", children: "Top" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "center", children: "Center" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bottom", children: "Bottom" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "banner-cta-text", children: "CTA Button Text" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "banner-cta-text",
                "data-ocid": "banner-form-cta-text",
                placeholder: "Shop Now",
                value: form.ctaText,
                onChange: (e) => setForm((f) => ({ ...f, ctaText: e.target.value }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "banner-cta-link", children: "CTA Link / URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "banner-cta-link",
                "data-ocid": "banner-form-cta-link",
                placeholder: "/products",
                value: form.ctaLink,
                onChange: (e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "banner-from", children: "Schedule From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "banner-from",
                type: "datetime-local",
                "data-ocid": "banner-form-schedule-from",
                value: form.scheduledFrom,
                onChange: (e) => setForm((f) => ({ ...f, scheduledFrom: e.target.value }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "banner-to", children: "Schedule To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "banner-to",
                type: "datetime-local",
                "data-ocid": "banner-form-schedule-to",
                value: form.scheduledTo,
                onChange: (e) => setForm((f) => ({ ...f, scheduledTo: e.target.value }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "banner-active",
              checked: form.isActive,
              onCheckedChange: (v) => setForm((f) => ({ ...f, isActive: v })),
              "data-ocid": "banner-form-active"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "banner-active",
              className: "text-sm font-medium cursor-pointer select-none",
              children: "Active"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: form.isActive ? "Visible to users" : "Hidden from users" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Banner Image (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: handleImageChange,
              "data-ocid": "banner-form-image-input"
            }
          ),
          imagePreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-lg border border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: imagePreview,
                alt: "Preview",
                className: `w-full object-cover ${form.type === "popup" ? "aspect-square" : "aspect-[16/5]"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setImageFile(null);
                  setImagePreview("");
                },
                className: "absolute top-2 right-2 rounded-full bg-background/80 p-1 text-xs text-muted-foreground hover:text-destructive",
                "aria-label": "Remove image",
                type: "button",
                children: "✕"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              className: "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 bg-muted/20 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
              "data-ocid": "banner-form-image-upload",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6" }),
                "Click to upload image"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setDialogOpen(false),
              disabled: saving,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: saving || uploadingImage,
              "data-ocid": "banner-form-save",
              className: "gap-2 bg-[image:var(--gradient-orange)] text-white hover:opacity-90",
              children: saving || uploadingImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }),
                uploadingImage ? "Uploading..." : "Saving..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: editingBanner ? "Save Changes" : "Create Banner" })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => !open && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Banner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              "Are you sure you want to delete",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                '"',
                deleteTarget == null ? void 0 : deleteTarget.title,
                '"'
              ] }),
              "? This action cannot be undone."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: deleting, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleDelete,
                disabled: deleting,
                "data-ocid": "banner-delete-confirm",
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                children: deleting ? "Deleting..." : "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminBannersPage as default
};
