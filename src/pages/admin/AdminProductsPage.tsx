
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  assertValidAdminUploadFile,
  normalizeUploadFilename,
  validateAdminUploadFile,
} from "@/lib/adminUploadValidation";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  addProduct,
  deleteProduct,
  subscribeToCategories,
  subscribeToProducts,
  updateProduct,
  bulkAdjustProductPrices,
} from "@/lib/adminService";

// Helper components for array fields (ensure always present)

//import { storage } from "@/lib/firebase";
import type { AdminCategory, AdminProduct } from "@/types/admin";
import {
  ImagePlus,
  Layers,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFormValues {
  name: string;
  sku: string;
  description: string;
  overview: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywordsRaw: string;
  canonicalUrl: string;
  seoSlug: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string;
  twitterTitle: string;
  twitterDescription: string;
  brand: string;
  gtin: string;
  mpn: string;
  price: number;
  originalPrice: number;
  stock: number;
  discount: number;
  rating?: number;
  reviews?: number;
  tagsRaw: string;
  isActive: boolean;
  features: string[];
  specificationsRaw: string;
  compatibility: string[];
  applications: string[];
  packageContents: string[];
  faqs: { question: string; answer: string }[];
  kitContents: string[];
  useCases: string[];
  reviewsArray: { name: string; rating: number; content: string }[];
  demoVideoUrl: string;
  order?: number;
  isBestSeller?: boolean;
}

interface ImageUpload {
  id: string;
  file: File;
  preview: string;
  progress: number;
  url: string | null;
  error: string | null;
}

// ─── Image Upload Zone ────────────────────────────────────────────────────────

function ImageUploadZone({
  images,
  onAdd,
  onRemove,
}: {
  images: ImageUpload[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = 5 - images.length;
    const accepted: File[] = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      const validation = validateAdminUploadFile(file, "image");
      if (!validation.ok) {
        toast.error(`${file.name}: ${validation.message}`);
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length > 0) onAdd(accepted);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-label="Upload product images"
        disabled={images.length >= 5}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        data-ocid="product-image-upload-zone"
        className="relative w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-200 h-28 text-sm select-none outline-none focus-visible:ring-2"
        style={{
          borderColor: dragging
            ? "oklch(0.71 0.17 48 / 0.7)"
            : "oklch(0.30 0.05 243 / 0.6)",
          background: dragging
            ? "oklch(0.71 0.17 48 / 0.05)"
            : "oklch(0.14 0.03 243 / 0.4)",
          boxShadow: dragging ? "0 0 18px oklch(0.71 0.17 48 / 0.15)" : "none",
          opacity: images.length >= 5 ? 0.4 : 1,
          cursor: images.length >= 5 ? "not-allowed" : "pointer",
        }}
      >
        <ImagePlus size={22} style={{ color: "oklch(0.55 0.08 243)" }} />
        <span style={{ color: "oklch(0.60 0.05 243)" }}>
          {images.length >= 5
            ? "Max 5 images reached"
            : "Click or drag to upload images"}
        </span>
        <span style={{ color: "oklch(0.40 0.04 243)", fontSize: "11px" }}>
          JPEG · PNG · WebP · GIF · SVG · max 5 MB each
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </button>

      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden aspect-square"
              style={{ background: "oklch(0.14 0.03 243)" }}
            >
              <img
                src={img.preview}
                alt=""
                className="w-full h-full object-cover"
              />
              {img.progress > 0 && img.progress < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="w-3/4">
                    <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${img.progress}%`,
                          background:
                            "linear-gradient(90deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-white text-center mt-1">
                      {Math.round(img.progress)}%
                    </p>
                  </div>
                </div>
              )}
              {img.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/70 text-[10px] text-red-300 p-1 text-center">
                  {img.error}
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(img.id);
                }}
                aria-label="Remove image"
                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-500"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Multi-Category Selector ──────────────────────────────────────────────────

function MultiCategorySelector({
  categories,
  selectedIds,
  onChange,
}: {
  categories: AdminCategory[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  if (categories.length === 0) {
    return (
      <p className="text-xs text-slate-500 py-3 text-center">
        No categories yet — create categories first
      </p>
    );
  }

  return (
    <div
      className="rounded-xl overflow-y-auto max-h-44"
      style={{
        background: "oklch(0.13 0.03 243 / 0.6)",
        border: "1px solid oklch(0.26 0.05 243 / 0.5)",
      }}
    >
      {categories.map((cat) => {
        const checked = selectedIds.includes(cat.id);
        return (
          <label
            key={cat.id}
            htmlFor={`cat-check-${cat.id}`}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/[0.03] transition-colors border-b last:border-b-0"
            style={{ borderColor: "oklch(0.22 0.04 243 / 0.4)" }}
            data-ocid={`category-checkbox-${cat.id}`}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => toggle(cat.id)}
              id={`cat-check-${cat.id}`}
              className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt=""
                  className="h-5 w-5 rounded object-cover shrink-0"
                />
              ) : (
                <div
                  className="h-5 w-5 rounded shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color || "#2E6DA4"}22` }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: cat.color || "#2E6DA4" }}
                  />
                </div>
              )}
              <span className="text-sm text-white/80 truncate">{cat.name}</span>
            </div>
            {checked && (
              <span className="text-[10px] text-orange-400 font-medium shrink-0">
                Selected
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

// ─── ArrayField (simple add/remove for string arrays) ──────────────
function ArrayField({ value, onChange, placeholder }: { value: string[]; onChange: (arr: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-9 text-sm"
          style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }}
          onKeyDown={e => {
            if (e.key === "Enter" && input.trim()) {
              onChange([...value, input.trim()]);
              setInput("");
            }
          }}
        />
        <button type="button" onClick={() => { if (input.trim()) { onChange([...value, input.trim()]); setInput(""); } }} className="px-3 rounded bg-blue-500 text-white text-sm">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700 text-xs">
            {item}
            <button type="button" onClick={() => onChange(value.filter((_, i) => i !== idx))} className="ml-1 text-red-400">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── ReviewsArrayField (add/remove for reviews array) ──────────────
function ReviewsArrayField({ value, onChange }: { value: { name: string; rating: number; content: string }[]; onChange: (arr: { name: string; rating: number; content: string }[]) => void }) {
  const [review, setReview] = useState({ name: "", rating: 5, content: "" });
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={review.name}
          onChange={e => setReview(r => ({ ...r, name: e.target.value }))}
          placeholder="Name"
          className="flex-1 h-9 text-sm"
          style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }}
        />
        <Input
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={review.rating}
          onChange={e => setReview(r => ({ ...r, rating: Number(e.target.value) }))}
          placeholder="Rating"
          className="w-20 h-9 text-sm"
          style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }}
        />
        <Input
          value={review.content}
          onChange={e => setReview(r => ({ ...r, content: e.target.value }))}
          placeholder="Review content"
          className="flex-1 h-9 text-sm"
          style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }}
        />
        <button type="button" onClick={() => {
          if (review.name.trim() && review.content.trim()) {
            onChange([...value, { ...review, name: review.name.trim(), content: review.content.trim() }]);
            setReview({ name: "", rating: 5, content: "" });
          }
        }} className="px-3 rounded bg-blue-500 text-white text-sm">Add</button>
      </div>
      <div className="flex flex-col gap-2">
        {value.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 px-2 py-1 rounded bg-slate-700 text-xs">
            <span className="font-semibold">{item.name}</span>
            <span>({item.rating}★)</span>
            <span className="flex-1">{item.content}</span>
            <button type="button" onClick={() => onChange(value.filter((_, i) => i !== idx))} className="ml-1 text-red-400">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Product Form Modal ───────────────────────────────────────────────────────

function FaqArrayField({
  value,
  onChange,
}: {
  value: { question: string; answer: string }[];
  onChange: (arr: { question: string; answer: string }[]) => void;
}) {
  const [faq, setFaq] = useState({ question: "", answer: "" });
  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-2">
        <Input
          value={faq.question}
          onChange={(e) => setFaq((prev) => ({ ...prev, question: e.target.value }))}
          placeholder="FAQ question"
          className="h-9 text-sm"
          style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }}
        />
        <Textarea
          value={faq.answer}
          onChange={(e) => setFaq((prev) => ({ ...prev, answer: e.target.value }))}
          placeholder="FAQ answer"
          rows={2}
          className="text-sm resize-none"
          style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }}
        />
        <button
          type="button"
          onClick={() => {
            if (faq.question.trim() && faq.answer.trim()) {
              onChange([...value, { question: faq.question.trim(), answer: faq.answer.trim() }]);
              setFaq({ question: "", answer: "" });
            }
          }}
          className="w-fit px-3 py-1.5 rounded bg-blue-500 text-white text-sm"
        >
          Add FAQ
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {value.map((item, idx) => (
          <div key={`${item.question}-${idx}`} className="rounded-lg bg-slate-700/70 p-2 text-xs text-white/80">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="font-semibold">{item.question}</p>
                <p className="text-white/60 mt-1">{item.answer}</p>
              </div>
              <button type="button" onClick={() => onChange(value.filter((_, i) => i !== idx))} className="text-red-400">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSpecifications(value: string) {
  const result: NonNullable<AdminProduct["specifications"]> = {};
  for (const line of value.split("\n")) {
    const [rawKey, ...rawValue] = line.split(":");
    const key = rawKey?.trim();
    const specValue = rawValue.join(":").trim();
    if (key && specValue) result[key] = specValue;
  }
  return result;
}

function formatSpecifications(
  specifications: AdminProduct["specifications"] | undefined,
) {
  if (!specifications) return "";
  return Object.entries(specifications)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value ?? "")}`)
    .join("\n");
}

function slugifySeo(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function keywordDensity(text: string, keyword: string) {
  const cleanKeyword = keyword.trim().toLowerCase();
  const words = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  if (!cleanKeyword || words.length === 0) return 0;
  const keywordWords = cleanKeyword.match(/[a-z0-9]+/g) ?? [];
  if (keywordWords.length === 0) return 0;
  const phrase = keywordWords.join(" ");
  const matches = words.join(" ").split(phrase).length - 1;
  return Number(((matches / words.length) * 100).toFixed(2));
}

function buildSeoAnalysis(values: ProductFormValues, imageUploads: ImageUpload[]) {
  const title = values.metaTitle || values.name;
  const description = values.metaDescription || values.description;
  const density = keywordDensity(
    `${values.name} ${values.description} ${values.overview} ${values.features.join(" ")}`,
    values.focusKeyword,
  );
  const checks = [
    title.length >= 30 && title.length <= 60,
    description.length >= 120 && description.length <= 160,
    imageUploads.length > 0 && Boolean(values.name.trim()),
    Boolean(values.name.trim()),
    Boolean(values.brand.trim() && values.sku.trim()),
    !values.focusKeyword || (density >= 0.5 && density <= 3),
    values.faqs.length > 0,
    Boolean(values.seoSlug.trim() || values.name.trim()),
  ];
  return {
    score: Math.round((checks.filter(Boolean).length / checks.length) * 100),
    titleLength: title.length,
    descriptionLength: description.length,
    missingAlt: imageUploads.length === 0 || !values.name.trim(),
    missingH1: !values.name.trim(),
    missingSchema: !values.brand.trim() || !values.sku.trim(),
    keywordDensity: density,
  };
}

function SeoManager({
  register,
  values,
  imageUploads,
}: {
  register: ReturnType<typeof useForm<ProductFormValues>>["register"];
  values: ProductFormValues;
  imageUploads: ImageUpload[];
}) {
  const analysis = buildSeoAnalysis(values, imageUploads);
  const googleTitle = values.metaTitle || values.name || "Product title";
  const googleDescription =
    values.metaDescription || values.description || "Product meta description preview...";
  const previewUrl = values.canonicalUrl || `https://tinkro.in/product/${values.seoSlug || slugifySeo(values.name || "product")}`;
  const ogTitle = values.openGraphTitle || googleTitle;
  const ogDescription = values.openGraphDescription || googleDescription;
  const twitterTitle = values.twitterTitle || ogTitle;
  const twitterDescription = values.twitterDescription || ogDescription;
  const previewImage = values.openGraphImage || imageUploads[0]?.preview || "";

  return (
    <section className="space-y-5 rounded-2xl p-4" style={{ background: "oklch(0.13 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)" }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white">Enterprise SEO Manager</h3>
          <p className="text-xs text-white/50">Metadata, schema inputs, analysis, and social previews.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-400">{analysis.score}</p>
          <p className="text-[10px] uppercase tracking-widest text-white/40">SEO Score</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Meta Title</Label>
          <Input {...register("metaTitle")} placeholder="Buy Arduino Starter Kit Online | Tinkro" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
          <p className="text-[11px] text-white/40">Title length: {analysis.titleLength}/60</p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Focus Keyword</Label>
          <Input {...register("focusKeyword")} placeholder="arduino starter kit" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
          <p className="text-[11px] text-white/40">Keyword density: {analysis.keywordDensity}%</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Meta Description</Label>
        <Textarea {...register("metaDescription")} rows={3} placeholder="SEO description for search engines..." className="text-sm resize-none" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
        <p className="text-[11px] text-white/40">Description length: {analysis.descriptionLength}/160</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Keywords</Label>
          <Input {...register("keywordsRaw")} placeholder="arduino, robotics, stem" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">SEO Slug</Label>
          <Input {...register("seoSlug")} placeholder="arduino-starter-kit" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Canonical URL</Label>
        <Input {...register("canonicalUrl")} placeholder="https://tinkro.in/product/arduino-starter-kit" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input {...register("openGraphTitle")} placeholder="Open Graph title" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
        <Input {...register("openGraphImage")} placeholder="Open Graph image URL" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
      </div>
      <Textarea {...register("openGraphDescription")} rows={2} placeholder="Open Graph description" className="text-sm resize-none" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />

      <div className="grid grid-cols-2 gap-4">
        <Input {...register("twitterTitle")} placeholder="Twitter title" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
        <Input {...register("twitterDescription")} placeholder="Twitter description" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
      </div>

      <div className="grid grid-cols-4 gap-3 text-xs">
        {[
          ["Missing Alt", analysis.missingAlt],
          ["Missing H1", analysis.missingH1],
          ["Missing Schema", analysis.missingSchema],
          ["FAQ Schema", values.faqs.length === 0],
        ].map(([label, issue]) => (
          <div key={String(label)} className="rounded-lg px-3 py-2 bg-slate-800/70">
            <p className={issue ? "text-red-300" : "text-emerald-300"}>{issue ? "Needs work" : "OK"}</p>
            <p className="text-white/50">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl bg-white p-3 text-slate-900">
          <p className="text-blue-700 text-base truncate">{googleTitle}</p>
          <p className="text-green-700 text-xs truncate">{previewUrl}</p>
          <p className="text-xs text-slate-600 line-clamp-3">{googleDescription}</p>
        </div>
        <div className="rounded-xl bg-slate-100 overflow-hidden text-slate-900">
          <div className="h-20 bg-slate-300">{previewImage && <img src={previewImage} alt="" className="h-full w-full object-cover" />}</div>
          <div className="p-3">
            <p className="text-xs uppercase text-slate-500">tinkro.in</p>
            <p className="text-sm font-semibold truncate">{ogTitle}</p>
            <p className="text-xs text-slate-600 line-clamp-2">{ogDescription}</p>
          </div>
        </div>
        <div className="rounded-xl bg-black p-3 text-white">
          <p className="font-semibold truncate">{twitterTitle}</p>
          <p className="text-xs text-white/60 line-clamp-3">{twitterDescription}</p>
          {previewImage && <img src={previewImage} alt="" className="mt-2 h-20 w-full object-cover rounded-lg" />}
        </div>
      </div>
    </section>
  );
}

function ProductFormModal({
  open,
  onClose,
  editProduct,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  editProduct: AdminProduct | null;
  categories: AdminCategory[];
}) {
  const isEdit = !!editProduct;
  const [saving, setSaving] = useState(false);
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      overview: "",
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      keywordsRaw: "",
      canonicalUrl: "",
      seoSlug: "",
      openGraphTitle: "",
      openGraphDescription: "",
      openGraphImage: "",
      twitterTitle: "",
      twitterDescription: "",
      brand: "Tinkro",
      gtin: "",
      mpn: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      discount: 0,
      rating: 0,
      reviews: 0,
      tagsRaw: "",
      isActive: true,
      features: [],
      specificationsRaw: "",
      compatibility: [],
      applications: [],
      packageContents: [],
      faqs: [],
      kitContents: [],
      useCases: [],
      reviewsArray: [],
      demoVideoUrl: "",
      order: 0,
      isBestSeller: false,
    },
  });

  const isActive = watch("isActive");
  const tagsRaw = watch("tagsRaw");
  const formValues = watch();
  const features = watch("features");
  const compatibility = watch("compatibility");
  const applications = watch("applications");
  const packageContents = watch("packageContents");
  const faqs = watch("faqs");
  const kitContents = watch("kitContents");
  const useCases = watch("useCases");
  const reviewsArray = watch("reviewsArray");

  useEffect(() => {
    if (open && editProduct) {
      reset({
        name: editProduct.name,
        sku: editProduct.sku,
        description: editProduct.description,
        overview: editProduct.overview ?? "",
        metaTitle: editProduct.metaTitle ?? "",
        metaDescription: editProduct.metaDescription ?? "",
        focusKeyword: editProduct.focusKeyword ?? "",
        keywordsRaw: (editProduct.keywords ?? []).join(", "),
        canonicalUrl: editProduct.canonicalUrl ?? "",
        seoSlug: editProduct.seoSlug ?? "",
        openGraphTitle: editProduct.openGraphTitle ?? "",
        openGraphDescription: editProduct.openGraphDescription ?? "",
        openGraphImage: editProduct.openGraphImage ?? "",
        twitterTitle: editProduct.twitterTitle ?? "",
        twitterDescription: editProduct.twitterDescription ?? "",
        brand: editProduct.brand ?? "Tinkro",
        gtin: editProduct.gtin ?? "",
        mpn: editProduct.mpn ?? "",
        price: editProduct.price,
        originalPrice: editProduct.originalPrice ?? 0,
        stock: editProduct.stock,
        discount: editProduct.discount ?? 0,
        rating: editProduct.rating ?? 0,
        reviews: editProduct.reviews ?? 0,
        tagsRaw: (editProduct.tags ?? []).join(", "),
        isActive: editProduct.isActive,
        features: editProduct.features ?? [],
        specificationsRaw: formatSpecifications(editProduct.specifications),
        compatibility: editProduct.compatibility ?? [],
        applications: editProduct.applications ?? [],
        packageContents: editProduct.packageContents ?? [],
        faqs: editProduct.faqs ?? [],
        kitContents: editProduct.kitContents ?? [],
        useCases: editProduct.useCases ?? [],
        reviewsArray: editProduct.reviewsArray ?? [],
        demoVideoUrl: editProduct.demoVideoUrl ?? "",
        order: editProduct.order ?? 0,
        isBestSeller: editProduct.isBestSeller ?? false,
      });
      const existingIds = Array.from(
        new Set(
          Array.isArray(editProduct.categoryIds) &&
            editProduct.categoryIds.length > 0
            ? editProduct.categoryIds
            : editProduct.categoryId
              ? [editProduct.categoryId]
              : [],
        ),
      );
      setSelectedCategoryIds(existingIds);
      const existingImages: ImageUpload[] = (editProduct.images ?? []).map(
        (url) => ({
          id: url,
          file: new File([], ""),
          preview: url,
          progress: 100,
          url,
          error: null,
        }),
      );
      setImageUploads(existingImages);
    } else if (open && !editProduct) {
      reset();
      setSelectedCategoryIds([]);
      setImageUploads([]);
    }
  }, [open, editProduct, reset]);

  function handleAddFiles(files: File[]) {
    const newUploads: ImageUpload[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      url: null,
      error: null,
    }));
    setImageUploads((prev) => [...prev, ...newUploads]);
  }

  function handleRemoveImage(id: string) {
    setImageUploads((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed?.preview.startsWith("blob:"))
        URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.id !== id);
    });
  }

