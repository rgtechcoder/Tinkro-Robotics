import { h as createLucideIcon, r as reactExports, j as jsxRuntimeExports, X, m as motion, A as AnimatePresence, o as ue } from "./index-O-oxzsBJ.js";
import { I as Image, A as AdminLayout } from "./AdminLayout-DnmFTD6u.js";
import { R as Root, a as Portal, O as Overlay, C as Content, T as Title, b as Close, c as Root2, d as Portal2, e as Overlay2, f as Content2, g as Title2, D as Description2, h as Cancel, A as Action } from "./index-Cu6viimg.js";
import { U as Upload } from "./upload-CzCFB2EH.js";
import { C as Copy } from "./copy-CO8xLQDX.js";
import { T as Trash2 } from "./trash-2-CTLSMskq.js";
import { L as LoaderCircle } from "./loader-circle-DqdZu0w_.js";
import "./external-link-0xBpMtII.js";
import "./ticket-DhyR_LGt.js";
import "./index-IUus9vKR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m10 11 5 3-5 3v-6Z", key: "7ntvm4" }]
];
const FileVideo = createLucideIcon("file-video", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
];
const File = createLucideIcon("file", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
];
const Grid3x3 = createLucideIcon("grid-3x3", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = createLucideIcon("list", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
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
  "sk-media-8"
];
function TypeBadge({ type }) {
  const styles = {
    image: {
      bg: "oklch(0.35 0.10 230 / 0.25)",
      color: "oklch(0.72 0.14 230)",
      label: "Image"
    },
    video: {
      bg: "oklch(0.30 0.12 290 / 0.25)",
      color: "oklch(0.72 0.12 290)",
      label: "Video"
    },
    document: {
      bg: "oklch(0.30 0.04 240 / 0.25)",
      color: "oklch(0.60 0.04 240)",
      label: "Doc"
    }
  };
  const s = styles[type];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide",
      style: {
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.color}30`
      },
      children: s.label
    }
  );
}
function MediaCard({ item, onEdit, onDelete, onCopy, view }) {
  const [hovering, setHovering] = reactExports.useState(false);
  if (view === "list") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-200",
        style: {
          background: "oklch(0.13 0.04 243 / 0.6)",
          borderColor: "oklch(0.22 0.05 243 / 0.4)"
        },
        "data-ocid": "admin-media-list-row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center",
              style: { background: "oklch(0.10 0.03 243)" },
              children: item.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: item.url,
                  alt: item.alt ?? item.filename,
                  className: "w-full h-full object-cover"
                }
              ) : item.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FileVideo, { size: 22, style: { color: "oklch(0.72 0.12 290)" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(File, { size: 22, style: { color: "oklch(0.60 0.04 240)" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white/80 truncate", children: item.filename }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40 mt-0.5", children: [
              formatSize(item.size),
              " · ",
              formatDate(item.uploadedAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: item.type }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onCopy(item.url),
                className: "p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all",
                title: "Copy URL",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onEdit(item),
                className: "p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all",
                title: "Edit",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onDelete(item),
                className: "p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all",
                title: "Delete",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
              }
            )
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 },
      className: "relative rounded-xl overflow-hidden border cursor-pointer",
      style: {
        background: "oklch(0.13 0.04 243 / 0.6)",
        borderColor: hovering ? "oklch(0.71 0.17 48 / 0.4)" : "oklch(0.22 0.05 243 / 0.4)",
        transition: "border-color 0.2s"
      },
      onMouseEnter: () => setHovering(true),
      onMouseLeave: () => setHovering(false),
      "data-ocid": "admin-media-grid-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative aspect-square overflow-hidden",
            style: { background: "oklch(0.10 0.03 243)" },
            children: [
              item.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: item.url,
                  alt: item.alt ?? item.filename,
                  className: "w-full h-full object-cover transition-transform duration-300",
                  style: { transform: hovering ? "scale(1.05)" : "scale(1)" }
                }
              ) : item.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileVideo, { size: 36, style: { color: "oklch(0.72 0.12 290)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/40 uppercase tracking-widest", children: "Video" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(File, { size: 36, style: { color: "oklch(0.60 0.04 240)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/40 uppercase tracking-widest", children: "Doc" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hovering && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.15 },
                  className: "absolute inset-0 flex items-center justify-center gap-2",
                  style: {
                    background: "oklch(0.06 0.03 250 / 0.85)",
                    backdropFilter: "blur(4px)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onCopy(item.url),
                        className: "p-2 rounded-lg text-white/70 hover:text-white transition-all",
                        style: { background: "oklch(0.20 0.05 243 / 0.8)" },
                        title: "Copy URL",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 15 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onEdit(item),
                        className: "p-2 rounded-lg text-white/70 hover:text-white transition-all",
                        style: { background: "oklch(0.20 0.05 243 / 0.8)" },
                        title: "Edit",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 15 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onDelete(item),
                        className: "p-2 rounded-lg text-red-400/80 hover:text-red-400 transition-all",
                        style: { background: "oklch(0.20 0.05 243 / 0.8)" },
                        title: "Delete",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 })
                      }
                    )
                  ]
                },
                "overlay"
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-white/75 truncate", children: item.filename }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/35", children: formatSize(item.size) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: item.type })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/25 mt-1", children: formatDate(item.uploadedAt) })
        ] })
      ]
    }
  );
}
function UploadZone({ onUpload, uploading, progress, queue }) {
  const [dragOver, setDragOver] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onUpload(files);
    },
    [onUpload]
  );
  function handleChange(e) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onUpload(files);
    if (inputRef.current) inputRef.current.value = "";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border-2 border-dashed transition-all duration-200 text-center",
      style: {
        borderColor: dragOver ? "oklch(0.71 0.17 48 / 0.7)" : "oklch(0.30 0.06 243 / 0.6)",
        background: dragOver ? "oklch(0.71 0.17 48 / 0.06)" : "oklch(0.12 0.04 243 / 0.4)"
      },
      onDragOver: (e) => {
        e.preventDefault();
        setDragOver(true);
      },
      onDragLeave: () => setDragOver(false),
      onDrop: handleDrop,
      "data-ocid": "admin-media-upload-zone",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "media-file-input", className: "block p-6 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "media-file-input",
              ref: inputRef,
              type: "file",
              accept: "image/*,video/*",
              multiple: true,
              className: "sr-only",
              onChange: handleChange,
              "data-ocid": "admin-media-file-input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Upload,
            {
              size: 28,
              className: "mx-auto mb-3",
              style: {
                color: dragOver ? "oklch(0.71 0.17 48)" : "oklch(0.50 0.06 243)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white/60", children: dragOver ? "Drop files to upload" : "Drag & drop or click to select files" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/35 mt-1", children: "Supports images and videos" })
        ] }),
        uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-white/50 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[180px]", children: queue[0] ?? "Uploading..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-1.5 rounded-full overflow-hidden",
              style: { background: "oklch(0.20 0.05 243)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "h-full rounded-full",
                  style: {
                    background: "linear-gradient(90deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                    width: `${progress}%`
                  },
                  animate: { width: `${progress}%` },
                  transition: { duration: 0.3 }
                }
              )
            }
          ),
          queue.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/30 mt-1.5", children: [
            queue.length - 1,
            " more file(s) queued"
          ] })
        ] })
      ]
    }
  );
}
function EditDialog({ item, open, onClose, onSave, onCopy }) {
  const [alt, setAlt] = reactExports.useState("");
  const [tagsStr, setTagsStr] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (item) {
      setAlt(item.alt ?? "");
      setTagsStr((item.tags ?? []).join(", "));
    }
  }, [item]);
  async function handleSave() {
    if (!item) return;
    setSaving(true);
    try {
      const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
      await onSave(item.id, alt, tags);
      ue.success("Media updated");
      onClose();
    } catch {
      ue.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Overlay,
      {
        className: "fixed inset-0 z-50",
        style: {
          background: "oklch(0.05 0.02 250 / 0.80)",
          backdropFilter: "blur(8px)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        className: "fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-6 outline-none",
        style: {
          background: "linear-gradient(135deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
          borderColor: "oklch(0.25 0.06 243 / 0.5)",
          boxShadow: "0 30px 80px oklch(0.04 0.03 250 / 0.8)"
        },
        "data-ocid": "admin-media-edit-dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { className: "text-base font-bold text-white", children: "Edit Media" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
              }
            ) })
          ] }),
          item && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center",
                style: { background: "oklch(0.09 0.03 250)" },
                children: item.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.url,
                    alt: item.filename,
                    className: "max-h-full max-w-full object-contain"
                  }
                ) : item.type === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "video",
                    {
                      src: item.url,
                      controls: true,
                      className: "max-h-full max-w-full",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
                    }
                  )
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-white/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(File, { size: 36 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: item.filename })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest", children: "Filename" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "px-3 py-2.5 rounded-lg text-sm text-white/50 font-mono",
                  style: {
                    background: "oklch(0.09 0.03 250)",
                    border: "1px solid oklch(0.20 0.04 243 / 0.4)"
                  },
                  children: item.filename
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "edit-media-alt",
                  className: "block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest",
                  children: "Alt Text"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "edit-media-alt",
                  type: "text",
                  value: alt,
                  onChange: (e) => setAlt(e.target.value),
                  placeholder: "Describe the image for accessibility...",
                  className: "w-full px-3 py-2.5 rounded-lg text-sm text-white/80 outline-none transition-all",
                  style: {
                    background: "oklch(0.09 0.03 250)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.5)"
                  },
                  "data-ocid": "admin-media-alt-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "edit-media-tags",
                  className: "block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest",
                  children: "Tags (comma-separated)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "edit-media-tags",
                  type: "text",
                  value: tagsStr,
                  onChange: (e) => setTagsStr(e.target.value),
                  placeholder: "robot, kit, stem...",
                  className: "w-full px-3 py-2.5 rounded-lg text-sm text-white/80 outline-none transition-all",
                  style: {
                    background: "oklch(0.09 0.03 250)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.5)"
                  },
                  "data-ocid": "admin-media-tags-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest", children: "URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-lg text-xs text-white/40 font-mono truncate",
                    style: {
                      background: "oklch(0.09 0.03 250)",
                      border: "1px solid oklch(0.20 0.04 243 / 0.4)"
                    },
                    children: item.url
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onCopy(item.url),
                    className: "px-3 rounded-lg text-white/60 hover:text-white transition-all shrink-0",
                    style: {
                      background: "oklch(0.18 0.05 243 / 0.8)",
                      border: "1px solid oklch(0.25 0.05 243 / 0.5)"
                    },
                    "aria-label": "Copy URL",
                    "data-ocid": "admin-media-copy-url",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white/75 transition-all border",
                  style: { borderColor: "oklch(0.25 0.05 243 / 0.5)" },
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleSave,
                  disabled: saving,
                  className: "flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all",
                  style: {
                    background: saving ? "oklch(0.45 0.10 48 / 0.5)" : "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                    boxShadow: saving ? "none" : "0 4px 16px oklch(0.71 0.17 48 / 0.35)"
                  },
                  "data-ocid": "admin-media-save-btn",
                  children: [
                    saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                    saving ? "Saving…" : "Save Changes"
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
function DeleteConfirm({ item, open, onClose, onConfirm }) {
  const [deleting, setDeleting] = reactExports.useState(false);
  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal2, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Overlay2,
      {
        className: "fixed inset-0 z-50",
        style: {
          background: "oklch(0.05 0.02 250 / 0.80)",
          backdropFilter: "blur(8px)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content2,
      {
        className: "fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl border p-6 outline-none",
        style: {
          background: "linear-gradient(135deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
          borderColor: "oklch(0.35 0.10 15 / 0.4)",
          boxShadow: "0 30px 80px oklch(0.04 0.03 250 / 0.8)"
        },
        "data-ocid": "admin-media-delete-dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Title2, { className: "text-base font-bold text-white mb-2", children: "Delete Media File" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Description2, { className: "text-sm text-white/50 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white/70", children: item == null ? void 0 : item.filename }),
            " will be permanently removed from Storage and cannot be recovered."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cancel, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white/75 transition-all border",
                style: { borderColor: "oklch(0.25 0.05 243 / 0.5)" },
                children: "Cancel"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleConfirm,
                disabled: deleting,
                className: "flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all",
                style: {
                  background: "linear-gradient(135deg, oklch(0.50 0.18 15), oklch(0.55 0.16 25))",
                  boxShadow: "0 4px 16px oklch(0.50 0.18 15 / 0.35)"
                },
                "data-ocid": "admin-media-delete-confirm-btn",
                children: [
                  deleting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                  deleting ? "Deleting…" : "Delete"
                ]
              }
            ) })
          ] })
        ]
      }
    )
  ] }) });
}
function AdminMediaPage() {
  const [media, setMedia] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [view, setView] = reactExports.useState("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [uploadQueue, setUploadQueue] = reactExports.useState([]);
  const [editItem, setEditItem] = reactExports.useState(null);
  const [deleteItem, setDeleteItem] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const unsub = subscribeToMedia((items) => {
      setMedia(items);
      setLoading(false);
    });
    return unsub;
  }, []);
  function handleCopyUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
      ue.success("URL copied to clipboard!");
    }).catch(() => {
      ue.error("Failed to copy URL");
    });
  }
  async function handleUpload(files) {
    const names = files.map((f) => f.name);
    setUploadQueue(names);
    setUploading(true);
    setUploadProgress(0);
    for (const file of files) {
      setUploadQueue((prev) => prev.filter((n) => n !== file.name));
      try {
        await uploadMedia(file);
        setUploadProgress(100);
        ue.success(`${file.name} uploaded successfully`);
      } catch {
        ue.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    setUploadProgress(0);
    setUploadQueue([]);
    setUploadDialogOpen(false);
  }
  async function handleSaveEdit(id, alt, tags) {
    await updateMedia(id, { alt, tags });
  }
  async function handleConfirmDelete() {
    if (!deleteItem) return;
    try {
      await deleteMedia(deleteItem.id, deleteItem.storagePath);
      ue.success("Media deleted");
      setDeleteItem(null);
    } catch {
      ue.error("Failed to delete media");
    }
  }
  const filtered = media.filter((m) => {
    const matchSearch = search === "" || m.filename.toLowerCase().includes(search.toLowerCase()) || (m.tags ?? []).some(
      (t) => t.toLowerCase().includes(search.toLowerCase())
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
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(File, { size: 18 }),
      color: "oklch(0.70 0.12 230)"
    },
    {
      label: "Images",
      value: totalImages,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 18 }),
      color: "oklch(0.72 0.14 230)"
    },
    {
      label: "Videos",
      value: totalVideos,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileVideo, { size: 18 }),
      color: "oklch(0.72 0.12 290)"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Media Library" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/40 mt-1", children: [
          "Manage images, videos and documents · ",
          media.length,
          " files"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setUploadDialogOpen(true),
          className: "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white self-start sm:self-auto transition-all",
          style: {
            background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
            boxShadow: "0 4px 20px oklch(0.71 0.17 48 / 0.40)"
          },
          "data-ocid": "admin-media-upload-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 16 }),
            "Upload Media"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: statCards.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border px-4 py-3.5 flex items-center gap-3",
        style: {
          background: "oklch(0.13 0.04 243 / 0.6)",
          borderColor: "oklch(0.22 0.05 243 / 0.4)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              style: {
                background: `${s.color.replace(")", " / 0.15)")}`,
                color: s.color
              },
              children: s.icon
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-white", children: s.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: s.label })
          ] })
        ]
      },
      s.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search by filename or tag…",
          className: "flex-1 px-4 py-2.5 rounded-xl text-sm text-white/80 outline-none transition-all",
          style: {
            background: "oklch(0.13 0.04 243 / 0.6)",
            border: "1px solid oklch(0.25 0.05 243 / 0.5)"
          },
          "data-ocid": "admin-media-search"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-1.5 p-1 rounded-xl",
          style: {
            background: "oklch(0.12 0.04 243 / 0.6)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)"
          },
          children: ["all", "image", "video", "document"].map(
            (t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setFilterType(t),
                className: "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                style: filterType === t ? {
                  background: "oklch(0.71 0.17 48 / 0.2)",
                  color: "oklch(0.88 0.10 48)"
                } : { color: "oklch(0.55 0.04 243)" },
                "data-ocid": `admin-media-filter-${t}`,
                children: t
              },
              t
            )
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex gap-1 p-1 rounded-xl",
          style: {
            background: "oklch(0.12 0.04 243 / 0.6)",
            border: "1px solid oklch(0.22 0.05 243 / 0.4)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setView("grid"),
                className: "p-2 rounded-lg transition-all",
                style: view === "grid" ? { background: "oklch(0.25 0.06 243 / 0.8)", color: "white" } : { color: "oklch(0.45 0.04 243)" },
                "data-ocid": "admin-media-view-grid",
                "aria-label": "Grid view",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 15 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setView("list"),
                className: "p-2 rounded-lg transition-all",
                style: view === "list" ? { background: "oklch(0.25 0.06 243 / 0.8)", color: "white" } : { color: "oklch(0.45 0.04 243)" },
                "data-ocid": "admin-media-view-list",
                "aria-label": "List view",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 15 })
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        open: uploadDialogOpen,
        onOpenChange: (v) => !v && !uploading && setUploadDialogOpen(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Overlay,
            {
              className: "fixed inset-0 z-50",
              style: {
                background: "oklch(0.05 0.02 250 / 0.80)",
                backdropFilter: "blur(8px)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Content,
            {
              className: "fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border p-6 outline-none",
              style: {
                background: "linear-gradient(135deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
                borderColor: "oklch(0.25 0.06 243 / 0.5)",
                boxShadow: "0 30px 80px oklch(0.04 0.03 250 / 0.8)"
              },
              "data-ocid": "admin-media-upload-dialog",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { className: "text-base font-bold text-white", children: "Upload Media" }),
                  !uploading && /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UploadZone,
                  {
                    onUpload: handleUpload,
                    uploading,
                    progress: uploadProgress,
                    queue: uploadQueue
                  }
                )
              ]
            }
          )
        ] })
      }
    ),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: view === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-2",
        children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-xl overflow-hidden",
            style: { background: "oklch(0.13 0.04 243 / 0.5)" },
            children: view === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "aspect-square animate-pulse",
                  style: { background: "oklch(0.16 0.04 243)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-3 rounded animate-pulse",
                    style: {
                      background: "oklch(0.20 0.04 243)",
                      width: "70%"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-2 rounded animate-pulse",
                    style: {
                      background: "oklch(0.18 0.04 243)",
                      width: "40%"
                    }
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-lg animate-pulse",
                  style: { background: "oklch(0.18 0.04 243)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-3 rounded animate-pulse",
                    style: {
                      background: "oklch(0.20 0.04 243)",
                      width: "55%"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-2 rounded animate-pulse",
                    style: {
                      background: "oklch(0.18 0.04 243)",
                      width: "35%"
                    }
                  }
                )
              ] })
            ] })
          },
          k
        ))
      }
    ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "admin-media-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
              style: { background: "oklch(0.16 0.04 243)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 28, style: { color: "oklch(0.50 0.06 243)" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-white/60 mb-2", children: search || filterType !== "all" ? "No results found" : "No media files yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/35 max-w-xs mb-5", children: search || filterType !== "all" ? "Try adjusting your search or filter." : "Upload your first image or video to get started." }),
          filterType === "all" && !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setUploadDialogOpen(true),
              className: "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all",
              style: {
                background: "linear-gradient(135deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
                boxShadow: "0 4px 16px oklch(0.71 0.17 48 / 0.35)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 16 }),
                "Upload Media"
              ]
            }
          )
        ]
      }
    ) : view === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        layout: true,
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: filtered.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MediaCard,
          {
            item,
            view,
            onEdit: setEditItem,
            onDelete: setDeleteItem,
            onCopy: handleCopyUrl
          },
          item.id
        )) })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: filtered.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, x: -12 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -12 },
        transition: { duration: 0.18 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          MediaCard,
          {
            item,
            view,
            onEdit: setEditItem,
            onDelete: setDeleteItem,
            onCopy: handleCopyUrl
          }
        )
      },
      item.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditDialog,
      {
        item: editItem,
        open: !!editItem,
        onClose: () => setEditItem(null),
        onSave: handleSaveEdit,
        onCopy: handleCopyUrl
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirm,
      {
        item: deleteItem,
        open: !!deleteItem,
        onClose: () => setDeleteItem(null),
        onConfirm: handleConfirmDelete
      }
    )
  ] }) });
}
export {
  AdminMediaPage as default
};
