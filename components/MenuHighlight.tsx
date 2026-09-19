"use client";

import { menuDishes } from "@/data/menuDishes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Dish = (typeof menuDishes)[number];

export default function MenuHighlight() {
  const [active, setActive] = useState<Dish | null>(null);

  useEffect(() => {
    if (!active) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section
      id="menu"
      className="border-y border-line bg-ivory-deep/40 py-10 md:py-16"
      aria-labelledby="menu-heading"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
            From our kitchen
          </p>
          <h2
            id="menu-heading"
            className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl"
          >
            A taste of the menu
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Everyday Indian favourites for house parties, offices, and small
            gatherings — tailored to your guest count.
          </p>
        </div>

        <div className="scrollbar-thin mt-8 -mx-3 flex gap-4 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4 md:mx-0 md:mt-10 md:px-0">
          {menuDishes.map((dish) => (
            <button
              key={dish.name}
              type="button"
              onClick={() => setActive(dish)}
              className="group w-[140px] shrink-0 text-left sm:w-[160px]"
              aria-label={`View ${dish.name}`}
            >
              <span className="relative block aspect-square overflow-hidden rounded-2xl bg-card ring-1 ring-line transition group-hover:ring-terracotta/50">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="160px"
                />
              </span>
              <span className="mt-2.5 block text-center text-xs font-semibold text-ink sm:text-sm">
                {dish.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-terracotta px-6 py-2.5 text-sm font-bold text-white transition hover:bg-terracotta-dark"
          >
            Ask for a full menu
          </Link>
        </div>
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/75 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-card text-xl font-bold text-ink shadow-sm ring-1 ring-line"
            >
              ×
            </button>
            <div className="relative aspect-[4/3] w-full bg-ivory-deep">
              <Image
                src={active.image}
                alt={active.name}
                fill
                className="object-contain"
                sizes="(max-width:768px) 100vw, 672px"
                priority
              />
            </div>
            <p className="border-t border-line px-5 py-4 text-center font-display text-lg font-semibold text-ink">
              {active.name}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
