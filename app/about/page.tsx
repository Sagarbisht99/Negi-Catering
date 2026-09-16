import type { Metadata } from "next";
import { site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: `About Us | ${site.brand.fullName}`,
  description: `${site.brand.fullName} — family catering and tiffin service since ${site.brand.since} across ${site.location.label}.`,
};

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
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-soft">
            {site.brand.sinceLabel}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-white md:text-6xl">
            About {site.brand.fullName}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-lg">
            A family catering brand built on warmth, tradition, and reliable
            service — for every table, every occasion.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:px-6 md:py-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-sm ring-1 ring-line">
          <Image
            src="/images/chef.jpg"
            alt="Our kitchen team"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
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
          <Link
            href="/gallery"
            className="mt-6 inline-flex rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-white transition hover:bg-terracotta-dark"
          >
            See Our Food
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-ivory-deep/40 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center font-display text-3xl font-semibold text-ink md:text-4xl">
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

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
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

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="overflow-hidden rounded-[28px] bg-terracotta px-6 py-10 text-white md:flex md:items-center md:justify-between md:px-10">
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Planning an event?
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Tell us the date and guest count — we&apos;ll suggest the right menu.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-card px-6 py-3 text-sm font-bold text-terracotta transition hover:bg-ivory md:mt-0"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
