import { useBanners } from "@/lib/publicDataService";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface PopupBannerItem {
  id: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  position?: "top" | "center" | "bottom";
}

function getSessionKey(id: string) {
  return `tinkro-popup-seen:${id}`;
}

export function PopupBanners() {
  const { banners, loading } = useBanners();
  const [active, setActive] = useState<PopupBannerItem | null>(null);

  const popupItems = useMemo(() => {
    return banners
      .filter((b) => b.isActive && b.type === "popup")
      .map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        ctaText: b.ctaText,
        ctaLink: b.ctaLink,
        imageUrl: b.imageUrl,
        position: b.position ?? "center",
      }));
  }, [banners]);

  useEffect(() => {
    if (loading) return;
    if (popupItems.length === 0) return;

    const next = popupItems.find((b) => {
      try {
        return sessionStorage.getItem(getSessionKey(b.id)) !== "1";
      } catch {
        return true;
      }
    });

    if (!next) return;

    const timer = setTimeout(() => setActive(next), 1200);
    return () => clearTimeout(timer);
  }, [loading, popupItems]);

  if (!active) return null;

  const alignmentClass =
    active.position === "top"
      ? "items-start pt-20"
      : active.position === "bottom"
        ? "items-end pb-10"
        : "items-center";

  const handleClose = () => {
    try {
      sessionStorage.setItem(getSessionKey(active.id), "1");
    } catch {
      // ignore storage errors
    }
    setActive(null);
  };

  return (
    <div
      className={`fixed inset-0 z-[80] flex justify-center ${alignmentClass}`}
      aria-live="polite"
      data-ocid="public-popup-banner"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close popup"
      />
      <div
        className="relative mx-4 w-full max-w-lg rounded-2xl border border-white/10 bg-white text-slate-900 shadow-2xl"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-slate-600 shadow hover:text-slate-900"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        {active.imageUrl && (
          <div className="overflow-hidden rounded-t-2xl bg-slate-100">
            <img
              src={active.imageUrl}
              alt={active.title}
              className="h-48 w-full object-cover"
            />
          </div>
        )}
        <div className="p-6 space-y-3">
          <h3 className="text-lg font-bold">{active.title}</h3>
          {active.description && (
            <p className="text-sm text-slate-600">{active.description}</p>
          )}
          {active.ctaText && active.ctaLink && (
            <a
              href={active.ctaLink}
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {active.ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
