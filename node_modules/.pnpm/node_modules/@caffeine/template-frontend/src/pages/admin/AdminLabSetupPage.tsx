import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  addLabSetup,
  deleteLabSetup,
  subscribeToLabSetups,
  updateLabSetup,
} from "@/lib/adminService";
import type { AdminLabSetup } from "@/types/admin";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import {
  CheckCircle2,
  FlaskConical,
  Pencil,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// ─── Type Helpers ──────────────────────────────────────────────────────────────

type LabType = AdminLabSetup["type"];

const LAB_TYPE_META: Record<
  LabType,
  { label: string; color: string; bg: string; border: string; glow: string }
> = {
  atl: {
    label: "ATL Lab",
    color: "oklch(0.60 0.15 240)",
    bg: "oklch(0.45 0.12 240 / 0.15)",
    border: "oklch(0.45 0.12 240 / 0.55)",
    glow: "oklch(0.45 0.12 240 / 0.20)",
  },
  pmshri: {
    label: "PM SHRI",
    color: "oklch(0.68 0.14 195)",
    bg: "oklch(0.50 0.13 195 / 0.15)",
    border: "oklch(0.50 0.13 195 / 0.55)",
    glow: "oklch(0.50 0.13 195 / 0.20)",
  },
  stem: {
    label: "STEM Lab",
    color: "oklch(0.72 0.16 48)",
    bg: "oklch(0.71 0.17 48 / 0.15)",
    border: "oklch(0.71 0.17 48 / 0.55)",
    glow: "oklch(0.71 0.17 48 / 0.20)",
  },
  robotics: {
    label: "Robotics",
    color: "oklch(0.62 0.19 295)",
    bg: "oklch(0.50 0.18 295 / 0.15)",
    border: "oklch(0.50 0.18 295 / 0.55)",
    glow: "oklch(0.50 0.18 295 / 0.20)",
  },
};

// ─── Form Types ────────────────────────────────────────────────────────────────

interface LabSetupFormData {
  name: string;
  type: LabType;
  description: string;
  targetAudience: string;
  priceMin: number;
  priceMax: number;
  order: number;
  isActive: boolean;
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: LabType }) {
  const meta = LAB_TYPE_META[type];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
      }}
    >
      {meta.label}
    </span>
  );
}

function ItemChip({
  label,
  onRemove,
}: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: "oklch(0.22 0.04 243 / 0.7)",
        border: "1px solid oklch(0.35 0.05 243 / 0.4)",
        color: "oklch(0.78 0.05 243)",
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-red-400 transition-colors"
        aria-label={`Remove ${label}`}
      >
        <X size={11} />
      </button>
    </span>
  );
}

// ─── Preview Card ──────────────────────────────────────────────────────────────

interface PreviewCardProps {
  name: string;
  type: LabType;
  priceMin: number;
  priceMax: number;
  items: string[];
}

