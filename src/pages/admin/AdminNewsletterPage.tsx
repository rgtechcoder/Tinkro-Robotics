import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  sendNewsletterEmail,
  subscribeToNewsletterSubscribers,
  subscribeToNewsletterMessages,
  subscribeToNewsletterBroadcasts,
} from "@/lib/adminService";
import type {
  AdminNewsletterBroadcast,
  AdminNewsletterMessage,
  AdminNewsletterSubscriber,
} from "@/types/admin";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CheckCircle2,
  Clipboard,
  Mail,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ sent }: { sent?: boolean }) {
  const config = sent
    ? {
        label: "Sent",
        bg: "oklch(0.55 0.17 145 / 0.15)",
        color: "oklch(0.72 0.17 145)",
        border: "oklch(0.55 0.17 145 / 0.30)",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      }
    : {
        label: "Pending",
        bg: "oklch(0.76 0.17 68 / 0.15)",
        color: "oklch(0.82 0.14 68)",
        border: "oklch(0.76 0.17 68 / 0.30)",
        icon: <XCircle className="h-3.5 w-3.5" />,
      };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<AdminNewsletterSubscriber[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sendOpen, setSendOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendForm, setSendForm] = useState({
    audience: "all",
    subject: "",
    message: "",
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyTarget, setHistoryTarget] = useState<AdminNewsletterSubscriber | null>(null);
  const [historyMessages, setHistoryMessages] = useState<AdminNewsletterMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [allHistoryOpen, setAllHistoryOpen] = useState(false);
  const [allHistoryMessages, setAllHistoryMessages] = useState<AdminNewsletterBroadcast[]>([]);
  const [allHistoryLoading, setAllHistoryLoading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToNewsletterSubscribers((data) => {
      setSubscribers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const stats = useMemo(() => {
    const total = subscribers.length;
    const confirmed = subscribers.filter((s) => s.confirmationSent).length;
    return { total, confirmed, pending: total - confirmed };
  }, [subscribers]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subscribers;
    return subscribers.filter((item) => {
      return (
        item.email?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query) ||
        item.source?.toLowerCase().includes(query)
      );
    });
  }, [subscribers, search]);

  const handleCopyEmails = async () => {
    const emails = filtered
      .map((item) => item.email)
      .filter(Boolean)
      .join(", ");
    if (!emails) {
      toast.error("No emails to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(emails);
      toast.success("Emails copied to clipboard");
    } catch {
      toast.error("Failed to copy emails");
    }
  };

  function handleSendChange(
    key: keyof typeof sendForm,
    value: string,
  ) {
    setSendForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSendEmail() {
    if (!sendForm.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!sendForm.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      const result = await sendNewsletterEmail({
        audience: sendForm.audience as "all" | "confirmed",
        subject: sendForm.subject.trim(),
        message: sendForm.message.trim(),
      });
      toast.success(
        `Email sent to ${result.sent} subscribers${
          result.skipped ? `, skipped ${result.skipped}` : ""
        }`,
      );
      setSendOpen(false);
      setSendForm({ audience: "all", subject: "", message: "" });
    } catch (error) {
      console.error("Newsletter send failed", error);
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (!historyOpen || !historyTarget) return;
    setHistoryLoading(true);
    const unsub = subscribeToNewsletterMessages(historyTarget.id, (data) => {
      setHistoryMessages(data);
      setHistoryLoading(false);
    });
    return () => unsub();
  }, [historyOpen, historyTarget]);

  useEffect(() => {
    if (!allHistoryOpen) return;
    setAllHistoryLoading(true);
    const unsub = subscribeToNewsletterBroadcasts((data) => {
      setAllHistoryMessages(data);
      setAllHistoryLoading(false);
    });
    return () => unsub();
  }, [allHistoryOpen]);

  return (
    <AdminLayout>
      <div className="space-y-8" data-ocid="admin-newsletter-page">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              Newsletter Subscribers
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track all newsletter leads captured from your website
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleCopyEmails}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all"
              style={{
                background: "oklch(0.14 0.03 243 / 0.6)",
                borderColor: "oklch(0.25 0.05 243 / 0.5)",
                color: "oklch(0.85 0.05 243)",
              }}
            >
              <Clipboard className="h-4 w-4" />
              Copy Emails
            </button>
            <Dialog.Root open={sendOpen} onOpenChange={setSendOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(244,123,32,0.25), rgba(245,166,35,0.20))",
                    borderColor: "oklch(0.71 0.17 48 / 0.35)",
                    color: "oklch(0.90 0.10 48)",
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700/40 bg-slate-900/95 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="text-lg font-semibold text-white">
                      Send Newsletter Email
                    </Dialog.Title>
                    <Dialog.Close className="text-slate-400 hover:text-white">
                      ✕
                    </Dialog.Close>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400">Audience</label>
                      <select
                        value={sendForm.audience}
                        onChange={(e) => handleSendChange("audience", e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-950/40 border border-slate-700/40 px-3 py-2 text-sm text-slate-200"
                      >
                        <option value="all">All Subscribers</option>
                        <option value="confirmed">Confirmed Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Subject</label>
                      <input
                        value={sendForm.subject}
                        onChange={(e) => handleSendChange("subject", e.target.value)}
                        placeholder="Subject line"
                        className="mt-1 w-full rounded-lg bg-slate-950/40 border border-slate-700/40 px-3 py-2 text-sm text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Message</label>
                      <textarea
                        value={sendForm.message}
                        onChange={(e) => handleSendChange("message", e.target.value)}
                        placeholder="Write your newsletter message"
                        rows={6}
                        className="mt-1 w-full rounded-lg bg-slate-950/40 border border-slate-700/40 px-3 py-2 text-sm text-slate-200"
                      />
                      <p className="mt-2 text-[11px] text-slate-500">
                        Products + WhatsApp links will be added automatically.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-end gap-2">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm text-slate-300 hover:text-white"
                        disabled={sending}
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      disabled={sending}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#F47B20] hover:opacity-90"
                    >
                      {sending ? "Sending..." : "Send Email"}
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Leads",
              value: stats.total,
              icon: <Users className="h-5 w-5 text-white" />,
              glow: "bg-[#3BBFBF]",
            },
            {
              label: "Confirmed",
              value: stats.confirmed,
              icon: <CheckCircle2 className="h-5 w-5 text-white" />,
              glow: "bg-emerald-500",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: <Mail className="h-5 w-5 text-white" />,
              glow: "bg-[#F47B20]",
            },
            {
              label: "All Sent Mail",
              value: "View",
              icon: <Mail className="h-5 w-5 text-white" />,
              glow: "bg-[#2E6DA4]",
              action: true,
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  {card.label}
                </p>
                {card.action ? (
                  <button
                    type="button"
                    onClick={() => setAllHistoryOpen(true)}
                    className="mt-2 text-sm font-semibold text-[#3BBFBF] hover:text-[#5dd4d4]"
                  >
                    View Messages
                  </button>
                ) : (
                  <p className="text-2xl font-display font-bold text-white mt-1">
                    {card.value}
                  </p>
                )}
              </div>
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center ${card.glow} bg-opacity-20`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/70 flex items-center justify-center">
                <Mail className="h-5 w-5 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Leads Directory
                </p>
                <p className="text-xs text-slate-500">
                  {filtered.length} record{filtered.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or name"
                className="w-full rounded-lg bg-slate-950/40 border border-slate-700/40 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3BBFBF]/40"
              />
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Source</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Messages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={5}>
                      Loading subscribers...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={5}>
                      No subscribers yet.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-200">
                        {item.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        {item.email}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {item.source || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge sent={item.confirmationSent} />
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setHistoryTarget(item);
                            setHistoryOpen(true);
                          }}
                          className="text-xs font-semibold text-[#3BBFBF] hover:text-[#5dd4d4]"
                        >
                          View Messages
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog.Root open={historyOpen} onOpenChange={setHistoryOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700/40 bg-slate-900/95 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-white">
                  Sent Messages
                </Dialog.Title>
                <Dialog.Close className="text-slate-400 hover:text-white">
                  ✕
                </Dialog.Close>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {historyTarget?.email}
              </p>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {historyLoading ? (
                  <div className="text-sm text-slate-500">Loading...</div>
                ) : historyMessages.length === 0 ? (
                  <div className="text-sm text-slate-500">No messages sent yet.</div>
                ) : (
                  historyMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {msg.subject}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {formatDateTime(msg.sentAt)}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">
                          {msg.audience || "all"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300 whitespace-pre-line">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Dialog.Root open={allHistoryOpen} onOpenChange={setAllHistoryOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700/40 bg-slate-900/95 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-white">
                  All Sent Mail
                </Dialog.Title>
                <Dialog.Close className="text-slate-400 hover:text-white">
                  ✕
                </Dialog.Close>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {allHistoryLoading ? (
                  <div className="text-sm text-slate-500">Loading...</div>
                ) : allHistoryMessages.length === 0 ? (
                  <div className="text-sm text-slate-500">No messages sent yet.</div>
                ) : (
                  allHistoryMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {msg.subject}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {formatDateTime(msg.sentAt)} · {msg.audience || "all"}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Sent {msg.sentCount ?? 0} · Skipped {msg.skippedCount ?? 0}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300 whitespace-pre-line">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </AdminLayout>
  );
}
