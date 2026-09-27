import { emailHref, phoneHref, site } from "@/data/site";
import Image from "next/image";

export default function CollaborationSection() {
  return (
    <section
      aria-labelledby="collaboration-heading"
      className="border-y border-line bg-ivory-deep/45 text-ink"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[280px_minmax(0,1fr)] md:items-stretch md:gap-10 md:py-16">
        <div className="relative min-h-[220px] w-full overflow-hidden rounded-md md:min-h-full">
          <Image
            src="/images/collabarate.png"
            alt="Negi Caterers collaboration and partnership"
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 280px"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
            Collaborate with us
          </p>
          <h2
            id="collaboration-heading"
            className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl"
          >
            Good food brings people together.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Have a partnership idea in {site.location.label}? Let&apos;s talk.
          </p>

          <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Email
              </p>
              <a
                href={emailHref()}
                className="mt-1 inline-block break-all text-sm font-semibold text-terracotta transition-colors hover:text-terracotta-dark"
              >
                {site.contact.email}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Phone
              </p>
              <a
                href={phoneHref()}
                className="mt-1 inline-block text-sm font-semibold text-terracotta transition-colors hover:text-terracotta-dark"
              >
                {site.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}