import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getUserOrders,
  sendPromoEmail,
  subscribeToUsers,
  updateUser,
} from "@/lib/adminService";
import type { AdminOrder, AdminUserRecord } from "@/types/admin";
import {
  Calendar,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  Send,
  ShoppingBag,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(val: unknown): string {
  if (!val) return "—";
  const dateValue =
    typeof val === "object" && val && "toDate" in val
      ? (val as { toDate: () => Date }).toDate()
      : val instanceof Date
        ? val
        : new Date(val as string);
  if (Number.isNaN(dateValue.getTime())) return "—";
  return dateValue.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function getInitials(user: AdminUserRecord): string {
  if (user.displayName) {
    const parts = user.displayName.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

function formatOrderDate(val: AdminOrder["createdAt"]): string {
  if (!val) return "—";
  const d = typeof val === "string" ? new Date(val) : val.toDate();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  placed: { label: "Placed", color: "oklch(0.78 0.12 243)" },
  processing: { label: "Processing", color: "oklch(0.85 0.14 72)" },
  shipped: { label: "Shipped", color: "oklch(0.76 0.13 195)" },
  delivered: { label: "Delivered", color: "oklch(0.72 0.15 145)" },
  cancelled: { label: "Cancelled", color: "oklch(0.65 0.18 22)" },
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
];

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/50">
      <Skeleton className="size-10 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-52" />
      </div>
      <Skeleton className="h-4 w-20 hidden sm:block" />
      <Skeleton className="h-4 w-16 hidden md:block" />
      <Skeleton className="h-4 w-20 hidden lg:block" />
      <Skeleton className="h-4 w-24 hidden xl:block" />
      <Skeleton className="h-7 w-12 rounded-full" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );
}

// ─── Avatar Circle ────────────────────────────────────────────────────────────

function UserAvatar({
  user,
  size = "md",
}: { user: AdminUserRecord; size?: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "lg"
      ? "size-14 text-lg"
      : size === "sm"
        ? "size-8 text-xs"
        : "size-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.45 0.12 243) 0%, oklch(0.7 0.13 195) 100%)",
      }}
    >
      {getInitials(user)}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS_CONFIG[status] ?? {
    label: status,
    color: "oklch(0.6 0 0)",
  };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: `${cfg.color}22`,
        color: cfg.color,
        border: `1px solid ${cfg.color}44`,
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── User Detail Dialog ───────────────────────────────────────────────────────

interface UserDetailDialogProps {
  user: AdminUserRecord | null;
  open: boolean;
  onClose: () => void;
}

function UserDetailDialog({ user, open, onClose }: UserDetailDialogProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user || !open) return;
    setLoadingOrders(true);
    setOrders([]);
    getUserOrders(user.uid)
      .then((result) => setOrders(result.slice(0, 10)))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoadingOrders(false));
  }, [user, open]);

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto glass-card border-border/60 p-0">
        {/* Header */}
        <div
          className="p-6 border-b border-border/40"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.45 0.12 243 / 0.08) 0%, oklch(0.7 0.13 195 / 0.06) 100%)",
          }}
        >
          <DialogHeader>
            <div className="flex items-start gap-4">
              <UserAvatar user={user} size="lg" />
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-semibold text-foreground">
                  {user.displayName ?? "No Name"}
                </DialogTitle>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail size={13} />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone size={13} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar size={13} />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-muted-foreground"}`}
                  />
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Total Orders",
                value: user.totalOrders,
                icon: <Package size={16} />,
              },
              {
                label: "Total Spent",
                value: formatCurrency(user.totalSpent),
                icon: <TrendingUp size={16} />,
              },
              {
                label: "Last Order",
                value: user.lastOrderDate
                  ? formatDate(user.lastOrderDate)
                  : "—",
                icon: <ShoppingBag size={16} />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center space-y-1"
                style={{
                  background: "oklch(0.45 0.12 243 / 0.06)",
                  border: "1px solid oklch(0.45 0.12 243 / 0.12)",
                }}
              >
                <div className="flex justify-center text-primary/70">
                  {stat.icon}
                </div>
                <p className="text-base font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShoppingBag size={15} className="text-primary" />
              Recent Orders
            </h3>
            {loadingOrders ? (
              <div className="space-y-2">
                {["o1", "o2", "o3"].map((k) => (
                  <Skeleton key={k} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-xl p-6 text-center border border-dashed border-border/60">
                <Package
                  size={28}
                  className="mx-auto mb-2 text-muted-foreground/40"
                />
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
                    style={{
                      background: "oklch(0.98 0 0 / 0.6)",
                      border: "1px solid oklch(0.88 0.02 243 / 0.5)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-foreground truncate">
                        #{order.id.slice(0, 10)}…
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-semibold text-foreground flex-shrink-0">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Addresses */}
          {user.addresses && user.addresses.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin size={15} className="text-primary" />
                Saved Addresses
              </h3>
              <div className="space-y-2">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-lg px-3 py-2.5"
                    style={{
                      background: "oklch(0.98 0 0 / 0.6)",
                      border: "1px solid oklch(0.88 0.02 243 / 0.5)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {addr.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{addr.street}</p>
                    <p className="text-xs text-muted-foreground">
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <Button variant="outline" className="w-full" onClick={onClose}>
            <X size={14} className="mr-1.5" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const [toggleTarget, setToggleTarget] = useState<AdminUserRecord | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [togglingUid, setTogglingUid] = useState<string | null>(null);

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoSending, setPromoSending] = useState(false);
  const [promoForm, setPromoForm] = useState({
    audience: "all" as "all" | "new" | "inactive" | "active",
    activityDays: "60",
    couponCode: "",
    subject: "",
    message: "",
  });

  // Real-time subscription
  useEffect(() => {
    const unsub = subscribeToUsers((data) => {
      setUsers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Stats
  const stats = useMemo(() => {
    const activeCount = users.filter((u) => u.isActive).length;
    const revenue = users.reduce((sum, u) => sum + (u.totalSpent ?? 0), 0);
    return { total: users.length, active: activeCount, revenue };
  }, [users]);

  // Filtered list
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.displayName ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const handleViewDetails = useCallback((user: AdminUserRecord) => {
    setSelectedUser(user);
    setDetailOpen(true);
  }, []);

  const handleToggleRequest = useCallback((user: AdminUserRecord) => {
    setToggleTarget(user);
    setConfirmOpen(true);
  }, []);

  const handleToggleConfirm = useCallback(async () => {
    if (!toggleTarget) return;
    setTogglingUid(toggleTarget.uid);
    setConfirmOpen(false);
    try {
      await updateUser(toggleTarget.uid, { isActive: !toggleTarget.isActive });
      toast.success(
        `User ${toggleTarget.isActive ? "deactivated" : "activated"} successfully`,
      );
    } catch {
      toast.error("Failed to update user status");
    } finally {
      setTogglingUid(null);
      setToggleTarget(null);
    }
  }, [toggleTarget]);

  function handlePromoChange(
    key: keyof typeof promoForm,
    value: string,
  ) {
    setPromoForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSendPromo() {
    if (!promoForm.couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (!promoForm.subject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }
    if (!promoForm.message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setPromoSending(true);
    try {
      const result = await sendPromoEmail({
        audience: promoForm.audience,
        activityDays:
          promoForm.audience === "active" || promoForm.audience === "inactive"
            ? Number(promoForm.activityDays) || 60
            : undefined,
        couponCode: promoForm.couponCode.trim().toUpperCase(),
        subject: promoForm.subject.trim(),
        message: promoForm.message.trim(),
      });
      toast.success(
        `Promo sent to ${result.sent} users${result.skipped ? `, skipped ${result.skipped}` : ""}`,
      );
      setPromoOpen(false);
      setPromoForm({
        audience: "all",
        activityDays: "60",
        couponCode: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send promo email");
    } finally {
      setPromoSending(false);
    }
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="p-6 space-y-6"
      >
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Manage registered customers and their activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-border/60"
              onClick={() => setPromoOpen(true)}
              data-ocid="promo-email-open"
            >
              <Send size={14} className="mr-1.5" />
              Send Promo Email
            </Button>
            <Badge
              variant="secondary"
              className="text-sm px-3 py-1.5 font-medium"
            >
              <Users size={14} className="mr-1.5" />
              {stats.total} users
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Users",
              value: stats.total,
              icon: <Users size={20} />,
              gradient: "oklch(0.45 0.12 243 / 0.1)",
              border: "oklch(0.45 0.12 243 / 0.2)",
            },
            {
              label: "Active Users",
              value: stats.active,
              icon: <User size={20} />,
              gradient: "oklch(0.55 0.15 145 / 0.1)",
              border: "oklch(0.55 0.15 145 / 0.2)",
            },
            {
              label: "Total Revenue",
              value: formatCurrency(stats.revenue),
              icon: <TrendingUp size={20} />,
              gradient: "oklch(0.71 0.17 48 / 0.1)",
              border: "oklch(0.71 0.17 48 / 0.2)",
            },
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="rounded-xl p-5 glass-card"
              style={{ background: card.gradient, borderColor: card.border }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">{card.icon}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {card.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border/60"
              data-ocid="users-search"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <SelectTrigger
              className="w-40 bg-card border-border/60"
              data-ocid="users-status-filter"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="rounded-xl overflow-hidden glass-card border border-border/50">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[2.2fr_1fr_0.8fr_0.9fr_1fr_0.8fr_0.8fr] items-center gap-3 px-4 py-3 border-b border-border/40 bg-muted/30">
            {["User", "Phone", "Orders", "Spent", "Joined", "Status", ""].map(
              (col) => (
                <span
                  key={col}
                  className={`text-xs font-semibold text-muted-foreground uppercase tracking-wide ${col === "Orders" || col === "Spent" ? "text-center" : col === "Joined" ? "text-left" : col === "Status" ? "text-center" : col === "" ? "text-right" : ""}`}
                >
                  {col}
                </span>
              ),
            )}
          </div>

          {/* Rows */}
          {loading ? (
            <div>
              {SKELETON_KEYS.map((key) => (
                <SkeletonRow key={key} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
              data-ocid="users-empty-state"
            >
              <Users size={40} className="text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                {search || statusFilter !== "all"
                  ? "No matching users"
                  : "No users yet"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filter."
                  : "Users will appear here once they register."}
              </p>
            </div>
          ) : (
            <div data-ocid="users-list">
              {filtered.map((user, idx) => (
                <motion.div
                  key={user.uid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2.2fr_1fr_0.8fr_0.9fr_1fr_0.8fr_0.8fr] gap-3 items-center px-4 py-3 border-b border-border/30 hover:bg-primary/5 transition-colors group"
                  data-ocid={`user-row-${user.uid}`}
                >
                  {/* User identity */}
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.displayName ?? (
                          <span className="text-muted-foreground italic">
                            No Name
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Phone — hidden on mobile */}
                  <div className="hidden md:block">
                    <span className="text-sm text-muted-foreground">
                      {user.phone ?? "—"}
                    </span>
                  </div>

                  {/* Orders */}
                  <div className="hidden md:flex items-center justify-center gap-1">
                    <Package size={12} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {user.totalOrders}
                    </span>
                  </div>

                  {/* Spent */}
                  <div className="hidden md:flex items-center justify-center">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(user.totalSpent)}
                    </span>
                  </div>

                  {/* Joined */}
                  <div className="hidden lg:flex items-center">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  {/* Active toggle */}
                  <div
                    className="flex items-center justify-center gap-2"
                    data-ocid={`user-toggle-${user.uid}`}
                  >
                    <span
                      className={`hidden md:inline-flex items-center gap-1 text-xs ${user.isActive ? "text-emerald-600" : "text-muted-foreground"}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-muted-foreground/50"}`}
                      />
                    </span>
                    <Label htmlFor={`switch-${user.uid}`} className="sr-only">
                      Toggle active status for {user.email}
                    </Label>
                    <Switch
                      id={`switch-${user.uid}`}
                      checked={user.isActive}
                      disabled={togglingUid === user.uid}
                      onCheckedChange={() => handleToggleRequest(user)}
                    />
                  </div>

                  {/* Actions */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 border-border/60 hover:border-primary/50 hover:text-primary justify-self-end"
                    onClick={() => handleViewDetails(user)}
                    data-ocid={`user-view-${user.uid}`}
                  >
                    <User size={12} className="mr-1" />
                    Details
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* User Detail Dialog */}
        <UserDetailDialog
          user={selectedUser}
          open={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setSelectedUser(null);
          }}
        />

        {/* Toggle Confirm AlertDialog */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent className="glass-card border-border/60">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {toggleTarget?.isActive ? "Deactivate User?" : "Activate User?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {toggleTarget?.isActive
                  ? `This will deactivate ${toggleTarget?.email}. They will not be able to log in.`
                  : `This will activate ${toggleTarget?.email} and restore their access.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setToggleTarget(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleConfirm}
                className={
                  toggleTarget?.isActive
                    ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    : "gradient-primary text-white"
                }
                data-ocid="user-toggle-confirm"
              >
                {toggleTarget?.isActive ? "Deactivate" : "Activate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Promo Email Dialog */}
        <Dialog open={promoOpen} onOpenChange={setPromoOpen}>
          <DialogContent className="max-w-xl glass-card border-border/60">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Send Promo Email
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Audience</Label>
                <Select
                  value={promoForm.audience}
                  onValueChange={(v) => handlePromoChange("audience", v)}
                >
                  <SelectTrigger data-ocid="promo-audience-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All users</SelectItem>
                    <SelectItem value="new">New users (no orders)</SelectItem>
                    <SelectItem value="inactive">Inactive users</SelectItem>
                    <SelectItem value="active">Active users</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  New = no orders. Inactive/Active use last order date.
                </p>
              </div>

              {(promoForm.audience === "inactive" ||
                promoForm.audience === "active") && (
                <div className="space-y-1.5">
                  <Label htmlFor="promo-days">Activity window (days)</Label>
                  <Input
                    id="promo-days"
                    type="number"
                    value={promoForm.activityDays}
                    onChange={(e) =>
                      handlePromoChange("activityDays", e.target.value)
                    }
                    placeholder="60"
                    data-ocid="promo-activity-days"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="promo-coupon">Coupon code</Label>
                <Input
                  id="promo-coupon"
                  value={promoForm.couponCode}
                  onChange={(e) =>
                    handlePromoChange("couponCode", e.target.value.toUpperCase())
                  }
                  placeholder="e.g. SAVE20"
                  className="font-mono uppercase"
                  data-ocid="promo-coupon-input"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="promo-subject">Subject</Label>
                <Input
                  id="promo-subject"
                  value={promoForm.subject}
                  onChange={(e) => handlePromoChange("subject", e.target.value)}
                  placeholder="Special offer from Tinkro"
                  data-ocid="promo-subject-input"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="promo-message">Message</Label>
                <Textarea
                  id="promo-message"
                  rows={5}
                  value={promoForm.message}
                  onChange={(e) => handlePromoChange("message", e.target.value)}
                  placeholder="Short promo message with coupon details"
                  data-ocid="promo-message-input"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setPromoOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendPromo}
                  disabled={promoSending}
                  className="gradient-primary text-white"
                  data-ocid="promo-send-btn"
                >
                  {promoSending ? "Sending…" : "Send Email"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
}
