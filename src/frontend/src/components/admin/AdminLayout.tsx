import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminStore } from "@/store/adminStore";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  HardDrive,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Send,
  ShoppingCart,
  Tag,
  Ticket,
  Truck,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  disabled?: boolean;
}

const CORE_NAV: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/admin/dashboard",
  },
  {
    id: "products",
    label: "Products",
    icon: <Package size={18} />,
    path: "/admin/products",
  },
  {
    id: "categories",
    label: "Categories",
    icon: <Tag size={18} />,
    path: "/admin/categories",
  },
  {
    id: "orders",
    label: "Orders",
    icon: <ShoppingCart size={18} />,
    path: "/admin/orders",
  },
  {
    id: "lab-setup",
    label: "Lab Setup",
    icon: <FlaskConical size={18} />,
    path: "/admin/lab-setup",
  },
  {
    id: "coupons",
    label: "Coupons",
    icon: <Ticket size={18} />,
    path: "/admin/coupons",
  },
  {
    id: "users",
    label: "Users",
    icon: <Users size={18} />,
    path: "/admin/users",
  },
  {
    id: "blog",
    label: "Blog / CMS",
    icon: <FileText size={18} />,
    path: "/admin/blog",
  },
  {
    id: "banners",
    label: "Banners & Popups",
    icon: <Image size={18} />,
    path: "/admin/banners",
  },
  {
    id: "enquiries",
    label: "Enquiries & Leads",
    icon: <Mail size={18} />,
    path: "/admin/enquiries",
  },
  {
    id: "media",
    label: "Media Library",
    icon: <HardDrive size={18} />,
    path: "/admin/media",
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: <Truck size={18} />,
    path: "/admin/shipping",
  },
  {
    id: "export",
    label: "Export Data",
    icon: <Download size={18} />,
    path: "/admin/export",
  },
  {
    id: "email",
    label: "Email Automation",
    icon: <Send size={18} />,
    path: "/admin/email",
  },
];

const FUTURE_NAV: NavItem[] = [];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { adminUser, logout } = useAdminAuth();
  const { currentSection } = useAdminStore();
  const router = useRouter();

  const currentPath = router.state.location.pathname;

  function getActiveId() {
    const allNav = [...CORE_NAV, ...FUTURE_NAV];
    const match = allNav.find((n) => n.path === currentPath);
    return match?.id ?? currentSection;
  }

  const activeId = getActiveId();

  async function handleLogout() {
    await logout();
    router.navigate({ to: "/admin/login" });
  }

  const sidebarContent = (
    <div
      className="flex flex-col h-full w-[260px]"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.11 0.04 243) 0%, oklch(0.08 0.03 250) 100%)",
        borderRight: "1px solid oklch(0.22 0.05 243 / 0.5)",
      }}
    >
      {/* Logo + Admin Badge */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden bg-white"
            style={{
              boxShadow: "0 0 0 1px oklch(0.20 0.03 243 / 0.6)",
            }}
          >
            <img
              src="/tinkro%20favicon.png"
              alt="Tinkro"
              className="h-full w-full object-contain p-1"
            />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-wide">
              Tinkro
            </span>
            <span
              className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{
                background: "oklch(0.71 0.17 48 / 0.2)",
                color: "oklch(0.88 0.12 48)",
                border: "1px solid oklch(0.71 0.17 48 / 0.3)",
              }}
            >
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Core Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
          Core Modules
        </p>
        {CORE_NAV.map((item) => {
          const isActive = activeId === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              data-ocid={`admin-nav-${item.id}`}
              onClick={() => setMobileOpen(false)}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group no-underline"
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.18), oklch(0.76 0.16 72 / 0.10))",
                      color: "oklch(0.90 0.10 48)",
                      boxShadow: "0 0 14px oklch(0.71 0.17 48 / 0.12)",
                    }
                  : { color: "oklch(0.60 0.02 243)" }
              }
            >
              {isActive && (
                <motion.div
                  layoutId="admin-active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                    boxShadow: "0 0 8px oklch(0.71 0.17 48 / 0.7)",
                  }}
                />
              )}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "oklch(0.45 0.12 243 / 0.10)" }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${isActive ? "text-orange-400" : "text-white/35 group-hover:text-white/65"}`}
              >
                {item.icon}
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}

        {FUTURE_NAV.length > 0 && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/20">
                Coming Soon
              </p>
            </div>
            {FUTURE_NAV.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium opacity-35 cursor-not-allowed select-none"
                style={{ color: "oklch(0.55 0.02 243)" }}
              >
                <span className="text-white/25">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </>
        )}
      </nav>

      {/* Admin user + Logout */}
      <div className="px-3 pb-4 pt-2 border-t border-white/5 space-y-1">
        {/* View Website — always accessible in sidebar footer */}
        <a
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border"
          style={{
            background: "oklch(0.14 0.03 243 / 0.5)",
            borderColor: "oklch(0.25 0.05 243 / 0.35)",
            color: "oklch(0.55 0.04 243)",
          }}
          data-ocid="admin-sidebar-view-website"
          aria-label="View public website"
        >
          <ExternalLink size={16} />
          <span>View Website</span>
        </a>
        <div
          className="px-3 py-2.5 rounded-lg"
          style={{ background: "oklch(0.15 0.03 243 / 0.6)" }}
        >
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">
            Signed in as
          </p>
          <p className="text-xs text-white/70 truncate font-medium">
            {adminUser?.displayName || adminUser?.email}
          </p>
          <p
            className="text-[10px] font-semibold capitalize mt-0.5"
            style={{ color: "oklch(0.75 0.14 195)" }}
          >
            {adminUser?.role}
          </p>
        </div>
        <button
          type="button"
          data-ocid="admin-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut
            size={18}
            className="group-hover:text-red-400 transition-colors"
          />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  // Derive breadcrumb label
  const breadcrumbLabel =
    CORE_NAV.find((n) => n.id === activeId)?.label ?? "Admin";

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.09 0.03 250) 0%, oklch(0.07 0.02 243) 100%)",
      }}
    >
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden"
            >
              <div className="relative">
                <button
                  type="button"
                  className="absolute top-4 right-[-40px] z-50 p-2 rounded-full bg-white/10 text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header
          className="flex items-center justify-between px-4 md:px-6 py-3.5 border-b"
          style={{
            background: "oklch(0.11 0.04 243 / 0.85)",
            borderColor: "oklch(0.22 0.05 243 / 0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              data-ocid="admin-mobile-menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/30">Admin</span>
              <span className="text-white/20">/</span>
              <span
                className="font-semibold"
                style={{ color: "oklch(0.88 0.10 48)" }}
              >
                {breadcrumbLabel}
              </span>
            </div>
          </div>

          {/* Admin name badge + View Website */}
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border"
              style={{
                background: "oklch(0.16 0.04 243 / 0.6)",
                borderColor: "oklch(0.30 0.06 243 / 0.5)",
                color: "oklch(0.60 0.04 243)",
              }}
              data-ocid="admin-view-website"
              aria-label="View public website"
            >
              <ExternalLink size={13} />
              View Website
            </a>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: "oklch(0.16 0.04 243 / 0.8)",
                border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                color: "oklch(0.70 0.05 243)",
              }}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="/tinkro%20favicon.png"
                  alt="Tinkro"
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <span className="hidden sm:block truncate max-w-[140px]">
                {adminUser?.displayName || adminUser?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
