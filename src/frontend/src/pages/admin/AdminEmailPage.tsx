// import {
//   addEmailTemplate,
//   deleteEmailTemplate,
//   subscribeToEmailTemplates,
//   updateEmailTemplate,
// } from "@/lib/adminService";
import type { AdminEmailTemplate } from "@/types/admin";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "../../components/admin/AdminLayout";

// ─── Types ─────────────────────────────────────────────────────────────────────
type TemplateType = AdminEmailTemplate["type"];

interface FormState {
  type: TemplateType;
  name: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  htmlContent: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  subject?: string;
  htmlContent?: string;
}

interface ApiConfigState {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  saving: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const TEMPLATE_TYPES: {
  type: TemplateType;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
}[] = [
  {
    type: "orderPlaced",
    label: "Order Placed",
    color: "oklch(0.65 0.15 240)",
    bg: "oklch(0.65 0.15 240 / 0.12)",
    border: "oklch(0.65 0.15 240 / 0.25)",
    icon: "📦",
  },
  {
    type: "orderShipped",
    label: "Order Shipped",
    color: "oklch(0.78 0.16 75)",
    bg: "oklch(0.78 0.16 75 / 0.12)",
    border: "oklch(0.78 0.16 75 / 0.25)",
    icon: "🚚",
  },
  {
    type: "orderDelivered",
    label: "Order Delivered",
    color: "oklch(0.72 0.17 155)",
    bg: "oklch(0.72 0.17 155 / 0.12)",
    border: "oklch(0.72 0.17 155 / 0.25)",
    icon: "✅",
  },
  {
    type: "orderCancelled",
    label: "Order Cancelled",
    color: "oklch(0.63 0.20 25)",
    bg: "oklch(0.63 0.20 25 / 0.12)",
    border: "oklch(0.63 0.20 25 / 0.25)",
    icon: "❌",
  },
];

const TEMPLATE_VARIABLES = [
  { key: "{{orderId}}", desc: "Order ID" },
  { key: "{{customerName}}", desc: "Customer name" },
  { key: "{{orderTotal}}", desc: "Total amount" },
  { key: "{{orderDate}}", desc: "Order date" },
  { key: "{{trackingId}}", desc: "Tracking ID" },
  { key: "{{deliveryDate}}", desc: "Delivery date" },
  { key: "{{items}}", desc: "Order items list" },
];

const SKELETON_KEYS = ["sk-email-a", "sk-email-b", "sk-email-c"];

const EMPTY_FORM: FormState = {
  type: "orderPlaced",
  name: "",
  fromName: "Tinkro Robotics",
  fromEmail: "",
  subject: "",
  htmlContent: "",
  isActive: true,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getTypeInfo(type: TemplateType) {
  return TEMPLATE_TYPES.find((t) => t.type === type) ?? TEMPLATE_TYPES[0];
}

function formatDate(val: string | undefined): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return val;
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function AdminEmailPage() {
  const [templates, setTemplates] = useState<AdminEmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminEmailTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEmailTemplate | null>(
    null,
  );
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfigState>({
    apiKey: "",
    fromEmail: "",
    fromName: "Tinkro Robotics",
    saving: false,
  });

  const unsubRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    unsubRef.current = subscribeToEmailTemplates((t) => {
      setTemplates(t);
      setLoading(false);
    });
    return () => unsubRef.current?.();
  }, []);

