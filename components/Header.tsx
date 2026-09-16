"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import EnquiryHangTag from "@/components/EnquiryHangTag";
import { occasions, type Occasion } from "@/data/occasions";
import { site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const nav = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hash, setHash] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) => {
    if (href === "/about") return pathname === "/about";
    if (href === "/gallery") return pathname === "/gallery";
    if (href === "/contact") return pathname === "/contact";
    if (pathname !== "/") return false;
    return hash === href.replace("/", "");
  };

  const servicesActive = pathname === "/" && (hash === "#services" || hash === "");

  const linkClass = (active: boolean) =>
    [
      "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition",
      active
        ? "bg-terracotta text-white shadow-sm shadow-terracotta/25"
        : "text-terracotta hover:bg-terracotta/10 hover:text-terracotta-dark",
    ].join(" ");

  const pickOccasion = (occasion: Occasion) => {
    setServicesOpen(false);
    setOpen(false);
    openEnquiry(occasion);
  };

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-line/60 bg-ivory/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 md:gap-5 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src={site.brand.logo}
            alt={site.brand.fullName}
            width={72}
            height={66}
            className="h-12 w-auto object-contain md:h-14"
            priority
          />
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
              {site.brand.shortName}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-terracotta">
              {site.brand.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 ring-1 ring-line md:flex">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
            <LocationDot />
          </span>
          <p className="text-[13px] leading-none">
            <span className="text-muted">Available in </span>
            <span className="font-semibold text-terracotta">{site.location.label}</span>
          </p>
        </div>

        <nav className="ml-auto hidden items-center gap-1.5 lg:flex">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className={linkClass(servicesActive || servicesOpen)}
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
            >
              Our Services
              <Chevron />
            </button>
            {servicesOpen ? (
              <div className="absolute top-full left-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl bg-card py-2 shadow-lg ring-1 ring-line">
                {occasions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-terracotta/10 hover:text-terracotta"
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

        <div className="relative ml-auto flex items-center gap-2 lg:ml-0">
          <div className="relative hidden items-center sm:flex">
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="font-headline inline-flex items-center rounded-full bg-terracotta px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.06em] text-white shadow-sm shadow-terracotta/25 transition hover:bg-terracotta-dark md:text-xs"
            >
              Get a Quote
            </button>
            <EnquiryHangTag onClick={() => openEnquiry()} />
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-ink lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-card px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1.5">
            <p className="px-3.5 pt-1 text-[11px] font-bold uppercase tracking-wide text-muted">
              Our Services
            </p>
            {occasions.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full px-3.5 py-2 text-left text-sm font-semibold text-terracotta hover:bg-terracotta/10"
                onClick={() => pickOccasion(item)}
              >
                {item}
              </button>
            ))}
            <div className="my-1 border-t border-line" />
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
                  setOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
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
