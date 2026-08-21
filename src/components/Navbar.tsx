import {
  Link,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  UserCircle,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getProductRouteParam } from "../lib/slug";
import {
  searchProducts,
  searchProductsInList,
  useProducts,
} from "../lib/publicDataService";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import type { AdminProduct } from "../types/admin";

const navLinks = [
  { label: "Shop", to: "/products" as const, hasDropdown: true },
  { label: "Lab Setups", to: "/labs" as const },
  { label: "Blog", to: "/blog" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

const ADMIN_EMAILS = [
  "admin@tinkro.com",
  "support@tinkro.com",
];

function SearchDropdown({
  query,
  results,
  totalCount,
  onSelectProduct,
  onViewAll,
}: {
  query: string;
  results: AdminProduct[];
  totalCount: number;
  onSelectProduct: (product: AdminProduct) => void;
  onViewAll: () => void;
}) {
  function handleSelect(product: AdminProduct) {
    onSelectProduct(product);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full mt-2 left-0 right-0 rounded-xl border border-border/40 overflow-hidden z-50"
      style={{
        background: "#ffffff",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 8px 32px rgba(15, 23, 42, 0.06)",
      }}
      aria-label="Search results"
    >
      {results.length === 0 ? (
        <div className="px-4 py-6 text-center" data-ocid="search-empty">
          <div className="text-2xl mb-2">🔍</div>
          <p className="text-sm text-muted-foreground" style={{ color: "#0f172a" }}>
            No products found for{" "}
            <span className="text-foreground font-medium">"{query}"</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1" style={{ color: "#475569" }}>
            Try a different keyword or browse all products.
          </p>
        </div>
      ) : (
        <ul className="py-2 max-h-80 overflow-y-auto">
          {results.map((product, index) => (
            <motion.li
              key={product.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              aria-label={product.name}
            >
              <button
                type="button"
                onClick={() => handleSelect(product)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-primary/10 group transition-colors duration-150"
                data-ocid={`search-result-${product.id}`}
              >
                <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-border/20">
                  <img
                    src={product.image}
                    alt={`${product.name} from Tinkro`}
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5 truncate">
                    {product.category}
                  </p>
                  <p className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {product.name}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right ml-2">
                  <p className="text-sm font-bold" style={{ color: "#F47B20" }}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
      <div className="px-4 py-2 border-t border-border/20">
        {results.length > 0 && totalCount > results.length ? (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            data-ocid="search-view-all"
          >
            View all {totalCount} results for "{query}" →
          </button>
        ) : (
          <Link
            to="/products"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All Products →
          </Link>
        )}
      </div>
    </motion.div>
  );
}

import { useUserAuth } from "@/context/UserAuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

function UserDropdown({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  function handleLogin() {
    navigate({ to: "/login" });
    onClose();
  }

  function handleSignup() {
    navigate({ to: "/login", search: { mode: "signup" } as never });
    onClose();
  }

  function handleNav(path: "/dashboard") {
    navigate({ to: path });
    onClose();
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Sign out failed");
    }
    onClose();
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute top-full right-0 mt-2 w-64 rounded-2xl border overflow-hidden z-50"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.13 0.04 250 / 0.97) 0%, oklch(0.17 0.05 243 / 0.97) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "oklch(0.45 0.12 243 / 0.35)",
          boxShadow:
            "0 12px 40px oklch(0.1 0.08 243 / 0.5), 0 0 0 1px oklch(0.45 0.12 243 / 0.15), inset 0 1px 0 oklch(1 0 0 / 0.07)",
        }}
        data-ocid="user-dropdown"
      >
        <div className="px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Welcome</p>
          <p className="text-xs text-muted-foreground mt-1">
            Login or create an account to view your dashboard and orders.
          </p>
        </div>
        <div className="px-4 pb-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
            data-ocid="user-login-btn"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleSignup}
            className="w-full h-9 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: "oklch(0.14 0.03 243 / 0.6)",
              border: "1px solid oklch(0.30 0.05 243 / 0.7)",
              color: "white",
            }}
            data-ocid="user-signup-btn"
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    );
  }

  // User display info
  const displayName = user.displayName || user.email || "User";
  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (user.email ? user.email[0].toUpperCase() : "U");
  const userLabel = displayName || "My Account";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 w-64 rounded-2xl border overflow-hidden z-50"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.13 0.04 250 / 0.97) 0%, oklch(0.17 0.05 243 / 0.97) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "oklch(0.45 0.12 243 / 0.35)",
        boxShadow:
          "0 12px 40px oklch(0.1 0.08 243 / 0.5), 0 0 0 1px oklch(0.45 0.12 243 / 0.15), inset 0 1px 0 oklch(1 0 0 / 0.07)",
      }}
      data-ocid="user-dropdown"
    >
      {/* User identity */}
      <div className="px-4 py-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.45 0.12 243) 0%, oklch(0.7 0.13 195) 100%)",
            boxShadow: "0 0 12px oklch(0.45 0.12 243 / 0.5)",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          <p
            className="text-xs font-mono truncate"
            style={{ color: "oklch(0.55 0.08 243)" }}
          >
            {userLabel}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-3 mb-1"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, oklch(0.45 0.12 243 / 0.3), transparent)",
        }}
      />

      {/* Menu items */}
      <div className="px-2 py-1.5 space-y-0.5">
        <button
          type="button"
          onClick={() => handleNav("/dashboard")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors duration-150 group"
          data-ocid="user-dropdown-dashboard"
        >
          <LayoutDashboard
            className="w-4 h-4 flex-shrink-0 group-hover:text-primary transition-colors"
            style={{ color: "oklch(0.6 0.1 243)" }}
          />
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => handleNav("/dashboard")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors duration-150 group"
          data-ocid="user-dropdown-orders"
        >
          <ShoppingBag
            className="w-4 h-4 flex-shrink-0 group-hover:text-primary transition-colors"
            style={{ color: "oklch(0.6 0.1 243)" }}
          />
          My Orders
        </button>
      </div>

      {/* Divider */}
      <div
        className="mx-3 mt-1 mb-1"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, oklch(0.45 0.12 243 / 0.25), transparent)",
        }}
      />

      {/* Sign out */}
      <div className="px-2 py-2">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150 group"
          data-ocid="user-dropdown-signout"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </motion.div>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location?.pathname ?? "";
  const itemCount = useCartStore((s) => s.itemCount);
  const wishlistCount = useWishlistStore((s) => s.itemCount);
  const { user } = useUserAuth();
  const isAdminUser = Boolean(
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()),
  );
  const navigate = useNavigate();
  const { products: allProducts } = useProducts();

  const [liveSearchResults, setLiveSearchResults] = useState<AdminProduct[]>([]);

  // Search should never depend on a single in-memory list being ready. If the
  // collection is still loading or stale on a product page, fall back to a
  // direct Firestore lookup so the first search still works immediately.
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setLiveSearchResults((previous) =>
        previous.length === 0 ? previous : [],
      );
      return;
    }

    const listResults = searchProductsInList(allProducts, trimmed);
    if (listResults.length > 0) {
      setLiveSearchResults((previous) => {
        const unchanged =
          previous.length === listResults.length &&
          previous.every((product, index) => product.id === listResults[index]?.id);
        return unchanged ? previous : listResults;
      });
      return;
    }

    let active = true;
    setLiveSearchResults((previous) =>
      previous.length === 0 ? previous : [],
    );
    void searchProducts(trimmed, 8)
      .then((results) => {
        if (active) {
          setLiveSearchResults((previous) => {
            const unchanged =
              previous.length === results.length &&
              previous.every((product, index) => product.id === results[index]?.id);
            return unchanged ? previous : results;
          });
        }
      })
      .catch(() => {
        if (active) {
          setLiveSearchResults((previous) =>
            previous.length === 0 ? previous : [],
          );
        }
      });

    return () => {
      active = false;
    };
  }, [allProducts, searchQuery]);

  const allSearchResults = liveSearchResults;

  const searchResults = useMemo(
    () => allSearchResults.slice(0, 6),
    [allSearchResults],
  );

  const goToFullSearchResults = useCallback(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate({ to: "/products", search: { q: trimmed } });
    setSearchOpen(false);
    setSearchQuery("");
    setShowDropdown(false);
  }, [navigate, searchQuery]);

  const handleSelectProduct = useCallback(
    (product: AdminProduct) => {
      // Clear the old query before navigating so the next product page never
      // retains a stale dropdown from the previous product.
      setSearchOpen(false);
      setSearchQuery("");
      setShowDropdown(false);
      setLiveSearchResults([]);
      setMenuOpen(false);
      setUserMenuOpen(false);
      // Use a real URL navigation for product-to-product searches. TanStack
      // Router can retain the current detail route during a rapid param-only
      // transition; a document navigation guarantees the selected product is
      // loaded on the first click.
      window.location.assign(`/product/${getProductRouteParam(product)}`);
    },
    [],
  );

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setShowDropdown(false);
  }, []);

  // Show dropdown as soon as we have a typed query
  useEffect(() => {
    setShowDropdown(searchQuery.trim().length >= 2);
  }, [searchQuery]);

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideDesktopSearch = desktopSearchContainerRef.current?.contains(target);
      const insideMobileSearch = mobileSearchContainerRef.current?.contains(target);
      if (!insideDesktopSearch && !insideMobileSearch) {
        closeSearch();
      }
    }
    if (searchOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [searchOpen, closeSearch]);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  // Escape key closes both
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeSearch();
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeSearch]);

  // Reset all UI-only search state whenever the route changes, including the
  // first product-page search after a previous product selection.
  useEffect(() => {
    closeSearch();
    setLiveSearchResults([]);
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname, closeSearch]);

  // Extra safety: when we land on a product page, clear the navbar search state
  // before the user attempts a new search, even if the previous route was also a
  // product page and the state had not yet fully settled.
  useEffect(() => {
    if (pathname.startsWith("/product/")) {
      closeSearch();
      setLiveSearchResults([]);
    }
  }, [pathname, closeSearch]);

  // Close mobile menu on route change
  useEffect(() => {
    const unsub = router.subscribe("onLoad", () => {
      setMenuOpen(false);
      closeSearch();
      setUserMenuOpen(false);
    });
    return unsub;
  }, [router, closeSearch]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b border-border shadow-subtle" : "" 
      }`}
      style={{
        background: scrolled ? "oklch(0.12 0.04 250 / 0.92)" : "transparent",
      }}
      data-ocid="nav"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav-logo"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="/assets/brand/logo.png"
              alt="Tinkro"
                  width={140}
                  height={40}
              className="h-10 w-auto object-contain"
              style={{ maxWidth: "140px" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                activeProps={{ className: "text-foreground bg-muted/60" }}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search — Desktop inline */}
            <div
              ref={desktopSearchContainerRef}
              className="relative hidden sm:flex items-center"
              data-ocid="nav-search"
            >
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    key="search-input-wrapper"
                    initial={{ width: 36, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 36, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="relative overflow-visible"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          goToFullSearchResults();
                        }
                      }}
                      placeholder="Search products…"
                      className="w-full h-9 pl-3 pr-16 text-sm rounded-lg border border-border/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-smooth"
                      style={{
                        background: "#ffffff",
                        color: "#0f172a",
                      }}
                      aria-label="Search products"
                      aria-expanded={showDropdown}
                      aria-haspopup="listbox"
                      data-ocid="search-input"
                    />
                    <button
                      type="button"
                      onClick={goToFullSearchResults}
                      className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Search all products"
                      data-ocid="search-submit"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {/* Dropdown */}
                    <AnimatePresence>
                      {showDropdown && (
                        <SearchDropdown
                          query={searchQuery}
                          results={searchResults}
                          totalCount={allSearchResults.length}
                          onSelectProduct={handleSelectProduct}
                          onViewAll={goToFullSearchResults}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.button
                    key="search-icon-btn"
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                    aria-label="Open search"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="w-4.5 h-4.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Cart icon with live badge */}
            <Link
              to="/checkout"
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
              data-ocid="nav-cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground px-1"
                    style={{ background: "oklch(0.71 0.17 48)" }}
                    data-ocid="nav-cart-badge"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Wishlist icon with live badge */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
              data-ocid="nav-wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key="wishlist-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground px-1"
                    style={{ background: "oklch(0.71 0.17 48)" }}
                    data-ocid="nav-wishlist-badge"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User account icon */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-ocid="nav-user"
                style={userMenuOpen ? { color: "oklch(0.71 0.17 48)" } : {}}
              >
                <UserCircle className="w-6 h-6" />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <UserDropdown onClose={() => setUserMenuOpen(false)} />
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex items-center gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-accent text-sm h-8 px-4 rounded-md font-medium transition-smooth"
              data-ocid="nav-cta"
            >
              Shop Now
            </Link>

            {/* Admin Panel button — only visible when signed in as admin */}
            {isAdminUser && (
              <a
                href="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-semibold transition-all duration-200 border"
                style={{
                  background: "oklch(0.71 0.17 48 / 0.12)",
                  borderColor: "oklch(0.71 0.17 48 / 0.40)",
                  color: "oklch(0.88 0.12 48)",
                  boxShadow: "0 0 10px oklch(0.71 0.17 48 / 0.15)",
                }}
                data-ocid="nav-admin-panel"
                aria-label="Open Admin Panel"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Admin
              </a>
            )}

            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              data-ocid="nav-hamburger"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-visible pb-3"
            >
              <div
                ref={mobileSearchContainerRef}
                className="relative"
                data-ocid="nav-search-mobile"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      goToFullSearchResults();
                    }
                  }}
                  placeholder="Search products…"
                  className="w-full h-10 pl-3 pr-20 text-sm rounded-lg border border-border/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-smooth"
                  style={{
                    background: "#ffffff",
                    color: "#0f172a",
                  }}
                  aria-label="Search products"
                  data-ocid="search-input-mobile"
                />
                <button
                  type="button"
                  onClick={goToFullSearchResults}
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Search all products"
                  data-ocid="search-submit-mobile"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <SearchDropdown
                      query={searchQuery}
                      results={searchResults}
                      totalCount={allSearchResults.length}
                      onSelectProduct={handleSelectProduct}
                      onViewAll={goToFullSearchResults}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            menuOpen ? "max-h-[28rem] opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
          style={{
            background: "linear-gradient(135deg, oklch(0.13 0.04 250 / 0.97) 0%, oklch(0.17 0.05 243 / 0.97) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px oklch(0.1 0.08 243 / 0.4)",
            zIndex: 60,
          }}
        >
          <nav className="flex flex-col gap-1 pt-2 border-t border-border/50">
            {/* Mobile search trigger */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="sm:hidden flex items-center gap-2 text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              data-ocid="nav-search-mobile-trigger"
            >
              <Search className="w-4 h-4" />
              Search products…
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                activeProps={{ className: "text-foreground bg-muted/60" }}
              >
                {link.label}
              </Link>
            ))}
            {/* Dashboard link in mobile menu (only when signed in) */}
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
                data-ocid="nav-mobile-dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </Link>
            )}
            {/* Admin Panel — mobile, only for admin users */}
            {isAdminUser && (
              <a
                href="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-left px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={{ color: "oklch(0.88 0.12 48)" }}
                data-ocid="nav-mobile-admin-panel"
              >
                <Settings2 className="w-4 h-4" />
                Admin Panel
              </a>
            )}
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gradient-primary text-primary-foreground hover:opacity-90 text-sm h-9 px-4 rounded-md font-medium transition-smooth"
            >
              Shop Now
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
