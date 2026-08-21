import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";

const AdminAuthProvider = lazy(() =>
  import("./context/AdminAuthContext").then((m) => ({ default: m.AdminAuthProvider })),
);

// ─── Static public pages (lightweight, always needed) ─────────────────────────
const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);

const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const BlogPage = lazy(() =>
  import("./pages/BlogPage").then((m) => ({ default: m.BlogPage })),
);
const ContactPage = lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const FaqPage = lazy(() =>
  import("./pages/FaqPage").then((m) => ({ default: m.FaqPage })),
);
const LabsPage = lazy(() =>
  import("./pages/LabsPage").then((m) => ({ default: m.LabsPage })),
);
const OrderSuccessPage = lazy(() =>
  import("./pages/OrderSuccessPage").then((m) => ({ default: m.OrderSuccessPage })),
);
const ProductsPage = lazy(() =>
  import("./pages/ProductsPage").then((m) => ({ default: m.ProductsPage })),
);
const ReturnsPage = lazy(() =>
  import("./pages/ReturnsPage").then((m) => ({ default: m.ReturnsPage })),
);
const ShippingPolicyPage = lazy(() =>
  import("./pages/ShippingPolicyPage").then((m) => ({ default: m.ShippingPolicyPage })),
);
const TrackOrderPage = lazy(() =>
  import("./pages/TrackOrderPage").then((m) => ({ default: m.TrackOrderPage })),
);
const WarrantyPage = lazy(() =>
  import("./pages/WarrantyPage").then((m) => ({ default: m.WarrantyPage })),
);
const WishlistPage = lazy(() =>
  import("./pages/WishlistPage").then((m) => ({ default: m.WishlistPage })),
);
const LoginPage = lazy(() => import("./pages/LoginPage"));

// ─── Lazy-loaded heavy public pages ───────────────────────────────────────────
const ProductDetailPage = lazy(() =>
  import("./pages/ProductDetailPage").then((m) => ({
    default: m.ProductDetailPage,
  })),
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage })),
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const BlogDetailPage = lazy(() =>
  import("./pages/BlogDetailPage").then((m) => ({ default: m.BlogDetailPage })),
);

// ─── Lazy-loaded admin pages ───────────────────────────────────────────────────
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AdminBulkImportPage = lazy(
  () => import("./pages/admin/AdminBulkImportPage"),
);
const AdminBulkKnowledgeHubImportPage = lazy(
  () => import("./pages/admin/AdminBulkKnowledgeHubImportPage"),
);
const AdminCategoriesPage = lazy(
  () => import("./pages/admin/AdminCategoriesPage"),
);
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminLabSetupPage = lazy(() => import("./pages/admin/AdminLabSetupPage"));
const AdminBlogPage = lazy(() => import("./pages/admin/AdminBlogPage"));
const AdminBannersPage = lazy(() => import("./pages/admin/AdminBannersPage"));
const AdminCouponsPage = lazy(() => import("./pages/admin/AdminCouponsPage"));
const AdminEnquiriesPage = lazy(
  () => import("./pages/admin/AdminEnquiriesPage"),
);
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminMediaPage = lazy(() => import("./pages/admin/AdminMediaPage"));
const AdminShippingPage = lazy(() => import("./pages/admin/AdminShippingPage"));
const AdminExportPage = lazy(() => import("./pages/admin/AdminExportPage"));
const AdminEmailPage = lazy(() => import("./pages/admin/AdminEmailPage"));
const AdminNewsletterPage = lazy(
  () => import("./pages/admin/AdminNewsletterPage"),
);

// ─── Skeleton fallbacks ────────────────────────────────────────────────────────
function AdminPageSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 100%)",
      }}
    >
      {/* Sidebar skeleton */}
      <div
        style={{
          width: "260px",
          flexShrink: 0,
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            height: "40px",
            borderRadius: "0.5rem",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "1.5rem",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            style={{
              height: "36px",
              borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.05)",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.07}s`,
            }}
          />
        ))}
      </div>
      {/* Main content skeleton */}
      <div
        style={{
          flex: 1,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            height: "56px",
            borderRadius: "0.75rem",
            background: "rgba(255,255,255,0.05)",
            animation: "pulse 1.5s ease-in-out infinite",
            maxWidth: "320px",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem",
            marginTop: "0.5rem",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: "100px",
                borderRadius: "1rem",
                background: "rgba(255,255,255,0.05)",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            borderRadius: "1rem",
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 1.5s ease-in-out infinite",
            minHeight: "300px",
          }}
        />
      </div>
    </div>
  );
}

function PageLoadingSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid rgba(249,115,22,0.2)",
            borderTopColor: "#f97316",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.875rem",
            margin: 0,
          }}
        >
          Loading…
        </p>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>
    </div>
  );
}

