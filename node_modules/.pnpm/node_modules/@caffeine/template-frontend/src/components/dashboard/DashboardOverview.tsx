import { getUserId } from "@/lib/firebase";
import { subscribeToUserOrders } from "@/lib/orderService";
import type { Order } from "@/types";
import { ArrowRight, MapPin, ShoppingBag, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  placed: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  shipped: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  delivered: "bg-green-500/20 text-green-300 border border-green-500/30",
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 animate-pulse space-y-3 bg-white/5 border border-white/10">
      <div className="h-10 w-10 rounded-xl bg-white/10" />
      <div className="h-4 w-1/2 rounded-full bg-white/10" />
      <div className="h-7 w-1/3 rounded-full bg-white/10" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 animate-pulse">
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="h-4 w-20 rounded bg-white/10" />
      <div className="h-4 w-16 rounded bg-white/10 ml-auto" />
      <div className="h-6 w-16 rounded-full bg-white/10" />
    </div>
  );
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

interface Props {
  addressCount?: number;
  onNavigate?: (section: string) => void;
}

export function DashboardOverview({ addressCount = 0, onNavigate }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    const unsub = subscribeToUserOrders(userId, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const recentOrder = orders[0];
  const recentOrders = orders.slice(0, 3);

  const cards = [
    {
      label: "Total Orders",
      value: loading ? "—" : String(orders.length),
      icon: ShoppingBag,
      gradient: "from-blue-600/30 to-blue-800/10",
      glow: "shadow-blue-500/10",
      iconColor: "text-blue-400",
      section: "orders",
    },
    {
      label: "Recent Order",
      value: loading
        ? "—"
        : recentOrder
          ? recentOrder.status.charAt(0).toUpperCase() +
            recentOrder.status.slice(1)
          : "No orders",
      icon: Truck,
      gradient: "from-orange-600/30 to-orange-800/10",
      glow: "shadow-orange-500/10",
      iconColor: "text-orange-400",
      section: "tracking",
    },
    {
      label: "Saved Addresses",
      value: loading ? "—" : String(addressCount),
      icon: MapPin,
      gradient: "from-teal-600/30 to-teal-800/10",
      glow: "shadow-teal-500/10",
      iconColor: "text-teal-400",
      section: "addresses",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back 👋</h1>
        <p className="mt-1 text-sm text-slate-400">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading
          ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
          : cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.label}
                  data-ocid={`overview-card-${card.section}`}
                  onClick={() => onNavigate?.(card.section)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`w-full text-left rounded-2xl p-5 bg-gradient-to-br ${card.gradient} border border-white/10 backdrop-blur-sm shadow-lg ${card.glow} transition-all duration-200 cursor-pointer`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 mb-3 ${card.iconColor}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                </motion.button>
              );
            })}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-base font-semibold text-white">Recent Orders</h2>
          {orders.length > 0 && (
            <button
              type="button"
              data-ocid="overview-view-all-orders"
              onClick={() => onNavigate?.("orders")}
              className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              View All <ArrowRight size={12} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="px-5 divide-y divide-white/5">
            {[0, 1, 2].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center py-14 px-6 text-center">
            <span className="text-5xl mb-4">🛒</span>
            <p className="text-white font-semibold text-lg">
              No orders yet. Start shopping!
            </p>
            <p className="text-slate-400 text-sm mt-1 mb-5">
              Your order history will appear here once you place your first
              order.
            </p>
            <a
              href="/products"
              data-ocid="overview-browse-products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all"
            >
              Browse Products <ArrowRight size={14} />
            </a>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-white/5 transition-colors"
              >
                <span className="text-xs font-mono text-slate-300">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(order.createdAt)}
                </span>
                <span className="text-sm font-semibold text-white ml-auto">
                  {formatPrice(order.total)}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-white/10 text-white"}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
