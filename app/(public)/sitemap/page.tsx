import type { Metadata } from "next";
import { listPublishedFoods } from "@/app/actions/food";
import { listPublishedServices } from "@/app/actions/services";
import { occasions } from "@/data/occasions";
import { site } from "@/data/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Sitemap | ${site.brand.fullName}`,
  description: `Browse all pages, services, and dishes on the ${site.brand.name} website.`,
};

const PAGE_SIZE = 12;

const staticPages = [
  { label: "Home", href: "/", blurb: "Hero, food preview, and highlights" },
  { label: "About Us", href: "/about", blurb: "Our story and journey" },
  { label: "Gallery", href: "/gallery", blurb: "Food photos by category" },
  { label: "Services", href: "/services", blurb: "Catering offerings" },
  { label: "Contact Us", href: "/contact", blurb: "Enquiry form and location" },
  { label: "FAQ", href: "/#faq", blurb: "Common questions" },
  { label: "Terms & Conditions", href: "/terms", blurb: "Service terms" },
  { label: "Privacy Policy", href: "/privacy", blurb: "How we handle data" },
  { label: "Sitemap", href: "/sitemap", blurb: "This page" },
];

type DynamicItem = {
  id: string;
  label: string;
  href: string;
  kind: "Food" | "Service" | "Occasion";
  meta?: string;
};

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export default async function SitemapPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const [foods, services] = await Promise.all([
    listPublishedFoods(),
    listPublishedServices(),
  ]);

  const dynamicItems: DynamicItem[] = [
    ...services.map((s) => ({
      id: `service-${s.id}`,
      label: s.name,
      href: "/services",
      kind: "Service" as const,
      meta: s.description,
    })),
    ...foods.map((f) => ({
      id: `food-${f.id}`,
      label: f.name,
      href: "/gallery",
      kind: "Food" as const,
      meta: f.category,
    })),
    ...occasions.map((o) => ({
      id: `occasion-${o}`,
      label: o,
      href: "/contact",
      kind: "Occasion" as const,
      meta: "Plan by occasion",
    })),
  ];

  const total = dynamicItems.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(params.page), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = dynamicItems.slice(start, start + PAGE_SIZE);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, total);

  return (
    <div className="pb-8">
      <section className="border-b border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-5xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
            Site map
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
            Sitemap
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Find every page on {site.brand.name} — plus published services, dishes,
            and occasions updated from the admin.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-10 px-3 py-8 sm:px-4 md:px-6 md:py-14">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            Pages
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {staticPages.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-2xl bg-card p-4 shadow-sm ring-1 ring-line transition hover:ring-terracotta/40"
                >
                  <p className="text-sm font-bold text-terracotta">{item.label}</p>
                  <p className="mt-1 text-xs text-muted">{item.blurb}</p>
                  <p className="mt-2 truncate text-[11px] text-ink/50">{item.href}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                Services, food & occasions
              </h2>
              <p className="mt-1 text-sm text-muted">
                {total === 0
                  ? "Nothing published yet — add items in admin."
                  : `Showing ${from}–${to} of ${total}`}
              </p>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-card px-4 py-10 text-center text-sm text-muted ring-1 ring-line">
              Dynamic listings will appear here once services and food are published.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
              {pageItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-start justify-between gap-3 px-4 py-3.5 transition hover:bg-ivory-deep/40 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {item.label}
                      </p>
                      {item.meta ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                          {item.meta}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        item.kind === "Food"
                          ? "bg-leaf/15 text-leaf"
                          : item.kind === "Service"
                            ? "bg-terracotta/15 text-terracotta"
                            : "bg-ink/10 text-ink"
                      }`}
                    >
                      {item.kind}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 ? (
            <nav
              aria-label="Sitemap pagination"
              className="mt-6 flex flex-wrap items-center justify-between gap-3"
            >
              <Link
                href={page <= 2 ? "/sitemap" : `/sitemap?page=${page - 1}`}
                aria-disabled={page <= 1}
                className={`rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${
                  page <= 1
                    ? "pointer-events-none text-muted/50 ring-line"
                    : "bg-card text-ink ring-line hover:ring-terracotta/50"
                }`}
              >
                Previous
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const active = n === page;
                  return (
                    <Link
                      key={n}
                      href={n === 1 ? "/sitemap" : `/sitemap?page=${n}`}
                      aria-current={active ? "page" : undefined}
                      className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-bold transition ${
                        active
                          ? "bg-terracotta text-white"
                          : "bg-card text-ink ring-1 ring-line hover:ring-terracotta/50"
                      }`}
                    >
                      {n}
                    </Link>
                  );
                })}
              </div>

              <Link
                href={`/sitemap?page=${page + 1}`}
                aria-disabled={page >= totalPages}
                className={`rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${
                  page >= totalPages
                    ? "pointer-events-none text-muted/50 ring-line"
                    : "bg-card text-ink ring-line hover:ring-terracotta/50"
                }`}
              >
                Next
              </Link>
            </nav>
          ) : null}
        </div>
      </section>
    </div>
  );
}
