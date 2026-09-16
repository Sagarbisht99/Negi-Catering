"use client";

type AdminPaginationProps = {
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
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

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

export default function AdminPagination({
  page,
  totalPages,
  total,
  from,
  to,
  hasPrev,
  hasNext,
  onPageChange,
}: AdminPaginationProps) {
  if (total === 0) return null;

  const pages = pageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500">
        Showing <span className="font-medium text-zinc-300">{from}</span>–
        <span className="font-medium text-zinc-300">{to}</span> of{" "}
        <span className="font-medium text-zinc-300">{total}</span>
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {pages.map((num, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && num - prev > 1;
          return (
            <span key={num} className="contents">
              {showEllipsis ? (
                <span className="px-1 text-sm text-zinc-600">…</span>
              ) : null}
              <button
                type="button"
                onClick={() => onPageChange(num)}
                className={`min-w-9 rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                  num === page
                    ? "bg-terracotta text-white"
                    : "border border-white/10 text-zinc-300 hover:bg-white/5"
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
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
