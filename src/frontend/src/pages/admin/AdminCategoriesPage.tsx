import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Textarea } from "@/components/ui/textarea";
import {
  addCategory,
  deleteCategory,
  subscribeToCategories,
  subscribeToProducts,
  updateCategory,
  uploadCategoryImage,
} from "@/lib/adminService";
import type { AdminCategory } from "@/types/admin";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Edit2,
  ImagePlus,
  Layers,
  Loader2,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND_COLORS = [
  "#2E6DA4",
  "#3BBFBF",
  "#F47B20",
  "#F5A623",
  "#6366F1",
  "#10B981",
  "#EC4899",
  "#8B5CF6",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  imageUrl: string;
  isActive: boolean;
}

interface PendingImage {
  file: File;
  preview: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl overflow-hidden animate-pulse">
      <div className="h-28 bg-slate-700/40" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-32 rounded bg-slate-700/60" />
        <div className="h-3 w-20 rounded bg-slate-700/40" />
        <div className="h-3 w-full rounded bg-slate-700/40" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-20 rounded-full bg-slate-700/40" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-700/40" />
            <div className="h-8 w-8 rounded-lg bg-slate-700/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

interface CategoryCardProps {
  category: AdminCategory;
  productCount: number;
  index: number;
  onEdit: (cat: AdminCategory) => void;
  onDelete: (cat: AdminCategory) => void;
  onToggleActive: (cat: AdminCategory) => void;
}

function CategoryCard({
  category,
  productCount,
  index,
  onEdit,
  onDelete,
  onToggleActive,
}: CategoryCardProps) {
  const accentColor = category.color || "#2E6DA4";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="group relative rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl overflow-hidden hover:border-slate-600/60 transition-colors duration-200"
      data-ocid={`category-card-${category.id}`}
    >
      {/* Image or color banner */}
      <div
        className="relative h-28 overflow-hidden"
        style={{
          background: category.imageUrl
            ? undefined
            : `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
        }}
      >
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `${accentColor}18` }}
          >
            <Layers
              className="h-10 w-10 opacity-30"
              style={{ color: accentColor }}
            />
          </div>
        )}
        {/* Color accent overlay strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: accentColor }}
        />
        {/* Active badge */}
        <div className="absolute top-2 right-2">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              background: category.isActive
                ? "oklch(0.25 0.08 142 / 0.8)"
                : "oklch(0.18 0.03 243 / 0.8)",
              color: category.isActive
                ? "oklch(0.80 0.18 142)"
                : "oklch(0.55 0.04 243)",
              border: `1px solid ${category.isActive ? "oklch(0.50 0.14 142 / 0.4)" : "oklch(0.30 0.04 243 / 0.4)"}`,
              backdropFilter: "blur(8px)",
            }}
          >
            {category.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">
              {category.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate font-mono">
              /{category.slug}
            </p>
          </div>
          {/* Color dot */}
          <div
            className="h-3 w-3 rounded-full mt-1 shrink-0 ring-2 ring-slate-800"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Description */}
        {category.description ? (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {category.description}
          </p>
        ) : (
          <p className="text-xs text-slate-600 italic mb-3">No description</p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
              <Package className="h-3 w-3" />
              {productCount} product{productCount !== 1 ? "s" : ""}
            </span>
            <Switch
              checked={category.isActive}
              onCheckedChange={() => onToggleActive(category)}
              aria-label={`Toggle ${category.name} active`}
              data-ocid={`toggle-active-${category.id}`}
              className="scale-75 origin-left"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onEdit(category)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors duration-150"
              aria-label={`Edit ${category.name}`}
              data-ocid={`edit-category-${category.id}`}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(category)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150"
              aria-label={`Delete ${category.name}`}
              data-ocid={`delete-category-${category.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Category Image Upload Zone ────────────────────────────────────────────────

interface ImageZoneProps {
  pending: PendingImage | null;
  existing: string;
  uploading: boolean;
  progress: number;
  onSelect: (file: File) => void;
  onClear: () => void;
}

function CategoryImageZone({
  pending,
  existing,
  uploading,
  progress,
  onSelect,
  onClear,
}: ImageZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const previewSrc = pending?.preview ?? existing ?? "";

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image exceeds 5 MB limit");
      return;
    }
    onSelect(file);
  }

  if (previewSrc) {
    return (
      <div className="relative w-full h-36 rounded-xl overflow-hidden group">
        <img
          src={previewSrc}
          alt="Category banner preview"
          className="w-full h-full object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
            <div className="w-3/4">
              <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-white/70 text-center mt-1">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        )}
        {!uploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label="Upload category image"
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
      data-ocid="category-image-upload-zone"
      className="relative w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-200 h-28 text-sm select-none outline-none focus-visible:ring-2"
      style={{
        borderColor: dragging
          ? "oklch(0.71 0.17 48 / 0.7)"
          : "oklch(0.30 0.05 243 / 0.6)",
        background: dragging
          ? "oklch(0.71 0.17 48 / 0.05)"
          : "oklch(0.14 0.03 243 / 0.4)",
        boxShadow: dragging ? "0 0 18px oklch(0.71 0.17 48 / 0.15)" : "none",
      }}
    >
      <ImagePlus size={22} style={{ color: "oklch(0.55 0.08 243)" }} />
      <span style={{ color: "oklch(0.60 0.05 243)" }}>
        Click or drag to upload image
      </span>
      <span style={{ color: "oklch(0.40 0.04 243)", fontSize: "11px" }}>
        JPEG · PNG · WebP · max 5 MB
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </button>
  );
}

// ─── Category Form Modal ──────────────────────────────────────────────────────

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  editTarget: AdminCategory | null;
}

function CategoryModal({ open, onClose, editTarget }: CategoryModalProps) {
  const isEdit = editTarget !== null;
  const [saving, setSaving] = useState(false);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      color: BRAND_COLORS[0],
      imageUrl: "",
      isActive: true,
    },
  });

  const nameValue = useWatch({ control, name: "name" });
  const colorValue = watch("color");
  const isActiveValue = watch("isActive");
  const imageUrlValue = watch("imageUrl");

  // Auto-generate slug from name (only when adding)
  useEffect(() => {
    if (!isEdit) {
      setValue("slug", slugify(nameValue ?? ""), { shouldValidate: false });
    }
  }, [nameValue, isEdit, setValue]);

  // Populate form when editing
  useEffect(() => {
    if (editTarget) {
      reset({
        name: editTarget.name,
        slug: editTarget.slug,
        description: editTarget.description ?? "",
        color: editTarget.color ?? BRAND_COLORS[0],
        imageUrl: editTarget.imageUrl ?? "",
        isActive: editTarget.isActive,
      });
      setPendingImage(null);
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        color: BRAND_COLORS[0],
        imageUrl: "",
        isActive: true,
      });
      setPendingImage(null);
    }
  }, [editTarget, reset]);

  function handleImageSelect(file: File) {
    if (pendingImage?.preview.startsWith("blob:")) {
      URL.revokeObjectURL(pendingImage.preview);
    }
    setPendingImage({ file, preview: URL.createObjectURL(file) });
    setValue("imageUrl", ""); // clear manual URL when file chosen
  }

  function handleImageClear() {
    if (pendingImage?.preview.startsWith("blob:")) {
      URL.revokeObjectURL(pendingImage.preview);
    }
    setPendingImage(null);
    setValue("imageUrl", "");
  }


