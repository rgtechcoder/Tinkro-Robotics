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
  // Pack/variant pricing for admin-managed packs (e.g., Pack of 1, Pack of 5, Pack of 10)
  variants?: {
    id: string;
    label: string; // e.g. "Pack of 1", "Pack of 5"
    qty: number; // units in the pack
    price: number; // price for the pack (not per-unit)
    sku?: string;
    stock?: number;
  }[];
  // Controls for shop listing order and marketing
  order?: number;
  isBestSeller?: boolean;
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
  categories?: string[];
  subCategory?: string;
  articleType?: string;
  content: string;
  contentFormat?: string;
  aiSummary?: string;
  excerpt: string;
  shortDescription?: string;
  summary?: string;
  keyTakeaways?: string[];
  prerequisites?: string[];
  featuredImage?: string;
  thumbnail?: string;
  images?: string[];
  gallery?: string[];
  featuredVideo?: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  authorLinkedIn?: string;
  authorGithub?: string;
  authorWebsite?: string;
  reviewer?: string;
  editor?: string;
  publishedBy?: string;
  updatedBy?: string;
  socialLinks?: string[];
  status: "draft" | "published" | "scheduled" | "private";
  pinned?: boolean;
  featured?: boolean;
  trending?: boolean;
  readingTime?: number;
  publishDate?: string | null;
  scheduledAt?: string;
  scheduleDate?: string;
  language?: string;
  visibility?: string;
  skillLevel?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | string;
  targetAudience?: string[];
  ageGroup?: string;
  educationLevel?: string;
  estimatedDuration?: string;
  estimatedBuildTime?: string;
  estimatedProjectCost?: string;
  version?: string;
  changeLog?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  keywords?: string[];
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  seoSlug?: string;
  robots?: "index,follow" | "noindex,nofollow" | string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  seoScore?: number;
  readability?: string;
  keywordDensity?: string;
  jsonLdPreview?: string;
  googlePreview?: string;
  facebookPreview?: string;
  twitterPreview?: string;
  learningPath?: string[];
  course?: string[];
  topicCluster?: string[];
  series?: string[];
  technology?: string[];
  programmingLanguage?: string[];
  board?: string[];
  sensors?: string[];
  modules?: string[];
  applications?: string[];
  industries?: string[];
  requiredComponents?: string[];
  billOfMaterials?: string[];
  requiredSoftware?: string[];
  arduinoIdeVersion?: string;
  platform?: string;
  circuitDiagramUrl?: string;
  wiringDiagramUrl?: string;
  githubRepository?: string;
  sourceCodeUrl?: string;
  simulationUrl?: string;
  pcbFiles?: string[];
  gerberFiles?: string[];
  firmware?: string[];
  stlFiles?: string[];
  threeDModels?: string[];
  downloads?: string[];
  resources?: string[];
  datasheets?: string[];
  references?: string[];
  relatedProducts?: string[];
  relatedBlogs?: string[];
  recommendedProducts?: string[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  accessories?: string[];
  replacementParts?: string[];
  upsellProducts?: string[];
  crossSellProducts?: string[];
  relatedTutorials?: string[];
  relatedProjects?: string[];
  faqItems?: Array<{ question: string; answer: string; order: number }>;
  approvalStatus?: string;
  revisionNumber?: string;
  reviewDate?: string;
  publishedAt?: string | null;
  publishedDate?: string | null;
  lastUpdated?: string;
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

export interface AdminCheckoutSettings {
  codEnabled: boolean;
  updatedAt?: string;
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
