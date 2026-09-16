"use client";

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
    alt: "Reliable catering across India with hygienic, delicious menus",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="px-4 pt-4 md:px-6 md:pt-5">
      <div className="relative mx-auto aspect-[1079/531] max-w-7xl overflow-hidden rounded-[24px] bg-card shadow-sm ring-1 ring-line md:rounded-[32px]">
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
              className="object-cover object-center"
              sizes="(max-width:1280px) 100vw, 1280px"
            />
          </div>
        ))}

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:bottom-4">
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
          className="absolute top-1/2 left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-lg text-ink shadow-sm backdrop-blur transition hover:bg-card md:left-3 md:h-10 md:w-10"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="absolute top-1/2 right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-lg text-ink shadow-sm backdrop-blur transition hover:bg-card md:right-3 md:h-10 md:w-10"
        >
          ›
        </button>
      </div>
    </section>
  );
}
