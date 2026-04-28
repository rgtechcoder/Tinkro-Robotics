import { Link } from "@tanstack/react-router";
import { Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";

type FooterLinkItem = { label: string; to?: string; href?: string };

const footerLinks: Record<string, FooterLinkItem[]> = {
  Products: [
    { label: "Arduino Kits", to: "/products" },
    { label: "Robotics Kits", to: "/products" },
    { label: "Sensors", to: "/products" },
    { label: "AI & ML Kits", to: "/products" },
    { label: "Development Boards", to: "/products" },
  ],
  "Lab Solutions": [
    { label: "Starter Lab", to: "/labs" },
    { label: "Growth Lab", to: "/labs" },
    { label: "Advanced Lab", to: "/labs" },
    { label: "Premium Lab", to: "/labs" },
    { label: "Custom Quote", to: "/contact" },
  ],
  Company: [
    { label: "About Tinkro", to: "/about" },
    { label: "Careers", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Press", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  Support: [
    { label: "FAQs", to: "/faq" },
    { label: "Shipping Policy", to: "/shipping-policy" },
    { label: "Returns", to: "/returns" },
    { label: "Warranty", to: "/warranty" },
    { label: "Track Order", to: "/track-order" },
  ],
};

const socialLinks = [
  { icon: SiInstagram, href: "https://www.instagram.com/tinkrokits?igsh=bmV4bmgzMHg0cjB5", label: "Instagram" },
  { icon: SiYoutube, href: "https://youtube.com/@tinkro?si=DqOVZXisKa4mbAxN", label: "YouTube" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/tinkrokits/", label: "LinkedIn" },
  { icon: SiFacebook, href: "https://www.facebook.com/profile.php?id=61581192200900", label: "Facebook" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="bg-card border-t border-border" data-ocid="footer">
      {/* Main footer content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center">
              <img
                src="/assets/brand/logo.png"
                alt="Tinkro"
                className="h-12 w-auto object-contain"
                style={{ maxWidth: "160px" }}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Empowering the next generation of innovators through robotics, AI,
              and STEM education. Quality kits, expert curriculum, and lifetime
              support.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center transition-all duration-200 text-muted-foreground"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#2E6DA4";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <a
                href="https://wa.me/9196445254299"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center transition-all duration-200 text-muted-foreground"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#3BBFBF";
                  (e.currentTarget as HTMLElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.color = "";
                }}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-2 pt-1">
              <a
                href="mailto:hello@tinkro.in"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail
                  className="w-4 h-4 shrink-0"
                  style={{ color: "#3BBFBF" }}
                />
                hello@tinkro.in
              </a>
              <a
                href="tel:+918000000000"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone
                  className="w-4 h-4 shrink-0"
                  style={{ color: "#3BBFBF" }}
                />
                +91 9644525429
              </a>
              <span className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: "#3BBFBF" }}
                />
                Indore, India
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4 lg:col-span-1">
              <h4
                className="font-display font-semibold text-xs tracking-wide uppercase"
                style={{ color: "rgba(46,109,164,0.8)" }}
              >
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href ?? "#"}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Tinkro. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            {" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
            
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

