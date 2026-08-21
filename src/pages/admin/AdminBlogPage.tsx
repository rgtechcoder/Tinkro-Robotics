import { AdminLayout } from "@/components/admin/AdminLayout";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { validateAdminUploadFile } from "@/lib/adminUploadValidation";
import type { AdminBlogPost } from "@/types/admin";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
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
  X,
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
const ROBOTS_VALUES = ["index,follow", "noindex,nofollow"];
const AGE_GROUPS = ["All Ages", "Kids", "Teens", "Adults"];
const EDUCATION_LEVELS = ["School", "College", "Professional", "Beginner", "Advanced"];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

interface BlogFormValues {
  title: string;
  slug: string;
  category: string;
  categories: string;
  subCategory: string;
  articleType: string;
  contentType: string;
  shortDescription: string;
  author: string;
  authorBio: string;
  authorImage: string;
  authorLinkedIn: string;
  authorGithub: string;
  authorWebsite: string;
  reviewer: string;
  editor: string;
  publishedBy: string;
  updatedBy: string;
  excerpt: string;
  summary: string;
  content: string;
  tags: string;
  status: "draft" | "published" | "scheduled" | "private";
  featuredImage: string;
  thumbnail: string;
  images: string[];
  gallery: string[];
  featuredVideo: string;
  pinned: boolean;
  featured: boolean;
  trending: boolean;
  readingTime: string;
  scheduledAt: string;
  publishDate: string;
  scheduleDate: string;
  language: string;
  visibility: string;
  skillLevel: string;
  difficulty: string;
  targetAudience: string[];
  keyTakeaways: string[];
  prerequisites: string[];
  estimatedBuildTime: string;
  estimatedProjectCost: string;
  relatedBlogs: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  aiSummary: string;
  ageGroup: string;
  educationLevel: string;
  estimatedDuration: string;
  version: string;
  changeLog: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywords: string;
  secondaryKeywords: string;
  canonicalUrl: string;
  robots: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  seoScore: string;
  readability: string;
  keywordDensity: string;
  jsonLdPreview: string;
  googlePreview: string;
  facebookPreview: string;
  twitterPreview: string;
  learningPath: string;
  course: string;
  topicCluster: string;
  series: string;
  technology: string;
  programmingLanguage: string;
  board: string;
  sensors: string;
  modules: string;
  applications: string;
  industries: string;
  requiredComponents: string;
  billOfMaterials: string;
  requiredSoftware: string;
  arduinoIdeVersion: string;
  platform: string;
  circuitDiagramUrl: string;
  wiringDiagramUrl: string;
  githubRepository: string;
  sourceCodeUrl: string;
  simulationUrl: string;
  pcbFiles: string;
  gerberFiles: string;
  firmware: string;
  stlFiles: string;
  threeDModels: string;
  downloads: string;
  resources: string;
  datasheets: string;
  references: string;
  relatedProducts: string;
  recommendedProducts: string;
  accessories: string;
  replacementParts: string;
  upsellProducts: string;
  crossSellProducts: string;
  relatedTutorials: string;
  relatedProjects: string;
  faqItems: string;
  approvalStatus: string;
  revisionNumber: string;
  reviewDate: string;
  publishedDate: string;
  lastUpdated: string;
}

interface FormErrors {
  title?: string;
  author?: string;
  content?: string;
  slug?: string;
  readingTime?: string;
  difficulty?: string;
  robots?: string;
  ctaButtonLink?: string;
}

interface SeoWarning {
  field: string;
  message: string;
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

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function normalizeListItems(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function dedupeListItems(items: string[]) {
  return Array.from(new Set(normalizeListItems(items)));
}

function validateForm(values: BlogFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.author.trim()) errors.author = "Author is required";
  if (!values.content.trim()) errors.content = "Content is required";
  if (!values.slug.trim()) errors.slug = "Slug is required";
  if (values.readingTime.trim()) {
    const parsed = Number(values.readingTime);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      errors.readingTime = "Reading time must be greater than 0";
    }
  }
  if (values.difficulty.trim() && !DIFFICULTY_LEVELS.includes(values.difficulty.trim())) {
    errors.difficulty = "Difficulty must be Beginner, Intermediate, or Advanced";
  }
  if (values.robots.trim() && !ROBOTS_VALUES.includes(values.robots.trim())) {
    errors.robots = "Robots must be index,follow or noindex,nofollow";
  }
  if (values.ctaButtonLink.trim() && !isValidUrl(values.ctaButtonLink.trim())) {
    errors.ctaButtonLink = "CTA button link must be a valid URL";
  }
  return errors;
}

