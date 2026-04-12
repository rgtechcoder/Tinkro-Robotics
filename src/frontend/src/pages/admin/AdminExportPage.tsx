import { AdminLayout } from "@/components/admin/AdminLayout";
import { exportToExcel } from "@/lib/exportService";
import type { ExportColumn } from "@/lib/exportService";
import {
  Download,
  FileSpreadsheet,
  Mail,
  ShoppingBag,
  Trash2,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DateRange {
  from: string;
  to: string;
}

interface ExportHistoryEntry {
  id: string;
  filename: string;
  timestamp: Date;
  recordCount: number;
  type: "orders" | "users" | "enquiries";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTs(d: Date): string {
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nowFilename(prefix: string): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${prefix}_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

// ─── Shared Card Shell ────────────────────────────────────────────────────────

function CardShell({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl flex flex-col gap-4 p-5"
      style={{
        background: "oklch(0.12 0.03 243 / 0.65)",
        backdropFilter: "blur(20px)",
        border: "1px solid oklch(0.22 0.05 243 / 0.45)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.22), oklch(0.76 0.16 72 / 0.14))",
            border: "1px solid oklch(0.71 0.17 48 / 0.35)",
          }}
        >
          <span style={{ color: "oklch(0.88 0.14 55)" }}>{icon}</span>
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">{title}</h2>
          <p
            className="text-[11px] mt-0.5"
            style={{ color: "oklch(0.50 0.04 243)" }}
          >
            {description}
          </p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Input helpers ────────────────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-medium block mb-1"
      style={{ color: "oklch(0.55 0.05 243)" }}
    >
      {children}
    </span>
  );
}

function StyledInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  "data-ocid": ocid,
}: {
  id?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  "data-ocid"?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-ocid={ocid}
      className="w-full text-xs rounded-lg px-3 py-2 text-white placeholder:text-white/20 outline-none transition-all"
      style={{
        background: "oklch(0.10 0.03 243 / 0.8)",
        border: "1px solid oklch(0.22 0.05 243 / 0.45)",
        colorScheme: "dark",
      }}
      onFocus={(e) => {
        (e.target as HTMLInputElement).style.borderColor =
          "oklch(0.71 0.17 48 / 0.5)";
      }}
      onBlur={(e) => {
        (e.target as HTMLInputElement).style.borderColor =
          "oklch(0.22 0.05 243 / 0.45)";
      }}
    />
  );
}

function StyledSelect({
  value,
  onChange,
  options,
  "data-ocid": ocid,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  "data-ocid"?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-ocid={ocid}
      className="w-full text-xs rounded-lg px-3 py-2 text-white outline-none transition-all appearance-none"
      style={{
        background: "oklch(0.10 0.03 243 / 0.8)",
        border: "1px solid oklch(0.22 0.05 243 / 0.45)",
        colorScheme: "dark",
      }}
    >
      {options.map((o) => (
        <option
          key={o.value}
          value={o.value}
          style={{ background: "oklch(0.13 0.03 243)" }}
        >
          {o.label}
        </option>
      ))}
    </select>
  );
}

function RecordCountBadge({
  count,
  loading,
}: { count: number | null; loading: boolean }) {
  if (loading) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold animate-pulse"
        style={{
          background: "oklch(0.18 0.03 243)",
          color: "oklch(0.45 0.04 243)",
        }}
      >
        Counting…
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{
        background: "oklch(0.71 0.17 48 / 0.15)",
        color: "oklch(0.88 0.12 48)",
        border: "1px solid oklch(0.71 0.17 48 / 0.25)",
      }}
    >
      {count ?? 0} records
    </span>
  );
}

function ExportButton({
  loading,
  onClick,
  label,
  "data-ocid": ocid,
}: {
  loading: boolean;
  onClick: () => void;
  label: string;
  "data-ocid"?: string;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      data-ocid={ocid}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: loading
          ? "oklch(0.35 0.08 48)"
          : "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
        boxShadow: loading ? "none" : "0 0 16px oklch(0.71 0.17 48 / 0.35)",
      }}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Download size={15} />
      )}
      {loading ? "Exporting…" : label}
    </button>
  );
}

