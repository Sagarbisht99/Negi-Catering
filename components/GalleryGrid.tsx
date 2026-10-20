"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryItem = {
  id: string;
  image: string;
  caption?: string;
};

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (active === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, prev, next]);

  if (!items.length) return null;

  const current = active === null ? null : items[active];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item, index) => (
          <div key={item.id} className="min-w-0">
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={item.caption || `Open gallery image ${index + 1}`}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-ivory-deep ring-1 ring-line transition hover:ring-terracotta/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              <Image
                src={item.image}
                alt={item.caption || `Negi Caterers gallery image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
            {item.caption ? (
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-ink">
                {item.caption}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[120] flex flex-col bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={close}
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <CloseIcon />
            </button>
          </div>

          <div
            className="relative mx-auto flex w-full max-w-5xl flex-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {items.length > 1 ? (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:-left-2"
              >
                <ChevronLeft />
              </button>
            ) : null}

            <div className="relative h-full max-h-[78vh] w-full">
              <Image
                src={current.image}
                alt={current.caption || "Negi Caterers gallery image"}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {items.length > 1 ? (
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:-right-2"
              >
                <ChevronRight />
              </button>
            ) : null}
          </div>

          <div className="mx-auto mt-3 max-w-3xl text-center">
            {current.caption ? (
              <p className="text-sm font-semibold text-white">
                {current.caption}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-white/60">
              {(active ?? 0) + 1} / {items.length}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
