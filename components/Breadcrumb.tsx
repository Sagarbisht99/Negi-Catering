import Link from "next/link";

export type Crumb = {
  name: string;
  href?: string;
};

type Props = {
  items: Crumb[];
  /** Use on dark hero banners */
  variant?: "light" | "dark";
  className?: string;
};

export default function Breadcrumb({
  items,
  variant = "light",
  className = "",
}: Props) {
  const crumbs =
    items[0]?.href === "/" || items[0]?.name.toLowerCase() === "home"
      ? items
      : [{ name: "Home", href: "/" }, ...items];

  const isDark = variant === "dark";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs font-bold uppercase tracking-[0.16em] ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.name}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? (
                <span
                  className={isDark ? "text-white/40" : "text-muted/60"}
                  aria-hidden
                >
                  /
                </span>
              ) : null}
              {isLast || !crumb.href ? (
                <span
                  className={isDark ? "text-white/80" : "text-ink"}
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={
                    isDark
                      ? "text-terracotta-soft transition hover:text-white"
                      : "text-terracotta transition hover:text-terracotta-dark"
                  }
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