// ─── ORDERS EXPORT CARD ───────────────────────────────────────────────────────

const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "placed", label: "Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

const ORDER_COLUMNS: ExportColumn[] = [
  { key: "id", header: "Order ID" },
  { key: "date", header: "Date" },
  { key: "customerEmail", header: "Customer Email" },
  { key: "status", header: "Status" },
  { key: "total", header: "Total (₹)" },
  { key: "itemsCount", header: "Items Count" },
  { key: "trackingId", header: "Tracking ID" },
  { key: "paymentId", header: "Payment ID" },
  { key: "city", header: "City" },
];

function OrdersExportCard({
  onExported,
}: { onExported: (entry: ExportHistoryEntry) => void }) {
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  const fetchCount = useCallback(async () => {
    setCounting(true);
    try {
      // Firebase disabled — return 0 records
      setCount(0);
    } catch {
      setCount(null);
    } finally {
      setCounting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void fetchCount();
  }, [fetchCount]);

  async function handleExport() {
    setLoading(true);
    try {
      // Firebase disabled — export empty dataset
      const rows: Record<string, unknown>[] = [];
      const filename = nowFilename("orders");
      exportToExcel(rows, ORDER_COLUMNS, filename);
      const entry: ExportHistoryEntry = {
        id: crypto.randomUUID(),
        filename: `${filename}.xlsx`,
        timestamp: new Date(),
        recordCount: rows.length,
        type: "orders",
      };
      onExported(entry);
      toast.success(
        rows.length === 0
          ? "No orders to export (Firebase offline)"
          : `Exported ${rows.length} records to ${filename}.xlsx`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell
      icon={<ShoppingBag size={18} />}
      title="Orders"
      description="Export all orders with payment status, items, and shipping details"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FilterLabel>From Date</FilterLabel>
            <StyledInput
              id="orders-from"
              type="date"
              value={dateRange.from}
              onChange={(v) => setDateRange((p) => ({ ...p, from: v }))}
              data-ocid="orders-export-from"
            />
          </div>
          <div>
            <FilterLabel>To Date</FilterLabel>
            <StyledInput
              id="orders-to"
              type="date"
              value={dateRange.to}
              onChange={(v) => setDateRange((p) => ({ ...p, to: v }))}
              data-ocid="orders-export-to"
            />
          </div>
        </div>
        <div>
          <FilterLabel>Status</FilterLabel>
          <StyledSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={ORDER_STATUS_OPTIONS}
            data-ocid="orders-export-status"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <RecordCountBadge count={count} loading={counting} />
        <span className="text-[10px]" style={{ color: "oklch(0.40 0.04 243)" }}>
          .xlsx format
        </span>
      </div>

      <ExportButton
        loading={loading}
        onClick={() => void handleExport()}
        label="Export Orders"
        data-ocid="export-orders-btn"
      />
    </CardShell>
  );
}

// ─── USERS EXPORT CARD ────────────────────────────────────────────────────────

const USER_STATUS_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const USER_COLUMNS: ExportColumn[] = [
  { key: "uid", header: "UID" },
  { key: "email", header: "Email" },
  { key: "displayName", header: "Display Name" },
  { key: "phone", header: "Phone" },
  { key: "totalOrders", header: "Total Orders" },
  { key: "totalSpent", header: "Total Spent (₹)" },
  { key: "joinedDate", header: "Joined Date" },
  { key: "isActive", header: "Active Status" },
];

function UsersExportCard({
  onExported,
}: { onExported: (entry: ExportHistoryEntry) => void }) {
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  const fetchCount = useCallback(async () => {
    setCounting(true);
    // Firebase disabled
    setCount(0);
    setCounting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void fetchCount();
  }, [fetchCount]);

  async function handleExport() {
    setLoading(true);
    try {
      const rows: Record<string, unknown>[] = [];
      const filename = nowFilename("users");
      exportToExcel(rows, USER_COLUMNS, filename);
      const entry: ExportHistoryEntry = {
        id: crypto.randomUUID(),
        filename: `${filename}.xlsx`,
        timestamp: new Date(),
        recordCount: rows.length,
        type: "users",
      };
      onExported(entry);
      toast.success("No users to export (Firebase offline)");
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell
      icon={<Users size={18} />}
      title="Users"
      description="Export all registered users with their order history summary"
    >
      <div className="space-y-3">
        <div>
          <FilterLabel>Status</FilterLabel>
          <StyledSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={USER_STATUS_OPTIONS}
            data-ocid="users-export-status"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FilterLabel>Joined From</FilterLabel>
            <StyledInput
              id="users-from"
              type="date"
              value={dateRange.from}
              onChange={(v) => setDateRange((p) => ({ ...p, from: v }))}
              data-ocid="users-export-from"
            />
          </div>
          <div>
            <FilterLabel>Joined To</FilterLabel>
            <StyledInput
              id="users-to"
              type="date"
              value={dateRange.to}
              onChange={(v) => setDateRange((p) => ({ ...p, to: v }))}
              data-ocid="users-export-to"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <RecordCountBadge count={count} loading={counting} />
        <span className="text-[10px]" style={{ color: "oklch(0.40 0.04 243)" }}>
          .xlsx format
        </span>
      </div>

      <ExportButton
        loading={loading}
        onClick={() => void handleExport()}
        label="Export Users"
        data-ocid="export-users-btn"
      />
    </CardShell>
  );
}

// ─── ENQUIRIES EXPORT CARD ────────────────────────────────────────────────────

const ENQUIRY_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const LAB_TYPE_OPTIONS = [
  { value: "all", label: "All Lab Types" },
  { value: "ATL Lab", label: "ATL Lab" },
  { value: "STEM Lab", label: "STEM Lab" },
  { value: "PM SHRI", label: "PM SHRI" },
  { value: "Robotics Lab", label: "Robotics Lab" },
];

const ENQUIRY_COLUMNS: ExportColumn[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  { key: "labType", header: "Lab Type" },
  { key: "status", header: "Status" },
  { key: "priority", header: "Priority" },
  { key: "message", header: "Message" },
  { key: "createdDate", header: "Created Date" },
  { key: "respondedDate", header: "Responded Date" },
];

function EnquiriesExportCard({
  onExported,
}: { onExported: (entry: ExportHistoryEntry) => void }) {
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [labTypeFilter, setLabTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  const fetchCount = useCallback(async () => {
    setCounting(true);
    // Firebase disabled
    setCount(0);
    setCounting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void fetchCount();
  }, [fetchCount]);

  async function handleExport() {
    setLoading(true);
    try {
      const rows: Record<string, unknown>[] = [];
      const filename = nowFilename("enquiries");
      exportToExcel(rows, ENQUIRY_COLUMNS, filename);
      const entry: ExportHistoryEntry = {
        id: crypto.randomUUID(),
        filename: `${filename}.xlsx`,
        timestamp: new Date(),
        recordCount: rows.length,
        type: "enquiries",
      };
      onExported(entry);
      toast.success("No enquiries to export (Firebase offline)");
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell
      icon={<Mail size={18} />}
      title="Enquiries"
      description="Export all lab setup enquiries and leads"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FilterLabel>Status</FilterLabel>
            <StyledSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={ENQUIRY_STATUS_OPTIONS}
              data-ocid="enquiries-export-status"
            />
          </div>
          <div>
            <FilterLabel>Lab Type</FilterLabel>
            <StyledSelect
              value={labTypeFilter}
              onChange={setLabTypeFilter}
              options={LAB_TYPE_OPTIONS}
              data-ocid="enquiries-export-labtype"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FilterLabel>From Date</FilterLabel>
            <StyledInput
              id="enquiries-from"
              type="date"
              value={dateRange.from}
              onChange={(v) => setDateRange((p) => ({ ...p, from: v }))}
              data-ocid="enquiries-export-from"
            />
          </div>
          <div>
            <FilterLabel>To Date</FilterLabel>
            <StyledInput
              id="enquiries-to"
              type="date"
              value={dateRange.to}
              onChange={(v) => setDateRange((p) => ({ ...p, to: v }))}
              data-ocid="enquiries-export-to"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <RecordCountBadge count={count} loading={counting} />
        <span className="text-[10px]" style={{ color: "oklch(0.40 0.04 243)" }}>
          .xlsx format
        </span>
      </div>

      <ExportButton
        loading={loading}
        onClick={() => void handleExport()}
        label="Export Enquiries"
        data-ocid="export-enquiries-btn"
      />
    </CardShell>
  );
}

// ─── EXPORT HISTORY ───────────────────────────────────────────────────────────

const TYPE_ICON: Record<ExportHistoryEntry["type"], React.ReactNode> = {
  orders: <ShoppingBag size={13} />,
  users: <Users size={13} />,
  enquiries: <Mail size={13} />,
};

const TYPE_COLOR: Record<ExportHistoryEntry["type"], string> = {
  orders: "oklch(0.76 0.14 72)",
  users: "oklch(0.72 0.14 145)",
  enquiries: "oklch(0.76 0.13 195)",
};

function ExportHistory({
  history,
  onClear,
}: {
  history: ExportHistoryEntry[];
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-2xl p-5"
      style={{
        background: "oklch(0.12 0.03 243 / 0.65)",
        backdropFilter: "blur(20px)",
        border: "1px solid oklch(0.22 0.05 243 / 0.45)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.18 0.03 243)" }}
          >
            <FileSpreadsheet
              size={15}
              style={{ color: "oklch(0.65 0.06 243)" }}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Export History</h3>
            <p
              className="text-[11px]"
              style={{ color: "oklch(0.45 0.04 243)" }}
            >
              This session only
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            data-ocid="clear-export-history"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all hover:bg-red-500/10"
            style={{ color: "oklch(0.65 0.15 25)" }}
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div
          className="py-8 text-center rounded-xl"
          style={{ background: "oklch(0.10 0.02 243 / 0.5)" }}
          data-ocid="export-history-empty"
        >
          <FileSpreadsheet
            size={28}
            className="mx-auto mb-2"
            style={{ color: "oklch(0.30 0.04 243)" }}
          />
          <p className="text-xs" style={{ color: "oklch(0.40 0.04 243)" }}>
            No exports yet this session
          </p>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="export-history-list">
          <AnimatePresence>
            {history.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: "oklch(0.10 0.02 243 / 0.5)",
                  border: "1px solid oklch(0.18 0.04 243 / 0.4)",
                }}
              >
                <span style={{ color: TYPE_COLOR[entry.type] }}>
                  {TYPE_ICON[entry.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/80 truncate">
                    {entry.filename}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "oklch(0.45 0.04 243)" }}
                  >
                    {formatTs(entry.timestamp)}
                  </p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: "oklch(0.71 0.17 48 / 0.15)",
                    color: "oklch(0.88 0.12 48)",
                  }}
                >
                  {entry.recordCount} rows
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminExportPage() {
  const [exportHistory, setExportHistory] = useState<ExportHistoryEntry[]>([]);

  function handleExported(entry: ExportHistoryEntry) {
    setExportHistory((prev) => [entry, ...prev]);
  }

  return (
    <AdminLayout>
      <div className="space-y-6" data-ocid="admin-export-page">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-display font-bold text-white">
            Export Data
          </h1>
          <p className="mt-1 text-sm" style={{ color: "oklch(0.50 0.05 243)" }}>
            Download your business data as Excel files
          </p>
        </motion.div>

        {/* Export Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <OrdersExportCard onExported={handleExported} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <UsersExportCard onExported={handleExported} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <EnquiriesExportCard onExported={handleExported} />
          </motion.div>
        </div>

        {/* Export History */}
        <ExportHistory
          history={exportHistory}
          onClear={() => setExportHistory([])}
        />
      </div>
    </AdminLayout>
  );
}
