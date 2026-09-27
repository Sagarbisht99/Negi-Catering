import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { citiesLine, emailHref, mapsEmbedSrc, mapsHref, phoneDisplayLine, phoneHref, site } from "@/data/site";
import { breadcrumbJsonLd, buildPageMetadata, webPageJsonLd } from "@/lib/seo";
import Image from "next/image";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  description: `Contact ${site.brand.fullName} in New Ashok Nagar for catering quotes, tiffin orders, and event bookings across ${site.location.label}. Call ${phoneDisplayLine()} or email ${site.contact.email}.`,
  keywords: `contact Negi Caterers, catering quote Delhi NCR, tiffin booking New Ashok Nagar, Negi Caterers phone, ${site.location.addressLocality} caterers`,
  path: "/contact",
});

export default function ContactPage() {
  const details = [
    {
      label: "Phone",
      value: site.contact.phoneDisplay,
      href: phoneHref(),
      icon: PhoneIcon,
    },
    {
      label: "Alternate Phone",
      value: site.contact.phoneAltDisplay,
      href: phoneHref(site.contact.phoneAlt),
      icon: PhoneIcon,
    },
    {
      label: "Email",
      value: site.contact.email,
      href: emailHref(),
      icon: MailIcon,
    },
    {
      label: "Location",
      value: site.location.address,
      href: mapsHref(),
      icon: PinIcon,
    },
    {
      label: "Service Area",
      value: citiesLine(),
      icon: GlobeIcon,
    },
    {
      label: "Hours",
      value: site.contact.hours,
      icon: ClockIcon,
    },
  ];

  return (
    <div>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/contact",
            name: `Contact Us | ${site.brand.fullName}`,
            description: `Contact ${site.brand.fullName} in New Ashok Nagar for catering quotes and tiffin bookings across ${site.location.label}.`,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact Us", path: "/contact" },
          ]),
        ]}
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/feast.jpg"
            alt="Catering spread from Negi Caterers and Tiffin"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative mx-auto max-w-7xl px-3 py-12 sm:px-4 md:px-6 md:py-24">
          <Breadcrumb variant="dark" items={[{ name: "Contact Us" }]} />
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
                <li key={d.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta">
                    <d.icon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                      {d.label}
                    </p>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="mt-1 block text-sm font-semibold break-words text-ink hover:text-terracotta"
                        {...(d.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-ink">{d.value}</p>
                    )}
                  </div>
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

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 3.5h2.2l1.4 3.6-1.8 1.4a12 12 0 0 0 5.1 5.1l1.4-1.8 3.6 1.4v2.2a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4.5 8 12 13l7.5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.5 12h17M12 3.5c2.3 2.3 3.5 5.2 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.2-3.5-8.5S9.7 5.8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
