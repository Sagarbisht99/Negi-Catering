"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import EnquiryHangTag from "@/components/EnquiryHangTag";
import { occasions, type Occasion } from "@/data/occasions";
import { emailHref, mapsHref, phoneHref, site } from "@/data/site";
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
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const sync = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

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
    <header
      ref={headerRef}
      className="relative sticky top-0 z-50 overflow-visible border-b border-line/60 bg-ivory/70 backdrop-blur-md"
    >
      {/* Top contact strip */}
      <div className="bg-ink text-ivory">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-5 px-4 py-2.5 text-xs sm:justify-between sm:gap-x-6 sm:px-6 sm:text-[13px] md:py-3 md:text-sm">
          <a
            href={mapsHref()}
            target="_blank"
            rel="noopener noreferrer"
            title={site.location.address}
            className="hidden items-center gap-1.5 text-ivory/75 transition-colors hover:text-terracotta-soft md:inline-flex"
          >
            <StripIcon>
              <path
                d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.2" fill="currentColor" />
            </StripIcon>
            <span className="truncate">{site.location.shortAddress}</span>
          </a>

          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <a
              href={phoneHref(site.contact.phone)}
              className="inline-flex items-center gap-1.5 font-medium text-ivory transition-colors hover:text-terracotta-soft"
            >
              <StripIcon>
                <path
                  d="M6.6 10.8a13 13 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .7-.2 1l-2.3 2.2Z"
                  fill="currentColor"
                />
              </StripIcon>
              {site.contact.phoneDisplay}
            </a>
            <a
              href={phoneHref(site.contact.phoneAlt)}
              className="hidden items-center gap-1.5 text-ivory/75 transition-colors hover:text-terracotta-soft sm:inline-flex"
            >
              <StripIcon>
                <path
                  d="M6.6 10.8a13 13 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .7-.2 1l-2.3 2.2Z"
                  fill="currentColor"
                />
              </StripIcon>
              {site.contact.phoneAltDisplay}
            </a>
            <a
              href={emailHref()}
              className="hidden items-center gap-1.5 text-ivory/75 transition-colors hover:text-terracotta-soft lg:inline-flex"
            >
              <StripIcon>
                <path
                  d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m3.5 7.5 8.5 6 8.5-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </StripIcon>
              {site.contact.email}
            </a>
            <span className="hidden items-center gap-1.5 text-ivory/55 xl:inline-flex">
              <StripIcon>
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M12 7.5V12l3 1.8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </StripIcon>
              {site.contact.hours}
            </span>
          </div>
        </div>
      </div>

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
              Negi
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink sm:text-[10px] sm:tracking-[0.14em]">
              Caterers &amp; Tiffin
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

function StripIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-terracotta-soft"
    >
      {children}
    </svg>
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
