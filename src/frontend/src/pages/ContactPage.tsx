import { useToastContext } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useSearch } from "@tanstack/react-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { Linkedin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiYoutube } from "react-icons/si";

// ─── Subject options ──────────────────────────────────────
const LAB_SUBJECT_OPTIONS = [
  "Lab Setup Enquiry: Starter Lab",
  "Lab Setup Enquiry: Growth Lab",
  "Lab Setup Enquiry: Advanced Lab",
  "Lab Setup Enquiry: Premium Lab",
  "Lab Setup Enquiry: General",
];

const GENERAL_SUBJECT_OPTIONS = [
  "General Inquiry",
  "School Partnership",
  "Bulk Order",
  "Technical Support",
  "Press & Media",
];

// ─── Static data ──────────────────────────────────────────
const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@tinkro.in",
    href: "mailto:hello@tinkro.in",
    color: "#2E6DA4",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9644525429",
    href: "tel:+919644525429",
    color: "#3BBFBF",
  },
  // {
  //   icon: Clock,
  //   label: "Business Hours",
  //   value: "Mon–Fri, 9am–6pm IST",
  //   href: null,
  //   color: "#F47B20",
  // },
  {
    icon: MapPin,
    label: "Location",
    value: "Indore, India",
    href: null,
    color: "#2E6DA4",
  },
];

const socialLinks = [
  {
    icon: SiInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/tinkrokits?igsh=bmV4bmgzMHg0cjB5",
    hoverColor: "#E1306C",
  },
  {
    icon: SiYoutube,
    label: "YouTube",
    href: "https://youtube.com/@tinkro?si=DqOVZXisKa4mbAxN",
    hoverColor: "#FF0000",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/tinkrokits/",
    hoverColor: "#0A66C2",
  },
  {
    icon: SiFacebook,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61581192200900",
    hoverColor: "#1877F2",
  },
  {
    icon: SiWhatsapp,
    label: "WhatsApp",
    href: "Message Tinkro on WhatsApp. https://wa.me/919644525429",
    hoverColor: "#25D366",
  },
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  schoolName?: string;
}

