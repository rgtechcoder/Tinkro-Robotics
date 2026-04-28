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
import {
  addBanner,
  deleteBanner,
  subscribeToBanners,
  updateBanner,
  uploadBannerImage,
} from "@/lib/adminService";
import type { AdminBanner } from "@/types/admin";
import {
  AlertCircle,
  ExternalLink,
  Image,
  ImageOff,
  Layout,
  Megaphone,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BannerFormValues {
  title: string;
  description: string;
  type: "banner" | "popup";
  position: "top" | "center" | "bottom";
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

interface FormErrors {
  title?: string;
}

type StatusType = "active" | "inactive";
type FilterType = "all" | "banner" | "popup";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

function getBannerStatus(banner: AdminBanner): StatusType {
  if (!banner.isActive) return "inactive";
  return "active";
}

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; borderColor: string; badgeClass: string }
> = {
  active: {
    label: "Active",
    borderColor: "border-l-emerald-500",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  inactive: {
    label: "Inactive",
    borderColor: "border-l-muted-foreground",
    badgeClass:
      "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
  },
};

const TYPE_CONFIG: Record<
  "banner" | "popup",
  { label: string; badgeClass: string }
> = {
  banner: {
    label: "Banner",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
  },
  popup: {
    label: "Popup",
    badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
};

const EMPTY_FORM: BannerFormValues = {
  title: "",
  description: "",
  type: "banner",
  position: "center",
  ctaText: "",
  ctaLink: "",
  isActive: true,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.FC<{ className?: string }>;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-border/40 bg-card/60 overflow-hidden">
      <div className="h-32 bg-muted/60" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted/60 rounded w-3/4" />
        <div className="h-3 bg-muted/40 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-muted/60 rounded-full w-16" />
          <div className="h-5 bg-muted/40 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);
  const [form, setForm] = useState<BannerFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminBanner | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToBanners((data) => {
      setBanners(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = banners.filter((b) =>
    filter === "all" ? true : b.type === filter,
  );

  const stats = {
    total: banners.length,
    active: banners.filter((b) => getBannerStatus(b) === "active").length,
  };

  // ─── Form helpers ────────────────────────────────────────────────────────

  function openCreate() {
    setEditingBanner(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  }

  function openEdit(banner: AdminBanner) {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      description: banner.description ?? "",
      type: banner.type,
      position: banner.position ?? "center",
      ctaText: banner.ctaText ?? "",
      ctaLink: banner.ctaLink ?? "",
      isActive: banner.isActive,
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(banner.imageUrl ?? "");
    setDialogOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please add a title before saving.");
    }
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Omit<AdminBanner, "id" | "createdAt"> = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        position: form.type === "popup" ? form.position : undefined,
        ctaText: form.ctaText.trim() || undefined,
        ctaLink: form.ctaLink.trim() || undefined,
        isActive: form.isActive,
        imageUrl: editingBanner?.imageUrl ?? undefined,
      };

      let bannerId = editingBanner?.id ?? "";

      if (!editingBanner) {
        bannerId = await addBanner(payload);
      } else {
        await updateBanner(editingBanner.id, payload);
      }

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true);
        const url = await uploadBannerImage(imageFile, bannerId);
        await updateBanner(bannerId, { imageUrl: url });
        setUploadingImage(false);
      }

      toast.success(
        editingBanner
          ? "Banner updated successfully"
          : "Banner created successfully",
      );
      setDialogOpen(false);
    } catch (err) {
      toast.error("Failed to save banner. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  }

  async function handleToggleActive(banner: AdminBanner) {
    try {
      await updateBanner(banner.id, { isActive: !banner.isActive });
      toast.success(`Banner ${banner.isActive ? "deactivated" : "activated"}`);
    } catch {
      toast.error("Failed to update banner status");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBanner(deleteTarget.id);
      toast.success("Banner deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Banners &amp; Popups
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage homepage banners, promotional offers, and popup campaigns
            </p>
          </div>
          <Button
            onClick={openCreate}
            data-ocid="banners-create-btn"
            className="gap-2 bg-[image:var(--gradient-orange)] text-white shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Create Banner
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Total Banners"
            value={stats.total}
            icon={Layout}
            color="bg-primary/10 text-primary"
          />
          <StatCard
            label="Active Now"
            value={stats.active}
            icon={Megaphone}
            color="bg-emerald-500/10 text-emerald-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border/40 pb-1">
          {(["all", "banner", "popup"] as FilterType[]).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setFilter(tab)}
              data-ocid={`banners-filter-${tab}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === tab
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All" : `${tab}s`}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SKELETON_KEYS.map((key) => (
              <SkeletonCard key={key} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 py-20 text-center"
            data-ocid="banners-empty-state"
          >
            <ImageOff className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <h3 className="text-base font-semibold text-foreground">
              No banners found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "all"
                ? "Create your first banner or popup to get started"
                : `No ${filter}s yet. Create one above.`}
            </p>
            <Button
              onClick={openCreate}
              className="mt-4 gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" /> Create Banner
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((banner, idx) => {
                const status = getBannerStatus(banner);
                const statusCfg = STATUS_CONFIG[status];
                const typeCfg = TYPE_CONFIG[banner.type];

                return (
                  <motion.div
                    key={banner.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-xl border-l-4 border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden ${statusCfg.borderColor}`}
                    data-ocid={`banner-card-${banner.id}`}
                  >
                    {/* Image Preview */}
                    <div
                      className={`relative overflow-hidden bg-muted/30 ${
                        banner.type === "popup"
                          ? "aspect-square"
                          : "aspect-[16/5]"
                      }`}
                    >
                      {banner.imageUrl ? (
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Image className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                      {/* Type badge overlay */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${typeCfg.badgeClass}`}
                        >
                          {typeCfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground leading-tight line-clamp-1">
                          {banner.title}
                        </h3>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusCfg.badgeClass}`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>

                      {banner.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {banner.description}
                        </p>
                      )}

                      {/* CTA */}
                      {banner.ctaText && (
                        <div className="flex items-center gap-1.5 text-xs text-primary">
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {banner.ctaText}
                            {banner.ctaLink && (
                              <span className="text-muted-foreground ml-1">
                                → {banner.ctaLink}
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      {/* Actions row */}
                      <div className="flex items-center justify-between border-t border-border/30 pt-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`toggle-${banner.id}`}
                            checked={banner.isActive}
                            onCheckedChange={() => handleToggleActive(banner)}
                            data-ocid={`banner-toggle-${banner.id}`}
                          />
                          <label
                            htmlFor={`toggle-${banner.id}`}
                            className="text-xs text-muted-foreground cursor-pointer select-none"
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </label>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(banner)}
                            data-ocid={`banner-edit-${banner.id}`}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            aria-label="Edit banner"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteTarget(banner)}
                            data-ocid={`banner-delete-${banner.id}`}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            aria-label="Delete banner"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* ─── Create / Edit Dialog ─────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "Create Banner"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="banner-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="banner-title"
                data-ocid="banner-form-title"
                placeholder="Summer Sale Banner"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              {errors.title && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="banner-desc">Description (optional)</Label>
              <Textarea
                id="banner-desc"
                data-ocid="banner-form-description"
                placeholder="Short description shown on the banner..."
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            {/* Type + Position row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="banner-type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, type: v as "banner" | "popup" }))
                  }
                >
                  <SelectTrigger id="banner-type" data-ocid="banner-form-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.type === "popup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="banner-position">Position</Label>
                  <Select
                    value={form.position}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        position: v as "top" | "center" | "bottom",
                      }))
                    }
                  >
                    <SelectTrigger
                      id="banner-position"
                      data-ocid="banner-form-position"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="banner-cta-text">CTA Button Text</Label>
                <Input
                  id="banner-cta-text"
                  data-ocid="banner-form-cta-text"
                  placeholder="Shop Now"
                  value={form.ctaText}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, ctaText: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="banner-cta-link">CTA Link / URL</Label>
                <Input
                  id="banner-cta-link"
                  data-ocid="banner-form-cta-link"
                  placeholder="/products"
                  value={form.ctaLink}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, ctaLink: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
              <Switch
                id="banner-active"
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                data-ocid="banner-form-active"
              />
              <label
                htmlFor="banner-active"
                className="text-sm font-medium cursor-pointer select-none"
              >
                Active
              </label>
              <span className="text-xs text-muted-foreground ml-auto">
                {form.isActive ? "Visible to users" : "Hidden from users"}
              </span>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Banner Image (optional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                data-ocid="banner-form-image-input"
              />

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-lg border border-border/50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className={`w-full object-cover ${
                      form.type === "popup" ? "aspect-square" : "aspect-[16/5]"
                    }`}
                  />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 rounded-full bg-background/80 p-1 text-xs text-muted-foreground hover:text-destructive"
                    aria-label="Remove image"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 bg-muted/20 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  data-ocid="banner-form-image-upload"
                >
                  <Upload className="h-6 w-6" />
                  Click to upload image
                </button>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || uploadingImage}
                data-ocid="banner-form-save"
                className="gap-2 bg-[image:var(--gradient-orange)] text-white hover:opacity-90"
              >
                {saving || uploadingImage ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {uploadingImage ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>{editingBanner ? "Save Changes" : "Create Banner"}</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ──────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>&quot;{deleteTarget?.title}&quot;</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              data-ocid="banner-delete-confirm"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
