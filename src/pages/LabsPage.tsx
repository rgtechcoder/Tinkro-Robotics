import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLabSetups } from "@/lib/publicDataService";
import type { AdminLabSetup } from "@/types/admin";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowUpCircle,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  GraduationCap,
  HeadphonesIcon,
  Package,
  Sparkles,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─────────────────────────────────────────────────────────
// Type badge label map
// ─────────────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  atl: "ATL Lab",
  pmshri: "PM SHRI",
  stem: "STEM Lab",
  robotics: "Robotics Lab",
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  atl: <GraduationCap className="w-6 h-6" />,
  pmshri: <Star className="w-6 h-6" />,
  stem: <Users className="w-6 h-6" />,
  robotics: <Building2 className="w-6 h-6" />,
};

// ─────────────────────────────────────────────────────────
// Skeleton keys
// ─────────────────────────────────────────────────────────
const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3"];

// ─────────────────────────────────────────────────────────
// FAQ data (static)
// ─────────────────────────────────────────────────────────
const faqItems = [
  {
    q: "How long does delivery take?",
    a: "Delivery timelines depend on your selected lab configuration. We ship pan-India via trusted logistics partners with full tracking provided.",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    q: "Do you provide installation support?",
    a: "Yes — every lab tier includes onsite or virtual installation support and structured teacher training. Advanced configurations include full onsite teacher residency programs.",
    icon: <Wrench className="w-5 h-5" />,
  },
  {
    q: "What is included in the kits?",
    a: "Each lab includes fully stocked student workstations with boards, sensors, motor drivers, robot chassis kits, breadboards, jumper wires, illustrated project guides, and teacher training. Everything needed to start building robots on day one.",
    icon: <Package className="w-5 h-5" />,
  },
  {
    q: "Can I upgrade my lab tier later?",
    a: "Absolutely. All Tinkro labs are designed with upgrade compatibility in mind. We offer discounted upgrade pricing for existing Tinkro lab customers, and our team handles the migration.",
    icon: <ArrowUpCircle className="w-5 h-5" />,
  },
];

// ─────────────────────────────────────────────────────────
// Particle config (static, no random at render time)
// ─────────────────────────────────────────────────────────
const PARTICLES = [
  { id: "p0", w: 5, h: 5, x: 8, y: 12, color: 0 },
  { id: "p1", w: 3, h: 3, x: 22, y: 45, color: 1 },
  { id: "p2", w: 6, h: 6, x: 38, y: 7, color: 2 },
  { id: "p3", w: 2, h: 2, x: 55, y: 30, color: 0 },
  { id: "p4", w: 4, h: 4, x: 70, y: 18, color: 1 },
  { id: "p5", w: 7, h: 7, x: 85, y: 60, color: 2 },
  { id: "p6", w: 3, h: 3, x: 15, y: 75, color: 0 },
  { id: "p7", w: 5, h: 5, x: 92, y: 85, color: 1 },
  { id: "p8", w: 2, h: 2, x: 48, y: 90, color: 2 },
  { id: "p9", w: 4, h: 4, x: 65, y: 50, color: 0 },
  { id: "p10", w: 6, h: 6, x: 30, y: 25, color: 1 },
  { id: "p11", w: 3, h: 3, x: 78, y: 38, color: 2 },
  { id: "p12", w: 5, h: 5, x: 10, y: 55, color: 0 },
  { id: "p13", w: 2, h: 2, x: 43, y: 68, color: 1 },
  { id: "p14", w: 4, h: 4, x: 60, y: 80, color: 2 },
  { id: "p15", w: 7, h: 7, x: 90, y: 10, color: 0 },
] as const;

const PARTICLE_COLORS = [
  "oklch(0.45 0.12 243 / 0.4)",
  "oklch(0.71 0.17 48 / 0.3)",
  "oklch(0.7 0.13 195 / 0.3)",
] as const;

const PARTICLE_DURATIONS = [
  4.2, 3.8, 5.1, 3.5, 4.7, 6.0, 3.2, 5.5, 4.0, 3.9, 5.3, 4.5, 3.7, 5.8, 4.3,
  3.6,
] as const;
const PARTICLE_DELAYS = [
  0, 1.2, 2.4, 0.6, 1.8, 3.0, 0.3, 2.1, 1.5, 0.9, 2.7, 1.1, 2.9, 0.4, 1.7, 2.3,
] as const;

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function formatPriceRange(priceRange: { min: number; max: number }): string {
  const fmt = (n: number) => {
    if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
    return `₹${n}`;
  };
  return `${fmt(priceRange.min)} – ${fmt(priceRange.max)}`;
}

