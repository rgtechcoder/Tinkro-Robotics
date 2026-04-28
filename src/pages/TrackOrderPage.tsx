import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

export function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  function handleTrack() {
    if (!orderId.trim()) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <section className="pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Support
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Track Order
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          Enter your order ID to view the latest status. For full tracking,
          please log in to your dashboard.
        </p>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Order ID
          </label>
          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. TKR-20260423-XXXXXX"
              className="h-11 flex-1 rounded-xl border border-border/60 bg-background/60 px-4 text-sm text-foreground placeholder:text-muted-foreground/60"
            />
            <button
              type="button"
              onClick={handleTrack}
              className="h-11 px-5 rounded-xl text-sm font-semibold text-white transition-smooth"
              style={{
                background:
                  "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
              }}
            >
              Track
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Prefer email updates? Check your inbox for shipping and delivery
            notifications.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Login to Dashboard
            </Link>
            <span className="text-muted-foreground">or</span>
            <Link to="/contact" className="text-primary font-medium hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
