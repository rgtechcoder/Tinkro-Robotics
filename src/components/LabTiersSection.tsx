import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";
import type { AdminLabSetup } from "../types/admin";

// Explicit skeleton key list — avoids no-array-index-key
const SKELETON_KEYS = ["sk-lab-0", "sk-lab-1", "sk-lab-2", "sk-lab-3"];

interface LabTiersSectionProps {
  labSetups: AdminLabSetup[];
  loading?: boolean;
}

function formatPriceRange(priceRange: AdminLabSetup["priceRange"]): string {
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  if (priceRange.max > 0) {
    return `${fmt(priceRange.min)} – ${fmt(priceRange.max)}`;
  }
  return `${fmt(priceRange.min)}+`;
}

const LAB_TYPE_LABELS: Record<AdminLabSetup["type"], string> = {
  atl: "Tinkro Spark Lab",
  pmshri: "PM SHRI Lab",
  stem: "STEM Lab",
  robotics: "Robotics Lab",
};

export const LabTiersSection = memo(function LabTiersSection({
  labSetups,
  loading = false,
}: LabTiersSectionProps) {
  const navigate = useNavigate();

  const handleGetQuote = (lab: AdminLabSetup) => {
    navigate({
      to: "/contact",
      search: { subject: `Lab Setup Enquiry: ${lab.name}` },
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <section
      className="py-24 bg-[oklch(0.08_0.02_258)] relative overflow-hidden"
      id="lab-tiers"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/8 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-accent/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          layout={false}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Lab Solutions
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white">
            Complete Lab <span className="gradient-text">Setups</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            From a starter classroom to a flagship innovation center — we have
            the right lab for your school.
          </p>
        </motion.div>

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-white/10 p-6 space-y-5 bg-gradient-to-b from-white/5 to-white/[0.02]"
              >
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-3 w-44 rounded" />
                </div>
                <Skeleton className="h-6 w-24 rounded" />
                <div className="space-y-2.5">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && labSetups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 space-y-4"
            data-ocid="lab-setups-empty-state"
          >
            <div className="text-5xl mb-4">🏫</div>
            <h3 className="font-display font-semibold text-xl text-white">
              Lab setups coming soon
            </h3>
            <p className="text-white/50 max-w-xs mx-auto text-sm">
              Our team is preparing lab configurations. Contact us for a custom
              quote.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                navigate({
                  to: "/contact",
                  search: { subject: "Lab Setup Enquiry" },
                })
              }
              className="mt-4 border-white/20 text-white bg-white/5 hover:bg-primary/20 hover:border-primary/50 hover:text-white"
            >
              Contact Us
            </Button>
          </motion.div>
        )}

        {/* Lab setups grid */}
        {!loading && labSetups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {labSetups.map((lab, i) => {
              // Highlight the middle tiers (2nd or 3rd) when there are 4+
              const isHighlighted =
                labSetups.length >= 4
                  ? i === 1 || i === 2
                  : i === Math.floor(labSetups.length / 2);

              return (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  layout={false}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  style={{ willChange: "transform, opacity" }}
                  className={`
                    relative rounded-2xl border p-6 space-y-5 flex flex-col
                    bg-gradient-to-b from-white/5 to-white/[0.02]
                    ${isHighlighted ? "border-primary/50 shadow-glow-primary" : "border-white/10"}
                    hover:border-primary/40 transition-smooth
                  `}
                  data-ocid="lab-tier-card"
                >
                  {isHighlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gradient-primary text-white border-0 shadow-glow-accent px-3 py-0.5 text-xs font-semibold">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-white">
                        {lab.name}
                      </h3>
                    </div>
                    <p className="text-white/50 text-sm">
                      {LAB_TYPE_LABELS[lab.type] ?? lab.type}
                    </p>
                    {lab.description && (
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2 pt-1">
                        {lab.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="font-display font-bold text-xl gradient-text">
                      {formatPriceRange(lab.priceRange)}
                    </span>
                    <p className="text-white/40 text-xs mt-0.5">
                      One-time setup cost
                    </p>
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {lab.includedItems.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                    {lab.targetAudience && (
                      <li className="flex items-start gap-2.5 text-sm pt-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: "rgba(59,191,191,0.15)",
                            color: "#3BBFBF",
                            border: "1px solid rgba(59,191,191,0.25)",
                          }}
                        >
                          {lab.targetAudience}
                        </span>
                      </li>
                    )}
                  </ul>

                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white bg-white/5 hover:bg-primary/20 hover:border-primary/50 hover:text-white transition-smooth"
                    onClick={() => handleGetQuote(lab)}
                    data-ocid="lab-tier-cta"
                  >
                    Get Quote
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});
