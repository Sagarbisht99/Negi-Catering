"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import { occasions, type Occasion } from "@/data/occasions";
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

const serviceTiles = [
  { label: "Same Day Delivery", img: "/images/trays.jpg" },
  { label: "Next Day Delivery", img: "/images/thali.jpg" },
  { label: "Bulk Food", img: "/images/feast.jpg" },
  { label: "Buffet Services", img: "/images/restaurant.jpg" },
  { label: "Live Experiences", img: "/images/chef.jpg" },
  { label: "Fresh Breads", img: "/images/naan.jpg" },
  { label: "Sweets", img: "/images/gulab.jpg" },
];

export default function Occasions() {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="mx-auto max-w-7xl space-y-12 px-4 py-12 md:px-6 md:py-16">
      <div>
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
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

      <div>
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
          Choose Your Services
        </h2>
        <div className="scrollbar-thin mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:px-0">
          {serviceTiles.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => openEnquiry()}
              className="group w-[150px] shrink-0 text-center"
            >
              <span className="relative block h-[110px] w-full overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-terracotta/40 transition group-hover:ring-2 group-hover:ring-terracotta">
                <Image
                  src={s.img}
                  alt={s.label}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="150px"
                />
              </span>
              <span className="mt-2 block text-xs font-semibold text-ink">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-line md:p-5">
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
        <button
          type="button"
          onClick={() => openEnquiry()}
          className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-terracotta-dark"
        >
          Get a Quote
        </button>
      </div>
    </section>
  );
}