function getSeoWarnings(values: BlogFormValues): SeoWarning[] {
  const warnings: SeoWarning[] = [];
  const title = values.title.trim();
  const slug = slugify(values.slug || title);
  const canonicalUrl = values.canonicalUrl.trim();
  const expectedCanonical = title ? `https://tinkro.in/blog/${slug}` : "";

  if (!values.metaTitle.trim()) {
    warnings.push({ field: "metaTitle", message: "Meta title is missing; add a concise title for search results." });
  } else if (values.metaTitle.length > 60) {
    warnings.push({ field: "metaTitle", message: "Meta title is longer than 60 characters; shorten it for best search display." });
  } else if (values.metaTitle.length < 30) {
    warnings.push({ field: "metaTitle", message: "Meta title is short; a more descriptive title may improve SEO." });
  }

  if (!values.metaDescription.trim()) {
    warnings.push({ field: "metaDescription", message: "Meta description is missing; add a summary for search snippets." });
  } else if (values.metaDescription.length > 160) {
    warnings.push({ field: "metaDescription", message: "Meta description is longer than 160 characters; shorten it for search results." });
  } else if (values.metaDescription.length < 50) {
    warnings.push({ field: "metaDescription", message: "Meta description is short; a fuller summary can improve click-through rate." });
  }

  if (!slug) {
    warnings.push({ field: "slug", message: "SEO slug is empty or invalid; make sure the article slug is URL-friendly." });
  } else if (values.slug && values.slug !== slug) {
    warnings.push({ field: "slug", message: "SEO slug contains invalid characters; it has been normalized for canonical URL generation." });
  }

  if (!canonicalUrl) {
    warnings.push({ field: "canonicalUrl", message: "Canonical URL is missing; add the published article URL to avoid duplicate content issues." });
  } else {
    try {
      const url = new URL(canonicalUrl);
      if (!url.hostname.includes("tinkro.in")) {
        warnings.push({ field: "canonicalUrl", message: "Canonical URL should use the official tinkro.in domain." });
      }
      if (expectedCanonical && !canonicalUrl.endsWith(`/${slug}`)) {
        warnings.push({ field: "canonicalUrl", message: `Canonical URL does not match the current slug. Expected ${expectedCanonical}.` });
      }
    } catch {
      warnings.push({ field: "canonicalUrl", message: "Canonical URL is not a valid URL; correct it or leave it blank to use the default blog URL." });
    }
  }

  if (!values.openGraphTitle.trim()) {
    warnings.push({ field: "openGraphTitle", message: "Open Graph title is missing; add a title for social sharing." });
  }
  if (!values.openGraphDescription.trim()) {
    warnings.push({ field: "openGraphDescription", message: "Open Graph description is missing; add a description for social previews." });
  }
  if (!values.openGraphImage.trim()) {
    warnings.push({ field: "openGraphImage", message: "Open Graph image is missing; add an image URL for rich social sharing." });
  }

  if (!values.twitterTitle.trim()) {
    warnings.push({ field: "twitterTitle", message: "Twitter title is missing; add a title for Twitter card previews." });
  }
  if (!values.twitterDescription.trim()) {
    warnings.push({ field: "twitterDescription", message: "Twitter description is missing; add a description for Twitter cards." });
  }
  if (!values.twitterImage.trim()) {
    warnings.push({ field: "twitterImage", message: "Twitter image is missing; add an image URL for Twitter cards." });
  }

  if (!values.focusKeyword.trim()) {
    warnings.push({ field: "focusKeyword", message: "Focus keyword is missing; add a primary keyword for SEO guidance." });
  }

  if (!values.readability.trim()) {
    warnings.push({ field: "readability", message: "Readability score or notes are missing; review the article for reading ease." });
  }

  return warnings;
}

const DEFAULT_FORM: BlogFormValues = {
  title: "",
  slug: "",
  category: "Technology",
  categories: "",
  subCategory: "",
  articleType: "Learning Article",
  contentType: "Article",
  shortDescription: "",
  author: "",
  authorBio: "",
  authorImage: "",
  authorLinkedIn: "",
  authorGithub: "",
  authorWebsite: "",
  reviewer: "",
  editor: "",
  publishedBy: "",
  updatedBy: "",
  excerpt: "",
  summary: "",
  content: "",
  tags: "",
  status: "draft",
  featuredImage: "",
  thumbnail: "",
  images: [],
  gallery: [],
  featuredVideo: "",
  pinned: false,
  featured: false,
  trending: false,
  readingTime: "",
  scheduledAt: "",
  publishDate: "",
  scheduleDate: "",
  language: "English",
  visibility: "Public",
  skillLevel: "Beginner",
  difficulty: "Beginner",
  targetAudience: [],
  keyTakeaways: [],
  prerequisites: [],
  estimatedBuildTime: "",
  estimatedProjectCost: "",
  relatedBlogs: [],
  ctaTitle: "",
  ctaDescription: "",
  ctaButtonText: "",
  ctaButtonLink: "",
  aiSummary: "",
  ageGroup: "All Ages",
  educationLevel: "School",
  estimatedDuration: "",
  version: "1.0",
  changeLog: "",
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "",
  keywords: "",
  secondaryKeywords: "",
  canonicalUrl: "",
  robots: "index,follow",
  openGraphTitle: "",
  openGraphDescription: "",
  openGraphImage: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  seoScore: "",
  readability: "",
  keywordDensity: "",
  jsonLdPreview: "",
  googlePreview: "",
  facebookPreview: "",
  twitterPreview: "",
  learningPath: "",
  course: "",
  topicCluster: "",
  series: "",
  technology: "",
  programmingLanguage: "",
  board: "",
  sensors: "",
  modules: "",
  applications: "",
  industries: "",
  requiredComponents: "",
  billOfMaterials: "",
  requiredSoftware: "",
  arduinoIdeVersion: "",
  platform: "",
  circuitDiagramUrl: "",
  wiringDiagramUrl: "",
  githubRepository: "",
  sourceCodeUrl: "",
  simulationUrl: "",
  pcbFiles: "",
  gerberFiles: "",
  firmware: "",
  stlFiles: "",
  threeDModels: "",
  downloads: "",
  resources: "",
  datasheets: "",
  references: "",
  relatedProducts: "",
  recommendedProducts: "",
  accessories: "",
  replacementParts: "",
  upsellProducts: "",
  crossSellProducts: "",
  relatedTutorials: "",
  relatedProjects: "",
  faqItems: "",
  approvalStatus: "Draft",
  revisionNumber: "1",
  reviewDate: "",
  publishedDate: "",
  lastUpdated: "",
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
          {isPublished ? formatDate(post.publishedAt ?? post.publishedDate) : formatDate(post.createdAt)}
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
  allPosts: AdminBlogPost[];
  onClose: () => void;
}

