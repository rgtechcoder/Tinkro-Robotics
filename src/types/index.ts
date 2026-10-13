export interface ProductSeoFields {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  keywords?: string[];
  canonicalUrl?: string;
  seoSlug?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  brand?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  category?: string;
  subCategory?: string;
  tags?: string[];
  features?: string[];
  specifications?: Record<
    string,
    string | number | boolean | string[] | number[] | null
  >;
  compatibility?: string[];
  applications?: string[];
  certifications?: string[];
  warranty?: string;
  packageContents?: string[];
  skillLevel?: string;
  difficulty?: string;
  weight?:
    | string
    | {
        value?: number | string;
        unit?: string;
      };
  dimensions?:
    | string
    | {
        length?: number | string;
        width?: number | string;
        height?: number | string;
        unit?: string;
      };
  material?: string;
  countryOfOrigin?: string;
  manufacturer?: string;
}

export interface Product extends ProductSeoFields {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
}

export interface LabTier {
  id: string;
  name: string;
  tagline: string;
  priceRange: string;
  color: string;
  borderColor: string;
  glowColor: string;
  features: string[];
  highlight?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface KitContentItem {
  iconName: string;
  label: string;
  description: string;
  quantity?: number;
}

export interface ProductReview {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

export interface UseCase {
  id: string;
  audience: "students" | "schools" | "beginners";
  title: string;
  description: string;
  icon: string;
  benefit: string;
}

export interface CartItem {
  productId: string;
  sku?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  // Optional variant metadata for pack-of purchases
  variantId?: string;
  variantLabel?: string;
  packQty?: number; // units per pack (e.g., 10 for "Pack of 10")
}

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus = "placed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  shippingCharge?: number;
  shippingRuleId?: string | null;
  shippingRuleName?: string | null;
  coupon: string | null;
  couponId?: string | null;
  couponCode?: string | null;
  couponDiscount?: number;
  status: OrderStatus;
  createdAt: string;
  address: Address;
  userId?: string;
  customerEmail?: string;
  customerName?: string;
  invoiceNumber?: string;
  paymentGateway?: "razorpay" | "cashfree" | "cod";
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  cashfreeOrderId?: string;
  cashfreePaymentId?: string | null;
  cashfreeCfOrderId?: string | null;
  trackingId?: string | null;
  estimatedDelivery?: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: "percent" | "flat";
  minOrder: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (
    product: Pick<
      CartItem,
      | "productId"
      | "sku"
      | "name"
      | "image"
      | "price"
      | "variantId"
      | "variantLabel"
      | "packQty"
    >,
    qty: number,
  ) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface ProductDetailProduct extends ProductSeoFields {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  category: string;
  badge?: string;
  tagline: string;
  benefitDescription: string;
  inStock: boolean;
  kitContents: KitContentItem[];
  problemStatement: string;
  solutionStatement: string;
  outcomeStatement: string;
  useCases: UseCase[];
  reviews: ProductReview[];
}
