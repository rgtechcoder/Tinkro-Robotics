export function WarrantyPage() {
  return (
    <section className="pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Support
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Warranty
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          Tinkro products are designed for durability and backed by warranty.
        </p>

        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Coverage
            </h2>
            <p>
              Manufacturing defects are covered under warranty. Coverage periods
              may vary by product category.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Exclusions
            </h2>
            <p>
              Damage due to mishandling, water exposure, or unauthorized
              modifications is not covered.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              How to Claim
            </h2>
            <p>
              Contact us at hello@tinkro.in with your order ID and product
              details. Our support team will assist you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
