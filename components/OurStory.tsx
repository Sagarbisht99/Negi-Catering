import { site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  "Fresh tempering & home-style recipes",
  "Hygienic kitchen for every order",
  `On-time service across ${site.location.label}`,
];

export default function OurStory() {
  return (
    <section
      id="our-story"
      className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-20"
      aria-labelledby="story-heading"
    >
      <div className="grid items-stretch gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative min-h-[280px] overflow-hidden rounded-[28px] ring-1 ring-line md:min-h-0">
          <Image
            src="/images/about-feast.png"
            alt={`${site.brand.name} Indian catering feast`}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
            {site.brand.sinceLabel}
          </p>
          <h2
            id="story-heading"
            className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl"
          >
            A family kitchen,{" "}
            <span className="text-terracotta">trusted for generations</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            {site.brand.description} Across {site.location.label}, we cook with
            the same care whether it&apos;s daily tiffin or a wedding feast.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            From intimate house parties to office lunches and festive gatherings,
            our team plans the menu, prep, and timing so you can host without
            stress.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Hygienic prep, punctual service, and menus that taste like home —
            that&apos;s the Negi promise.
          </p>

          <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm font-medium text-ink"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-terracotta transition hover:text-terracotta-dark"
          >
            Read our story →
          </Link>
        </div>
      </div>
    </section>
  );
}
