import { useEffect } from "react";
import {
  type MetaAttr,
  SITE_NAME,
  absoluteUrl,
  removeJsonLd,
  removeLinkTag,
  setJsonLd,
  truncateSeoText,
  upsertLinkTag,
  upsertMetaTag,
} from "../lib/seo";

type MetaImage = {
  url: string;
  alt?: string;
};

type ExtraMetaTag = {
  attrName: MetaAttr;
  attrValue: string;
  content: string;
};

export type SEOProps = {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string | MetaImage;
  type?: "website" | "article" | "product";
  openGraphTitle?: string;
  openGraphDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  jsonLd?: unknown | unknown[];
  jsonLdId?: string;
  metaTags?: ExtraMetaTag[];
  noindex?: boolean;
};

export function SEO({
  title,
  description,
  canonicalUrl,
  image,
  type = "website",
  openGraphTitle,
  openGraphDescription,
  twitterTitle,
  twitterDescription,
  jsonLd,
  jsonLdId = "page-jsonld",
  metaTags = [],
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const metaTitle = title.trim() || SITE_NAME;
    const metaDescription = truncateSeoText(description);
    const pageUrl = canonicalUrl
      ? absoluteUrl(canonicalUrl)
      : window.location.href;
    const imageUrl =
      typeof image === "string"
        ? absoluteUrl(image)
        : image?.url
          ? absoluteUrl(image.url)
          : "";
    const imageAlt = typeof image === "object" ? image.alt : undefined;

    document.title = metaTitle;
    if (canonicalUrl) {
      upsertLinkTag("canonical", pageUrl);
    }

    upsertMetaTag("name", "description", metaDescription);
    const ogTitle = openGraphTitle?.trim() || metaTitle;
    const ogDescription = openGraphDescription?.trim() || metaDescription;
    const twitterCardTitle = twitterTitle?.trim() || ogTitle;
    const twitterCardDescription = twitterDescription?.trim() || ogDescription;

    upsertMetaTag("property", "og:title", ogTitle);
    upsertMetaTag("property", "og:description", ogDescription);
    upsertMetaTag("property", "og:type", type);
    upsertMetaTag("property", "og:url", pageUrl);
    upsertMetaTag("property", "og:site_name", SITE_NAME);
    upsertMetaTag(
      "name",
      "twitter:card",
      imageUrl ? "summary_large_image" : "summary",
    );
    upsertMetaTag("name", "twitter:title", twitterCardTitle);
    upsertMetaTag("name", "twitter:description", twitterCardDescription);
    upsertMetaTag(
      "name",
      "robots",
      noindex ? "noindex,nofollow" : "index,follow",
    );

    if (imageUrl) {
      upsertMetaTag("property", "og:image", imageUrl);
      upsertMetaTag("name", "twitter:image", imageUrl);
      if (imageAlt) {
        upsertMetaTag("property", "og:image:alt", imageAlt);
        upsertMetaTag("name", "twitter:image:alt", imageAlt);
      }
    }

    if (jsonLd) {
      setJsonLd(jsonLdId, jsonLd);
    } else {
      removeJsonLd(jsonLdId);
    }

    for (const tag of metaTags) {
      upsertMetaTag(tag.attrName, tag.attrValue, tag.content);
    }

    return () => {
      if (canonicalUrl) {
        removeLinkTag("canonical");
      }
      removeJsonLd(jsonLdId);
    };
  }, [
    canonicalUrl,
    description,
    image,
    jsonLd,
    jsonLdId,
    metaTags,
    noindex,
    title,
    type,
  ]);

  return null;
}
