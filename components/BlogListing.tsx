"use client";

import type { BlogRecord } from "@/app/actions/blogs";
import MediaImage from "@/components/MediaImage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 9;
const DEBOUNCE_MS = 300;

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

export default function BlogListing({ blogs }: { blogs: BlogRecord[] }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return blogs;
    return blogs.filter((blog) => {
      const haystack = [
        blog.title,
        blog.excerpt,
        blog.slug,
        blog.metaKeywords,
        blog.metaTitle,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [blogs, debouncedQuery]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, total);
  const pages = pageNumbers(safePage, totalPages);

  if (blogs.length === 0) {
    return (
      <p className="rounded-2xl bg-card px-4 py-12 text-center text-sm text-muted ring-1 ring-line">
        Blog posts will appear here once they are published in admin.
      </p>
    );
  }

  return (
    <div>
      <label className="block max-w-xl">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
          Search posts
        </span>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, topic, or keyword…"
            className="w-full rounded-xl border-0 bg-card py-3 pl-11 pr-4 text-sm text-ink shadow-sm ring-1 ring-line outline-none transition placeholder:text-muted/70 focus:ring-2 focus:ring-terracotta/40"
            aria-label="Search blog posts"
          />
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">
            <SearchIcon />
          </span>
        </div>
      </label>

      <p className="mt-5 text-sm text-muted">
        {debouncedQuery ? (
          <>
            {total === 0 ? (
              <>No posts match “{debouncedQuery}”.</>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-ink">
                  {from}–{to}
                </span>{" "}
                of <span className="font-semibold text-ink">{total}</span> for “
                {debouncedQuery}”
              </>
            )}
          </>
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold text-ink">
              {from}–{to}
            </span>{" "}
            of <span className="font-semibold text-ink">{total}</span> posts
          </>
        )}
      </p>

      {total === 0 ? (
        <p className="mt-8 rounded-2xl bg-card px-4 py-12 text-center text-sm text-muted ring-1 ring-line">
          Try a different keyword, or{" "}
          <button
            type="button"
            onClick={() => setQuery("")}
            className="font-bold text-terracotta hover:underline"
          >
            clear search
          </button>
          .
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-10">
            {pageItems.map((blog) => (
              <article
                key={blog.id}
                className="overflow-hidden rounded-[24px] bg-card shadow-sm ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md hover:ring-terracotta/35"
              >
                <Link href={`/blog/${blog.slug}`} className="block h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <MediaImage
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-xl font-semibold text-ink md:text-2xl">
                      {blog.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                      {blog.excerpt}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-bold text-terracotta">
                      Read more
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <nav
              aria-label="Blog pagination"
              className="mt-12 flex flex-wrap items-center justify-between gap-4"
            >
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full px-4 py-2 text-sm font-bold ring-1 ring-line transition enabled:bg-card enabled:text-ink enabled:hover:ring-terracotta/50 disabled:cursor-not-allowed disabled:text-muted/50"
              >
                Previous
              </button>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
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
                        className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-bold transition ${
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
                className="rounded-full px-4 py-2 text-sm font-bold ring-1 ring-line transition enabled:bg-card enabled:text-ink enabled:hover:ring-terracotta/50 disabled:cursor-not-allowed disabled:text-muted/50"
              >
                Next
              </button>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.5 16.5 20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
