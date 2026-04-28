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
import {
  addCoupon,
  deleteCoupon,
  subscribeToCoupons,
  updateCoupon,
} from "@/lib/adminService";
import type { AdminCoupon } from "@/types/admin";
import {
  CalendarDays,
  Pencil,
  Percent,
  Plus,
  Search,
  Tag,
  TicketPercent,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CouponFormValues {
  code: string;
  discountType: "percent" | "flat";
  discountValue: string;
  minOrderAmount: string;
  usageLimit: string;
  expiresAt: string;
  description: string;
  isActive: boolean;
  audience: "all" | "new" | "inactive" | "active";
  activityDays: string;
  oneTimePerUser: boolean;
}

interface FormErrors {
  code?: string;
  discountValue?: string;
}

type FilterStatus = "all" | "active" | "inactive" | "expired";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

function formatExpiry(expiresAt?: string): string {
  if (!expiresAt) return "No Expiry";
  return new Date(expiresAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDiscount(coupon: AdminCoupon): string {
  return coupon.discountType === "percent"
    ? `${coupon.discountValue}% OFF`
    : `₹${coupon.discountValue} OFF`;
}

function getCouponStatus(
  coupon: AdminCoupon,
): "active" | "inactive" | "expired" {
  if (isExpired(coupon.expiresAt)) return "expired";
  return coupon.isActive ? "active" : "inactive";
}

function validateForm(values: CouponFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.code.trim()) {
    errors.code = "Coupon code is required";
  }
  const val = Number(values.discountValue);
  if (!values.discountValue || Number.isNaN(val) || val <= 0) {
    errors.discountValue = "Must be a positive number";
  } else if (values.discountType === "percent" && val > 100) {
    errors.discountValue = "Percent discount must be 1–100";
  }
  return errors;
}

const DEFAULT_FORM: CouponFormValues = {
  code: "",
  discountType: "percent",
  discountValue: "10",
  minOrderAmount: "0",
  usageLimit: "0",
  expiresAt: "",
  description: "",
  isActive: true,
  audience: "all",
  activityDays: "60",
  oneTimePerUser: true,
};

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e"];

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm">
      <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
      <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
      <div className="ml-auto flex gap-6">
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
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
  accent?: "blue" | "green" | "red";
}

function StatsCard({ label, value, icon, accent = "blue" }: StatsCardProps) {
  const accentClasses: Record<string, string> = {
    blue: "from-primary/20 to-primary/5 border-primary/20",
    green: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    red: "from-destructive/20 to-destructive/5 border-destructive/20",
  };
  const iconClasses: Record<string, string> = {
    blue: "text-primary",
    green: "text-emerald-500",
    red: "text-destructive",
  };
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-5 backdrop-blur-sm ${accentClasses[accent]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/70">{label}</span>
        <span className={iconClasses[accent]}>{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

// ─── Coupon Row ───────────────────────────────────────────────────────────────

interface CouponRowProps {
  coupon: AdminCoupon;
  onEdit: (c: AdminCoupon) => void;
  onDelete: (c: AdminCoupon) => void;
  onToggle: (c: AdminCoupon) => void;
}

function CouponRow({ coupon, onEdit, onDelete, onToggle }: CouponRowProps) {
  const status = getCouponStatus(coupon);
  const statusStyles: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    inactive: "bg-muted text-muted-foreground border-border",
    expired: "bg-destructive/15 text-destructive border-destructive/30",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm transition-colors hover:bg-card/80"
    >
      {/* Code */}
      <div className="flex min-w-[120px] items-center gap-2">
        <Tag className="h-4 w-4 shrink-0 text-primary" />
        <span className="font-mono text-sm font-bold uppercase tracking-widest text-white/90">
          {coupon.code}
        </span>
      </div>

      {/* Discount badge */}
      <Badge
        className="border border-primary/30 bg-primary/15 font-semibold text-white/90"
        variant="outline"
      >
        {formatDiscount(coupon)}
      </Badge>

      {/* Status badge */}
      <Badge
        className={`border text-xs font-medium ${statusStyles[status]}`}
        variant="outline"
      >
        {`${status.charAt(0).toUpperCase()}${status.slice(1)}`}
      </Badge>

      {/* Meta */}
      <div className="ml-auto flex flex-wrap items-center gap-4 text-sm text-white/70">
        <span className="flex items-center gap-1">
          <TrendingDown className="h-3.5 w-3.5" />
          {`Min ₹${coupon.minOrderAmount}`}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatExpiry(coupon.expiresAt)}
        </span>
        <span className="flex items-center gap-1">
          <Percent className="h-3.5 w-3.5" />
          {`${coupon.usedCount}/${coupon.usageLimit === 0 ? "∞" : coupon.usageLimit}`}
        </span>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-2">
        <Switch
          id={`switch-${coupon.id}`}
          checked={coupon.isActive}
          disabled={status === "expired"}
          onCheckedChange={() => onToggle(coupon)}
        />
        <Label htmlFor={`switch-${coupon.id}`} className="sr-only">
          {`Toggle ${coupon.code}`}
        </Label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
          onClick={() => onEdit(coupon)}
          aria-label={`Edit ${coupon.code}`}
          data-ocid="coupon-edit-btn"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(coupon)}
          aria-label={`Delete ${coupon.code}`}
          data-ocid="coupon-delete-btn"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Coupon Form Dialog ────────────────────────────────────────────────────────

interface CouponDialogProps {
  open: boolean;
  editTarget: AdminCoupon | null;
  onClose: () => void;
}

function CouponDialog({ open, editTarget, onClose }: CouponDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<CouponFormValues>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) return;
    if (editTarget) {
      setForm({
        code: editTarget.code,
        discountType: editTarget.discountType,
        discountValue: String(editTarget.discountValue),
        minOrderAmount: String(editTarget.minOrderAmount),
        usageLimit: String(editTarget.usageLimit),
        expiresAt: editTarget.expiresAt ?? "",
        description: editTarget.description ?? "",
        isActive: editTarget.isActive,
        audience: editTarget.audience ?? "all",
        activityDays: String(editTarget.activityDays ?? 60),
        oneTimePerUser: editTarget.oneTimePerUser ?? true,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [open, editTarget]);

  function handleChange(
    field: keyof CouponFormValues,
    value: string | boolean,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validateForm(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      toast.error("Please fill the required fields correctly.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        usageLimit: Number(form.usageLimit) || 0,
        expiresAt: form.expiresAt || undefined,
        description: form.description || undefined,
        isActive: form.isActive,
        audience: form.audience,
        activityDays:
          form.audience === "active" || form.audience === "inactive"
            ? Number(form.activityDays) || 60
            : undefined,
        oneTimePerUser: form.oneTimePerUser,
      };

      if (editTarget) {
        await updateCoupon(editTarget.id, payload);
        toast.success("Coupon updated successfully");
      } else {
        await addCoupon(payload);
        toast.success("Coupon created successfully");
      }
      onClose();
    } catch {
      toast.error(
        editTarget ? "Failed to update coupon" : "Failed to create coupon",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-h-[90vh] max-w-lg overflow-y-auto p-0 border-0 shadow-2xl"
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
            {editTarget ? "Edit Coupon" : "Create Coupon"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-5 space-y-5">
          {/* Code */}
          <div className="space-y-1.5">
            <Label
              htmlFor="coupon-code"
              className="text-xs font-semibold text-white/60 uppercase tracking-widest"
            >
              Coupon Code *
            </Label>
            <Input
              id="coupon-code"
              value={form.code}
              onChange={(e) =>
                handleChange("code", e.target.value.toUpperCase())
              }
              placeholder="e.g. SAVE20"
              className="h-10 text-sm font-mono uppercase"
              style={{
                background: "oklch(0.15 0.03 243 / 0.7)",
                border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                color: "white",
              }}
              data-ocid="coupon-code-input"
            />
            {errors.code && (
              <p className="text-[11px] text-red-400">{errors.code}</p>
            )}
          </div>

          {/* Discount Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Discount Type *
              </Label>
              <Select
                value={form.discountType}
                onValueChange={(v) => handleChange("discountType", v)}
              >
                <SelectTrigger
                  className="h-10 text-sm"
                  style={{
                    background: "oklch(0.15 0.03 243 / 0.7)",
                    border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                    color: "white",
                  }}
                  data-ocid="coupon-type-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "oklch(0.14 0.04 243)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                    color: "white",
                  }}
                >
                  <SelectItem value="percent" className="text-white/80">
                    Percentage (%)
                  </SelectItem>
                  <SelectItem value="flat" className="text-white/80">
                    Flat Amount (₹)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="coupon-value"
                className="text-xs font-semibold text-white/60 uppercase tracking-widest"
              >
                {form.discountType === "percent"
                  ? "Discount % *"
                  : "Discount ₹ *"}
              </Label>
              <Input
                id="coupon-value"
                type="number"
                value={form.discountValue}
                onChange={(e) => handleChange("discountValue", e.target.value)}
                placeholder={
                  form.discountType === "percent" ? "1–100" : "e.g. 200"
                }
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
                data-ocid="coupon-value-input"
              />
              {errors.discountValue && (
                <p className="text-[11px] text-red-400">
                  {errors.discountValue}
                </p>
              )}
            </div>
          </div>

          {/* Min Order + Usage Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="coupon-min"
                className="text-xs font-semibold text-white/60 uppercase tracking-widest"
              >
                Min Order Amount (₹)
              </Label>
              <Input
                id="coupon-min"
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => handleChange("minOrderAmount", e.target.value)}
                placeholder="0"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
                data-ocid="coupon-min-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="coupon-limit"
                className="text-xs font-semibold text-white/60 uppercase tracking-widest"
              >
                Usage Limit (0 = unlimited)
              </Label>
              <Input
                id="coupon-limit"
                type="number"
                value={form.usageLimit}
                onChange={(e) => handleChange("usageLimit", e.target.value)}
                placeholder="0"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
                data-ocid="coupon-limit-input"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor="coupon-expiry"
              className="text-xs font-semibold text-white/60 uppercase tracking-widest"
            >
              Expiry Date (optional)
            </Label>
            <Input
              id="coupon-expiry"
              type="date"
              value={form.expiresAt}
              onChange={(e) => handleChange("expiresAt", e.target.value)}
              className="h-10 text-sm"
              style={{
                background: "oklch(0.15 0.03 243 / 0.7)",
                border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                color: "white",
              }}
              data-ocid="coupon-expiry-input"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="coupon-desc"
              className="text-xs font-semibold text-white/60 uppercase tracking-widest"
            >
              Description (optional)
            </Label>
            <Textarea
              id="coupon-desc"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. 20% off for first-time buyers"
              rows={2}
              className="text-sm resize-none"
              style={{
                background: "oklch(0.15 0.03 243 / 0.7)",
                border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                color: "white",
              }}
              data-ocid="coupon-desc-input"
            />
          </div>

          {/* Audience */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Audience
            </Label>
            <Select
              value={form.audience}
              onValueChange={(v) => handleChange("audience", v)}
            >
              <SelectTrigger
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
                data-ocid="coupon-audience-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: "oklch(0.14 0.04 243)",
                  border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                  color: "white",
                }}
              >
                <SelectItem value="all" className="text-white/80">
                  All users
                </SelectItem>
                <SelectItem value="new" className="text-white/80">
                  New users (no orders)
                </SelectItem>
                <SelectItem value="inactive" className="text-white/80">
                  Inactive users
                </SelectItem>
                <SelectItem value="active" className="text-white/80">
                  Active users
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-white/40">
              New = no orders. Inactive/Active are based on last order date.
            </p>
          </div>

          {(form.audience === "inactive" || form.audience === "active") && (
            <div className="space-y-1.5">
              <Label
                htmlFor="coupon-activity-days"
                className="text-xs font-semibold text-white/60 uppercase tracking-widest"
              >
                Activity window (days)
              </Label>
              <Input
                id="coupon-activity-days"
                type="number"
                value={form.activityDays}
                onChange={(e) => handleChange("activityDays", e.target.value)}
                placeholder="60"
                className="h-10 text-sm"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.7)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                  color: "white",
                }}
                data-ocid="coupon-activity-days-input"
              />
              <p className="text-xs text-white/40">
                Active = ordered within last N days. Inactive = no order in last
                N days.
              </p>
            </div>
          )}

          {/* One-time per user */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "oklch(0.14 0.03 243 / 0.5)",
              border: "1px solid oklch(0.25 0.05 243 / 0.4)",
            }}
          >
            <Switch
              id="coupon-onetime"
              checked={form.oneTimePerUser}
              onCheckedChange={(v) => handleChange("oneTimePerUser", v)}
              data-ocid="coupon-onetime-toggle"
            />
            <Label
              htmlFor="coupon-onetime"
              className="cursor-pointer text-sm font-medium text-white/70"
            >
              One-time per user
            </Label>
          </div>

          {/* Active toggle */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "oklch(0.14 0.03 243 / 0.5)",
              border: "1px solid oklch(0.25 0.05 243 / 0.4)",
            }}
          >
            <Switch
              id="coupon-active"
              checked={form.isActive}
              onCheckedChange={(v) => handleChange("isActive", v)}
              data-ocid="coupon-active-toggle"
            />
            <Label
              htmlFor="coupon-active"
              className="cursor-pointer text-sm font-medium text-white/70"
            >
              Active — coupon is usable at checkout
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              style={{
                background: "oklch(0.18 0.04 243 / 0.6)",
                border: "1px solid oklch(0.28 0.05 243 / 0.5)",
                color: "white",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              data-ocid="coupon-save-btn"
            >
              {isSaving
                ? "Saving…"
                : editTarget
                  ? "Save Changes"
                  : "Create Coupon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCoupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCoupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCoupons((data) => {
      setCoupons(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(
      (c) => getCouponStatus(c) === "active",
    ).length;
    const expired = coupons.filter(
      (c) => getCouponStatus(c) === "expired",
    ).length;
    return { total, active, expired };
  }, [coupons]);

  const filtered = useMemo(() => {
    let list = coupons;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((c) => getCouponStatus(c) === statusFilter);
    }

    return list;
  }, [coupons, search, statusFilter]);

  function openCreate() {
    setEditTarget(null);
    setDialogOpen(true);
  }

  function openEdit(coupon: AdminCoupon) {
    setEditTarget(coupon);
    setDialogOpen(true);
  }

  async function handleToggle(coupon: AdminCoupon) {
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      toast.success(`Coupon ${coupon.isActive ? "deactivated" : "activated"}`);
    } catch {
      toast.error("Failed to update coupon status");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCoupon(deleteTarget.id);
      toast.success(`Coupon "${deleteTarget.code}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete coupon");
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
              <TicketPercent className="h-6 w-6 text-primary" />
              Coupon Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage discount codes for your store
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600"
            data-ocid="create-coupon-btn"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard
            label="Total Coupons"
            value={stats.total}
            icon={<TicketPercent className="h-5 w-5" />}
            accent="blue"
          />
          <StatsCard
            label="Active Coupons"
            value={stats.active}
            icon={<Tag className="h-5 w-5" />}
            accent="green"
          />
          <StatsCard
            label="Expired Coupons"
            value={stats.expired}
            icon={<CalendarDays className="h-5 w-5" />}
            accent="red"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search coupon code or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="coupon-search-input"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as FilterStatus)}
          >
            <SelectTrigger className="w-44" data-ocid="coupon-status-filter">
              <SelectValue placeholder="Status filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coupons</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-white/40">
          Search by coupon code or description, then filter by status on the right.
        </p>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            SKELETON_KEYS.map((k) => <SkeletonRow key={k} />)
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 py-16 text-center"
              data-ocid="coupon-empty-state"
            >
              <TicketPercent className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {search || statusFilter !== "all"
                  ? "No coupons match your filters"
                  : "No coupons yet"}
              </h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first discount coupon to boost conversions."}
              </p>
              {!search && statusFilter === "all" && (
                <Button
                  className="mt-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                  onClick={openCreate}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Coupon
                </Button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((coupon) => (
                <CouponRow
                  key={coupon.id}
                  coupon={coupon}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onToggle={handleToggle}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Create / Edit Dialog */}
      <CouponDialog
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
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete coupon{" "}
              <span className="font-mono font-bold">{deleteTarget?.code}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="coupon-delete-confirm-btn"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