function LabPreviewCard({
  name,
  type,
  priceMin,
  priceMax,
  items,
}: PreviewCardProps) {
  const meta = LAB_TYPE_META[type];
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "oklch(0.14 0.03 243 / 0.6)",
        border: `1px solid ${meta.border}`,
        borderLeft: `4px solid ${meta.color}`,
        boxShadow: `0 0 20px ${meta.glow}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <TypeBadge type={type} />
        <span className="text-[10px] text-white/30 font-mono">Preview</span>
      </div>
      <h4 className="text-sm font-bold text-white mt-2 mb-1">
        {name || "Lab Tier Name"}
      </h4>
      <p
        className="text-base font-bold mb-2"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {priceMin && priceMax
          ? `₹${priceMin.toLocaleString("en-IN")} – ₹${priceMax.toLocaleString("en-IN")}`
          : "₹-- – ₹--"}
      </p>
      {items.length > 0 && (
        <ul className="space-y-0.5 mb-3">
          {items.slice(0, 3).map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-[11px] text-white/55"
            >
              <CheckCircle2 size={10} style={{ color: meta.color }} />
              {item}
            </li>
          ))}
          {items.length > 3 && (
            <li className="text-[11px] text-white/35 pl-4">
              +{items.length - 3} more items
            </li>
          )}
        </ul>
      )}
      <button
        type="button"
        className="w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.7), oklch(0.76 0.16 72 / 0.7))",
          border: "1px solid oklch(0.71 0.17 48 / 0.35)",
        }}
      >
        Get Quote
      </button>
    </div>
  );
}

// ─── Add/Edit Modal ────────────────────────────────────────────────────────────

interface LabModalProps {
  open: boolean;
  onClose: () => void;
  editing: AdminLabSetup | null;
}

function LabSetupModal({ open, onClose, editing }: LabModalProps) {
  const [items, setItems] = useState<string[]>([]);
  const [itemInput, setItemInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const itemInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LabSetupFormData>({
    defaultValues: {
      name: "",
      type: "atl",
      description: "",
      targetAudience: "",
      priceMin: 0,
      priceMax: 0,
      order: 1,
      isActive: true,
    },
  });

  const watchedName = watch("name");
  const watchedType = watch("type");
  const watchedMin = watch("priceMin");
  const watchedMax = watch("priceMax");

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          name: editing.name,
          type: editing.type,
          description: editing.description,
          targetAudience: editing.targetAudience,
          priceMin: editing.priceRange.min,
          priceMax: editing.priceRange.max,
          order: editing.order,
          isActive: editing.isActive,
        });
        setItems([...editing.includedItems]);
        setIsActive(editing.isActive);
      } else {
        reset({
          name: "",
          type: "atl",
          description: "",
          targetAudience: "",
          priceMin: 0,
          priceMax: 0,
          order: 1,
          isActive: true,
        });
        setItems([]);
        setIsActive(true);
      }
      setItemInput("");
    }
  }, [open, editing, reset]);

  function addItem() {
    const trimmed = itemInput.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
      setItemInput("");
      itemInputRef.current?.focus();
    }
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(data: LabSetupFormData) {
    if (items.length < 3) {
      toast.error("Add at least 3 included items.");
      return;
    }
    try {
      const payload = {
        name: data.name,
        type: data.type,
        description: data.description,
        targetAudience: data.targetAudience,
        priceRange: { min: Number(data.priceMin), max: Number(data.priceMax) },
        includedItems: items,
        isActive,
        order: Number(data.order),
      };
      if (editing) {
        await updateLabSetup(editing.id, payload);
        toast.success("Lab tier updated");
      } else {
        await addLabSetup(payload);
        toast.success("Lab tier added successfully");
      }
      onClose();
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  }

  const overlayStyle: React.CSSProperties = {
    background: "oklch(0.05 0.02 243 / 0.80)",
    backdropFilter: "blur(8px)",
  };

  const contentStyle: React.CSSProperties = {
    background:
      "linear-gradient(160deg, oklch(0.13 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
    boxShadow:
      "0 25px 60px oklch(0.04 0.02 243 / 0.9), 0 0 0 1px oklch(0.45 0.12 243 / 0.08)",
  };

  const inputStyle: React.CSSProperties = {
    background: "oklch(0.16 0.03 243 / 0.6)",
    border: "1px solid oklch(0.28 0.05 243 / 0.5)",
    color: "oklch(0.90 0.02 243)",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    width: "100%",
    fontSize: "0.875rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "oklch(0.62 0.05 243)",
    marginBottom: "0.35rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const sectionHeadStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "oklch(0.50 0.08 243)",
    marginBottom: "0.75rem",
    paddingBottom: "0.4rem",
    borderBottom: "1px solid oklch(0.22 0.04 243 / 0.5)",
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={overlayStyle} />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={contentStyle}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
            style={{
              background: "oklch(0.13 0.04 243 / 0.95)",
              borderBottom: "1px solid oklch(0.22 0.05 243 / 0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div>
              <Dialog.Title className="text-base font-bold text-white">
                {editing ? "Edit Lab Tier" : "Add New Lab Tier"}
              </Dialog.Title>
              <p className="text-xs text-white/35 mt-0.5">
                {editing
                  ? `Editing: ${editing.name}`
                  : "Configure a new lab tier for the Labs page"}
              </p>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
              {/* Left: Form Fields */}
              <div className="space-y-5">
                {/* Basic Info */}
                <div>
                  <p style={sectionHeadStyle}>Basic Info</p>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="lab-name" style={labelStyle}>
                        Lab Name *
                      </label>
                      <input
                        id="lab-name"
                        {...register("name", {
                          required: "Lab name is required",
                        })}
                        placeholder="e.g. ATL Lab Setup, STEM Lab - Starter Pack"
                        style={inputStyle}
                        data-ocid="lab-name-input"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lab-type" style={labelStyle}>
                        Lab Type *
                      </label>
                      <select
                        id="lab-type"
                        {...register("type", { required: true })}
                        style={{ ...inputStyle, cursor: "pointer" }}
                        data-ocid="lab-type-select"
                      >
                        <option value="atl">ATL Lab</option>
                        <option value="pmshri">PM SHRI</option>
                        <option value="stem">STEM Lab</option>
                        <option value="robotics">Robotics</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="lab-description" style={labelStyle}>
                        Description
                      </label>
                      <textarea
                        id="lab-description"
                        {...register("description")}
                        rows={3}
                        placeholder="Brief description of this lab tier..."
                        style={{ ...inputStyle, resize: "vertical" }}
                        data-ocid="lab-description-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="lab-audience" style={labelStyle}>
                        Target Audience
                      </label>
                      <input
                        id="lab-audience"
                        {...register("targetAudience")}
                        placeholder="e.g. Schools, ATL Labs, CBSE schools"
                        style={inputStyle}
                        data-ocid="lab-audience-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <p style={sectionHeadStyle}>Pricing</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="lab-price-min" style={labelStyle}>
                        Price Min ₹ *
                      </label>
                      <input
                        id="lab-price-min"
                        type="number"
                        {...register("priceMin", {
                          required: "Required",
                          min: { value: 0, message: "Must be ≥ 0" },
                          valueAsNumber: true,
                        })}
                        placeholder="50000"
                        style={inputStyle}
                        data-ocid="lab-price-min-input"
                      />
                      {errors.priceMin && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.priceMin.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lab-price-max" style={labelStyle}>
                        Price Max ₹ *
                      </label>
                      <input
                        id="lab-price-max"
                        type="number"
                        {...register("priceMax", {
                          required: "Required",
                          validate: (v) =>
                            Number(v) >= Number(watchedMin) ||
                            "Must be ≥ min price",
                          valueAsNumber: true,
                        })}
                        placeholder="150000"
                        style={inputStyle}
                        data-ocid="lab-price-max-input"
                      />
                      {errors.priceMax && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.priceMax.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {watchedMin > 0 && watchedMax >= watchedMin && (
                    <p
                      className="mt-2 text-sm font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ₹{Number(watchedMin).toLocaleString("en-IN")} – ₹
                      {Number(watchedMax).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                {/* Included Items */}
                <div>
                  <p style={sectionHeadStyle}>
                    Included Items{" "}
                    <span className="normal-case font-normal text-white/25 ml-1">
                      (min 3)
                    </span>
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      ref={itemInputRef}
                      value={itemInput}
                      onChange={(e) => setItemInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItem();
                        }
                      }}
                      placeholder="e.g. Arduino Mega 2560"
                      style={{ ...inputStyle, flex: 1 }}
                      data-ocid="lab-item-input"
                    />
                    <button
                      type="button"
                      onClick={addItem}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.45 0.12 243), oklch(0.55 0.13 195))",
                        border: "1px solid oklch(0.45 0.12 243 / 0.4)",
                        whiteSpace: "nowrap",
                      }}
                      data-ocid="lab-add-item-btn"
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                  {items.length === 0 && (
                    <p className="text-xs text-white/30 italic">
                      No items added yet. Add at least 3.
                    </p>
                  )}
                  {items.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <ItemChip
                          key={item}
                          label={item}
                          onRemove={() => removeItem(items.indexOf(item))}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div>
                  <p style={sectionHeadStyle}>Settings</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label htmlFor="lab-order" style={labelStyle}>
                        Display Order
                      </label>
                      <input
                        id="lab-order"
                        type="number"
                        {...register("order", { valueAsNumber: true, min: 1 })}
                        placeholder="1"
                        style={{ ...inputStyle }}
                        data-ocid="lab-order-input"
                      />
                      <p className="text-[11px] text-white/25 mt-1">
                        Lower number = appears first on Labs page
                      </p>
                    </div>
                    <div className="shrink-0">
                      <label htmlFor="lab-active-toggle" style={labelStyle}>
                        Active on Frontend
                      </label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Switch.Root
                          checked={isActive}
                          onCheckedChange={setIsActive}
                          data-ocid="lab-active-toggle"
                          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none"
                          style={{
                            background: isActive
                              ? "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.60 0.16 155))"
                              : "oklch(0.25 0.03 243)",
                          }}
                        >
                          <Switch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 data-[state=checked]:translate-x-5" />
                        </Switch.Root>
                        <span
                          className="text-xs font-semibold"
                          style={{
                            color: isActive
                              ? "oklch(0.72 0.16 145)"
                              : "oklch(0.45 0.03 243)",
                          }}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="space-y-4">
                <p style={sectionHeadStyle}>Frontend Preview</p>
                <LabPreviewCard
                  name={watchedName}
                  type={watchedType}
                  priceMin={Number(watchedMin)}
                  priceMax={Number(watchedMax)}
                  items={items}
                />
                <p className="text-[10px] text-white/25 text-center">
                  This is how the tier will appear on the Labs page
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div
              className="flex items-center justify-end gap-3 px-6 py-4 sticky bottom-0"
              style={{
                background: "oklch(0.11 0.04 243 / 0.95)",
                borderTop: "1px solid oklch(0.22 0.05 243 / 0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                  boxShadow: "0 0 16px oklch(0.71 0.17 48 / 0.35)",
                }}
                data-ocid="lab-save-btn"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                {editing ? "Save Changes" : "Add Lab Tier"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Delete Confirmation ───────────────────────────────────────────────────────

interface DeleteDialogProps {
  open: boolean;
  labName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({
  open,
  labName,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="fixed inset-0 z-50"
          style={{
            background: "oklch(0.05 0.02 243 / 0.75)",
            backdropFilter: "blur(6px)",
          }}
        />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.13 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
            border: "1px solid oklch(0.55 0.22 25 / 0.3)",
            boxShadow: "0 20px 50px oklch(0.04 0.02 243 / 0.9)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
            style={{
              background: "oklch(0.55 0.22 25 / 0.15)",
              border: "1px solid oklch(0.55 0.22 25 / 0.3)",
            }}
          >
            <Trash2 size={18} style={{ color: "oklch(0.68 0.20 25)" }} />
          </div>
          <AlertDialog.Title className="text-base font-bold text-white mb-1.5">
            Delete {labName}?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-white/45 mb-5">
            This will permanently remove it from the Labs page. This action
            cannot be undone.
          </AlertDialog.Description>
          <div className="flex gap-3">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white transition-all"
                style={{
                  background: "oklch(0.18 0.03 243)",
                  border: "1px solid oklch(0.28 0.05 243 / 0.4)",
                }}
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.50 0.22 25), oklch(0.55 0.20 30))",
                }}
                data-ocid="lab-delete-confirm-btn"
              >
                Delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

// ─── Lab Tier Card ─────────────────────────────────────────────────────────────

interface LabCardProps {
  lab: AdminLabSetup;
  index: number;
  onEdit: (lab: AdminLabSetup) => void;
  onDelete: (lab: AdminLabSetup) => void;
  onToggleActive: (lab: AdminLabSetup) => void;
}

function LabCard({
  lab,
  index,
  onEdit,
  onDelete,
  onToggleActive,
}: LabCardProps) {
  const meta = LAB_TYPE_META[lab.type];
  const PREVIEW_COUNT = 4;
  const extraCount = lab.includedItems.length - PREVIEW_COUNT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.14 0.04 243 / 0.85) 0%, oklch(0.11 0.03 250 / 0.90) 100%)",
        border: `1px solid ${meta.border}`,
        borderLeft: `4px solid ${meta.color}`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 8px 30px ${meta.glow}, 0 0 0 1px oklch(0.25 0.05 243 / 0.08)`,
      }}
      data-ocid={`lab-card-${lab.id}`}
    >
      {/* Top: type badge + order */}
      <div className="flex items-start justify-between px-5 pt-4 pb-0">
        <TypeBadge type={lab.type} />
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded"
            style={{
              background: "oklch(0.20 0.03 243)",
              color: "oklch(0.45 0.05 243)",
            }}
          >
            Order #{lab.order}
          </span>
          {/* Active toggle */}
          <Switch.Root
            checked={lab.isActive}
            onCheckedChange={() => onToggleActive(lab)}
            data-ocid={`lab-toggle-${lab.id}`}
            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
            style={{
              background: lab.isActive
                ? "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.60 0.16 155))"
                : "oklch(0.22 0.03 243)",
            }}
          >
            <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 data-[state=checked]:translate-x-4" />
          </Switch.Root>
        </div>
      </div>

      {/* Lab Name */}
      <div className="px-5 pt-3 pb-1">
        <h3 className="text-base font-bold text-white leading-tight truncate">
          {lab.name}
        </h3>
        {lab.targetAudience && (
          <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
            <Tag size={10} className="shrink-0" />
            <span className="truncate">{lab.targetAudience}</span>
          </p>
        )}
      </div>

      {/* Price Range */}
      <div className="px-5 py-2">
        <span
          className="text-xl font-bold tracking-tight"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ₹{lab.priceRange.min.toLocaleString("en-IN")} – ₹
          {lab.priceRange.max.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Description */}
      {lab.description && (
        <p className="px-5 pb-2 text-xs text-white/40 line-clamp-2">
          {lab.description}
        </p>
      )}

      {/* Included Items */}
      <div className="px-5 pb-3">
        <p
          className="text-[10px] font-semibold uppercase tracking-wider mb-2"
          style={{ color: "oklch(0.48 0.06 243)" }}
        >
          Included Items ({lab.includedItems.length})
        </p>
        <ul className="space-y-1">
          {lab.includedItems.slice(0, PREVIEW_COUNT).map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-xs text-white/55"
            >
              <CheckCircle2
                size={11}
                style={{ color: meta.color, flexShrink: 0 }}
              />
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
        {extraCount > 0 && (
          <p className="text-[11px] text-white/30 mt-1 pl-5">
            +{extraCount} more
          </p>
        )}
      </div>

      {/* Divider + Actions */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid oklch(0.22 0.04 243 / 0.5)" }}
      >
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={
            lab.isActive
              ? {
                  background: "oklch(0.55 0.18 145 / 0.15)",
                  color: "oklch(0.70 0.16 145)",
                  border: "1px solid oklch(0.55 0.18 145 / 0.3)",
                }
              : {
                  background: "oklch(0.22 0.03 243 / 0.5)",
                  color: "oklch(0.45 0.03 243)",
                  border: "1px solid oklch(0.30 0.04 243 / 0.4)",
                }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: lab.isActive
                ? "oklch(0.65 0.18 145)"
                : "oklch(0.35 0.03 243)",
            }}
          />
          {lab.isActive ? "Active" : "Inactive"}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(lab)}
            className="p-2 rounded-lg transition-all"
            style={{ color: "oklch(0.55 0.05 243)", background: "transparent" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.71 0.17 48 / 0.12)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.80 0.14 48)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.55 0.05 243)";
            }}
            aria-label={`Edit ${lab.name}`}
            data-ocid={`lab-edit-${lab.id}`}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(lab)}
            className="p-2 rounded-lg transition-all"
            style={{ color: "oklch(0.55 0.05 243)", background: "transparent" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.55 0.22 25 / 0.12)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.68 0.20 25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.55 0.05 243)";
            }}
            aria-label={`Delete ${lab.name}`}
            data-ocid={`lab-delete-${lab.id}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="col-span-2 rounded-2xl p-16 flex flex-col items-center justify-center text-center"
      style={{
        background: "oklch(0.12 0.03 243 / 0.5)",
        border: "1px dashed oklch(0.28 0.05 243 / 0.5)",
      }}
      data-ocid="lab-empty-state"
    >
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "oklch(0.20 0.04 243 / 0.6)",
          border: "1px solid oklch(0.30 0.05 243 / 0.4)",
        }}
      >
        <FlaskConical
          className="h-8 w-8"
          style={{ color: "oklch(0.55 0.10 243)" }}
        />
      </div>
      <h3 className="text-base font-bold text-white mb-2">No Lab Tiers Yet</h3>
      <p className="text-sm text-white/40 max-w-xs mb-5">
        Add your first lab tier to start showcasing lab packages on the Labs
        page.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
          boxShadow: "0 0 20px oklch(0.71 0.17 48 / 0.30)",
        }}
        data-ocid="lab-empty-add-btn"
      >
        <Plus size={16} />
        Add First Lab Tier
      </button>
    </motion.div>
  );
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────────

function LabCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{
        background: "oklch(0.13 0.03 243 / 0.6)",
        border: "1px solid oklch(0.22 0.04 243 / 0.5)",
        borderLeft: "4px solid oklch(0.22 0.04 243 / 0.5)",
      }}
    >
      <div className="px-5 pt-4 pb-2 flex justify-between">
        <div
          className="h-5 w-20 rounded-full"
          style={{ background: "oklch(0.22 0.04 243)" }}
        />
        <div
          className="h-5 w-16 rounded"
          style={{ background: "oklch(0.22 0.04 243)" }}
        />
      </div>
      <div className="px-5 py-2 space-y-2">
        <div
          className="h-5 w-3/4 rounded"
          style={{ background: "oklch(0.20 0.03 243)" }}
        />
        <div
          className="h-4 w-1/2 rounded"
          style={{ background: "oklch(0.18 0.03 243)" }}
        />
        <div
          className="h-7 w-40 rounded"
          style={{ background: "oklch(0.20 0.03 243)" }}
        />
      </div>
      <div className="px-5 py-3 space-y-1.5">
        {(["70%", "60%", "50%"] as const).map((w) => (
          <div
            key={w}
            className="h-3.5 rounded"
            style={{
              background: "oklch(0.18 0.03 243)",
              width: w,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminLabSetupPage() {
  const [labs, setLabs] = useState<AdminLabSetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<AdminLabSetup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminLabSetup | null>(null);

  useEffect(() => {
    const unsub = subscribeToLabSetups((data) => {
      setLabs(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  function handleAdd() {
    setEditingLab(null);
    setModalOpen(true);
  }

  function handleEdit(lab: AdminLabSetup) {
    setEditingLab(lab);
    setModalOpen(true);
  }

  function handleDelete(lab: AdminLabSetup) {
    setDeleteTarget(lab);
  }

  async function handleToggleActive(lab: AdminLabSetup) {
    try {
      await updateLabSetup(lab.id, { isActive: !lab.isActive });
    } catch {
      toast.error("Failed to update status.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteLabSetup(deleteTarget.id);
      toast.success("Lab tier deleted");
    } catch {
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  }

  const activeCount = labs.filter((l) => l.isActive).length;

  return (
    <AdminLayout>
      <div className="space-y-6" data-ocid="admin-lab-setup-page">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: "oklch(0.45 0.12 243 / 0.15)",
                  border: "1px solid oklch(0.45 0.12 243 / 0.3)",
                }}
              >
                <FlaskConical
                  size={18}
                  style={{ color: "oklch(0.68 0.12 243)" }}
                />
              </div>
              <h1 className="text-2xl font-display font-bold text-white">
                Lab Setup Management
              </h1>
            </div>
            <p className="text-sm text-white/40 ml-0.5">
              Manage lab tier configurations shown on the Labs page
              {!loading && labs.length > 0 && (
                <span
                  className="ml-2 font-medium"
                  style={{ color: "oklch(0.65 0.10 195)" }}
                >
                  · {labs.length} tiers, {activeCount} active
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
              boxShadow: "0 0 20px oklch(0.71 0.17 48 / 0.30)",
              border: "1px solid oklch(0.71 0.17 48 / 0.35)",
            }}
            data-ocid="lab-add-btn"
          >
            <Plus size={16} />
            Add Lab Tier
          </button>
        </motion.div>

        {/* Stats Row */}
        {!loading && labs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {(["atl", "pmshri", "stem", "robotics"] as LabType[]).map(
              (type) => {
                const count = labs.filter((l) => l.type === type).length;
                const meta = LAB_TYPE_META[type];
                return (
                  <div
                    key={type}
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "oklch(0.13 0.03 243 / 0.7)",
                      border: `1px solid ${meta.border}`,
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </p>
                    <p className="text-xl font-bold text-white">{count}</p>
                    <p className="text-[11px] text-white/30">
                      {count === 1 ? "tier" : "tiers"}
                    </p>
                  </div>
                );
              },
            )}
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {loading ? (
              <>
                {["sk1", "sk2", "sk3", "sk4"].map((sk) => (
                  <LabCardSkeleton key={sk} />
                ))}
              </>
            ) : labs.length === 0 ? (
              <EmptyState onAdd={handleAdd} />
            ) : (
              labs.map((lab, idx) => (
                <LabCard
                  key={lab.id}
                  lab={lab}
                  index={idx}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <LabSetupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editingLab}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        open={!!deleteTarget}
        labName={deleteTarget?.name ?? ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
