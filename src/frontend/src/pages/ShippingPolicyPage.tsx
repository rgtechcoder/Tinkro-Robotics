export function ShippingPolicyPage() {
  return (
    <section className="pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Support
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Shipping Policy
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          Clear and transparent shipping information for all Tinkro orders.
        </p>

        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Processing Time
            </h2>
            <p>
              Orders are typically processed within 1–2 business days. You will
              receive a confirmation email once your order is placed.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Delivery Timeline
            </h2>
            <p>
              Standard delivery takes 3–7 business days depending on your
              location. Remote areas may take a little longer.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Shipping Charges
            </h2>
            <p>
              Shipping charges (if applicable) are shown at checkout. We also
              run free-shipping offers on selected orders and promotions.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Order Updates
            </h2>
            <p>
              You will receive shipping updates by email. You can also track
              your order from the Track Order page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
