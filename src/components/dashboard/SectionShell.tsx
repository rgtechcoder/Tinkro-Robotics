function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 animate-pulse space-y-3"
      style={{ background: "oklch(0.16 0.03 243 / 0.6)" }}
    >
      <div
        className="h-3 w-2/3 rounded-full"
        style={{ background: "oklch(0.25 0.03 243 / 0.8)" }}
      />
      <div
        className="h-2.5 w-1/2 rounded-full"
        style={{ background: "oklch(0.22 0.02 243 / 0.5)" }}
      />
      <div
        className="h-2.5 w-3/4 rounded-full"
        style={{ background: "oklch(0.22 0.02 243 / 0.4)" }}
      />
    </div>
  );
}

interface SectionShellProps {
  title: string;
  subtitle?: string;
}

export function SectionShell({ title, subtitle }: SectionShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "oklch(0.94 0.01 243)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: "oklch(0.55 0.04 243)" }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
