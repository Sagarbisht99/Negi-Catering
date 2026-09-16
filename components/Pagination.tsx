"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
};

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

export default function Pagination({
  page,
  totalPages,
  total,
  from,
  to,
  hasPrev,
  hasNext,
  onPageChange,
}: PaginationProps) {
  if (total === 0 || totalPages <= 1) return null;

  const pages = pageNumbers(page, totalPages);

  return (
    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted">
        Showing <span className="font-semibold text-ink">{from}</span>–
        <span className="font-semibold text-ink">{to}</span> of{" "}
        <span className="font-semibold text-ink">{total}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink ring-1 ring-line transition hover:bg-terracotta/10 hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        {pages.map((num, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && num - prev > 1;
          return (
            <span key={num} className="contents">
              {showEllipsis ? (
                <span className="px-1 text-sm text-muted">…</span>
              ) : null}
              <button
                type="button"
                onClick={() => onPageChange(num)}
                className={`min-w-9 rounded-full px-2.5 py-1.5 text-sm font-semibold transition ${
                  num === page
                    ? "bg-terracotta text-white shadow-sm shadow-terracotta/25"
                    : "text-ink ring-1 ring-line hover:bg-terracotta/10 hover:text-terracotta"
                }`}
              >
                {num}
              </button>
            </span>
          );
        })}
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink ring-1 ring-line transition hover:bg-terracotta/10 hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
