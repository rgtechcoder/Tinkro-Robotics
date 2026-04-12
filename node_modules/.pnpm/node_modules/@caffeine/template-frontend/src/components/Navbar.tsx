import { useAdminAuth } from "@/context/AdminAuthContext";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  ChevronDown,
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
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getUserId } from "../lib/firebase";
import { useProducts } from "../lib/publicDataService";
import { useCartStore } from "../store/cartStore";
import type { AdminProduct } from "../types/admin";

const navLinks = [
  { label: "Shop", to: "/products" as const, hasDropdown: true },
  { label: "Lab Setups", to: "/labs" as const },
  { label: "Blog", to: "/blog" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchDropdown({
  query,
  results,
  onSelect,
}: {
  query: string;
  results: AdminProduct[];
  onSelect: () => void;
}) {
  const navigate = useNavigate();

  function handleSelect(id: string) {
    navigate({ to: "/product/$id", params: { id } });
    onSelect();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full mt-2 left-0 right-0 rounded-xl border border-border/40 overflow-hidden z-50"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.14 0.04 250 / 0.96) 0%, oklch(0.18 0.05 243 / 0.96) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 8px 32px oklch(0.1 0.08 243 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.06)",
      }}
      aria-label="Search results"
    >
      {results.length === 0 ? (
        <div className="px-4 py-6 text-center" data-ocid="search-empty">
          <div className="text-2xl mb-2">🔍</div>
          <p className="text-sm text-muted-foreground">
            No results for{" "}
            <span className="text-foreground font-medium">"{query}"</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Try a different keyword or browse all products
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
                onClick={() => handleSelect(product.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 group transition-colors duration-150"
                data-ocid={`search-result-${product.id}`}
              >
                <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-border/20">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md font-medium text-primary-foreground"
                      style={{ background: "oklch(0.45 0.12 243 / 0.7)" }}
                    >
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.71 0.17 48)" }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
      <div className="px-4 py-2 border-t border-border/20">
        <Link
          to="/products"
          onClick={onSelect}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          View all products →
        </Link>
      </div>
    </motion.div>
  );
}

function UserDropdown({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const userId = getUserId();
  const shortId = userId.slice(0, 8).toUpperCase();

  function handleNav(path: "/dashboard") {
    navigate({ to: path });
    onClose();
  }

  function handleSignOut() {
    localStorage.removeItem("tinkro_user_id");
    onClose();
    toast.success("Signed out successfully");
  }

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
          TR
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">My Account</p>
          <p
            className="text-xs font-mono truncate"
            style={{ color: "oklch(0.55 0.08 243)" }}
          >
            ID: {shortId}
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
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const itemCount = useCartStore((s) => s.itemCount);
  const { adminUser } = useAdminAuth();
  const { products: liveProducts } = useProducts();

  const debouncedQuery = useDebounce(searchQuery, 200);

  const searchResults: AdminProduct[] =
    debouncedQuery.trim().length >= 1
      ? liveProducts
          .filter(
            (p) =>
              p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              (Array.isArray(p.tags) &&
                p.tags.some((t) =>
                  t.toLowerCase().includes(debouncedQuery.toLowerCase()),
                )),
          )
          .slice(0, 8)
      : [];

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setShowDropdown(false);
  }, []);

  // Show dropdown as soon as we have a typed query
  useEffect(() => {
    setShowDropdown(debouncedQuery.trim().length >= 1);
  }, [debouncedQuery]);

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        closeSearch();
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        scrolled
          ? "bg-card/95 backdrop-blur-xl border-b border-border shadow-subtle"
          : "bg-transparent"
      }`}
      data-ocid="nav"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav-logo"
          >
            <img
              src="/assets/brand/logo.png"
              alt="Tinkro"
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
              ref={searchContainerRef}
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
                      placeholder="Search products…"
                      className="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-border/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-smooth"
                      style={{
                        background: "oklch(0.14 0.03 250 / 0.8)",
                        color: "oklch(0.95 0 0)",
                      }}
                      aria-label="Search products"
                      aria-expanded={showDropdown}
                      aria-haspopup="listbox"
                      data-ocid="search-input"
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
                          query={debouncedQuery}
                          results={searchResults}
                          onSelect={closeSearch}
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
            {adminUser && (
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
                ref={searchContainerRef}
                className="relative"
                data-ocid="nav-search-mobile"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full h-10 pl-10 pr-10 text-sm rounded-lg border border-border/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-smooth"
                  style={{
                    background: "oklch(0.14 0.03 250 / 0.85)",
                    color: "oklch(0.95 0 0)",
                  }}
                  aria-label="Search products"
                  data-ocid="search-input-mobile"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
                      query={debouncedQuery}
                      results={searchResults}
                      onSelect={closeSearch}
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
            {/* Dashboard link in mobile menu */}
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              data-ocid="nav-mobile-dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
              My Dashboard
            </Link>
            {/* Admin Panel — mobile, only for admin users */}
            {adminUser && (
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
