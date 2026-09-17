"use client";

import type { FoodRecord } from "@/app/actions/food";
import MediaImage from "@/components/MediaImage";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/components/admin/usePagination";
import { foodCategories, type FoodCategory } from "@/data/food";
import { usePublishedFoods } from "@/lib/publicQueries";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const GALLERY_PAGE_SIZE = 12;

type Props = {
  preview?: boolean;
  showTitle?: boolean;
};

export default function FoodGallery({ preview = false, showTitle = true }: Props) {
  const foods = usePublishedFoods();
  const source = foods.data ?? [];
  const [active, setActive] = useState<FoodCategory>("All");
  const [selected, setSelected] = useState<FoodRecord | null>(null);

  const categories = useMemo(() => {
    const present = new Set(source.map((item) => item.category));
    return foodCategories.filter(
      (category): category is FoodCategory =>
        category === "All" || present.has(category),
    );
  }, [source]);

  useEffect(() => {
    if (active !== "All" && !categories.includes(active)) setActive("All");
  }, [active, categories]);

  const filtered = useMemo(() => {
    return active === "All" ? source : source.filter((item) => item.category === active);
  }, [active, source]);

  const pagination = usePagination(filtered, GALLERY_PAGE_SIZE);
  const items = preview ? filtered.slice(0, 8) : pagination.pageItems;

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

  const openAt = (item: FoodRecord) => setSelected(item);

  const shift = (dir: -1 | 1) => {
    if (!selected) return;
    const idx = filtered.findIndex((item) => item.id === selected.id);
    if (idx < 0) return;
    setSelected(filtered[(idx + dir + filtered.length) % filtered.length]);
  };

  const goToPage = (page: number) => {
    pagination.setPage(page);
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="gallery"
      className="border-y border-line bg-ivory-deep/40 py-8 md:py-14"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        {showTitle ? (
          <div className="mb-6 text-center md:mb-8">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
              Our Food
            </h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              Explore dishes by category — click any photo to enlarge.
            </p>
          </div>
        ) : null}

        {categories.length > 1 ? (
          <div className="scrollbar-thin mb-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const isActive = active === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActive(category);
                    pagination.setPage(1);
                  }}
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
        ) : null}

        {foods.isPending ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {Array.from({ length: preview ? 8 : 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl bg-card ring-1 ring-line"
              >
                <div className="aspect-[4/3] bg-ivory-deep" />
                <div className="space-y-2 px-3 py-3">
                  <div className="h-2 w-16 rounded bg-ivory-deep" />
                  <div className="h-4 w-28 rounded bg-ivory-deep" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-2xl bg-card px-4 py-10 text-center text-sm text-muted ring-1 ring-line">
            Dishes will appear here once they are published in admin.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openAt(item)}
                  className="group overflow-hidden rounded-2xl bg-card text-left shadow-sm ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <MediaImage
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
            {preview ? null : (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                from={pagination.from}
                to={pagination.to}
                hasPrev={pagination.hasPrev}
                hasNext={pagination.hasNext}
                onPageChange={goToPage}
              />
            )}
          </>
        )}

        {preview && source.length > 8 ? (
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-card text-xl font-bold text-ink sm:top-4 sm:right-4"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card text-xl text-ink sm:left-3 md:left-6"
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
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card text-xl text-ink sm:right-3 md:right-6"
            onClick={(e) => {
              e.stopPropagation();
              shift(1);
            }}
          >
            ›
          </button>

          <div
            className="relative max-h-[85dvh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] max-h-[55dvh] w-full md:aspect-[16/10] md:max-h-none">
              <MediaImage
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 900px"
                priority
              />
            </div>
            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                {selected.category}
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
                {selected.name}
              </p>
              {selected.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {selected.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
