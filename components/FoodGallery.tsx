"use client";

import { foodCategories, foodItems, type FoodCategory, type FoodItem } from "@/data/food";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Props = {
  preview?: boolean;
  showTitle?: boolean;
};

export default function FoodGallery({ preview = false, showTitle = true }: Props) {
  const [active, setActive] = useState<FoodCategory>("All");
  const [selected, setSelected] = useState<FoodItem | null>(null);

  const items = useMemo(() => {
    const filtered =
      active === "All"
        ? foodItems
        : foodItems.filter((item) => item.category === active);
    return preview ? filtered.slice(0, 8) : filtered;
  }, [active, preview]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  const openAt = (item: FoodItem) => setSelected(item);

  const shift = (dir: -1 | 1) => {
    if (!selected) return;
    const list =
      active === "All"
        ? foodItems
        : foodItems.filter((item) => item.category === active);
    const idx = list.findIndex((i) => i.id === selected.id);
    if (idx < 0) return;
    const next = list[(idx + dir + list.length) % list.length];
    setSelected(next);
  };

  return (
    <section
      id="gallery"
      className="border-y border-line bg-ivory-deep/40 py-10 md:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {showTitle ? (
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
              Our Food
            </h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              Explore dishes by category — click any photo to enlarge.
            </p>
          </div>
        ) : null}

        <div className="scrollbar-thin mb-8 flex gap-2 overflow-x-auto pb-2">
          {foodCategories.map((category) => {
            const isActive = active === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={[
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-terracotta text-white shadow-sm shadow-terracotta/25"
                    : "bg-card text-ink ring-1 ring-line hover:bg-terracotta/10 hover:text-terracotta",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openAt(item)}
              className="group overflow-hidden rounded-2xl bg-card text-left shadow-sm ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
              </div>
              <div className="px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-terracotta">
                  {item.category}
                </p>
                <p className="mt-0.5 text-sm font-bold text-ink md:text-base">
                  {item.name}
                </p>
              </div>
            </button>
          ))}
        </div>

        {preview ? (
          <div className="mt-8 flex justify-center">
            <Link
              href="/gallery"
              className="rounded-full bg-terracotta px-6 py-3 text-sm font-bold text-white transition hover:bg-terracotta-dark"
            >
              View Full Gallery
            </Link>
          </div>
        ) : null}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-card text-xl font-bold text-ink"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card text-xl text-ink md:left-6"
            onClick={(e) => {
              e.stopPropagation();
              shift(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card text-xl text-ink md:right-6"
            onClick={(e) => {
              e.stopPropagation();
              shift(1);
            }}
          >
            ›
          </button>

          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full md:aspect-[16/10]">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 900px"
                priority
              />
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                {selected.category}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">
                {selected.name}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
