const IMAGE_MIME_TO_EXTENSIONS: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "image/svg+xml": ["svg"],
};

const DOCUMENT_MIME_TO_EXTENSIONS: Record<string, string[]> = {
  "application/pdf": ["pdf"],
};

const IMAGE_MIME_TYPES = new Set(Object.keys(IMAGE_MIME_TO_EXTENSIONS));
const DOCUMENT_MIME_TYPES = new Set(Object.keys(DOCUMENT_MIME_TO_EXTENSIONS));

const IMAGE_EXTENSIONS = new Set(
  Object.values(IMAGE_MIME_TO_EXTENSIONS).flat(),
);
const DOCUMENT_EXTENSIONS = new Set(
  Object.values(DOCUMENT_MIME_TO_EXTENSIONS).flat(),
);

const BLOCKED_EXTENSIONS = new Set([
  "exe",
  "bat",
  "cmd",
  "com",
  "msi",
  "dll",
  "sh",
  "ps1",
  "js",
  "mjs",
  "cjs",
  "html",
  "htm",
  "php",
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
]);

const KNOWN_SAFE_EXTENSIONS = new Set([
  ...IMAGE_EXTENSIONS,
  ...DOCUMENT_EXTENSIONS,
]);

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024;

export type AdminUploadPolicy = "image" | "image-or-pdf";

export type AdminUploadValidationResult =
  | { ok: true }
  | { ok: false; message: string };

function getExtension(filename: string): string {
  const clean = filename.trim().toLowerCase();
  const segments = clean.split(".").filter(Boolean);
  if (segments.length < 2) return "";
  return segments[segments.length - 1] ?? "";
}

function hasSuspiciousDoubleExtension(filename: string): boolean {
  const clean = filename.trim().toLowerCase();
  const segments = clean.split(".").filter(Boolean);
  if (segments.length < 3) return false;

  const nonTerminalExtensions = segments.slice(1, -1);
  return nonTerminalExtensions.some((ext) =>
    KNOWN_SAFE_EXTENSIONS.has(ext) || BLOCKED_EXTENSIONS.has(ext),
  );
}

function getAllowedMimesByPolicy(policy: AdminUploadPolicy): Set<string> {
  if (policy === "image") {
    return IMAGE_MIME_TYPES;
  }
  return new Set([...IMAGE_MIME_TYPES, ...DOCUMENT_MIME_TYPES]);
}

function isAllowedMimeExtensionPair(mime: string, extension: string): boolean {
  const imageExts = IMAGE_MIME_TO_EXTENSIONS[mime];
  if (imageExts) return imageExts.includes(extension);

  const docExts = DOCUMENT_MIME_TO_EXTENSIONS[mime];
  if (docExts) return docExts.includes(extension);

  return false;
}

function isImageMime(mime: string): boolean {
  return IMAGE_MIME_TYPES.has(mime);
}

function isDocumentMime(mime: string): boolean {
  return DOCUMENT_MIME_TYPES.has(mime);
}

export function validateAdminUploadFile(
  file: File,
  policy: AdminUploadPolicy,
): AdminUploadValidationResult {
  const extension = getExtension(file.name);
  const mime = (file.type || "").toLowerCase().trim();
  const allowedMimes = getAllowedMimesByPolicy(policy);

  if (!extension) {
    return { ok: false, message: "File must include a valid extension." };
  }

  if (hasSuspiciousDoubleExtension(file.name)) {
    return {
      ok: false,
      message:
        "Suspicious filename detected. Please remove double extensions and try again.",
    };
  }

  if (BLOCKED_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      message:
        "This file type is not allowed for security reasons. Please upload an image or PDF.",
    };
  }

  if (!mime || !allowedMimes.has(mime)) {
    return {
      ok: false,
      message:
        "Unsupported file MIME type. Please upload a valid image or PDF.",
    };
  }

  if (!isAllowedMimeExtensionPair(mime, extension)) {
    return {
      ok: false,
      message:
        "File extension does not match the file type. Please check the file and try again.",
    };
  }

  if (isImageMime(mime) && file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      ok: false,
      message: "Image is too large. Maximum allowed size is 5 MB.",
    };
  }

  if (isDocumentMime(mime) && file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      ok: false,
      message: "Document is too large. Maximum allowed size is 20 MB.",
    };
  }

  if (policy === "image" && !isImageMime(mime)) {
    return {
      ok: false,
      message: "Only image files are allowed for this upload.",
    };
  }

  return { ok: true };
}

export function assertValidAdminUploadFile(
  file: File,
  policy: AdminUploadPolicy,
): void {
  const result = validateAdminUploadFile(file, policy);
  if (!result.ok) {
    throw new Error(result.message);
  }
}

export function normalizeUploadFilename(filename: string): string {
  const safeName = filename
    .replace(/[\\/]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/\.+/g, ".")
    .replace(/^[-.]+|[-.]+$/g, "");

  const segments = safeName.split(".").filter(Boolean);
  if (segments.length === 0) {
    return `file-${Date.now()}`;
  }

  if (segments.length === 1) {
    return segments[0]!.toLowerCase();
  }

  const ext = segments.pop()!.toLowerCase();
  const base = segments.join("-").toLowerCase() || "file";
  return `${base}.${ext}`;
}