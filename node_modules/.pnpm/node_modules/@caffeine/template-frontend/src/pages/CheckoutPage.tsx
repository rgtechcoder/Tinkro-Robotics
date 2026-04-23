import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  hasUserRedeemedCoupon,
  saveOrder,
  subscribeToUserOrders,
} from "@/lib/orderService";
import { useCoupons } from "@/lib/publicDataService";
import { loadRazorpay, openRazorpayCheckout } from "@/lib/razorpay";
import { useCartStore } from "@/store/cartStore";
import type { Address, Order } from "@/types";
import type { AdminCoupon } from "@/types/admin";
import type { RazorpayResponse } from "@/types/razorpay";
import { Link, useNavigate } from "@tanstack/react-router";
import { useUserAuth } from "@/context/UserAuthContext";
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ── NOTE: Razorpay public key comes from Vite env.
// Set VITE_RAZORPAY_KEY_ID in src/frontend/.env
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

function fadeSlideProps(i: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  };
}

type FormState = Omit<Address, "id" | "isDefault">;
const emptyForm: FormState = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function CheckoutPage() {
  const { items, total, updateQty, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { coupons, loading: couponsLoading } = useCoupons();
  const { user, isLoading: authLoading } = useUserAuth();

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AdminCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Address state
  const [address, setAddress] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  // Payment state
  const [isPlacing, setIsPlacing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setOrders([]);
      return;
    }
    const unsub = subscribeToUserOrders(user.uid, (data) => {
      setOrders(data);
    });
    return unsub;
  }, [user?.uid]);

  // ── Coupon logic ────────────────────────────────────────────────────────────
  const discount = appliedCoupon
    ? appliedCoupon.discountType === "percent"
      ? Math.round((total * appliedCoupon.discountValue) / 100)
      : Math.min(appliedCoupon.discountValue, total)
    : 0;
  const grandTotal = Math.max(0, total - discount);

  function getLastOrderDate() {
    if (orders.length === 0) return null;
    const dates = orders
      .map((o) => new Date(o.createdAt).getTime())
      .filter((t) => !Number.isNaN(t));
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates));
  }

  function isEligibleForCoupon(coupon: AdminCoupon) {
    const audience = coupon.audience ?? "all";
    const totalOrders = orders.length;
    const lastOrderDate = getLastOrderDate();
    const activityDays = coupon.activityDays ?? 60;
    const cutoff = new Date(Date.now() - activityDays * 24 * 60 * 60 * 1000);

    if (audience === "new") return totalOrders === 0;
    if (audience === "inactive") return !lastOrderDate || lastOrderDate < cutoff;
    if (audience === "active") return !!lastOrderDate && lastOrderDate >= cutoff;
    return true;
  }

  async function applyCoupon() {
    if (!user?.uid) {
      setCouponError("Please log in to apply a coupon.");
      return;
    }
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const found = coupons.find((c) => c.code.toUpperCase() === code);

    if (!found || !found.isActive || (found.expiresAt && new Date(found.expiresAt) < new Date())) {
      setCouponError("Invalid or expired coupon code.");
      setAppliedCoupon(null);
      return;
    }

    if (!isEligibleForCoupon(found)) {
      setCouponError("This coupon is not available for your account.");
      setAppliedCoupon(null);
      return;
    }

    if (found.minOrderAmount > 0 && total < found.minOrderAmount) {
      setCouponError(
        `Minimum order ₹${found.minOrderAmount.toLocaleString("en-IN")} required for this coupon.`,
      );
      setAppliedCoupon(null);
      return;
    }

    if (found.usageLimit > 0 && found.usedCount >= found.usageLimit) {
      setCouponError("This coupon has reached its usage limit.");
      setAppliedCoupon(null);
      return;
    }

    if (found.oneTimePerUser) {
      setCouponChecking(true);
      const redeemed = await hasUserRedeemedCoupon(user.uid, found.id);
      setCouponChecking(false);
      if (redeemed) {
        setCouponError("You have already used this coupon.");
        setAppliedCoupon(null);
        return;
      }
    }

    const savedAmount =
      found.discountType === "percent"
        ? Math.round((total * found.discountValue) / 100)
        : Math.min(found.discountValue, total);

    setAppliedCoupon(found);
    setCouponError("");
    toast.success(
      `Coupon applied! You save ₹${savedAmount.toLocaleString("en-IN")}`,
    );
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const errs: typeof formErrors = {};
    const required: (keyof FormState)[] = [
      "name",
      "phone",
      "line1",
      "city",
      "state",
      "pincode",
    ];
    for (const key of required) {
      if (!address[key]?.trim()) errs[key] = "This field is required";
    }
    if (address.phone && !/^[6-9]\d{9}$/.test(address.phone))
      errs.phone = "Enter a valid 10-digit mobile number";
    if (address.pincode && !/^\d{6}$/.test(address.pincode))
      errs.pincode = "Enter a valid 6-digit pincode";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Place order via Razorpay ─────────────────────────────────────────────────
  async function handlePlaceOrder() {
    if (!user?.uid) {
      toast.error("Please log in to place an order.");
      navigate({ to: "/login" });
      return;
    }
    if (!RAZORPAY_KEY) {
      toast.error("Payment key missing. Please contact support.");
      return;
    }
    if (!validate()) return;
    setIsPlacing(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error(
        "Failed to load payment gateway. Please check your connection.",
      );
      setIsPlacing(false);
      return;
    }

    openRazorpayCheckout({
      key: RAZORPAY_KEY,
      amount: grandTotal * 100, // paise
      currency: "INR",
      name: "Tinkro Robotics",
      description: `Order for ${items.length} item${items.length !== 1 ? "s" : ""}`,
      prefill: {
        name: address.name,
        contact: address.phone,
      },
      theme: { color: "#f97316" },
      handler: async (response: RazorpayResponse) => {
        setIsPlacing(false);
        setIsProcessing(true);
        try {
          const userId = user.uid;
          const orderData = {
            userId,
            customerEmail: user.email ?? undefined,
            customerName: user.displayName ?? address.name,
            items,
            address: { ...address, id: crypto.randomUUID(), isDefault: false },
            subtotal: total,
            discount,
            total: grandTotal,
            coupon: appliedCoupon?.code ?? null,
            couponCode: appliedCoupon?.code ?? null,
            couponId: appliedCoupon?.id ?? null,
            status: "placed" as const,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id ?? "",
            estimatedDelivery: "5-7 business days",
            trackingId: null,
          };
          if (appliedCoupon) {
            orderData.couponDiscount = discount;
          }
          const docId = await saveOrder(orderData);

          clearCart();
          void docId;
          window.location.assign(`/order-success?orderId=${docId}`);
          await navigate({ to: "/order-success", search: { orderId: docId } });
        } catch (err) {
          console.error("Order save failed:", err);
          toast.error(
            "Payment received but order save failed. Please contact support.",
          );
        } finally {
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsPlacing(false);
          toast.error("Payment cancelled. Please try again.");
        },
      },
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function handleAddress(key: keyof FormState, val: string) {
    setAddress((prev) => ({ ...prev, [key]: val }));
    if (formErrors[key])
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── Empty cart ───────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mb-6 shadow-glow-primary">
          <ShoppingCart className="w-12 h-12 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3 gradient-text">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Looks like you haven't added anything yet. Explore our robotics kits
          and STEM solutions.
        </p>
        <Link to="/products">
          <Button
            size="lg"
            className="gradient-orange text-white border-0 shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-smooth"
            data-ocid="checkout-empty-cta"
          >
            Continue Shopping
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (!authLoading && !user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-5">
          <Shield className="w-10 h-10 text-orange-400" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2 text-foreground">
          Please login to continue
        </h2>
        <p className="text-muted-foreground text-base mb-6 max-w-md">
          Checkout is available only for logged-in users.
        </p>
        <Button
          size="lg"
          className="gradient-orange text-white border-0 shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-smooth"
          onClick={() => navigate({ to: "/login" })}
        >
          Go to Login
        </Button>
      </motion.div>
    );
  }

  // ── Processing overlay ───────────────────────────────────────────────────────
  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mb-6"
        />
        <h2 className="text-2xl font-display font-bold gradient-text mb-2">
          Processing Your Order...
        </h2>
        <p className="text-muted-foreground">Please don't close this window.</p>
      </motion.div>
    );
  }

  // ── Main checkout ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border-b border-border px-4 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Secure Checkout
            </h1>
            <p className="text-sm text-muted-foreground">
              SSL encrypted · Powered by Razorpay
            </p>
          </div>
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Order summary */}
          <motion.div
            {...fadeSlideProps(0)}
            className="glass-card rounded-2xl p-6"
            data-ocid="checkout-order-summary"
          >
            <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-5">
              <Package className="w-5 h-5 text-primary" />
              <span className="gradient-text">Order Summary</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </Badge>
            </h2>

            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-smooth"
                    data-ocid={`cart-item-${item.productId}`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-border flex-shrink-0 product-image-container">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/assets/images/placeholder.svg";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.productId, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/10 transition-smooth flex items-center justify-center"
                        aria-label="Decrease quantity"
                        data-ocid={`qty-decrease-${item.productId}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.productId, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/10 transition-smooth flex items-center justify-center"
                        aria-label="Increase quantity"
                        data-ocid={`qty-increase-${item.productId}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-foreground w-20 text-right flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="w-7 h-7 rounded-lg hover:bg-destructive/15 hover:text-destructive transition-smooth flex items-center justify-center text-muted-foreground flex-shrink-0"
                      aria-label={`Remove ${item.name}`}
                      data-ocid={`remove-item-${item.productId}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Separator className="my-5" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              {appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex justify-between text-green-600 dark:text-green-400 font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Coupon ({appliedCoupon.code})
                  </span>
                  <span>−₹{discount.toLocaleString("en-IN")}</span>
                </motion.div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Free
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-foreground pt-1">
                <span>Grand Total</span>
                <span className="gradient-text-orange text-xl">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Address section */}
          <motion.div
            {...fadeSlideProps(2)}
            className="glass-card rounded-2xl p-6"
            data-ocid="checkout-address-section"
          >
            <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-5">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="gradient-text">Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="addr-name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addr-name"
                  value={address.name}
                  onChange={(e) => handleAddress("name", e.target.value)}
                  className={formErrors.name ? "border-destructive" : ""}
                  data-ocid="address-name"
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-phone" className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addr-phone"
                  value={address.phone}
                  onChange={(e) =>
                    handleAddress(
                      "phone",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  className={formErrors.phone ? "border-destructive" : ""}
                  data-ocid="address-phone"
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="addr-line1" className="text-sm font-medium">
                  Address Line 1 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addr-line1"
                  value={address.line1}
                  onChange={(e) => handleAddress("line1", e.target.value)}
                  className={formErrors.line1 ? "border-destructive" : ""}
                  data-ocid="address-line1"
                />
                {formErrors.line1 && (
                  <p className="text-xs text-destructive">{formErrors.line1}</p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="addr-line2" className="text-sm font-medium">
                  Address Line 2{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="addr-line2"
                  value={address.line2 ?? ""}
                  onChange={(e) => handleAddress("line2", e.target.value)}
                  data-ocid="address-line2"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-city" className="text-sm font-medium">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addr-city"
                  value={address.city}
                  onChange={(e) => handleAddress("city", e.target.value)}
                  className={formErrors.city ? "border-destructive" : ""}
                  data-ocid="address-city"
                />
                {formErrors.city && (
                  <p className="text-xs text-destructive">{formErrors.city}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-state" className="text-sm font-medium">
                  State <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={address.state}
                  onValueChange={(val) => handleAddress("state", val)}
                >
                  <SelectTrigger
                    id="addr-state"
                    className={formErrors.state ? "border-destructive" : ""}
                    data-ocid="address-state"
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.state && (
                  <p className="text-xs text-destructive">{formErrors.state}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-pincode" className="text-sm font-medium">
                  Pincode <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addr-pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    handleAddress(
                      "pincode",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  className={formErrors.pincode ? "border-destructive" : ""}
                  data-ocid="address-pincode"
                />
                {formErrors.pincode && (
                  <p className="text-xs text-destructive">
                    {formErrors.pincode}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
        <div className="space-y-6 lg:sticky lg:top-6">
          {/* Razorpay payment section */}
          <motion.div
            {...fadeSlideProps(3)}
            className="glass-card rounded-2xl p-6"
            data-ocid="checkout-payment-section"
          >
            <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="gradient-text">Payment</span>
            </h2>

            {/* Razorpay secure payment block */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">
                    Secure Payment via Razorpay
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    100% Secure · SSL Encrypted · Powered by Razorpay
                  </p>
                </div>
              </div>

              {/* Payment method badges */}
              <div className="flex flex-wrap gap-2">
                {["UPI", "Cards", "NetBanking", "Wallets", "EMI"].map(
                  (method) => (
                    <span
                      key={method}
                      className="text-xs font-medium bg-card border border-border rounded-lg px-2.5 py-1 text-muted-foreground"
                    >
                      {method}
                    </span>
                  ),
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                You'll be redirected to Razorpay's secure payment window after
                clicking "Pay Now". Your card details are never stored on our
                servers.
              </p>
            </div>
          </motion.div>

          {/* Coupon section */}
          <motion.div
            {...fadeSlideProps(4)}
            className="glass-card rounded-2xl p-6"
            data-ocid="checkout-coupon-section"
          >
            <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-primary" />
              <span className="gradient-text">Coupon Code</span>
              {couponsLoading && (
                <Loader2 className="w-3.5 h-3.5 ml-1 animate-spin text-muted-foreground" />
              )}
            </h2>
            {appliedCoupon ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">
                      {appliedCoupon.code} applied!
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500">
                      You save ₹{discount.toLocaleString("en-IN")}
                      {appliedCoupon.discountType === "percent"
                        ? ` (${appliedCoupon.discountValue}% off)`
                        : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-muted-foreground hover:text-destructive transition-smooth"
                  data-ocid="coupon-remove"
                  aria-label="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !couponsLoading &&
                      !couponChecking &&
                      applyCoupon()
                    }
                    disabled={couponsLoading || couponChecking}
                    className="flex-1 border-input focus:border-primary/60 transition-smooth uppercase disabled:opacity-50"
                    data-ocid="coupon-input"
                    aria-label="Coupon code"
                  />
                  <Button
                    onClick={applyCoupon}
                    disabled={couponsLoading || couponChecking}
                    variant="outline"
                    className="border-primary/40 text-primary hover:bg-primary/10 transition-smooth font-semibold disabled:opacity-50"
                    data-ocid="coupon-apply"
                  >
                    {couponsLoading || couponChecking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
                {couponError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {couponError}
                  </motion.p>
                )}
                {!couponsLoading && coupons.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {coupons.length} coupon
                    {coupons.length !== 1 ? "s" : ""} available — enter a code
                    above to apply.
                  </p>
                )}
                {couponsLoading && (
                  <p className="text-xs text-muted-foreground animate-pulse">
                    Loading available coupons…
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Order total + Place Order */}
          <motion.div
            {...fadeSlideProps(5)}
            className="glass-card rounded-2xl p-6 space-y-4"
            data-ocid="checkout-place-order-section"
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                  <span>Discount</span>
                  <span>−₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Free
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-base text-foreground">
                  Total Payable
                </span>
                <span className="text-2xl font-display font-bold gradient-text-orange">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Pay Now CTA */}
            <Button
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isPlacing || isProcessing}
              className="w-full gradient-orange text-white border-0 shadow-glow-orange hover:shadow-glow-orange hover:scale-[1.02] transition-smooth text-base font-bold h-14 relative overflow-hidden"
              data-ocid="checkout-place-order-btn"
            >
              {isPlacing ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Opening Payment...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Pay Now · ₹{grandTotal.toLocaleString("en-IN")}
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By placing an order, you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </p>
          </motion.div>

          {/* Trust badges */}
          <motion.div {...fadeSlideProps(6)} className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: "Secure\nCheckout" },
              { icon: Package, label: "Free\nDelivery" },
              { icon: CheckCircle2, label: "Genuine\nProducts" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 text-center"
              >
                <Icon className="w-5 h-5 text-primary" />
                <p className="text-xs text-muted-foreground leading-tight font-medium whitespace-pre-line">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
