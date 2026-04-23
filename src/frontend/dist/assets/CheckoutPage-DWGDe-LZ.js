import { k as createLucideIcon, r as reactExports, j as jsxRuntimeExports, l as createSlot, n as cn, i as useCartStore, c as useNavigate, o as useCoupons, p as useUserAuth, s as subscribeToUserOrders, m as motion, S as ShoppingCart, L as Link, B as Button, q as ChevronRight, P as Package, t as Badge, A as AnimatePresence, X, T as Tag, M as MapPin, v as CircleCheck, w as hasUserRedeemedCoupon, x as ue, y as saveOrder } from "./index-BSySFNaW.js";
import { I as Input } from "./input-WvrEKfGt.js";
import { L as Label } from "./label-S94IPwXu.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DYWDmQv_.js";
import { P as Plus } from "./plus-BF_zKn_b.js";
import { L as LoaderCircle } from "./loader-circle-CDf_HnAJ.js";
import "./index-BEKNyHJC.js";
import "./Combination-uBPLZVtz.js";
import "./index-CJTyfxIJ.js";
import "./chevron-up-D7f72QkX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const existingScript = document.getElementById("razorpay-checkout-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}
function openRazorpayCheckout(options) {
  if (!window.Razorpay) {
    throw new Error("Razorpay SDK not loaded. Call loadRazorpay() first.");
  }
  const rzp = new window.Razorpay(options);
  rzp.open();
}
const RAZORPAY_KEY = "rzp_test_SgfImHq5R6E9Ts";
function fadeSlideProps(i) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" }
  };
}
const emptyForm = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: ""
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
  "West Bengal"
];
function CheckoutPage() {
  const { items, total, updateQty, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { coupons, loading: couponsLoading } = useCoupons();
  const { user, isLoading: authLoading } = useUserAuth();
  const [couponInput, setCouponInput] = reactExports.useState("");
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState(null);
  const [couponError, setCouponError] = reactExports.useState("");
  const [couponChecking, setCouponChecking] = reactExports.useState(false);
  const [orders, setOrders] = reactExports.useState([]);
  const [address, setAddress] = reactExports.useState(emptyForm);
  const [formErrors, setFormErrors] = reactExports.useState({});
  const [isPlacing, setIsPlacing] = reactExports.useState(false);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!(user == null ? void 0 : user.uid)) {
      setOrders([]);
      return;
    }
    const unsub = subscribeToUserOrders(user.uid, (data) => {
      setOrders(data);
    });
    return unsub;
  }, [user == null ? void 0 : user.uid]);
  const discount = appliedCoupon ? appliedCoupon.discountType === "percent" ? Math.round(total * appliedCoupon.discountValue / 100) : Math.min(appliedCoupon.discountValue, total) : 0;
  const grandTotal = Math.max(0, total - discount);
  function getLastOrderDate() {
    if (orders.length === 0) return null;
    const dates = orders.map((o) => new Date(o.createdAt).getTime()).filter((t) => !Number.isNaN(t));
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates));
  }
  function isEligibleForCoupon(coupon) {
    const audience = coupon.audience ?? "all";
    const totalOrders = orders.length;
    const lastOrderDate = getLastOrderDate();
    const activityDays = coupon.activityDays ?? 60;
    const cutoff = new Date(Date.now() - activityDays * 24 * 60 * 60 * 1e3);
    if (audience === "new") return totalOrders === 0;
    if (audience === "inactive") return !lastOrderDate || lastOrderDate < cutoff;
    if (audience === "active") return !!lastOrderDate && lastOrderDate >= cutoff;
    return true;
  }
  async function applyCoupon() {
    if (!(user == null ? void 0 : user.uid)) {
      setCouponError("Please log in to apply a coupon.");
      return;
    }
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    const found = coupons.find((c) => c.code.toUpperCase() === code);
    if (!found || !found.isActive || found.expiresAt && new Date(found.expiresAt) < /* @__PURE__ */ new Date()) {
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
        `Minimum order ₹${found.minOrderAmount.toLocaleString("en-IN")} required for this coupon.`
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
    const savedAmount = found.discountType === "percent" ? Math.round(total * found.discountValue / 100) : Math.min(found.discountValue, total);
    setAppliedCoupon(found);
    setCouponError("");
    ue.success(
      `Coupon applied! You save ₹${savedAmount.toLocaleString("en-IN")}`
    );
  }
  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  }
  function validate() {
    var _a;
    const errs = {};
    const required = [
      "name",
      "phone",
      "line1",
      "city",
      "state",
      "pincode"
    ];
    for (const key of required) {
      if (!((_a = address[key]) == null ? void 0 : _a.trim())) errs[key] = "This field is required";
    }
    if (address.phone && !/^[6-9]\d{9}$/.test(address.phone))
      errs.phone = "Enter a valid 10-digit mobile number";
    if (address.pincode && !/^\d{6}$/.test(address.pincode))
      errs.pincode = "Enter a valid 6-digit pincode";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }
  async function handlePlaceOrder() {
    if (!(user == null ? void 0 : user.uid)) {
      ue.error("Please log in to place an order.");
      navigate({ to: "/login" });
      return;
    }
    if (!validate()) return;
    setIsPlacing(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      ue.error(
        "Failed to load payment gateway. Please check your connection."
      );
      setIsPlacing(false);
      return;
    }
    openRazorpayCheckout({
      key: RAZORPAY_KEY,
      amount: grandTotal * 100,
      // paise
      currency: "INR",
      name: "Tinkro Robotics",
      description: `Order for ${items.length} item${items.length !== 1 ? "s" : ""}`,
      prefill: {
        name: address.name,
        contact: address.phone
      },
      theme: { color: "#f97316" },
      handler: async (response) => {
        setIsPlacing(false);
        setIsProcessing(true);
        try {
          const userId = user.uid;
          const orderData = {
            userId,
            customerEmail: user.email ?? void 0,
            customerName: user.displayName ?? address.name,
            items,
            address: { ...address, id: crypto.randomUUID(), isDefault: false },
            subtotal: total,
            discount,
            total: grandTotal,
            coupon: (appliedCoupon == null ? void 0 : appliedCoupon.code) ?? null,
            couponCode: (appliedCoupon == null ? void 0 : appliedCoupon.code) ?? null,
            couponId: (appliedCoupon == null ? void 0 : appliedCoupon.id) ?? null,
            status: "placed",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id ?? "",
            estimatedDelivery: "5-7 business days",
            trackingId: null
          };
          if (appliedCoupon) {
            orderData.couponDiscount = discount;
          }
          const docId = await saveOrder(orderData);
          clearCart();
          window.location.assign(`/order-success?orderId=${docId}`);
          await navigate({ to: "/order-success", search: { orderId: docId } });
        } catch (err) {
          console.error("Order save failed:", err);
          ue.error(
            "Payment received but order save failed. Please contact support."
          );
        } finally {
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsPlacing(false);
          ue.error("Payment cancelled. Please try again.");
        }
      }
    });
  }
  function handleAddress(key, val) {
    setAddress((prev) => ({ ...prev, [key]: val }));
    if (formErrors[key])
      setFormErrors((prev) => ({ ...prev, [key]: void 0 }));
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "min-h-[70vh] flex flex-col items-center justify-center px-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full gradient-primary flex items-center justify-center mb-6 shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-12 h-12 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-bold mb-3 gradient-text", children: "Your cart is empty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-8 max-w-md", children: "Looks like you haven't added anything yet. Explore our robotics kits and STEM solutions." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/products", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              className: "gradient-orange text-white border-0 shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-smooth",
              "data-ocid": "checkout-empty-cta",
              children: [
                "Continue Shopping",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-2 w-5 h-5" })
              ]
            }
          ) })
        ]
      }
    );
  }
  if (!authLoading && !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "min-h-[70vh] flex flex-col items-center justify-center px-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-10 h-10 text-orange-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-2 text-foreground", children: "Please login to continue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base mb-6 max-w-md", children: "Checkout is available only for logged-in users." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              className: "gradient-orange text-white border-0 shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-smooth",
              onClick: () => navigate({ to: "/login" }),
              children: "Go to Login"
            }
          )
        ]
      }
    );
  }
  if (isProcessing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "min-h-[70vh] flex flex-col items-center justify-center px-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { rotate: 360 },
              transition: {
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear"
              },
              className: "w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mb-6"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold gradient-text mb-2", children: "Processing Your Order..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Please don't close this window." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen gradient-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        className: "bg-card border-b border-border px-4 py-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Secure Checkout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "SSL encrypted · Powered by Razorpay" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            ...fadeSlideProps(0),
            className: "glass-card rounded-2xl p-6",
            "data-ocid": "checkout-order-summary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-bold flex items-center gap-2 mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "Order Summary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
                  items.length,
                  " item",
                  items.length !== 1 ? "s" : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  layout: true,
                  initial: { opacity: 0, x: -16 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: 16, height: 0 },
                  transition: { duration: 0.25 },
                  className: "flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-smooth",
                  "data-ocid": `cart-item-${item.productId}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-xl overflow-hidden border border-border flex-shrink-0 product-image-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: item.image,
                        alt: item.name,
                        className: "w-full h-full object-contain",
                        onError: (e) => {
                          e.target.src = "/assets/images/placeholder.svg";
                        }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate text-foreground", children: item.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                        "₹",
                        item.price.toLocaleString("en-IN"),
                        " × ",
                        item.quantity
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => updateQty(item.productId, item.quantity - 1),
                          className: "w-7 h-7 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/10 transition-smooth flex items-center justify-center",
                          "aria-label": "Decrease quantity",
                          "data-ocid": `qty-decrease-${item.productId}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-7 text-center text-sm font-bold text-foreground", children: item.quantity }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => updateQty(item.productId, item.quantity + 1),
                          className: "w-7 h-7 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/10 transition-smooth flex items-center justify-center",
                          "aria-label": "Increase quantity",
                          "data-ocid": `qty-increase-${item.productId}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground w-20 text-right flex-shrink-0", children: [
                      "₹",
                      (item.price * item.quantity).toLocaleString("en-IN")
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeItem(item.productId),
                        className: "w-7 h-7 rounded-lg hover:bg-destructive/15 hover:text-destructive transition-smooth flex items-center justify-center text-muted-foreground flex-shrink-0",
                        "aria-label": `Remove ${item.name}`,
                        "data-ocid": `remove-item-${item.productId}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                      }
                    )
                  ]
                },
                item.productId
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "₹",
                    total.toLocaleString("en-IN")
                  ] })
                ] }),
                appliedCoupon && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    className: "flex justify-between text-green-600 dark:text-green-400 font-medium",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5" }),
                        "Coupon (",
                        appliedCoupon.code,
                        ")"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "−₹",
                        discount.toLocaleString("en-IN")
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400 font-medium", children: "Free" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-lg font-bold text-foreground pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Grand Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "gradient-text-orange text-xl", children: [
                    "₹",
                    grandTotal.toLocaleString("en-IN")
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            ...fadeSlideProps(2),
            className: "glass-card rounded-2xl p-6",
            "data-ocid": "checkout-address-section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-bold flex items-center gap-2 mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-5 h-5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "Delivery Address" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-name", className: "text-sm font-medium", children: [
                    "Full Name ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "addr-name",
                      value: address.name,
                      onChange: (e) => handleAddress("name", e.target.value),
                      className: formErrors.name ? "border-destructive" : "",
                      "data-ocid": "address-name"
                    }
                  ),
                  formErrors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-phone", className: "text-sm font-medium", children: [
                    "Phone Number ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "addr-phone",
                      value: address.phone,
                      onChange: (e) => handleAddress(
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      ),
                      className: formErrors.phone ? "border-destructive" : "",
                      "data-ocid": "address-phone"
                    }
                  ),
                  formErrors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.phone })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-line1", className: "text-sm font-medium", children: [
                    "Address Line 1 ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "addr-line1",
                      value: address.line1,
                      onChange: (e) => handleAddress("line1", e.target.value),
                      className: formErrors.line1 ? "border-destructive" : "",
                      "data-ocid": "address-line1"
                    }
                  ),
                  formErrors.line1 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.line1 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-line2", className: "text-sm font-medium", children: [
                    "Address Line 2",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-normal", children: "(Optional)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "addr-line2",
                      value: address.line2 ?? "",
                      onChange: (e) => handleAddress("line2", e.target.value),
                      "data-ocid": "address-line2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-city", className: "text-sm font-medium", children: [
                    "City ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "addr-city",
                      value: address.city,
                      onChange: (e) => handleAddress("city", e.target.value),
                      className: formErrors.city ? "border-destructive" : "",
                      "data-ocid": "address-city"
                    }
                  ),
                  formErrors.city && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.city })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-state", className: "text-sm font-medium", children: [
                    "State ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: address.state,
                      onValueChange: (val) => handleAddress("state", val),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            id: "addr-state",
                            className: formErrors.state ? "border-destructive" : "",
                            "data-ocid": "address-state",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select state" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64 overflow-y-auto", children: INDIAN_STATES.map((state) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: state, children: state }, state)) })
                      ]
                    }
                  ),
                  formErrors.state && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.state })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "addr-pincode", className: "text-sm font-medium", children: [
                    "Pincode ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "addr-pincode",
                      value: address.pincode,
                      onChange: (e) => handleAddress(
                        "pincode",
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      ),
                      className: formErrors.pincode ? "border-destructive" : "",
                      "data-ocid": "address-pincode"
                    }
                  ),
                  formErrors.pincode && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formErrors.pincode })
                ] })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 lg:sticky lg:top-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            ...fadeSlideProps(3),
            className: "glass-card rounded-2xl p-6",
            "data-ocid": "checkout-payment-section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-bold flex items-center gap-2 mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "Payment" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-primary-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground text-sm", children: "Secure Payment via Razorpay" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "100% Secure · SSL Encrypted · Powered by Razorpay" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["UPI", "Cards", "NetBanking", "Wallets", "EMI"].map(
                  (method) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-medium bg-card border border-border rounded-lg px-2.5 py-1 text-muted-foreground",
                      children: method
                    },
                    method
                  )
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: `You'll be redirected to Razorpay's secure payment window after clicking "Pay Now". Your card details are never stored on our servers.` })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            ...fadeSlideProps(4),
            className: "glass-card rounded-2xl p-6",
            "data-ocid": "checkout-coupon-section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-bold flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-5 h-5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "Coupon Code" }),
                couponsLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 ml-1 animate-spin text-muted-foreground" })
              ] }),
              appliedCoupon ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  className: "flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-600" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-green-700 dark:text-green-400", children: [
                          appliedCoupon.code,
                          " applied!"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-600 dark:text-green-500", children: [
                          "You save ₹",
                          discount.toLocaleString("en-IN"),
                          appliedCoupon.discountType === "percent" ? ` (${appliedCoupon.discountValue}% off)` : ""
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: removeCoupon,
                        className: "text-muted-foreground hover:text-destructive transition-smooth",
                        "data-ocid": "coupon-remove",
                        "aria-label": "Remove coupon",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: couponInput,
                      onChange: (e) => setCouponInput(e.target.value.toUpperCase()),
                      onKeyDown: (e) => e.key === "Enter" && !couponsLoading && !couponChecking && applyCoupon(),
                      disabled: couponsLoading || couponChecking,
                      className: "flex-1 border-input focus:border-primary/60 transition-smooth uppercase disabled:opacity-50",
                      "data-ocid": "coupon-input",
                      "aria-label": "Coupon code"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      onClick: applyCoupon,
                      disabled: couponsLoading || couponChecking,
                      variant: "outline",
                      className: "border-primary/40 text-primary hover:bg-primary/10 transition-smooth font-semibold disabled:opacity-50",
                      "data-ocid": "coupon-apply",
                      children: couponsLoading || couponChecking ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Apply"
                    }
                  )
                ] }),
                couponError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    initial: { opacity: 0, y: -4 },
                    animate: { opacity: 1, y: 0 },
                    className: "text-sm text-destructive",
                    children: couponError
                  }
                ),
                !couponsLoading && coupons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  coupons.length,
                  " coupon",
                  coupons.length !== 1 ? "s" : "",
                  " available — enter a code above to apply."
                ] }),
                couponsLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground animate-pulse", children: "Loading available coupons…" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            ...fadeSlideProps(5),
            className: "glass-card rounded-2xl p-6 space-y-4",
            "data-ocid": "checkout-place-order-section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Subtotal (",
                    items.reduce((s, i) => s + i.quantity, 0),
                    " items)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "₹",
                    total.toLocaleString("en-IN")
                  ] })
                ] }),
                appliedCoupon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-green-600 dark:text-green-400 font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "−₹",
                    discount.toLocaleString("en-IN")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Delivery" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400 font-medium", children: "Free" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base text-foreground", children: "Total Payable" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-display font-bold gradient-text-orange", children: [
                    "₹",
                    grandTotal.toLocaleString("en-IN")
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "lg",
                  onClick: handlePlaceOrder,
                  disabled: isPlacing || isProcessing,
                  className: "w-full gradient-orange text-white border-0 shadow-glow-orange hover:shadow-glow-orange hover:scale-[1.02] transition-smooth text-base font-bold h-14 relative overflow-hidden",
                  "data-ocid": "checkout-place-order-btn",
                  children: isPlacing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        animate: { rotate: 360 },
                        transition: {
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear"
                        },
                        className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      }
                    ),
                    "Opening Payment..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
                    "Pay Now · ₹",
                    grandTotal.toLocaleString("en-IN"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-muted-foreground", children: [
                "By placing an order, you agree to our",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary cursor-pointer hover:underline", children: "Terms & Conditions" }),
                " ",
                "and",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary cursor-pointer hover:underline", children: "Privacy Policy" }),
                "."
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { ...fadeSlideProps(6), className: "grid grid-cols-3 gap-3", children: [
          { icon: Shield, label: "Secure\nCheckout" },
          { icon: Package, label: "Free\nDelivery" },
          { icon: CircleCheck, label: "Genuine\nProducts" }
        ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-tight font-medium whitespace-pre-line", children: label })
            ]
          },
          label
        )) })
      ] })
    ] })
  ] });
}
export {
  CheckoutPage
};
