import Image from "next/image";
import Link from "next/link";

const dishes = [
  { name: "Paneer Tikka", image: "/images/paneer.jpg" },
  { name: "Biryani", image: "/images/biryani.jpg" },
  { name: "Thali", image: "/images/thali.jpg" },
  { name: "Chaat", image: "/images/chaat.jpg" },
  { name: "Kebabs", image: "/images/kebabs.jpg" },
  { name: "Naan & Breads", image: "/images/naan.jpg" },
  { name: "Sweets", image: "/images/sweets.jpg" },
  { name: "Dosa", image: "/images/dosa.jpg" },
];

export default function MenuHighlight() {
  return (
    <section
      id="menu"
      className="border-y border-line bg-ivory-deep/40 py-10 md:py-16"
      aria-labelledby="menu-heading"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
            From our kitchen
          </p>
          <h2
            id="menu-heading"
            className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl"
          >
            A taste of the menu
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Home-style favourites, festive spreads, and live counters — tailored
            to your guest count.
          </p>
        </div>

        <div className="scrollbar-thin mt-8 -mx-3 flex gap-4 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4 md:mx-0 md:mt-10 md:px-0">
          {dishes.map((dish) => (
            <figure
              key={dish.name}
              className="group w-[140px] shrink-0 sm:w-[160px]"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-card ring-1 ring-line">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="160px"
                />
              </div>
              <figcaption className="mt-2.5 text-center text-xs font-semibold text-ink sm:text-sm">
                {dish.name}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-terracotta px-6 py-2.5 text-sm font-bold text-white transition hover:bg-terracotta-dark"
          >
            Ask for a full menu
          </Link>
        </div>
      </div>
    </section>
  );
}