async function uploadPendingImages(
  productId: string,
  uploads: ImageUpload[],
): Promise<string[]> {
  const results: string[] = [];

  for (const img of uploads) {
    // already uploaded (edit case)
    if (img.url && !img.preview.startsWith("blob:")) {
      results.push(img.url);
      continue;
    }

    assertValidAdminUploadFile(img.file, "image");
    const safeName = normalizeUploadFilename(img.file.name);

    const storageRef = ref(
      storage,
      `products/${productId}/${Date.now()}_${safeName}`
    );

    await uploadBytes(storageRef, img.file);

    const downloadURL = await getDownloadURL(storageRef);

    results.push(downloadURL);
  }

  return results;
}

  async function onSubmit(values: ProductFormValues) {
    setSaving(true);
    try {
      const productId = editProduct?.id ?? crypto.randomUUID();
      const imageUrls = await uploadPendingImages(productId, imageUploads);
      const tags = values.tagsRaw
        ? parseCommaList(values.tagsRaw)
        : [];
      const keywords = values.keywordsRaw
        ? parseCommaList(values.keywordsRaw)
        : [];
      const uniqueSelectedCategoryIds = Array.from(new Set(selectedCategoryIds));
      const selectedCategories = categories.filter((c) =>
        uniqueSelectedCategoryIds.includes(c.id),
      );
      const primaryCategoryId = uniqueSelectedCategoryIds[0] ?? "";
      const primaryCategoryName = selectedCategories[0]?.name ?? "";

      const payload = {
        name: values.name,
        sku: values.sku,
        description: values.description,
        overview: values.overview,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        focusKeyword: values.focusKeyword,
        keywords,
        canonicalUrl: values.canonicalUrl,
        seoSlug: values.seoSlug || slugifySeo(values.name),
        openGraphTitle: values.openGraphTitle,
        openGraphDescription: values.openGraphDescription,
        openGraphImage: values.openGraphImage,
        twitterTitle: values.twitterTitle,
        twitterDescription: values.twitterDescription,
        brand: values.brand,
        gtin: values.gtin,
        mpn: values.mpn,
        price: Number(values.price),
        originalPrice: Number(values.originalPrice),
        categoryId: primaryCategoryId,
        category: primaryCategoryName,
        categoryIds: uniqueSelectedCategoryIds,
        stock: Number(values.stock),
        discount: Number(values.discount),
        tags,
        isActive: values.isActive,
        images: imageUrls,
        image: imageUrls[0] ?? "",
        badge:
          Number(values.discount) > 0 ? `${values.discount}% OFF` : "",
        rating: values.rating ?? 0,
        reviews: values.reviews ?? 0,
        inStock: Number(values.stock) > 0,
        features: values.features,
        specifications: parseSpecifications(values.specificationsRaw),
        compatibility: values.compatibility,
        applications: values.applications,
        packageContents: values.packageContents,
        faqs: values.faqs,
        kitContents: values.kitContents,
        useCases: values.useCases,
        reviewsArray: values.reviewsArray,
        demoVideoUrl: values.demoVideoUrl,
        order: Number(values.order) || 0,
        isBestSeller: !!values.isBestSeller,
      };
      if (isEdit && editProduct) {
        await updateProduct(editProduct.id, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product added successfully");
        reset(); // Reset form after adding
        setSelectedCategoryIds([]);
        setImageUploads([]);
      }
      onClose();
    } catch (err) {
      toast.error("Failed to save product. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
          border: "1px solid oklch(0.25 0.05 243 / 0.5)",
        }}
      >
        <DialogHeader
          className="px-6 pt-6 pb-4 border-b"
          style={{ borderColor: "oklch(0.22 0.05 243 / 0.4)" }}
        >
          <DialogTitle className="text-xl font-display font-bold text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 pb-6 pt-5 space-y-5"
        >
          {/* Name + SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Product Name *
              </Label>
              <Input
                {...register("name", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 chars" },
                })}
                placeholder="e.g. Arduino Starter Kit"
                data-ocid="product-form-name"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
              {errors.name && (
                <p className="text-[11px] text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                SKU *
              </Label>
              <Input
                {...register("sku", { required: "Required" })}
                placeholder="e.g. ARD-STR-001"
                data-ocid="product-form-sku"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
              {errors.sku && (
                <p className="text-[11px] text-red-400">{errors.sku.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Description *
            </Label>
            <Textarea
              {...register("description", { required: "Required" })}
              placeholder="Describe this product..."
              rows={3}
              data-ocid="product-form-description"
              className="text-sm resize-none"
              style={{
                background: "oklch(0.15 0.03 243 / 0.7)",
                border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                color: "white",
              }}
            />
            {errors.description && (
              <p className="text-[11px] text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Overview */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Overview
            </Label>
            <Textarea
              {...register("overview")}
              placeholder="Short overview for this product..."
              rows={2}
              className="text-sm resize-none"
              style={{
                background: "oklch(0.15 0.03 243 / 0.7)",
                border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                color: "white",
              }}
            />
          </div>

          <SeoManager
            register={register}
            values={formValues}
            imageUploads={imageUploads}
          />

          {/* Product SEO */}
          <div className="space-y-3 rounded-2xl p-4" style={{ background: "oklch(0.13 0.03 243 / 0.55)", border: "1px solid oklch(0.28 0.05 243 / 0.45)" }}>
            <h3 className="text-sm font-bold text-white">Product SEO</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Brand</Label>
                <Input {...register("brand")} placeholder="Tinkro" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">SKU</Label>
                <Input {...register("sku", { required: "Required" })} placeholder="ARD-STR-001" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">GTIN</Label>
                <Input {...register("gtin")} placeholder="Global Trade Item Number" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">MPN</Label>
                <Input {...register("mpn")} placeholder="Manufacturer part number" className="h-10 text-sm" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="space-y-4 rounded-2xl p-4" style={{ background: "oklch(0.13 0.03 243 / 0.55)", border: "1px solid oklch(0.28 0.05 243 / 0.45)" }}>
            <h3 className="text-sm font-bold text-white">Content</h3>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Features</Label>
              <ArrayField value={features} onChange={(arr) => setValue("features", arr)} placeholder="Add feature..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Specifications</Label>
              <Textarea {...register("specificationsRaw")} rows={4} placeholder={"Input Voltage: 5V\nController: ATmega328P"} className="text-sm resize-none" style={{ background: "oklch(0.15 0.03 243 / 0.7)", border: "1px solid oklch(0.28 0.05 243 / 0.6)", color: "white" }} />
              <p className="text-[11px] text-white/40">Use one key: value pair per line.</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Compatibility</Label>
              <ArrayField value={compatibility} onChange={(arr) => setValue("compatibility", arr)} placeholder="Add compatible board/platform..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Applications</Label>
              <ArrayField value={applications} onChange={(arr) => setValue("applications", arr)} placeholder="Add application..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Package Contents</Label>
              <ArrayField value={packageContents} onChange={(arr) => setValue("packageContents", arr)} placeholder="Add package item..." />
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-3 rounded-2xl p-4" style={{ background: "oklch(0.13 0.03 243 / 0.55)", border: "1px solid oklch(0.28 0.05 243 / 0.45)" }}>
            <h3 className="text-sm font-bold text-white">FAQ</h3>
            <FaqArrayField value={faqs} onChange={(arr) => setValue("faqs", arr)} />
          </div>

          {/* Kit Contents (array) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Kit Contents
            </Label>
            <ArrayField
              value={kitContents}
              onChange={(arr) => setValue("kitContents", arr)}
              placeholder="Add kit item..."
            />
          </div>

          {/* Use Cases (array) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Use Cases
            </Label>
            <ArrayField
              value={useCases}
              onChange={(arr) => setValue("useCases", arr)}
              placeholder="Add use case..."
            />
          </div>

          {/* Reviews (array of objects) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Reviews
            </Label>
            <ReviewsArrayField
              value={reviewsArray}
              onChange={(arr) => setValue("reviewsArray", arr)}
            />
          </div>

          {/* Demo Video Link */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Demo Video Link (YouTube)
            </Label>
            <Input
              {...register("demoVideoUrl")}
              placeholder="https://youtube.com/..."
              className="h-10 text-sm"
              style={{
                background: "oklch(0.15 0.03 243 / 0.7)",
                border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                color: "white",
              }}
            />
          </div>

          {/* Price + Original Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Price ₹ *
              </Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                {...register("price", { required: "Required", min: 0 })}
                placeholder="999"
                data-ocid="product-form-price"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
              {errors.price && (
                <p className="text-[11px] text-red-400">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Original Price ₹
              </Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                {...register("originalPrice")}
                placeholder="1299"
                data-ocid="product-form-original-price"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* Categories multi-select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Categories
              </Label>
              {selectedCategoryIds.length > 0 && (
                <span className="text-xs text-orange-400">
                  {selectedCategoryIds.length} selected
                </span>
              )}
            </div>
            <MultiCategorySelector
              categories={categories}
              selectedIds={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
            />
            {selectedCategoryIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedCategoryIds.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  if (!cat) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: `${cat.color || "#2E6DA4"}22`,
                        color: cat.color || "#2E6DA4",
                        border: `1px solid ${cat.color || "#2E6DA4"}44`,
                      }}
                    >
                      <Layers size={9} />
                      {cat.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stock + Discount + Rating */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Stock *
              </Label>
              <Input
                type="number"
                min={0}
                {...register("stock", { required: "Required", min: 0 })}
                placeholder="50"
                data-ocid="product-form-stock"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
              {errors.stock && (
                <p className="text-[11px] text-red-400">
                  {errors.stock.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Discount %
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                {...register("discount", { min: 0, max: 100 })}
                placeholder="0"
                data-ocid="product-form-discount"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Rating (0–5)
              </Label>
              <Input
                type="number"
                min={0}
                max={5}
                step={0.1}
                {...register("rating", {
                  min: 0,
                  max: 5,
                  setValueAs: (v) => (v === "" ? 0 : Number(v)),
                })}
                placeholder="4.5"
                data-ocid="product-form-rating"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* Reviews + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Reviews Count
              </Label>
              <Input
                type="number"
                min={0}
                step={1}
                {...register("reviews", {
                  min: 0,
                  setValueAs: (v) => (v === "" ? 0 : Number(v)),
                })}
                placeholder="120"
                data-ocid="product-form-reviews"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Tags
              </Label>
              <Input
                {...register("tagsRaw")}
                placeholder="arduino, beginner, stem"
                data-ocid="product-form-tags"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* Tags preview */}
          {tagsRaw && (
            <div className="flex flex-wrap gap-1.5">
              {tagsRaw
                .split(",")
                .filter((t) => t.trim())
                .map((tag) => (
                  <span
                    key={tag.trim()}
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: "oklch(0.45 0.12 243 / 0.2)",
                      color: "oklch(0.75 0.10 195)",
                      border: "1px solid oklch(0.45 0.12 243 / 0.3)",
                    }}
                  >
                    {tag.trim()}
                  </span>
                ))}
            </div>
          )}

          {/* Active toggle */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: "oklch(0.14 0.03 243 / 0.5)",
              border: "1px solid oklch(0.25 0.05 243 / 0.4)",
            }}
          >
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={(v) => setValue("isActive", v)}
              data-ocid="product-form-active-toggle"
            />
            <Label
              htmlFor="is-active"
              className="text-sm text-white/70 cursor-pointer"
            >
              Product is{" "}
              <span
                className="font-semibold"
                style={{
                  color: isActive
                    ? "oklch(0.75 0.18 142)"
                    : "oklch(0.55 0.05 243)",
                }}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </Label>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Product Images{" "}
              <span className="normal-case text-white/30 font-normal">
                (up to 5)
              </span>
            </Label>
            <ImageUploadZone
              images={imageUploads}
              onAdd={handleAddFiles}
              onRemove={handleRemoveImage}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            data-ocid="product-form-submit"
            className="w-full h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-60 mt-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.71 0.17 48) 0%, oklch(0.76 0.16 72) 100%)",
              boxShadow: saving
                ? "none"
                : "0 0 18px oklch(0.71 0.17 48 / 0.35)",
            }}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation ────────────────────────────────────────────

// ─── Skeleton Rows ────────────────────────────────────────────────────────────

const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5"] as const;

function ProductSkeletonRows() {
  return (
    <>
      {SKELETON_IDS.map((id) => (
        <tr key={id}>
          {["10w-10", "36", "24", "28", "16", "12", "16-full", "16"].map(
            (w, j) => (
              <td key={`${w}-${j}`} className="px-4 py-3">
                <Skeleton
                  className={`h-${j === 0 ? "10 w-10" : `4 w-${w}`} rounded${w.includes("full") ? "-full" : ""}`}
                  style={{ background: "oklch(0.20 0.04 243 / 0.5)" }}
                />
              </td>
            ),
          )}
        </tr>
      ))}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkPercent, setBulkPercent] = useState<number | string>("");
  const [confirmBulkOpen, setConfirmBulkOpen] = useState(false);
  const [bulkApplying, setBulkApplying] = useState(false);
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [fixCandidates, setFixCandidates] = useState<AdminProduct[]>([]);

  useEffect(() => {
    const unsub = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeToCategories(setCategories);
    return unsub;
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (categoryFilter === "all") return true;
    const ids: string[] =
      Array.isArray(p.categoryIds) && p.categoryIds.length > 0
        ? p.categoryIds
        : p.categoryId
          ? [p.categoryId]
          : [];
    return ids.includes(categoryFilter);
  });

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }
  function openEdit(product: AdminProduct) {
    setEditTarget(product);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  function toggleProductSelection(id: string) {
    setSelectedProductIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  function toggleSelectAllVisible() {
    const visibleIds = filtered.map((product) => product.id);
    setSelectedProductIds((current) => {
      const currentSet = new Set(current);
      const allVisibleSelected = visibleIds.every((id) => currentSet.has(id));

      if (allVisibleSelected) {
        return current.filter((id) => !visibleIds.includes(id));
      }

      return Array.from(new Set([...current, ...visibleIds]));
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleBulkDelete() {
    if (selectedProductIds.length === 0) return;

    setBulkDeleting(true);
    try {
      for (const id of selectedProductIds) {
        await deleteProduct(id);
      }
      toast.success(
        `${selectedProductIds.length} product${selectedProductIds.length === 1 ? "" : "s"} deleted`,
      );
      setSelectedProductIds([]);
    } catch {
      toast.error("Failed to delete selected products. Please try again.");
    } finally {
      setBulkDeleting(false);
      setBulkDeleteOpen(false);
    }
  }

  async function handleConfirmBulk() {
    if (bulkPercent === "") return;
    const percent = Number(bulkPercent);
    if (Number.isNaN(percent)) {
      toast.error("Enter a valid percentage");
      return;
    }
    setBulkApplying(true);
    try {
      await bulkAdjustProductPrices(percent);
      toast.success(`Applied ${percent}% to all product prices`);
      setBulkPercent("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply price changes. Try again.");
    } finally {
      setBulkApplying(false);
      setConfirmBulkOpen(false);
    }
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
        data-ocid="admin-products-page"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              Products
            </h1>
            <p
              className="mt-0.5 text-sm"
              style={{ color: "oklch(0.55 0.04 243)" }}
            >
              {loading
                ? "Loading..."
                : `${products.length} product${products.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {selectedProductIds.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2"
                style={{
                  background: "oklch(0.14 0.03 243 / 0.7)",
                  borderColor: "oklch(0.28 0.05 243 / 0.45)",
                }}
              >
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    background: "oklch(0.22 0.05 72 / 0.25)",
                    color: "oklch(0.78 0.16 72)",
                  }}
                >
                  {selectedProductIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => setBulkDeleteOpen(true)}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                  style={{
                    background: "oklch(0.45 0.22 25)",
                    border: "1px solid oklch(0.56 0.22 25 / 0.4)",
                  }}
                >
                  <Trash2 size={14} />
                  Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProductIds([])}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200"
                  style={{
                    background: "oklch(0.16 0.04 243 / 0.6)",
                    color: "oklch(0.70 0.06 243)",
                    border: "1px solid oklch(0.26 0.05 243 / 0.4)",
                  }}
                >
                  Clear
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={openAdd}
              data-ocid="add-product-btn"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.71 0.17 48) 0%, oklch(0.76 0.16 72) 100%)",
                boxShadow: "0 0 18px oklch(0.71 0.17 48 / 0.3)",
              }}
            >
              <Plus size={16} />
              Add Product
            </button>
            <button
              type="button"
              onClick={() => {
                // scan products for missing or fallback names / sku issues
                const candidates = products.filter((p) => {
                  const nameClean = (p.name || "").trim();
                  const isFallbackName = !nameClean || nameClean === "Tinkro Product";
                  const skuIsId = (p.sku || "").trim() === (p.id || "").trim() || !(p.sku || "").trim();
                  return isFallbackName || skuIsId;
                });
                setFixCandidates(candidates);
                setFixModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-primary bg-background border"
            >
              Scan & Fix Missing Names
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "oklch(0.50 0.05 243)" }}
            />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="product-search"
              className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "oklch(0.14 0.03 243 / 0.8)",
                border: "1px solid oklch(0.26 0.05 243 / 0.5)",
                color: "white",
              }}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              data-ocid="product-category-filter"
              className="h-10 w-full sm:w-48 text-sm"
              style={{
                background: "oklch(0.14 0.03 243 / 0.8)",
                border: "1px solid oklch(0.26 0.05 243 / 0.5)",
                color: "white",
              }}
            >
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent
              style={{
                background: "oklch(0.14 0.04 243)",
                border: "1px solid oklch(0.25 0.05 243 / 0.5)",
              }}
            >
              <SelectItem value="all" className="text-white/80">
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                  className="text-white/80"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Bulk price adjust control */}
          <div className="flex items-center gap-2 ml-auto">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Bulk price adjust (%)
            </Label>
            <Input
              type="number"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(e.target.value)}
              placeholder="e.g. 10 or -5"
              className="h-10 w-36 text-sm"
              style={{
                background: "oklch(0.14 0.03 243 / 0.8)",
                border: "1px solid oklch(0.26 0.05 243 / 0.5)",
                color: "white",
              }}
            />
            <button
              type="button"
              onClick={() => setConfirmBulkOpen(true)}
              className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm"
              disabled={bulkPercent === ""}
            >
              Apply to all
            </button>
          </div>
        </div>

        {/* Table card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.12 0.04 243 / 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid oklch(0.22 0.05 243 / 0.4)",
                  }}
                >
                  <th
                    className="px-4 py-3 text-left"
                    style={{ color: "oklch(0.48 0.05 243)" }}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          filtered.length > 0 &&
                          filtered.every((product) =>
                            selectedProductIds.includes(product.id),
                          )
                        }
                        onCheckedChange={() => toggleSelectAllVisible()}
                        aria-label="Select all visible products"
                        className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <span className="text-[11px] font-semibold uppercase tracking-widest">
                        Select
                      </span>
                    </div>
                  </th>
                  {[
                    "Image",
                    "Name",
                    "SKU",
                    "Categories",
                    "Price",
                    "Stock",
                    "Order",
                    "Best Seller",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest"
                      style={{ color: "oklch(0.48 0.05 243)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <ProductSkeletonRows />
                ) : (
                  <AnimatePresence>
                    {filtered.map((product, i) => {
                      const productCatIds = Array.from(
                        new Set(
                          Array.isArray(product.categoryIds) &&
                            product.categoryIds.length > 0
                            ? product.categoryIds
                            : product.categoryId
                              ? [product.categoryId]
                              : [],
                        ),
                      );
                      const productCats = productCatIds
                        .map((id) => categories.find((c) => c.id === id))
                        .filter(Boolean) as AdminCategory[];

                      const isSelected = selectedProductIds.includes(product.id);

                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          className="group transition-all duration-150"
                          style={{
                            borderBottom:
                              "1px solid oklch(0.18 0.04 243 / 0.5)",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLTableRowElement
                            ).style.background = "oklch(0.16 0.04 243 / 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLTableRowElement
                            ).style.background = "";
                          }}
                          data-ocid={`product-row-${product.id}`}
                        >
                          <td className="px-4 py-3 w-14">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleProductSelection(product.id)}
                              aria-label={`Select ${product.name}`}
                              className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
                              style={{
                                background: "oklch(0.18 0.04 243 / 0.6)",
                              }}
                            >
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={`${product.name} from Tinkro`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package
                                  size={16}
                                  style={{ color: "oklch(0.45 0.06 243)" }}
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-[160px]">
                            <p className="font-medium text-white truncate">
                              {product.name}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs font-mono"
                              style={{ color: "oklch(0.65 0.08 195)" }}
                            >
                              {product.sku || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 max-w-[160px]">
                            {productCats.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {productCats.slice(0, 2).map((cat) => (
                                  <span
                                    key={cat.id}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium truncate max-w-[80px]"
                                    style={{
                                      background: `${cat.color || "#2E6DA4"}22`,
                                      color: cat.color || "#2E6DA4",
                                      border: `1px solid ${cat.color || "#2E6DA4"}44`,
                                    }}
                                  >
                                    {cat.name}
                                  </span>
                                ))}
                                {productCats.length > 2 && (
                                  <span
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px]"
                                    style={{ color: "oklch(0.55 0.05 243)" }}
                                  >
                                    +{productCats.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: "oklch(0.45 0.04 243)" }}>
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-white">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice > product.price && (
                              <span
                                className="ml-1.5 text-xs line-through"
                                style={{ color: "oklch(0.50 0.04 243)" }}
                              >
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs font-semibold"
                              style={{
                                color:
                                  product.stock > 10
                                    ? "oklch(0.75 0.18 142)"
                                    : product.stock > 0
                                      ? "oklch(0.76 0.16 72)"
                                      : "oklch(0.60 0.22 25)",
                              }}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={product.order ?? 0}
                              onChange={async (e) => {
                                const newVal = Number(e.target.value || 0);
                                // optimistic update
                                setProducts((prev) => prev.map(p => p.id === product.id ? { ...p, order: newVal } : p));
                                try {
                                  await updateProduct(product.id, { order: newVal });
                                  toast.success("Order updated");
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Failed to update order");
                                }
                              }}
                              className="w-20 h-8 rounded-lg text-sm px-2"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Switch
                              id={`best-${product.id}`}
                              checked={!!product.isBestSeller}
                              onCheckedChange={async (v) => {
                                const newVal = !!v;
                                setProducts((prev) => prev.map(p => p.id === product.id ? { ...p, isBestSeller: newVal } : p));
                                try {
                                  await updateProduct(product.id, { isBestSeller: newVal });
                                  toast.success("Best seller updated");
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Failed to update best seller flag");
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            {product.isActive ? (
                              <Badge
                                data-ocid={`product-status-active-${product.id}`}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border-0"
                                style={{
                                  background: "oklch(0.25 0.08 142 / 0.3)",
                                  color: "oklch(0.75 0.18 142)",
                                  border:
                                    "1px solid oklch(0.50 0.14 142 / 0.3)",
                                }}
                              >
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                data-ocid={`product-status-inactive-${product.id}`}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border-0"
                                style={{
                                  background: "oklch(0.22 0.03 243 / 0.5)",
                                  color: "oklch(0.50 0.04 243)",
                                  border:
                                    "1px solid oklch(0.30 0.04 243 / 0.4)",
                                }}
                              >
                                Inactive
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEdit(product)}
                                data-ocid={`product-edit-${product.id}`}
                                className="p-2 rounded-lg transition-all duration-150 hover:bg-blue-500/15 hover:text-blue-400"
                                style={{ color: "oklch(0.55 0.06 243)" }}
                                aria-label={`Edit ${product.name}`}
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(product)}
                                data-ocid={`product-delete-${product.id}`}
                                className="p-2 rounded-lg transition-all duration-150 hover:bg-red-500/15 hover:text-red-400"
                                style={{ color: "oklch(0.55 0.06 243)" }}
                                aria-label={`Delete ${product.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="py-20 flex flex-col items-center justify-center gap-4"
              data-ocid="products-empty-state"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "oklch(0.16 0.04 243 / 0.5)",
                  border: "1px solid oklch(0.25 0.05 243 / 0.4)",
                }}
              >
                <Package size={28} style={{ color: "oklch(0.50 0.08 243)" }} />
              </div>
              <div className="text-center space-y-1.5">
                <p className="font-semibold text-white">
                  {search || categoryFilter !== "all"
                    ? "No matching products"
                    : "No products yet"}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.50 0.04 243)" }}
                >
                  {search || categoryFilter !== "all"
                    ? "Try a different search or filter"
                    : "Add your first product to get started."}
                </p>
              </div>
              {!search && categoryFilter === "all" && (
                <button
                  type="button"
                  onClick={openAdd}
                  data-ocid="empty-add-product-btn"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 mt-2"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.71 0.17 48) 0%, oklch(0.76 0.16 72) 100%)",
                    boxShadow: "0 0 16px oklch(0.71 0.17 48 / 0.25)",
                  }}
                >
                  <Plus size={16} />
                  Add Product
                </button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      <Dialog open={fixModalOpen} onOpenChange={(v) => !v && setFixModalOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fix products with missing names / SKU</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 p-4">
            {fixCandidates.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    const failed: string[] = [];
                    for (const p of fixCandidates) {
                      const suggested = (p.metaTitle || p.seoSlug || p.name || "").trim() || undefined;
                      const suggestedSku = p.sku && p.sku !== p.id ? p.sku : (p.seoSlug || p.id || "");
                      const newName = suggested || p.name || p.seoSlug || p.id;
                      const newSku = suggestedSku || p.sku || p.id;
                      // optimistic local update
                      setProducts((prev) => prev.map(x => x.id === p.id ? { ...x, name: newName, sku: newSku } : x));
                      try {
                        await updateProduct(p.id, { name: newName, sku: newSku });
                      } catch (err) {
                        console.error(`Failed to update ${p.id}`, err);
                        failed.push(p.id);
                      }
                    }
                    if (failed.length === 0) toast.success("All suggestions applied");
                    else toast.error(`${failed.length} updates failed`);
                    // refresh candidate list
                    setFixCandidates((cur) => cur.filter(p => failed.includes(p.id)));
                  }}
                  className="px-3 py-2 rounded bg-green-600 text-white text-sm"
                >
                  Apply all suggestions
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // export candidates as CSV for manual update
                    const rows = fixCandidates.map((p) => ({
                      id: p.id,
                      name: p.name || "",
                      sku: p.sku || "",
                      metaTitle: p.metaTitle || "",
                      seoSlug: p.seoSlug || "",
                    }));
                    const csv = [
                      ["id", "name", "sku", "metaTitle", "seoSlug"].join(","),
                      ...rows.map(r => [r.id, `"${(r.name||"").replace(/"/g, '""') }"`, `"${(r.sku||"").replace(/"/g, '""') }"`, `"${(r.metaTitle||"").replace(/"/g, '""') }"`, `"${(r.seoSlug||"").replace(/"/g, '""') }"`].join(",")),
                    ].join("\n");
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `tinkro-fix-candidates-${Date.now()}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    toast.success("CSV exported");
                  }}
                  className="ml-2 px-3 py-2 rounded border text-sm"
                >
                  Export CSV
                </button>
              </div>
            )}
            {fixCandidates.length === 0 && (
              <div className="text-sm text-muted-foreground">No candidates found.</div>
            )}

            {fixCandidates.map((p) => {
              const suggested = (p.metaTitle || p.seoSlug || p.name || "").trim() || undefined;
              const suggestedSku = p.sku && p.sku !== p.id ? p.sku : (p.seoSlug || p.id || "");
              return (
                <div key={p.id} className="p-3 border rounded-lg flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{p.name || "(empty name)"}</div>
                    <div className="text-xs text-muted-foreground">ID: {p.id}</div>
                    <div className="text-xs text-muted-foreground">SKU: {p.sku ?? "(empty)"}</div>
                    <div className="text-xs mt-1">Suggested: <span className="font-medium">{suggested ?? "—"}</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="px-3 py-2 rounded bg-primary text-white text-sm"
                      onClick={async () => {
                        const newName = suggested || p.name || p.seoSlug || p.id;
                        const newSku = suggestedSku || p.sku || p.id;
                        // optimistic
                        setProducts((prev) => prev.map(x => x.id === p.id ? { ...x, name: newName, sku: newSku } : x));
                        try {
                          await updateProduct(p.id, { name: newName, sku: newSku });
                          toast.success("Product updated");
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to update product (backend disabled in dev)");
                        }
                      }}
                    >
                      Apply suggestion
                    </button>
                    <button
                      type="button"
                      className="px-3 py-2 rounded border text-sm"
                      onClick={() => {
                        // remove from candidates list
                        setFixCandidates((cur) => cur.filter(x => x.id !== p.id));
                      }}
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </DialogContent>
      </Dialog>

      <ProductFormModal
        open={modalOpen}
        onClose={closeModal}
        editProduct={editTarget}
        categories={categories}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent
          style={{
            background:
              "linear-gradient(180deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
            border: "1px solid oklch(0.25 0.05 243 / 0.5)",
            color: "white",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "oklch(0.60 0.04 243)" }}>
              Are you sure you want to delete{" "}
              <strong className="text-white">{deleteTarget?.name}</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="delete-cancel-btn"
              style={{
                background: "oklch(0.18 0.04 243 / 0.6)",
                border: "1px solid oklch(0.28 0.05 243 / 0.5)",
                color: "white",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              data-ocid="delete-confirm-btn"
              className="flex items-center gap-2"
              style={{
                background: "oklch(0.45 0.22 25)",
                color: "white",
                border: "none",
              }}
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={bulkDeleteOpen}
        onOpenChange={(open) => !open && setBulkDeleteOpen(false)}
      >
        <AlertDialogContent
          style={{
            background:
              "linear-gradient(180deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
            border: "1px solid oklch(0.25 0.05 243 / 0.5)",
            color: "white",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete selected products?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "oklch(0.60 0.04 243)" }}>
              You are about to delete <strong className="text-white">{selectedProductIds.length}</strong> selected product{selectedProductIds.length === 1 ? "" : "s"}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={bulkDeleting}
              style={{
                background: "oklch(0.18 0.04 243 / 0.6)",
                border: "1px solid oklch(0.28 0.05 243 / 0.5)",
                color: "white",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-2"
              style={{
                background: "oklch(0.45 0.22 25)",
                color: "white",
                border: "none",
              }}
            >
              {bulkDeleting && <Loader2 size={14} className="animate-spin" />}
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Bulk Price Adjust Confirmation ─────────────────────────────── */}
      <AlertDialog
        open={confirmBulkOpen}
        onOpenChange={(open) => !open && setConfirmBulkOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply price change to all products</AlertDialogTitle>
            <AlertDialogDescription>
              This will {Number(bulkPercent) >= 0 ? "increase" : "decrease"} the price of every product by <strong>{bulkPercent}%</strong>. This action cannot be undone — make sure you have a backup or are comfortable with the change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkApplying}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulk}
              disabled={bulkApplying}
              data-ocid="bulk-price-apply-confirm"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkApplying ? "Applying..." : "Apply"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