  // ─── Dialog helpers ──────────────────────────────────────────────────────────
  function openCreate(defaultType?: TemplateType) {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, type: defaultType ?? "orderPlaced" });
    setErrors({});
    setPreviewOpen(false);
    setDialogOpen(true);
  }

  function openEdit(tpl: AdminEmailTemplate) {
    setEditTarget(tpl);
    setForm({
      type: tpl.type,
      name: tpl.name,
      fromName: tpl.fromName ?? "Tinkro Robotics",
      fromEmail: tpl.fromEmail ?? "",
      subject: tpl.subject,
      htmlContent: tpl.htmlContent,
      isActive: tpl.isActive,
    });
    setErrors({});
    setPreviewOpen(false);
    setDialogOpen(true);
  }

  // ─── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Template name is required";
    if (!form.subject.trim()) e.subject = "Subject line is required";
    if (!form.htmlContent.trim()) e.htmlContent = "HTML content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ─── Save ────────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        name: form.name.trim(),
        fromName: form.fromName.trim() || undefined,
        fromEmail: form.fromEmail.trim() || undefined,
        subject: form.subject.trim(),
        htmlContent: form.htmlContent.trim(),
        isActive: form.isActive,
      };
      if (editTarget) {
        await updateEmailTemplate(editTarget.id, payload);
        toast.success("Template updated successfully");
      } else {
        await addEmailTemplate(payload);
        toast.success("Template created successfully");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save template. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ─── Toggle active ────────────────────────────────────────────────────────────
  async function handleToggleActive(tpl: AdminEmailTemplate, value: boolean) {
    try {
      await updateEmailTemplate(tpl.id, { isActive: value });
      toast.success(value ? "Template activated" : "Template deactivated");
    } catch {
      toast.error("Failed to update template status");
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteEmailTemplate(deleteTarget.id);
      toast.success("Template deleted");
    } catch {
      toast.error("Failed to delete template");
    } finally {
      setDeleteTarget(null);
    }
  }

  // ─── Send test (disabled) ─────────────────────────────────────────────────────
  function handleSendTest() {
    toast.info(
      "Email sending is not enabled. Templates will activate when email is turned on.",
    );
  }

  // ─── API Config save ──────────────────────────────────────────────────────────
  async function handleSaveApiConfig() {
    setApiConfig((prev) => ({ ...prev, saving: true }));
    try {
      // Firebase disabled — save to localStorage as temporary stub
      localStorage.setItem(
        "tinkro_email_config",
        JSON.stringify({
          fromEmail: apiConfig.fromEmail,
          fromName: apiConfig.fromName,
          updatedAt: new Date().toISOString(),
        }),
      );
      toast.success("Email configuration saved. Contact support to activate.");
    } catch {
      toast.error("Failed to save email configuration");
    } finally {
      setApiConfig((prev) => ({ ...prev, saving: false }));
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-white">Email Automation</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.04 243)" }}>
            Manage automated email templates for order notifications
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 p-4 rounded-xl border"
          style={{
            background: "oklch(0.65 0.15 240 / 0.10)",
            borderColor: "oklch(0.65 0.15 240 / 0.30)",
          }}
        >
          <span className="text-xl mt-0.5">ℹ️</span>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "oklch(0.80 0.10 240)" }}
            >
              Email automation is ready to activate
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.55 0.05 243)" }}
            >
              Templates are stored and will be sent automatically when email is
              enabled. Contact support to enable email sending.
            </p>
          </div>
        </motion.div>

        {/* Template Type Overview */}
        <div>
          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.50 0.04 243)" }}
          >
            Template Types
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TEMPLATE_TYPES.map((tt, i) => {
              const configured = templates.find((t) => t.type === tt.type);
              const isActive = configured?.isActive ?? false;
              return (
                <motion.div
                  key={tt.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="relative rounded-xl p-4 border flex flex-col gap-3"
                  style={{ background: tt.bg, borderColor: tt.border }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tt.icon}</span>
                    {configured ? (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: isActive
                            ? "oklch(0.72 0.17 155 / 0.20)"
                            : "oklch(0.45 0.05 243 / 0.25)",
                          color: isActive
                            ? "oklch(0.80 0.14 155)"
                            : "oklch(0.50 0.04 243)",
                        }}
                      >
                        {isActive ? "● ACTIVE" : "○ INACTIVE"}
                      </span>
                    ) : (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: "oklch(0.30 0.04 243 / 0.25)",
                          color: "oklch(0.45 0.04 243)",
                        }}
                      >
                        ○ NOT SET
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {tt.label}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "oklch(0.50 0.04 243)" }}
                    >
                      {configured
                        ? `Template: ${configured.name}`
                        : "No template configured"}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`configure-${tt.type}`}
                    onClick={() =>
                      configured ? openEdit(configured) : openCreate(tt.type)
                    }
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90"
                    style={{
                      background: tt.bg,
                      border: `1px solid ${tt.border}`,
                      color: tt.color,
                    }}
                  >
                    {configured ? "Edit Template" : "Configure"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Templates List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: "oklch(0.50 0.04 243)" }}
            >
              Configured Templates
            </h2>
            <button
              type="button"
              data-ocid="email-add-template"
              onClick={() => openCreate()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                color: "oklch(0.10 0.02 250)",
              }}
            >
              + New Template
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {SKELETON_KEYS.map((k) => (
                <div
                  key={k}
                  className="h-16 rounded-xl animate-pulse"
                  style={{ background: "oklch(0.16 0.04 243 / 0.5)" }}
                />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-ocid="email-empty-state"
              className="flex flex-col items-center justify-center py-16 rounded-xl border text-center"
              style={{
                background: "oklch(0.13 0.03 243 / 0.5)",
                borderColor: "oklch(0.22 0.05 243 / 0.3)",
              }}
            >
              <span className="text-4xl mb-3">✉️</span>
              <p className="text-sm font-semibold text-white/60">
                No email templates configured yet
              </p>
              <p
                className="text-xs mt-1 mb-4"
                style={{ color: "oklch(0.45 0.04 243)" }}
              >
                Click Configure on any template type to get started
              </p>
              <button
                type="button"
                onClick={() => openCreate()}
                className="px-4 py-2 rounded-lg text-xs font-semibold"
                style={{
                  background: "oklch(0.71 0.17 48 / 0.15)",
                  border: "1px solid oklch(0.71 0.17 48 / 0.30)",
                  color: "oklch(0.85 0.12 48)",
                }}
              >
                + Create First Template
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {templates.map((tpl) => {
                  const info = getTypeInfo(tpl.type);
                  return (
                    <motion.div
                      key={tpl.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      data-ocid={`email-row-${tpl.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl border"
                      style={{
                        background: "oklch(0.13 0.03 243 / 0.6)",
                        borderColor: "oklch(0.22 0.05 243 / 0.3)",
                      }}
                    >
                      <span className="text-xl shrink-0">{info.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: info.bg,
                              color: info.color,
                              border: `1px solid ${info.border}`,
                            }}
                          >
                            {info.label}
                          </span>
                          <span className="text-sm font-semibold text-white truncate">
                            {tpl.name}
                          </span>
                        </div>
                        <p
                          className="text-xs mt-0.5 truncate"
                          style={{ color: "oklch(0.50 0.04 243)" }}
                        >
                          Subject: {tpl.subject}
                        </p>
                        <p
                          className="text-[10px] mt-0.5"
                          style={{ color: "oklch(0.40 0.03 243)" }}
                        >
                          Updated: {formatDate(tpl.updatedAt ?? tpl.createdAt)}
                        </p>
                      </div>

                      {/* Active toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <label
                          htmlFor={`toggle-${tpl.id}`}
                          className="text-xs"
                          style={{ color: "oklch(0.50 0.04 243)" }}
                        >
                          {tpl.isActive ? "Active" : "Inactive"}
                        </label>
                        <Switch.Root
                          id={`toggle-${tpl.id}`}
                          checked={tpl.isActive}
                          onCheckedChange={(val) =>
                            handleToggleActive(tpl, val)
                          }
                          data-ocid={`email-toggle-${tpl.id}`}
                          className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 outline-none"
                          style={{
                            background: tpl.isActive
                              ? "oklch(0.72 0.17 155 / 0.7)"
                              : "oklch(0.25 0.04 243)",
                          }}
                        >
                          <Switch.Thumb
                            className="block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                            style={{
                              transform: tpl.isActive
                                ? "translateX(18px)"
                                : "translateX(2px)",
                            }}
                          />
                        </Switch.Root>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          data-ocid={`email-test-${tpl.id}`}
                          onClick={handleSendTest}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
                          style={{
                            background: "oklch(0.65 0.15 240 / 0.12)",
                            border: "1px solid oklch(0.65 0.15 240 / 0.25)",
                            color: "oklch(0.70 0.10 240)",
                          }}
                        >
                          Test
                        </button>
                        <button
                          type="button"
                          data-ocid={`email-edit-${tpl.id}`}
                          onClick={() => openEdit(tpl)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
                          style={{
                            background: "oklch(0.71 0.17 48 / 0.12)",
                            border: "1px solid oklch(0.71 0.17 48 / 0.25)",
                            color: "oklch(0.85 0.12 48)",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          data-ocid={`email-delete-${tpl.id}`}
                          onClick={() => setDeleteTarget(tpl)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
                          style={{
                            background: "oklch(0.63 0.20 25 / 0.12)",
                            border: "1px solid oklch(0.63 0.20 25 / 0.25)",
                            color: "oklch(0.75 0.15 25)",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Resend API Config Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border p-5"
          style={{
            background: "oklch(0.13 0.03 243 / 0.6)",
            borderColor: "oklch(0.22 0.05 243 / 0.3)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Resend API Configuration
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.50 0.04 243)" }}
              >
                Resend is the email provider used for automated notifications.
              </p>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{
                background: "oklch(0.63 0.20 25 / 0.12)",
                border: "1px solid oklch(0.63 0.20 25 / 0.25)",
                color: "oklch(0.75 0.15 25)",
              }}
            >
              NOT CONFIGURED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* API Key */}
            <div>
              <label
                htmlFor="cfg-api-key"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "oklch(0.65 0.04 243)" }}
              >
                API Key
              </label>
              <input
                id="cfg-api-key"
                type="password"
                placeholder="sk-resend-xxxx"
                value={apiConfig.apiKey}
                onChange={(e) =>
                  setApiConfig((p) => ({ ...p, apiKey: e.target.value }))
                }
                data-ocid="email-api-key"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-1"
                style={{
                  background: "oklch(0.10 0.03 250)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                  color: "oklch(0.85 0.04 243)",
                }}
              />
            </div>
            {/* From Email */}
            <div>
              <label
                htmlFor="cfg-from-email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "oklch(0.65 0.04 243)" }}
              >
                From Email
              </label>
              <input
                id="cfg-from-email"
                type="email"
                placeholder="orders@tinkro.in"
                value={apiConfig.fromEmail}
                onChange={(e) =>
                  setApiConfig((p) => ({ ...p, fromEmail: e.target.value }))
                }
                data-ocid="email-from-email"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-1"
                style={{
                  background: "oklch(0.10 0.03 250)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                  color: "oklch(0.85 0.04 243)",
                }}
              />
            </div>
            {/* From Name */}
            <div>
              <label
                htmlFor="cfg-from-name"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "oklch(0.65 0.04 243)" }}
              >
                From Name
              </label>
              <input
                id="cfg-from-name"
                type="text"
                placeholder="Tinkro Robotics"
                value={apiConfig.fromName}
                onChange={(e) =>
                  setApiConfig((p) => ({ ...p, fromName: e.target.value }))
                }
                data-ocid="email-from-name"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-1"
                style={{
                  background: "oklch(0.10 0.03 250)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                  color: "oklch(0.85 0.04 243)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: "oklch(0.40 0.03 243)" }}>
              Note: Actual activation requires platform-level email feature
              flag. Contact support to enable.
            </p>
            <button
              type="button"
              data-ocid="email-save-config"
              onClick={handleSaveApiConfig}
              disabled={apiConfig.saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                color: "oklch(0.10 0.02 250)",
              }}
            >
              {apiConfig.saving ? "Saving…" : "Save API Config"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* ─── Create/Edit Dialog ─────────────────────────────────────────────────── */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.2s ease" }}
          />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-describedby="email-dialog-desc"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border"
              style={{
                background: "oklch(0.11 0.04 243)",
                borderColor: "oklch(0.22 0.05 243 / 0.5)",
                boxShadow: "0 25px 60px oklch(0.05 0.03 250 / 0.8)",
              }}
            >
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b"
                style={{
                  borderColor: "oklch(0.20 0.04 243 / 0.5)",
                  background: "oklch(0.11 0.04 243)",
                }}
              >
                <Dialog.Title className="text-lg font-bold text-white">
                  {editTarget ? "Edit Email Template" : "New Email Template"}
                </Dialog.Title>
                <Dialog.Close
                  data-ocid="email-dialog-close"
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  ✕
                </Dialog.Close>
              </div>

              <p id="email-dialog-desc" className="sr-only">
                Create or edit an email template for automated notifications
              </p>

              <div className="px-6 py-5 space-y-5">
                {/* Type + Name row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Template Type */}
                  <div>
                    <p
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "oklch(0.65 0.04 243)" }}
                    >
                      Template Type <span className="text-red-400">*</span>
                    </p>
                    <Select.Root
                      value={form.type}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, type: v as TemplateType }))
                      }
                    >
                      <Select.Trigger
                        data-ocid="email-type-select"
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm outline-none"
                        style={{
                          background: "oklch(0.10 0.03 250)",
                          border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                          color: "oklch(0.85 0.04 243)",
                        }}
                      >
                        <Select.Value />
                        <Select.Icon className="ml-2 text-white/40">
                          ▾
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className="z-[200] rounded-xl border overflow-hidden"
                          style={{
                            background: "oklch(0.13 0.04 243)",
                            borderColor: "oklch(0.22 0.05 243 / 0.5)",
                          }}
                        >
                          <Select.Viewport className="p-1">
                            {TEMPLATE_TYPES.map((tt) => (
                              <Select.Item
                                key={tt.type}
                                value={tt.type}
                                className="px-3 py-2 rounded-lg text-sm cursor-pointer outline-none select-none hover:bg-white/5"
                                style={{ color: "oklch(0.80 0.04 243)" }}
                              >
                                <Select.ItemText>
                                  {tt.icon} {tt.label}
                                </Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  {/* Template Name */}
                  <div>
                    <label
                      htmlFor="tpl-name"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "oklch(0.65 0.04 243)" }}
                    >
                      Template Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="tpl-name"
                      type="text"
                      placeholder="e.g. Order Placed Confirmation"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      data-ocid="email-template-name"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: "oklch(0.10 0.03 250)",
                        border: `1px solid ${errors.name ? "oklch(0.63 0.20 25)" : "oklch(0.22 0.05 243 / 0.5)"}`,
                        color: "oklch(0.85 0.04 243)",
                      }}
                    />
                    {errors.name && (
                      <p className="text-xs mt-1 text-red-400">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* From Name + From Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="tpl-from-name"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "oklch(0.65 0.04 243)" }}
                    >
                      From Name{" "}
                      <span className="text-white/30">(optional)</span>
                    </label>
                    <input
                      id="tpl-from-name"
                      type="text"
                      placeholder="Tinkro Robotics"
                      value={form.fromName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, fromName: e.target.value }))
                      }
                      data-ocid="email-from-name-field"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: "oklch(0.10 0.03 250)",
                        border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                        color: "oklch(0.85 0.04 243)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="tpl-from-email"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "oklch(0.65 0.04 243)" }}
                    >
                      From Email{" "}
                      <span className="text-white/30">(optional)</span>
                    </label>
                    <input
                      id="tpl-from-email"
                      type="email"
                      placeholder="Will use platform default when email is enabled"
                      value={form.fromEmail}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, fromEmail: e.target.value }))
                      }
                      data-ocid="email-from-email-field"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: "oklch(0.10 0.03 250)",
                        border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                        color: "oklch(0.85 0.04 243)",
                      }}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="tpl-subject"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "oklch(0.65 0.04 243)" }}
                  >
                    Subject Line <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="tpl-subject"
                    type="text"
                    placeholder="Your order {{orderId}} has been placed!"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, subject: e.target.value }))
                    }
                    data-ocid="email-subject"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      background: "oklch(0.10 0.03 250)",
                      border: `1px solid ${errors.subject ? "oklch(0.63 0.20 25)" : "oklch(0.22 0.05 243 / 0.5)"}`,
                      color: "oklch(0.85 0.04 243)",
                    }}
                  />
                  {errors.subject && (
                    <p className="text-xs mt-1 text-red-400">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Template Variables Reference */}
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "oklch(0.08 0.03 250)",
                    border: "1px solid oklch(0.18 0.04 243 / 0.5)",
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                    style={{ color: "oklch(0.50 0.04 243)" }}
                  >
                    Available Variables
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TEMPLATE_VARIABLES.map((v) => (
                      <button
                        key={v.key}
                        type="button"
                        title={v.desc}
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            htmlContent: `${p.htmlContent}${v.key}`,
                          }))
                        }
                        className="text-[10px] px-2 py-0.5 rounded font-mono hover:opacity-80 transition-opacity cursor-pointer"
                        style={{
                          background: "oklch(0.65 0.15 240 / 0.12)",
                          border: "1px solid oklch(0.65 0.15 240 / 0.25)",
                          color: "oklch(0.75 0.10 240)",
                        }}
                      >
                        {v.key}
                      </button>
                    ))}
                  </div>
                  <p
                    className="text-[10px] mt-1.5"
                    style={{ color: "oklch(0.40 0.03 243)" }}
                  >
                    Click a variable to insert it into the HTML content
                  </p>
                </div>

                {/* HTML Content */}
                <div>
                  <label
                    htmlFor="tpl-html-content"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "oklch(0.65 0.04 243)" }}
                  >
                    HTML Email Content <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="tpl-html-content"
                    rows={12}
                    placeholder="<!DOCTYPE html>&#10;<html>&#10;<body>&#10;  <h1>Order Confirmed!</h1>&#10;  <p>Hi {{customerName}}, your order {{orderId}} has been placed.</p>&#10;</body>&#10;</html>"
                    value={form.htmlContent}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, htmlContent: e.target.value }))
                    }
                    data-ocid="email-html-content"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y font-mono"
                    style={{
                      background: "oklch(0.08 0.03 250)",
                      border: `1px solid ${errors.htmlContent ? "oklch(0.63 0.20 25)" : "oklch(0.22 0.05 243 / 0.5)"}`,
                      color: "oklch(0.82 0.04 243)",
                      minHeight: "200px",
                    }}
                  />
                  {errors.htmlContent && (
                    <p className="text-xs mt-1 text-red-400">
                      {errors.htmlContent}
                    </p>
                  )}
                </div>

                {/* Preview toggle */}
                {form.htmlContent && (
                  <div>
                    <button
                      type="button"
                      data-ocid="email-toggle-preview"
                      onClick={() => setPreviewOpen((p) => !p)}
                      className="text-xs font-medium hover:opacity-80 transition-opacity"
                      style={{ color: "oklch(0.65 0.15 240)" }}
                    >
                      {previewOpen ? "▲ Hide Preview" : "▼ Show HTML Preview"}
                    </button>
                    <AnimatePresence>
                      {previewOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-2"
                        >
                          <div
                            className="rounded-xl p-4 border overflow-auto"
                            style={{
                              background: "#ffffff",
                              borderColor: "oklch(0.22 0.05 243 / 0.5)",
                              maxHeight: "320px",
                            }}
                          >
                            <iframe
                              srcDoc={form.htmlContent}
                              title="Email preview"
                              className="w-full border-0"
                              style={{ minHeight: "240px" }}
                              sandbox=""
                            />
                          </div>
                          <p
                            className="text-[10px] mt-1"
                            style={{ color: "oklch(0.40 0.03 243)" }}
                          >
                            Preview renders raw HTML. Variables shown as-is (not
                            substituted).
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <Switch.Root
                    id="email-active-toggle"
                    checked={form.isActive}
                    onCheckedChange={(val) =>
                      setForm((p) => ({ ...p, isActive: val }))
                    }
                    data-ocid="email-active-switch"
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 outline-none"
                    style={{
                      background: form.isActive
                        ? "oklch(0.72 0.17 155 / 0.7)"
                        : "oklch(0.25 0.04 243)",
                    }}
                  >
                    <Switch.Thumb
                      className="block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                      style={{
                        transform: form.isActive
                          ? "translateX(18px)"
                          : "translateX(2px)",
                      }}
                    />
                  </Switch.Root>
                  <label
                    htmlFor="email-active-toggle"
                    className="text-sm"
                    style={{ color: "oklch(0.65 0.04 243)" }}
                  >
                    {form.isActive ? "Template Active" : "Template Inactive"}
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div
                className="sticky bottom-0 flex items-center justify-between px-6 pb-6 pt-4 border-t gap-3"
                style={{
                  borderColor: "oklch(0.20 0.04 243 / 0.5)",
                  background: "oklch(0.11 0.04 243)",
                }}
              >
                <button
                  type="button"
                  data-ocid="email-send-test"
                  onClick={handleSendTest}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
                  style={{
                    background: "oklch(0.65 0.15 240 / 0.12)",
                    border: "1px solid oklch(0.65 0.15 240 / 0.25)",
                    color: "oklch(0.70 0.10 240)",
                  }}
                >
                  Send Test
                </button>
                <div className="flex gap-3">
                  <Dialog.Close
                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-all"
                    style={{ color: "oklch(0.55 0.04 243)" }}
                  >
                    Cancel
                  </Dialog.Close>
                  <button
                    type="button"
                    data-ocid="email-save-template"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                      color: "oklch(0.10 0.02 250)",
                    }}
                  >
                    {saving
                      ? "Saving…"
                      : editTarget
                        ? "Update Template"
                        : "Create Template"}
                  </button>
                </div>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ─── Delete Confirm ─────────────────────────────────────────────────────── */}
      <AlertDialog.Root
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <AlertDialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-describedby="email-delete-desc"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-2xl border p-6"
              style={{
                background: "oklch(0.11 0.04 243)",
                borderColor: "oklch(0.63 0.20 25 / 0.4)",
              }}
            >
              <AlertDialog.Title className="text-base font-bold text-white mb-1">
                Delete Template?
              </AlertDialog.Title>
              <AlertDialog.Description
                id="email-delete-desc"
                className="text-sm mb-5"
                style={{ color: "oklch(0.55 0.04 243)" }}
              >
                "{deleteTarget?.name}" will be permanently deleted. This cannot
                be undone.
              </AlertDialog.Description>
              <div className="flex gap-3">
                <AlertDialog.Cancel
                  data-ocid="email-delete-cancel"
                  className="flex-1 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-all"
                  style={{
                    color: "oklch(0.55 0.04 243)",
                    border: "1px solid oklch(0.22 0.05 243 / 0.4)",
                  }}
                >
                  Cancel
                </AlertDialog.Cancel>
                <AlertDialog.Action
                  data-ocid="email-delete-confirm"
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    background: "oklch(0.63 0.20 25)",
                    color: "oklch(0.98 0.01 60)",
                  }}
                >
                  Delete
                </AlertDialog.Action>
              </div>
            </motion.div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </AdminLayout>
  );
}
