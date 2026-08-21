import createDOMPurify, { type Config } from "dompurify";

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "blockquote",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
  "img",
  "video",
  "source",
  "pre",
  "code",
  "a",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "span",
  "div",
  "iframe",
] as const;

const ALLOWED_ATTR = [
  "class",
  "id",
  "title",
  "aria-label",
  "href",
  "target",
  "rel",
  "download",
  "src",
  "alt",
  "width",
  "height",
  "loading",
  "decoding",
  "fetchpriority",
  "sizes",
  "poster",
  "controls",
  "autoplay",
  "muted",
  "loop",
  "playsinline",
  "colspan",
  "rowspan",
  "scope",
  "allow",
  "allowfullscreen",
  "frameborder",
  "referrerpolicy",
] as const;

const TRUSTED_IFRAME_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
]);

const SANITIZER_CONFIG: Config = {
  ALLOWED_TAGS: [...ALLOWED_TAGS],
  ALLOWED_ATTR: [...ALLOWED_ATTR],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ["script", "object", "embed", "form", "input", "button", "textarea", "select"],
  FORBID_ATTR: ["style"],
  KEEP_CONTENT: true,
};

let purifier: ReturnType<typeof createDOMPurify> | null = null;
let hooksRegistered = false;

function isSafeUrl(value: string, kind: "href" | "src"): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized.startsWith("javascript:")) return false;
  if (normalized.startsWith("data:")) {
    return kind === "src" && normalized.startsWith("data:image/");
  }
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) return true;
  if (normalized.startsWith("mailto:") || normalized.startsWith("tel:")) return kind === "href";
  if (normalized.startsWith("/") || normalized.startsWith("./") || normalized.startsWith("../")) {
    return true;
  }
  if (normalized.startsWith("#")) return kind === "href";
  return false;
}

function isTrustedIframe(src: string): boolean {
  try {
    const parsed = new URL(src, window.location.origin);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      TRUSTED_IFRAME_HOSTS.has(parsed.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}

function ensureHooks(instance: ReturnType<typeof createDOMPurify>) {
  if (hooksRegistered) return;

  instance.addHook("afterSanitizeAttributes", (node) => {
    if (!(node instanceof Element)) return;
    const tag = node.tagName.toLowerCase();

    if (tag === "a") {
      const href = node.getAttribute("href");
      if (!href || !isSafeUrl(href, "href")) {
        node.removeAttribute("href");
      }

      if (node.getAttribute("target") === "_blank") {
        node.setAttribute("rel", "noopener noreferrer");
      }
    }

    if (tag === "img" || tag === "video" || tag === "source") {
      const src = node.getAttribute("src");
      if (!src || !isSafeUrl(src, "src")) {
        node.removeAttribute("src");
      }
    }

    if (tag === "iframe") {
      const src = node.getAttribute("src") ?? "";
      if (!isTrustedIframe(src)) {
        node.parentNode?.removeChild(node);
        return;
      }

      node.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");
      node.setAttribute("referrerpolicy", "no-referrer");
      node.setAttribute("loading", "lazy");
    }

    for (const attrName of node.getAttributeNames()) {
      if (attrName.toLowerCase().startsWith("on")) {
        node.removeAttribute(attrName);
      }
    }
  });

  hooksRegistered = true;
}

function getPurifier(): ReturnType<typeof createDOMPurify> | null {
  if (typeof window === "undefined") return null;
  if (!purifier) {
    purifier = createDOMPurify(window);
    ensureHooks(purifier);
  }
  return purifier;
}

export function sanitizeKnowledgeHubHtml(html: string): string {
  const instance = getPurifier();
  if (!instance) return html;
  return instance.sanitize(html ?? "", SANITIZER_CONFIG) as string;
}