const storage = getStorage();

async function uploadImageToStorage(
  file: File,
  categoryId: string,
): Promise<string> {
  try {
    const storageRef = ref(
      storage,
      `categories/${categoryId}_${Date.now()}_${file.name}`
    );

    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    setUploadProgress(100);

    return downloadURL; // ✅ REAL URL
  } catch (error) {
    console.error(error);
    toast.error("Image upload failed");
    throw error;
  }
}

  async function onSubmit(data: CategoryFormData) {
    setSaving(true);
    try {
      let finalImageUrl = data.imageUrl;

      if (pendingImage) {
        setUploading(true);
        setUploadProgress(0);
        const tempId = editTarget?.id ?? `cat-${Date.now()}`;
        finalImageUrl = await uploadImageToStorage(pendingImage.file, tempId);
        setUploading(false);
      }

      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color,
        imageUrl: finalImageUrl,
        isActive: data.isActive,
      };

      if (isEdit && editTarget) {
        await updateCategory(editTarget.id, payload);
        toast.success("Category updated");
      } else {
        await addCategory({ ...payload, productCount: 0 });
        toast.success("Category created");
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/40 bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          data-ocid="category-modal"
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-white">
              {isEdit ? "Edit Category" : "Add Category"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Category Image Upload */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Category Image{" "}
                <span className="text-slate-500 text-xs">(optional)</span>
              </Label>
              <CategoryImageZone
                pending={pendingImage}
                existing={imageUrlValue}
                uploading={uploading}
                progress={uploadProgress}
                onSelect={handleImageSelect}
                onClear={handleImageClear}
              />
              {/* Manual URL fallback */}
              {!pendingImage && (
                <div className="mt-2">
                  <Input
                    placeholder="Or paste image URL..."
                    {...register("imageUrl")}
                    className="bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 focus:border-blue-500/60 text-xs h-8"
                    data-ocid="input-category-image"
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-slate-300 text-sm">
                Category Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="cat-name"
                placeholder="e.g. Arduino Kits"
                {...register("name", { required: "Name is required" })}
                className="bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 focus:border-blue-500/60"
                data-ocid="input-category-name"
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="cat-slug" className="text-slate-300 text-sm">
                Slug
              </Label>
              <Input
                id="cat-slug"
                placeholder="arduino-kits"
                {...register("slug", {
                  required: "Slug is required",
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: "Only lowercase letters, numbers, and hyphens",
                  },
                })}
                className="bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 font-mono text-sm focus:border-blue-500/60"
                data-ocid="input-category-slug"
              />
              {errors.slug && (
                <p className="text-xs text-red-400">{errors.slug.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-slate-300 text-sm">
                Description
              </Label>
              <Textarea
                id="cat-desc"
                placeholder="Brief description of this category..."
                rows={3}
                {...register("description")}
                className="bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 resize-none focus:border-blue-500/60"
                data-ocid="input-category-description"
              />
            </div>

            {/* Color picker */}
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Color Tag</Label>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 flex-wrap">
                  {BRAND_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue("color", c)}
                      className="h-7 w-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      style={{
                        backgroundColor: c,
                        boxShadow:
                          colorValue === c
                            ? `0 0 0 2px #0f172a, 0 0 0 4px ${c}`
                            : undefined,
                      }}
                      aria-label={`Select color ${c}`}
                      data-ocid={`color-swatch-${c.replace("#", "")}`}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  {...register("color")}
                  className="h-8 w-12 rounded cursor-pointer bg-transparent border border-slate-700/60"
                  aria-label="Custom color picker"
                  data-ocid="input-color-custom"
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: colorValue }}
                />
                <span className="text-xs text-slate-500 font-mono">
                  {colorValue}
                </span>
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center justify-between rounded-xl bg-slate-800/40 border border-slate-700/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Active</p>
                <p className="text-xs text-slate-500">
                  Show this category on the storefront
                </p>
              </div>
              <Switch
                checked={isActiveValue}
                onCheckedChange={(v) => setValue("isActive", v)}
                data-ocid="toggle-category-active-form"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-700/60 text-slate-300 hover:bg-slate-800/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white border-0 shadow-lg shadow-orange-500/20"
                data-ocid="submit-category-form"
              >
                {saving && <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />}
                {saving
                  ? uploading
                    ? "Uploading..."
                    : "Saving..."
                  : isEdit
                    ? "Save Changes"
                    : "Create Category"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  category: AdminCategory | null;
  productCount: number;
  onConfirm: () => void;
  deleting: boolean;
}

function DeleteDialog({
  open,
  onClose,
  category,
  productCount,
  onConfirm,
  deleting,
}: DeleteDialogProps) {
  if (!category) return null;
  const hasProducts = productCount > 0;

  return (
    <AlertDialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl border border-slate-700/40 bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          data-ocid="delete-category-dialog"
        >
          <AlertDialog.Title className="text-lg font-semibold text-white mb-2">
            Delete &ldquo;{category.name}&rdquo;?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-slate-400 mb-6 leading-relaxed">
            {hasProducts
              ? `This category has ${productCount} linked product${productCount !== 1 ? "s" : ""}. Deleting it may affect those products. This action cannot be undone.`
              : "This action cannot be undone. The category will be permanently removed."}
          </AlertDialog.Description>
          <div className="flex gap-3">
            <AlertDialog.Cancel asChild>
              <Button
                variant="outline"
                className="flex-1 border-slate-700/60 text-slate-300 hover:bg-slate-800/60"
              >
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                onClick={onConfirm}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
                data-ocid="confirm-delete-category"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [productsByCategoryId, setProductsByCategoryId] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCategories((cats) => {
      setCategories(cats);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Count products per category using categoryIds array (multi-category support)
  useEffect(() => {
    const unsub = subscribeToProducts((products) => {
      const counts: Record<string, number> = {};
      for (const p of products) {
        const ids: string[] =
          Array.isArray(p.categoryIds) && p.categoryIds.length > 0
            ? p.categoryIds
            : p.categoryId
              ? [p.categoryId]
              : [];
        for (const id of ids) {
          counts[id] = (counts[id] ?? 0) + 1;
        }
      }
      setProductsByCategoryId(counts);
    });
    return unsub;
  }, []);

  const enrichedCategories = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        productCount: productsByCategoryId[cat.id] ?? cat.productCount ?? 0,
      })),
    [categories, productsByCategoryId],
  );

  function handleAddClick() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function handleEdit(cat: AdminCategory) {
    setEditTarget(cat);
    setModalOpen(true);
  }

  function handleDeleteClick(cat: AdminCategory) {
    setDeleteTarget(cat);
    setDeleteDialogOpen(true);
  }

  async function handleToggleActive(cat: AdminCategory) {
    try {
      await updateCategory(cat.id, { isActive: !cat.isActive });
      toast.success(`Category ${!cat.isActive ? "activated" : "deactivated"}`);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.");
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      toast.success("Category deleted");
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const deleteTargetCount = deleteTarget
    ? (productsByCategoryId[deleteTarget.id] ?? deleteTarget.productCount ?? 0)
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-6" data-ocid="admin-categories-page">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              Categories
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {loading
                ? "Loading..."
                : `${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}
            </p>
          </div>
          <Button
            onClick={handleAddClick}
            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white border-0 shadow-lg shadow-orange-500/25 shrink-0"
            data-ocid="add-category-btn"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </motion.div>

        {/* Category Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((sk) => (
              <CategoryCardSkeleton key={sk} />
            ))}
          </div>
        ) : enrichedCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl p-16 flex flex-col items-center justify-center text-center"
            data-ocid="categories-empty-state"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/60 border border-slate-700/40">
              <Layers className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              No categories yet
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mb-6">
              Create your first category to start organizing your products.
            </p>
            <Button
              onClick={handleAddClick}
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white border-0"
              data-ocid="add-first-category-btn"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Category
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrichedCategories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                productCount={cat.productCount}
                index={i}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editTarget={editTarget}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}
        category={deleteTarget}
        productCount={deleteTargetCount}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </AdminLayout>
  );
}
