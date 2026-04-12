import { getUserId } from "@/lib/firebase";
import {
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  ShoppingBag,
  Tag,
  Truck,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  { id: "tracking", label: "Order Tracking", icon: <Truck size={18} /> },
  { id: "addresses", label: "Addresses", icon: <MapPin size={18} /> },
  { id: "coupons", label: "Coupons & Offers", icon: <Tag size={18} /> },
  { id: "profile", label: "Profile Settings", icon: <User size={18} /> },
];

function getInitials(id: string): string {
  return id.slice(0, 2).toUpperCase();
}

function truncateId(id: string): string {
  return id.length > 16 ? `${id.slice(0, 8)}...${id.slice(-4)}` : id;
}

interface DashboardLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardLayout({
  children,
  activeSection,
  onSectionChange,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const userId = getUserId();

  function handleNav(id: string) {
    onSectionChange(id);
    setMobileOpen(false);
  }

  const sidebar = (
    <div
      className="flex flex-col h-full w-[260px]"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.13 0.04 243) 0%, oklch(0.10 0.03 243) 100%)",
        borderRight: "1px solid oklch(0.25 0.05 243 / 0.6)",
      }}
    >
      {/* User profile */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
              boxShadow: "0 0 16px oklch(0.71 0.17 48 / 0.4)",
            }}
          >
            {getInitials(userId)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">
              My Account
            </p>
            <p className="text-xs text-white/60 truncate font-mono">
              {truncateId(userId)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav-${item.id}`}
              onClick={() => handleNav(item.id)}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group"
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.25), oklch(0.76 0.16 72 / 0.15))",
                      color: "oklch(0.88 0.10 48)",
                      boxShadow: "0 0 12px oklch(0.71 0.17 48 / 0.15)",
                    }
                  : {
                      color: "oklch(0.65 0.02 243)",
                    }
              }
            >
              {/* Active left accent bar */}
              {isActive && (
                <motion.div
                  layoutId="active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                    boxShadow: "0 0 8px oklch(0.71 0.17 48 / 0.6)",
                  }}
                />
              )}

              {/* Hover glow */}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.45 0.12 243 / 0.12), oklch(0.7 0.13 195 / 0.08))",
                  }}
                />
              )}

              <span
                className={`relative z-10 ${isActive ? "text-orange-400" : "text-white/40 group-hover:text-white/70"} transition-colors duration-200`}
              >
                {item.icon}
              </span>
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-2 border-t border-white/5">
        <button
          type="button"
          data-ocid="nav-logout"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          onClick={() => {
            localStorage.removeItem("tinkro_user_id");
            window.location.href = "/";
          }}
        >
          <LogOut
            size={18}
            className="group-hover:text-red-400 transition-colors"
          />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.09 0.03 243) 0%, oklch(0.07 0.02 250) 100%)",
      }}
    >
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col shrink-0">{sidebar}</aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
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
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5"
          style={{ background: "oklch(0.12 0.03 243 / 0.9)" }}
        >
          <button
            type="button"
            data-ocid="mobile-menu-toggle"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Menu size={20} />
          </button>
          <span
            className="text-sm font-semibold"
            style={{ color: "oklch(0.88 0.10 48)" }}
          >
            Tinkro Dashboard
          </span>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