function BlogDialog({ open, editTarget, allPosts, onClose }: BlogDialogProps) {
  const [form, setForm] = useState<BlogFormValues>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [audienceInput, setAudienceInput] = useState("");
  const [takeawayInput, setTakeawayInput] = useState("");
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [relatedBlogSearch, setRelatedBlogSearch] = useState("");
  const [openSections, setOpenSections] = useState({
    projectInfo: true,
    learningContent: true,
    cta: true,
    relatedContent: true,
    ai: true,
    seoAdvanced: true,
  });
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
        categories: (editTarget.categories ?? []).join(", "),
        subCategory: editTarget.subCategory ?? "",
        articleType: editTarget.articleType ?? "Learning Article",
        contentType: editTarget.contentFormat ?? "Article",
        shortDescription: editTarget.shortDescription ?? "",
        author: editTarget.author ?? "",
        authorBio: editTarget.authorBio ?? "",
        authorImage: editTarget.authorImage ?? "",
        authorLinkedIn: editTarget.authorLinkedIn ?? "",
        authorGithub: editTarget.authorGithub ?? "",
        authorWebsite: editTarget.authorWebsite ?? "",
        reviewer: editTarget.reviewer ?? "",
        editor: editTarget.editor ?? "",
        publishedBy: editTarget.publishedBy ?? "",
        updatedBy: editTarget.updatedBy ?? "",
        excerpt: editTarget.excerpt ?? "",
        summary: editTarget.summary ?? "",
        content: editTarget.content ?? "",
        tags: (editTarget.tags ?? []).join(", "),
        status: editTarget.status ?? "draft",
        featuredImage: editTarget.featuredImage ?? "",
        thumbnail: editTarget.thumbnail ?? "",
        images: Array.isArray(editTarget.images) ? editTarget.images : [],
        gallery: Array.isArray(editTarget.gallery) ? editTarget.gallery : [],
        featuredVideo: editTarget.featuredVideo ?? "",
        pinned: Boolean(editTarget.pinned),
        featured: Boolean(editTarget.featured),
        trending: Boolean(editTarget.trending),
        readingTime: editTarget.readingTime ? String(editTarget.readingTime) : "",
        scheduledAt: editTarget.scheduledAt ?? "",
        publishDate: editTarget.publishDate ?? "",
        scheduleDate: editTarget.scheduleDate ?? "",
        language: editTarget.language ?? "English",
        visibility: editTarget.visibility ?? "Public",
        skillLevel: editTarget.skillLevel ?? "Beginner",
        difficulty: editTarget.difficulty ?? "Beginner",
        targetAudience: Array.isArray(editTarget.targetAudience) ? dedupeListItems(editTarget.targetAudience) : [],
        keyTakeaways: Array.isArray(editTarget.keyTakeaways) ? normalizeListItems(editTarget.keyTakeaways) : [],
        prerequisites: Array.isArray(editTarget.prerequisites) ? normalizeListItems(editTarget.prerequisites) : [],
        estimatedBuildTime: editTarget.estimatedBuildTime ?? "",
        estimatedProjectCost: editTarget.estimatedProjectCost ?? "",
        relatedBlogs: Array.isArray(editTarget.relatedBlogs) ? dedupeListItems(editTarget.relatedBlogs) : [],
        ctaTitle: editTarget.ctaTitle ?? "",
        ctaDescription: editTarget.ctaDescription ?? "",
        ctaButtonText: editTarget.ctaButtonText ?? "",
        ctaButtonLink: editTarget.ctaButtonLink ?? "",
        aiSummary: editTarget.aiSummary ?? "",
        ageGroup: editTarget.ageGroup ?? "All Ages",
        educationLevel: editTarget.educationLevel ?? "School",
        estimatedDuration: editTarget.estimatedDuration ?? "",
        version: editTarget.version ?? "1.0",
        changeLog: editTarget.changeLog ?? "",
        metaTitle: editTarget.metaTitle ?? "",
        metaDescription: editTarget.metaDescription ?? "",
        focusKeyword: editTarget.focusKeyword ?? "",
        keywords: (editTarget.keywords ?? []).join(", "),
        secondaryKeywords: (editTarget.secondaryKeywords ?? []).join(", "),
        canonicalUrl: editTarget.canonicalUrl ?? "",
        robots: editTarget.robots ?? "index,follow",
        openGraphTitle: editTarget.openGraphTitle ?? "",
        openGraphDescription: editTarget.openGraphDescription ?? "",
        openGraphImage: editTarget.openGraphImage ?? "",
        twitterTitle: editTarget.twitterTitle ?? "",
        twitterDescription: editTarget.twitterDescription ?? "",
        twitterImage: editTarget.twitterImage ?? "",
        seoScore: editTarget.seoScore ? String(editTarget.seoScore) : "",
        readability: editTarget.readability ?? "",
        keywordDensity: editTarget.keywordDensity ?? "",
        jsonLdPreview: editTarget.jsonLdPreview ?? "",
        googlePreview: editTarget.googlePreview ?? "",
        facebookPreview: editTarget.facebookPreview ?? "",
        twitterPreview: editTarget.twitterPreview ?? "",
        learningPath: (editTarget.learningPath ?? []).join(", "),
        course: (editTarget.course ?? []).join(", "),
        topicCluster: (editTarget.topicCluster ?? []).join(", "),
        series: (editTarget.series ?? []).join(", "),
        technology: (editTarget.technology ?? []).join(", "),
        programmingLanguage: (editTarget.programmingLanguage ?? []).join(", "),
        board: (editTarget.board ?? []).join(", "),
        sensors: (editTarget.sensors ?? []).join(", "),
        modules: (editTarget.modules ?? []).join(", "),
        applications: (editTarget.applications ?? []).join(", "),
        industries: (editTarget.industries ?? []).join(", "),
        requiredComponents: (editTarget.requiredComponents ?? []).join(", "),
        billOfMaterials: (editTarget.billOfMaterials ?? []).join(", "),
        requiredSoftware: (editTarget.requiredSoftware ?? []).join(", "),
        arduinoIdeVersion: editTarget.arduinoIdeVersion ?? "",
        platform: editTarget.platform ?? "",
        circuitDiagramUrl: editTarget.circuitDiagramUrl ?? "",
        wiringDiagramUrl: editTarget.wiringDiagramUrl ?? "",
        githubRepository: editTarget.githubRepository ?? "",
        sourceCodeUrl: editTarget.sourceCodeUrl ?? "",
        simulationUrl: editTarget.simulationUrl ?? "",
        pcbFiles: (editTarget.pcbFiles ?? []).join(", "),
        gerberFiles: (editTarget.gerberFiles ?? []).join(", "),
        firmware: (editTarget.firmware ?? []).join(", "),
        stlFiles: (editTarget.stlFiles ?? []).join(", "),
        threeDModels: (editTarget.threeDModels ?? []).join(", "),
        downloads: (editTarget.downloads ?? []).join(", "),
        resources: (editTarget.resources ?? []).join(", "),
        datasheets: (editTarget.datasheets ?? []).join(", "),
        references: (editTarget.references ?? []).join(", "),
        relatedProducts: (editTarget.relatedProducts ?? []).join(", "),
        recommendedProducts: (editTarget.recommendedProducts ?? []).join(", "),
        accessories: (editTarget.accessories ?? []).join(", "),
        replacementParts: (editTarget.replacementParts ?? []).join(", "),
        upsellProducts: (editTarget.upsellProducts ?? []).join(", "),
        crossSellProducts: (editTarget.crossSellProducts ?? []).join(", "),
        relatedTutorials: (editTarget.relatedTutorials ?? []).join(", "),
        relatedProjects: (editTarget.relatedProjects ?? []).join(", "),
        faqItems: (editTarget.faqItems ?? []).map((item) => `${item.question}::${item.answer}::${item.order}`).join("|"),
        approvalStatus: editTarget.approvalStatus ?? "Draft",
        revisionNumber: editTarget.revisionNumber ?? "1",
        reviewDate: editTarget.reviewDate ?? "",
        publishedDate: editTarget.publishedDate ?? "",
        lastUpdated: toDateInputValue(editTarget.lastUpdated),
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setActiveTab("basic");
    setAudienceInput("");
    setTakeawayInput("");
    setPrerequisiteInput("");
    setRelatedBlogSearch("");
    setErrors({});
  }, [open, editTarget]);

  function setField<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function toggleSection(section: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function addListItem(field: "keyTakeaways" | "prerequisites", value: string) {
    const next = value.trim();
    if (!next) return;
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], next],
    }));
  }

  function removeListItem(field: "keyTakeaways" | "prerequisites", index: number) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, idx) => idx !== index),
    }));
  }

  function moveListItem(field: "keyTakeaways" | "prerequisites", index: number, direction: "up" | "down") {
    setForm((prev) => {
      const items = [...prev[field]];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      const [moved] = items.splice(index, 1);
      items.splice(targetIndex, 0, moved);
      return { ...prev, [field]: items };
    });
  }

  function addTargetAudience(value: string) {
    const next = value.trim();
    if (!next) return;
    setForm((prev) => ({
      ...prev,
      targetAudience: dedupeListItems([...prev.targetAudience, next]),
    }));
  }

  function removeTargetAudience(index: number) {
    setForm((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience.filter((_, idx) => idx !== index),
    }));
  }

  function toggleRelatedBlog(value: string) {
    setForm((prev) => {
      const exists = prev.relatedBlogs.includes(value);
      return {
        ...prev,
        relatedBlogs: exists
          ? prev.relatedBlogs.filter((item) => item !== value)
          : [...prev.relatedBlogs, value],
      };
    });
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

    const validation = validateAdminUploadFile(file, "image");
    if (!validation.ok) {
      toast.error(validation.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const tempId = editTarget?.id ?? `temp-${Date.now()}`;
      const url = await uploadBlogImage(file, tempId);
      setField("featuredImage", url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleGalleryUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const invalid = files
      .map((file) => ({ file, result: validateAdminUploadFile(file, "image") }))
      .filter((entry) => !entry.result.ok);

    if (invalid.length > 0) {
      for (const entry of invalid) {
        toast.error(`${entry.file.name}: ${entry.result.ok ? "" : entry.result.message}`);
      }
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      return;
    }

    setIsUploadingGallery(true);
    try {
      const tempId = editTarget?.id ?? `temp-${Date.now()}`;
      const uploaded = await Promise.all(files.map((file) => uploadBlogImage(file, tempId)));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload images");
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
      const secondaryKeywordArr = form.secondaryKeywords
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const parseList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);
      const normalizedTargetAudience = dedupeListItems(form.targetAudience);
      const normalizedKeyTakeaways = normalizeListItems(form.keyTakeaways);
      const normalizedPrerequisites = normalizeListItems(form.prerequisites);
      const normalizedRelatedBlogs = dedupeListItems(form.relatedBlogs);
      const normalizedDifficulty = form.difficulty.trim();
      const normalizedRobots = form.robots.trim();
      const normalizedReadingTime = form.readingTime.trim() ? Number(form.readingTime) : undefined;
      const faqItems = form.faqItems
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
          const [question, answer, order] = item.split("::");
          return { question: question ?? "", answer: answer ?? "", order: Number(order ?? 0) };
        })
        .filter((item) => item.question || item.answer);
      const seoScore = Number(form.seoScore) || Math.min(100, 60 + tagsArr.length * 4 + (form.metaTitle ? 8 : 0) + (form.canonicalUrl ? 8 : 0));

      const payload = {
        title: form.title.trim(),
        slug: form.slug || slugify(form.title),
        category: form.category,
        publishedAt: form.status === "published" ? (editTarget?.publishedAt ?? editTarget?.publishedDate ?? editTarget?.publishDate ?? new Date().toISOString()) : (editTarget?.publishedAt ?? editTarget?.publishedDate ?? editTarget?.publishDate ?? undefined),
        categories: parseList(form.categories),
        subCategory: form.subCategory || undefined,
        articleType: form.articleType,
        contentFormat: form.contentType || "Article",
        shortDescription: form.shortDescription || undefined,
        author: form.author.trim(),
        authorBio: form.authorBio || undefined,
        authorImage: form.authorImage || undefined,
        authorLinkedIn: form.authorLinkedIn || undefined,
        authorGithub: form.authorGithub || undefined,
        authorWebsite: form.authorWebsite || undefined,
        reviewer: form.reviewer || undefined,
        editor: form.editor || undefined,
        publishedBy: form.publishedBy || undefined,
        updatedBy: form.updatedBy || undefined,
        excerpt: form.excerpt.trim() || autoExcerpt(form.content),
        summary: form.summary.trim() || autoExcerpt(form.content),
        content: form.content.trim(),
        tags: tagsArr,
        status: form.status,
        featuredImage: form.featuredImage || undefined,
        thumbnail: form.thumbnail || undefined,
        images: form.images,
        gallery: form.gallery,
        featuredVideo: form.featuredVideo || undefined,
        pinned: form.pinned,
        featured: form.featured,
        trending: form.trending,
        readingTime: normalizedReadingTime,
        scheduledAt: form.status === "scheduled" && form.scheduledAt ? form.scheduledAt : undefined,
        publishDate: form.status === "published" ? (editTarget?.publishDate ?? new Date().toISOString()) : undefined,
        scheduleDate: form.scheduleDate || undefined,
        language: form.language || undefined,
        visibility: form.visibility || undefined,
        skillLevel: form.skillLevel || undefined,
        difficulty: normalizedDifficulty || undefined,
        targetAudience: normalizedTargetAudience,
        keyTakeaways: normalizedKeyTakeaways,
        prerequisites: normalizedPrerequisites,
        estimatedBuildTime: form.estimatedBuildTime.trim() || undefined,
        estimatedProjectCost: form.estimatedProjectCost.trim() || undefined,
        ageGroup: form.ageGroup,
        educationLevel: form.educationLevel,
        estimatedDuration: form.estimatedDuration || undefined,
        version: form.version || undefined,
        changeLog: form.changeLog || undefined,
        metaTitle: form.metaTitle || form.title.trim(),
        metaDescription: form.metaDescription || autoExcerpt(form.content),
        focusKeyword: form.focusKeyword || form.title.trim(),
        keywords: keywordArr,
        secondaryKeywords: secondaryKeywordArr,
        canonicalUrl: form.canonicalUrl || `https://tinkro.in/blog/${form.slug || slugify(form.title)}`,
        robots: normalizedRobots || "index,follow",
        openGraphTitle: form.openGraphTitle || form.title.trim(),
        openGraphDescription: form.openGraphDescription || autoExcerpt(form.content),
        openGraphImage: form.openGraphImage || undefined,
        twitterTitle: form.twitterTitle || form.title.trim(),
        twitterDescription: form.twitterDescription || autoExcerpt(form.content),
        twitterImage: form.twitterImage || undefined,
        seoScore,
        readability: form.readability || undefined,
        keywordDensity: form.keywordDensity || undefined,
        jsonLdPreview: form.jsonLdPreview || undefined,
        googlePreview: form.googlePreview || `${form.title.trim()} | Tinkro Knowledge Hub`,
        facebookPreview: form.facebookPreview || `${form.title.trim()} | Tinkro Knowledge Hub`,
        twitterPreview: form.twitterPreview || `${form.title.trim()} | Tinkro Knowledge Hub`,
        learningPath: parseList(form.learningPath),
        course: parseList(form.course),
        topicCluster: parseList(form.topicCluster),
        series: parseList(form.series),
        technology: parseList(form.technology),
        programmingLanguage: parseList(form.programmingLanguage),
        board: parseList(form.board),
        sensors: parseList(form.sensors),
        modules: parseList(form.modules),
        applications: parseList(form.applications),
        industries: parseList(form.industries),
        requiredComponents: parseList(form.requiredComponents),
        billOfMaterials: parseList(form.billOfMaterials),
        requiredSoftware: parseList(form.requiredSoftware),
        arduinoIdeVersion: form.arduinoIdeVersion || undefined,
        platform: form.platform || undefined,
        circuitDiagramUrl: form.circuitDiagramUrl || undefined,
        wiringDiagramUrl: form.wiringDiagramUrl || undefined,
        githubRepository: form.githubRepository || undefined,
        sourceCodeUrl: form.sourceCodeUrl || undefined,
        simulationUrl: form.simulationUrl || undefined,
        pcbFiles: parseList(form.pcbFiles),
        gerberFiles: parseList(form.gerberFiles),
        firmware: parseList(form.firmware),
        stlFiles: parseList(form.stlFiles),
        threeDModels: parseList(form.threeDModels),
        downloads: parseList(form.downloads),
        resources: parseList(form.resources),
        datasheets: parseList(form.datasheets),
        references: parseList(form.references),
        relatedProducts: parseList(form.relatedProducts),
        relatedBlogs: normalizedRelatedBlogs,
        recommendedProducts: parseList(form.recommendedProducts),
        ctaTitle: form.ctaTitle.trim() || undefined,
        ctaDescription: form.ctaDescription.trim() || undefined,
        ctaButtonText: form.ctaButtonText.trim() || undefined,
        ctaButtonLink: form.ctaButtonLink.trim() || undefined,
        accessories: parseList(form.accessories),
        replacementParts: parseList(form.replacementParts),
        upsellProducts: parseList(form.upsellProducts),
        crossSellProducts: parseList(form.crossSellProducts),
        relatedTutorials: parseList(form.relatedTutorials),
        relatedProjects: parseList(form.relatedProjects),
        aiSummary: form.aiSummary.trim() || undefined,
        faqItems,
        approvalStatus: form.approvalStatus || undefined,
        revisionNumber: form.revisionNumber || undefined,
        reviewDate: form.reviewDate || undefined,
        publishedDate: form.publishedDate || undefined,
        lastUpdated: form.lastUpdated || undefined,
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

  const relatedBlogOptions = useMemo(() => {
    const currentId = editTarget?.id;
    const query = relatedBlogSearch.trim().toLowerCase();
    return allPosts
      .filter((post) => post.id !== currentId)
      .filter((post) => {
        if (!query) return true;
        const slugValue = (post.slug || post.id).toLowerCase();
        return post.title.toLowerCase().includes(query) || slugValue.includes(query);
      })
      .slice(0, 25)
      .map((post) => ({
        label: post.title,
        value: post.slug?.trim() ? post.slug : post.id,
      }));
  }, [allPosts, editTarget?.id, relatedBlogSearch]);

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
              <TabsTrigger value="classification">Classification</TabsTrigger>
              <TabsTrigger value="robotics">Robotics</TabsTrigger>
              <TabsTrigger value="product-links">Product Links</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="author">Author</TabsTrigger>
              <TabsTrigger value="publishing">Publishing</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-short-description" className={labelClass}>Short Description</Label>
                  <Textarea id="blog-short-description" value={form.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} placeholder="Short overview for the hub" rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-excerpt" className={labelClass}>Excerpt</Label>
                  <Textarea id="blog-excerpt" value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value.slice(0, 160))} placeholder="Short summary" rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} data-ocid="blog-excerpt-input" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-language" className={labelClass}>Language</Label>
                  <Input id="blog-language" value={form.language} onChange={(e) => setField("language", e.target.value)} placeholder="English" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-visibility" className={labelClass}>Visibility</Label>
                  <Input id="blog-visibility" value={form.visibility} onChange={(e) => setField("visibility", e.target.value)} placeholder="Public" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-reading-time" className={labelClass}>Reading Time (minutes)</Label>
                  <Input id="blog-reading-time" type="number" value={form.readingTime} onChange={(e) => setField("readingTime", e.target.value)} placeholder="8" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-estimated-duration" className={labelClass}>Estimated Duration</Label>
                  <Input id="blog-estimated-duration" value={form.estimatedDuration} onChange={(e) => setField("estimatedDuration", e.target.value)} placeholder="45 mins" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-skill-level" className={labelClass}>Skill Level</Label>
                  <Input id="blog-skill-level" value={form.skillLevel} onChange={(e) => setField("skillLevel", e.target.value)} placeholder="Beginner" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-version" className={labelClass}>Version</Label>
                  <Input id="blog-version" value={form.version} onChange={(e) => setField("version", e.target.value)} placeholder="1.0" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blog-change-log" className={labelClass}>Change Log</Label>
                <Textarea id="blog-change-log" value={form.changeLog} onChange={(e) => setField("changeLog", e.target.value)} placeholder="Describe updates or milestones" rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="blog-summary" className={labelClass}>Summary</Label>
                <Textarea id="blog-summary" value={form.summary} onChange={(e) => setField("summary", e.target.value)} placeholder="Expanded summary for the article" rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blog-content" className={labelClass}>Article Content *</Label>
                <RichTextEditor value={form.content} onChange={(value) => handleContentChange(value)} placeholder="Write article content here. Use the toolbar for headings, tables, CTAs, downloads, references, robotics blocks, and embeds." />
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

              <div className="space-y-1.5">
                <Label htmlFor="secondary-keywords" className={labelClass}>Secondary Keywords</Label>
                <Input id="secondary-keywords" value={form.secondaryKeywords} onChange={(e) => setField("secondaryKeywords", e.target.value)} placeholder="stem, coding" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
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
                <p className="mt-2 text-xs text-white/60">Canonical: {form.canonicalUrl.trim() || `https://tinkro.in/blog/${slugify(form.slug || form.title || "article")}`}</p>
                <p className="mt-2 text-xs text-emerald-400">SEO score: {form.seoScore || "Auto-generated"}</p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                <div className="mb-2 flex items-center gap-2 font-semibold text-amber-100">
                  <AlertCircle className="h-4 w-4" />
                  SEO validation warnings
                </div>
                {getSeoWarnings(form).length === 0 ? (
                  <p className="text-xs text-emerald-200">No SEO warnings detected. The current fields look good for publish-ready metadata.</p>
                ) : (
                  <ul className="space-y-2">
                    {getSeoWarnings(form).map((warning) => (
                      <li key={warning.field} className="rounded-md border border-amber-400/20 bg-amber-500/5 p-3">
                        <p className="font-medium text-white">{warning.field.replace(/([A-Z])/g, " $1")}</p>
                        <p className="mt-1 text-xs text-amber-100">{warning.message}</p>
                      </li>
                    ))}
                  </ul>
                )}
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-categories" className={labelClass}>Categories</Label>
                  <Input id="blog-categories" value={form.categories} onChange={(e) => setField("categories", e.target.value)} placeholder="Robotics, STEM" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-tags" className={labelClass}>Tags</Label>
                  <Input id="blog-tags" value={form.tags} onChange={(e) => setField("tags", e.target.value)} placeholder="robotics, arduino, stem" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} data-ocid="blog-tags-input" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-learning-path" className={labelClass}>Learning Path</Label>
                  <Input id="blog-learning-path" value={form.learningPath} onChange={(e) => setField("learningPath", e.target.value)} placeholder="Beginner, Intermediate" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-course" className={labelClass}>Course</Label>
                  <Input id="blog-course" value={form.course} onChange={(e) => setField("course", e.target.value)} placeholder="Robotics Fundamentals" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-topic-cluster" className={labelClass}>Topic Cluster</Label>
                  <Input id="blog-topic-cluster" value={form.topicCluster} onChange={(e) => setField("topicCluster", e.target.value)} placeholder="Sensors, Automation" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-series" className={labelClass}>Series</Label>
                  <Input id="blog-series" value={form.series} onChange={(e) => setField("series", e.target.value)} placeholder="STEM Lab" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="robotics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-required-components" className={labelClass}>Required Components</Label>
                  <Input id="blog-required-components" value={form.requiredComponents} onChange={(e) => setField("requiredComponents", e.target.value)} placeholder="Motor, Sensor, Battery" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-bom" className={labelClass}>Bill of Materials</Label>
                  <Input id="blog-bom" value={form.billOfMaterials} onChange={(e) => setField("billOfMaterials", e.target.value)} placeholder="Arduino UNO, Servo" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-required-software" className={labelClass}>Required Software</Label>
                  <Input id="blog-required-software" value={form.requiredSoftware} onChange={(e) => setField("requiredSoftware", e.target.value)} placeholder="Arduino IDE" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-arduino-ide" className={labelClass}>Arduino IDE Version</Label>
                  <Input id="blog-arduino-ide" value={form.arduinoIdeVersion} onChange={(e) => setField("arduinoIdeVersion", e.target.value)} placeholder="2.x" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-platform" className={labelClass}>Platform</Label>
                  <Input id="blog-platform" value={form.platform} onChange={(e) => setField("platform", e.target.value)} placeholder="Arduino / ESP32" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-github" className={labelClass}>GitHub Repository</Label>
                  <Input id="blog-github" value={form.githubRepository} onChange={(e) => setField("githubRepository", e.target.value)} placeholder="https://github.com/..." className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-source-code" className={labelClass}>Source Code URL</Label>
                  <Input id="blog-source-code" value={form.sourceCodeUrl} onChange={(e) => setField("sourceCodeUrl", e.target.value)} placeholder="https://..." className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-simulation" className={labelClass}>Simulation URL</Label>
                  <Input id="blog-simulation" value={form.simulationUrl} onChange={(e) => setField("simulationUrl", e.target.value)} placeholder="https://..." className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blog-circuit-url" className={labelClass}>Circuit Diagram URL</Label>
                <Input id="blog-circuit-url" value={form.circuitDiagramUrl} onChange={(e) => setField("circuitDiagramUrl", e.target.value)} placeholder="https://..." className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="blog-wiring-url" className={labelClass}>Wiring Diagram URL</Label>
                <Input id="blog-wiring-url" value={form.wiringDiagramUrl} onChange={(e) => setField("wiringDiagramUrl", e.target.value)} placeholder="https://..." className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
              </div>
            </TabsContent>

            <TabsContent value="product-links" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-related-products" className={labelClass}>Related Products</Label>
                  <Input id="blog-related-products" value={form.relatedProducts} onChange={(e) => setField("relatedProducts", e.target.value)} placeholder="Product A, Product B" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-recommended-products" className={labelClass}>Recommended Products</Label>
                  <Input id="blog-recommended-products" value={form.recommendedProducts} onChange={(e) => setField("recommendedProducts", e.target.value)} placeholder="Kit, Module" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-accessories" className={labelClass}>Accessories</Label>
                  <Input id="blog-accessories" value={form.accessories} onChange={(e) => setField("accessories", e.target.value)} placeholder="Sensor pack" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-replacement-parts" className={labelClass}>Replacement Parts</Label>
                  <Input id="blog-replacement-parts" value={form.replacementParts} onChange={(e) => setField("replacementParts", e.target.value)} placeholder="Motor gear" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="blog-related-tutorials" className={labelClass}>Related Tutorials</Label>
                  <Input id="blog-related-tutorials" value={form.relatedTutorials} onChange={(e) => setField("relatedTutorials", e.target.value)} placeholder="Tutorial 1, Tutorial 2" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blog-related-projects" className={labelClass}>Related Projects</Label>
                  <Input id="blog-related-projects" value={form.relatedProjects} onChange={(e) => setField("relatedProjects", e.target.value)} placeholder="Project A" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="blog-faq-items" className={labelClass}>FAQ Items</Label>
                <Textarea id="blog-faq-items" value={form.faqItems} onChange={(e) => setField("faqItems", e.target.value)} placeholder="Question::Answer::1|Question 2::Answer 2::2" rows={6} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                <p className="text-xs text-white/40">Use the format Question::Answer::Order separated by | for multiple FAQ entries.</p>
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

            <TabsContent value="enterprise" className="space-y-4">
              <Collapsible open={openSections.projectInfo} onOpenChange={() => toggleSection("projectInfo")}>
                <div className="rounded-xl border border-border/40 bg-background/20">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                    <h3 className="text-sm font-semibold text-white">Project Information</h3>
                    {openSections.projectInfo ? <ChevronUp className="h-4 w-4 text-white/70" /> : <ChevronDown className="h-4 w-4 text-white/70" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pb-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="enterprise-reading-time" className={labelClass}>Reading Time</Label>
                        <Input id="enterprise-reading-time" type="number" min={1} value={form.readingTime} onChange={(e) => setField("readingTime", e.target.value)} placeholder="8" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                        {errors.readingTime && <p className="text-xs text-destructive">{errors.readingTime}</p>}
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
                        {errors.difficulty && <p className="text-xs text-destructive">{errors.difficulty}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="enterprise-skill-level" className={labelClass}>Skill Level</Label>
                        <Input id="enterprise-skill-level" value={form.skillLevel} onChange={(e) => setField("skillLevel", e.target.value)} placeholder="Beginner" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="enterprise-estimated-build-time" className={labelClass}>Estimated Build Time</Label>
                        <Input id="enterprise-estimated-build-time" value={form.estimatedBuildTime} onChange={(e) => setField("estimatedBuildTime", e.target.value)} placeholder="2 hours" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="enterprise-estimated-project-cost" className={labelClass}>Estimated Project Cost</Label>
                        <Input id="enterprise-estimated-project-cost" value={form.estimatedProjectCost} onChange={(e) => setField("estimatedProjectCost", e.target.value)} placeholder="₹1500" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="enterprise-target-audience" className={labelClass}>Target Audience</Label>
                        <div className="flex gap-2">
                          <Input
                            id="enterprise-target-audience"
                            value={audienceInput}
                            onChange={(e) => setAudienceInput(e.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                addTargetAudience(audienceInput);
                                setAudienceInput("");
                              }
                            }}
                            placeholder="Students, Teachers, Hobbyists"
                            className="h-10 text-sm text-white placeholder:text-white/40"
                            style={fieldStyle}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              addTargetAudience(audienceInput);
                              setAudienceInput("");
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        {form.targetAudience.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {form.targetAudience.map((audience, index) => (
                              <span key={`${audience}-${index}`} className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white">
                                {audience}
                                <button type="button" onClick={() => removeTargetAudience(index)} className="text-white/70 hover:text-white">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              <Collapsible open={openSections.learningContent} onOpenChange={() => toggleSection("learningContent")}>
                <div className="rounded-xl border border-border/40 bg-background/20">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                    <h3 className="text-sm font-semibold text-white">Learning Content</h3>
                    {openSections.learningContent ? <ChevronUp className="h-4 w-4 text-white/70" /> : <ChevronDown className="h-4 w-4 text-white/70" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="grid gap-4 px-4 pb-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className={labelClass}>Key Takeaways</Label>
                      <div className="flex gap-2">
                        <Input value={takeawayInput} onChange={(e) => setTakeawayInput(e.target.value)} onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addListItem("keyTakeaways", takeawayInput);
                            setTakeawayInput("");
                          }
                        }} placeholder="Add a takeaway" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                        <Button type="button" variant="outline" onClick={() => { addListItem("keyTakeaways", takeawayInput); setTakeawayInput(""); }}>Add</Button>
                      </div>
                      <div className="space-y-2">
                        {form.keyTakeaways.map((item, index) => (
                          <div key={`${item}-${index}`} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-2">
                            <p className="flex-1 text-sm text-white/85">{item}</p>
                            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveListItem("keyTakeaways", index, "up")} disabled={index === 0}><ChevronUp className="h-3 w-3" /></Button>
                            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveListItem("keyTakeaways", index, "down")} disabled={index === form.keyTakeaways.length - 1}><ChevronDown className="h-3 w-3" /></Button>
                            <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeListItem("keyTakeaways", index)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className={labelClass}>Prerequisites</Label>
                      <div className="flex gap-2">
                        <Input value={prerequisiteInput} onChange={(e) => setPrerequisiteInput(e.target.value)} onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addListItem("prerequisites", prerequisiteInput);
                            setPrerequisiteInput("");
                          }
                        }} placeholder="Add a prerequisite" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                        <Button type="button" variant="outline" onClick={() => { addListItem("prerequisites", prerequisiteInput); setPrerequisiteInput(""); }}>Add</Button>
                      </div>
                      <div className="space-y-2">
                        {form.prerequisites.map((item, index) => (
                          <div key={`${item}-${index}`} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-2">
                            <p className="flex-1 text-sm text-white/85">{item}</p>
                            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveListItem("prerequisites", index, "up")} disabled={index === 0}><ChevronUp className="h-3 w-3" /></Button>
                            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveListItem("prerequisites", index, "down")} disabled={index === form.prerequisites.length - 1}><ChevronDown className="h-3 w-3" /></Button>
                            <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeListItem("prerequisites", index)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              <Collapsible open={openSections.cta} onOpenChange={() => toggleSection("cta")}>
                <div className="rounded-xl border border-border/40 bg-background/20">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                    <h3 className="text-sm font-semibold text-white">Call To Action</h3>
                    {openSections.cta ? <ChevronUp className="h-4 w-4 text-white/70" /> : <ChevronDown className="h-4 w-4 text-white/70" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pb-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="enterprise-cta-title" className={labelClass}>CTA Title</Label>
                        <Input id="enterprise-cta-title" value={form.ctaTitle} onChange={(e) => setField("ctaTitle", e.target.value)} placeholder="Start Building Today" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="enterprise-cta-button-text" className={labelClass}>CTA Button Text</Label>
                        <Input id="enterprise-cta-button-text" value={form.ctaButtonText} onChange={(e) => setField("ctaButtonText", e.target.value)} placeholder="Explore Kits" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="enterprise-cta-description" className={labelClass}>CTA Description</Label>
                      <Textarea id="enterprise-cta-description" value={form.ctaDescription} onChange={(e) => setField("ctaDescription", e.target.value)} placeholder="Help users take the next step." rows={3} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="enterprise-cta-button-link" className={labelClass}>CTA Button Link</Label>
                      <Input id="enterprise-cta-button-link" value={form.ctaButtonLink} onChange={(e) => setField("ctaButtonLink", e.target.value)} placeholder="https://tinkro.in/products" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                      {errors.ctaButtonLink && <p className="text-xs text-destructive">{errors.ctaButtonLink}</p>}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              <Collapsible open={openSections.relatedContent} onOpenChange={() => toggleSection("relatedContent")}>
                <div className="rounded-xl border border-border/40 bg-background/20">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                    <h3 className="text-sm font-semibold text-white">Related Content</h3>
                    {openSections.relatedContent ? <ChevronUp className="h-4 w-4 text-white/70" /> : <ChevronDown className="h-4 w-4 text-white/70" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 px-4 pb-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="related-blogs-search" className={labelClass}>Related Blogs (stores slug/id)</Label>
                      <Input id="related-blogs-search" value={relatedBlogSearch} onChange={(e) => setRelatedBlogSearch(e.target.value)} placeholder="Search by title or slug" className="h-10 text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                    </div>
                    <div className="max-h-52 space-y-2 overflow-auto rounded-lg border border-white/10 bg-white/5 p-2">
                      {relatedBlogOptions.length === 0 ? (
                        <p className="px-2 py-3 text-xs text-white/50">No matching blogs found.</p>
                      ) : (
                        relatedBlogOptions.map((option) => (
                          <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-white/85 hover:bg-white/10">
                            <input
                              type="checkbox"
                              checked={form.relatedBlogs.includes(option.value)}
                              onChange={() => toggleRelatedBlog(option.value)}
                              className="rounded border-white/20 bg-transparent"
                            />
                            <div className="min-w-0">
                              <p className="truncate">{option.label}</p>
                              <p className="truncate text-xs text-white/50">{option.value}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              <Collapsible open={openSections.ai} onOpenChange={() => toggleSection("ai")}>
                <div className="rounded-xl border border-border/40 bg-background/20">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                    <h3 className="text-sm font-semibold text-white">AI</h3>
                    {openSections.ai ? <ChevronUp className="h-4 w-4 text-white/70" /> : <ChevronDown className="h-4 w-4 text-white/70" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pb-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="enterprise-ai-summary" className={labelClass}>AI Summary</Label>
                      <Textarea id="enterprise-ai-summary" value={form.aiSummary} onChange={(e) => setField("aiSummary", e.target.value)} placeholder="AI-generated concise summary for editorial and SEO workflows." rows={6} className="text-sm text-white placeholder:text-white/40" style={fieldStyle} />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              <Collapsible open={openSections.seoAdvanced} onOpenChange={() => toggleSection("seoAdvanced")}>
                <div className="rounded-xl border border-border/40 bg-background/20">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                    <h3 className="text-sm font-semibold text-white">SEO Advanced</h3>
                    {openSections.seoAdvanced ? <ChevronUp className="h-4 w-4 text-white/70" /> : <ChevronDown className="h-4 w-4 text-white/70" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="grid gap-4 px-4 pb-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className={labelClass}>Robots</Label>
                      <Select value={form.robots} onValueChange={(v) => setField("robots", v)}>
                        <SelectTrigger className="h-10 text-sm text-white" style={fieldStyle}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: "oklch(0.14 0.04 243)", border: "1px solid oklch(0.25 0.05 243 / 0.5)" }}>
                          {ROBOTS_VALUES.map((value) => (
                            <SelectItem key={value} value={value} className="text-white/80">{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.robots && <p className="text-xs text-destructive">{errors.robots}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="enterprise-last-updated" className={labelClass}>Last Updated</Label>
                      <Input id="enterprise-last-updated" type="date" value={form.lastUpdated} onChange={(e) => setField("lastUpdated", e.target.value)} className="h-10 text-sm text-white" style={fieldStyle} />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
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
        publishedAt: newStatus === "published" ? (post.publishedAt ?? post.publishedDate ?? new Date().toISOString()) : null,
        publishedDate: newStatus === "published" ? (post.publishedAt ?? post.publishedDate ?? new Date().toISOString()) : null,
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
            { label: "Bulk Import", description: "Manage import workflows and content ingestion", icon: <FileText className="h-4 w-4" /> },
            { label: "Analytics", description: "View hub performance and engagement trends", icon: <Eye className="h-4 w-4" /> },
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

      <BlogDialog open={dialogOpen} editTarget={editTarget} allPosts={posts} onClose={() => setDialogOpen(false)} />

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
