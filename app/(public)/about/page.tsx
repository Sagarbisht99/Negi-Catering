import type { Metadata } from "next";
import { site } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description: `${site.brand.fullName} — family catering and tiffin service since ${site.brand.since} across ${site.location.label}. Home-style taste, hygienic kitchen, event-ready service.`,
  keywords: `about Negi Caterers, catering since ${site.brand.since}, tiffin Delhi NCR, family caterers`,
  path: "/about",
});

const values = [
  {
    title: "Home-style taste",
    desc: "Recipes passed down through generations, cooked fresh for every order.",
  },
  {
    title: "Hygienic kitchen",
    desc: "Clean prep, careful packing, and on-time delivery you can trust.",
  },
  {
    title: "Event-ready service",
    desc: "From intimate dinners to weddings — we plan, cook, and present with care.",
  },
];

const milestones = [
  { year: String(site.brand.since), text: "Family kitchen roots begin" },
  { year: "1990s", text: "Tiffin service expands across the neighbourhood" },
  { year: "2010s", text: "Full catering for weddings & corporate events" },
  {
    year: "Today",
    text: `Serving ${site.location.label} with classic & festive menus`,
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/dining.jpg"
            alt="Catering setup"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative mx-auto max-w-7xl px-3 py-14 sm:px-4 md:px-6 md:py-28">
          <Breadcrumb
            variant="dark"
            items={[{ name: "About Us" }]}
          />
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl md:text-6xl">
            About {site.brand.fullName}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-lg">
            A family catering brand built on warmth, tradition, and reliable
            service — for every table, every occasion.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-stretch gap-8 px-3 py-10 sm:px-4 md:grid-cols-2 md:gap-10 md:px-6 md:py-20">
        <div className="relative min-h-[280px] overflow-hidden rounded-[28px] shadow-sm ring-1 ring-line md:min-h-0">
          <Image
            src="/images/about-feast.png"
            alt="Indian catering feast with curries, rice, naan and tandoori"
            fill
            quality={90}
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
            {site.brand.sinceLabel}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
            Our Story
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            What started as a family kitchen in {site.brand.since} has grown into
            a trusted catering and tiffin service across {site.location.label}. We
            still cook the way our elders taught us — fresh ingredients, patient
            tempering, and menus that feel like home.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Today we serve house parties, offices, poojas, weddings, and
            festivals with the same care: clear communication, punctual
            delivery, and food that guests remember.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Whether you need a simple tray delivery or a full buffet with live
            counters, we stay reachable from the first enquiry to the last plate
            — so your gathering feels warm, organised, and completely yours.
          </p>
          <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
            <li className="flex items-start gap-2.5 text-sm font-medium text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" aria-hidden />
              Classic recipes, cooked fresh for every order
            </li>
            <li className="flex items-start gap-2.5 text-sm font-medium text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" aria-hidden />
              Hygienic kitchen and careful packing
            </li>
            <li className="flex items-start gap-2.5 text-sm font-medium text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" aria-hidden />
              Event-ready service for every guest count
            </li>
          </ul>
          <Link
            href="/services"
            className="mt-6 inline-flex w-fit rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-white transition hover:bg-terracotta-dark"
          >
            See Our Services
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-ivory-deep/40 py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
          <h2 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
            What We Stand For
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map((v) => (
              <article
                key={v.title}
                className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-line"
              >
                <h3 className="text-lg font-bold text-terracotta">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
          Our Journey
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <div
              key={m.year}
              className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-line"
            >
              <p className="font-display text-2xl font-semibold text-terracotta">
                {m.year}
              </p>
              <p className="mt-2 text-sm text-muted">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-12 sm:px-4 md:px-6 md:pb-16">
        <div className="overflow-hidden rounded-[24px] bg-terracotta px-5 py-8 text-white sm:rounded-[28px] sm:px-6 md:flex md:items-center md:justify-between md:px-10 md:py-10">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
              Planning an event?
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Tell us the date and guest count — we&apos;ll suggest the right menu.
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
