import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Layers,
  Package,
  Rocket,
} from "lucide-react";
import { motion } from "motion/react";
import type { HowItWorksStep } from "../types";

// ─── Why Choose Tinkro ───────────────────────────────────────────────────────

const whyChooseCards = [
  {
    icon: BookOpen,
    title: "Easy Learning",
    description:
      "Step-by-step video guides and illustrated manuals make complex robotics accessible to any student, from day one.",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    iconBg: "bg-primary/10 border-primary/20",
  },
  {
    icon: Package,
    title: "Affordable Labs",
    description:
      "Flexible pricing for every school budget — from a 10-seat starter classroom to a 50-seat innovation center.",
    color: "from-accent/10 to-accent/5",
    iconColor: "text-accent",
    iconBg: "bg-accent/10 border-accent/20",
  },
  {
    icon: Building2,
    title: "School Support",
    description:
      "Dedicated training, curriculum alignment, and on-call tech support for every institution. We're there for you.",
    color: "from-secondary/20 to-secondary/10",
    iconColor: "text-primary",
    iconBg: "bg-secondary/30 border-primary/20",
  },
  {
    icon: Layers,
    title: "Complete Solutions",
    description:
      "Everything in one box — hardware, software, curriculum, and teacher professional development programs.",
    color: "from-primary/10 to-accent/5",
    iconColor: "text-accent",
    iconBg: "bg-accent/10 border-accent/20",
  },
];

