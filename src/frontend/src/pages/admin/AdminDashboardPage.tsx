import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  subscribeToAllOrders,
  subscribeToCategories,
  subscribeToProducts,
} from "@/lib/adminService";
import type { AdminCategory, AdminOrder, AdminProduct } from "@/types/admin";

// Firebase Timestamp stub — Firebase is disabled temporarily
interface Timestamp {
  toDate(): Date;
  toMillis(): number;
}
import {
  ArrowRight,
  Clock,
  IndianRupee,
  Package,
  ShoppingCart,
  Tag,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OrderStatus = "placed" | "processing" | "shipped" | "delivered";

interface DayData {
  date: string;
  dateKey: string;
  revenue: number;
  orders: number;
  users: number;
}

function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 29 + i);
    return d.toISOString().split("T")[0];
  });
}

function formatDateKey(ts: { toDate(): Date } | string): string {
  if (typeof ts === "string") return ts.split("T")[0];
  return ts.toDate().toISOString().split("T")[0];
}

function formatLabel(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00`);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "placed":
      return { bg: "bg-blue-500/20", text: "text-blue-300" };
    case "processing":
      return { bg: "bg-amber-500/20", text: "text-amber-300" };
    case "shipped":
      return { bg: "bg-teal-500/20", text: "text-teal-300" };
    case "delivered":
      return { bg: "bg-emerald-500/20", text: "text-emerald-300" };
    default:
      return { bg: "bg-slate-500/20", text: "text-slate-300" };
  }
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 rounded bg-slate-700/60" />
        <div className="h-10 w-10 rounded-xl bg-slate-700/60" />
      </div>
      <div className="h-8 w-32 rounded bg-slate-700/60 mb-2" />
      <div className="h-3 w-20 rounded bg-slate-700/40" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-slate-700/40 animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  gradient: string;
  glowClass: string;
  delay: number;
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  gradient,
  glowClass,
  delay,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="relative rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl p-6 overflow-hidden hover:border-slate-600/60 transition-smooth"
      data-ocid="dashboard-summary-card"
    >
      <div
        className={`absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-20 ${gradient}`}
      />
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${gradient} ${glowClass} bg-opacity-20`}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-display font-bold text-white tracking-tight">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </motion.div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
  isCurrency?: boolean;
}

