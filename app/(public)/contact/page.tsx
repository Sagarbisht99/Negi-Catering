import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { citiesLine, emailHref, mapsEmbedSrc, mapsHref, phoneHref, site } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";
import Image from "next/image";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  description: `Contact ${site.brand.fullName} for catering quotes, tiffin orders, and event bookings across ${site.location.label}. Call ${site.contact.phoneDisplay} or send an enquiry online.`,
  keywords: `contact Negi Caterers, catering quote Delhi, tiffin booking, ${site.location.addressLocality}`,
  path: "/contact",
});

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
      label: "Location",
      value: site.location.address,
      href: mapsHref(),
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
        <div className="relative mx-auto max-w-7xl px-3 py-12 sm:px-4 md:px-6 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-soft">
            Get in touch
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/90 md:text-base">
            Tell us your event details — we&apos;ll help with the right menu and
            guest count.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-3 py-10 sm:px-4 md:grid-cols-[0.9fr_1.2fr] md:px-6 md:py-16">
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
                      {...(d.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
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

      <section className="mx-auto max-w-7xl px-3 pb-10 sm:px-4 md:px-6 md:pb-16">
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-line">
          <div className="flex flex-wrap items-end justify-between gap-3 px-5 py-4 md:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                Location
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-ink md:text-2xl">
                {site.location.address}
              </p>
            </div>
            <a
              href={mapsHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-terracotta px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-terracotta-dark"
            >
              Open in Google Maps
            </a>
          </div>
          <iframe
            title={`${site.brand.name} location`}
            src={mapsEmbedSrc()}
            className="h-[min(55vw,360px)] min-h-[280px] w-full border-0 md:h-[380px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}
