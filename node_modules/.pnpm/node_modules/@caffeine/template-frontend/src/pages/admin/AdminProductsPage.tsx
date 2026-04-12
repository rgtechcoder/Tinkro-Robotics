
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";import { AdminLayout } from "@/components/admin/AdminLayout";
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
} from "@/lib/adminService";
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
  price: number;
  originalPrice: number;
  stock: number;
  discount: number;
  tagsRaw: string;
  isActive: boolean;
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
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`${file.name}: only JPEG, PNG, or WebP allowed`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5 MB limit`);
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
          JPEG · PNG · WebP · max 5 MB each
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
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

// ─── Product Form Modal ───────────────────────────────────────────────────────

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
      price: 0,
      originalPrice: 0,
      stock: 0,
      discount: 0,
      tagsRaw: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const tagsRaw = watch("tagsRaw");

  useEffect(() => {
    if (open && editProduct) {
      reset({
        name: editProduct.name,
        sku: editProduct.sku,
        description: editProduct.description,
        price: editProduct.price,
        originalPrice: editProduct.originalPrice ?? 0,
        stock: editProduct.stock,
        discount: editProduct.discount ?? 0,
        tagsRaw: (editProduct.tags ?? []).join(", "),
        isActive: editProduct.isActive,
      });
      const existingIds =
        Array.isArray(editProduct.categoryIds) &&
        editProduct.categoryIds.length > 0
          ? editProduct.categoryIds
          : editProduct.categoryId
            ? [editProduct.categoryId]
            : [];
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

    const storageRef = ref(
      storage,
      `products/${productId}/${Date.now()}_${img.file.name}`
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
        ? values.tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      const selectedCategories = categories.filter((c) =>
        selectedCategoryIds.includes(c.id),
      );
      const primaryCategoryId = selectedCategoryIds[0] ?? "";
      const primaryCategoryName = selectedCategories[0]?.name ?? "";

      const payload = {
        name: values.name,
        sku: values.sku,
        description: values.description,
        price: Number(values.price),
        originalPrice: Number(values.originalPrice),
        categoryId: primaryCategoryId,
        category: primaryCategoryName,
        categoryIds: selectedCategoryIds,
        stock: Number(values.stock),
        discount: Number(values.discount),
        tags,
        isActive: values.isActive,
        images: imageUrls,
        image: imageUrls[0] ?? "",
        badge:
          Number(values.discount) > 0 ? `${values.discount}% OFF` : "",
        rating: editProduct?.rating ?? 0,
        reviews: editProduct?.reviews ?? 0,
        inStock: Number(values.stock) > 0,
      };

      if (isEdit && editProduct) {
        await updateProduct(editProduct.id, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product added successfully");
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

          {/* Stock + Discount + Tags */}
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

// ─── Skeleton Rows ────────────────────────────────────────────────────────────

const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5"] as const;

function ProductSkeletonRows() {
  return (
    <>
      {SKELETON_IDS.map((id) => (
        <tr key={id}>
          {["10w-10", "36", "24", "28", "16", "12", "16-full", "16"].map(
            (w, j) => (
              <td key={w} className="px-4 py-3">
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
  const [deleting, setDeleting] = useState(false);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  {[
                    "Image",
                    "Name",
                    "SKU",
                    "Categories",
                    "Price",
                    "Stock",
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
                      const productCatIds =
                        Array.isArray(product.categoryIds) &&
                        product.categoryIds.length > 0
                          ? product.categoryIds
                          : product.categoryId
                            ? [product.categoryId]
                            : [];
                      const productCats = productCatIds
                        .map((id) => categories.find((c) => c.id === id))
                        .filter(Boolean) as AdminCategory[];

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
                                  alt={product.name}
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
    </AdminLayout>
  );
}
