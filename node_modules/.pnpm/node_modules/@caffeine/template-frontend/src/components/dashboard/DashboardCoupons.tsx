import { getUserId } from "@/lib/firebase";
import { subscribeToUserOrders } from "@/lib/orderService";
import type { Order } from "@/types";
import { Check, Copy, Tag, Ticket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface CouponDef {
  code: string;
  title: string;
  description: string;
  discountLabel: string;
  minOrder: string;
  validUntil: string;
  gradient: string;
  accentColor: string;
  borderColor: string;
}

const AVAILABLE_COUPONS: CouponDef[] = [
  {
    code: "TINKRO10",
    title: "10% Off Everything",
    description: "Flat 10% off on all orders. No category restrictions.",
    discountLabel: "10% OFF",
    minOrder: "₹500",
    validUntil: "31 Dec 2025",
    gradient: "from-blue-600/20 to-blue-800/10",
    accentColor: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
  {
    code: "STEM20",
    title: "STEM Kit Special",
    description: "Extra 20% off on all STEM kit purchases.",
    discountLabel: "20% OFF",
    minOrder: "₹1,000",
    validUntil: "31 Dec 2025",
    gradient: "from-purple-600/20 to-purple-800/10",
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/30",
  },
  {
    code: "ROBO15",
    title: "Robotics Discount",
    description: "15% off on all robotics kit orders.",
    discountLabel: "15% OFF",
    minOrder: "₹800",
    validUntil: "31 Dec 2025",
    gradient: "from-teal-600/20 to-teal-800/10",
    accentColor: "text-teal-400",
    borderColor: "border-teal-500/30",
  },
  {
    code: "FIRST50",
    title: "First Order Offer",
    description: "Exclusive 50% off on your very first order.",
    discountLabel: "50% OFF",
    minOrder: "₹200",
    validUntil: "31 Dec 2025",
    gradient: "from-orange-600/20 to-orange-800/10",
    accentColor: "text-orange-400",
    borderColor: "border-orange-500/30",
  },
];

function CopyToast({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium"
    >
      <Check size={14} /> Code copied to clipboard!
    </motion.div>
  );
}

function SkeletonCoupon() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 animate-pulse space-y-3">
      <div className="h-5 w-1/4 bg-white/10 rounded" />
      <div className="h-4 w-1/2 bg-white/10 rounded" />
      <div className="h-8 w-2/3 bg-white/10 rounded-lg" />
    </div>
  );
}

interface CouponCardProps {
  coupon: CouponDef;
  onCopy: (code: string) => void;
  copied: boolean;
}

function CouponCard({ coupon, onCopy, copied }: CouponCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`rounded-2xl bg-gradient-to-br ${coupon.gradient} border ${coupon.borderColor} p-5 space-y-4 transition-all duration-200`}
    >
      {/* Discount badge + title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${coupon.accentColor}`}
          >
            {coupon.discountLabel}
          </span>
          <p className="text-white font-semibold text-sm mt-0.5">
            {coupon.title}
          </p>
          <p className="text-slate-400 text-xs mt-1">{coupon.description}</p>
        </div>
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 ${coupon.accentColor}`}
        >
          <Ticket size={18} />
        </div>
      </div>

      {/* Ticket code */}
      <div
        className={`flex items-center justify-between gap-2 rounded-xl border-2 border-dashed ${coupon.borderColor} bg-white/5 px-4 py-2.5`}
      >
        <span
          className={`font-mono font-bold tracking-widest text-sm ${coupon.accentColor}`}
        >
          {coupon.code}
        </span>
        <button
          type="button"
          data-ocid={`coupon-copy-${coupon.code}`}
          onClick={() => onCopy(coupon.code)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full transition-all duration-200 ${
            copied
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10"
          }`}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Min. order: <span className="text-slate-400">{coupon.minOrder}</span>
        </span>
        <span>
          Valid till:{" "}
          <span className="text-slate-400">{coupon.validUntil}</span>
        </span>
      </div>
    </motion.div>
  );
}

export function DashboardCoupons() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    const unsub = subscribeToUserOrders(userId, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setShowToast(true);
    setTimeout(() => setCopiedCode(null), 2500);
  }

  // Extract applied coupons from orders
  const appliedCoupons = orders
    .filter((o) => o.coupon)
    .map((o) => ({
      code: o.coupon as string,
      orderId: o.id,
      date: o.createdAt,
    }));

  const uniqueApplied = appliedCoupons.filter(
    (c, i, arr) => arr.findIndex((x) => x.code === c.code) === i,
  );

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {showToast && <CopyToast onClose={() => setShowToast(false)} />}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-bold text-white">Coupons & Offers</h1>
        <p className="mt-1 text-sm text-slate-400">
          Your rewards and available discounts
        </p>
      </div>

      {/* Available coupons */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-orange-400" />
          <h2 className="text-base font-semibold text-white">
            Available Coupons
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCoupon key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AVAILABLE_COUPONS.map((coupon) => (
              <CouponCard
                key={coupon.code}
                coupon={coupon}
                onCopy={handleCopy}
                copied={copiedCode === coupon.code}
              />
            ))}
          </div>
        )}
      </div>

      {/* Applied coupons */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Check size={16} className="text-green-400" />
          <h2 className="text-base font-semibold text-white">
            Applied Coupons
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <SkeletonCoupon key={i} />
            ))}
          </div>
        ) : uniqueApplied.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="coupons-applied-empty"
            className="rounded-2xl bg-white/5 border border-white/10 px-5 py-10 text-center"
          >
            <span className="text-3xl mb-3 block">🎫</span>
            <p className="text-slate-400 text-sm">No coupons applied yet.</p>
            <p className="text-slate-500 text-xs mt-1">
              Use a coupon code at checkout to see it here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uniqueApplied.map((c) => (
              <motion.div
                key={c.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3"
              >
                <Check size={16} className="text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-green-300 font-mono font-bold text-sm">
                    {c.code}
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    Used in order #{c.orderId.slice(-8).toUpperCase()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
