import { h as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, B as Button, a2 as Layers, o as ue, P as Package, a7 as getStorage, X, a3 as ref, a5 as uploadBytes, a6 as getDownloadURL } from "./index-O-oxzsBJ.js";
import { A as AdminLayout } from "./AdminLayout-DnmFTD6u.js";
import { I as Input } from "./input-CA2Kh0PP.js";
import { L as Label } from "./label-CaWhKRKy.js";
import { S as Switch } from "./switch-zaxM8ZEj.js";
import { T as Textarea } from "./textarea-1JrWIcUD.js";
import { b as subscribeToCategories, a as subscribeToProducts, e as updateCategory, f as deleteCategory, g as addCategory } from "./adminService-CrzWrGgp.js";
import { R as Root, a as Portal, O as Overlay, C as Content, T as Title, b as Close, c as Root2, d as Portal2, e as Overlay2, f as Content2, g as Title2, D as Description2, h as Cancel, A as Action } from "./index-Cu6viimg.js";
import { u as useForm, a as useWatch } from "./index.esm-BlSMmrQ4.js";
import { P as Plus } from "./plus-DaZED7tD.js";
import { T as Trash2 } from "./trash-2-CTLSMskq.js";
import { L as LoaderCircle } from "./loader-circle-DqdZu0w_.js";
import { I as ImagePlus } from "./image-plus-DKdodqpC.js";
import "./external-link-0xBpMtII.js";
import "./ticket-DhyR_LGt.js";
import "./index-ljXxS_F9.js";
import "./index-IUus9vKR.js";
import "./index-DszSdnxd.js";
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
const BRAND_COLORS = [
  "#2E6DA4",
  "#3BBFBF",
  "#F47B20",
  "#F5A623",
  "#6366F1",
  "#10B981",
  "#EC4899",
  "#8B5CF6"
];
function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function CategoryCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl overflow-hidden animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28 bg-slate-700/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-32 rounded bg-slate-700/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-20 rounded bg-slate-700/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full rounded bg-slate-700/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-20 rounded-full bg-slate-700/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-slate-700/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-slate-700/40" })
        ] })
      ] })
    ] })
  ] });
}
function CategoryCard({
  category,
  productCount,
  index,
  onEdit,
  onDelete,
  onToggleActive
}) {
  const accentColor = category.color || "#2E6DA4";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.06, ease: "easeOut" },
      className: "group relative rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl overflow-hidden hover:border-slate-600/60 transition-colors duration-200",
      "data-ocid": `category-card-${category.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative h-28 overflow-hidden",
            style: {
              background: category.imageUrl ? void 0 : `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`
            },
            children: [
              category.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: category.imageUrl,
                  alt: category.name,
                  className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-full flex items-center justify-center",
                  style: { background: `${accentColor}18` },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Layers,
                    {
                      className: "h-10 w-10 opacity-30",
                      style: { color: accentColor }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute bottom-0 left-0 right-0 h-0.5",
                  style: { backgroundColor: accentColor }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                  style: {
                    background: category.isActive ? "oklch(0.25 0.08 142 / 0.8)" : "oklch(0.18 0.03 243 / 0.8)",
                    color: category.isActive ? "oklch(0.80 0.18 142)" : "oklch(0.55 0.04 243)",
                    border: `1px solid ${category.isActive ? "oklch(0.50 0.14 142 / 0.4)" : "oklch(0.30 0.04 243 / 0.4)"}`,
                    backdropFilter: "blur(8px)"
                  },
                  children: category.isActive ? "Active" : "Inactive"
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white text-sm truncate", children: category.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-0.5 truncate font-mono", children: [
                "/",
                category.slug
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-3 w-3 rounded-full mt-1 shrink-0 ring-2 ring-slate-800",
                style: { backgroundColor: accentColor }
              }
            )
          ] }),
          category.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed", children: category.description }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600 italic mb-3", children: "No description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3 w-3" }),
                productCount,
                " product",
                productCount !== 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: category.isActive,
                  onCheckedChange: () => onToggleActive(category),
                  "aria-label": `Toggle ${category.name} active`,
                  "data-ocid": `toggle-active-${category.id}`,
                  className: "scale-75 origin-left"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onEdit(category),
                  className: "h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors duration-150",
                  "aria-label": `Edit ${category.name}`,
                  "data-ocid": `edit-category-${category.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onDelete(category),
                  className: "h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150",
                  "aria-label": `Delete ${category.name}`,
                  "data-ocid": `delete-category-${category.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function CategoryImageZone({
  pending,
  existing,
  uploading,
  progress,
  onSelect,
  onClear
}) {
  const inputRef = reactExports.useRef(null);
  const [dragging, setDragging] = reactExports.useState(false);
  const previewSrc = (pending == null ? void 0 : pending.preview) ?? existing ?? "";
  function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      ue.error("Only JPEG, PNG, or WebP allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      ue.error("Image exceeds 5 MB limit");
      return;
    }
    onSelect(file);
  }
  if (previewSrc) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-36 rounded-xl overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: previewSrc,
          alt: "Category banner preview",
          className: "w-full h-full object-cover"
        }
      ),
      uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-3/4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-white/20 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-400",
              style: { width: `${progress}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/70 text-center mt-1", children: [
            Math.round(progress),
            "%"
          ] })
        ] })
      ] }),
      !uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              var _a;
              return (_a = inputRef.current) == null ? void 0 : _a.click();
            },
            className: "px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-colors",
            children: "Replace"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClear,
            className: "p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors",
            "aria-label": "Remove image",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "file",
          accept: "image/jpeg,image/png,image/webp",
          className: "hidden",
          onChange: (e) => handleFiles(e.target.files)
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "aria-label": "Upload category image",
      onDragOver: (e) => {
        e.preventDefault();
        setDragging(true);
      },
      onDragLeave: () => setDragging(false),
      onDrop: (e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      },
      onClick: () => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.click();
      },
      "data-ocid": "category-image-upload-zone",
      className: "relative w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-200 h-28 text-sm select-none outline-none focus-visible:ring-2",
      style: {
        borderColor: dragging ? "oklch(0.71 0.17 48 / 0.7)" : "oklch(0.30 0.05 243 / 0.6)",
        background: dragging ? "oklch(0.71 0.17 48 / 0.05)" : "oklch(0.14 0.03 243 / 0.4)",
        boxShadow: dragging ? "0 0 18px oklch(0.71 0.17 48 / 0.15)" : "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 22, style: { color: "oklch(0.55 0.08 243)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.60 0.05 243)" }, children: "Click or drag to upload image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.40 0.04 243)", fontSize: "11px" }, children: "JPEG · PNG · WebP · max 5 MB" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            accept: "image/jpeg,image/png,image/webp",
            className: "hidden",
            onChange: (e) => handleFiles(e.target.files)
          }
        )
      ]
    }
  );
}
function CategoryModal({ open, onClose, editTarget }) {
  const isEdit = editTarget !== null;
  const [saving, setSaving] = reactExports.useState(false);
  const [pendingImage, setPendingImage] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [uploading, setUploading] = reactExports.useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      color: BRAND_COLORS[0],
      imageUrl: "",
      isActive: true
    }
  });
  const nameValue = useWatch({ control, name: "name" });
  const colorValue = watch("color");
  const isActiveValue = watch("isActive");
  const imageUrlValue = watch("imageUrl");
  reactExports.useEffect(() => {
    if (!isEdit) {
      setValue("slug", slugify(nameValue ?? ""), { shouldValidate: false });
    }
  }, [nameValue, isEdit, setValue]);
  reactExports.useEffect(() => {
    if (editTarget) {
      reset({
        name: editTarget.name,
        slug: editTarget.slug,
        description: editTarget.description ?? "",
        color: editTarget.color ?? BRAND_COLORS[0],
        imageUrl: editTarget.imageUrl ?? "",
        isActive: editTarget.isActive
      });
      setPendingImage(null);
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        color: BRAND_COLORS[0],
        imageUrl: "",
        isActive: true
      });
      setPendingImage(null);
    }
  }, [editTarget, reset]);
  function handleImageSelect(file) {
    if (pendingImage == null ? void 0 : pendingImage.preview.startsWith("blob:")) {
      URL.revokeObjectURL(pendingImage.preview);
    }
    setPendingImage({ file, preview: URL.createObjectURL(file) });
    setValue("imageUrl", "");
  }
  function handleImageClear() {
    if (pendingImage == null ? void 0 : pendingImage.preview.startsWith("blob:")) {
      URL.revokeObjectURL(pendingImage.preview);
    }
    setPendingImage(null);
    setValue("imageUrl", "");
  }
  const storage = getStorage();
  async function uploadImageToStorage(file, categoryId) {
    try {
      const storageRef = ref(
        storage,
        `categories/${categoryId}_${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setUploadProgress(100);
      return downloadURL;
    } catch (error) {
      console.error(error);
      ue.error("Image upload failed");
      throw error;
    }
  }
  async function onSubmit(data) {
    setSaving(true);
    try {
      let finalImageUrl = data.imageUrl;
      if (pendingImage) {
        setUploading(true);
        setUploadProgress(0);
        const tempId = (editTarget == null ? void 0 : editTarget.id) ?? `cat-${Date.now()}`;
        finalImageUrl = await uploadImageToStorage(pendingImage.file, tempId);
        setUploading(false);
      }
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color,
        imageUrl: finalImageUrl,
        isActive: data.isActive
      };
      if (isEdit && editTarget) {
        await updateCategory(editTarget.id, payload);
        ue.success("Category updated");
      } else {
        await addCategory({ ...payload, productCount: 0 });
        ue.success("Category created");
      }
      onClose();
    } catch (err) {
      console.error(err);
      ue.error("Operation failed. Please try again.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/40 bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-ocid": "category-modal",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { className: "text-lg font-semibold text-white", children: isEdit ? "Edit Category" : "Add Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-slate-300 text-sm", children: [
                "Category Image",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs", children: "(optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CategoryImageZone,
                {
                  pending: pendingImage,
                  existing: imageUrlValue,
                  uploading,
                  progress: uploadProgress,
                  onSelect: handleImageSelect,
                  onClear: handleImageClear
                }
              ),
              !pendingImage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Or paste image URL...",
                  ...register("imageUrl"),
                  className: "bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 focus:border-blue-500/60 text-xs h-8",
                  "data-ocid": "input-category-image"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "cat-name", className: "text-slate-300 text-sm", children: [
                "Category Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cat-name",
                  placeholder: "e.g. Arduino Kits",
                  ...register("name", { required: "Name is required" }),
                  className: "bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 focus:border-blue-500/60",
                  "data-ocid": "input-category-name"
                }
              ),
              errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errors.name.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cat-slug", className: "text-slate-300 text-sm", children: "Slug" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cat-slug",
                  placeholder: "arduino-kits",
                  ...register("slug", {
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: "Only lowercase letters, numbers, and hyphens"
                    }
                  }),
                  className: "bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 font-mono text-sm focus:border-blue-500/60",
                  "data-ocid": "input-category-slug"
                }
              ),
              errors.slug && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: errors.slug.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cat-desc", className: "text-slate-300 text-sm", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "cat-desc",
                  placeholder: "Brief description of this category...",
                  rows: 3,
                  ...register("description"),
                  className: "bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 resize-none focus:border-blue-500/60",
                  "data-ocid": "input-category-description"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-slate-300 text-sm", children: "Color Tag" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: BRAND_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setValue("color", c),
                    className: "h-7 w-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                    style: {
                      backgroundColor: c,
                      boxShadow: colorValue === c ? `0 0 0 2px #0f172a, 0 0 0 4px ${c}` : void 0
                    },
                    "aria-label": `Select color ${c}`,
                    "data-ocid": `color-swatch-${c.replace("#", "")}`
                  },
                  c
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    ...register("color"),
                    className: "h-8 w-12 rounded cursor-pointer bg-transparent border border-slate-700/60",
                    "aria-label": "Custom color picker",
                    "data-ocid": "input-color-custom"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-4 w-4 rounded-full",
                    style: { backgroundColor: colorValue }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-mono", children: colorValue })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl bg-slate-800/40 border border-slate-700/40 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Show this category on the storefront" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: isActiveValue,
                  onCheckedChange: (v) => setValue("isActive", v),
                  "data-ocid": "toggle-category-active-form"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: onClose,
                  className: "flex-1 border-slate-700/60 text-slate-300 hover:bg-slate-800/60",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  disabled: saving,
                  className: "flex-1 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white border-0 shadow-lg shadow-orange-500/20",
                  "data-ocid": "submit-category-form",
                  children: [
                    saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 mr-1.5 animate-spin" }),
                    saving ? uploading ? "Uploading..." : "Saving..." : isEdit ? "Save Changes" : "Create Category"
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
function DeleteDialog({
  open,
  onClose,
  category,
  productCount,
  onConfirm,
  deleting
}) {
  if (!category) return null;
  const hasProducts = productCount > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal2, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay2, { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content2,
      {
        className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl border border-slate-700/40 bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-ocid": "delete-category-dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Title2, { className: "text-lg font-semibold text-white mb-2", children: [
            "Delete “",
            category.name,
            "”?"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Description2, { className: "text-sm text-slate-400 mb-6 leading-relaxed", children: hasProducts ? `This category has ${productCount} linked product${productCount !== 1 ? "s" : ""}. Deleting it may affect those products. This action cannot be undone.` : "This action cannot be undone. The category will be permanently removed." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cancel, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "flex-1 border-slate-700/60 text-slate-300 hover:bg-slate-800/60",
                children: "Cancel"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: onConfirm,
                disabled: deleting,
                className: "flex-1 bg-red-600 hover:bg-red-700 text-white border-0",
                "data-ocid": "confirm-delete-category",
                children: deleting ? "Deleting..." : "Delete"
              }
            ) })
          ] })
        ]
      }
    )
  ] }) });
}
function AdminCategoriesPage() {
  const [categories, setCategories] = reactExports.useState([]);
  const [productsByCategoryId, setProductsByCategoryId] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const unsub = subscribeToCategories((cats) => {
      setCategories(cats);
      setLoading(false);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    const unsub = subscribeToProducts((products) => {
      const counts = {};
      for (const p of products) {
        const ids = Array.isArray(p.categoryIds) && p.categoryIds.length > 0 ? p.categoryIds : p.categoryId ? [p.categoryId] : [];
        for (const id of ids) {
          counts[id] = (counts[id] ?? 0) + 1;
        }
      }
      setProductsByCategoryId(counts);
    });
    return unsub;
  }, []);
  const enrichedCategories = reactExports.useMemo(
    () => categories.map((cat) => ({
      ...cat,
      productCount: productsByCategoryId[cat.id] ?? cat.productCount ?? 0
    })),
    [categories, productsByCategoryId]
  );
  function handleAddClick() {
    setEditTarget(null);
    setModalOpen(true);
  }
  function handleEdit(cat) {
    setEditTarget(cat);
    setModalOpen(true);
  }
  function handleDeleteClick(cat) {
    setDeleteTarget(cat);
    setDeleteDialogOpen(true);
  }
  async function handleToggleActive(cat) {
    try {
      await updateCategory(cat.id, { isActive: !cat.isActive });
      ue.success(`Category ${!cat.isActive ? "activated" : "deactivated"}`);
    } catch (err) {
      console.error(err);
      ue.error("Operation failed. Please try again.");
    }
  }
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      ue.success("Category deleted");
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      ue.error("Operation failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  }
  const deleteTargetCount = deleteTarget ? productsByCategoryId[deleteTarget.id] ?? deleteTarget.productCount ?? 0 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin-categories-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-white", children: "Categories" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-400", children: loading ? "Loading..." : `${categories.length} categor${categories.length !== 1 ? "ies" : "y"}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleAddClick,
                className: "bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white border-0 shadow-lg shadow-orange-500/25 shrink-0",
                "data-ocid": "add-category-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
                  "Add Category"
                ]
              }
            )
          ]
        }
      ),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryCardSkeleton, {}, sk)) }) : enrichedCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.97 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.3 },
          className: "rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl p-16 flex flex-col items-center justify-center text-center",
          "data-ocid": "categories-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/60 border border-slate-700/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-8 w-8 text-slate-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-white mb-2", children: "No categories yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 max-w-xs mb-6", children: "Create your first category to start organizing your products." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleAddClick,
                className: "bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white border-0",
                "data-ocid": "add-first-category-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
                  "Create First Category"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: enrichedCategories.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CategoryCard,
        {
          category: cat,
          productCount: cat.productCount,
          index: i,
          onEdit: handleEdit,
          onDelete: handleDeleteClick,
          onToggleActive: handleToggleActive
        },
        cat.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CategoryModal,
      {
        open: modalOpen,
        onClose: () => setModalOpen(false),
        editTarget
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteDialog,
      {
        open: deleteDialogOpen,
        onClose: () => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        },
        category: deleteTarget,
        productCount: deleteTargetCount,
        onConfirm: handleDeleteConfirm,
        deleting
      }
    )
  ] });
}
export {
  AdminCategoriesPage as default
};
