import type { Address, CartItem, OrderStatus } from "./index";

// Firebase Timestamp type stub — Firebase is disabled temporarily
interface Timestamp {
  toDate(): Date;
  toMillis(): number;
  seconds: number;
  nanoseconds: number;
}

export type AdminRole = "superAdmin" | "admin" | "editor";

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  displayName: string;
  createdAt: Timestamp | string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  overview?: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: string;
  categoryId: string;
  categoryIds: string[];
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
  discount: number;
  sku: string;
  tags: string[];
  isActive: boolean;
  createdAt: Timestamp | string;
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
  gtin?: string;
  mpn?: string;
  subCategory?: string;
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
  faqs?: {
    question: string;
    answer: string;
  }[];

  // New fields for admin-managed content
  kitContents?: string[];
  useCases?: string[];
  reviewsArray?: {
    name: string;
    rating: number;
    content: string;
  }[];
  demoVideoUrl?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  color: string;
  productCount: number;
  isActive: boolean;
  createdAt: Timestamp | string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  customerEmail?: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  shippingCharge?: number;
  shippingRuleId?: string | null;
  shippingRuleName?: string | null;
  coupon: string | null;
  status: OrderStatus | "processing";
  createdAt: Timestamp | string;
  address: Address;
  trackingId?: string | null;
  estimatedDelivery?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

export interface AdminLabSetup {
  id: string;
  name: string;
  type: "atl" | "pmshri" | "stem" | "robotics";
  description: string;
  priceRange: { min: number; max: number };
  includedItems: string[];
  targetAudience: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp | string;
}

export interface RevenueByDay {
  date: string;
  amount: number;
}

export interface OrdersByDay {
  date: string;
  count: number;
}

export interface UsersByDay {
  date: string;
  count: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: AdminOrder[];
  revenueByDay: RevenueByDay[];
  ordersByDay: OrdersByDay[];
  usersByDay: UsersByDay[];
}

export interface AdminFormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  expiresAt?: string;
  usageLimit: number;
  usedCount: number;
  description?: string;
  audience?: "all" | "new" | "inactive" | "active";
  activityDays?: number;
  oneTimePerUser?: boolean;
  createdAt: string;
}

export interface AdminUserRecord {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  isActive: boolean;
  addresses?: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  }>;
}

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  subCategory?: string;
  articleType?: string;
  content: string;
  excerpt: string;
  summary?: string;
  featuredImage?: string;
  images?: string[];
  featuredVideo?: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  authorLinkedIn?: string;
  authorGithub?: string;
  authorWebsite?: string;
  status: "draft" | "published" | "scheduled" | "private";
  pinned?: boolean;
  featured?: boolean;
  trending?: boolean;
  readingTime?: number;
  publishedAt?: string | null;
  scheduledAt?: string;
  tags: string[];
  difficulty?: string;
  ageGroup?: string;
  educationLevel?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  keywords?: string[];
  canonicalUrl?: string;
  robots?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  seoScore?: number;
  googlePreview?: string;
  facebookPreview?: string;
  twitterPreview?: string;
  views: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  type: "banner" | "popup";
  position?: "top" | "bottom" | "center";
  isActive: boolean;
  scheduledFrom?: string;
  scheduledTo?: string;
  createdAt: string;
}

export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  labType: string;
  message: string;
  status: "new" | "contacted" | "closed";
  priority: "high" | "medium" | "low";
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface AdminNewsletterSubscriber {
  id: string;
  name?: string;
  email: string;
  source?: string;
  path?: string;
  userAgent?: string;
  confirmationSent?: boolean;
  confirmationSentAt?: string;
  lastNewsletterSubject?: string;
  lastNewsletterSentAt?: string;
  createdAt: string;
}

export interface AdminNewsletterMessage {
  id: string;
  subject: string;
  message: string;
  audience?: "all" | "confirmed";
  sentAt: string;
  emailId?: string | null;
}

export interface AdminNewsletterBroadcast {
  id: string;
  subject: string;
  message: string;
  audience?: "all" | "confirmed";
  sentAt: string;
  sentCount?: number;
  skippedCount?: number;
}

export interface AdminMedia {
  id: string;
  filename: string;
  url: string;
  storagePath: string;
  size: number;
  type: "image" | "video" | "document";
  mimeType: string;
  tags?: string[];
  alt?: string;
  uploadedAt: string;
  usedIn?: string[];
}

export interface AdminShippingRule {
  id: string;
  name: string;
  description?: string;
  minOrderAmount: number;
  maxOrderAmount?: number;
  baseCost: number;
  freeShippingAbove?: number;
  estimatedDays: number;
  estimatedDaysMax?: number;
  regions: string[];
  isActive: boolean;
  createdAt: string;
}

export interface AdminEmailTemplate {
  id: string;
  type: "orderPlaced" | "orderShipped" | "orderDelivered" | "orderCancelled";
  name: string;
  subject: string;
  htmlContent: string;
  isActive: boolean;
  fromName?: string;
  fromEmail?: string;
  createdAt: string;
  updatedAt?: string;
}