// ─── Pre-fill banner ──────────────────────────────────────
function PreFillBanner({
  subject,
  onClear,
}: {
  subject: string;
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-6"
      style={{
        background: "oklch(0.45 0.12 243 / 0.12)",
        borderColor: "oklch(0.45 0.12 243 / 0.3)",
      }}
    >
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5 text-primary" />
      </div>
      <p className="text-sm text-white/80 flex-1 min-w-0">
        Enquiry pre-filled:{" "}
        <span className="font-semibold text-white">{subject}</span>
      </p>
      <button
        type="button"
        aria-label="Clear pre-fill"
        onClick={onClear}
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────
export function ContactPage() {
  const { addToast } = useToastContext();
  const search = useSearch({ from: "/contact" }) as { subject?: string };
  const prefillSubject = search.subject ?? "";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: prefillSubject,
    message: prefillSubject
      ? `Hi Tinkro team,\n\nI'm interested in the ${prefillSubject.replace("Lab Setup Enquiry: ", "")} for our school. Could you please share more details about pricing, components included, and setup timeline?\n\nThank you.`
      : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(!!prefillSubject);

  // Sync pre-fill if the URL param changes (e.g., browser back/forward)
  useEffect(() => {
    if (prefillSubject) {
      setForm((prev) => ({
        ...prev,
        subject: prefillSubject,
        message:
          prev.message ||
          `Hi Tinkro team,\n\nI'm interested in the ${prefillSubject.replace("Lab Setup Enquiry: ", "")} for our school. Could you please share more details about pricing, components included, and setup timeline?\n\nThank you.`,
      }));
      setIsPrefilled(true);
    }
  }, [prefillSubject]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClearPrefill = () => {
    setIsPrefilled(false);
    setForm((prev) => ({ ...prev, subject: "", message: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const labType = form.subject.startsWith("Lab Setup Enquiry")
        ? form.subject.replace("Lab Setup Enquiry: ", "")
        : "General";

      await addDoc(collection(db, "enquiries"), {
        name: form.name,
        email: form.email,
        phone: "",
        labType,
        subject: form.subject,
        message: form.message,
        schoolName: form.schoolName ?? "",
        status: "new",
        priority: "medium",
        createdAt: serverTimestamp(),
        respondedAt: null,
      });

      addToast(
        "Your message has been sent! We'll reply within 24 hours.",
        "success",
      );
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        schoolName: "",
      });
      setIsPrefilled(false);
    } catch (err) {
      console.error("Enquiry save failed:", err);
      addToast(
        "Failed to send message. Please try again or contact us directly.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Is this a lab enquiry?
  const isLabEnquiry = form.subject.startsWith("Lab Setup Enquiry");

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section
        className="relative pt-28 pb-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.15 0.05 240) 50%, oklch(0.12 0.04 230) 100%)",
        }}
      >
        {/* Glow blobs */}
        <div
          className="absolute top-0 right-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #F47B20 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #2E6DA4 0%, transparent 70%)",
          }}
        />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-4 gradient-orange text-primary-foreground border-0 px-3 py-1">
              {isLabEnquiry ? "Lab Setup Enquiry" : "Contact Us"}
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {isLabEnquiry ? (
                <>
                  Let&apos;s Build Your{" "}
                  <span className="gradient-text-orange">Dream Lab</span>
                </>
              ) : (
                <>
                  Get <span className="gradient-text-orange">In Touch</span>
                </>
              )}
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              {isLabEnquiry
                ? "Tell us about your school and we'll design the perfect lab setup for you — fully installed and ready to use."
                : "We'd love to hear from you — reach out for orders, partnerships, or just to say hello."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two-column: Form + Sidebar */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Left: Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div
                className="rounded-2xl border border-border p-8 sm:p-10"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.14 0.02 250 / 0.9) 0%, oklch(0.12 0.03 245 / 0.9) 100%)",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-bold text-white mb-2">
                    {isLabEnquiry ? "Request a Lab Quote" : "Send Us a Message"}
                  </h2>
                  <p className="text-white/55 text-sm">
                    {isLabEnquiry
                      ? "Fill in your details and our lab specialist will reach out within 24 hours."
                      : "Fill in the form below and we'll be in touch within 24 hours."}
                  </p>
                </div>

                {/* Pre-fill banner */}
                <AnimatePresence>
                  {isPrefilled && form.subject && (
                    <PreFillBanner
                      subject={form.subject}
                      onClear={handleClearPrefill}
                    />
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-white/80"
                    >
                      Full Name <span className="text-[#F47B20]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="off"
                      className="w-full h-11 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3BBFBF] focus:border-transparent transition-smooth"
                      data-ocid="contact-name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-white/80"
                    >
                      Email Address <span className="text-[#F47B20]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      className="w-full h-11 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3BBFBF] focus:border-transparent transition-smooth"
                      data-ocid="contact-email"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-white/80"
                    >
                      Subject <span className="text-[#F47B20]">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full h-11 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3BBFBF] focus:border-transparent transition-smooth appearance-none cursor-pointer"
                      style={{ colorScheme: "dark" }}
                      data-ocid="contact-subject"
                    >
                      <option
                        value=""
                        disabled
                        style={{ background: "#1a1f35" }}
                      >
                        Select a subject
                      </option>

                      <optgroup
                        label="── Lab Setup Enquiries ──"
                        style={{ background: "#1a1f35", color: "#3BBFBF" }}
                      >
                        {LAB_SUBJECT_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            style={{ background: "#1a1f35" }}
                          >
                            {opt}
                          </option>
                        ))}
                      </optgroup>

                      <optgroup
                        label="── General ──"
                        style={{ background: "#1a1f35", color: "#3BBFBF" }}
                      >
                        {GENERAL_SUBJECT_OPTIONS.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            style={{ background: "#1a1f35" }}
                          >
                            {opt}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* School name – shown when it's a lab enquiry */}
                  <AnimatePresence>
                    {isLabEnquiry && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1.5 pt-0.5">
                          <label
                            htmlFor="schoolName"
                            className="text-sm font-medium text-white/80"
                          >
                            School / Institution Name
                          </label>
                          <input
                            id="schoolName"
                            name="schoolName"
                            type="text"
                            value={form.schoolName ?? ""}
                            onChange={handleChange}
                            autoComplete="off"
                            className="w-full h-11 px-4 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3BBFBF] focus:border-transparent transition-smooth"
                            data-ocid="contact-school-name"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-white/80"
                    >
                      Message <span className="text-[#F47B20]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={isLabEnquiry ? 6 : 5}
                      value={form.message}
                      onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3BBFBF] focus:border-transparent transition-smooth resize-none"
                      data-ocid="contact-message"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-sm font-semibold border-0 text-white transition-smooth"
                    style={{
                      background:
                        "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                      boxShadow:
                        "0 0 20px rgba(244,123,32,0.35), 0 4px 12px rgba(244,123,32,0.2)",
                    }}
                    data-ocid="contact-submit"
                  >
                    {isSubmitting
                      ? "Sending…"
                      : isLabEnquiry
                        ? "Send Lab Enquiry →"
                        : "Send Message →"}
                  </Button>

                  {isLabEnquiry && (
                    <p className="text-center text-xs text-white/40 pt-1">
                      Our lab specialist will reply within 24 hours with a
                      customised quote.
                    </p>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Right: Contact Details + Social */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Lab Enquiry quick tip */}
              <AnimatePresence>
                {isLabEnquiry && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border p-6 space-y-3"
                    style={{
                      background: "oklch(0.71 0.17 48 / 0.08)",
                      borderColor: "oklch(0.71 0.17 48 / 0.25)",
                    }}
                  >
                    <p className="text-sm font-bold text-[#F5A623] uppercase tracking-wider">
                      What happens next?
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        "Our lab specialist reviews your enquiry",
                        "We send a customised quote within 24h",
                        "Free consultation call to plan your lab",
                        "Delivery + installation at your school",
                      ].map((step, i) => (
                        <li
                          key={step}
                          className="flex items-start gap-2.5 text-sm text-white/70"
                        >
                          <span
                            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                              background: "oklch(0.71 0.17 48 / 0.2)",
                              color: "#F5A623",
                            }}
                          >
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact info card */}
              <div
                className="rounded-2xl border border-border p-8"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.14 0.02 250 / 0.9) 0%, oklch(0.12 0.03 245 / 0.9) 100%)",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <h3 className="font-display text-lg font-bold text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  {contactDetails.map((detail) => {
                    const Icon = detail.icon;
                    const content = (
                      <div
                        className="flex items-start gap-4 group"
                        key={detail.label}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-smooth group-hover:scale-110"
                          style={{ background: `${detail.color}20` }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{ color: detail.color }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/45 font-medium uppercase tracking-wider mb-0.5">
                            {detail.label}
                          </p>
                          <p className="text-sm font-semibold text-white/90 break-words">
                            {detail.value}
                          </p>
                        </div>
                      </div>
                    );
                    return detail.href ? (
                      <a
                        key={detail.label}
                        href={detail.href}
                        className="block hover:opacity-80 transition-smooth"
                        data-ocid={`contact-info-${detail.label.toLowerCase()}`}
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={detail.label}>{content}</div>
                    );
                  })}
                </div>
              </div>

              {/* Social links */}
              <div
                className="rounded-2xl border border-border p-8"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.14 0.02 250 / 0.9) 0%, oklch(0.12 0.03 245 / 0.9) 100%)",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <h3 className="font-display text-lg font-bold text-white mb-5">
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm font-medium transition-smooth hover:border-white/25 hover:bg-white/10 hover:text-white"
                        style={{ cursor: "pointer" }}
                        data-ocid={`contact-social-${social.label.toLowerCase()}`}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            social.hoverColor;
                          (
                            e.currentTarget as HTMLAnchorElement
                          ).style.borderColor = `${social.hoverColor}50`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "";
                          (
                            e.currentTarget as HTMLAnchorElement
                          ).style.borderColor = "";
                        }}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* FAQ note */}
              <div
                className="rounded-2xl border border-white/10 p-6 flex items-start gap-4"
                style={{
                  background: "rgba(59,191,191,0.06)",
                  borderColor: "rgba(59,191,191,0.2)",
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#3BBFBF]/15">
                  <BookOpen className="w-4 h-4 text-[#3BBFBF]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/70 leading-relaxed">
                    Have more questions?{" "}
                    <Link
                      to="/blog"
                      className="text-[#3BBFBF] font-semibold hover:underline"
                      data-ocid="contact-learning-center-link"
                    >
                      Browse our Learning Center
                    </Link>{" "}
                    for guides, tutorials, and answers.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden p-10 sm:p-14 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.1 0.04 250) 0%, oklch(0.18 0.06 240) 50%, oklch(0.12 0.04 230) 100%)",
              border: "1px solid rgba(244,123,32,0.25)",
              boxShadow:
                "0 0 60px rgba(244,123,32,0.1), 0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* Glow accents */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(244,123,32,0.12) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-36 blur-3xl opacity-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, #2E6DA4 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <Badge className="mb-5 gradient-orange text-primary-foreground border-0 px-3 py-1">
                STEM Lab Solutions
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Ready to transform your school's{" "}
                <span className="gradient-text-orange">STEM lab?</span>
              </h2>
              <p className="text-white/60 max-w-lg mx-auto mb-8 leading-relaxed">
                Discover our complete range of lab setup packages designed for
                schools, colleges, and institutions across India.
              </p>
              <Link to="/labs" data-ocid="contact-cta-labs">
                <Button
                  className="h-12 px-8 text-sm font-semibold border-0 text-white transition-smooth"
                  style={{
                    background:
                      "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
                    boxShadow:
                      "0 0 24px rgba(244,123,32,0.4), 0 4px 14px rgba(244,123,32,0.25)",
                  }}
                >
                  View Lab Setups
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
