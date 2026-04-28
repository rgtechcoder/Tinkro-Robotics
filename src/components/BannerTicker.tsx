import { useBanners } from "@/lib/publicDataService";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

export function BannerTicker() {
  const { banners, loading } = useBanners();

  const activeLines = useMemo(() => {
    return banners
      .filter((b) => b.isActive && b.type === "banner")
      .map((b) => ({
        id: b.id,
        title: b.title?.trim(),
        ctaText: b.ctaText?.trim(),
        ctaLink: b.ctaLink?.trim(),
      }))
      .filter((b) => !!b.title);
  }, [banners]);

  if (loading || activeLines.length === 0) return null;

  const items = activeLines.map((b) => {
    const content = (
      <>
        <span className="font-semibold">{b.title}</span>
        {b.ctaText ? (
          <span className="ml-2 inline-flex items-center gap-1 text-white/90">
            <span className="text-white/60">•</span>
            <span>{b.ctaText}</span>
          </span>
        ) : null}
      </>
    );

    if (b.ctaLink) {
      return (
        <Link
          key={b.id}
          to={b.ctaLink as "/"}
          className="inline-flex items-center gap-2 hover:text-white transition-colors"
        >
          {content}
        </Link>
      );
    }

    return (
      <span key={b.id} className="inline-flex items-center gap-2">
        {content}
      </span>
    );
  });

  return (
    <div
      className="w-full overflow-hidden border-b border-white/10"
      style={{
        background:
          "linear-gradient(90deg, oklch(0.14 0.04 250), oklch(0.12 0.04 243))",
      }}
      data-ocid="public-banner-ticker"
    >
      <div className="relative flex items-center h-9 text-sm text-white/90">
        <div className="ticker-track flex items-center gap-8 whitespace-nowrap">
          {items.map((item, idx) => (
            <div key={`line-${idx}`} className="flex items-center gap-8">
              {item}
              <span className="text-white/30">•</span>
            </div>
          ))}
          {items.map((item, idx) => (
            <div key={`line-repeat-${idx}`} className="flex items-center gap-8">
              {item}
              <span className="text-white/30">•</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .ticker-track {
          min-width: max-content;
          animation: ticker-scroll 22s linear infinite;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
