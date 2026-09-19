import type { Metadata } from "next";
import { listPublishedServices } from "@/app/actions/services";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ServiceListing from "@/components/ServiceListing";
import { site } from "@/data/site";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Catering Services in Delhi NCR",
  description: `Explore catering services from ${site.brand.name} in New Ashok Nagar — daily tiffin, buffet, live counters, office meals, and pooja prasad across ${site.location.label}.`,
  keywords: `catering services Delhi NCR, tiffin service New Ashok Nagar, buffet catering Delhi, office meals East Delhi, pooja prasad catering, ${site.brand.name}`,
  path: "/services",
});

export default async function ServicesPage() {
  const services = await listPublishedServices();

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/feast.jpg"
            alt="Catering services"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative mx-auto max-w-7xl px-3 py-14 sm:px-4 md:px-6 md:py-28">
          <Breadcrumb variant="dark" items={[{ name: "Services" }]} />
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl md:text-6xl">
            Catering for every occasion
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-lg">
            From daily tiffin to festive feasts — choose a service that fits your
            guest count, venue, and style.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-12 sm:px-4 md:px-6 md:py-16">
        <ServiceListing services={services} />
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-12 sm:px-4 md:px-6 md:pb-16">
        <div className="overflow-hidden rounded-[24px] bg-terracotta px-5 py-8 text-white sm:rounded-[28px] sm:px-6 md:flex md:items-center md:justify-between md:px-10 md:py-10">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
              Not sure which service fits?
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Tell us the occasion and guest count — we&apos;ll suggest the right package.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-card px-6 py-3 text-sm font-bold text-terracotta transition hover:bg-ivory md:mt-0 md:w-auto"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
