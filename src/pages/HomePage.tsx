import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy, useEffect } from "react";
const CategoriesSection = lazy(() =>
  import("../components/CategoriesSection").then((m) => ({ default: m.CategoriesSection })),
);
const LabTiersSection = lazy(() =>
  import("../components/LabTiersSection").then((m) => ({ default: m.LabTiersSection })),
);
const FeaturedProducts = lazy(() =>
  import("../components/FeaturedProducts").then((m) => ({ default: m.FeaturedProducts })),
);
const HeroSection = lazy(() =>
  import("../components/HeroSection").then((m) => ({ default: m.HeroSection })),
);
const WhyChooseTinkro = lazy(() =>
  import("../components/ContentSections").then((m) => ({ default: m.WhyChooseTinkro })),
);
const HowItWorksSection = lazy(() =>
  import("../components/ContentSections").then((m) => ({ default: m.HowItWorksSection })),
);
const StarterJourneySection = lazy(() =>
  import("../components/ContentSections").then((m) => ({ default: m.StarterJourneySection })),
);
const StorytellingSection = lazy(() =>
  import("../components/ContentSections").then((m) => ({ default: m.StorytellingSection })),
);
const TestimonialsSection = lazy(() =>
  import("../components/TestimonialsSection").then((m) => ({ default: m.TestimonialsSection })),
);
const FinalCTASection = lazy(() =>
  import("../components/ContentSections").then((m) => ({ default: m.FinalCTASection })),
);
import {
  useBanners,
  useCategories,
  useFeaturedProducts,
  useLabSetups,
} from "../lib/publicDataService";
import {
  SITE_NAME,
  SITE_URL,
  removeJsonLd,
  setJsonLd,
  upsertLinkTag,
  upsertMetaTag,
} from "../lib/seo";
import { getProductRouteParam } from "../lib/slug";

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

const HOME_URL = `${SITE_URL}/`;
const LOGO_URL = `${SITE_URL}/assets/brand/logo.png`;
const HERO_IMAGE_URL = `${SITE_URL}/assets/generated/hero-robot-3d.dim_800x900.png`;
const CONTACT_EMAIL = "hello@tinkro.in";
const CONTACT_PHONE = "+91-9644525429";
const SOCIAL_LINKS = [
  "https://www.facebook.com/profile.php?id=61581192200900",
  "https://www.instagram.com/tinkrokits",
  "https://www.linkedin.com/company/tinkrokits/",
  "https://youtube.com/@tinkro",
];

const HOME_SEO_DESCRIPTION =
  "Tinkro is a premium robotics and STEM brand for schools, students, and makers. Explore robotics kits, Arduino, AI kits, electronics components, and full STEM lab setups in India.";

