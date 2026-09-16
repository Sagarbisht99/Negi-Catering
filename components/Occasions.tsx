"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import MediaImage from "@/components/MediaImage";
import { occasions, type Occasion } from "@/data/occasions";
import { usePublishedServices } from "@/lib/publicQueries";
import Image from "next/image";

const occasionImages: Record<Occasion, string> = {
  "House Party": "/images/party.jpg",
  Birthday: "/images/cake.jpg",
  Premium: "/images/restaurant.jpg",
  Office: "/images/office.jpg",
  Anniversary: "/images/dining.jpg",
  Pooja: "/images/diya.jpg",
  Wedding: "/images/wedding.jpg",
  Festival: "/images/festive.jpg",
};

export default function Occasions() {
  const { openEnquiry, submitted } = useEnquiry();
  const services = usePublishedServices();
  const serviceTiles = services.data ?? [];

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-3 py-10 sm:px-4 md:space-y-12 md:px-6 md:py-16">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
          Plan By Occasion
        </h2>
        <div className="scrollbar-thin mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {occasions.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => openEnquiry(label)}
              className="group flex w-[120px] shrink-0 flex-col items-center gap-2"
            >
              <span className="relative h-[110px] w-[110px] overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-terracotta/40 transition group-hover:ring-2 group-hover:ring-terracotta">
                <Image
                  src={occasionImages[label]}
                  alt={label}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="110px"
                />
              </span>
              <span className="text-center text-xs font-semibold text-ink">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div id="services">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
          Choose Your Services
        </h2>
        {services.isPending ? (
          <div className="scrollbar-thin mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:px-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex w-[120px] shrink-0 flex-col items-center gap-2">
                <div className="h-[110px] w-[110px] animate-pulse rounded-2xl bg-card ring-1 ring-line" />
                <div className="h-3 w-16 animate-pulse rounded bg-line" />
              </div>
            ))}
          </div>
        ) : serviceTiles.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-card px-4 py-8 text-center text-sm text-muted ring-1 ring-line">
            Services will appear here once they are published in admin.
          </p>
        ) : (
          <div className="scrollbar-thin mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:px-0">
            {serviceTiles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => openEnquiry()}
                className="group flex w-[120px] shrink-0 flex-col items-center gap-2"
                title={s.description}
              >
                <span className="relative h-[110px] w-[110px] overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-terracotta/40 transition group-hover:ring-2 group-hover:ring-terracotta">
                  <MediaImage
                    src={s.image}
                    alt={s.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="110px"
                  />
                </span>
                <span className="text-center text-xs font-semibold text-ink">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-line sm:flex-row sm:items-center md:p-5">
        <div className="relative hidden h-16 w-24 overflow-hidden rounded-xl sm:block">
          <Image
            src="/images/feast.jpg"
            alt="Catering preview"
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-leaf">
            Next available · Today 7:00 PM
          </p>
          <p className="mt-1 text-sm text-muted">
            Tell us your guest count and occasion — we&apos;ll craft the menu.
          </p>
        </div>
        {submitted ? null : (
          <button
            type="button"
            onClick={() => openEnquiry()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-terracotta px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-terracotta-dark sm:w-auto"
          >
            Get a Quote
          </button>
        )}
      </div>
    </section>
  );
}
