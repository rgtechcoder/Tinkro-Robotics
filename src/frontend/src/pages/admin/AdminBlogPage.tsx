import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
//import {
  // addBlogPost,
  // deleteBlogPost,
  // subscribeToBlogPosts,
  // updateBlogPost,
  // uploadBlogImage,
//} from "@/lib/adminService";
import type { AdminBlogPost } from "@/types/admin";
import {
  BookOpen,
  Calendar,
  Eye,
  FileText,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESET_CATEGORIES = [
  "Technology",
  "Education",
  "Products",
  "News",
  "Tutorial",
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogFormValues {
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string;
  status: "draft" | "published";
  scheduledAt: string;
  featuredImage: string;
}

interface FormErrors {
  title?: string;
  author?: string;
  content?: string;
}

type StatusFilter = "all" | "published" | "draft";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function autoExcerpt(content: string): string {
  const plain = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.slice(0, 160);
}

function formatDate(value: string | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function validateForm(values: BlogFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.author.trim()) errors.author = "Author is required";
  if (!values.content.trim()) errors.content = "Content is required";
  return errors;
}

const DEFAULT_FORM: BlogFormValues = {
  title: "",
  slug: "",
  category: "Technology",
  author: "",
  excerpt: "",
  content: "",
  tags: "",
  status: "draft",
  scheduledAt: "",
  featuredImage: "",
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm">
      <div className="h-14 w-20 shrink-0 animate-pulse rounded-lg bg-muted" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
      <div className="ml-auto flex gap-3">
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: "blue" | "green" | "amber";
}

function StatsCard({ label, value, icon, accent = "blue" }: StatsCardProps) {
  const accentMap: Record<string, string> = {
    blue: "from-primary/20 to-primary/5 border-primary/20",
    green: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  };
  const iconMap: Record<string, string> = {
    blue: "text-primary",
    green: "text-emerald-500",
    amber: "text-amber-500",
  };
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-5 backdrop-blur-sm ${accentMap[accent]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <span className={iconMap[accent]}>{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

// ─── Post Row ─────────────────────────────────────────────────────────────────

interface PostRowProps {
  post: AdminBlogPost;
  onEdit: (p: AdminBlogPost) => void;
  onDelete: (p: AdminBlogPost) => void;
  onToggleStatus: (p: AdminBlogPost) => void;
}

function PostRow({ post, onEdit, onDelete, onToggleStatus }: PostRowProps) {
  const isPublished = post.status === "published";
  const isScheduled = !isPublished && !!post.scheduledAt;

  const statusBadge = isPublished ? (
    <Badge
      variant="outline"
      className="border-emerald-500/30 bg-emerald-500/15 text-emerald-600"
    >
      Published
    </Badge>
  ) : isScheduled ? (
    <Badge
      variant="outline"
      className="border-blue-500/30 bg-blue-500/15 text-blue-600"
    >
      Scheduled
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-amber-500/30 bg-amber-500/15 text-amber-600"
    >
      Draft
    </Badge>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-wrap items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm transition-colors hover:bg-card/80"
      data-ocid="blog-post-row"
    >
      {/* Thumbnail */}
      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-muted">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Title + excerpt */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{post.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {post.excerpt || "No excerpt"}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {post.category}
          </span>
          <span>·</span>
          <span>{post.author}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {post.views}
          </span>
        </div>
      </div>

      {/* Status + date */}
      <div className="flex flex-col items-end gap-1.5">
        {statusBadge}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {isPublished
            ? formatDate(post.publishedAt)
            : formatDate(post.createdAt)}
        </span>
      </div>

      {/* Quick toggle */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onToggleStatus(post)}
        className={
          isPublished
            ? "border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
            : "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
        }
        data-ocid="blog-toggle-status-btn"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      {/* Edit / Delete */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
          onClick={() => onEdit(post)}
          aria-label={`Edit ${post.title}`}
          data-ocid="blog-edit-btn"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(post)}
          aria-label={`Delete ${post.title}`}
          data-ocid="blog-delete-btn"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Blog Form Dialog ─────────────────────────────────────────────────────────

interface BlogDialogProps {
  open: boolean;
  editTarget: AdminBlogPost | null;
  onClose: () => void;
}

function BlogDialog({ open, editTarget, onClose }: BlogDialogProps) {
  const [form, setForm] = useState<BlogFormValues>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
        featuredImage: editTarget.featuredImage ?? "",
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [open, editTarget]);

  function setField<K extends keyof BlogFormValues>(
    key: K,
    value: BlogFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugify(value),
    }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  }

  function handleContentChange(value: string) {
    setForm((prev) => ({
      ...prev,
      content: value,
      excerpt: prev.excerpt || autoExcerpt(value),
    }));
    if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const tempId = editTarget?.id ?? `temp-${Date.now()}`;
      const url = await uploadBlogImage(file, tempId);
      setField("featuredImage", url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validateForm(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsSaving(true);
    try {
      const tagsArr = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: form.title.trim(),
        slug: form.slug || slugify(form.title),
        category: form.category,
        author: form.author.trim(),
        excerpt: form.excerpt.trim() || autoExcerpt(form.content),
        content: form.content.trim(),
        tags: tagsArr,
        status: form.status,
        scheduledAt: form.scheduledAt || undefined,
        featuredImage: form.featuredImage || undefined,
        publishedAt:
          form.status === "published"
            ? (editTarget?.publishedAt ?? new Date().toISOString())
            : undefined,
      };

      if (editTarget) {
        await updateBlogPost(editTarget.id, payload);
        toast.success("Post updated successfully");
      } else {
        await addBlogPost(payload);
        toast.success("Post created successfully");
      }
      onClose();
    } catch {
      toast.error(
        editTarget ? "Failed to update post" : "Failed to create post",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border/60 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {editTarget ? "Edit Post" : "Create Post"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="blog-title">Title *</Label>
            <Input
              id="blog-title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title"
              data-ocid="blog-title-input"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Slug (read-only) */}
          <div className="space-y-1.5">
            <Label htmlFor="blog-slug">Slug (auto-generated)</Label>
            <Input
              id="blog-slug"
              value={form.slug}
              readOnly
              className="bg-muted/40 font-mono text-sm text-muted-foreground"
              data-ocid="blog-slug-input"
            />
          </div>

          {/* Category + Author */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setField("category", v)}
              >
                <SelectTrigger data-ocid="blog-category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="blog-author">Author *</Label>
              <Input
                id="blog-author"
                value={form.author}
                onChange={(e) => setField("author", e.target.value)}
                placeholder="e.g. Tinkro Team"
                data-ocid="blog-author-input"
              />
              {errors.author && (
                <p className="text-xs text-destructive">{errors.author}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="blog-content">
              Blog Content (HTML supported) *
            </Label>
            <Textarea
              id="blog-content"
              value={form.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your post content here. HTML tags are supported."
              rows={8}
              className="resize-y font-mono text-sm"
              data-ocid="blog-content-input"
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="blog-excerpt">
                Excerpt (auto-filled from content)
              </Label>
              <span
                className={`text-xs ${form.excerpt.length > 160 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {form.excerpt.length}/160
              </span>
            </div>
            <Textarea
              id="blog-excerpt"
              value={form.excerpt}
              onChange={(e) =>
                setField("excerpt", e.target.value.slice(0, 160))
              }
              placeholder="Short summary of the post (max 160 chars)"
              rows={3}
              data-ocid="blog-excerpt-input"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
            <Input
              id="blog-tags"
              value={form.tags}
              onChange={(e) => setField("tags", e.target.value)}
              placeholder="e.g. robotics, arduino, stem"
              data-ocid="blog-tags-input"
            />
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <div className="flex items-start gap-3">
              {form.featuredImage && (
                <img
                  src={form.featuredImage}
                  alt="Featured preview"
                  className="h-16 w-24 rounded-lg border border-border/40 object-cover"
                />
              )}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="blog-image-upload-btn"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading…" : "Upload Image"}
                </Button>
                {form.featuredImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setField("featuredImage", "")}
                  >
                    Remove image
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
            <Switch
              id="blog-status"
              checked={form.status === "published"}
              onCheckedChange={(v) =>
                setField("status", v ? "published" : "draft")
              }
              data-ocid="blog-status-toggle"
            />
            <Label
              htmlFor="blog-status"
              className="cursor-pointer text-sm font-medium"
            >
              {form.status === "published"
                ? "Published — visible on the website"
                : "Draft — not visible to visitors"}
            </Label>
          </div>

          {/* Scheduled Date */}
          <div className="space-y-1.5">
            <Label htmlFor="blog-scheduled">
              Scheduled Publish Date (optional)
            </Label>
            <Input
              id="blog-scheduled"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setField("scheduledAt", e.target.value)}
              data-ocid="blog-schedule-input"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isUploading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              data-ocid="blog-save-btn"
            >
              {isSaving
                ? "Saving…"
                : editTarget
                  ? "Save Changes"
                  : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminBlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToBlogPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const allCategories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [posts]);

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    return { total, published, drafts };
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q),
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

  function openEdit(post: AdminBlogPost) {
    setEditTarget(post);
    setDialogOpen(true);
  }

  async function handleToggleStatus(post: AdminBlogPost) {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      await updateBlogPost(post.id, {
        status: newStatus,
        publishedAt:
          newStatus === "published"
            ? (post.publishedAt ?? new Date().toISOString())
            : undefined,
      });
      toast.success(
        newStatus === "published" ? "Post published" : "Post moved to drafts",
      );
    } catch {
      toast.error("Failed to update post status");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBlogPost(deleteTarget.id);
      toast.success(`Post "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6 p-6"
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <BookOpen className="h-6 w-6 text-primary" />
              Blog / CMS
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage blog posts and published content for your website
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600"
            data-ocid="create-post-btn"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard
            label="Total Posts"
            value={stats.total}
            icon={<FileText className="h-5 w-5" />}
            accent="blue"
          />
          <StatsCard
            label="Published"
            value={stats.published}
            icon={<Eye className="h-5 w-5" />}
            accent="green"
          />
          <StatsCard
            label="Drafts"
            value={stats.drafts}
            icon={<Pencil className="h-5 w-5" />}
            accent="amber"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, excerpt, or author…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="blog-search-input"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-40" data-ocid="blog-status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44" data-ocid="blog-category-filter">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Post List */}
        <div className="space-y-3">
          {loading ? (
            SKELETON_KEYS.map((k) => <SkeletonRow key={k} />)
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 py-16 text-center"
              data-ocid="blog-empty-state"
            >
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {search || statusFilter !== "all" || categoryFilter !== "all"
                  ? "No posts match your filters"
                  : "No posts yet"}
              </h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                {search || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first blog post to start publishing content."}
              </p>
              {!search &&
                statusFilter === "all" &&
                categoryFilter === "all" && (
                  <Button
                    className="mt-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                    onClick={openCreate}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Post
                  </Button>
                )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Create / Edit Dialog */}
      <BlogDialog
        open={dialogOpen}
        editTarget={editTarget}
        onClose={() => setDialogOpen(false)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent className="border-border/60 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{deleteTarget?.title}"</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="blog-delete-confirm-btn"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
