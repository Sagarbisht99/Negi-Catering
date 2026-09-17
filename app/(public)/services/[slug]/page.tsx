import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedServiceBySlug,
  listPublishedServices,
} from "@/app/actions/services";
import JsonLd from "@/components/JsonLd";
import MediaImage from "@/components/MediaImage";
import { site } from "@/data/site";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  seoDescription,
  seoTitle,
  serviceJsonLd,
} from "@/lib/seo";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await listPublishedServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);
  if (!service) return { title: "Services" };

  return buildPageMetadata({
    title: seoTitle(service, service.name),
    description: seoDescription(service, service.description),
    keywords: service.metaKeywords,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);
  if (!service) notFound();

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
          serviceJsonLd(service),
        ]}
      />
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <MediaImage
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative mx-auto max-w-7xl px-3 py-14 sm:px-4 md:px-6 md:py-28">
          <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-soft">
            <Link href="/services">Our Services</Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="text-white/80">Details</span>
          </nav>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl md:text-6xl">
            {service.name}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-lg">
            {service.description}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-[280px_1fr] md:items-start">
          <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-[24px] ring-1 ring-line">
            <MediaImage
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
              sizes="280px"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {site.brand.name}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-4xl">
              {service.name}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
              {service.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center rounded-lg bg-terracotta px-5 py-2 text-sm font-bold text-white transition hover:bg-terracotta-dark"
              >
                Enquire
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center rounded-lg px-5 py-2 text-sm font-bold text-terracotta ring-1 ring-line transition hover:bg-card"
              >
                All services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
