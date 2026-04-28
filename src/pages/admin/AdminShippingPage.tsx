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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  addShippingRule,
  deleteShippingRule,
  subscribeToShippingRules,
  updateShippingRule,
} from "@/lib/adminService";
import type { AdminShippingRule } from "@/types/admin";
import {
  Calculator,
  Clock,
  Globe,
  Info,
  MapPin,
  Pencil,
  Plus,
  Ruler,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormValues {
  name: string;
  description: string;
  minOrderAmount: string;
  maxOrderAmount: string;
  baseCost: string;
  freeShippingAbove: string;
  estimatedDays: string;
  estimatedDaysMax: string;
  regions: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  minOrderAmount?: string;
  baseCost?: string;
  estimatedDays?: string;
}

const SKELETON_KEYS = ["sk-rule-a", "sk-rule-b", "sk-rule-c"];

const DEFAULT_FORM: FormValues = {
  name: "",
  description: "",
  minOrderAmount: "0",
  maxOrderAmount: "",
  baseCost: "0",
  freeShippingAbove: "",
  estimatedDays: "3",
  estimatedDaysMax: "",
  regions: "All India",
  isActive: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getAmountRange(rule: AdminShippingRule): string {
  const min = formatAmount(rule.minOrderAmount);
  if (rule.maxOrderAmount !== undefined && rule.maxOrderAmount !== null) {
    return `${min} – ${formatAmount(rule.maxOrderAmount)}`;
  }
  return `${min}+`;
}

function getDeliveryTime(rule: AdminShippingRule): string {
  if (rule.estimatedDaysMax) {
    return `${rule.estimatedDays}–${rule.estimatedDaysMax} days`;
  }
  return `${rule.estimatedDays} day${rule.estimatedDays !== 1 ? "s" : ""}`;
}

function calcShipping(
  rules: AdminShippingRule[],
  amount: number,
): { rule: AdminShippingRule | null; cost: number } {
  const activeRules = rules
    .filter((r) => r.isActive)
    .sort((a, b) => b.minOrderAmount - a.minOrderAmount);

  for (const rule of activeRules) {
    const aboveMin = amount >= rule.minOrderAmount;
    const belowMax =
      rule.maxOrderAmount === undefined ||
      rule.maxOrderAmount === null ||
      amount <= rule.maxOrderAmount;

    if (aboveMin && belowMax) {
      const cost =
        rule.freeShippingAbove !== undefined &&
        rule.freeShippingAbove !== null &&
        amount >= rule.freeShippingAbove
          ? 0
          : rule.baseCost;
      return { rule, cost };
    }
  }
  return { rule: null, cost: 0 };
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Rule name is required";
  const min = Number(values.minOrderAmount);
  if (Number.isNaN(min) || min < 0)
    errors.minOrderAmount = "Enter a valid amount";
  const cost = Number(values.baseCost);
  if (Number.isNaN(cost) || cost < 0) errors.baseCost = "Enter a valid cost";
  const days = Number(values.estimatedDays);
  if (Number.isNaN(days) || days < 1)
    errors.estimatedDays = "Enter estimated days";
  return errors;
}

// ─── Rule Card ────────────────────────────────────────────────────────────────

interface RuleCardProps {
  rule: AdminShippingRule;
  onEdit: (rule: AdminShippingRule) => void;
  onDelete: (rule: AdminShippingRule) => void;
  onToggle: (rule: AdminShippingRule) => void;
}

function RuleCard({ rule, onEdit, onDelete, onToggle }: RuleCardProps) {
  const visibleRegions = rule.regions.slice(0, 3);
  const extraCount = rule.regions.length - 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className="rounded-xl border p-5 flex flex-col gap-4"
      style={{
        background: "oklch(0.13 0.04 243 / 0.7)",
        borderColor: rule.isActive
          ? "oklch(0.71 0.17 48 / 0.25)"
          : "oklch(0.22 0.05 243 / 0.4)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white truncate">
              {rule.name}
            </span>
            {rule.isActive ? (
              <Badge
                className="text-[10px] px-2 py-0"
                style={{
                  background: "oklch(0.33 0.1 150 / 0.25)",
                  color: "oklch(0.75 0.15 150)",
                  border: "1px solid oklch(0.75 0.15 150 / 0.3)",
                }}
              >
                Active
              </Badge>
            ) : (
              <Badge
                className="text-[10px] px-2 py-0"
                style={{
                  background: "oklch(0.18 0.03 243 / 0.5)",
                  color: "oklch(0.50 0.03 243)",
                  border: "1px solid oklch(0.30 0.05 243 / 0.4)",
                }}
              >
                Inactive
              </Badge>
            )}
          </div>
          {rule.description && (
            <p
              className="text-xs mt-0.5 line-clamp-1"
              style={{ color: "oklch(0.55 0.03 243)" }}
            >
              {rule.description}
            </p>
          )}
        </div>
        {/* Toggle + actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Switch
            id={`shipping-toggle-${rule.id}`}
            checked={rule.isActive}
            onCheckedChange={() => onToggle(rule)}
            data-ocid={`shipping-toggle-${rule.id}`}
          />
          <button
            type="button"
            data-ocid={`shipping-edit-${rule.id}`}
            onClick={() => onEdit(rule)}
            className="p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 text-white/40 hover:text-white"
            title="Edit rule"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            data-ocid={`shipping-delete-${rule.id}`}
            onClick={() => onDelete(rule)}
            className="p-1.5 rounded-lg transition-all duration-200 hover:bg-red-500/15 text-white/30 hover:text-red-400"
            title="Delete rule"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className="rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
          style={{ background: "oklch(0.10 0.03 243 / 0.6)" }}
        >
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "oklch(0.45 0.03 243)" }}
          >
            Order Range
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "oklch(0.80 0.08 243)" }}
          >
            {getAmountRange(rule)}
          </span>
        </div>

        <div
          className="rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
          style={{ background: "oklch(0.10 0.03 243 / 0.6)" }}
        >
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "oklch(0.45 0.03 243)" }}
          >
            Shipping Cost
          </span>
          <span
            className="text-xs font-bold"
            style={{
              color:
                rule.baseCost === 0
                  ? "oklch(0.75 0.15 150)"
                  : "oklch(0.88 0.10 48)",
            }}
          >
            {rule.baseCost === 0 ? "FREE" : formatAmount(rule.baseCost)}
          </span>
        </div>

        <div
          className="rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
          style={{ background: "oklch(0.10 0.03 243 / 0.6)" }}
        >
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "oklch(0.45 0.03 243)" }}
          >
            Delivery
          </span>
          <span
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: "oklch(0.80 0.08 243)" }}
          >
            <Clock size={11} />
            {getDeliveryTime(rule)}
          </span>
        </div>

        <div
          className="rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
          style={{ background: "oklch(0.10 0.03 243 / 0.6)" }}
        >
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "oklch(0.45 0.03 243)" }}
          >
            Free Above
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "oklch(0.75 0.15 150)" }}
          >
            {rule.freeShippingAbove
              ? formatAmount(rule.freeShippingAbove)
              : "—"}
          </span>
        </div>
      </div>

      {/* Regions */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <MapPin
          size={12}
          className="shrink-0"
          style={{ color: "oklch(0.50 0.08 243)" }}
        />
        {visibleRegions.map((region) => (
          <Badge
            key={region}
            className="text-[10px] px-1.5 py-0"
            style={{
              background: "oklch(0.18 0.05 243 / 0.5)",
              color: "oklch(0.65 0.06 243)",
              border: "1px solid oklch(0.28 0.06 243 / 0.4)",
            }}
          >
            {region}
          </Badge>
        ))}
        {extraCount > 0 && (
          <span
            className="text-[10px]"
            style={{ color: "oklch(0.48 0.04 243)" }}
          >
            +{extraCount} more
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Shipping Form Dialog ─────────────────────────────────────────────────────

interface ShippingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRule: AdminShippingRule | null;
  onSuccess: () => void;
}

function ShippingFormDialog({
  open,
  onOpenChange,
  editRule,
  onSuccess,
}: ShippingFormDialogProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (editRule) {
        setValues({
          name: editRule.name,
          description: editRule.description ?? "",
          minOrderAmount: String(editRule.minOrderAmount),
          maxOrderAmount:
            editRule.maxOrderAmount !== undefined
              ? String(editRule.maxOrderAmount)
              : "",
          baseCost: String(editRule.baseCost),
          freeShippingAbove:
            editRule.freeShippingAbove !== undefined
              ? String(editRule.freeShippingAbove)
              : "",
          estimatedDays: String(editRule.estimatedDays),
          estimatedDaysMax:
            editRule.estimatedDaysMax !== undefined
              ? String(editRule.estimatedDaysMax)
              : "",
          regions: editRule.regions.join(", "),
          isActive: editRule.isActive,
        });
      } else {
        setValues(DEFAULT_FORM);
      }
      setErrors({});
    }
  }, [open, editRule]);

  function set(field: keyof FormValues, val: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const regionsArr = values.regions
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const payload: Omit<AdminShippingRule, "id" | "createdAt"> = {
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      minOrderAmount: Number(values.minOrderAmount),
      maxOrderAmount:
        values.maxOrderAmount !== ""
          ? Number(values.maxOrderAmount)
          : undefined,
      baseCost: Number(values.baseCost),
      freeShippingAbove:
        values.freeShippingAbove !== ""
          ? Number(values.freeShippingAbove)
          : undefined,
      estimatedDays: Number(values.estimatedDays),
      estimatedDaysMax:
        values.estimatedDaysMax !== ""
          ? Number(values.estimatedDaysMax)
          : undefined,
      regions: regionsArr.length > 0 ? regionsArr : ["All India"],
      isActive: values.isActive,
    };

    setSaving(true);
    try {
      if (editRule) {
        await updateShippingRule(editRule.id, payload);
        toast.success("Shipping rule updated");
      } else {
        await addShippingRule(payload);
        toast.success("Shipping rule created");
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save shipping rule");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    background: "oklch(0.10 0.03 250 / 0.8)",
    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
    color: "oklch(0.88 0.04 243)",
  };

  const labelStyle = { color: "oklch(0.65 0.04 243)" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.11 0.04 243), oklch(0.09 0.03 250))",
          border: "1px solid oklch(0.22 0.05 243 / 0.5)",
          color: "oklch(0.88 0.04 243)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-bold">
            {editRule ? "Edit Shipping Rule" : "New Shipping Rule"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Rule Name *</Label>
            <Input
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Standard Shipping"
              style={inputStyle}
              data-ocid="shipping-form-name"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Description</Label>
            <Textarea
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Optional short description"
              rows={2}
              style={inputStyle}
            />
          </div>

          {/* Order amount range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label style={labelStyle}>Min Order Amount (₹) *</Label>
              <Input
                type="number"
                min="0"
                value={values.minOrderAmount}
                onChange={(e) => set("minOrderAmount", e.target.value)}
                style={inputStyle}
                data-ocid="shipping-form-min"
              />
              {errors.minOrderAmount && (
                <p className="text-xs text-red-400">{errors.minOrderAmount}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label style={labelStyle}>Max Order Amount (₹)</Label>
              <Input
                type="number"
                min="0"
                value={values.maxOrderAmount}
                onChange={(e) => set("maxOrderAmount", e.target.value)}
                placeholder="Leave blank = no max"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Costs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label style={labelStyle}>Base Cost (₹) *</Label>
              <Input
                type="number"
                min="0"
                value={values.baseCost}
                onChange={(e) => set("baseCost", e.target.value)}
                placeholder="0 = free"
                style={inputStyle}
                data-ocid="shipping-form-cost"
              />
              {errors.baseCost && (
                <p className="text-xs text-red-400">{errors.baseCost}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label style={labelStyle}>Free Shipping Above (₹)</Label>
              <Input
                type="number"
                min="0"
                value={values.freeShippingAbove}
                onChange={(e) => set("freeShippingAbove", e.target.value)}
                placeholder="Optional threshold"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Delivery days */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label style={labelStyle}>Estimated Days *</Label>
              <Input
                type="number"
                min="1"
                value={values.estimatedDays}
                onChange={(e) => set("estimatedDays", e.target.value)}
                style={inputStyle}
                data-ocid="shipping-form-days"
              />
              {errors.estimatedDays && (
                <p className="text-xs text-red-400">{errors.estimatedDays}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label style={labelStyle}>Max Days (for range)</Label>
              <Input
                type="number"
                min="1"
                value={values.estimatedDaysMax}
                onChange={(e) => set("estimatedDaysMax", e.target.value)}
                placeholder="e.g. 5 for 3–5 days"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Regions */}
          <div className="space-y-1.5">
            <Label style={labelStyle}>Regions (comma-separated)</Label>
            <Input
              value={values.regions}
              onChange={(e) => set("regions", e.target.value)}
              placeholder="All India, Mumbai, Delhi"
              style={inputStyle}
            />
          </div>

          {/* Active toggle */}
          <div
            className="flex items-center justify-between rounded-lg p-3"
            style={{ background: "oklch(0.10 0.03 243 / 0.5)" }}
          >
            <Label
              htmlFor="shipping-form-active"
              style={labelStyle}
              className="cursor-pointer"
            >
              Rule Active
            </Label>
            <Switch
              id="shipping-form-active"
              checked={values.isActive}
              onCheckedChange={(v) => set("isActive", v)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/50 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              data-ocid="shipping-form-submit"
              style={{
                background: saving
                  ? "oklch(0.50 0.10 48 / 0.5)"
                  : "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.65 0.20 38))",
                color: "white",
                border: "none",
                boxShadow: saving
                  ? "none"
                  : "0 0 18px oklch(0.71 0.17 48 / 0.35)",
              }}
            >
              {saving ? "Saving…" : editRule ? "Save Changes" : "Create Rule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminShippingPage() {
  const [rules, setRules] = useState<AdminShippingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRule, setEditRule] = useState<AdminShippingRule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminShippingRule | null>(
    null,
  );
  const [testAmount, setTestAmount] = useState("");

  useEffect(() => {
    const unsub = subscribeToShippingRules((data) => {
      setRules(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const stats = useMemo(() => {
    const active = rules.filter((r) => r.isActive);
    const freeThresholds = active
      .map((r) => r.freeShippingAbove)
      .filter((v): v is number => v !== undefined && v !== null);
    const lowestFree =
      freeThresholds.length > 0 ? Math.min(...freeThresholds) : null;
    return { total: rules.length, active: active.length, lowestFree };
  }, [rules]);

  const calcResult = useMemo(() => {
    const amount = Number.parseFloat(testAmount);
    if (Number.isNaN(amount) || amount < 0) return null;
    return calcShipping(rules, amount);
  }, [testAmount, rules]);

  function openCreate() {
    setEditRule(null);
    setDialogOpen(true);
  }

  function openEdit(rule: AdminShippingRule) {
    setEditRule(rule);
    setDialogOpen(true);
  }

  async function handleToggle(rule: AdminShippingRule) {
    try {
      await updateShippingRule(rule.id, { isActive: !rule.isActive });
      toast.success(`Rule ${rule.isActive ? "deactivated" : "activated"}`);
    } catch {
      toast.error("Failed to update rule");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteShippingRule(deleteTarget.id);
      toast.success("Shipping rule deleted");
    } catch {
      toast.error("Failed to delete rule");
    } finally {
      setDeleteTarget(null);
    }
  }

  const statCards = [
    {
      key: "total",
      label: "Total Rules",
      value: loading ? "—" : String(stats.total),
      icon: <Ruler size={16} />,
      color: "oklch(0.71 0.17 48)",
    },
    {
      key: "active",
      label: "Active Rules",
      value: loading ? "—" : String(stats.active),
      icon: <Zap size={16} />,
      color: "oklch(0.75 0.15 150)",
    },
    {
      key: "free",
      label: "Free Shipping Threshold",
      value: loading
        ? "—"
        : stats.lowestFree !== null
          ? formatAmount(stats.lowestFree)
          : "Not Set",
      icon: <Truck size={16} />,
      color: "oklch(0.72 0.14 195)",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Shipping Settings
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.55 0.04 243)" }}
            >
              Configure shipping cost rules for all orders
            </p>
          </div>
          <Button
            onClick={openCreate}
            data-ocid="shipping-add-btn"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.65 0.20 38))",
              color: "white",
              border: "none",
              boxShadow: "0 0 18px oklch(0.71 0.17 48 / 0.35)",
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Rule
          </Button>
        </div>

        {/* Info card */}
        <div
          className="flex items-start gap-3 rounded-xl p-4"
          style={{
            background: "oklch(0.16 0.06 243 / 0.6)",
            border: "1px solid oklch(0.72 0.14 195 / 0.2)",
          }}
        >
          <Info
            size={16}
            className="mt-0.5 shrink-0"
            style={{ color: "oklch(0.72 0.14 195)" }}
          />
          <p className="text-sm" style={{ color: "oklch(0.65 0.05 243)" }}>
            Define shipping cost rules based on order amount. Rules are matched
            in order from lowest to highest minimum order amount. When no rule
            matches, shipping defaults to free.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background: "oklch(0.13 0.04 243 / 0.7)",
                border: `1px solid ${card.color}33`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${card.color}22`, color: card.color }}
              >
                {card.icon}
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-wide"
                  style={{ color: "oklch(0.45 0.03 243)" }}
                >
                  {card.label}
                </p>
                <p className="text-lg font-bold mt-0.5 text-white">
                  {card.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rules list */}
        <div className="space-y-3">
          <h2
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.50 0.04 243)" }}
          >
            Shipping Rules
          </h2>

          {loading ? (
            <div className="space-y-3">
              {SKELETON_KEYS.map((key) => (
                <div
                  key={key}
                  className="rounded-xl h-36 animate-pulse"
                  style={{ background: "oklch(0.13 0.04 243 / 0.5)" }}
                />
              ))}
            </div>
          ) : rules.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-ocid="shipping-empty-state"
              className="rounded-xl flex flex-col items-center justify-center py-16 text-center"
              style={{
                background: "oklch(0.12 0.04 243 / 0.5)",
                border: "1px dashed oklch(0.28 0.06 243 / 0.5)",
              }}
            >
              <Truck
                size={40}
                className="mb-4"
                style={{ color: "oklch(0.40 0.06 243)" }}
              />
              <h3 className="text-base font-semibold text-white mb-1">
                No shipping rules yet
              </h3>
              <p
                className="text-sm mb-5"
                style={{ color: "oklch(0.50 0.04 243)" }}
              >
                Without rules, all orders default to free shipping.
              </p>
              <Button
                onClick={openCreate}
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.65 0.20 38))",
                  color: "white",
                  border: "none",
                }}
              >
                <Plus size={15} className="mr-2" />
                Add First Rule
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {rules
                .slice()
                .sort((a, b) => a.minOrderAmount - b.minOrderAmount)
                .map((rule) => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    onToggle={handleToggle}
                  />
                ))}
            </AnimatePresence>
          )}
        </div>

        {/* Shipping cost calculator */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-5 space-y-4"
          style={{
            background: "oklch(0.13 0.04 243 / 0.7)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)",
          }}
        >
          <div className="flex items-center gap-2">
            <Calculator size={16} style={{ color: "oklch(0.72 0.14 195)" }} />
            <h2 className="text-sm font-semibold text-white">
              Shipping Cost Calculator
            </h2>
          </div>
          <p className="text-xs" style={{ color: "oklch(0.50 0.04 243)" }}>
            Test which rule applies for a given order amount
          </p>

          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: "oklch(0.60 0.04 243)" }}>
              ₹
            </span>
            <Input
              type="number"
              min="0"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              placeholder="Enter order amount"
              data-ocid="shipping-calc-input"
              className="max-w-[220px]"
              style={{
                background: "oklch(0.10 0.03 250 / 0.8)",
                border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                color: "oklch(0.88 0.04 243)",
              }}
            />
          </div>

          {calcResult && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-4 space-y-2"
              style={{ background: "oklch(0.10 0.03 243 / 0.6)" }}
            >
              {calcResult.rule ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe
                        size={13}
                        style={{ color: "oklch(0.72 0.14 195)" }}
                      />
                      <span className="text-xs text-white font-medium">
                        Matched rule:
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.71 0.17 48)" }}
                      >
                        {calcResult.rule.name}
                      </span>
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color:
                          calcResult.cost === 0
                            ? "oklch(0.75 0.15 150)"
                            : "oklch(0.88 0.10 48)",
                      }}
                    >
                      {calcResult.cost === 0
                        ? "FREE"
                        : formatAmount(calcResult.cost)}
                    </span>
                  </div>
                  <p
                    className="text-[11px]"
                    style={{ color: "oklch(0.50 0.04 243)" }}
                  >
                    Estimated delivery: {getDeliveryTime(calcResult.rule)} •{" "}
                    {calcResult.rule.regions.join(", ")}
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Truck size={14} style={{ color: "oklch(0.75 0.15 150)" }} />
                  <span className="text-xs text-white">
                    No rule matched — defaults to <strong>FREE</strong> shipping
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Create / Edit Dialog */}
      <ShippingFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editRule={editRule}
        onSuccess={() => {}}
      />

      {/* Delete AlertDialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent
          style={{
            background:
              "linear-gradient(135deg, oklch(0.11 0.04 243), oklch(0.09 0.03 250))",
            border: "1px solid oklch(0.22 0.05 243 / 0.5)",
            color: "white",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Shipping Rule?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "oklch(0.55 0.04 243)" }}>
              "{deleteTarget?.name}" will be permanently deleted. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-white/10 text-white/50 hover:text-white hover:bg-white/10"
              style={{ background: "transparent" }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="shipping-delete-confirm"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Delete Rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
