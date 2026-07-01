export type MetaAttr = "name" | "property";

export const SITE_URL = "https://tinkro.in";
export const SITE_NAME = "Tinkro";

export function normalizeSeoText(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

export function truncateSeoText(value: string | null | undefined, maxLength = 160) {
  const normalized = normalizeSeoText(value);
  if (normalized.length <= maxLength) return normalized;
  const clipped = normalized.slice(0, maxLength - 1).trimEnd();
  return `${clipped.replace(/[,.!?;:]$/, "")}...`;
}

export function absoluteUrl(value: string | null | undefined) {
  const normalized = normalizeSeoText(value);
  if (!normalized) return `${SITE_URL}/`;
  try {
    return new URL(normalized, SITE_URL).toString();
  } catch {
    return `${SITE_URL}/`;
  }
}

export function upsertMetaTag(
  attrName: MetaAttr,
  attrValue: string,
  content: string,
) {
  const selector = `meta[${attrName}="${attrValue}"]`;
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
  return tag;
}

export function upsertLinkTag(rel: string, href: string) {
  let tag = document.head.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
  return tag;
}

export function removeLinkTag(rel: string) {
  const tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (tag?.parentElement) {
    tag.parentElement.removeChild(tag);
  }
}

export function setJsonLd(id: string, payload: unknown) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
  return script;
}

export function removeJsonLd(id: string) {
  const script = document.getElementById(id);
  if (script?.parentElement) {
    script.parentElement.removeChild(script);
  }
}


