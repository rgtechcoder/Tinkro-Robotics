import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  deleteEnquiry,
  subscribeToEnquiries,
  updateEnquiry,
} from "@/lib/adminService";
import type { AdminEnquiry } from "@/types/admin";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: diffDays > 365 ? "numeric" : undefined,
  });
}

function getPriorityBorderColor(priority: AdminEnquiry["priority"]): string {
  if (priority === "high") return "oklch(0.63 0.23 25)";
  if (priority === "medium") return "oklch(0.76 0.17 68)";
  return "oklch(0.60 0.14 243)";
}

function getPriorityBg(priority: AdminEnquiry["priority"]): string {
  if (priority === "high") return "oklch(0.63 0.23 25 / 0.06)";
  return "transparent";
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

function EnquirySkeleton() {
  return (
    <div className="space-y-3">
      {SKELETON_KEYS.map((key) => (
        <div
          key={key}
          className="rounded-xl border-l-4 animate-pulse"
          style={{
            background: "oklch(0.14 0.03 243 / 0.6)",
            borderColor: "oklch(0.22 0.05 243)",
            borderWidth: "1px",
            borderLeftWidth: "4px",
          }}
        >
          <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 space-y-2">
              <div
                className="h-4 rounded w-48"
                style={{ background: "oklch(0.20 0.04 243)" }}
              />
              <div
                className="h-3 rounded w-32"
                style={{ background: "oklch(0.18 0.03 243)" }}
              />
            </div>
            <div className="flex gap-2">
              <div
                className="h-6 w-20 rounded-full"
                style={{ background: "oklch(0.18 0.03 243)" }}
              />
              <div
                className="h-6 w-16 rounded-full"
                style={{ background: "oklch(0.18 0.03 243)" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AdminEnquiry["status"] }) {
  const config = {
    new: {
      label: "New",
      bg: "oklch(0.50 0.14 243 / 0.18)",
      color: "oklch(0.72 0.14 243)",
      border: "oklch(0.50 0.14 243 / 0.35)",
    },
    contacted: {
      label: "Contacted",
      bg: "oklch(0.76 0.17 68 / 0.15)",
      color: "oklch(0.82 0.14 68)",
      border: "oklch(0.76 0.17 68 / 0.30)",
    },
    closed: {
      label: "Closed",
      bg: "oklch(0.55 0.17 145 / 0.15)",
      color: "oklch(0.72 0.17 145)",
      border: "oklch(0.55 0.17 145 / 0.30)",
    },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {status === "new" && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: config.color }}
        />
      )}
      {config.label}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: AdminEnquiry["priority"] }) {
  const config = {
    high: {
      label: "High",
      bg: "oklch(0.63 0.23 25 / 0.15)",
      color: "oklch(0.75 0.18 25)",
      border: "oklch(0.63 0.23 25 / 0.30)",
    },
    medium: {
      label: "Medium",
      bg: "oklch(0.76 0.17 68 / 0.15)",
      color: "oklch(0.82 0.14 68)",
      border: "oklch(0.76 0.17 68 / 0.30)",
    },
    low: {
      label: "Low",
      bg: "oklch(0.50 0.14 243 / 0.15)",
      color: "oklch(0.70 0.12 243)",
      border: "oklch(0.50 0.14 243 / 0.30)",
    },
  }[priority];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
}

// ─── Lab Type Badge ───────────────────────────────────────────────────────────

function LabTypeBadge({ labType }: { labType: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold"
      style={{
        background: "oklch(0.71 0.17 48 / 0.12)",
        color: "oklch(0.82 0.13 48)",
        border: "1px solid oklch(0.71 0.17 48 / 0.25)",
      }}
    >
      {labType}
    </span>
  );
}

// ─── Select Component ─────────────────────────────────────────────────────────

interface StyledSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function StyledSelect({
  value,
  onChange,
  options,
  placeholder,
}: StyledSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer focus:outline-none"
        style={{
          background: "oklch(0.14 0.03 243 / 0.8)",
          border: "1px solid oklch(0.25 0.05 243 / 0.6)",
          color: "oklch(0.75 0.04 243)",
        }}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={14} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="rounded-xl overflow-hidden z-[200] shadow-2xl"
          style={{
            background: "oklch(0.13 0.04 243)",
            border: "1px solid oklch(0.22 0.05 243 / 0.6)",
          }}
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer focus:outline-none data-[highlighted]:bg-white/5"
                style={{ color: "oklch(0.75 0.04 243)" }}
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// ─── Enquiry Detail Dialog ────────────────────────────────────────────────────

interface DetailDialogProps {
  enquiry: AdminEnquiry;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function EnquiryDetailDialog({
  enquiry,
  onClose,
  onDelete,
}: DetailDialogProps) {
  const [status, setStatus] = useState<AdminEnquiry["status"]>(enquiry.status);
  const [priority, setPriority] = useState<AdminEnquiry["priority"]>(
    enquiry.priority,
  );
  const [notes, setNotes] = useState(enquiry.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updates: Partial<AdminEnquiry> = { status, priority, notes };
      if (
        enquiry.status === "new" &&
        status !== "new" &&
        !enquiry.respondedAt
      ) {
        updates.respondedAt = new Date().toISOString();
      }
      await updateEnquiry(enquiry.id, updates);
      toast.success("Enquiry updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update enquiry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.2s ease" }}
          />
          <Dialog.Content
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ animation: "slideUp 0.25s ease" }}
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{
                background: "oklch(0.11 0.04 243)",
                border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                boxShadow: "0 24px 80px oklch(0.05 0.02 243 / 0.8)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-start justify-between p-5 border-b"
                style={{ borderColor: "oklch(0.20 0.04 243 / 0.6)" }}
              >
                <div>
                  <Dialog.Title
                    className="text-lg font-bold text-white"
                    style={{ color: "oklch(0.92 0.04 243)" }}
                  >
                    {enquiry.name}
                  </Dialog.Title>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: "oklch(0.60 0.04 243)" }}
                  >
                    Received {formatDate(enquiry.createdAt)}
                    {enquiry.respondedAt &&
                      ` · Responded ${formatDate(enquiry.respondedAt)}`}
                  </p>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    style={{ color: "oklch(0.55 0.04 243)" }}
                  >
                    <X size={18} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{ background: "oklch(0.14 0.03 243 / 0.7)" }}
                  >
                    <Mail size={15} style={{ color: "oklch(0.60 0.12 243)" }} />
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-widest font-semibold"
                        style={{ color: "oklch(0.45 0.04 243)" }}
                      >
                        Email
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "oklch(0.82 0.04 243)" }}
                      >
                        {enquiry.email}
                      </p>
                    </div>
                  </div>
                  {enquiry.phone && (
                    <div
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                      style={{ background: "oklch(0.14 0.03 243 / 0.7)" }}
                    >
                      <Phone
                        size={15}
                        style={{ color: "oklch(0.60 0.12 243)" }}
                      />
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-widest font-semibold"
                          style={{ color: "oklch(0.45 0.04 243)" }}
                        >
                          Phone
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "oklch(0.82 0.04 243)" }}
                        >
                          {enquiry.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lab Type + Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <LabTypeBadge labType={enquiry.labType} />
                  <StatusBadge status={status} />
                  <PriorityBadge priority={priority} />
                </div>

                {/* Message */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: "oklch(0.45 0.04 243)" }}
                  >
                    Message
                  </p>
                  <div
                    className="p-4 rounded-xl text-sm leading-relaxed"
                    style={{
                      background: "oklch(0.14 0.03 243 / 0.6)",
                      color: "oklch(0.78 0.04 243)",
                      border: "1px solid oklch(0.22 0.04 243 / 0.4)",
                    }}
                  >
                    {enquiry.message}
                  </div>
                </div>

                {/* Status + Priority selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "oklch(0.45 0.04 243)" }}
                    >
                      Status
                    </p>
                    <StyledSelect
                      value={status}
                      onChange={(v) => setStatus(v as AdminEnquiry["status"])}
                      options={[
                        { value: "new", label: "New" },
                        { value: "contacted", label: "Contacted" },
                        { value: "closed", label: "Closed" },
                      ]}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "oklch(0.45 0.04 243)" }}
                    >
                      Priority
                    </p>
                    <StyledSelect
                      value={priority}
                      onChange={(v) =>
                        setPriority(v as AdminEnquiry["priority"])
                      }
                      options={[
                        { value: "high", label: "High" },
                        { value: "medium", label: "Medium" },
                        { value: "low", label: "Low" },
                      ]}
                    />
                  </div>
                </div>

                {/* Internal Notes */}
                <div>
                  <label
                    htmlFor="enquiry-notes"
                    className="text-xs font-semibold uppercase tracking-widest mb-2 block"
                    style={{ color: "oklch(0.45 0.04 243)" }}
                  >
                    Internal Notes
                  </label>
                  <textarea
                    id="enquiry-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Add internal notes here…"
                    className="w-full rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                    style={{
                      background: "oklch(0.14 0.03 243 / 0.7)",
                      border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                      color: "oklch(0.80 0.04 243)",
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between gap-3 px-5 py-4 border-t"
                style={{ borderColor: "oklch(0.20 0.04 243 / 0.6)" }}
              >
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ color: "oklch(0.65 0.18 25)" }}
                  data-ocid="enquiry-delete-trigger"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
                <div className="flex items-center gap-2">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
                      style={{ color: "oklch(0.55 0.04 243)" }}
                      data-ocid="enquiry-detail-cancel"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                      color: "white",
                      boxShadow: "0 4px 16px oklch(0.71 0.17 48 / 0.35)",
                    }}
                    data-ocid="enquiry-save"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <AlertDialog.Root open={confirmDelete} onOpenChange={setConfirmDelete}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm" />
            <AlertDialog.Content
              className="fixed z-[210] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-2xl p-6"
              style={{
                background: "oklch(0.12 0.04 243)",
                border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                boxShadow: "0 24px 60px oklch(0.05 0.02 243 / 0.8)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.63 0.23 25 / 0.15)" }}
                >
                  <AlertTriangle
                    size={20}
                    style={{ color: "oklch(0.72 0.18 25)" }}
                  />
                </div>
                <AlertDialog.Title
                  className="text-base font-bold"
                  style={{ color: "oklch(0.90 0.04 243)" }}
                >
                  Delete Enquiry?
                </AlertDialog.Title>
              </div>
              <AlertDialog.Description
                className="text-sm mb-5"
                style={{ color: "oklch(0.60 0.04 243)" }}
              >
                This will permanently delete the enquiry from{" "}
                <strong style={{ color: "oklch(0.78 0.04 243)" }}>
                  {enquiry.name}
                </strong>
                . This action cannot be undone.
              </AlertDialog.Description>
              <div className="flex gap-2 justify-end">
                <AlertDialog.Cancel asChild>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                    style={{ color: "oklch(0.55 0.04 243)" }}
                  >
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    type="button"
                    onClick={() => onDelete(enquiry.id)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: "oklch(0.63 0.23 25)",
                      color: "white",
                    }}
                    data-ocid="enquiry-delete-confirm"
                  >
                    Delete
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const LAB_TYPE_OPTIONS = [
  { value: "all", label: "All Lab Types" },
  { value: "ATL Lab", label: "ATL Lab" },
  { value: "STEM Lab", label: "STEM Lab" },
  { value: "PM SHRI", label: "PM SHRI" },
  { value: "Robotics Lab", label: "Robotics Lab" },
  { value: "Custom", label: "Custom" },
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [labTypeFilter, setLabTypeFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(
    null,
  );

  useEffect(() => {
    const unsub = subscribeToEnquiries((data) => {
      setEnquiries(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enquiries.filter((e) => {
      if (
        q &&
        !e.name.toLowerCase().includes(q) &&
        !e.email.toLowerCase().includes(q) &&
        !e.labType.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (priorityFilter !== "all" && e.priority !== priorityFilter)
        return false;
      if (labTypeFilter !== "all" && e.labType !== labTypeFilter) return false;
      return true;
    });
  }, [enquiries, search, statusFilter, priorityFilter, labTypeFilter]);

  const stats = useMemo(
    () => ({
      total: enquiries.length,
      newCount: enquiries.filter((e) => e.status === "new").length,
      contacted: enquiries.filter((e) => e.status === "contacted").length,
      closed: enquiries.filter((e) => e.status === "closed").length,
    }),
    [enquiries],
  );

  async function handleQuickStatus(
    enquiry: AdminEnquiry,
    newStatus: AdminEnquiry["status"],
  ) {
    try {
      const updates: Partial<AdminEnquiry> = { status: newStatus };
      if (enquiry.status === "new" && !enquiry.respondedAt) {
        updates.respondedAt = new Date().toISOString();
      }
      await updateEnquiry(enquiry.id, updates);
      toast.success(`Marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEnquiry(id);
      toast.success("Enquiry deleted");
      setSelectedEnquiry(null);
    } catch {
      toast.error("Failed to delete enquiry");
    }
  }

  const statCards = [
    {
      key: "total",
      label: "Total Enquiries",
      value: stats.total,
      icon: <Inbox size={18} />,
      color: "oklch(0.60 0.14 243)",
      glow: "oklch(0.50 0.14 243 / 0.15)",
    },
    {
      key: "new",
      label: "New / Unread",
      value: stats.newCount,
      icon: <MessageSquare size={18} />,
      color: "oklch(0.72 0.14 243)",
      glow: "oklch(0.50 0.14 243 / 0.12)",
    },
    {
      key: "contacted",
      label: "Contacted",
      value: stats.contacted,
      icon: <Clock size={18} />,
      color: "oklch(0.82 0.14 68)",
      glow: "oklch(0.76 0.17 68 / 0.12)",
    },
    {
      key: "closed",
      label: "Closed",
      value: stats.closed,
      icon: <CheckCircle2 size={18} />,
      color: "oklch(0.72 0.17 145)",
      glow: "oklch(0.55 0.17 145 / 0.12)",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "oklch(0.92 0.06 243)" }}
            >
              Enquiries &amp; Leads
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: "oklch(0.55 0.04 243)" }}
            >
              Manage lab setup enquiries and customer leads
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold self-start sm:self-auto"
            style={{
              background: "oklch(0.71 0.17 48 / 0.12)",
              color: "oklch(0.82 0.13 48)",
              border: "1px solid oklch(0.71 0.17 48 / 0.25)",
            }}
            data-ocid="enquiries-total-badge"
          >
            {stats.total} total
          </span>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {statCards.map((card) => (
            <div
              key={card.key}
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.13 0.04 243 / 0.8)",
                border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                boxShadow: `0 4px 20px ${card.glow}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "oklch(0.45 0.04 243)" }}
                >
                  {card.label}
                </span>
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl p-4"
          style={{
            background: "oklch(0.12 0.04 243 / 0.9)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)",
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "oklch(0.45 0.04 243)" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or lab type…"
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{
                  background: "oklch(0.14 0.03 243 / 0.8)",
                  border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                  color: "oklch(0.78 0.04 243)",
                }}
                data-ocid="enquiries-search"
              />
            </div>

            {/* Status Filter */}
            <StyledSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "new", label: "New" },
                { value: "contacted", label: "Contacted" },
                { value: "closed", label: "Closed" },
              ]}
              placeholder="All Status"
            />

            {/* Priority Filter */}
            <StyledSelect
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: "all", label: "All Priority" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
              placeholder="All Priority"
            />

            {/* Lab Type Filter */}
            <StyledSelect
              value={labTypeFilter}
              onChange={setLabTypeFilter}
              options={LAB_TYPE_OPTIONS}
              placeholder="All Lab Types"
            />
          </div>
        </motion.div>

        {/* Enquiries List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {loading ? (
            <EnquirySkeleton />
          ) : filtered.length === 0 ? (
            /* Empty State */
            <div
              className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
              style={{
                background: "oklch(0.12 0.04 243 / 0.6)",
                border: "1px dashed oklch(0.25 0.05 243 / 0.5)",
              }}
              data-ocid="enquiries-empty"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "oklch(0.50 0.14 243 / 0.12)" }}
              >
                <Inbox size={28} style={{ color: "oklch(0.60 0.12 243)" }} />
              </div>
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: "oklch(0.70 0.04 243)" }}
              >
                {search || statusFilter !== "all" || priorityFilter !== "all"
                  ? "No matching enquiries"
                  : "No enquiries yet"}
              </h3>
              <p className="text-sm" style={{ color: "oklch(0.45 0.04 243)" }}>
                {search || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Lab setup enquiries from the website will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((enquiry, index) => (
                <motion.div
                  key={enquiry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="rounded-xl overflow-hidden group"
                  style={{
                    background: `linear-gradient(90deg, ${getPriorityBg(enquiry.priority)}, oklch(0.13 0.04 243 / 0.7))`,
                    border: "1px solid oklch(0.20 0.04 243 / 0.6)",
                    borderLeft: `4px solid ${getPriorityBorderColor(enquiry.priority)}`,
                  }}
                  data-ocid={`enquiry-row-${enquiry.id}`}
                >
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Left: Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-semibold text-sm"
                            style={{ color: "oklch(0.88 0.04 243)" }}
                          >
                            {enquiry.name}
                          </span>
                          <StatusBadge status={enquiry.status} />
                          <PriorityBadge priority={enquiry.priority} />
                          <LabTypeBadge labType={enquiry.labType} />
                        </div>
                        <div
                          className="flex items-center gap-3 text-xs flex-wrap"
                          style={{ color: "oklch(0.52 0.04 243)" }}
                        >
                          <span className="flex items-center gap-1">
                            <Mail size={11} />
                            {enquiry.email}
                          </span>
                          {enquiry.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={11} />
                              {enquiry.phone}
                            </span>
                          )}
                          <span>{formatDate(enquiry.createdAt)}</span>
                        </div>
                        <p
                          className="text-xs leading-relaxed line-clamp-2"
                          style={{ color: "oklch(0.60 0.04 243)" }}
                        >
                          {enquiry.message.length > 100
                            ? `${enquiry.message.substring(0, 100)}…`
                            : enquiry.message}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                        {enquiry.status === "new" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleQuickStatus(enquiry, "contacted")
                            }
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                            style={{
                              background: "oklch(0.76 0.17 68 / 0.15)",
                              color: "oklch(0.82 0.14 68)",
                              border: "1px solid oklch(0.76 0.17 68 / 0.30)",
                            }}
                            data-ocid={`enquiry-contacted-${enquiry.id}`}
                          >
                            Mark Contacted
                          </button>
                        )}
                        {enquiry.status !== "closed" && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(enquiry, "closed")}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                            style={{
                              background: "oklch(0.55 0.17 145 / 0.12)",
                              color: "oklch(0.72 0.17 145)",
                              border: "1px solid oklch(0.55 0.17 145 / 0.25)",
                            }}
                            data-ocid={`enquiry-close-${enquiry.id}`}
                          >
                            Close
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                          style={{
                            background:
                              "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.20), oklch(0.76 0.16 72 / 0.15))",
                            color: "oklch(0.85 0.12 48)",
                            border: "1px solid oklch(0.71 0.17 48 / 0.30)",
                          }}
                          data-ocid={`enquiry-view-${enquiry.id}`}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Detail Dialog */}
      {selectedEnquiry && (
        <EnquiryDetailDialog
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onDelete={handleDelete}
        />
      )}
    </AdminLayout>
  );
}
