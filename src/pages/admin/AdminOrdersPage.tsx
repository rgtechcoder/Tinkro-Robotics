import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { subscribeToAllOrders, updateOrderStatus } from "@/lib/adminService";
import type { AdminOrder } from "@/types/admin";
import type { OrderStatus } from "@/types/index";
import {
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Eye,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type AllStatus = OrderStatus | "processing" | "all";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(val: AdminOrder["createdAt"]): string {
  if (!val) return "—";
  const d = typeof val === "string" ? new Date(val) : val.toDate();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function truncateId(id: string) {
  return id.length > 12 ? `#${id.slice(0, 8)}…` : `#${id}`;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; icon: React.ReactNode }
> = {
  placed: {
    label: "Placed",
    bg: "oklch(0.35 0.12 243 / 0.3)",
    color: "oklch(0.78 0.12 243)",
    icon: <ShoppingCart size={11} />,
  },
  processing: {
    label: "Processing",
    bg: "oklch(0.40 0.14 72 / 0.3)",
    color: "oklch(0.85 0.14 72)",
    icon: <Package size={11} />,
  },
  shipped: {
    label: "Shipped",
    bg: "oklch(0.35 0.10 195 / 0.3)",
    color: "oklch(0.76 0.13 195)",
    icon: <Truck size={11} />,
  },
  delivered: {
    label: "Delivered",
    bg: "oklch(0.30 0.10 145 / 0.3)",
    color: "oklch(0.72 0.14 145)",
    icon: <CheckCheck size={11} />,
  },
};

const TIMELINE_STEPS: { key: string; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function getStepIndex(status: string) {
  return TIMELINE_STEPS.findIndex((s) => s.key === status);
}

// ─── StatusPill ───────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.placed;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── CopyableId ──────────────────────────────────────────────────────────────

function CopyableId({
  id,
  truncate = false,
}: { id: string; truncate?: boolean }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy"
      className="inline-flex items-center gap-1.5 group cursor-pointer"
      data-ocid="copy-order-id"
    >
      <span
        className="font-mono text-xs"
        style={{ color: "oklch(0.70 0.08 243)" }}
      >
        {truncate ? truncateId(id) : `#${id}`}
      </span>
      {copied ? (
        <Check size={12} className="text-green-400" />
      ) : (
        <ClipboardCopy
          size={12}
          className="opacity-0 group-hover:opacity-60 transition-opacity"
          style={{ color: "oklch(0.70 0.08 243)" }}
        />
      )}
    </button>
  );
}

// ─── SkeletonRow ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {["col1", "col2", "col3", "col4", "col5", "col6", "col7"].map((col) => (
        <td key={col} className="px-4 py-3">
          <Skeleton
            className="h-4 w-full rounded"
            style={{ background: "oklch(0.20 0.03 243 / 0.6)" }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── OrderTimeline ────────────────────────────────────────────────────────────

function OrderTimeline({ status }: { status: string }) {
  const activeIdx = getStepIndex(status);
  return (
    <div className="flex items-center gap-0">
      {TIMELINE_STEPS.map((step, i) => {
        const done = i <= activeIdx;
        const isCurrent = i === activeIdx;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={
                  done
                    ? isCurrent
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                          boxShadow: "0 0 10px oklch(0.71 0.17 48 / 0.5)",
                          color: "white",
                        }
                      : {
                          background: "oklch(0.45 0.10 145 / 0.7)",
                          color: "oklch(0.80 0.14 145)",
                        }
                    : {
                        background: "oklch(0.18 0.03 243)",
                        color: "oklch(0.40 0.04 243)",
                      }
                }
              >
                {done && !isCurrent ? <Check size={13} /> : i + 1}
              </div>
              <span
                className="text-[10px] mt-1 font-medium whitespace-nowrap"
                style={{
                  color: done ? "oklch(0.78 0.06 243)" : "oklch(0.38 0.03 243)",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div
                className="h-0.5 flex-1 mx-1 rounded transition-all"
                style={{
                  background:
                    i < activeIdx
                      ? "oklch(0.45 0.10 145 / 0.5)"
                      : "oklch(0.18 0.03 243)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── OrderDetailDrawer ────────────────────────────────────────────────────────

interface DrawerProps {
  order: AdminOrder | null;
  onClose: () => void;
}

function OrderDetailDrawer({ order, onClose }: DrawerProps) {
  const [newStatus, setNewStatus] = useState<string>("");
  const [trackingId, setTrackingId] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingTracking, setSavingTracking] = useState(false);

  // Reset local state when order changes
  const orderId = order?.id;
  const orderStatus = order?.status ?? "";
  const orderTrackingId = order?.trackingId ?? "";
  const orderEstimatedDelivery = order?.estimatedDelivery ?? "";
  useEffect(() => {
    if (orderId) {
      setNewStatus(orderStatus);
      setTrackingId(orderTrackingId);
      setEstimatedDelivery(orderEstimatedDelivery);
    }
  }, [orderId, orderStatus, orderTrackingId, orderEstimatedDelivery]);

  async function handleStatusUpdate() {
    if (!order || !newStatus) return;
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(
        order.id,
        newStatus as OrderStatus | "processing",
      );
      toast.success("Order status updated successfully");
    } catch {
      toast.error("Failed to update order. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleSaveTracking() {
    if (!order) return;
    setSavingTracking(true);
    try {
      await updateOrderStatus(
        order.id,
        (newStatus || order.status) as OrderStatus | "processing",
        trackingId,
        estimatedDelivery,
      );
      toast.success("Tracking info saved");
    } catch {
      toast.error("Failed to save tracking info. Please try again.");
    } finally {
      setSavingTracking(false);
    }
  }

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Overlay */}
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] flex flex-col overflow-y-auto"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.11 0.04 243) 0%, oklch(0.09 0.03 250) 100%)",
              borderLeft: "1px solid oklch(0.22 0.05 243 / 0.5)",
            }}
            data-ocid="order-detail-drawer"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10"
              style={{
                background: "oklch(0.11 0.04 243 / 0.95)",
                borderColor: "oklch(0.22 0.05 243 / 0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div>
                <h2 className="text-sm font-bold text-white">Order Details</h2>
                <CopyableId id={order.id} />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                data-ocid="drawer-close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 px-5 py-5 space-y-5">
              {/* Order Info */}
              <section
                className="rounded-xl p-4 space-y-2.5"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "oklch(0.55 0.05 243)" }}
                >
                  Order Info
                </h3>
                <InfoRow label="Date" value={formatDate(order.createdAt)} />
                {order.razorpayPaymentId && (
                  <InfoRow
                    label="Payment ID"
                    value={order.razorpayPaymentId}
                    mono
                  />
                )}
                <InfoRow
                  label="Customer"
                  value={order.customerEmail ?? order.userId}
                  mono
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Status</span>
                  <StatusPill status={order.status} />
                </div>
              </section>

              {/* Order Timeline */}
              <section
                className="rounded-xl p-4"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "oklch(0.55 0.05 243)" }}
                >
                  Order Timeline
                </h3>
                <OrderTimeline status={order.status} />
              </section>

              {/* Order Items */}
              <section
                className="rounded-xl p-4"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.55 0.05 243)" }}
                >
                  Items
                </h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 py-1.5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                        style={{
                          border: "1px solid oklch(0.22 0.05 243 / 0.3)",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/assets/images/placeholder.svg";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/80 font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-white/35">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "oklch(0.85 0.12 72)" }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-3 pt-3 space-y-1.5"
                  style={{ borderTop: "1px solid oklch(0.22 0.05 243 / 0.3)" }}
                >
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal ?? order.total)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div
                      className="flex justify-between text-xs"
                      style={{ color: "oklch(0.72 0.14 145)" }}
                    >
                      <span>
                        Discount{order.coupon ? ` (${order.coupon})` : ""}
                      </span>
                      <span>−{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white pt-1">
                    <span>Total</span>
                    <span style={{ color: "oklch(0.85 0.14 72)" }}>
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section
                className="rounded-xl p-4"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5"
                  style={{ color: "oklch(0.55 0.05 243)" }}
                >
                  <MapPin size={11} /> Delivery Address
                </h3>
                {order.address ? (
                  <address className="not-italic text-xs leading-relaxed text-white/60 space-y-0.5">
                    <p className="font-semibold text-white/80">
                      {order.address.name}
                    </p>
                    <p>{order.address.line1}</p>
                    {order.address.line2 && <p>{order.address.line2}</p>}
                    <p>
                      {order.address.city}, {order.address.state} —{" "}
                      {order.address.pincode}
                    </p>
                    <p>📞 {order.address.phone}</p>
                  </address>
                ) : (
                  <p className="text-xs text-white/30">No address on file</p>
                )}
              </section>

              {/* Status Update */}
              <section
                className="rounded-xl p-4 space-y-3"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "oklch(0.55 0.05 243)" }}
                >
                  Update Status
                </h3>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger
                    data-ocid="order-status-select"
                    className="text-sm border-slate-700/50"
                    style={{
                      background: "oklch(0.13 0.03 243 / 0.8)",
                      color: "white",
                    }}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "oklch(0.13 0.03 243)",
                      border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                    }}
                  >
                    {["placed", "processing", "shipped", "delivered"].map(
                      (s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="text-white/80 capitalize"
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  disabled={updatingStatus || newStatus === order.status}
                  onClick={() => void handleStatusUpdate()}
                  data-ocid="update-order-status"
                  className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                    boxShadow: "0 0 12px oklch(0.71 0.17 48 / 0.3)",
                  }}
                >
                  {updatingStatus ? "Updating…" : "Update Status"}
                </button>
              </section>

              {/* Tracking */}
              <section
                className="rounded-xl p-4 space-y-3"
                style={{
                  background: "oklch(0.15 0.03 243 / 0.5)",
                  border: "1px solid oklch(0.22 0.05 243 / 0.3)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "oklch(0.55 0.05 243)" }}
                >
                  Tracking Info
                </h3>
                <div className="space-y-2">
                  <div>
                    <label
                      htmlFor="tracking-id"
                      className="text-[11px] text-white/40 mb-1 block"
                    >
                      Tracking ID
                    </label>
                    <Input
                      id="tracking-id"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter tracking ID"
                      data-ocid="tracking-id-input"
                      className="text-sm border-slate-700/50 text-white placeholder:text-white/20"
                      style={{ background: "oklch(0.13 0.03 243 / 0.8)" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="estimated-delivery"
                      className="text-[11px] text-white/40 mb-1 block"
                    >
                      Estimated Delivery
                    </label>
                    <Input
                      id="estimated-delivery"
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      data-ocid="estimated-delivery-input"
                      className="text-sm border-slate-700/50 text-white"
                      style={{
                        background: "oklch(0.13 0.03 243 / 0.8)",
                        colorScheme: "dark",
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={savingTracking}
                  onClick={() => void handleSaveTracking()}
                  data-ocid="save-tracking-info"
                  className="w-full py-2 rounded-lg text-sm font-semibold text-white/80 border transition-all disabled:opacity-50 hover:text-white"
                  style={{
                    border: "1px solid oklch(0.71 0.17 48 / 0.4)",
                    background: "oklch(0.71 0.17 48 / 0.08)",
                  }}
                >
                  {savingTracking ? "Saving…" : "Save Tracking Info"}
                </button>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-white/40 shrink-0">{label}</span>
      <span
        className={`text-xs text-white/70 text-right truncate ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS: { key: AllStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AllStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [rowStatus, setRowStatus] = useState<Record<string, string>>({});
  const [rowUpdating, setRowUpdating] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time orders
  useEffect(() => {
    const unsub = subscribeToAllOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    setRowStatus((prev) => {
      const next = { ...prev };
      orders.forEach((order) => {
        const current = next[order.id];
        if (!current || current !== order.status) {
          next[order.id] = order.status;
        }
      });
      return next;
    });
  }, [orders]);

  // Count per tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    }
    return counts;
  }, [orders]);

  // Filtered + searched orders — page resets when filter key changes
  const filterKey = `${activeTab}::${search}`;
  const prevFilterKeyRef = useRef(filterKey);
  if (prevFilterKeyRef.current !== filterKey) {
    prevFilterKeyRef.current = filterKey;
    setPage(1);
  }

  const filtered = useMemo(() => {
    let list =
      activeTab === "all"
        ? orders
        : orders.filter((o) => o.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.userId.toLowerCase().includes(q) ||
          (o.customerEmail ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [orders, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = useCallback((tab: AllStatus) => {
    setActiveTab(tab);
  }, []);

  const handleQuickStatusUpdate = useCallback(async (order: AdminOrder) => {
    const nextStatus = rowStatus[order.id] ?? order.status;
    if (nextStatus === order.status) return;
    setRowUpdating(order.id);
    try {
      await updateOrderStatus(order.id, nextStatus as OrderStatus | "processing");
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order. Please try again.");
    } finally {
      setRowUpdating(null);
    }
  }, [rowStatus]);

  return (
    <AdminLayout>
      <div className="space-y-6" data-ocid="admin-orders-page">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-white">
              Orders
            </h1>
            {!loading && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "oklch(0.71 0.17 48 / 0.2)",
                  color: "oklch(0.88 0.12 48)",
                }}
              >
                {orders.length}
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or customer…"
              data-ocid="orders-search"
              className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm border-slate-700/50 text-white placeholder:text-white/20"
              style={{ background: "oklch(0.13 0.03 243 / 0.8)" }}
            />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter orders by status"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = tabCounts[tab.key] ?? 0;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabChange(tab.key)}
                data-ocid={`orders-tab-${tab.key}`}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.25), oklch(0.76 0.16 72 / 0.15))",
                        color: "oklch(0.90 0.12 48)",
                        border: "1px solid oklch(0.71 0.17 48 / 0.4)",
                        boxShadow: "0 0 10px oklch(0.71 0.17 48 / 0.15)",
                      }
                    : {
                        background: "oklch(0.15 0.03 243 / 0.5)",
                        color: "oklch(0.55 0.03 243)",
                        border: "1px solid oklch(0.22 0.05 243 / 0.3)",
                      }
                }
              >
                {tab.label}
                <span
                  className="px-1.5 py-0 rounded-full text-[10px] font-bold"
                  style={
                    isActive
                      ? {
                          background: "oklch(0.71 0.17 48 / 0.3)",
                          color: "oklch(0.92 0.12 48)",
                        }
                      : {
                          background: "oklch(0.20 0.03 243)",
                          color: "oklch(0.45 0.03 243)",
                        }
                  }
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.12 0.03 243 / 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid oklch(0.22 0.05 243 / 0.35)",
                  }}
                >
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                    "Action",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest"
                      style={{ color: "oklch(0.45 0.05 243)" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div
                        className="inline-flex flex-col items-center gap-3"
                        data-ocid="orders-empty-state"
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{ background: "oklch(0.18 0.03 243)" }}
                        >
                          <ShoppingCart
                            size={24}
                            style={{ color: "oklch(0.40 0.05 243)" }}
                          />
                        </div>
                        <p className="text-sm font-semibold text-white/40">
                          {search
                            ? "No orders match your search"
                            : `No ${activeTab === "all" ? "" : activeTab} orders yet`}
                        </p>
                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="text-xs font-medium hover:underline"
                            style={{ color: "oklch(0.71 0.17 48)" }}
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="group transition-colors duration-150 cursor-pointer"
                      style={{
                        borderBottom: "1px solid oklch(0.18 0.03 243 / 0.6)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "oklch(0.15 0.03 243 / 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                      onClick={() => setSelectedOrder(order)}
                      data-ocid={`order-row-${order.id}`}
                    >
                      <td className="px-4 py-3">
                        <CopyableId id={order.id} truncate />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-white/60 truncate max-w-[160px] block">
                          {order.customerEmail ?? order.userId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className="text-[11px] font-medium"
                          style={{
                            background: "oklch(0.20 0.04 243)",
                            color: "oklch(0.65 0.06 243)",
                            border: "1px solid oklch(0.25 0.05 243 / 0.4)",
                          }}
                        >
                          {order.items.reduce((s, it) => s + it.quantity, 0)}{" "}
                          items
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "oklch(0.85 0.14 72)" }}
                        >
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-white/40">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Select
                            value={rowStatus[order.id] ?? order.status}
                            onValueChange={(value) =>
                              setRowStatus((prev) => ({
                                ...prev,
                                [order.id]: value,
                              }))
                            }
                          >
                            <SelectTrigger
                              data-ocid={`order-row-status-${order.id}`}
                              className="h-8 w-[132px] text-xs border-slate-700/50"
                              style={{
                                background: "oklch(0.13 0.03 243 / 0.8)",
                                color: "white",
                              }}
                            >
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent
                              style={{
                                background: "oklch(0.13 0.03 243)",
                                border: "1px solid oklch(0.22 0.05 243 / 0.5)",
                              }}
                            >
                              {[
                                "placed",
                                "processing",
                                "shipped",
                                "delivered",
                              ].map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  className="text-white/80 capitalize"
                                >
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <button
                            type="button"
                            onClick={() => void handleQuickStatusUpdate(order)}
                            disabled={
                              rowUpdating === order.id ||
                              (rowStatus[order.id] ?? order.status) ===
                                order.status
                            }
                            data-ocid={`order-row-update-${order.id}`}
                            className="h-8 px-3 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                              boxShadow: "0 0 10px oklch(0.71 0.17 48 / 0.3)",
                            }}
                          >
                            {rowUpdating === order.id ? "Saving…" : "Update"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg transition-all"
                            style={{ color: "oklch(0.55 0.05 243)" }}
                            aria-label="View order details"
                            data-ocid={`view-order-${order.id}`}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background =
                                "oklch(0.71 0.17 48 / 0.15)";
                              (e.currentTarget as HTMLElement).style.color =
                                "oklch(0.85 0.14 48)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background =
                                "transparent";
                              (e.currentTarget as HTMLElement).style.color =
                                "oklch(0.55 0.05 243)";
                            }}
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderTop: "1px solid oklch(0.18 0.03 243 / 0.6)" }}
            >
              <span className="text-xs text-white/30">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  data-ocid="orders-prev-page"
                  className="h-7 w-7 text-white/40 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      data-ocid={`orders-page-${pageNum}`}
                      className="h-7 w-7 rounded-md text-xs font-medium transition-all"
                      style={
                        page === pageNum
                          ? {
                              background: "oklch(0.71 0.17 48 / 0.25)",
                              color: "oklch(0.90 0.12 48)",
                            }
                          : { color: "oklch(0.50 0.04 243)" }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  data-ocid="orders-next-page"
                  className="h-7 w-7 text-white/40 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </AdminLayout>
  );
}
