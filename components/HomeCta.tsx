"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import { site } from "@/data/site";
import Image from "next/image";

export default function HomeCta() {
  const { openEnquiry, submitted } = useEnquiry();

  return (
    <section
      id="book"
      className="relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/feast.jpg"
          alt="Catering feast ready to serve"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="relative mx-auto max-w-3xl px-3 py-16 text-center sm:px-4 md:px-6 md:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-soft">
          Ready when you are
        </p>
        <h2
          id="cta-heading"
          className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl"
        >
          Plan your next gathering with {site.brand.shortName}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
          Share the date, guest count, and occasion — we&apos;ll suggest a fresh
          menu and clear quote for {site.location.label}.
        </p>

        {submitted ? null : (
          <button
            type="button"
            onClick={() => openEnquiry()}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-terracotta px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-terracotta-dark"
          >
            Get a Quote
          </button>
        )}
      </div>
    </section>
  );
}
