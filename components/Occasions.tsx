"use client";

import type { ServiceRecord } from "@/app/actions/services";
import { useEnquiry } from "@/components/EnquiryProvider";
import MediaImage from "@/components/MediaImage";
import Image from "next/image";
import Link from "next/link";

const HOME_SERVICE_LIMIT = 10;

export default function Occasions({
  initialServices = [],
}: {
  initialServices?: ServiceRecord[];
}) {
  const { openEnquiry, submitted } = useEnquiry();
  const serviceTiles = initialServices.slice(0, HOME_SERVICE_LIMIT);

  return (
    <section
      id="services"
      className="mx-auto max-w-7xl space-y-10 px-3 py-10 sm:px-4 md:space-y-12 md:px-6 md:py-16"
      aria-labelledby="home-services-heading"
    >
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
              Our services
            </p>
            <h2
              id="home-services-heading"
              className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl"
            >
              Plan by occasion
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-bold text-terracotta transition hover:text-terracotta-dark"
          >
            View all services
          </Link>
        </div>

        {serviceTiles.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-card px-4 py-8 text-center text-sm text-muted ring-1 ring-line">
            Services will appear here once they are published in admin.
          </p>
        ) : (
          <div className="scrollbar-thin mt-6 -mx-3 flex gap-4 overflow-x-auto px-3 pb-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
            {serviceTiles.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
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
                    quality={70}
                  />
                </span>
                <span className="text-center text-xs font-semibold text-ink">
                  {s.name}
                </span>
              </Link>
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
            quality={70}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-leaf">
            Ready when you are
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
