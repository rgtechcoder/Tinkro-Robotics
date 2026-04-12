export interface Product {
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
  name: string;
  image: string;
  price: number;
  quantity: number;
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

export type OrderStatus = "placed" | "shipped" | "delivered";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  coupon: string | null;
  status: OrderStatus;
  createdAt: string;
  address: Address;
  userId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
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
    product: Pick<CartItem, "productId" | "name" | "image" | "price">,
    qty: number,
  ) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface ProductDetailProduct {
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
