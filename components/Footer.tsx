import { citiesLine, contactPhones, emailHref, phoneHref, site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const explore = [
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
  ];

  const company = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Get a Quote", href: "/contact" },
  ];

  const legal = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Sitemap", href: "/sitemap" },
  ];

  return (
    <footer className="mt-auto bg-ink text-ivory">
      {/* Top Main Footer Section */}
      <div className="relative overflow-hidden border-t border-terracotta/25 bg-ink">
        {/* Subtle Background Glow Accent */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, color-mix(in srgb, var(--terracotta) 24%, transparent) 1.5px, transparent 1.5px), radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--leaf) 24%, transparent) 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="flex flex-col justify-start lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src={site.brand.logo}
                  alt={site.brand.fullName}
                  width={64}
                  height={58}
                  className="h-12 w-auto shrink-0 object-contain sm:h-14"
                />
                <span className="font-display text-xl font-semibold text-ivory sm:text-2xl">
                  {site.brand.name}
                </span>
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/70">
                {site.brand.description}
              </p>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-ivory/10 text-ivory/75 transition-colors hover:text-terracotta-soft"
              >
                <InstagramIcon />
              </a>
            </div>

            {/* Links & Contact Section */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-8 lg:grid-cols-[0.9fr_0.9fr_0.9fr_1.7fr]">
              {/* Explore Links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-terracotta-soft">
                  Explore
                </h3>
                <ul className="mt-3 space-y-2.5 text-sm text-ivory/70">
                  {explore.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="transition-colors hover:text-terracotta-soft"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-terracotta-soft">
                  Company
                </h3>
                <ul className="mt-3 space-y-2.5 text-sm text-ivory/70">
                  {company.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="transition-colors hover:text-terracotta-soft"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-terracotta-soft">
                  Legal
                </h3>
                <ul className="mt-3 space-y-2.5 text-sm text-ivory/70">
                  {legal.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="transition-colors hover:text-terracotta-soft"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reach Us / Contact Info */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-terracotta-soft">
                  Reach Us
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-ivory/70">
                  {contactPhones().map((p) => (
                    <li key={p.phone} className="flex items-start gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ivory/10 text-terracotta-soft">
                        <PhoneIcon />
                      </span>
                      <a
                        href={phoneHref(p.phone)}
                        className="min-w-0 leading-6 font-medium break-words text-ivory transition-colors hover:text-terracotta-soft"
                      >
                        {p.display}
                      </a>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ivory/10 text-terracotta-soft">
                      <MailIcon />
                    </span>
                    <a
                      href={emailHref()}
                      className="min-w-0 leading-6 break-all transition-colors hover:text-terracotta-soft"
                    >
                      {site.contact.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ivory/10 text-terracotta-soft">
                      <PinIcon />
                    </span>
                    <span className="min-w-0 leading-6 break-words">
                      {site.location.address}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ivory/10 text-terracotta-soft">
                      <ClockIcon />
                    </span>
                    <span className="min-w-0 text-xs leading-6 break-words">
                      {site.contact.hours}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-ivory/10 bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-center text-xs text-ivory/70 md:flex-row md:items-center md:justify-between md:px-6 md:text-left">
          <p>
            Copyright © {new Date().getFullYear()} {site.brand.name}. All rights reserved.
          </p>
          <p className="text-ivory/55">
            {site.brand.fullName} · {citiesLine()}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:justify-end">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-ivory"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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