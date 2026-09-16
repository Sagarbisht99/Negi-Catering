import Image from "next/image";
import { site } from "@/data/site";

const offerings = [
  {
    title: "Tiffin",
    accent: "Daily",
    points: ["No mess, no stress", "Fresh home-style meals", "Flexible schedules"],
    img: "/images/thali.jpg",
    tag: "Most Loved",
    guests: "For 1–10 guests",
  },
  {
    title: "Buffet",
    accent: "Negi",
    points: ["Hassle-free setup", "Elegant presentation", "Service staff available"],
    img: "/images/feast.jpg",
    tag: "Most Loved",
    guests: "For 25+ guests",
  },
  {
    title: "Live",
    accent: "Counters",
    points: ["On-site chefs", "Interactive stations", "Crowd favourites"],
    img: "/images/chef.jpg",
    guests: "For 40+ guests",
  },
  {
    title: "Office",
    accent: "Meals",
    points: ["Punctual delivery", "Veg & Jain options", "Meeting-ready trays"],
    img: "/images/office.jpg",
    guests: "For 10+ guests",
  },
  {
    title: "Wedding",
    accent: "Feasts",
    points: ["Grand menus", "Multi-day support", "Traditional & fusion"],
    img: "/images/wedding.jpg",
    tag: "Signature",
    guests: "For 100+ guests",
  },
];

export default function Offerings() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <h2 className="text-center font-display text-3xl font-semibold tracking-wide text-terracotta md:text-4xl">
        Catering Offerings
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {offerings.map((o, i) => (
          <article
            key={o.title}
            className={`relative overflow-hidden rounded-[24px] bg-card p-5 shadow-sm ring-1 ring-line md:p-6 ${i >= 3 ? "xl:col-span-1" : ""} ${i === 3 ? "xl:col-start-1 xl:justify-self-stretch" : ""} ${i === 4 ? "md:col-span-2 xl:col-span-1" : ""}`}
          >
            <div className="flex flex-wrap gap-2">
              {o.tag ? (
                <span className="rounded-md bg-terracotta px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {o.tag}
                </span>
              ) : null}
              <span className="rounded-md bg-ink/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                {o.guests}
              </span>
            </div>
            <div className="mt-5 flex gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  {site.brand.name}
                </p>
                <h3 className="mt-1 font-display text-3xl font-semibold">
                  <span className="text-ink">{o.accent}</span>{" "}
                  <span className="text-terracotta">{o.title}</span>
                </h3>
                <ul className="mt-4 space-y-2">
                  {o.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-ink/80">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leaf text-[10px] font-bold text-white">
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-5 rounded-lg bg-terracotta px-5 py-2 text-sm font-bold text-white transition hover:bg-terracotta-dark"
                >
                  Details
                </button>
              </div>
              <div className="relative hidden h-36 w-36 shrink-0 overflow-hidden rounded-2xl sm:block md:h-40 md:w-40">
                <Image src={o.img} alt={o.title} fill className="object-cover" sizes="160px" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