function ChartTooltip({
  active,
  payload,
  label,
  isCurrency,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-600/50 bg-slate-800/90 backdrop-blur-sm px-3 py-2 shadow-lg">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        {isCurrency
          ? formatCurrency(payload[0].value)
          : payload[0].value.toString()}
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    return subscribeToAllOrders((data) => {
      setOrders(data);
      setLoadingOrders(false);
    });
  }, []);

  useEffect(() => {
    return subscribeToProducts((data) => {
      setProducts(data);
      setLoadingProducts(false);
    });
  }, []);

  useEffect(() => {
    return subscribeToCategories((data) => {
      setCategories(data);
      setLoadingCategories(false);
    });
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total ?? 0), 0),
    [orders],
  );

  const chartData = useMemo<DayData[]>(() => {
    const days = getLast30Days();
    const revenueMap: Record<string, number> = {};
    const ordersMap: Record<string, number> = {};
    const usersByDay: Record<string, Set<string>> = {};

    for (const d of days) {
      revenueMap[d] = 0;
      ordersMap[d] = 0;
      usersByDay[d] = new Set();
    }

    for (const o of orders) {
      const key = formatDateKey(o.createdAt);
      if (revenueMap[key] !== undefined) {
        revenueMap[key] += o.total ?? 0;
        ordersMap[key] += 1;
        if (o.userId) usersByDay[key].add(o.userId);
      }
    }

    let cumUsers = 0;
    const seenUsers = new Set<string>();
    return days.map((key) => {
      for (const uid of usersByDay[key]) seenUsers.add(uid);
      cumUsers = seenUsers.size;
      return {
        date: formatLabel(key),
        dateKey: key,
        revenue: Math.round(revenueMap[key]),
        orders: ordersMap[key],
        users: cumUsers,
      };
    });
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const ta =
          typeof a.createdAt === "string"
            ? new Date(a.createdAt).getTime()
            : (a.createdAt as Timestamp).toMillis();
        const tb =
          typeof b.createdAt === "string"
            ? new Date(b.createdAt).getTime()
            : (b.createdAt as Timestamp).toMillis();
        return tb - ta;
      })
      .slice(0, 5);
  }, [orders]);

  const isLoading = loadingOrders || loadingProducts || loadingCategories;
  const tickFormatter = (val: string, idx: number) =>
    idx % 5 === 0 ? val : "";

  return (
    <AdminLayout>
      <div className="space-y-8" data-ocid="admin-dashboard-page">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-display font-bold text-white">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back — here's what's happening with Tinkro today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <SummaryCard
                delay={0}
                label="Total Orders"
                value={orders.length.toLocaleString("en-IN")}
                sub={
                  orders.length === 0
                    ? "No orders yet"
                    : `${recentOrders.length} recent`
                }
                icon={<ShoppingCart className="h-5 w-5 text-white" />}
                gradient="bg-[#F47B20]"
                glowClass="shadow-glow-orange"
              />
              <SummaryCard
                delay={0.08}
                label="Total Revenue"
                value={formatCurrency(totalRevenue)}
                sub={orders.length > 0 ? "From all orders" : "No revenue yet"}
                icon={<IndianRupee className="h-5 w-5 text-white" />}
                gradient="bg-emerald-500"
                glowClass=""
              />
              <SummaryCard
                delay={0.16}
                label="Total Products"
                value={products.length.toLocaleString("en-IN")}
                sub={
                  products.length === 0
                    ? "Add your first product"
                    : "In catalog"
                }
                icon={<Package className="h-5 w-5 text-white" />}
                gradient="bg-[#3BBFBF]"
                glowClass="shadow-glow-accent"
              />
              <SummaryCard
                delay={0.24}
                label="Total Categories"
                value={categories.length.toLocaleString("en-IN")}
                sub={
                  categories.length === 0
                    ? "Add your first category"
                    : "Active categories"
                }
                icon={<Tag className="h-5 w-5 text-white" />}
                gradient="bg-[#2E6DA4]"
                glowClass="shadow-glow-primary"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl p-6"
            data-ocid="chart-revenue"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-4 w-4 text-[#F47B20]" />
              <h2 className="text-sm font-semibold text-white">
                Revenue Trends
              </h2>
              <span className="ml-auto text-xs text-slate-500">
                Last 30 days
              </span>
            </div>
            {loadingOrders ? (
              <div className="h-[280px] rounded-xl bg-slate-700/30 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#F47B20" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F47B20" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={tickFormatter}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                    width={48}
                  />
                  <Tooltip
                    content={<ChartTooltip isCurrency />}
                    cursor={{
                      stroke: "#F47B20",
                      strokeWidth: 1,
                      strokeOpacity: 0.4,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F47B20"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#F47B20",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl p-6"
            data-ocid="chart-orders"
          >
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="h-4 w-4 text-[#3BBFBF]" />
              <h2 className="text-sm font-semibold text-white">
                Orders Overview
              </h2>
              <span className="ml-auto text-xs text-slate-500">
                Last 30 days
              </span>
            </div>
            {loadingOrders ? (
              <div className="h-[280px] rounded-xl bg-slate-700/30 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} barSize={6}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={tickFormatter}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={28}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "#3BBFBF", fillOpacity: 0.08 }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#3BBFBF"
                    radius={[4, 4, 0, 0]}
                    opacity={0.85}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl p-6"
            data-ocid="chart-users"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-4 w-4 text-[#2E6DA4]" />
              <h2 className="text-sm font-semibold text-white">User Growth</h2>
              <span className="ml-auto text-xs text-slate-500">Cumulative</span>
            </div>
            {loadingOrders ? (
              <div className="h-[280px] rounded-xl bg-slate-700/30 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={tickFormatter}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={28}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{
                      stroke: "#2E6DA4",
                      strokeWidth: 1,
                      strokeOpacity: 0.4,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#2E6DA4"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#2E6DA4",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-xl overflow-hidden"
          data-ocid="recent-orders-widget"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/40">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white">
                Recent Orders
              </h2>
            </div>
            <a
              href="/admin/orders"
              className="flex items-center gap-1 text-xs text-[#3BBFBF] hover:text-[#5dd4d4] transition-colors"
              data-ocid="view-all-orders-link"
            >
              View All <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          {loadingOrders ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </tbody>
              </table>
            </div>
          ) : recentOrders.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
              data-ocid="empty-state-orders"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/60 border border-slate-700/40">
                <ShoppingCart className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                No orders yet
              </h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Orders will appear here once customers start buying from the
                store.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-medium">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left font-medium">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-right font-medium">Total</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {recentOrders.map((order, i) => {
                    const status = order.status as OrderStatus;
                    const { bg, text } = getStatusColor(status);
                    const dateStr =
                      typeof order.createdAt === "string"
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short" },
                          )
                        : (order.createdAt as Timestamp)
                            .toDate()
                            .toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            });
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 * i }}
                        className="hover:bg-slate-800/40 transition-colors"
                        data-ocid={`order-row-${i}`}
                      >
                        <td className="px-6 py-4 font-mono text-xs text-slate-300">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-slate-300 truncate max-w-[120px]">
                          {order.customerEmail
                            ? order.customerEmail.split("@")[0]
                            : (order.userId?.slice(0, 10) ?? "—")}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-white tabular-nums">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${bg} ${text}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                          {dateStr}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
