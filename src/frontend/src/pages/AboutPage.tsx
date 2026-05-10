import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Building2,
  FlaskConical,
  Layers,
  MapPin,
  Package,
  School,
  Users,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const impactStats = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "Students Empowered",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: School,
    value: 500,
    suffix: "+",
    label: "Schools Partnered",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: FlaskConical,
    value: 2000,
    suffix: "+",
    label: "Labs Built",
    color: "text-[oklch(0.71_0.17_48)]",
    bg: "bg-[oklch(0.71_0.17_48)]/10",
  },
  {
    icon: MapPin,
    value: 15,
    suffix: "+",
    label: "States Covered",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const whyCards = [
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

const teamMembers = [
  {
    initials: "AK",
    name: "Arjun Kumar",
    role: "Founder & CEO",
    bio: "Serial entrepreneur with 12+ years in STEM education. Built and scaled two EdTech companies before founding Tinkro.",
    gradient: "from-primary to-accent",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    role: "Head of Product",
    bio: "Former product lead at Makeblock India. Passionate about designing hardware-software experiences that delight young learners.",
    gradient: "from-accent to-[oklch(0.71_0.17_48)]",
  },
  {
    initials: "RM",
    name: "Rohan Mehta",
    role: "Lead Engineer",
    bio: "IIT Bombay graduate and robotics competition veteran. Architects the firmware and curriculum behind every Tinkro kit.",
    gradient: "from-[oklch(0.71_0.17_48)] to-primary",
  },
  {
    initials: "AS",
    name: "Anjali Singh",
    role: "Education Director",
    bio: "Curriculum specialist with 15 years in school STEM programs. Ensures Tinkro aligns with CBSE, ICSE, and NEP 2020 standards.",
    gradient: "from-primary to-[oklch(0.55_0.14_195)]",
  },
];

const partners = [
  { name: "STEM Labs India", abbr: "SLI" },
  { name: "Atal Innovation Mission", abbr: "AIM" },
  { name: "National Science Foundation", abbr: "NSF" },
  { name: "PM SHRI Schools", abbr: "PMSHRI" },
  { name: "ATL Network", abbr: "ATL" },
  { name: "CBSE", abbr: "CBSE" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AboutPage() {
  const showTeamSection = false;

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.08 0.04 252) 0%, oklch(0.13 0.05 243) 50%, oklch(0.1 0.04 235) 100%)",
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #2E6DA4 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-40px] right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #F47B20 0%, transparent 70%)",
          }}
        />
        {/* Decorative ring */}
        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/10 opacity-40 pointer-events-none" />
        <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-accent/10 opacity-30 pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6"
            >
              <Badge className="gradient-primary text-white border-0 px-3 py-1 text-xs font-semibold tracking-wide">
                About Tinkro
              </Badge>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight">
                Empowering India's{" "}
                <span className="gradient-text-orange">Next Generation</span> of
                Innovators
              </h1>
              <p className="text-lg text-white/65 leading-relaxed max-w-2xl">
                Tinkro was founded on a simple belief: every Indian student
                deserves access to world-class robotics and STEM education —
                regardless of their city, budget, or background.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link to="/contact">
                <Button
                  size="lg"
                  className="gradient-primary text-white border-0 shadow-glow-primary hover:opacity-90 transition-smooth h-12 px-8 font-semibold gap-2"
                  data-ocid="hero-cta-contact"
                >
                  Partner With Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 font-semibold border-white/20 text-white bg-white/10 hover:bg-white/15 backdrop-blur-sm transition-smooth"
                  data-ocid="hero-cta-products"
                >
                  Explore Products
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Impact Stats Strip ─────────────────────────────────────────────── */}
      <section
        className="py-16 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.1 0.04 252) 0%, oklch(0.16 0.06 243) 60%, oklch(0.13 0.05 230) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.45 0.12 243 / 0.15) 0%, transparent 70%)",
          }}
        />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {impactStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center space-y-3"
                  data-ocid="impact-stat"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${stat.bg} border border-white/10 flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="font-display text-4xl sm:text-5xl font-bold text-white">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-white/55 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Brand Story ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/4 blur-3xl rounded-full pointer-events-none" />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-7"
            >
              <div className="space-y-4">
                <p className="text-accent font-semibold text-sm tracking-widest uppercase">
                  Our Story
                </p>
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Making Robotics{" "}
                  <span className="gradient-text">Accessible to All</span>
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base">
                Tinkro was born from a simple observation: talented students in
                Tier-2 and Tier-3 cities across India had the curiosity and
                drive to become world-class engineers — but they lacked access
                to the right learning tools. School labs were either
                non-existent or filled with outdated equipment that teachers
                didn't know how to use.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                We set out to change that. Our{" "}
                <span className="text-foreground font-medium">mission</span> is
                to bring world-class STEM education tools to every school in
                India — premium, curriculum-aligned kits paired with guided
                lesson plans and hands-on teacher training. Our{" "}
                <span className="text-foreground font-medium">vision</span> is a
                generation of young Indian innovators building the future of
                robotics, AI, and technology on the global stage.
              </p>
              <div className="flex gap-8 pt-2">
                <div>
                  <p className="font-display font-bold text-2xl gradient-text">
                    2021
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Founded</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="font-display font-bold text-2xl gradient-text">
                    100%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Made in India
                  </p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="font-display font-bold text-2xl gradient-text-orange">
                    ₹5Cr+
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kits Shipped
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission / Vision cards */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="space-y-5"
            >
              {/* Mission */}
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-7 border border-primary/20 space-y-3 hover:border-primary/40 transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    Our Mission
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Bring world-class STEM education tools to every school in
                  India — making robotics accessible, affordable, and genuinely
                  exciting for every student.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-7 border border-accent/20 space-y-3 hover:border-accent/40 transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <span className="text-lg">🚀</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    Our Vision
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  A generation of young Indian innovators who grow up building,
                  coding, and solving real problems — leading the global future
                  of technology and engineering.
                </p>
              </motion.div>

              {/* Values highlight */}
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl p-7 border border-[oklch(0.71_0.17_48)]/20 space-y-3 hover:border-[oklch(0.71_0.17_48)]/40 transition-smooth"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.71 0.17 48 / 0.06) 0%, oklch(0.76 0.16 72 / 0.04) 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center">
                    <span className="text-lg">💡</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    Our Values
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Student-first design, global benchmarks, radical transparency,
                  and relentless improvement. We hold ourselves to the same
                  standard we set for our students.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Tinkro ──────────────────────────────────────────────── */}
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
              Why Choose Us
            </p>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground">
              Built for{" "}
              <span className="gradient-text">Educators & Makers</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              We built Tinkro from the classroom up — designed to remove every
              barrier between a student and their first robot.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map((card, i) => {
              const Icon = card.icon;
              return (
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
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────────────── */}
      {showTeamSection ? (
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/4 blur-3xl rounded-full pointer-events-none" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 space-y-4"
            >
              <p className="text-accent font-semibold text-sm tracking-widest uppercase">
                The People
              </p>
              <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground">
                Meet the <span className="gradient-text">Team</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Builders, educators, and engineers united by a passion for making
                robotics education accessible to every Indian student.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-card border border-border rounded-2xl p-6 text-center space-y-4 hover:border-primary/30 hover:shadow-elevated transition-smooth"
                  data-ocid={`team-member-${i}`}
                >
                  {/* Avatar */}
                  <div className="mx-auto">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto shadow-elevated`}
                    >
                      <span className="font-display font-bold text-xl text-white">
                        {member.initials}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-primary">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Partners ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 blur-3xl rounded-full pointer-events-none" />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-3"
          >
            <p className="text-accent font-semibold text-sm tracking-widest uppercase">
              Trusted By
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-foreground">
              Our <span className="gradient-text">Partners & Networks</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Working alongside India's most respected educational institutions
              and innovation programs.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-primary/30 hover:shadow-elevated transition-smooth cursor-default min-h-[100px]"
                data-ocid="partner-card"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-subtle">
                  <span className="font-display font-bold text-white text-xs leading-none text-center">
                    {partner.abbr.slice(0, 3)}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground/70 text-center leading-tight">
                  {partner.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.08 0.04 252) 0%, oklch(0.13 0.05 243) 55%, oklch(0.1 0.04 232) 100%)",
        }}
      >
        {/* Ambient blobs */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/15 blur-3xl rounded-full pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -18, 0], opacity: [0.06, 0.12, 0.06] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-8 right-1/4 w-48 h-48 bg-accent/20 blur-2xl rounded-full pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 14, 0], opacity: [0.08, 0.14, 0.08] }}
          transition={{
            duration: 4.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-8 left-1/4 w-36 h-36 bg-[oklch(0.71_0.17_48)]/20 blur-2xl rounded-full pointer-events-none"
        />

        <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            <p className="text-accent font-semibold text-sm tracking-widest uppercase">
              Let's Build Together
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight">
              Partner With <span className="gradient-text-orange">Tinkro</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Whether you're a school administrator, government body, NGO, or
              education investor — we'd love to co-create India's most impactful
              STEM learning program with you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/contact">
              <Button
                size="lg"
                className="gradient-primary text-white border-0 shadow-glow-primary hover:opacity-90 hover:scale-105 transition-smooth h-12 px-10 font-semibold gap-2"
                data-ocid="cta-get-in-touch"
              >
                Get In Touch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/labs">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-10 font-semibold border-white/20 text-white bg-white/10 hover:bg-white/15 backdrop-blur-sm transition-smooth"
                data-ocid="cta-explore-labs"
              >
                Explore Lab Solutions
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-white/35 text-sm"
          >
            GST invoices available · 1-year warranty on all kits · Free
            installation support for labs
          </motion.p>
        </div>
      </section>
    </main>
  );
}
