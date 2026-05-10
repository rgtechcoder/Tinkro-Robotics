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
  type SaveOrderData,
} from "@/lib/orderService";
import { getUserAddresses, saveAddress } from "@/lib/addressService";
import { useCoupons } from "@/lib/publicDataService";
import {
  createCashfreeOrder,
  loadCashfree,
  openCashfreeCheckout,
  verifyCashfreePayment,
} from "@/lib/cashfree";
import { useCartStore } from "@/store/cartStore";
import type { Address, Order } from "@/types";
import type { AdminCoupon, AdminShippingRule } from "@/types/admin";
import type { CashfreeCheckoutResult } from "@/types/cashfree";
import { Link, useNavigate } from "@tanstack/react-router";
import { useUserAuth } from "@/context/UserAuthContext";
import { db } from "@/lib/firebase";
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";

// ── NOTE: Cashfree mode comes from Vite env.
// Set VITE_CASHFREE_ENV=sandbox|production in src/frontend/.env

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
  const [shippingRules, setShippingRules] = useState<AdminShippingRule[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingRule, setShippingRule] = useState<AdminShippingRule | null>(null);

  // Address state
  const [address, setAddress] = useState<FormState>(emptyForm);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [alternateEmailStatus, setAlternateEmailStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [pincodeStatus, setPincodeStatus] = useState<
    "idle" | "checking" | "valid" | "invalid" | "error"
  >("idle");
  const [pincodeMessage, setPincodeMessage] = useState<string>("");
  const [pincodeCities, setPincodeCities] = useState<string[]>([]);
  const [pincodeState, setPincodeState] = useState<string>("");
  const [cityTouched, setCityTouched] = useState(false);
  const [stateTouched, setStateTouched] = useState(false);
  const [lastPincode, setLastPincode] = useState<string>("");

  // Payment state
  const [isPlacing, setIsPlacing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cashfree" | "cod">(
    "cashfree",
  );

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

  useEffect(() => {
    if (!user?.uid) {
      setSavedAddresses([]);
      setSelectedAddressId("new");
      setAddress(emptyForm);
      return;
    }
    getUserAddresses(user.uid)
      .then((data) => {
        setSavedAddresses(data);
        const defaultAddr = data.find((a) => a.isDefault) ?? data[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setAddress({
            name: defaultAddr.name,
            phone: defaultAddr.phone,
            line1: defaultAddr.line1,
            line2: defaultAddr.line2 ?? "",
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
          });
        } else {
          setSelectedAddressId("new");
          setAddress((prev) => ({
            ...prev,
            name: prev.name || user.displayName || "",
            phone: prev.phone || user.phoneNumber || "",
          }));
        }
        });
  }, [user?.uid, user?.displayName, user?.phoneNumber]);

  // ── Shipping rules ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchShippingRules() {
      try {
        const snap = await getDocs(collection(db, "shippingRules"));
        const data = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as AdminShippingRule),
        }));
        setShippingRules(data);
      } catch {
        setShippingRules([]);
      }
    }
    void fetchShippingRules();
  }, []);

  function calcShipping(amount: number) {
    const activeRules = shippingRules
      .filter((r) => r.isActive)
      .sort((a, b) => b.minOrderAmount - a.minOrderAmount);

    const applyRule = (rule: AdminShippingRule) => {
      const cost =
        rule.freeShippingAbove !== undefined &&
        rule.freeShippingAbove !== null &&
        amount >= rule.freeShippingAbove
          ? 0
          : rule.baseCost;
      return { cost, rule };
    };

    for (const rule of activeRules) {
      const aboveMin = amount >= rule.minOrderAmount;
      const belowMax =
        rule.maxOrderAmount === undefined ||
        rule.maxOrderAmount === null ||
        amount <= rule.maxOrderAmount;

      if (aboveMin && belowMax) {
        return applyRule(rule);
      }
    }

    if (activeRules.length > 0) {
      return applyRule(activeRules[activeRules.length - 1]);
    }

    return { cost: 0, rule: null };
  }

  // ── Pincode lookup (India Post) ─────────────────────────────────────────────
  useEffect(() => {
    if (selectedAddressId !== "new") {
      setPincodeStatus("idle");
      setPincodeMessage("");
      setPincodeCities([]);
      setPincodeState("");
      return;
    }

    const pincode = address.pincode?.trim();
    if (pincode && pincode.length === 6 && pincode !== lastPincode) {
      setCityTouched(false);
      setStateTouched(false);
      setLastPincode(pincode);
    }
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus("idle");
      setPincodeMessage("");
      setPincodeCities([]);
      setPincodeState("");
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setPincodeStatus("checking");
      setPincodeMessage("");

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as Array<{
          Status: string;
          Message: string;
          PostOffice: Array<{ District: string; State: string; Name: string }> | null;
        }>;

        const first = data?.[0];
        if (!first || first.Status !== "Success" || !first.PostOffice?.length) {
          setPincodeStatus("invalid");
          setPincodeMessage("We couldn't verify this pincode. Please recheck.");
          setPincodeCities([]);
          setPincodeState("");
          return;
        }

        const cities = Array.from(
          new Set(first.PostOffice.map((office) => office.District).filter(Boolean)),
        );
        const state = first.PostOffice[0]?.State || "";

        setPincodeCities(cities);
        setPincodeState(state);
        setPincodeStatus("valid");

        setAddress((prev) => ({
          ...prev,
          city: cityTouched ? prev.city : cities[0] || prev.city,
          state: stateTouched ? prev.state : state || prev.state,
        }));
        if (state && address.state && address.state !== state) {
          setPincodeMessage("State doesn't match the pincode. Please confirm.");
        }
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") return;
        setPincodeStatus("error");
        setPincodeMessage("Couldn't validate pincode right now. Please try later.");
      }
    }, 450);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [address.pincode, address.city, address.state, selectedAddressId]);

  const cityMismatch =
    pincodeStatus === "valid" &&
    address.city?.trim() &&
    pincodeCities.length > 0 &&
    !pincodeCities.some(
      (city) => city.toLowerCase() === address.city.trim().toLowerCase(),
    );

  // ── Coupon logic ────────────────────────────────────────────────────────────
  const discount = appliedCoupon
    ? appliedCoupon.discountType === "percent"
      ? Math.round((total * appliedCoupon.discountValue) / 100)
      : Math.min(appliedCoupon.discountValue, total)
    : 0;
  const orderBase = Math.max(0, total - discount);

  useEffect(() => {
    const { cost, rule } = calcShipping(orderBase);
    setShippingCost(cost);
    setShippingRule(rule);
  }, [orderBase, shippingRules]);

  const grandTotal = Math.max(0, orderBase + shippingCost);

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

  async function checkAlternateEmailExists(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();
    const usersRef = collection(db, "users");
    let snap = await getDocs(query(usersRef, where("email", "==", normalized)));
    if (snap.empty && email.trim() !== normalized) {
      snap = await getDocs(query(usersRef, where("email", "==", email.trim())));
    }
    return !snap.empty;
  }

  async function validateAlternateEmail(): Promise<boolean> {
    const email = alternateEmail.trim();
    if (!email) {
      setAlternateEmailStatus("idle");
      return true;
    }
    if (user?.email && email.toLowerCase() === user.email.toLowerCase()) {
      setAlternateEmailStatus("valid");
      return true;
    }
    setAlternateEmailStatus("checking");
    try {
      const exists = await checkAlternateEmailExists(email);
      setAlternateEmailStatus(exists ? "valid" : "invalid");
      return exists;
    } catch {
      setAlternateEmailStatus("invalid");
      return false;
    }
  }

  async function persistNewAddressIfNeeded() {
    if (!user?.uid) return null;
    if (selectedAddressId !== "new") return selectedAddressId;

    const addressPayload: Omit<Address, "id"> = {
      ...address,
      line2: address.line2 ?? "",
      isDefault: savedAddresses.length === 0,
    };

    try {
      const newId = await saveAddress(user.uid, addressPayload);
      setSavedAddresses((prev) => {
        const cleared = addressPayload.isDefault
          ? prev.map((item) => ({ ...item, isDefault: false }))
          : prev;
        return [{ id: newId, ...addressPayload }, ...cleared];
      });
      setSelectedAddressId(newId);
      return newId;
    } catch (error) {
      console.error("Failed to save address", error);
      toast.error("Could not save this address to your dashboard.");
      return null;
    }
  }

  // ── Place order via Cashfree / COD ───────────────────────────────────────────
  function getCashfreeErrorMessage(error: unknown) {
    if (error instanceof FirebaseError) {
      const details = error.customData || (error as unknown as { details?: unknown }).details;
      if (details && typeof (details as { error?: unknown }).error === "string") {
        return (details as { error?: string }).error || error.message;
      }
      if (typeof details === "string") return details;
      return error.message || "Payment failed. Please try again.";
    }
    if (error && typeof error === "object") {
      const message = (error as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }
    return "Payment failed. Please try again.";
  }

  async function handlePlaceOrder() {
    if (!user?.uid) {
      toast.error("Please log in to place an order.");
      navigate({ to: "/login" });
      return;
    }
    if (alternateEmail.trim()) {
      const ok = await validateAlternateEmail();
      if (!ok) {
        toast.error(
          "Alternate email doesn't have an account. Please create one or use your account email.",
        );
        return;
      }
    }
    if (!validate()) return;
    setIsPlacing(true);

    try {
      if (paymentMethod === "cod") {
        setIsPlacing(false);
        setIsProcessing(true);

        await persistNewAddressIfNeeded();

        const alt = alternateEmail.trim();
        const useAlt =
          alt && user.email && alt.toLowerCase() !== user.email.toLowerCase();
        const customerEmail = useAlt ? alt : user.email ?? undefined;
        const customerName = user.displayName ?? address.name;

        const orderData: SaveOrderData = {
          userId: user.uid,
          customerEmail,
          customerName,
          items,
          address: { ...address, id: crypto.randomUUID(), isDefault: false },
          subtotal: total,
          discount,
          shippingCharge: shippingCost,
          shippingRuleId: shippingRule?.id ?? null,
          shippingRuleName: shippingRule?.name ?? null,
          total: grandTotal,
          coupon: appliedCoupon?.code ?? null,
          couponCode: appliedCoupon?.code ?? null,
          couponId: appliedCoupon?.id ?? null,
          status: "placed" as const,
          paymentGateway: "cod" as const,
          estimatedDelivery:
            shippingRule?.estimatedDaysMax
              ? `${shippingRule.estimatedDays}-${shippingRule.estimatedDaysMax} business days`
              : shippingRule?.estimatedDays
                ? `${shippingRule.estimatedDays} business days`
                : "5-7 business days",
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
        return;
      }

      const loaded = await loadCashfree();
      if (!loaded) {
        toast.error(
          "Failed to load payment gateway. Please check your connection.",
        );
        return;
      }

      const alt = alternateEmail.trim();
      const useAlt =
        alt && user.email && alt.toLowerCase() !== user.email.toLowerCase();
      const customerEmail = useAlt ? alt : user.email ?? undefined;
      const customerName = user.displayName ?? address.name;

      if (!customerEmail) {
        toast.error("Email is required for online payments.");
        return;
      }

      await persistNewAddressIfNeeded();

      const { orderId, paymentSessionId } = await createCashfreeOrder({
        amount: grandTotal,
        currency: "INR",
        customer: {
          id: user.uid,
          name: customerName,
          email: customerEmail,
          phone: address.phone,
        },
        orderNote: `Order for ${items.length} item${items.length !== 1 ? "s" : ""}`,
        orderMeta: {
          source: "web",
        },
      });

      const result: CashfreeCheckoutResult = await openCashfreeCheckout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      if (result?.error) {
        toast.error(result.error.message || "Payment failed. Please try again.");
        return;
      }

      setIsPlacing(false);
      setIsProcessing(true);

      const verification = await verifyCashfreePayment({ orderId });
      const orderStatus =
        (verification.orderStatus || "").toUpperCase() ||
        (verification.paymentStatus || "").toUpperCase();

      if (orderStatus !== "PAID" && orderStatus !== "SUCCESS") {
        toast.error(
          "Payment not confirmed yet. Please check your order status or try again.",
        );
        return;
      }

      const orderData: SaveOrderData = {
        userId: user.uid,
        customerEmail,
        customerName,
        items,
        address: { ...address, id: crypto.randomUUID(), isDefault: false },
        subtotal: total,
        discount,
        shippingCharge: shippingCost,
        shippingRuleId: shippingRule?.id ?? null,
        shippingRuleName: shippingRule?.name ?? null,
        total: grandTotal,
        coupon: appliedCoupon?.code ?? null,
        couponCode: appliedCoupon?.code ?? null,
        couponId: appliedCoupon?.id ?? null,
        status: "placed" as const,
        paymentGateway: "cashfree" as const,
        cashfreeOrderId: orderId,
        cashfreePaymentId: verification.paymentId ?? null,
        cashfreeCfOrderId: verification.cfOrderId ?? null,
        estimatedDelivery:
          shippingRule?.estimatedDaysMax
            ? `${shippingRule.estimatedDays}-${shippingRule.estimatedDaysMax} business days`
            : shippingRule?.estimatedDays
              ? `${shippingRule.estimatedDays} business days`
              : "5-7 business days",
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
      console.error("Cashfree payment failed:", err);
      toast.error(getCashfreeErrorMessage(err));
    } finally {
      setIsPlacing(false);
      setIsProcessing(false);
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function handleAddress(key: keyof FormState, val: string) {
    setAddress((prev) => ({ ...prev, [key]: val }));
    if (formErrors[key])
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function selectSavedAddress(addr: Address) {
    setSelectedAddressId(addr.id);
    setAddress({
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
  }

  function selectNewAddress() {
    setSelectedAddressId("new");
    setAddress((prev) => ({
      ...emptyForm,
      name: user?.displayName || prev.name,
      phone: user?.phoneNumber || prev.phone,
    }));
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
              PCI-DSS compliant · SSL encrypted · Powered by Cashfree
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
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-smooth"
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
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
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

                      <p className="text-sm font-bold text-foreground min-w-[72px] text-right whitespace-nowrap flex-shrink-0">
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
                    </div>
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
                {shippingCost > 0 ? (
                  <span className="text-foreground font-medium">
                    ₹{shippingCost.toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Free
                  </span>
                )}
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

            {savedAddresses.length > 0 && (
              <div className="space-y-3 mb-5">
                <p className="text-sm font-medium text-foreground">
                  Select a saved address
                </p>
                <div className="grid gap-2">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => selectSavedAddress(addr)}
                      className={`rounded-xl border px-4 py-3 text-left transition-smooth ${
                        selectedAddressId === addr.id
                          ? "border-primary/60 bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                      data-ocid={`address-pick-${addr.id}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {addr.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {addr.line1}
                            {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city},
                            {" "}{addr.state} — {addr.pincode}
                          </p>
                        </div>
                        {addr.isDefault && (
                          <Badge variant="secondary" className="text-[10px]">
                            Default
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={selectNewAddress}
                    className={`rounded-xl border px-4 py-3 text-left transition-smooth ${
                      selectedAddressId === "new"
                        ? "border-primary/60 bg-primary/5"
                        : "border-dashed border-border hover:border-primary/30"
                    }`}
                    data-ocid="address-pick-new"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      Use a new address
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enter a different delivery address
                    </p>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="addr-email" className="text-sm font-medium">
                  Account Email
                </Label>
                <Input
                  id="addr-email"
                  value={user?.email ?? ""}
                  readOnly
                  disabled
                  className="opacity-80"
                  data-ocid="address-email"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="addr-alt-email" className="text-sm font-medium">
                  Alternate Email (optional)
                </Label>
                <Input
                  id="addr-alt-email"
                  type="email"
                  value={alternateEmail}
                  onChange={(e) => setAlternateEmail(e.target.value)}
                  onBlur={() => void validateAlternateEmail()}
                  data-ocid="address-alt-email"
                />
                {alternateEmailStatus === "checking" && (
                  <p className="text-xs text-muted-foreground">
                    Checking this email…
                  </p>
                )}
                {alternateEmailStatus === "invalid" && (
                  <p className="text-xs text-destructive">
                    No account found for this email. Please create an account to
                    use it.
                  </p>
                )}
                {alternateEmailStatus === "valid" &&
                  alternateEmail.trim() &&
                  user?.email &&
                  alternateEmail.trim().toLowerCase() !==
                    user.email.toLowerCase() && (
                    <p className="text-xs text-muted-foreground">
                      Account found. Updates will be sent to this email.
                    </p>
                  )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addr-name"
                  value={address.name}
                  onChange={(e) => handleAddress("name", e.target.value)}
                  className={formErrors.name ? "border-destructive" : ""}
                  disabled={selectedAddressId !== "new"}
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
                  disabled={selectedAddressId !== "new"}
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
                  disabled={selectedAddressId !== "new"}
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
                  disabled={selectedAddressId !== "new"}
                  data-ocid="address-line2"
                />
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
                  disabled={selectedAddressId !== "new"}
                  data-ocid="address-pincode"
                />
                {formErrors.pincode && (
                  <p className="text-xs text-destructive">
                    {formErrors.pincode}
                  </p>
                )}
                {pincodeStatus === "checking" && (
                  <p className="text-xs text-muted-foreground">
                    Verifying pincode…
                  </p>
                )}
                {pincodeMessage && (
                  <p className="text-xs text-amber-600">{pincodeMessage}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-city" className="text-sm font-medium">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addr-city"
                  value={address.city}
                  onChange={(e) => {
                    setCityTouched(true);
                    handleAddress("city", e.target.value);
                  }}
                  className={formErrors.city ? "border-destructive" : ""}
                  disabled={selectedAddressId !== "new"}
                  data-ocid="address-city"
                />
                {formErrors.city && (
                  <p className="text-xs text-destructive">{formErrors.city}</p>
                )}
                {pincodeStatus === "valid" && pincodeCities.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Auto-filled from pincode: {pincodeCities[0]}
                    {pincodeState ? `, ${pincodeState}` : ""}
                  </div>
                )}
                {cityMismatch && (
                  <p className="text-xs text-amber-600">
                    City doesn't match this pincode. You can still proceed or adjust it.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr-state" className="text-sm font-medium">
                  State <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={address.state}
                  onValueChange={(val) => {
                    setStateTouched(true);
                    handleAddress("state", val);
                  }}
                  disabled={selectedAddressId !== "new"}
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
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
        <div className="space-y-6 lg:sticky lg:top-6">
          {/* Payment section */}
          <motion.div
            {...fadeSlideProps(3)}
            className="glass-card rounded-2xl p-6"
            data-ocid="checkout-payment-section"
          >
            <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="gradient-text">Payment</span>
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cashfree")}
                  className={`rounded-2xl border px-4 py-4 text-left transition-smooth ${
                    paymentMethod === "cashfree"
                      ? "border-primary/60 bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                  data-ocid="payment-method-cashfree"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary flex-shrink-0">
                      <Shield className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        Pay Online (Cashfree)
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        UPI · Cards · NetBanking · Wallets · EMI
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`rounded-2xl border px-4 py-4 text-left transition-smooth ${
                    paymentMethod === "cod"
                      ? "border-primary/60 bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                  data-ocid="payment-method-cod"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/70 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Pay when you receive your order
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {paymentMethod === "cashfree" && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        Secure Payment via Cashfree
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        100% Secure · PCI-DSS compliant · Powered by Cashfree
                      </p>
                    </div>
                  </div>

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
                    You'll be redirected to Cashfree's secure payment window after
                    clicking "Pay Now". Your card details are never stored on our
                    servers.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                  COD orders are confirmed instantly and shipped as per delivery
                  rules. Please keep the exact amount ready at the time of delivery.
                </div>
              )}
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
                {shippingCost > 0 ? (
                  <span className="text-foreground font-medium">
                    ₹{shippingCost.toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Free
                  </span>
                )}
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
