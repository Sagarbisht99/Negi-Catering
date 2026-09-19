"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import { site } from "@/data/site";
import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/banner-why.png",
    alt: `${site.brand.name} — why families choose us for catering and tiffin`,
  },
  {
    src: "/images/banner-event.png",
    alt: `Plan your event with ${site.brand.name}`,
  },
  {
    src: "/images/banner-corporate.png",
    alt: `Corporate catering by ${site.brand.name}`,
  },
  {
    src: "/images/banner-india.png",
    alt: `Trusted catering across ${site.location.label}`,
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const { openEnquiry, submitted } = useEnquiry();

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="px-3 pt-3 sm:px-4 md:px-6 md:pt-5" aria-label="Featured highlights">
      <h1 className="sr-only">
        {site.brand.fullName} — catering and tiffin services in {site.location.label} since{" "}
        {site.brand.since}
      </h1>
      <div className="relative mx-auto aspect-[1024/504] w-full max-w-7xl overflow-hidden rounded-[16px] bg-card shadow-sm ring-1 ring-line sm:rounded-[20px] md:rounded-[32px]">
        {slides.map((slide, i) => {
          const active = i === index;
          const nearby = Math.abs(i - index) <= 1 || (index === 0 && i === slides.length - 1);
          if (!active && !nearby && i !== 0) return null;

          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={!active}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                quality={85}
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, min(1280px, 100vw)"
              />
            </div>
          );
        })}

        {submitted ? null : (
          <button
            type="button"
            onClick={() => openEnquiry()}
            className="absolute bottom-3 left-3 z-[2] rounded-full bg-terracotta px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm shadow-black/20 sm:bottom-4 sm:left-4 md:hidden"
          >
            Get a Quote
          </button>
        )}

        <div className="absolute top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 md:top-auto md:bottom-4 md:gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className="flex h-10 w-10 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-card shadow-sm"
                    : "w-2 bg-card/60 hover:bg-card/85"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() =>
            setIndex((i) => (i - 1 + slides.length) % slides.length)
          }
          className="absolute top-1/2 left-1.5 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/95 text-ink shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:scale-105 hover:bg-terracotta hover:text-white sm:left-3 sm:h-11 sm:w-11 md:left-4 md:h-12 md:w-12"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="absolute top-1/2 right-1.5 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/95 text-ink shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:scale-105 hover:bg-terracotta hover:text-white sm:right-3 sm:h-11 sm:w-11 md:right-4 md:h-12 md:w-12"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="sm:h-[22px] sm:w-[22px]"
    >
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="sm:h-[22px] sm:w-[22px]"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
