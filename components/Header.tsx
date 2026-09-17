"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import EnquiryHangTag from "@/components/EnquiryHangTag";
import { occasions, type Occasion } from "@/data/occasions";
import { mapsHref, site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const nav = [
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { openEnquiry, submitted } = useEnquiry();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOccasionsOpen, setMobileOccasionsOpen] = useState(false);
  const [hash, setHash] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileOccasionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      setMobileOccasionsOpen(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      if (pathname !== "/") return false;
      return hash === href.replace("/", "");
    }
    return pathname === href;
  };

  const servicesActive = pathname === "/services" || pathname.startsWith("/services/");

  const linkClass = (active: boolean) =>
    [
      "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition",
      active
        ? "bg-terracotta text-white shadow-sm shadow-terracotta/25"
        : "text-terracotta hover:bg-terracotta/10 hover:text-terracotta-dark",
    ].join(" ");

  const mobileLinkClass = (active: boolean) =>
    [
      "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition",
      active
        ? "bg-terracotta text-white"
        : "text-terracotta hover:bg-terracotta/10",
    ].join(" ");

  const pickOccasion = (occasion: Occasion) => {
    setServicesOpen(false);
    setOpen(false);
    openEnquiry(occasion);
  };

  return (
    <header className="relative sticky top-0 z-50 overflow-visible border-b border-line/60 bg-ivory/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 md:gap-5 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-1">
          <Image
            src={site.brand.logo}
            alt={site.brand.fullName}
            width={72}
            height={66}
            className="h-12 w-auto object-contain md:h-14"
            priority
          />
          <span className="-ml-0.5 flex min-w-0 flex-col leading-none">
            <span className="font-display text-base font-semibold tracking-tight text-ink sm:text-xl md:text-2xl">
              {site.brand.shortName}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-terracotta sm:text-[10px] sm:tracking-[0.14em]">
              {site.brand.tagline}
            </span>
          </span>
        </Link>

        <a
          href={mapsHref()}
          target="_blank"
          rel="noopener noreferrer"
          title={site.location.address}
          aria-label={`Open ${site.location.label} location on Google Maps`}
          className="hidden items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 ring-1 ring-line transition hover:ring-terracotta/40 md:flex"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
            <LocationDot />
          </span>
          <p className="text-[13px] leading-none">
            <span className="text-muted">Available in </span>
            <span className="font-semibold text-terracotta">{site.location.label}</span>
          </p>
        </a>

        <nav className="ml-auto hidden items-center gap-1.5 lg:flex">
          <Link
            href="/services"
            className={linkClass(servicesActive)}
            aria-current={servicesActive ? "page" : undefined}
          >
            Services
          </Link>

          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={linkClass(false)}
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
            >
              Occasions
              <Chevron />
            </button>
            {servicesOpen ? (
              <div className="absolute top-full left-0 z-50 pt-2">
                <div
                  role="menu"
                  className="w-52 overflow-hidden rounded-2xl bg-card py-2 shadow-lg ring-1 ring-line"
                >
                  {occasions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      role="menuitem"
                      className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-terracotta/10 hover:text-terracotta"
                      onClick={() => pickOccasion(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={linkClass(isActive(item.href))}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={() => {
                if (item.href.includes("#")) {
                  setHash(item.href.replace("/", ""));
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative ml-auto flex items-center gap-1.5 sm:gap-2 lg:ml-0">
          {!submitted ? (
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="font-headline inline-flex min-h-11 items-center rounded-full bg-terracotta px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.06em] text-white shadow-sm shadow-terracotta/25 transition hover:bg-terracotta-dark sm:px-4 sm:text-[11px] md:text-xs"
              >
                Get a Quote
              </button>
              <span className="hidden md:contents">
                <EnquiryHangTag onClick={() => openEnquiry()} />
              </span>
            </div>
          ) : null}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 top-[var(--header-h,4.5rem)] z-40 bg-ink/35 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-50 border-b border-line bg-card shadow-lg lg:hidden">
            <nav className="scrollbar-thin flex max-h-[min(60dvh,420px)] flex-col gap-0.5 overflow-y-auto px-3 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <a
                href={mapsHref()}
                target="_blank"
                rel="noopener noreferrer"
                title={site.location.address}
                className="rounded-lg px-3 py-1.5 text-xs text-muted"
              >
                Available in{" "}
                <span className="font-semibold text-terracotta">{site.location.label}</span>
              </a>

              <Link
                href="/services"
                className={mobileLinkClass(servicesActive)}
                aria-current={servicesActive ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                Services
              </Link>

              <div>
                <button
                  type="button"
                  className={`${mobileLinkClass(false)} w-full justify-between`}
                  aria-expanded={mobileOccasionsOpen}
                  onClick={() => setMobileOccasionsOpen((v) => !v)}
                >
                  Occasions
                  <span
                    className={`transition-transform ${mobileOccasionsOpen ? "rotate-180" : ""}`}
                  >
                    <Chevron />
                  </span>
                </button>
                {mobileOccasionsOpen ? (
                  <div className="mb-1 ml-2 space-y-0.5 border-l border-line pl-2">
                    {occasions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="block w-full rounded-lg px-3 py-1.5 text-left text-sm font-semibold text-ink hover:bg-terracotta/10 hover:text-terracotta"
                        onClick={() => pickOccasion(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={mobileLinkClass(isActive(item.href))}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => {
                    if (item.href.includes("#")) {
                      setHash(item.href.replace("/", ""));
                    }
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}

function LocationDot() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