export function HomePage() {
  const { products, loading: productsLoading } = useFeaturedProducts(12);
  const { categories, loading: categoriesLoading } = useCategories();
  const { labSetups, loading: labSetupsLoading } = useLabSetups();
  const { banners, loading: bannersLoading } = useBanners();

  useEffect(() => {
    const title =
      categories.length > 0
        ? `${SITE_NAME} | Robotics Kits, STEM Labs & Electronics Components`
        : `${SITE_NAME} | Build Code Innovate`;
    const description = HOME_SEO_DESCRIPTION;
    const canonicalUrl = HOME_URL;

    document.title = title;
    upsertLinkTag("canonical", canonicalUrl);
    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "robots", "index,follow");
    upsertMetaTag("property", "og:title", title);
    upsertMetaTag("property", "og:description", description);
    upsertMetaTag("property", "og:type", "website");
    upsertMetaTag("property", "og:url", canonicalUrl);
    upsertMetaTag("property", "og:image", HERO_IMAGE_URL);
    upsertMetaTag("property", "og:image:alt", "Tinkro robotics and STEM learning kits");
    upsertMetaTag("property", "og:site_name", SITE_NAME);
    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", title);
    upsertMetaTag("name", "twitter:description", description);
    upsertMetaTag("name", "twitter:image", HERO_IMAGE_URL);
    upsertMetaTag("name", "twitter:image:alt", "Tinkro robotics and STEM learning kits");
  }, [categories.length]);

  useEffect(() => {
    const heroPreload = document.createElement("link");
    heroPreload.setAttribute("rel", "preload");
    heroPreload.setAttribute("as", "image");
    heroPreload.setAttribute(
      "href",
      "/assets/generated/hero-robot-3d.dim_800x900.png",
    );
    heroPreload.setAttribute("fetchpriority", "high");
    heroPreload.setAttribute("type", "image/png");
    heroPreload.setAttribute("data-hero-preload", "true");
    document.head.appendChild(heroPreload);

    return () => {
      heroPreload.remove();
    };
  }, []);

  useEffect(() => {
    const title =
      categories.length > 0
        ? `${SITE_NAME} | Robotics Kits, STEM Labs & Electronics Components`
        : `${SITE_NAME}: Build Code Innovate`;
    const description = HOME_SEO_DESCRIPTION;

    const featuredProducts = products.slice(0, 12).map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/product/${getProductRouteParam(p)}`,
      name: p.name,
    }));

    const categoryItems = categories.slice(0, 20).map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/products?category=${encodeURIComponent(c.slug)}`,
      name: c.name,
    }));

    const labItems = labSetups.slice(0, 8).map((lab, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: lab.name,
        description: lab.description ?? "",
        url: `${SITE_URL}/labs`,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: lab.priceRange?.min ?? undefined,
          highPrice: lab.priceRange?.max ?? undefined,
        },
        areaServed: "IN",
        serviceType: "STEM Lab Setup",
      },
    }));

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${HOME_URL}#organization`,
          name: SITE_NAME,
          url: HOME_URL,
          logo: {
            "@type": "ImageObject",
            url: LOGO_URL,
          },
          email: CONTACT_EMAIL,
          telephone: CONTACT_PHONE,
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: CONTACT_PHONE,
              email: CONTACT_EMAIL,
              contactType: "customer support",
              availableLanguage: ["en", "hi"],
              areaServed: "IN",
            },
          ],
          sameAs: SOCIAL_LINKS,
        },
        {
          "@type": "WebSite",
          "@id": `${HOME_URL}#website`,
          name: SITE_NAME,
          url: HOME_URL,
          publisher: {
            "@id": `${HOME_URL}#organization`,
          },
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/products?category={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@type": "LocalBusiness",
          "@id": `${HOME_URL}#localbusiness`,
          name: SITE_NAME,
          url: HOME_URL,
          image: LOGO_URL,
          logo: LOGO_URL,
          email: CONTACT_EMAIL,
          telephone: CONTACT_PHONE,
          parentOrganization: {
            "@id": `${HOME_URL}#organization`,
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Indore",
            addressRegion: "Madhya Pradesh",
            addressCountry: "IN",
          },
          areaServed: {
            "@type": "Country",
            name: "India",
          },
        },
        {
          "@type": "WebPage",
          "@id": `${HOME_URL}#webpage`,
          url: HOME_URL,
          name: title,
          description,
          isPartOf: {
            "@id": `${HOME_URL}#website`,
          },
          about: {
            "@id": `${HOME_URL}#organization`,
          },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: HERO_IMAGE_URL,
          },
        },
        {
          "@type": "ItemList",
          name: "Featured Products",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: featuredProducts.length,
          itemListElement: featuredProducts,
        },
        {
          "@type": "ItemList",
          name: "Shop by Category",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: categoryItems.length,
          itemListElement: categoryItems,
        },
        {
          "@type": "ItemList",
          name: "Lab Setup Solutions",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: labItems.length,
          itemListElement: labItems,
        },
      ],
    };

    const scriptId = "home-jsonld";
    setJsonLd(scriptId, jsonLd);
    return () => removeJsonLd(scriptId);
  }, [products, categories, labSetups]);

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
            <Suspense fallback={<HeroSkeleton />}>
              <HeroSection
                banners={banners}
                loading={false}
                onShopNow={() => {
                  window.location.href = "/products#all-products";
                }}
                onExploreLabs={() => scrollTo("lab-tiers")}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <WhyChooseTinkro />
      </Suspense>

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
            <Suspense fallback={<LabsTiersSkeleton />}>
              <LabTiersSection labSetups={labSetups} loading={false} />
            </Suspense>
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
            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoriesSection categories={categories} loading={false} />
            </Suspense>
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
            <Suspense fallback={<ProductsSkeleton />}>
              <FeaturedProducts products={products} loading={false} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <HowItWorksSection steps={howItWorksSteps} />
      </Suspense>
      <Suspense fallback={null}>
        <StarterJourneySection />
      </Suspense>
      <Suspense fallback={null}>
        <StorytellingSection />
      </Suspense>
      <Suspense fallback={null}>
        <TestimonialsSection testimonials={testimonials} />
      </Suspense>
      <Suspense fallback={null}>
        <FinalCTASection />
      </Suspense>
    </>
  );
}
