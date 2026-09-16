import type { Metadata } from "next";
import { hardcodedServices } from "@/data/services";
import { site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Services | ${site.brand.fullName}`,
  description: `Explore catering services from ${site.brand.name} — daily tiffin, buffet, live counters, office meals, wedding feasts, and pooja prasad across ${site.location.label}.`,
};

export default function ServicesPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/feast.jpg"
            alt="Catering services"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative mx-auto max-w-7xl px-3 py-14 sm:px-4 md:px-6 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-soft">
            Our Services
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl md:text-6xl">
            Catering for every occasion
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-lg">
            From daily tiffin to wedding feasts — choose a service that fits your
            guest count, venue, and style.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {hardcodedServices.map((service) => (
            <article
              key={service.id}
              className="relative overflow-hidden rounded-[22px] bg-card p-4 shadow-sm ring-1 ring-line sm:rounded-[24px] md:p-6"
            >
              <div className="flex flex-wrap gap-2">
                {service.tag ? (
                  <span className="rounded-md bg-terracotta px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {service.tag}
                  </span>
                ) : null}
                <span className="rounded-md bg-ink/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {service.guests}
                </span>
              </div>
              <div className="mt-4 flex gap-3 sm:mt-5 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    {site.brand.name}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                    <span className="text-ink">{service.accent}</span>{" "}
                    <span className="text-terracotta">{service.title}</span>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                  <ul className="mt-3 space-y-2 sm:mt-4">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-ink/80">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leaf text-[10px] font-bold text-white">
                          ✓
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex rounded-lg bg-terracotta px-5 py-2 text-sm font-bold text-white transition hover:bg-terracotta-dark sm:mt-5"
                  >
                    Enquire
                  </Link>
                </div>
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-36 sm:w-36 md:h-40 md:w-40">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-12 sm:px-4 md:px-6 md:pb-16">
        <div className="overflow-hidden rounded-[24px] bg-terracotta px-5 py-8 text-white sm:rounded-[28px] sm:px-6 md:flex md:items-center md:justify-between md:px-10 md:py-10">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
              Not sure which service fits?
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Tell us the occasion and guest count — we&apos;ll suggest the right package.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-card px-6 py-3 text-sm font-bold text-terracotta transition hover:bg-ivory md:mt-0 md:w-auto"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
