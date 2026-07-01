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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  addBlogPost,
  deleteBlogPost,
  subscribeToBlogPosts,
  updateBlogPost,
  uploadBlogImage,
} from "@/lib/adminService";
import type { AdminBlogPost } from "@/types/admin";
import {
  BookOpen,
  Calendar,
  Eye,
  FileText,
  ImageIcon,
  Layers3,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Users2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { toast } from "sonner";

const PRESET_CATEGORIES = [
  "Technology",
  "Education",
  "Products",
  "News",
  "Tutorial",
  "Robotics",
  "STEM",
];

const ARTICLE_TYPES = [
  "Tutorial",
  "Project",
  "Buying Guide",
  "Comparison",
  "Learning Article",
  "Course",
  "News",
  "FAQ",
  "Glossary",
  "Workshop",
  "STEM Activity",
];

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const AGE_GROUPS = ["All Ages", "Kids", "Teens", "Adults"];
const EDUCATION_LEVELS = ["School", "College", "Professional", "Beginner", "Advanced"];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

interface BlogFormValues {
  title: string;
  slug: string;
  category: string;
  subCategory: string;
  articleType: string;
  author: string;
  authorBio: string;
  authorImage: string;
  authorLinkedIn: string;
  authorGithub: string;
  authorWebsite: string;
  excerpt: string;
  summary: string;
  content: string;
  tags: string;
  status: "draft" | "published" | "scheduled" | "private";
  featuredImage: string;
  images: string[];
  featuredVideo: string;
  pinned: boolean;
  featured: boolean;
  trending: boolean;
  readingTime: string;
  scheduledAt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywords: string;
  canonicalUrl: string;
  robots: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  seoScore: string;
  googlePreview: string;
  facebookPreview: string;
  twitterPreview: string;
  difficulty: string;
  ageGroup: string;
  educationLevel: string;
}

interface FormErrors {
  title?: string;
  author?: string;
  content?: string;
  slug?: string;
}

type StatusFilter = "all" | "published" | "draft" | "scheduled" | "private";

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

function formatDate(value: string | null | undefined): string {
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
  if (!values.slug.trim()) errors.slug = "Slug is required";
  return errors;
}

const DEFAULT_FORM: BlogFormValues = {
  title: "",
  slug: "",
  category: "Technology",
  subCategory: "",
  articleType: "Learning Article",
  author: "",
  authorBio: "",
  authorImage: "",
  authorLinkedIn: "",
  authorGithub: "",
  authorWebsite: "",
  excerpt: "",
  summary: "",
  content: "",
  tags: "",
  status: "draft",
  featuredImage: "",
  images: [],
  featuredVideo: "",
  pinned: false,
  featured: false,
  trending: false,
  readingTime: "",
  scheduledAt: "",
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "",
  keywords: "",
  canonicalUrl: "",
  robots: "index,follow",
  openGraphTitle: "",
  openGraphDescription: "",
  openGraphImage: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  seoScore: "",
  googlePreview: "",
  facebookPreview: "",
  twitterPreview: "",
  difficulty: "Beginner",
  ageGroup: "All Ages",
  educationLevel: "School",
};

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

interface StatsCardProps {
  label: string;
  value: number;
  icon: ReactNode;
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
    <div className={`rounded-xl border bg-gradient-to-br p-5 backdrop-blur-sm ${accentMap[accent]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={iconMap[accent]}>{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

interface PostRowProps {
  post: AdminBlogPost;
  onEdit: (p: AdminBlogPost) => void;
  onDelete: (p: AdminBlogPost) => void;
  onToggleStatus: (p: AdminBlogPost) => void;
}

function PostRow({ post, onEdit, onDelete, onToggleStatus }: PostRowProps) {
  const isPublished = post.status === "published";
  const statusBadge = isPublished ? (
    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/15 text-emerald-600">
      Published
    </Badge>
  ) : post.status === "scheduled" ? (
    <Badge variant="outline" className="border-sky-500/30 bg-sky-500/15 text-sky-600">
      Scheduled
    </Badge>
  ) : post.status === "private" ? (
    <Badge variant="outline" className="border-violet-500/30 bg-violet-500/15 text-violet-600">
      Private
    </Badge>
  ) : (
    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/15 text-amber-600">
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
      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-muted">
        {post.featuredImage ? (
          <img src={post.featuredImage} alt={post.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{post.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{post.excerpt || "No excerpt"}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {post.articleType || post.category}
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

      <div className="flex flex-col items-end gap-1.5">
        {statusBadge}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {isPublished ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
        </span>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onToggleStatus(post)}
        className={isPublished ? "border-amber-500/30 text-amber-600 hover:bg-amber-500/10" : "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"}
        data-ocid="blog-toggle-status-btn"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => onEdit(post)} aria-label={`Edit ${post.title}`} data-ocid="blog-edit-btn">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(post)} aria-label={`Delete ${post.title}`} data-ocid="blog-delete-btn">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

interface BlogDialogProps {
  open: boolean;
  editTarget: AdminBlogPost | null;
  onClose: () => void;
}

function BlogDialog({ open, editTarget, onClose }: BlogDialogProps) {
  const [form, setForm] = useState<BlogFormValues>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const labelClass = "text-xs font-semibold text-white/70 uppercase tracking-widest";
  const fieldStyle = {
    background: "oklch(0.15 0.03 243 / 0.7)",
    border: "1px solid oklch(0.28 0.05 243 / 0.6)",
    color: "white",
  } as const;

  useEffect(() => {
    if (!open) return;
    if (editTarget) {
      setForm({
        title: editTarget.title ?? "",
        slug: editTarget.slug ?? "",
        category: editTarget.category ?? "Technology",
        subCategory: editTarget.subCategory ?? "",
        articleType: editTarget.articleType ?? "Learning Article",
        author: editTarget.author ?? "",
        authorBio: editTarget.authorBio ?? "",
        authorImage: editTarget.authorImage ?? "",
        authorLinkedIn: editTarget.authorLinkedIn ?? "",
        authorGithub: editTarget.authorGithub ?? "",
        authorWebsite: editTarget.authorWebsite ?? "",
        excerpt: editTarget.excerpt ?? "",
        summary: editTarget.summary ?? "",
        content: editTarget.content ?? "",
        tags: (editTarget.tags ?? []).join(", "),
        status: editTarget.status ?? "draft",
        featuredImage: editTarget.featuredImage ?? "",
        images: Array.isArray(editTarget.images) ? editTarget.images : [],
        featuredVideo: editTarget.featuredVideo ?? "",
        pinned: Boolean(editTarget.pinned),
        featured: Boolean(editTarget.featured),
        trending: Boolean(editTarget.trending),
        readingTime: editTarget.readingTime ? String(editTarget.readingTime) : "",
        scheduledAt: editTarget.scheduledAt ?? "",
        metaTitle: editTarget.metaTitle ?? "",
        metaDescription: editTarget.metaDescription ?? "",
        focusKeyword: editTarget.focusKeyword ?? "",
        keywords: (editTarget.keywords ?? []).join(", "),
        canonicalUrl: editTarget.canonicalUrl ?? "",
        robots: editTarget.robots ?? "index,follow",
        openGraphTitle: editTarget.openGraphTitle ?? "",
        openGraphDescription: editTarget.openGraphDescription ?? "",
        openGraphImage: editTarget.openGraphImage ?? "",
        twitterTitle: editTarget.twitterTitle ?? "",
        twitterDescription: editTarget.twitterDescription ?? "",
        twitterImage: editTarget.twitterImage ?? "",
        seoScore: editTarget.seoScore ? String(editTarget.seoScore) : "",
        googlePreview: editTarget.googlePreview ?? "",
        facebookPreview: editTarget.facebookPreview ?? "",
        twitterPreview: editTarget.twitterPreview ?? "",
        difficulty: editTarget.difficulty ?? "Beginner",
        ageGroup: editTarget.ageGroup ?? "All Ages",
        educationLevel: editTarget.educationLevel ?? "School",
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setActiveTab("basic");
    setErrors({});
  }, [open, editTarget]);

  function setField<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
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
      metaTitle: prev.metaTitle || value,
      openGraphTitle: prev.openGraphTitle || value,
      twitterTitle: prev.twitterTitle || value,
    }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  }

  function handleContentChange(value: string) {
    setForm((prev) => ({
      ...prev,
      content: value,
      excerpt: prev.excerpt || autoExcerpt(value),
      summary: prev.summary || autoExcerpt(value),
      metaDescription: prev.metaDescription || autoExcerpt(value),
      openGraphDescription: prev.openGraphDescription || autoExcerpt(value),
      twitterDescription: prev.twitterDescription || autoExcerpt(value),
    }));
    if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
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

  async function handleGalleryUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      const tempId = editTarget?.id ?? `temp-${Date.now()}`;
      const uploaded = await Promise.all(files.map((file) => uploadBlogImage(file, tempId)));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
      toast.success("Images uploaded successfully");
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setIsUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fieldErrors = validateForm(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      toast.error("Please fill in all required fields before saving the article.");
      return;
    }

    setIsSaving(true);
    try {
      const tagsArr = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const keywordArr = form.keywords
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const seoScore = Number(form.seoScore) || Math.min(100, 60 + tagsArr.length * 4 + (form.metaTitle ? 8 : 0) + (form.canonicalUrl ? 8 : 0));

      const payload = {
        title: form.title.trim(),
        slug: form.slug || slugify(form.title),
        category: form.category,
        subCategory: form.subCategory || undefined,
        articleType: form.articleType,
        author: form.author.trim(),
        authorBio: form.authorBio || undefined,
        authorImage: form.authorImage || undefined,
        authorLinkedIn: form.authorLinkedIn || undefined,
        authorGithub: form.authorGithub || undefined,
        authorWebsite: form.authorWebsite || undefined,
        excerpt: form.excerpt.trim() || autoExcerpt(form.content),
        summary: form.summary.trim() || autoExcerpt(form.content),
        content: form.content.trim(),
        tags: tagsArr,
        status: form.status,
        featuredImage: form.featuredImage || undefined,
        images: form.images,
        featuredVideo: form.featuredVideo || undefined,
        pinned: form.pinned,
        featured: form.featured,
        trending: form.trending,
        readingTime: form.readingTime ? Number(form.readingTime) : undefined,
        scheduledAt: form.status === "scheduled" && form.scheduledAt ? form.scheduledAt : undefined,
        publishedAt: form.status === "published" ? (editTarget?.publishedAt ?? new Date().toISOString()) : undefined,
        metaTitle: form.metaTitle || form.title.trim(),
        metaDescription: form.metaDescription || autoExcerpt(form.content),
        focusKeyword: form.focusKeyword || form.title.trim(),
        keywords: keywordArr,
        canonicalUrl: form.canonicalUrl || `https://tinkro.in/blog/${form.slug || slugify(form.title)}`,
        robots: form.robots || "index,follow",
        openGraphTitle: form.openGraphTitle || form.title.trim(),
        openGraphDescription: form.openGraphDescription || autoExcerpt(form.content),
        openGraphImage: form.openGraphImage || undefined,
        twitterTitle: form.twitterTitle || form.title.trim(),
        twitterDescription: form.twitterDescription || autoExcerpt(form.content),
        twitterImage: form.twitterImage || undefined,
        seoScore,
        googlePreview: form.googlePreview || `${form.title.trim()} | Tinkro Knowledge Hub`,
        facebookPreview: form.facebookPreview || `${form.title.trim()} | Tinkro Knowledge Hub`,
        twitterPreview: form.twitterPreview || `${form.title.trim()} | Tinkro Knowledge Hub`,
        difficulty: form.difficulty,
        ageGroup: form.ageGroup,
        educationLevel: form.educationLevel,
      };

      if (editTarget) {
        await updateBlogPost(editTarget.id, payload);
        toast.success("Article updated successfully");
      } else {
        await addBlogPost(payload);
        toast.success("Article created successfully");
      }
      onClose();
    } catch {
      toast.error(editTarget ? "Failed to update article" : "Failed to create article");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-0 shadow-2xl" style={{ background: "linear-gradient(180deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)", border: "1px solid oklch(0.25 0.05 243 / 0.5)" }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">{editTarget ? "Edit Article" : "Create Article"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-3 flex-wrap justify-start bg-background/10 p-1">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="author">Author</TabsTrigger>
              <TabsTrigger value="classification">Classification</TabsTrigger>
              <TabsTrigger value="publishing">Publishing</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="blog-title" className={labelClass}>Title *</Label>
                <Input id="blog-title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter article title" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} data-ocid="blog-title-input" />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blog-slug" className={labelClass}>Slug (auto-generated)</Label>
                <Input id="blog-slug" value={form.slug} onChange={(e) => setField("slug", slugify(e.target.value))} placeholder="knowledge-hub-slug" className="h-10 font-mono text-sm text-white placeholder:text-white/40" style={fieldStyle} data-ocid="blog-slug-input" />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className={labelClass}>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                    <SelectTrigger className="h-10 text-sm text-white" style={fieldStyle} data-ocid="blog-category-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "oklch(0.14 0.04 243)", border: "1px solid oklch(0.25 0.05 243 / 0.5)" }}>
                      {PRESET_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-white/80">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Article Type</Label>
                  <Select value={form.articleType} onValueChange={(v) => setField("articleType", v)}>
                    <SelectTrigger className="h-10 text-sm text-white" style={fieldStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "oklch(0.14 0.04 243)", border: "1px solid oklch(0.25 0.05 243 / 0.5)" }}>
                      {ARTICLE_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="text-white/80">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blog-excerpt" className={labelClass}>Excerpt</Label>
                <Textarea id="blog-excerpt" value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value.slice(0, 160))} placeholder="Short summary" rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} data-ocid="blog-excerpt-input" />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="blog-summary" className={labelClass}>Summary</Label>
                <Textarea id="blog-summary" value={form.summary} onChange={(e) => setField("summary", e.target.value)} placeholder="Expanded summary for the article" rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blog-content" className={labelClass}>Article Content *</Label>
                <Textarea id="blog-content" value={form.content} onChange={(e) => handleContentChange(e.target.value)} placeholder="Write article content here. HTML tags are supported." rows={10} className="resize-y font-mono text-sm text-white placeholder:text-white/40" style={fieldStyle} data-ocid="blog-content-input" />
                {errors.content && <p className="text-xs text-destructive">{errors.content}</p>}
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>Featured Image</Label>
                <div className="flex items-start gap-3">
                  {form.featuredImage && <img src={form.featuredImage} alt="Featured preview" className="h-16 w-24 rounded-lg border border-border/40 object-cover" />}
                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" size="sm" disabled={isUploading} onClick={() => fileInputRef.current?.click()} data-ocid="blog-image-upload-btn">
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploading ? "Uploading…" : "Upload Image"}
                    </Button>
                    {form.featuredImage && (
                      <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setField("featuredImage", "")}>
                        Remove image
                      </Button>
                    )}
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>Gallery Images</Label>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {form.images.map((img) => (
                      <div key={img} className="relative h-16 w-24 overflow-hidden rounded-lg border border-border/40">
                        <img src={img} alt="Gallery" className="h-full w-full object-cover" />
                        <button type="button" className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] text-white" onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((url) => url !== img) }))}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="outline" size="sm" disabled={isUploadingGallery} onClick={() => galleryInputRef.current?.click()} data-ocid="blog-gallery-upload-btn">
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploadingGallery ? "Uploading…" : "Upload Images"}
                  </Button>
                  <p className="text-xs text-white/40">You can upload multiple images for the gallery.</p>
                </div>
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="meta-title" className={labelClass}>Meta Title</Label>
                  <Input id="meta-title" value={form.metaTitle} onChange={(e) => setField("metaTitle", e.target.value)} placeholder="Knowledge Hub article title" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="focus-keyword" className={labelClass}>Focus Keyword</Label>
                  <Input id="focus-keyword" value={form.focusKeyword} onChange={(e) => setField("focusKeyword", e.target.value)} placeholder="robotics starter kit" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meta-description" className={labelClass}>Meta Description</Label>
                <Textarea id="meta-description" value={form.metaDescription} onChange={(e) => setField("metaDescription", e.target.value)} placeholder="Short description for search engines" rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="keywords" className={labelClass}>Keywords</Label>
                <Input id="keywords" value={form.keywords} onChange={(e) => setField("keywords", e.target.value)} placeholder="arduino, robotics, learning" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="canonical-url" className={labelClass}>Canonical URL</Label>
                  <Input id="canonical-url" value={form.canonicalUrl} onChange={(e) => setField("canonicalUrl", e.target.value)} placeholder="https://tinkro.in/blog/article-slug" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="robots" className={labelClass}>Robots</Label>
                  <Input id="robots" value={form.robots} onChange={(e) => setField("robots", e.target.value)} placeholder="index,follow" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="rounded-xl border border-border/40 bg-background/20 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  SEO preview
                </div>
                <p className="text-sm text-white/70">{form.metaTitle || form.title || "Article title"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{form.metaDescription || form.excerpt || "Article summary will appear here."}</p>
                <p className="mt-2 text-xs text-emerald-400">SEO score: {form.seoScore || "Auto-generated"}</p>
              </div>
            </TabsContent>

            <TabsContent value="author" className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="blog-author" className={labelClass}>Author *</Label>
                <Input id="blog-author" value={form.author} onChange={(e) => setField("author", e.target.value)} placeholder="e.g. Tinkro Team" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} data-ocid="blog-author-input" />
                {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="author-bio" className={labelClass}>Author Bio</Label>
                <Textarea id="author-bio" value={form.authorBio} onChange={(e) => setField("authorBio", e.target.value)} placeholder="Short bio for the author block" rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="author-linkedin" className={labelClass}>LinkedIn</Label>
                  <Input id="author-linkedin" value={form.authorLinkedIn} onChange={(e) => setField("authorLinkedIn", e.target.value)} placeholder="https://linkedin.com/in/" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="author-github" className={labelClass}>GitHub</Label>
                  <Input id="author-github" value={form.authorGithub} onChange={(e) => setField("authorGithub", e.target.value)} placeholder="https://github.com/" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="author-website" className={labelClass}>Website</Label>
                <Input id="author-website" value={form.authorWebsite} onChange={(e) => setField("authorWebsite", e.target.value)} placeholder="https://example.com" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>
            </TabsContent>

            <TabsContent value="classification" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="sub-category" className={labelClass}>Sub Category</Label>
                  <Input id="sub-category" value={form.subCategory} onChange={(e) => setField("subCategory", e.target.value)} placeholder="Sensors, Robotics Kits" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Difficulty</Label>
                  <Select value={form.difficulty} onValueChange={(v) => setField("difficulty", v)}>
                    <SelectTrigger className="h-10 text-sm text-white" style={fieldStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "oklch(0.14 0.04 243)", border: "1px solid oklch(0.25 0.05 243 / 0.5)" }}>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level} className="text-white/80">{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className={labelClass}>Age Group</Label>
                  <Select value={form.ageGroup} onValueChange={(v) => setField("ageGroup", v)}>
                    <SelectTrigger className="h-10 text-sm text-white" style={fieldStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "oklch(0.14 0.04 243)", border: "1px solid oklch(0.25 0.05 243 / 0.5)" }}>
                      {AGE_GROUPS.map((group) => (
                        <SelectItem key={group} value={group} className="text-white/80">{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Education Level</Label>
                  <Select value={form.educationLevel} onValueChange={(v) => setField("educationLevel", v)}>
                    <SelectTrigger className="h-10 text-sm text-white" style={fieldStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "oklch(0.14 0.04 243)", border: "1px solid oklch(0.25 0.05 243 / 0.5)" }}>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level} value={level} className="text-white/80">{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blog-tags" className={labelClass}>Tags</Label>
                <Input id="blog-tags" value={form.tags} onChange={(e) => setField("tags", e.target.value)} placeholder="robotics, arduino, stem" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} data-ocid="blog-tags-input" />
              </div>
            </TabsContent>

            <TabsContent value="publishing" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className={labelClass}>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setField("status", v as BlogFormValues["status"])}>
                    <SelectTrigger className="h-10 text-sm text-white" style={fieldStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ background: "oklch(0.14 0.04 243)", border: "1px solid oklch(0.25 0.05 243 / 0.5)" }}>
                      <SelectItem value="draft" className="text-white/80">Draft</SelectItem>
                      <SelectItem value="published" className="text-white/80">Published</SelectItem>
                      <SelectItem value="scheduled" className="text-white/80">Scheduled</SelectItem>
                      <SelectItem value="private" className="text-white/80">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reading-time" className={labelClass}>Reading Time (minutes)</Label>
                  <Input id="reading-time" type="number" value={form.readingTime} onChange={(e) => setField("readingTime", e.target.value)} placeholder="8" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="scheduled-at" className={labelClass}>Scheduled For</Label>
                <Input id="scheduled-at" type="datetime-local" value={form.scheduledAt} onChange={(e) => setField("scheduledAt", e.target.value)} className="h-10 text-sm text-white" style={fieldStyle} />
              </div>

              <div className="space-y-3 rounded-lg border border-border/40 bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <Switch id="featured-toggle" checked={form.featured} onCheckedChange={(v) => setField("featured", v)} />
                  <Label htmlFor="featured-toggle" className="cursor-pointer text-sm font-medium text-white/70">Featured article</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="pinned-toggle" checked={form.pinned} onCheckedChange={(v) => setField("pinned", v)} />
                  <Label htmlFor="pinned-toggle" className="cursor-pointer text-sm font-medium text-white/70">Pinned to hub</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="trending-toggle" checked={form.trending} onCheckedChange={(v) => setField("trending", v)} />
                  <Label htmlFor="trending-toggle" className="cursor-pointer text-sm font-medium text-white/70">Trending article</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSaving || isUploading || isUploadingGallery} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600" data-ocid="blog-save-btn">
              {isSaving || isUploading || isUploadingGallery ? "Saving…" : editTarget ? "Save Changes" : "Create Article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
    const scheduled = posts.filter((p) => p.status === "scheduled").length;
    return { total, published, drafts, scheduled };
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
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
        publishedAt: newStatus === "published" ? (post.publishedAt ?? new Date().toISOString()) : null,
      });
      toast.success(newStatus === "published" ? "Article published" : "Article moved to drafts");
    } catch {
      toast.error("Failed to update article status");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBlogPost(deleteTarget.id);
      toast.success(`Article "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <BookOpen className="h-6 w-6 text-primary" />
              Knowledge Hub
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage robotics tutorials, projects, guides, and SEO-ready articles in one place.</p>
          </div>
          <Button onClick={openCreate} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600" data-ocid="create-post-btn">
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Dashboard", description: "Overview and publishing insights", icon: <FileText className="h-4 w-4" /> },
            { label: "Articles", description: "Create, edit, publish, and schedule", icon: <BookOpen className="h-4 w-4" /> },
            { label: "Categories", description: "Organize topics and collections", icon: <Layers3 className="h-4 w-4" /> },
            { label: "Tags", description: "Improve discoverability", icon: <Tag className="h-4 w-4" /> },
            { label: "Authors", description: "Manage experts and contributors", icon: <Users2 className="h-4 w-4" /> },
            { label: "Media", description: "Image and asset library", icon: <ImageIcon className="h-4 w-4" /> },
            { label: "SEO", description: "Metadata, previews, and canonical URLs", icon: <Sparkles className="h-4 w-4" /> },
            { label: "Settings", description: "Knowledge hub defaults", icon: <Pencil className="h-4 w-4" /> },
            { label: "Bulk Import", description: "Placeholder for future imports", icon: <FileText className="h-4 w-4" /> },
            { label: "Analytics", description: "Placeholder for future insights", icon: <Eye className="h-4 w-4" /> },
          ].map((section) => (
            <div key={section.label} className="rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {section.icon}
                {section.label}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{section.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatsCard label="Total Articles" value={stats.total} icon={<FileText className="h-5 w-5" />} accent="blue" />
          <StatsCard label="Published" value={stats.published} icon={<Eye className="h-5 w-5" />} accent="green" />
          <StatsCard label="Drafts" value={stats.drafts} icon={<Pencil className="h-5 w-5" />} accent="amber" />
          <StatsCard label="Scheduled" value={stats.scheduled} icon={<Calendar className="h-5 w-5" />} accent="blue" />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by title, excerpt, or author…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" data-ocid="blog-search-input" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-40" data-ocid="blog-status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44" data-ocid="blog-category-filter">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {loading ? (
            SKELETON_KEYS.map((k) => <SkeletonRow key={k} />)
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 py-16 text-center" data-ocid="blog-empty-state">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-base font-semibold text-foreground">{search || statusFilter !== "all" || categoryFilter !== "all" ? "No articles match your filters" : "No articles yet"}</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">{search || statusFilter !== "all" || categoryFilter !== "all" ? "Try adjusting your search or filter criteria." : "Create your first knowledge-hub article to start publishing content."}</p>
              {!search && statusFilter === "all" && categoryFilter === "all" && (
                <Button className="mt-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600" onClick={openCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Article
                </Button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((post) => (
                <PostRow key={post.id} post={post} onEdit={openEdit} onDelete={setDeleteTarget} onToggleStatus={handleToggleStatus} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      <BlogDialog open={dialogOpen} editTarget={editTarget} onClose={() => setDialogOpen(false)} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="border-border/60 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{deleteTarget?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-ocid="blog-delete-confirm-btn">
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
