"use client";

import type { ServiceRecord } from "@/app/actions/services";
import MediaImage from "@/components/MediaImage";
import { site } from "@/data/site";
import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

function pageNumbers(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }

  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export default function ServiceListing({ services }: { services: ServiceRecord[] }) {
  const [page, setPage] = useState(1);

  const total = services.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return services.slice(start, start + PAGE_SIZE);
  }, [services, safePage]);

  const start = (safePage - 1) * PAGE_SIZE;
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, total);
  const pages = pageNumbers(safePage, totalPages);

  if (total === 0) {
    return (
      <p className="rounded-2xl bg-card px-4 py-12 text-center text-sm text-muted ring-1 ring-line">
        Services will appear here once they are published in admin.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-8 text-sm text-muted md:mb-10">
        Showing{" "}
        <span className="font-semibold text-ink">
          {from}–{to}
        </span>{" "}
        of <span className="font-semibold text-ink">{total}</span> services
      </p>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8 lg:gap-10 xl:grid-cols-3 xl:gap-10">
        {pageItems.map((service) => (
          <article
            key={service.id}
            className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-card shadow-sm ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-terracotta/30"
          >
            <Link
              href={`/services/${service.slug}`}
              className="relative block aspect-[16/11] overflow-hidden"
            >
              <MediaImage
                src={service.image}
                alt={service.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                quality={75}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent" />
            </Link>

            <div className="flex flex-1 flex-col gap-3 p-6 md:gap-4 md:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta">
                {site.brand.shortName} catering
              </p>
              <h2 className="font-display text-xl font-semibold leading-snug text-ink md:text-2xl">
                <Link
                  href={`/services/${service.slug}`}
                  className="transition hover:text-terracotta"
                >
                  {service.name}
                </Link>
              </h2>
              <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted md:text-[15px]">
                {service.description}
              </p>

              <div className="mt-2 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl text-sm font-bold text-terracotta ring-1 ring-line transition hover:bg-ivory"
                >
                  View details
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-terracotta text-sm font-bold text-white transition hover:bg-terracotta-dark"
                >
                  Enquire
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Services pagination"
          className="mt-12 flex flex-wrap items-center justify-between gap-4 md:mt-14"
        >
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full px-4 py-2.5 text-sm font-bold ring-1 ring-line transition enabled:bg-card enabled:text-ink enabled:hover:ring-terracotta/50 disabled:cursor-not-allowed disabled:text-muted/50"
          >
            Previous
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {pages.map((num, index) => {
              const prev = pages[index - 1];
              const showEllipsis = prev !== undefined && num - prev > 1;
              const active = num === safePage;
              return (
                <span key={num} className="contents">
                  {showEllipsis ? (
                    <span className="px-1 text-sm text-muted">…</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setPage(num)}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-sm font-bold transition ${
                      active
                        ? "bg-terracotta text-white"
                        : "bg-card text-ink ring-1 ring-line hover:ring-terracotta/50"
                    }`}
                  >
                    {num}
                  </button>
                </span>
              );
            })}
          </div>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-full px-4 py-2.5 text-sm font-bold ring-1 ring-line transition enabled:bg-card enabled:text-ink enabled:hover:ring-terracotta/50 disabled:cursor-not-allowed disabled:text-muted/50"
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}
