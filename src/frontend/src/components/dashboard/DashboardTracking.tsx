import { getUserId } from "@/lib/firebase";
import { subscribeToUserOrders } from "@/lib/orderService";
import type { Order, OrderStatus } from "@/types";
import { CheckCircle, Home, MapPin, Package, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Stage {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  key: string;
}

const STAGES: Stage[] = [
  { label: "Order Placed", icon: CheckCircle, key: "placed" },
  { label: "Processing", icon: Package, key: "processing" },
  { label: "Shipped", icon: Truck, key: "shipped" },
  { label: "Delivered", icon: Home, key: "delivered" },
];

function stageIndex(status: OrderStatus): number {
  switch (status) {
    case "placed":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SkeletonTimeline() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-1/3 bg-white/10 rounded" />
      <div className="flex items-center gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="h-3 w-16 bg-white/10 rounded" />
          </div>
        ))}
      </div>
      <div className="h-4 w-1/2 bg-white/10 rounded" />
    </div>
  );
}

interface TimelineProps {
  order: Order;
}

function OrderTimeline({ order }: TimelineProps) {
  const currentStage = stageIndex(order.status);
  const isDelivered = order.status === "delivered";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-6"
    >
      {/* Order header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-white font-semibold">
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        {isDelivered && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold">
            <CheckCircle size={12} /> Delivered ✓
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10 z-0" />
        <div
          className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-orange-500 to-green-500 z-0 transition-all duration-700"
          style={{
            width: `${Math.min((currentStage / (STAGES.length - 1)) * 100, 100)}%`,
          }}
        />

        <div className="relative z-10 flex justify-between items-start">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isComplete = i < currentStage;
            const isCurrent = i === currentStage;
            const isFuture = i > currentStage;

            return (
              <div
                key={stage.key}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="relative">
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="absolute inset-0 rounded-full bg-orange-500"
                    />
                  )}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isComplete
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                        : isCurrent
                          ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40"
                          : "bg-white/10 text-slate-600"
                    }`}
                  >
                    <Icon size={18} className={isFuture ? "opacity-40" : ""} />
                  </div>
                </div>
                <p
                  className={`text-xs text-center leading-tight font-medium hidden sm:block ${
                    isComplete || isCurrent ? "text-white" : "text-slate-600"
                  }`}
                >
                  {stage.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile stage labels */}
      <div className="sm:hidden">
        {STAGES.map((stage, i) => {
          const isComplete = i < currentStage;
          const isCurrent = i === currentStage;
          return (
            <div
              key={stage.key}
              className={`text-xs ${isComplete || isCurrent ? "text-white" : "text-slate-600"} text-center`}
            >
              {isCurrent ? `▸ ${stage.label}` : stage.label}
            </div>
          );
        })}
      </div>

      {/* Tracking info */}
      <div className="flex flex-wrap gap-6 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-slate-500" />
          <span className="text-slate-500 text-xs">Tracking ID:</span>
          <span className="text-slate-300 text-xs font-mono">
            {order.trackingId ?? "Available after dispatch"}
          </span>
        </div>
        {order.estimatedDelivery && (
          <div className="flex items-center gap-2 text-sm">
            <Truck size={14} className="text-slate-500" />
            <span className="text-slate-500 text-xs">Est. Delivery:</span>
            <span className="text-orange-300 text-xs font-medium">
              {order.estimatedDelivery}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function DashboardTracking() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const userId = getUserId();
    const unsub = subscribeToUserOrders(userId, (data) => {
      const active = data.filter((o) => o.status !== "delivered");
      setOrders(active.length > 0 ? active : data); // fall back to all if none active
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (orders.length > 0 && !selectedId) {
      setSelectedId(orders[0].id);
    }
  }, [orders, selectedId]);

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? orders[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Order Tracking</h1>
        <p className="mt-1 text-sm text-slate-400">
          Live status and delivery updates
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <SkeletonTimeline />
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="tracking-empty-state"
          className="flex flex-col items-center py-16 text-center rounded-2xl bg-white/5 border border-white/10"
        >
          <Truck size={48} className="text-slate-600 mb-4" />
          <p className="text-white font-semibold text-lg">
            No active orders to track
          </p>
          <p className="text-slate-400 text-sm mt-1 mb-5">
            Your shipments will appear here once you place an order.
          </p>
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all"
          >
            Browse Products
          </a>
        </motion.div>
      ) : (
        <>
          {/* Order selector */}
          {orders.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {orders.map((order) => (
                <button
                  type="button"
                  key={order.id}
                  data-ocid={`tracking-select-${order.id}`}
                  onClick={() => setSelectedId(order.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedId === order.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                      : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  #{order.id.slice(-8).toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {selectedOrder && <OrderTimeline order={selectedOrder} />}
        </>
      )}
    </div>
  );
}
