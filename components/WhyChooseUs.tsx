import { site } from "@/data/site";

const reasons = [
  {
    title: "Home-style taste",
    desc: "Fresh tempering, balanced spices, and menus that feel familiar.",
    icon: TasteIcon,
  },
  {
    title: "Hygienic kitchen",
    desc: "Clean prep, careful packing, and food handled with care.",
    icon: HygieneIcon,
  },
  {
    title: "On-time delivery",
    desc: `Punctual service across ${site.location.label} for every event.`,
    icon: TimeIcon,
  },
  {
    title: site.brand.sinceLabel,
    desc: "Decades of catering experience for gatherings of every size.",
    icon: LegacyIcon,
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
          Why Negi Caterers and Tiffin
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-5xl">
          Why choose us
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          Hygienic, on-time catering with home-style care across{" "}
          {site.location.label}.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
        {reasons.map((reason) => (
          <div key={reason.title} className="text-center">
            <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-terracotta/25" />
              <span className="absolute inset-[5px] rounded-full border border-terracotta/40" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                <reason.icon />
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold text-ink md:text-xl">
              {reason.title}
            </h3>
            <p className="mx-auto mt-2 max-w-[240px] text-sm leading-relaxed text-muted">
              {reason.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TasteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c-1.5 3.5-5 5.5-5 10a5 5 0 0 0 10 0c0-4.5-3.5-6.5-5-10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 14.5c.6 1.2 1.5 1.8 2.5 1.8s1.9-.6 2.5-1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HygieneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 3v5c0 5-3.2 8.6-7 10-3.8-1.4-7-5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.2l2 2 4-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4.2l2.8 1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LegacyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 19V8.5L12 4l7 4.5V19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 19v-5.5h5V19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
