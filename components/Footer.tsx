import { citiesLine, emailHref, phoneHref, site, whatsappHref } from "@/data/site";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const social = [
    { label: "Instagram", href: site.social.instagram },
    { label: "Facebook", href: site.social.facebook },
    { label: "YouTube", href: site.social.youtube },
  ];

  const explore = [
    { label: "Our Food", href: "/gallery" },
    { label: "Services", href: "/#services" },
    { label: "Our Process", href: "/#how-it-works" },
    { label: "About Us", href: "/about" },
  ];

  const company = [
    { label: "Contact Us", href: "/contact" },
    { label: "Gallery", href: "/gallery" },
    { label: "Get a Quote", href: "/contact" },
  ];

  const legal = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ];

  return (
    <footer className="mt-auto pb-10">
      <div className="relative overflow-hidden border-t border-line bg-gradient-to-b from-card to-ivory-deep/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, #c45c26 1.5px, transparent 1.5px), radial-gradient(circle at 80% 70%, #3f7a4a 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-12 md:px-6 md:pt-14">
          <div className="mb-10 overflow-hidden rounded-[24px] bg-terracotta px-6 py-7 text-white shadow-lg shadow-terracotta/20 md:flex md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                {site.brand.sinceLabel}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
                Ready to plan your menu?
              </h2>
              <p className="mt-1 text-sm text-white/90">
                Tell us the occasion and guest count — we&apos;ll take it from there.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
              <Link
                href="/contact"
                className="rounded-full bg-card px-5 py-2.5 text-sm font-bold text-terracotta transition hover:bg-ivory"
              >
                Contact Us
              </Link>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src={site.brand.logo}
                  alt={site.brand.fullName}
                  width={64}
                  height={58}
                  className="h-14 w-auto object-contain"
                />
                <span className="font-display text-2xl font-semibold text-terracotta">
                  {site.brand.name}
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                {site.brand.description}
              </p>
              <div className="mt-5 flex gap-2">
                {social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10 text-xs font-bold text-terracotta ring-1 ring-terracotta/20 transition hover:bg-terracotta hover:text-white"
                    title={s.label}
                  >
                    {s.label.charAt(0)}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                Explore
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {explore.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition hover:text-terracotta">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                Company
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {company.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition hover:text-terracotta">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                Legal
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {legal.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition hover:text-terracotta">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                Reach Us
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li>
                  <a href={phoneHref()} className="font-semibold text-ink hover:text-terracotta">
                    {site.contact.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={emailHref()} className="hover:text-terracotta">
                    {site.contact.email}
                  </a>
                </li>
                <li>{site.location.label}</li>
                <li className="text-xs">{site.contact.hours}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-center text-xs md:flex-row md:items-center md:justify-between md:px-6 md:text-left">
          <p className="text-white/80">
            Copyright © {new Date().getFullYear()} {site.brand.name}. All rights
            reserved.
          </p>
          <p className="text-white/70">
            {site.brand.fullName} · {citiesLine()}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:justify-end">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/75 transition hover:text-white"
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
