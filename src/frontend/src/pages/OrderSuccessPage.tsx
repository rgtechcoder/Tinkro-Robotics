import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/orderService";
import type { Order } from "@/types";
import { Link, useSearch } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ── Confetti particle ─────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const CONFETTI_COLORS = [
  "#f97316", // orange
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#eab308", // yellow
  "#06b6d4", // cyan
];

function useConfetti(count = 60) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const created: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: 1.5 + Math.random() * 2.5,
      opacity: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
    }));
    setParticles(created);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            rotation: p.rotation + p.rotationSpeed,
            opacity: p.y > 80 ? Math.max(0, p.opacity - 0.03) : p.opacity,
          }))
          .filter((p) => p.opacity > 0 && p.y < 120),
      );
    }, 30);

    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [count]);

  return particles;
}

interface OrderSuccessSearch {
  orderId?: string;
}

export function OrderSuccessPage() {
  const search = useSearch({ strict: false }) as OrderSuccessSearch;
  const orderId = search.orderId ?? "";
  const [order, setOrder] = useState<Order | null>(null);
  const particles = useConfetti(70);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    getOrderById(orderId)
      .then((o) => {
        if (active) setOrder(o);
      })
      .catch(() => {
        if (active) setOrder(null);
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  const displayOrderId = orderId
    ? `#${orderId.slice(0, 8).toUpperCase()}`
    : "#UNKNOWN";

  return (
    <div className="relative min-h-screen gradient-subtle overflow-hidden flex flex-col items-center justify-center px-4 py-16">
      {/* Confetti particles */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-sm"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size * 0.6,
                backgroundColor: p.color,
                opacity: p.opacity,
                rotate: p.rotation,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Success card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-lg"
        data-ocid="order-success-page"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 text-center space-y-6 border border-primary/20 shadow-glow-primary">
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 180,
              damping: 14,
            }}
            className="mx-auto w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary"
          >
            <CheckCircle2
              className="w-14 h-14 text-primary-foreground"
              strokeWidth={1.5}
            />
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text leading-tight">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground text-base">
              🎉 Your robotics kit is confirmed and on its way!
            </p>
          </motion.div>

          {/* Order details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-muted/50 border border-border rounded-2xl p-5 space-y-3 text-left"
          >
            {/* Order ID */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Package className="w-4 h-4 flex-shrink-0" />
                <span>Order ID</span>
              </div>
              <span className="font-mono font-bold text-primary text-sm tracking-wider">
                {displayOrderId}
              </span>
            </div>

            {/* Payment confirmed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
                <span>Payment</span>
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                Confirmed ✓
              </span>
            </div>

            {/* Estimated delivery */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Truck className="w-4 h-4 flex-shrink-0" />
                <span>Estimated Delivery</span>
              </div>
              <span className="text-foreground text-sm font-medium">
                {order?.estimatedDelivery ?? "5-7 business days"}
              </span>
            </div>

            {/* Amount */}
            {order && (
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Amount Paid</span>
                </div>
                <span className="font-bold gradient-text-orange text-base">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </motion.div>

          {/* Razorpay payment ID */}
          {order?.razorpayPaymentId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-muted-foreground"
            >
              Payment Ref:{" "}
              <span className="font-mono text-foreground/70">
                {order.razorpayPaymentId}
              </span>
            </motion.p>
          )}

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <Link to="/dashboard" className="flex-1">
              <Button
                size="lg"
                className="w-full gradient-primary text-primary-foreground border-0 shadow-glow-primary hover:scale-[1.02] transition-smooth font-bold"
                data-ocid="order-success-dashboard-btn"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                View My Orders
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary/40 text-primary hover:bg-primary/10 transition-smooth font-semibold"
                data-ocid="order-success-shop-btn"
              >
                Continue Shopping
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Background decorative glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-chart-1/10 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}
