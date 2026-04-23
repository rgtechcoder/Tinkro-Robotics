import { AnimatePresence, motion } from "motion/react";
import { CategoriesSection } from "../components/CategoriesSection";
import {
  FinalCTASection,
  HowItWorksSection,
  StarterJourneySection,
  StorytellingSection,
  WhyChooseTinkro,
} from "../components/ContentSections";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { HeroSection } from "../components/HeroSection";
import { useNavigate } from "@tanstack/react-router";
import { LabTiersSection } from "../components/LabTiersSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import {
  useBanners,
  useCategories,
  useLabSetups,
  useProducts,
} from "../lib/publicDataService";

// ─── Skeleton helpers ──────────────────────────────────────────────────────────

function HeroSkeleton() {
  return (
    <div
      className="min-h-screen flex flex-col animate-pulse"
      style={{
        background:
          "radial-gradient(ellipse 100% 100% at 50% 0%, oklch(0.12 0.06 243) 0%, oklch(0.08 0.04 243) 100%)",
      }}
      aria-label="Loading hero section"
    >
      <div className="flex-1 flex items-center pt-24 pb-12 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-[55%] space-y-6">
              <div
                className="h-6 w-48 rounded-full"
                style={{ background: "oklch(0.98 0 0 / 0.08)" }}
              />
              <div className="space-y-3">
                <div
                  className="h-14 w-56 rounded-xl"
                  style={{ background: "oklch(0.98 0 0 / 0.1)" }}
                />
                <div
                  className="h-14 w-48 rounded-xl"
                  style={{ background: "oklch(0.98 0 0 / 0.08)" }}
                />
                <div
                  className="h-14 w-64 rounded-xl"
                  style={{ background: "oklch(0.98 0 0 / 0.06)" }}
                />
              </div>
              <div
                className="h-16 w-full max-w-md rounded-lg"
                style={{ background: "oklch(0.98 0 0 / 0.06)" }}
              />
              <div className="flex gap-3 pt-2">
                <div
                  className="h-12 w-36 rounded-xl"
                  style={{ background: "oklch(0.98 0 0 / 0.1)" }}
                />
                <div
                  className="h-12 w-36 rounded-xl"
                  style={{ background: "oklch(0.98 0 0 / 0.06)" }}
                />
              </div>
            </div>
            <div className="hidden lg:flex w-full lg:w-[45%] items-center justify-center">
              <div
                className="w-full max-w-[480px] rounded-full aspect-square"
                style={{ background: "oklch(0.98 0 0 / 0.05)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabsTiersSkeleton() {
  return (
    <section
      className="py-24 bg-[oklch(0.08_0.02_258)] animate-pulse"
      aria-label="Loading lab tiers"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="h-4 w-24 rounded mx-auto bg-white/10" />
          <div className="h-10 w-64 rounded mx-auto bg-white/10" />
          <div className="h-5 w-96 max-w-full rounded mx-auto bg-white/5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {["sl-0", "sl-1", "sl-2", "sl-3"].map((k) => (
            <div
              key={k}
              className="rounded-2xl border border-white/10 p-6 space-y-5 bg-gradient-to-b from-white/5 to-white/[0.02]"
            >
              <div className="space-y-2">
                <div className="h-5 w-32 rounded bg-white/10" />
                <div className="h-3 w-44 rounded bg-white/5" />
              </div>
              <div className="h-6 w-24 rounded bg-white/10" />
              <div className="space-y-2.5">
                {["si-a", "si-b", "si-c", "si-d", "si-e"].map((ki) => (
                  <div key={ki} className="h-4 w-full rounded bg-white/5" />
                ))}
              </div>
              <div className="h-10 w-full rounded-lg bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSkeleton() {
  return (
    <section
      className="py-24 bg-background animate-pulse"
      aria-label="Loading categories"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="h-4 w-24 rounded mx-auto bg-muted" />
          <div className="h-10 w-56 rounded mx-auto bg-muted" />
          <div className="h-5 w-80 max-w-full rounded mx-auto bg-muted/60" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["sc-0", "sc-1", "sc-2", "sc-3", "sc-4", "sc-5"].map((k) => (
            <div
              key={k}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card border border-border"
            >
              <div className="w-full aspect-square rounded-xl bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-3 w-12 rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSkeleton() {
  return (
    <section
      className="py-24 bg-muted/30 animate-pulse"
      aria-label="Loading products"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="h-4 w-24 rounded mx-auto bg-muted" />
          <div className="h-10 w-64 rounded mx-auto bg-muted" />
          <div className="h-5 w-80 max-w-full rounded mx-auto bg-muted/60" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {["sp-0", "sp-1", "sp-2", "sp-3", "sp-4", "sp-5"].map((k) => (
            <div
              key={k}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="h-[200px] w-full bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted/60" />
                <div className="flex items-center justify-between pt-1">
                  <div className="h-5 w-16 rounded bg-muted" />
                  <div className="flex gap-1.5">
                    <div className="h-8 w-14 rounded-lg bg-muted" />
                    <div className="h-8 w-14 rounded-lg bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Static content ────────────────────────────────────────────────────────────

const howItWorksSteps = [
  {
    step: 1,
    title: "Unbox",
    description:
      "Everything arrives pre-sorted in premium packaging. All components labeled, no missing parts, no guesswork.",
    icon: "📦",
  },
  {
    step: 2,
    title: "Build",
    description:
      "Follow our illustrated, video-guided instructions. Build your first robot in under 2 hours — no prior experience needed.",
    icon: "🔧",
  },
  {
    step: 3,
    title: "Code",
    description:
      "Program using block-based Scratch or Python. See your creation move, sense, and respond to the real world.",
    icon: "💻",
  },
];

const testimonials = [
  {
    id: "t1",
    name: "Dr.Priya Sharma",
    role: "",
    organization: "Delhi Public School, Indore",
    content:
      "Tinkro transformed our STEM lab into a genuine innovation hub. Students are building robots from day one. The curriculum is brilliant and teacher support is excellent.",
    avatar: "/assets/generated/avatar-principal.jpg",
    rating: 5,
  },
  {
    id: "t2",
    name: "Arjun Mehta",
    role: "Student, Grade 10",
    organization: "Ryan International School",
    content:
      "I built my first self-driving robot in just 3 weeks using Tinkro's Explorer Kit. The step-by-step guide made it super easy. Now I want to do engineering!",
    avatar: "/assets/generated/avatar-student.jpg",
    rating: 5,
  },
  {
    id: "t3",
    name: "Sunita Reddy",
    role: "Parent",
    organization: "Ratlam, Madhya Pradesh",
    content:
      "My daughter was afraid of technology. After 2 months with Tinkro kits, she coded her own weather station. The quality is outstanding and completely worth every rupee.",
    avatar: "/assets/generated/avatar-parent.jpg",
    rating: 5,
  },
  {
    id: "t4",
    name: "Vikram Nair",
    role: "STEM Coordinator",
    organization: "Indore",
    content:
      "Tinkro's advanced lab setup with AI and IoT modules puts us ahead of any school in the region. The post-installation support team is incredibly responsive.",
    avatar: "/assets/generated/avatar-coordinator.jpg",
    rating: 5,
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { labSetups, loading: labSetupsLoading } = useLabSetups();
  const { banners, loading: bannersLoading } = useBanners();

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Hero — show skeleton while banners load */}
      <AnimatePresence mode="wait">
        {bannersLoading ? (
          <motion.div
            key="hero-skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <HeroSection
              banners={banners}
              loading={false}
              onShopNow={() => {
                navigate({ to: "/products#all-products" });
              }}
              onExploreLabs={() => scrollTo("lab-tiers")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <WhyChooseTinkro />

      {/* Lab Tiers — show skeleton while loading */}
      <AnimatePresence mode="wait">
        {labSetupsLoading ? (
          <motion.div
            key="lab-skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LabsTiersSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="lab-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <LabTiersSection labSetups={labSetups} loading={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories — show skeleton while loading */}
      <AnimatePresence mode="wait">
        {categoriesLoading ? (
          <motion.div
            key="categories-skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CategoriesSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="categories-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CategoriesSection categories={categories} loading={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Products — show skeleton while loading */}
      <AnimatePresence mode="wait">
        {productsLoading ? (
          <motion.div
            key="products-skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductsSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="products-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <FeaturedProducts products={products} loading={false} />
          </motion.div>
        )}
      </AnimatePresence>

      <HowItWorksSection steps={howItWorksSteps} />
      <StarterJourneySection />
      <StorytellingSection />
      <TestimonialsSection testimonials={testimonials} />
      <FinalCTASection />
    </>
  );
}
