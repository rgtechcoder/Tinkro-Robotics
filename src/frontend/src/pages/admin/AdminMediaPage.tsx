import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  deleteMedia,
  subscribeToMedia,
  updateMedia,
  uploadMedia,
} from "@/lib/adminService";
import type { AdminMedia } from "@/types/admin";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Copy,
  Edit,
  File,
  FileVideo,
  Grid3X3,
  Image as ImageIcon,
  List,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const SKELETON_KEYS = [
  "sk-media-1",
  "sk-media-2",
  "sk-media-3",
  "sk-media-4",
  "sk-media-5",
  "sk-media-6",
  "sk-media-7",
  "sk-media-8",
];

type ViewMode = "grid" | "list";
type FilterType = "all" | "image" | "video" | "document";

// ─── Media Card ───────────────────────────────────────────────────────────────

interface MediaCardProps {
  item: AdminMedia;
  onEdit: (item: AdminMedia) => void;
  onDelete: (item: AdminMedia) => void;
  onCopy: (url: string) => void;
  view: ViewMode;
}

function TypeBadge({ type }: { type: AdminMedia["type"] }) {
  const styles: Record<
    AdminMedia["type"],
    { bg: string; color: string; label: string }
  > = {
    image: {
      bg: "oklch(0.35 0.10 230 / 0.25)",
      color: "oklch(0.72 0.14 230)",
      label: "Image",
    },
    video: {
      bg: "oklch(0.30 0.12 290 / 0.25)",
      color: "oklch(0.72 0.12 290)",
      label: "Video",
    },
    document: {
      bg: "oklch(0.30 0.04 240 / 0.25)",
      color: "oklch(0.60 0.04 240)",
      label: "Doc",
    },
  };
  const s = styles[type];
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}30`,
      }}
    >
      {s.label}
    </span>
  );
}

function MediaCard({ item, onEdit, onDelete, onCopy, view }: MediaCardProps) {
  const [hovering, setHovering] = useState(false);

  if (view === "list") {
    return (
      <div
        className="flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-200"
        style={{
          background: "oklch(0.13 0.04 243 / 0.6)",
          borderColor: "oklch(0.22 0.05 243 / 0.4)",
        }}
        data-ocid="admin-media-list-row"
      >
        {/* Thumbnail */}
        <div
          className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
          style={{ background: "oklch(0.10 0.03 243)" }}
        >
          {item.type === "image" ? (
            <img
              src={item.url}
              alt={item.alt ?? item.filename}
              className="w-full h-full object-cover"
            />
          ) : item.type === "video" ? (
            <FileVideo size={22} style={{ color: "oklch(0.72 0.12 290)" }} />
          ) : (
            <File size={22} style={{ color: "oklch(0.60 0.04 240)" }} />
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/80 truncate">
            {item.filename}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {formatSize(item.size)} · {formatDate(item.uploadedAt)}
          </p>
        </div>
        <TypeBadge type={item.type} />
        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onCopy(item.url)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
            title="Copy URL"
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl overflow-hidden border cursor-pointer"
      style={{
        background: "oklch(0.13 0.04 243 / 0.6)",
        borderColor: hovering
          ? "oklch(0.71 0.17 48 / 0.4)"
          : "oklch(0.22 0.05 243 / 0.4)",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      data-ocid="admin-media-grid-card"
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: "oklch(0.10 0.03 243)" }}
      >
        {item.type === "image" ? (
          <img
            src={item.url}
            alt={item.alt ?? item.filename}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: hovering ? "scale(1.05)" : "scale(1)" }}
          />
        ) : item.type === "video" ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <FileVideo size={36} style={{ color: "oklch(0.72 0.12 290)" }} />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              Video
            </span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <File size={36} style={{ color: "oklch(0.60 0.04 240)" }} />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              Doc
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovering && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center gap-2"
              style={{
                background: "oklch(0.06 0.03 250 / 0.85)",
                backdropFilter: "blur(4px)",
              }}
            >
              <button
                type="button"
                onClick={() => onCopy(item.url)}
                className="p-2 rounded-lg text-white/70 hover:text-white transition-all"
                style={{ background: "oklch(0.20 0.05 243 / 0.8)" }}
                title="Copy URL"
              >
                <Copy size={15} />
              </button>
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="p-2 rounded-lg text-white/70 hover:text-white transition-all"
                style={{ background: "oklch(0.20 0.05 243 / 0.8)" }}
                title="Edit"
              >
                <Edit size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="p-2 rounded-lg text-red-400/80 hover:text-red-400 transition-all"
                style={{ background: "oklch(0.20 0.05 243 / 0.8)" }}
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card footer */}
      <div className="px-3 py-2.5">
        <p className="text-xs font-medium text-white/75 truncate">
          {item.filename}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-white/35">
            {formatSize(item.size)}
          </span>
          <TypeBadge type={item.type} />
        </div>
        <p className="text-[10px] text-white/25 mt-1">
          {formatDate(item.uploadedAt)}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  uploading: boolean;
  progress: number;
  queue: string[];
}

function UploadZone({ onUpload, uploading, progress, queue }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onUpload(files);
    },
    [onUpload],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onUpload(files);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      className="rounded-xl border-2 border-dashed transition-all duration-200 text-center"
      style={{
        borderColor: dragOver
          ? "oklch(0.71 0.17 48 / 0.7)"
          : "oklch(0.30 0.06 243 / 0.6)",
        background: dragOver
          ? "oklch(0.71 0.17 48 / 0.06)"
          : "oklch(0.12 0.04 243 / 0.4)",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      data-ocid="admin-media-upload-zone"
    >
      <label htmlFor="media-file-input" className="block p-6 cursor-pointer">
        <input
          id="media-file-input"
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="sr-only"
          onChange={handleChange}
          data-ocid="admin-media-file-input"
        />
        <Upload
          size={28}
          className="mx-auto mb-3"
          style={{
            color: dragOver ? "oklch(0.71 0.17 48)" : "oklch(0.50 0.06 243)",
          }}
        />
        <p className="text-sm font-medium text-white/60">
          {dragOver
            ? "Drop files to upload"
            : "Drag & drop or click to select files"}
        </p>
        <p className="text-xs text-white/35 mt-1">Supports images and videos</p>
      </label>

      {uploading && (
        <div className="px-6 pb-5">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="truncate max-w-[180px]">
              {queue[0] ?? "Uploading..."}
            </span>
            <span>{progress}%</span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "oklch(0.20 0.05 243)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                width: `${progress}%`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {queue.length > 1 && (
            <p className="text-[10px] text-white/30 mt-1.5">
              {queue.length - 1} more file(s) queued
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Edit Dialog ──────────────────────────────────────────────────────────────

interface EditDialogProps {
  item: AdminMedia | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, alt: string, tags: string[]) => Promise<void>;
  onCopy: (url: string) => void;
}

function EditDialog({ item, open, onClose, onSave, onCopy }: EditDialogProps) {
  const [alt, setAlt] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setAlt(item.alt ?? "");
      setTagsStr((item.tags ?? []).join(", "));
    }
  }, [item]);

  async function handleSave() {
    if (!item) return;
    setSaving(true);
    try {
      const tags = tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await onSave(item.id, alt, tags);
      toast.success("Media updated");
      onClose();
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{
            background: "oklch(0.05 0.02 250 / 0.80)",
            backdropFilter: "blur(8px)",
          }}
        />
        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-6 outline-none"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
            borderColor: "oklch(0.25 0.06 243 / 0.5)",
            boxShadow: "0 30px 80px oklch(0.04 0.03 250 / 0.8)",
          }}
          data-ocid="admin-media-edit-dialog"
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-bold text-white">
              Edit Media
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {item && (
            <div className="space-y-4">
              {/* Preview */}
              <div
                className="w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: "oklch(0.09 0.03 250)" }}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : item.type === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={item.url}
                    controls
                    className="max-h-full max-w-full"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/30">
                    <File size={36} />
                    <span className="text-sm">{item.filename}</span>
                  </div>
                )}
              </div>

              {/* Filename (read-only) */}
              <div>
                <span className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest">
                  Filename
                </span>
                <div
                  className="px-3 py-2.5 rounded-lg text-sm text-white/50 font-mono"
                  style={{
                    background: "oklch(0.09 0.03 250)",
                    border: "1px solid oklch(0.20 0.04 243 / 0.4)",
                  }}
                >
                  {item.filename}
                </div>
              </div>

              {/* Alt text */}
              <div>
                <label
                  htmlFor="edit-media-alt"
                  className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest"
                >
                  Alt Text
                </label>
                <input
                  id="edit-media-alt"
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Describe the image for accessibility..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white/80 outline-none transition-all"
                  style={{
                    background: "oklch(0.09 0.03 250)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                  }}
                  data-ocid="admin-media-alt-input"
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="edit-media-tags"
                  className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest"
                >
                  Tags (comma-separated)
                </label>
                <input
                  id="edit-media-tags"
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="robot, kit, stem..."
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white/80 outline-none transition-all"
                  style={{
                    background: "oklch(0.09 0.03 250)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                  }}
                  data-ocid="admin-media-tags-input"
                />
              </div>

              {/* URL (read-only + copy) */}
              <div>
                <span className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest">
                  URL
                </span>
                <div className="flex gap-2">
                  <div
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-lg text-xs text-white/40 font-mono truncate"
                    style={{
                      background: "oklch(0.09 0.03 250)",
                      border: "1px solid oklch(0.20 0.04 243 / 0.4)",
                    }}
                  >
                    {item.url}
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopy(item.url)}
                    className="px-3 rounded-lg text-white/60 hover:text-white transition-all shrink-0"
                    style={{
                      background: "oklch(0.18 0.05 243 / 0.8)",
                      border: "1px solid oklch(0.25 0.05 243 / 0.5)",
                    }}
                    aria-label="Copy URL"
                    data-ocid="admin-media-copy-url"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white/75 transition-all border"
                  style={{ borderColor: "oklch(0.25 0.05 243 / 0.5)" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: saving
                      ? "oklch(0.45 0.10 48 / 0.5)"
                      : "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                    boxShadow: saving
                      ? "none"
                      : "0 4px 16px oklch(0.71 0.17 48 / 0.35)",
                  }}
                  data-ocid="admin-media-save-btn"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

interface DeleteConfirmProps {
  item: AdminMedia | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteConfirm({ item, open, onClose, onConfirm }: DeleteConfirmProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="fixed inset-0 z-50"
          style={{
            background: "oklch(0.05 0.02 250 / 0.80)",
            backdropFilter: "blur(8px)",
          }}
        />
        <AlertDialog.Content
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl border p-6 outline-none"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
            borderColor: "oklch(0.35 0.10 15 / 0.4)",
            boxShadow: "0 30px 80px oklch(0.04 0.03 250 / 0.8)",
          }}
          data-ocid="admin-media-delete-dialog"
        >
          <AlertDialog.Title className="text-base font-bold text-white mb-2">
            Delete Media File
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-white/50 mb-5">
            <strong className="text-white/70">{item?.filename}</strong> will be
            permanently removed from Storage and cannot be recovered.
          </AlertDialog.Description>
          <div className="flex gap-3">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white/75 transition-all border"
                style={{ borderColor: "oklch(0.25 0.05 243 / 0.5)" }}
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.50 0.18 15), oklch(0.55 0.16 25))",
                  boxShadow: "0 4px 16px oklch(0.50 0.18 15 / 0.35)",
                }}
                data-ocid="admin-media-delete-confirm-btn"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminMediaPage() {
  const [media, setMedia] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const [editItem, setEditItem] = useState<AdminMedia | null>(null);
  const [deleteItem, setDeleteItem] = useState<AdminMedia | null>(null);

  // Real-time subscription
  useEffect(() => {
    const unsub = subscribeToMedia((items) => {
      setMedia(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Copy URL
  function handleCopyUrl(url: string) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy URL");
      });
  }

  // Upload queue processing
  async function handleUpload(files: File[]) {
    const names = files.map((f) => f.name);
    setUploadQueue(names);
    setUploading(true);
    setUploadProgress(0);

    for (const file of files) {
      setUploadQueue((prev) => prev.filter((n) => n !== file.name));
      try {
        await uploadMedia(file);
        setUploadProgress(100);
        toast.success(`${file.name} uploaded successfully`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    setUploadQueue([]);
    setUploadDialogOpen(false);
  }

  // Edit / save
  async function handleSaveEdit(id: string, alt: string, tags: string[]) {
    await updateMedia(id, { alt, tags });
  }

  // Delete
  async function handleConfirmDelete() {
    if (!deleteItem) return;
    try {
      await deleteMedia(deleteItem.id, deleteItem.storagePath);
      toast.success("Media deleted");
      setDeleteItem(null);
    } catch {
      toast.error("Failed to delete media");
    }
  }

  // Filtered items
  const filtered = media.filter((m) => {
    const matchSearch =
      search === "" ||
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      (m.tags ?? []).some((t) =>
        t.toLowerCase().includes(search.toLowerCase()),
      );
    const matchType = filterType === "all" || m.type === filterType;
    return matchSearch && matchType;
  });

  const totalImages = media.filter((m) => m.type === "image").length;
  const totalVideos = media.filter((m) => m.type === "video").length;

  const statCards = [
    {
      label: "Total Files",
      value: media.length,
      icon: <File size={18} />,
      color: "oklch(0.70 0.12 230)",
    },
    {
      label: "Images",
      value: totalImages,
      icon: <ImageIcon size={18} />,
      color: "oklch(0.72 0.14 230)",
    },
    {
      label: "Videos",
      value: totalVideos,
      icon: <FileVideo size={18} />,
      color: "oklch(0.72 0.12 290)",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Media Library</h1>
            <p className="text-sm text-white/40 mt-1">
              Manage images, videos and documents · {media.length} files
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUploadDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white self-start sm:self-auto transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
              boxShadow: "0 4px 20px oklch(0.71 0.17 48 / 0.40)",
            }}
            data-ocid="admin-media-upload-btn"
          >
            <Upload size={16} />
            Upload Media
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border px-4 py-3.5 flex items-center gap-3"
              style={{
                background: "oklch(0.13 0.04 243 / 0.6)",
                borderColor: "oklch(0.22 0.05 243 / 0.4)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${s.color.replace(")", " / 0.15)")}`,
                  color: s.color,
                }}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters + Search ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or tag…"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white/80 outline-none transition-all"
            style={{
              background: "oklch(0.13 0.04 243 / 0.6)",
              border: "1px solid oklch(0.25 0.05 243 / 0.5)",
            }}
            data-ocid="admin-media-search"
          />
          {/* Type filter */}
          <div
            className="flex gap-1.5 p-1 rounded-xl"
            style={{
              background: "oklch(0.12 0.04 243 / 0.6)",
              border: "1px solid oklch(0.22 0.05 243 / 0.4)",
            }}
          >
            {(["all", "image", "video", "document"] as FilterType[]).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={
                    filterType === t
                      ? {
                          background: "oklch(0.71 0.17 48 / 0.2)",
                          color: "oklch(0.88 0.10 48)",
                        }
                      : { color: "oklch(0.55 0.04 243)" }
                  }
                  data-ocid={`admin-media-filter-${t}`}
                >
                  {t}
                </button>
              ),
            )}
          </div>
          {/* View toggle */}
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{
              background: "oklch(0.12 0.04 243 / 0.6)",
              border: "1px solid oklch(0.22 0.05 243 / 0.4)",
            }}
          >
            <button
              type="button"
              onClick={() => setView("grid")}
              className="p-2 rounded-lg transition-all"
              style={
                view === "grid"
                  ? { background: "oklch(0.25 0.06 243 / 0.8)", color: "white" }
                  : { color: "oklch(0.45 0.04 243)" }
              }
              data-ocid="admin-media-view-grid"
              aria-label="Grid view"
            >
              <Grid3X3 size={15} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className="p-2 rounded-lg transition-all"
              style={
                view === "list"
                  ? { background: "oklch(0.25 0.06 243 / 0.8)", color: "white" }
                  : { color: "oklch(0.45 0.04 243)" }
              }
              data-ocid="admin-media-view-list"
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* ── Upload Dialog ── */}
        <Dialog.Root
          open={uploadDialogOpen}
          onOpenChange={(v) => !v && !uploading && setUploadDialogOpen(false)}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              className="fixed inset-0 z-50"
              style={{
                background: "oklch(0.05 0.02 250 / 0.80)",
                backdropFilter: "blur(8px)",
              }}
            />
            <Dialog.Content
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border p-6 outline-none"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
                borderColor: "oklch(0.25 0.06 243 / 0.5)",
                boxShadow: "0 30px 80px oklch(0.04 0.03 250 / 0.8)",
              }}
              data-ocid="admin-media-upload-dialog"
            >
              <div className="flex items-center justify-between mb-5">
                <Dialog.Title className="text-base font-bold text-white">
                  Upload Media
                </Dialog.Title>
                {!uploading && (
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </Dialog.Close>
                )}
              </div>
              <UploadZone
                onUpload={handleUpload}
                uploading={uploading}
                progress={uploadProgress}
                queue={uploadQueue}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* ── Media Content ── */}
        {loading ? (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "space-y-2"
            }
          >
            {SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className="rounded-xl overflow-hidden"
                style={{ background: "oklch(0.13 0.04 243 / 0.5)" }}
              >
                {view === "grid" ? (
                  <>
                    <div
                      className="aspect-square animate-pulse"
                      style={{ background: "oklch(0.16 0.04 243)" }}
                    />
                    <div className="p-3 space-y-2">
                      <div
                        className="h-3 rounded animate-pulse"
                        style={{
                          background: "oklch(0.20 0.04 243)",
                          width: "70%",
                        }}
                      />
                      <div
                        className="h-2 rounded animate-pulse"
                        style={{
                          background: "oklch(0.18 0.04 243)",
                          width: "40%",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4 p-3">
                    <div
                      className="w-12 h-12 rounded-lg animate-pulse"
                      style={{ background: "oklch(0.18 0.04 243)" }}
                    />
                    <div className="flex-1 space-y-2">
                      <div
                        className="h-3 rounded animate-pulse"
                        style={{
                          background: "oklch(0.20 0.04 243)",
                          width: "55%",
                        }}
                      />
                      <div
                        className="h-2 rounded animate-pulse"
                        style={{
                          background: "oklch(0.18 0.04 243)",
                          width: "35%",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="admin-media-empty-state"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "oklch(0.16 0.04 243)" }}
            >
              <ImageIcon size={28} style={{ color: "oklch(0.50 0.06 243)" }} />
            </div>
            <h3 className="text-base font-semibold text-white/60 mb-2">
              {search || filterType !== "all"
                ? "No results found"
                : "No media files yet"}
            </h3>
            <p className="text-sm text-white/35 max-w-xs mb-5">
              {search || filterType !== "all"
                ? "Try adjusting your search or filter."
                : "Upload your first image or video to get started."}
            </p>
            {filterType === "all" && !search && (
              <button
                type="button"
                onClick={() => setUploadDialogOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                  boxShadow: "0 4px 16px oklch(0.71 0.17 48 / 0.35)",
                }}
              >
                <Upload size={16} />
                Upload Media
              </button>
            )}
          </motion.div>
        ) : view === "grid" ? (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filtered.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  view={view}
                  onEdit={setEditItem}
                  onDelete={setDeleteItem}
                  onCopy={handleCopyUrl}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <MediaCard
                    item={item}
                    view={view}
                    onEdit={setEditItem}
                    onDelete={setDeleteItem}
                    onCopy={handleCopyUrl}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── Edit Dialog ── */}
        <EditDialog
          item={editItem}
          open={!!editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSaveEdit}
          onCopy={handleCopyUrl}
        />

        {/* ── Delete Confirm ── */}
        <DeleteConfirm
          item={deleteItem}
          open={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AdminLayout>
  );
}
