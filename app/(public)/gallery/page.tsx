import type { Metadata } from "next";
import { listPublishedGallery } from "@/app/actions/gallery";
import Breadcrumb from "@/components/Breadcrumb";
import GalleryGrid from "@/components/GalleryGrid";
import JsonLd from "@/components/JsonLd";
import { site } from "@/data/site";
import { breadcrumbJsonLd, buildPageMetadata, webPageJsonLd } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Gallery",
  description: `Photos of ${site.brand.fullName} — catering spreads, festive thalis, buffet setups, and live counters across ${site.location.label}. See our kitchen and events in pictures.`,
  keywords: `Negi Caterers gallery, catering photos Delhi NCR, tiffin food photos, buffet catering pictures New Ashok Nagar, event catering gallery`,
  path: "/gallery",
});

export default async function GalleryPage() {
  const images = await listPublishedGallery();

  return (
    <div>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/gallery",
            name: `Gallery | ${site.brand.fullName}`,
            description: `Photo gallery of catering, tiffin, and event food from ${site.brand.fullName} in ${site.location.label}.`,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Gallery", path: "/gallery" },
          ]),
          ...(images.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "ImageGallery",
                  name: `Gallery | ${site.brand.fullName}`,
                  image: images.slice(0, 24).map((item) => item.image),
                },
              ]
            : []),
        ]}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/feast.jpg"
            alt={`Catering spread from ${site.brand.name}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-3 py-14 sm:px-4 md:px-6 md:py-24">
          <Breadcrumb variant="dark" items={[{ name: "Gallery" }]} />
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            Our Gallery
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
            A look at our food, buffets, and celebrations across{" "}
            {site.location.label}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
        {images.length ? (
          <GalleryGrid
            items={images.map((item) => ({
              id: item.id,
              image: item.image,
              caption: item.caption,
            }))}
          />
        ) : (
          <div className="rounded-2xl bg-card px-6 py-16 text-center ring-1 ring-line">
            <p className="font-display text-xl font-semibold text-ink">
              Photos coming soon
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              We are adding pictures of our dishes and events. Meanwhile, take a
              look at our{" "}
              <Link
                href="/services"
                className="font-semibold text-terracotta hover:text-terracotta-dark"
              >
                catering services
              </Link>{" "}
              or{" "}
              <Link
                href="/contact"
                className="font-semibold text-terracotta hover:text-terracotta-dark"
              >
                get a quote
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
