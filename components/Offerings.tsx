"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import MediaImage from "@/components/MediaImage";
import { usePublishedServices } from "@/lib/publicQueries";

export default function Offerings() {
  const services = usePublishedServices();
  const { openEnquiry } = useEnquiry();
  const items = services.data ?? [];

  return (
    <section id="offerings" className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
        Catering Offerings
      </h2>
      {services.isPending ? (
        <div className="scrollbar-thin mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex w-[120px] shrink-0 flex-col items-center gap-2">
              <div className="h-[110px] w-[110px] animate-pulse rounded-2xl bg-card ring-1 ring-line" />
              <div className="h-3 w-16 animate-pulse rounded bg-line" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-card px-4 py-8 text-center text-sm text-muted ring-1 ring-line">
          Services will appear here once they are published in admin.
        </p>
      ) : (
        <div className="scrollbar-thin mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {items.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => openEnquiry()}
              className="group flex w-[120px] shrink-0 flex-col items-center gap-2"
              title={service.description}
            >
              <span className="relative h-[110px] w-[110px] overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-terracotta/40 transition group-hover:ring-2 group-hover:ring-terracotta">
                <MediaImage
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="110px"
                />
              </span>
              <span className="text-center text-xs font-semibold text-ink">
                {service.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
