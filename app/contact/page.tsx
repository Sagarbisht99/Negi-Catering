import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { citiesLine, emailHref, phoneHref, site } from "@/data/site";
import Image from "next/image";

export const metadata: Metadata = {
  title: `Contact Us | ${site.brand.fullName}`,
  description: `Contact ${site.brand.fullName} for catering quotes, tiffin orders, and event bookings across ${site.location.label}.`,
};

export default function ContactPage() {
  const details = [
    {
      label: "Phone",
      value: site.contact.phoneDisplay,
      href: phoneHref(),
    },
    {
      label: "Email",
      value: site.contact.email,
      href: emailHref(),
    },
    {
      label: "Service Area",
      value: citiesLine(),
    },
    {
      label: "Hours",
      value: site.contact.hours,
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/feast.jpg"
            alt="Catering spread"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-soft">
            Get in touch
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/90 md:text-base">
            Tell us your event details — we&apos;ll help with the right menu and
            guest count.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[0.9fr_1.2fr] md:px-6 md:py-16">
        <aside className="space-y-4">
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-line">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src={site.brand.logo}
                alt={site.brand.name}
                width={56}
                height={52}
                className="h-12 w-auto object-contain"
              />
              <div>
                <p className="font-display text-xl font-semibold text-ink">
                  {site.brand.name}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                  {site.brand.sinceLabel}
                </p>
              </div>
            </div>
            <ul className="space-y-4">
              {details.map((d) => (
                <li key={d.label}>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                    {d.label}
                  </p>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="mt-1 block text-sm font-semibold text-ink hover:text-terracotta"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-ink">{d.value}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl bg-terracotta p-6 text-white shadow-sm">
            <p className="font-display text-2xl font-semibold">Need a quick quote?</p>
            <p className="mt-2 text-sm text-white/90">
              Share guest count and occasion — we reply the same day.
            </p>
          </div>
        </aside>

        <div>
          <h2 className="mb-4 font-display text-2xl font-semibold text-ink md:text-3xl">
            Send an enquiry
          </h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