// ─── Global keyboard shortcut: Ctrl+Shift+A ──────────────────────────────────
function KeyboardShortcutHandler() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        window.location.href = isSignedIn ? "/admin/dashboard" : "/admin/login";
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSignedIn]);

  return null;
}

// ─── Root route with public Layout ────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <HomePage />
      </Suspense>
    </ErrorBoundary>
  ),
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$slug",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <ProductDetailPage />
      </Suspense>
    </ErrorBoundary>
  ),
});

interface ProductsSearch {
  category?: string;
  q?: string;
}

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const labsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/labs",
  component: LabsPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});

const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$slug",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <BlogDetailPage />
      </Suspense>
    </ErrorBoundary>
  ),
});

const knowledgeHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/knowledge-hub",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <BlogPage />
      </Suspense>
    </ErrorBoundary>
  ),
});

const knowledgeHubDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/knowledge-hub/$slug",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <BlogDetailPage />
      </Suspense>
    </ErrorBoundary>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FaqPage,
});

const shippingPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipping-policy",
  component: ShippingPolicyPage,
});

const returnsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/returns",
  component: ReturnsPage,
});

const warrantyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/warranty",
  component: WarrantyPage,
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: WishlistPage,
});

const trackOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track-order",
  component: TrackOrderPage,
});

interface ContactSearch {
  subject?: string;
}

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    subject: typeof search.subject === "string" ? search.subject : undefined,
  }),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <CheckoutPage />
      </Suspense>
    </ErrorBoundary>
  ),
});

interface OrderSuccessSearch {
  orderId?: string;
}

const orderSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-success",
  component: OrderSuccessPage,
  validateSearch: (search: Record<string, unknown>): OrderSuccessSearch => ({
    orderId: typeof search.orderId === "string" ? search.orderId : undefined,
  }),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingSkeleton />}>
        <DashboardPage />
      </Suspense>
    </ErrorBoundary>
  ),
});

// ─── Admin root — no public Layout, uses its own AdminLayout ─────────────────
const adminRootRoute = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminAuthProvider>
          <Outlet />
        </AdminAuthProvider>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminLoginRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/login",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminLoginPage />
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/dashboard",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminDashboardPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/products",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminProductsPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminBulkImportRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/bulk-import",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminBulkImportPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminBulkKnowledgeHubImportRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/knowledge-hub-import",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminBulkKnowledgeHubImportPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/categories",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminCategoriesPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/orders",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminOrdersPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminLabSetupRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/lab-setup",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminLabSetupPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminCouponsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/coupons",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminCouponsPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/users",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminUsersPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminBlogRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/blog",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminBlogPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminKnowledgeHubRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/knowledge-hub",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminBlogPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminBannersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/banners",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminBannersPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminEnquiriesRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/enquiries",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminEnquiriesPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminMediaRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/media",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminMediaPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminShippingRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/shipping",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminShippingPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminExportRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/export",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminExportPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminEmailRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/email",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminEmailPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const adminNewsletterRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/newsletter",
  component: () => (
    <ErrorBoundary>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminProtectedRoute>
          <AdminNewsletterPage />
        </AdminProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  ),
});

const publicRouteTree = rootRoute.addChildren([
  homeRoute,
  productDetailRoute,
  productsRoute,
  loginRoute,
  labsRoute,
  blogRoute,
  blogDetailRoute,
  knowledgeHubRoute,
  knowledgeHubDetailRoute,
  aboutRoute,
  faqRoute,
  shippingPolicyRoute,
  returnsRoute,
  warrantyRoute,
  trackOrderRoute,
  contactRoute,
  checkoutRoute,
  orderSuccessRoute,
  dashboardRoute,
  wishlistRoute,
]);

const adminRouteTree = adminRootRoute.addChildren([
  adminLoginRoute,
  adminDashboardRoute,
  adminProductsRoute,
  adminBulkImportRoute,
  adminBulkKnowledgeHubImportRoute,
  adminCategoriesRoute,
  adminOrdersRoute,
  adminLabSetupRoute,
  adminCouponsRoute,
  adminUsersRoute,
  adminBlogRoute,
  adminKnowledgeHubRoute,
  adminBannersRoute,
  adminEnquiriesRoute,
  adminMediaRoute,
  adminShippingRoute,
  adminExportRoute,
  adminEmailRoute,
  adminNewsletterRoute,
]);

// Determine which route tree to use based on path prefix
const isAdminPath = window.location.pathname.startsWith("/admin");
const routeTree = isAdminPath ? adminRouteTree : publicRouteTree;

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppInner() {
  return (
    <>
      <KeyboardShortcutHandler />
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  return <AppInner />;
}
