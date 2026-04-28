export function ReturnsPage() {
  return (
    <section className="pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Support
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Returns & Refunds
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          Our return policy ensures a smooth and fair experience for everyone.
        </p>

        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Eligibility
            </h2>
            <p>
              Returns are accepted within 7 days of delivery for unused items
              in original packaging. Certain items may not be eligible (e.g.,
              customized kits).
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Return Process
            </h2>
            <p>
              Email us at hello@tinkro.in with your order ID and reason for
              return. Our team will guide you through the next steps.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Refunds
            </h2>
            <p>
              Refunds are processed within 5–7 business days after we receive
              and inspect the returned item.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