export function WhyChooseTinkro() {
  return (
    <section
      className="py-24 bg-muted/30 relative overflow-hidden"
      id="why-tinkro"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Why Tinkro
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground">
            Built for <span className="gradient-text">Educators & Makers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            We built Tinkro from the classroom up — designed to remove every
            barrier between a student and their first robot.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group rounded-2xl p-6 border border-border bg-gradient-to-b ${card.color} hover:border-primary/30 hover:shadow-elevated transition-smooth space-y-4`}
              data-ocid="why-card"
            >
              <div
                className={`w-12 h-12 rounded-xl ${card.iconBg} border flex items-center justify-center`}
              >
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-foreground">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

interface HowItWorksProps {
  steps: HowItWorksStep[];
}

export function HowItWorksSection({ steps }: HowItWorksProps) {
  return (
    <section className="py-24 bg-background" id="how-it-works">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-4"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            How It Works
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground">
            From Box to <span className="gradient-text">Robot in 3 Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every Tinkro kit is designed so that any student — even with zero
            experience — can build and code their first robot.
          </p>
        </motion.div>

        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="flex flex-col items-center text-center space-y-5"
              >
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-secondary to-muted border border-border flex items-center justify-center shadow-elevated relative z-10">
                    <span className="text-5xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-glow-accent z-20">
                    <span className="font-display font-bold text-white text-sm">
                      {String(step.step).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Starter Journey ─────────────────────────────────────────────────────────

const journeyTiers = [
  {
    level: "Beginner",
    badge: "Start Here",
    duration: "Weeks 1–4",
    description:
      "No prior coding needed. Start with block-based programming and build your first moving robot in your very first session.",
    skills: ["Block Coding", "Basic Circuits", "Servo Motors"],
    priceRange: "₹1,299 – ₹3,499",
    items: [
      "Explorer Robot Kit",
      "Arduino Starter Pack",
      "Step-by-step manual",
    ],
    color: "border-accent/40",
    badgeColor: "bg-accent/10 text-accent border-accent/30",
    number: "01",
  },
  {
    level: "Intermediate",
    badge: "Level Up",
    duration: "Month 2–3",
    description:
      "Graduate to real Python code. Add sensors, make decisions, and build autonomous behavior into your robots.",
    skills: ["Python", "Sensors", "Autonomous Logic"],
    priceRange: "₹3,499 – ₹6,299",
    items: ["Mecanum Rover Kit", "Smart Sensor Bundle", "Python curriculum"],
    color: "border-primary/50",
    badgeColor: "bg-primary/10 text-primary border-primary/30",
    number: "02",
  },
  {
    level: "Advanced",
    badge: "Go Pro",
    duration: "Month 4+",
    description:
      "Connect your robot to the cloud. Add computer vision, machine learning, and real-world IoT data pipelines.",
    skills: ["AI / ML", "Computer Vision", "IoT Integration"],
    priceRange: "₹5,999 – ₹7,499",
    items: ["AI Vision Module Pro", "RPi 5 Lab Kit", "AI + IoT curriculum"],
    color: "border-secondary/50",
    badgeColor: "bg-secondary/30 text-primary border-primary/20",
    number: "03",
  },
];

export function StarterJourneySection() {
  return (
    <section
      className="py-24 bg-background relative overflow-hidden"
      id="journey"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Starter Journey
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground">
            Your Path from{" "}
            <span className="gradient-text">Zero to Robotics Pro</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every expert was once a beginner. Tinkro's progressive curriculum
            meets you exactly where you are.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {journeyTiers.map((tier, i) => (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={`relative rounded-2xl bg-card border-2 ${tier.color} p-6 space-y-5 hover:shadow-elevated hover:-translate-y-1 transition-smooth`}
              data-ocid="journey-tier-card"
            >
              {/* Step number */}
              <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow-accent">
                <span className="font-display font-bold text-white text-sm">
                  {tier.number}
                </span>
              </div>

              <div className="space-y-2">
                <Badge
                  className={`border ${tier.badgeColor} text-xs font-semibold`}
                >
                  {tier.badge}
                </Badge>
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground">
                    {tier.level}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {tier.duration}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {tier.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {tier.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground/70 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Included items */}
              <ul className="space-y-1.5">
                {tier.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-1 border-t border-border space-y-3">
                <div>
                  <span className="font-display font-bold text-lg gradient-text">
                    {tier.priceRange}
                  </span>
                </div>
                <Button
                  className="w-full gradient-primary text-white hover:opacity-90 transition-smooth gap-2"
                  onClick={() =>
                    document
                      .getElementById("categories")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  data-ocid="journey-start-btn"
                >
                  <Rocket className="w-4 h-4" />
                  Start Here
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Storytelling ─────────────────────────────────────────────────────

const storyPanels = [
  {
    tag: "The Problem",
    title: "Robotics feels too complex",
    desc: "Most students give up because kits are confusing, instructions are unclear, and there's no support when things go wrong. The learning curve feels impossibly steep.",
    icon: "🤔",
  },
  {
    tag: "The Solution",
    title: "Tinkro breaks it down step by step",
    desc: "Every kit includes illustrated, video-guided instructions. Our curriculum is built by educators, tested by students, and refined until the very first session is a win.",
    icon: "💡",
  },
  {
    tag: "The Outcome",
    title: "Build your first robot in minutes",
    desc: "Thousands of students who 'couldn't do tech' built working robots in their first Tinkro session. Your student will too — or we'll make it right.",
    icon: "🤖",
  },
];

export function StorytellingSection() {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden" id="about">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: story panels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase">
                Our Promise
              </p>
              <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground leading-tight">
                Every Expert Was Once a{" "}
                <span className="gradient-text">Beginner</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Tinkro is designed for the student who's never touched a circuit
                board. Our progressive curriculum takes you from your first LED
                blink to building intelligent robots.
              </p>
            </div>

            <div className="space-y-4">
              {storyPanels.map((panel, i) => (
                <motion.div
                  key={panel.tag}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-subtle transition-smooth"
                >
                  <div className="text-2xl shrink-0 mt-0.5">{panel.icon}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="text-xs text-accent border-accent/30 py-0"
                      >
                        {panel.tag}
                      </Badge>
                    </div>
                    <p className="font-semibold text-foreground text-sm">
                      {panel.title}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      {panel.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              className="gradient-primary text-white hover:opacity-90 shadow-glow-accent transition-smooth gap-2"
              onClick={() =>
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="storytelling-cta"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Right: image with floating stat cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevated aspect-[4/3]">
              <img
                src="/assets/generated/storytelling-student.dim_800x600.jpg"
                alt="Student building robot in STEM lab"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -bottom-6 -left-6 glass-card rounded-xl p-4 shadow-elevated"
            >
              <p className="font-display font-bold text-2xl gradient-text">
                50,000+
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Happy Students
              </p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -top-6 -right-6 glass-card rounded-xl p-4 shadow-elevated"
            >
              <p className="font-display font-bold text-2xl gradient-text">
                500+
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Partner Schools
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

export function FinalCTASection() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToLabs = () => {
    document
      .getElementById("lab-tiers")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-28 relative overflow-hidden bg-[oklch(0.08_0.02_258)]">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-3xl rounded-full"
      />
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.05, 0.1, 0.05] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-8 right-1/4 w-48 h-48 bg-accent/20 blur-2xl rounded-full"
      />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-6"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Get Started Today
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Start Your <span className="gradient-text">Robotics Journey</span>{" "}
            Today
          </h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
            Join 500+ schools and 50,000+ students who chose Tinkro. Whether
            you're buying your first kit or setting up a full innovation lab —
            we're here for every step.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={scrollToTop}
            className="gradient-primary text-white shadow-glow-accent hover:opacity-90 hover:scale-105 text-base px-10 h-12 transition-smooth"
            data-ocid="final-cta-shop"
          >
            Browse Products
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToLabs}
            className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-base px-10 h-12 transition-smooth"
            data-ocid="final-cta-labs"
          >
            Build a Lab
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/40 text-sm"
        >
          Free shipping on orders above ₹999 · GST invoices available · 1-year
          warranty on all kits
        </motion.p>
      </div>
    </section>
  );
}
