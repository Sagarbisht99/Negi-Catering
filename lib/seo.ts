import type { Metadata } from "next";
import { getSiteUrl, site, whatsappHref } from "@/data/site";
import { faqItems } from "@/data/faq";

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  image?: string;
};

export function parseKeywords(value?: string) {
  if (!value?.trim()) return undefined;
  const list = value
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description,
  keywords,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = title.includes(site.brand.name)
    ? title
    : `${title} | ${site.brand.fullName}`;
  const url = absoluteUrl(path);
  const ogImage = image?.startsWith("http")
    ? image
    : absoluteUrl(image || site.brand.ogImage);
  const keywordList = parseKeywords(keywords) ?? parseKeywords(site.seo.keywords);

  return {
    title: { absolute: fullTitle },
    description,
    keywords: keywordList,
    alternates: {
      canonical: url,
      languages: { "en-IN": url, en: url },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.brand.fullName,
      locale: "en_IN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function seoTitle(fields: SeoFields, fallback: string) {
  return fields.metaTitle?.trim() || fallback;
}

export function seoDescription(fields: SeoFields, fallback: string) {
  return fields.metaDescription?.trim() || fallback;
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["CateringBusiness", "LocalBusiness", "FoodEstablishment"],
    "@id": `${getSiteUrl()}/#business`,
    name: site.brand.fullName,
    alternateName: ["Negi Caterers", "Negi Caterer", "Negi Tiffin"],
    description: site.seo.description,
    url: getSiteUrl(),
    telephone: site.contact.phone,
    email: site.contact.email,
    image: [absoluteUrl(site.brand.logo), absoluteUrl(site.brand.ogImage)],
    logo: absoluteUrl(site.brand.logo),
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.location.address,
      addressLocality: site.location.addressLocality,
      addressRegion: site.location.addressRegion,
      postalCode: site.location.postalCode,
      addressCountry: site.location.addressCountry,
    },
    areaServed: {
      "@type": "Place",
      name: site.location.label,
    },
    foundingDate: String(site.brand.since),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.reviews.rating,
      reviewCount: site.reviews.count,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [site.reviews.googleUrl, whatsappHref()],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.contact.phone,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: site.brand.fullName,
    url: getSiteUrl(),
    description: site.seo.description,
    publisher: { "@id": `${getSiteUrl()}/#business` },
    inLanguage: "en-IN",
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    articleBody: post.content,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    inLanguage: "en-IN",
    author: {
      "@type": "Organization",
      name: site.brand.fullName,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: site.brand.fullName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(site.brand.logo),
      },
    },
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  image: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    image: service.image,
    url: absoluteUrl(`/services/${service.slug}`),
    serviceType: "Catering",
    provider: {
      "@id": `${getSiteUrl()}/#business`,
      "@type": "CateringBusiness",
      name: site.brand.fullName,
    },
    areaServed: site.location.label,
  };
}
