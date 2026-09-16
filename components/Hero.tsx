"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import { site } from "@/data/site";
import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/banner-13.webp",
    alt: "Why choose Negi Caterers — trusted catering and event support",
  },
  {
    src: "/images/banner-16.webp",
    alt: "Corporate catering for offices, meetings, and events",
  },
  {
    src: "/images/banner-7.webp",
    alt: "Plan and book catering for your event online",
  },
  {
    src: "/images/banner-11.webp",
    alt: "Reliable catering across Delhi NCR with hygienic, delicious menus",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const { openEnquiry, submitted } = useEnquiry();

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="px-3 pt-3 sm:px-4 md:px-6 md:pt-5">
      <div className="relative mx-auto aspect-[4/3] max-w-7xl overflow-hidden rounded-[20px] bg-card shadow-sm ring-1 ring-line sm:aspect-[16/9] md:aspect-[1079/531] md:rounded-[32px]">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className="object-cover object-[center_35%] md:object-center"
              sizes="(max-width:1280px) 100vw, 1280px"
            />
          </div>
        ))}

        <div className="absolute inset-0 z-[1] bg-ink/45 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/25 md:hidden" />
        <div className="absolute inset-x-0 bottom-0 z-[2] space-y-3 p-4 sm:p-5 md:hidden">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta-soft">
            {site.brand.sinceLabel} · {site.location.label}
          </p>
          <h1 className="font-display text-[1.65rem] font-semibold leading-tight text-white">
            Home-style catering for every occasion
          </h1>
          {submitted ? null : (
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="rounded-full bg-terracotta px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm shadow-black/20"
            >
              Get a Quote
            </button>
          )}
        </div>

        <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:top-auto md:bottom-4">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-card shadow-sm"
                  : "w-2 bg-card/60 hover:bg-card/85"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() =>
            setIndex((i) => (i - 1 + slides.length) % slides.length)
          }
          className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/95 text-ink shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:scale-105 hover:bg-terracotta hover:text-white sm:left-3 sm:h-11 sm:w-11 md:left-4 md:h-12 md:w-12"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/95 text-ink shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:scale-105 hover:bg-terracotta hover:text-white sm:right-3 sm:h-11 sm:w-11 md:right-4 md:h-12 md:w-12"
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
