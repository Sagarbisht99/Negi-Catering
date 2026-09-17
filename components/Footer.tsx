import { citiesLine, emailHref, phoneHref, site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const explore = [
    { label: "Our Food", href: "/gallery" },
    { label: "Services", href: "/services" },
    { label: "FAQ", href: "/#faq" },
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
    { label: "Sitemap", href: "/sitemap" },
  ];

  return (
    <footer className="mt-auto pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="relative overflow-hidden border-t border-line bg-gradient-to-b from-card to-ivory-deep/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, #c45c26 1.5px, transparent 1.5px), radial-gradient(circle at 80% 70%, #3f7a4a 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-3 pt-10 sm:px-4 md:px-6 md:pt-14">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 pb-10 lg:grid-cols-12 lg:gap-10 lg:pb-12">
            <div className="col-span-2 lg:col-span-4">
              <Link href="/" className="inline-flex max-w-full items-center gap-3">
                <Image
                  src={site.brand.logo}
                  alt={site.brand.fullName}
                  width={64}
                  height={58}
                  className="h-12 w-auto shrink-0 object-contain sm:h-14"
                />
                <span className="font-display text-xl font-semibold text-terracotta sm:text-2xl">
                  {site.brand.name}
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                {site.brand.description}
              </p>
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
                  <a href={emailHref()} className="break-all hover:text-terracotta">
                    {site.contact.email}
                  </a>
                </li>
                <li className="max-w-md leading-relaxed">{site.location.address}</li>
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
