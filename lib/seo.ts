import type { Metadata } from "next";
import { menuDishes } from "@/data/menuDishes";
import { getSiteUrl, mapsHref, site, whatsappHref } from "@/data/site";
import { faqItems } from "@/data/faq";

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  image?: string;
};

const AREA_SERVED = [
  "Delhi NCR",
  "New Ashok Nagar",
  "East Delhi",
  "Noida",
  "Ghaziabad",
  "Greater Noida",
  "Mayur Vihar",
  "Indirapuram",
];

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
    authors: [{ name: site.brand.fullName, url: getSiteUrl() }],
    creator: site.brand.fullName,
    publisher: site.brand.fullName,
    category: "Food & Catering",
    alternates: {
      canonical: url,
      languages: { "en-IN": url, "hi-IN": url, en: url },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.brand.fullName,
      locale: "en_IN",
      alternateLocale: ["hi_IN"],
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
    other: {
      "geo.region": "IN-DL",
      "geo.placename": site.location.addressLocality,
      "geo.position": `${site.location.lat};${site.location.lng}`,
      ICBM: `${site.location.lat}, ${site.location.lng}`,
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
    alternateName: [
      "Negi Caterers",
      "Negi Caterer",
      "Negi Tiffin",
      "Negi Caterers and Tiffin Delhi",
    ],
    description: site.seo.description,
    url: getSiteUrl(),
    telephone: site.contact.phone,
    email: site.contact.email,
    image: [absoluteUrl(site.brand.logo), absoluteUrl(site.brand.ogImage)],
    logo: absoluteUrl(site.brand.logo),
    slogan: "Home-style catering & tiffin since 1960",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Bank Transfer",
    servesCuisine: ["Indian", "North Indian", "Vegetarian"],
    knowsLanguage: ["en", "hi"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.location.address,
      addressLocality: site.location.addressLocality,
      addressRegion: site.location.addressRegion,
      postalCode: site.location.postalCode,
      addressCountry: site.location.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.location.lat,
      longitude: site.location.lng,
    },
    hasMap: mapsHref(),
    areaServed: AREA_SERVED.map((name) => ({
      "@type": "Place",
      name,
    })),
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
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.contact.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        email: site.contact.email,
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/contact"),
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Catering enquiry",
      },
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: site.brand.fullName,
    alternateName: "Negi Caterers",
    url: getSiteUrl(),
    description: site.seo.description,
    publisher: { "@id": `${getSiteUrl()}/#business` },
    inLanguage: ["en-IN", "hi-IN"],
    potentialAction: {
      "@type": "ReadAction",
      target: [
        absoluteUrl("/"),
        absoluteUrl("/services"),
        absoluteUrl("/blog"),
        absoluteUrl("/contact"),
      ],
    },
  };
}

export function webPageJsonLd({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    about: { "@id": `${getSiteUrl()}/#business` },
    inLanguage: "en-IN",
  };
}

export function menuItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${getSiteUrl()}/#menu`,
    name: `${site.brand.shortName} catering menu highlights`,
    description:
      "Popular Indian dishes for house parties, offices, and small gatherings.",
    numberOfItems: menuDishes.length,
    itemListElement: menuDishes.map((dish, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MenuItem",
        name: dish.name,
        image: absoluteUrl(dish.image),
        suitableForDiet: "https://schema.org/VegetarianDiet",
      },
    })),
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
  const image = post.image.startsWith("http")
    ? post.image
    : absoluteUrl(post.image);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image,
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
  const image = service.image.startsWith("http")
    ? service.image
    : absoluteUrl(service.image);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    image,
    url: absoluteUrl(`/services/${service.slug}`),
    serviceType: "Catering",
    provider: {
      "@id": `${getSiteUrl()}/#business`,
      "@type": "CateringBusiness",
      name: site.brand.fullName,
    },
    areaServed: AREA_SERVED.map((name) => ({
      "@type": "Place",
      name,
    })),
  };
}