// ─────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden bg-[oklch(0.07_0.025_258)]">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.w,
            height: p.h,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: PARTICLE_COLORS[p.color],
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: PARTICLE_DURATIONS[i],
            repeat: Number.POSITIVE_INFINITY,
            delay: PARTICLE_DELAYS[i],
          }}
        />
      ))}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[700px] h-[400px] bg-primary/15 blur-[120px] rounded-full -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[350px] bg-[oklch(0.71_0.17_48)]/10 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent/8 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 container max-w-5xl mx-auto px-6 text-center py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 font-semibold tracking-widest text-xs uppercase px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-1.5" />
            Lab Setup Solutions
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
        >
          Build Your{" "}
          <span className="relative inline-block">
            <span className="gradient-text">Dream Lab</span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.71 0.17 48), oklch(0.76 0.16 72))",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white/65 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          From a 10-seat starter classroom to a 50-seat flagship innovation
          center — choose the tier that transforms your school's STEM program.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="#lab-tiers">
            <Button
              className="gradient-primary text-white font-semibold px-8 py-3 text-base shadow-glow-primary hover:shadow-glow-accent transition-smooth"
              data-ocid="hero-explore-cta"
            >
              Explore Lab Tiers
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <Button
            variant="outline"
            className="border-white/20 text-white bg-white/5 hover:bg-white/10 hover:border-white/40 transition-smooth px-8 py-3 text-base"
            onClick={() => navigate({ to: "/contact" })}
            data-ocid="hero-contact-cta"
          >
            Talk to Our Team
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Stats badges removed as requested */}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// LabSetup Tier Card (Firebase-driven)
// ─────────────────────────────────────────────────────────
function LabSetupCard({
  lab,
  index,
  highlight,
}: {
  lab: AdminLabSetup;
  index: number;
  highlight: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const icon = TYPE_ICON[lab.type] ?? <GraduationCap className="w-6 h-6" />;
  const typeLabel = TYPE_LABEL[lab.type] ?? lab.type;
  const priceDisplay = formatPriceRange(lab.priceRange);

  const handleGetQuote = () => {
    navigate({
      to: "/contact",
      search: { subject: `Lab Setup Enquiry: ${lab.name}` },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`relative rounded-2xl border flex flex-col overflow-hidden
        bg-gradient-to-b from-white/5 to-white/[0.02]
        ${highlight ? "border-primary/50" : "border-white/10"}
        transition-smooth`}
      layout={false}
      style={{
        boxShadow: highlight ? "0 0 40px oklch(0.45 0.12 243 / 0.15)" : "none",
        willChange: "transform, opacity",
      }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      data-ocid="labs-tier-card"
    >
      {/* Top accent line for highlighted tier */}
      {highlight && (
        <div
          className="absolute -top-px left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(to right, oklch(0.45 0.12 243), oklch(0.7 0.13 195), oklch(0.45 0.12 243))",
          }}
        />
      )}
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge className="gradient-primary text-white border-0 shadow-glow-accent px-3 py-1 text-xs font-semibold">
            <Sparkles className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <div className="p-7 flex flex-col flex-1 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-xl text-white">
                {lab.name}
              </h3>
              <Badge className="text-[10px] px-2 py-0.5 bg-accent/15 text-accent border-accent/25 font-semibold">
                {typeLabel}
              </Badge>
            </div>
            {lab.targetAudience && (
              <p className="text-white/50 text-sm mt-0.5 truncate">
                For: {lab.targetAudience}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {lab.description && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
            {lab.description}
          </p>
        )}

        {/* Price */}
        <div>
          <span className="font-display font-bold text-2xl gradient-text">
            {priceDisplay}
          </span>
          <p className="text-white/40 text-xs mt-0.5">
            One-time lab setup cost
          </p>
        </div>

        {/* Included items */}
        {lab.includedItems.length > 0 && (
          <ul className="space-y-2.5 flex-1">
            {lab.includedItems.slice(0, 5).map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-white/70">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTAs */}
        <div className="space-y-2.5 pt-1">
          <Button
            className="w-full gradient-primary text-white font-semibold shadow-glow-primary hover:shadow-glow-accent transition-smooth"
            onClick={handleGetQuote}
            data-ocid="labs-tier-get-quote"
          >
            Get Quote
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          {lab.includedItems.length > 5 && (
            <Button
              variant="ghost"
              className="w-full text-white/50 hover:text-white/80 hover:bg-white/5 text-sm transition-smooth"
              onClick={() => setExpanded((v) => !v)}
              data-ocid="labs-tier-see-details"
            >
              {expanded ? "Hide Details" : "See Full Component List"}
              <ChevronDown
                className={`w-4 h-4 ml-1.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Expandable full items panel */}
      <AnimatePresence>
        {expanded && lab.includedItems.length > 5 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 bg-white/[0.03] p-7 space-y-5">
              <p className="text-sm font-semibold text-white/80 uppercase tracking-widest">
                Full Component List
              </p>
              <ul className="grid grid-cols-1 gap-2">
                {lab.includedItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-white/65"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Skeleton card
// ─────────────────────────────────────────────────────────
function TierCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-7 space-y-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-11 h-11 rounded-xl bg-white/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-white/10 rounded" />
          <Skeleton className="h-4 w-1/2 bg-white/10 rounded" />
        </div>
      </div>
      <Skeleton className="h-4 w-full bg-white/10 rounded" />
      <Skeleton className="h-4 w-2/3 bg-white/10 rounded" />
      <div>
        <Skeleton className="h-7 w-1/2 bg-white/10 rounded mb-1" />
        <Skeleton className="h-3 w-1/3 bg-white/10 rounded" />
      </div>
      <div className="space-y-2.5">
        {["sk-item-a", "sk-item-b", "sk-item-c", "sk-item-d"].map((k) => (
          <div key={k} className="flex items-center gap-2.5">
            <Skeleton className="w-4 h-4 rounded bg-white/10 shrink-0" />
            <Skeleton className="h-4 flex-1 bg-white/10 rounded" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tier cards section
// ─────────────────────────────────────────────────────────
function TierCardsSection() {
  const { labSetups, loading } = useLabSetups();
  const isEmpty = !loading && labSetups.length === 0;

  return (
    <section
      id="lab-tiers"
      className="py-28 bg-[oklch(0.08_0.02_258)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-primary/8 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-[oklch(0.71_0.17_48)]/6 blur-3xl rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Choose Your Tier
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white">
            Four Lab Setups.{" "}
            <span className="gradient-text">One Trusted Partner.</span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Every setup is complete, curriculum-ready, and fully supported —
            from delivery to teacher training.
          </p>
        </motion.div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKELETON_KEYS.map((k) => (
              <TierCardSkeleton key={k} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.02]"
            data-ocid="labs-empty-state"
          >
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 inline-flex mb-5">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">
              Lab Setup Packages Coming Soon
            </h3>
            <p className="text-white/55 text-base max-w-md mx-auto mb-8">
              Lab setup packages coming soon. Contact us for custom
              configurations.
            </p>
            <Button
              className="gradient-primary text-white font-semibold px-8 py-3 shadow-glow-primary hover:shadow-glow-accent transition-smooth"
              onClick={() => {
                window.location.href = "/contact?subject=Lab%20Setup%20Enquiry";
              }}
              data-ocid="labs-empty-contact-cta"
            >
              Contact Us for Custom Setup
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Live lab cards */}
        {!loading && labSetups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labSetups.map((lab, i) => (
              <LabSetupCard
                key={lab.id}
                lab={lab}
                index={i}
                highlight={i === 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Comparison table (dynamic from Firebase)
// ─────────────────────────────────────────────────────────
function ComparisonTable() {
  const { labSetups, loading } = useLabSetups();

  if (loading || labSetups.length === 0) return null;

  const rows: { label: string; icon: React.ReactNode; values: string[] }[] = [
    {
      label: "Price Range",
      icon: <span className="font-bold">₹</span>,
      values: labSetups.map((l) => formatPriceRange(l.priceRange)),
    },
    {
      label: "Type",
      icon: <Star className="w-4 h-4" />,
      values: labSetups.map((l) => TYPE_LABEL[l.type] ?? l.type),
    },
    {
      label: "Ideal For",
      icon: <Building2 className="w-4 h-4" />,
      values: labSetups.map((l) => l.targetAudience),
    },
    {
      label: "Components",
      icon: <Package className="w-4 h-4" />,
      values: labSetups.map((l) => `${l.includedItems.length} items included`),
    },
    {
      label: "Support",
      icon: <HeadphonesIcon className="w-4 h-4" />,
      values: labSetups.map(() => "Full Support"),
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.06_0.02_258)] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.45 0.12 243 / 0.03) 1px, transparent 1px), linear-gradient(to right, oklch(0.45 0.12 243 / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Side-by-Side
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white">
            Compare All <span className="gradient-text">Lab Tiers</span>
          </h2>
          <p className="text-white/55 text-lg max-w-lg mx-auto">
            See exactly what each tier includes before making your decision.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-white/10 overflow-x-auto bg-white/[0.02] backdrop-blur-sm"
        >
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="p-5 text-white/40 text-sm font-semibold text-left w-[180px]" />
                {labSetups.map((lab, ci) => (
                  <th
                    key={lab.id}
                    className={`p-5 text-center ${ci === 1 ? "bg-primary/10" : ""}`}
                  >
                    <p className="font-display font-bold text-white text-sm">
                      {lab.name}
                    </p>
                    {ci === 1 && (
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                        Popular
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <motion.tr
                  key={row.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: ri * 0.06 }}
                  className={`border-b border-white/5 last:border-0 ${ri % 2 === 0 ? "bg-white/[0.01]" : ""}`}
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-2.5 text-white/60 text-sm font-medium">
                      <span className="text-primary/70">{row.icon}</span>
                      {row.label}
                    </div>
                  </td>
                  {labSetups.map((lab, ci) => (
                    <td
                      key={lab.id}
                      className={`p-4 text-center text-sm text-white/70 ${ci === 1 ? "bg-primary/5" : ""}`}
                    >
                      {row.values[ci]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-28 bg-[oklch(0.08_0.02_258)] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-primary/6 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Frequently Asked
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white">
            Common <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`rounded-2xl border overflow-hidden transition-smooth ${
                openIndex === i
                  ? "border-primary/40 bg-white/[0.04]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <button
                type="button"
                className="w-full flex items-center gap-4 p-6 text-left group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                data-ocid={`faq-toggle-${i}`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 transition-smooth ${openIndex === i ? "bg-primary/20 text-primary" : "bg-white/5 text-white/40 group-hover:bg-primary/10 group-hover:text-primary/70"}`}
                >
                  {item.icon}
                </div>
                <span className="font-semibold text-white/85 text-base flex-1 leading-snug">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-white/40 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-primary" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-white/60 text-sm leading-relaxed pl-[72px]">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// CTA Banner
// ─────────────────────────────────────────────────────────
function CTABanner() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[oklch(0.06_0.02_258)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-primary/12 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-[oklch(0.71_0.17_48)]/10 blur-[80px] rounded-full" />
      </div>

      <div className="container max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm p-12 text-center space-y-6"
          style={{
            boxShadow:
              "0 0 80px oklch(0.45 0.12 243 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.05)",
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold"
            style={{
              background: "oklch(0.71 0.17 48 / 0.12)",
              borderColor: "oklch(0.71 0.17 48 / 0.25)",
              color: "oklch(0.76 0.16 72)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Limited slots available for 2025–26
          </div>

          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight">
            Start Building Your
            <br />
            <span className="gradient-text">Lab Today</span>
          </h2>

          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            Join 150+ schools across India already running Tinkro-powered STEM
            labs. Our team handles everything — from delivery to teacher
            training.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Button
              className="gradient-primary text-white font-bold px-10 py-3.5 text-base shadow-glow-primary hover:shadow-glow-accent transition-smooth"
              onClick={() =>
                navigate({
                  to: "/contact",
                  search: { subject: "Lab Setup Enquiry: General" },
                })
              }
              data-ocid="labs-cta-contact"
            >
              Contact Our Team
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <a href="#lab-tiers">
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 hover:border-white/30 transition-smooth px-8 py-3.5 text-base"
                data-ocid="labs-cta-tiers"
              >
                View Lab Tiers
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap gap-6 justify-center pt-4 border-t border-white/5">
            {[
              "ATL Approved Partner",
              "PM SHRI Compatible",
              "Pan-India Delivery",
              "Lifetime Support",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1.5 text-white/45 text-sm"
              >
                <Check className="w-3.5 h-3.5 text-accent" />
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export function LabsPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.07_0.025_258)]">
      <HeroSection />
      <TierCardsSection />
      <ComparisonTable />
      <FAQSection />
      <CTABanner />
    </div>
  );
}
