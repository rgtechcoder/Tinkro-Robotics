import { r as reactExports, j as jsxRuntimeExports, m as motion, ai as BookOpen, B as Button, a0 as Search, A as AnimatePresence, o as ue, T as Tag, N as Calendar, l as Badge } from "./index-O-oxzsBJ.js";
import { A as AdminLayout, F as FileText, I as Image } from "./AdminLayout-DnmFTD6u.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction, D as Dialog, h as DialogContent, i as DialogHeader, j as DialogTitle } from "./dialog-Doq3vSOq.js";
import { I as Input } from "./input-CA2Kh0PP.js";
import { L as Label } from "./label-CaWhKRKy.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D6lSXJPm.js";
import { S as Switch } from "./switch-zaxM8ZEj.js";
import { T as Textarea } from "./textarea-1JrWIcUD.js";
import { P as Plus } from "./plus-DaZED7tD.js";
import { E as Eye } from "./eye-CghO3a5D.js";
import { P as Pencil } from "./pencil-B8gfMpCg.js";
import { T as Trash2 } from "./trash-2-CTLSMskq.js";
import { U as Upload } from "./upload-CzCFB2EH.js";
import "./external-link-0xBpMtII.js";
import "./ticket-DhyR_LGt.js";
import "./index-Cu6viimg.js";
import "./index-IUus9vKR.js";
import "./index-CSV6Uy9i.js";
import "./index-DszSdnxd.js";
import "./chevron-up-Id0BodQe.js";
import "./index-ljXxS_F9.js";
const PRESET_CATEGORIES = [
  "Technology",
  "Education",
  "Products",
  "News",
  "Tutorial"
];
const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];
function slugify(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
function autoExcerpt(content) {
  const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 160);
}
function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return "—";
  }
}
function validateForm(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.author.trim()) errors.author = "Author is required";
  if (!values.content.trim()) errors.content = "Content is required";
  return errors;
}
const DEFAULT_FORM = {
  title: "",
  slug: "",
  category: "Technology",
  author: "",
  excerpt: "",
  content: "",
  tags: "",
  status: "draft",
  scheduledAt: "",
  featuredImage: ""
};
function SkeletonRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-20 shrink-0 animate-pulse rounded-lg bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 animate-pulse rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/2 animate-pulse rounded bg-muted" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-20 animate-pulse rounded-full bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-16 animate-pulse rounded-full bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-pulse rounded-lg bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-pulse rounded-lg bg-muted" })
    ] })
  ] });
}
function StatsCard({ label, value, icon, accent = "blue" }) {
  const accentMap = {
    blue: "from-primary/20 to-primary/5 border-primary/20",
    green: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20"
  };
  const iconMap = {
    blue: "text-primary",
    green: "text-emerald-500",
    amber: "text-amber-500"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-xl border bg-gradient-to-br p-5 backdrop-blur-sm ${accentMap[accent]}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: iconMap[accent], children: icon })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-foreground", children: value })
      ]
    }
  );
}
function PostRow({ post, onEdit, onDelete, onToggleStatus }) {
  const isPublished = post.status === "published";
  const isScheduled = !isPublished && !!post.scheduledAt;
  const statusBadge = isPublished ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: "border-emerald-500/30 bg-emerald-500/15 text-emerald-600",
      children: "Published"
    }
  ) : isScheduled ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: "border-blue-500/30 bg-blue-500/15 text-blue-600",
      children: "Scheduled"
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: "border-amber-500/30 bg-amber-500/15 text-amber-600",
      children: "Draft"
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
      className: "flex flex-wrap items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm transition-colors hover:bg-card/80",
      "data-ocid": "blog-post-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-muted", children: post.featuredImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: post.featuredImage,
            alt: post.title,
            className: "h-full w-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5 text-muted-foreground/40" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-semibold text-foreground", children: post.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 line-clamp-1 text-xs text-muted-foreground", children: post.excerpt || "No excerpt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3 w-3" }),
              post.category
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: post.author }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }),
              post.views
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [
          statusBadge,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
            isPublished ? formatDate(post.publishedAt) : formatDate(post.createdAt)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => onToggleStatus(post),
            className: isPublished ? "border-amber-500/30 text-amber-600 hover:bg-amber-500/10" : "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10",
            "data-ocid": "blog-toggle-status-btn",
            children: isPublished ? "Unpublish" : "Publish"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "h-8 w-8 hover:bg-primary/10 hover:text-primary",
              onClick: () => onEdit(post),
              "aria-label": `Edit ${post.title}`,
              "data-ocid": "blog-edit-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "h-8 w-8 hover:bg-destructive/10 hover:text-destructive",
              onClick: () => onDelete(post),
              "aria-label": `Delete ${post.title}`,
              "data-ocid": "blog-delete-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ]
    }
  );
}
function BlogDialog({ open, editTarget, onClose }) {
  const [form, setForm] = reactExports.useState(DEFAULT_FORM);
  const [errors, setErrors] = reactExports.useState({});
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    if (editTarget) {
      setForm({
        title: editTarget.title,
        slug: editTarget.slug,
        category: editTarget.category,
        author: editTarget.author,
        excerpt: editTarget.excerpt,
        content: editTarget.content,
        tags: editTarget.tags.join(", "),
        status: editTarget.status,
        scheduledAt: editTarget.scheduledAt ?? "",
        featuredImage: editTarget.featuredImage ?? ""
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [open, editTarget]);
  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: void 0 }));
    }
  }
  function handleTitleChange(value) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugify(value)
    }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: void 0 }));
  }
  function handleContentChange(value) {
    setForm((prev) => ({
      ...prev,
      content: value,
      excerpt: prev.excerpt || autoExcerpt(value)
    }));
    if (errors.content) setErrors((prev) => ({ ...prev, content: void 0 }));
  }
  async function handleImageUpload(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const tempId = (editTarget == null ? void 0 : editTarget.id) ?? `temp-${Date.now()}`;
      const url = await uploadBlogImage(file, tempId);
      setField("featuredImage", url);
      ue.success("Image uploaded successfully");
    } catch {
      ue.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
      const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: form.title.trim(),
        slug: form.slug || slugify(form.title),
        category: form.category,
        author: form.author.trim(),
        excerpt: form.excerpt.trim() || autoExcerpt(form.content),
        content: form.content.trim(),
        tags: tagsArr,
        status: form.status,
        scheduledAt: form.scheduledAt || void 0,
        featuredImage: form.featuredImage || void 0,
        publishedAt: form.status === "published" ? (editTarget == null ? void 0 : editTarget.publishedAt) ?? (/* @__PURE__ */ new Date()).toISOString() : void 0
      };
      if (editTarget) {
        await updateBlogPost(editTarget.id, payload);
        ue.success("Post updated successfully");
      } else {
        await addBlogPost(payload);
        ue.success("Post created successfully");
      }
      onClose();
    } catch {
      ue.error(
        editTarget ? "Failed to update post" : "Failed to create post"
      );
    } finally {
      setIsSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] max-w-2xl overflow-y-auto border-border/60 bg-card/95 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-bold", children: editTarget ? "Edit Post" : "Create Post" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "mt-2 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "blog-title", children: "Title *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "blog-title",
            value: form.title,
            onChange: (e) => handleTitleChange(e.target.value),
            placeholder: "Enter post title",
            "data-ocid": "blog-title-input"
          }
        ),
        errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "blog-slug", children: "Slug (auto-generated)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "blog-slug",
            value: form.slug,
            readOnly: true,
            className: "bg-muted/40 font-mono text-sm text-muted-foreground",
            "data-ocid": "blog-slug-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.category,
              onValueChange: (v) => setField("category", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "blog-category-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PRESET_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "blog-author", children: "Author *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "blog-author",
              value: form.author,
              onChange: (e) => setField("author", e.target.value),
              placeholder: "e.g. Tinkro Team",
              "data-ocid": "blog-author-input"
            }
          ),
          errors.author && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.author })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "blog-content", children: "Blog Content (HTML supported) *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "blog-content",
            value: form.content,
            onChange: (e) => handleContentChange(e.target.value),
            placeholder: "Write your post content here. HTML tags are supported.",
            rows: 8,
            className: "resize-y font-mono text-sm",
            "data-ocid": "blog-content-input"
          }
        ),
        errors.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.content })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "blog-excerpt", children: "Excerpt (auto-filled from content)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs ${form.excerpt.length > 160 ? "text-destructive" : "text-muted-foreground"}`,
              children: [
                form.excerpt.length,
                "/160"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "blog-excerpt",
            value: form.excerpt,
            onChange: (e) => setField("excerpt", e.target.value.slice(0, 160)),
            placeholder: "Short summary of the post (max 160 chars)",
            rows: 3,
            "data-ocid": "blog-excerpt-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "blog-tags", children: "Tags (comma-separated)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "blog-tags",
            value: form.tags,
            onChange: (e) => setField("tags", e.target.value),
            placeholder: "e.g. robotics, arduino, stem",
            "data-ocid": "blog-tags-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Featured Image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          form.featuredImage && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: form.featuredImage,
              alt: "Featured preview",
              className: "h-16 w-24 rounded-lg border border-border/40 object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                disabled: isUploading,
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                "data-ocid": "blog-image-upload-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
                  isUploading ? "Uploading…" : "Upload Image"
                ]
              }
            ),
            form.featuredImage && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "text-destructive hover:text-destructive",
                onClick: () => setField("featuredImage", ""),
                children: "Remove image"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: handleImageUpload
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "blog-status",
            checked: form.status === "published",
            onCheckedChange: (v) => setField("status", v ? "published" : "draft"),
            "data-ocid": "blog-status-toggle"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "blog-status",
            className: "cursor-pointer text-sm font-medium",
            children: form.status === "published" ? "Published — visible on the website" : "Draft — not visible to visitors"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "blog-scheduled", children: "Scheduled Publish Date (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "blog-scheduled",
            type: "datetime-local",
            value: form.scheduledAt,
            onChange: (e) => setField("scheduledAt", e.target.value),
            "data-ocid": "blog-schedule-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSaving || isUploading,
            className: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600",
            "data-ocid": "blog-save-btn",
            children: isSaving ? "Saving…" : editTarget ? "Save Changes" : "Create Post"
          }
        )
      ] })
    ] })
  ] }) });
}
function AdminBlogPage() {
  const [posts, setPosts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("all");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const unsub = subscribeToBlogPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  const allCategories = reactExports.useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [posts]);
  const stats = reactExports.useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    return { total, published, drafts };
  }, [posts]);
  const filtered = reactExports.useMemo(() => {
    let list = posts;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category === categoryFilter);
    }
    return list;
  }, [posts, search, statusFilter, categoryFilter]);
  function openCreate() {
    setEditTarget(null);
    setDialogOpen(true);
  }
  function openEdit(post) {
    setEditTarget(post);
    setDialogOpen(true);
  }
  async function handleToggleStatus(post) {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      await updateBlogPost(post.id, {
        status: newStatus,
        publishedAt: newStatus === "published" ? post.publishedAt ?? (/* @__PURE__ */ new Date()).toISOString() : void 0
      });
      ue.success(
        newStatus === "published" ? "Post published" : "Post moved to drafts"
      );
    } catch {
      ue.error("Failed to update post status");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBlogPost(deleteTarget.id);
      ue.success(`Post "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete post");
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-primary" }),
                "Blog / CMS"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage blog posts and published content for your website" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: openCreate,
                className: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600",
                "data-ocid": "create-post-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                  "Create Post"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatsCard,
              {
                label: "Total Posts",
                value: stats.total,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }),
                accent: "blue"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatsCard,
              {
                label: "Published",
                value: stats.published,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5" }),
                accent: "green"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatsCard,
              {
                label: "Drafts",
                value: stats.drafts,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-5 w-5" }),
                accent: "amber"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[220px] flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search by title, excerpt, or author…",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "pl-9",
                  "data-ocid": "blog-search-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: statusFilter,
                onValueChange: (v) => setStatusFilter(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", "data-ocid": "blog-status-filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All statuses" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Statuses" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "published", children: "Published" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44", "data-ocid": "blog-category-filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All categories" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Categories" }),
                allCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: loading ? SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}, k)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 py-16 text-center",
              "data-ocid": "blog-empty-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-12 w-12 text-muted-foreground/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-base font-semibold text-foreground", children: search || statusFilter !== "all" || categoryFilter !== "all" ? "No posts match your filters" : "No posts yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-xs text-sm text-muted-foreground", children: search || statusFilter !== "all" || categoryFilter !== "all" ? "Try adjusting your search or filter criteria." : "Create your first blog post to start publishing content." }),
                !search && statusFilter === "all" && categoryFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "mt-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600",
                    onClick: openCreate,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                      "Create First Post"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PostRow,
            {
              post,
              onEdit: openEdit,
              onDelete: setDeleteTarget,
              onToggleStatus: handleToggleStatus
            },
            post.id
          )) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BlogDialog,
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Post" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              "Are you sure you want to delete",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                '"',
                deleteTarget == null ? void 0 : deleteTarget.title,
                '"'
              ] }),
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
                "data-ocid": "blog-delete-confirm-btn",
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
  AdminBlogPage as default
};
