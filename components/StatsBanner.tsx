import { site } from "@/data/site";

const years = new Date().getFullYear() - site.brand.since;

const stats = [
  { value: "500+", label: "Menu Options" },
  { value: `${site.reviews.rating}/5`, label: "Guest Rating", star: true },
  { value: `${site.reviews.count}+`, label: "Google Reviews" },
];

export default function StatsBanner() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-3 py-8 sm:px-4 md:px-6">
      <div className="relative overflow-hidden rounded-[22px] bg-card shadow-sm ring-1 ring-line sm:rounded-[32px]">
        <MapBackdrop />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card from-10% via-card/70 to-transparent" />

        <div className="relative flex flex-col gap-8 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-8 md:px-10 md:py-9 lg:px-12">
          <div className="max-w-sm shrink-0">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-terracotta">
              <span className="h-2 w-2 rounded-full bg-terracotta" />
              Delhi NCR&apos;s family caterers
            </p>
            <p className="mt-2 font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              {years}+
            </p>
            <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">
              Years of Trust
            </p>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-muted">
              Serving across {site.location.label} with home-style cooking and
              warm hospitality for every occasion.
            </p>
          </div>

          <div className="flex min-w-0 flex-1 items-stretch justify-between md:max-w-xl md:justify-end">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-1 flex-col items-center px-2 text-center sm:px-5 ${
                  i > 0 ? "border-l border-terracotta/25" : ""
                }`}
              >
                <p className="inline-flex items-baseline gap-1 font-display text-3xl font-bold text-terracotta sm:text-4xl lg:text-5xl">
                  {s.value}
                  {s.star ? <Star /> : null}
                </p>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted sm:text-[11px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Star() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      className="-translate-y-1 text-terracotta-soft"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12 2.6l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.7 6.6 19.4l1-6.1L3.2 9l6.1-.9L12 2.6z"
      />
    </svg>
  );
}

function MapBackdrop() {
  const blocks = Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 22 }, (_, col) => {
      const x = 280 + col * 56 + ((row * 3) % 7);
      const y = 8 + row * 42 + ((col * 2) % 6);
      const w = 42 + ((col + row) % 3) * 3;
      const h = 30 + ((row * 5 + col) % 4) * 2;
      return (
        <rect
          key={`${row}-${col}`}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="3"
          fill="#e4d3c3"
          opacity={0.45 + ((row + col) % 5) * 0.06}
        />
      );
    }),
  );

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 380"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="1440" height="380" fill="#f6eee4" />
      {blocks}
      <g fill="#5a9a66" opacity="0.14">
        <ellipse cx="720" cy="70" rx="86" ry="38" />
        <ellipse cx="1080" cy="250" rx="70" ry="32" />
        <ellipse cx="960" cy="40" rx="50" ry="22" />
        <ellipse cx="1320" cy="160" rx="64" ry="28" />
      </g>
      <path
        d="M260 200 C 420 160, 520 280, 700 240 S 980 140, 1160 190 1360 300, 1440 250"
        fill="none"
        stroke="#c45c26"
        strokeOpacity="0.18"
        strokeWidth="22"
      />
      <path
        d="M260 200 C 420 160, 520 280, 700 240 S 980 140, 1160 190 1360 300, 1440 250"
        fill="none"
        stroke="#f3ebe1"
        strokeWidth="10"
      />
      <g fill="none" stroke="#fffaf5" strokeWidth="5" strokeLinecap="round">
        <path d="M280 90 H1440" />
        <path d="M280 174 H1440" />
        <path d="M280 258 H1440" />
        <path d="M280 338 H1440" />
        <path d="M500 0 V380" />
        <path d="M724 0 V380" />
        <path d="M948 0 V380" />
        <path d="M1172 0 V380" />
        <path d="M1390 0 V380" />
      </g>
      <circle cx="1108" cy="148" r="8" fill="#c45c26" />
      <circle
        cx="1108"
        cy="148"
        r="18"
        fill="none"
        stroke="#c45c26"
        strokeOpacity="0.4"
        strokeWidth="2"
      />
    </svg>
  );
}
