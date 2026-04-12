import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";

// ─── Static public pages (lightweight, always needed) ─────────────────────────
import { AboutPage } from "./pages/AboutPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { LabsPage } from "./pages/LabsPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { ProductsPage } from "./pages/ProductsPage";

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
  const { adminUser } = useAdminAuth();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        if (adminUser) {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/admin/login";
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [adminUser]);

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
  component: HomePage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
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
}

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
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
  path: "/blog/$id",
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
  component: () => <Outlet />,
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

const publicRouteTree = rootRoute.addChildren([
  homeRoute,
  productDetailRoute,
  productsRoute,
  labsRoute,
  blogRoute,
  blogDetailRoute,
  aboutRoute,
  contactRoute,
  checkoutRoute,
  orderSuccessRoute,
  dashboardRoute,
]);

const adminRouteTree = adminRootRoute.addChildren([
  adminLoginRoute,
  adminDashboardRoute,
  adminProductsRoute,
  adminCategoriesRoute,
  adminOrdersRoute,
  adminLabSetupRoute,
  adminCouponsRoute,
  adminUsersRoute,
  adminBlogRoute,
  adminBannersRoute,
  adminEnquiriesRoute,
  adminMediaRoute,
  adminShippingRoute,
  adminExportRoute,
  adminEmailRoute,
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
  return (
    <AdminAuthProvider>
      <AppInner />
    </AdminAuthProvider>
  );
}
