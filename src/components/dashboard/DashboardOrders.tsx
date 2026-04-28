import { products } from "@/data/mockData";
import { generateInvoicePdf } from "@/lib/invoice";
import { subscribeToUserOrders } from "@/lib/orderService";
import type { Order, OrderStatus } from "@/types";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useUserAuth } from "@/context/UserAuthContext";

type Filter = "all" | "recent" | "delivered" | "pending";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "recent", label: "Recent" },
  { key: "delivered", label: "Delivered" },
  { key: "pending", label: "Pending" },
];

const STATUS_PILL: Record<OrderStatus, string> = {
  placed: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  shipped: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  delivered: "bg-green-500/20 text-green-300 border border-green-500/30",
};

function productImage(name: string, image?: string): string {
  if (image) return image;
  const match = products.find((p) =>
    p.name.toLowerCase().includes(name.toLowerCase().split(" ")[0]),
  );
  return match?.image ?? "/assets/brand/product-robot-chassis.jpg";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function filterOrders(orders: Order[], filter: Filter): Order[] {
  switch (filter) {
    case "recent":
      return orders.slice(0, 5);
    case "delivered":
      return orders.filter((o) => o.status === "delivered");
    case "pending":
      return orders.filter(
        (o) => o.status === "placed" || o.status === "shipped",
      );
    default:
      return orders;
  }
}

function SkeletonOrderCard() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 animate-pulse space-y-4">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-white/10 rounded" />
          <div className="h-3 w-1/4 bg-white/10 rounded" />
          <div className="h-3 w-1/2 bg-white/10 rounded" />
        </div>
        <div className="h-6 w-20 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}

function OrderCard({ order, expanded, onToggle }: OrderCardProps) {
  const firstItem = order.items[0];
  const img = firstItem
    ? productImage(firstItem.name, firstItem.image)
    : "/assets/brand/product-robot-chassis.jpg";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-white/5 border transition-colors duration-200 overflow-hidden ${expanded ? "border-orange-500/40" : "border-white/10 hover:border-white/20"}`}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-4 p-5">
        <img
          src={img}
          alt={firstItem?.name ?? "Product"}
          className="w-16 h-16 rounded-xl object-contain bg-white/5 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {firstItem?.name ?? "Order"}
            {order.items.length > 1 && (
              <span className="text-slate-400 font-normal">
                {" "}
                +{order.items.length - 1} more
              </span>
            )}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            #{order.id.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white font-bold">{formatPrice(order.total)}</p>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_PILL[order.status]}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <button
            type="button"
            data-ocid={`order-download-invoice-${order.id}`}
            onClick={() => generateInvoicePdf(order)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs hover:bg-white/20 transition-colors"
          >
            Invoice
          </button>
          <button
            type="button"
            data-ocid={`order-view-details-${order.id}`}
            onClick={onToggle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs hover:bg-white/20 transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Hide" : "Details"}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 py-4 space-y-4">
              {/* Items list */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                  Items
                </p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.name}`}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-slate-300 truncate max-w-[60%]">
                        {item.name}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {item.quantity}x ·{" "}
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery address */}
              {order.address && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-medium">
                    Delivery Address
                  </p>
                  <p className="text-sm text-slate-300">
                    {order.address.name}, {order.address.line1},{" "}
                    {order.address.city} – {order.address.pincode}
                  </p>
                </div>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap gap-6 text-xs text-slate-400">
                {order.razorpayPaymentId && (
                  <div>
                    <span className="text-slate-500">Payment ID: </span>
                    <span className="font-mono">
                      {order.razorpayPaymentId.slice(0, 18)}…
                    </span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <span className="text-slate-500">Est. Delivery: </span>
                    <span>{order.estimatedDelivery}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useUserAuth();

  useEffect(() => {
    if (!user?.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const unsub = subscribeToUserOrders(user.uid, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  const filtered = filterOrders(orders, activeFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="mt-1 text-sm text-slate-400">Your full order history</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.key}
            data-ocid={`orders-filter-${f.key}`}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === f.key
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {loading ? (
          [0, 1, 2].map((i) => <SkeletonOrderCard key={i} />)
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-16 text-center"
            data-ocid="orders-empty-state"
          >
            <Package size={48} className="text-slate-600 mb-4" />
            <p className="text-white font-semibold text-lg">
              No {activeFilter !== "all" ? activeFilter : ""} orders found
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {activeFilter === "all"
                ? "Place your first order to see it here."
                : "Try a different filter."}
            </p>
          </motion.div>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              onToggle={() =>
                setExpandedId(expandedId === order.id ? null : order.id)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
