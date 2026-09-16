import { site } from "@/data/site";

export default function StatsBanner() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="relative overflow-hidden rounded-[28px] bg-card px-6 py-10 shadow-sm ring-1 ring-line md:px-10 md:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #c45c26 1px, transparent 1px), radial-gradient(circle at 80% 60%, #3f7a4a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-terracotta">
              <span className="h-2 w-2 rounded-full bg-terracotta" />
              Trusted family caterers {site.brand.sinceLabel.toLowerCase()}
            </p>
            <h2 className="mt-3 font-display text-5xl font-semibold text-ink md:text-6xl">
              Generations
              <span className="mt-1 block text-2xl font-medium md:text-3xl">
                of Happy Hosts
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
              {site.brand.fullName} brings home-style cooking to your table — for
              small gatherings and grand celebrations across {site.location.label},
              with warm hospitality and careful presentation.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center lg:min-w-[360px]">
            {[
              { value: "500+", label: "Menu Options" },
              { value: "4.8/5", label: "Guest Rating" },
              {
                value: `${new Date().getFullYear() - site.brand.since}+`,
                label: "Years of Trust",
              },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-semibold text-terracotta md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
