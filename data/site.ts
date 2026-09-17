/**
 * Single source of truth for site identity.
 * Update numbers/email here — FloatingActions, Footer, Contact, Header all use this.
 */
export const SITE_DOMAIN = "negicaterer.in";
export const SITE_ORIGIN = `https://${SITE_DOMAIN}`;

export const site = {
  brand: {
    shortName: "Negi",
    name: "Negi Caterers and Tiffin",
    fullName: "Negi Caterers and Tiffin",
    tagline: "Caterers & Tiffin",
    since: 1960,
    sinceLabel: "Since 1960",
    logo: "/logo.png",
    /** Default social / Open Graph share image (1200-friendly landscape) */
    ogImage: "/images/feast.jpg",
    description:
      "Negi Caterers and Tiffin has been serving families and celebrations since 1960 — for small gatherings or large groups, at home or at the office.",
  },
  contact: {
    /** Digits only with country code, no + (for WhatsApp wa.me) */
    whatsapp: "919315113011",
    /** E.164 style for tel: links */
    phone: "+919315113011",
    /** Display format */
    phoneDisplay: "+91 93151 13011",
    email: "Pratyaksh25negi@gmail.com",
    hours: "Mon–Sun · 9:00 AM – 9:00 PM",
    openingHoursSpec: "Mo-Su 09:00-21:00",
  },
  location: {
    label: "Delhi NCR",
    address: "A-136, New Ashok Nagar, Gali No. 13, Delhi — 110096",
    postalCode: "110096",
    addressRegion: "Delhi",
    addressLocality: "New Ashok Nagar",
    addressCountry: "IN",
  },
  reviews: {
    rating: 4.8,
    count: 128,
    googleUrl: "https://www.google.com/maps/search/?api=1&query=A-136,+New+Ashok+Nagar,+Gali+No.+13,+Delhi+110096",
  },
  seo: {
    title: "Negi Caterers and Tiffin | Catering & Tiffin in Delhi NCR Since 1960",
    description:
      "Book Negi Caterers and Tiffin for weddings, house parties, office meals, buffet and daily tiffin across Delhi NCR. Hygienic kitchen, home-style taste — since 1960.",
    keywords:
      "Negi Caterers, Negi Caterer, catering Delhi NCR, tiffin service Delhi, wedding catering Delhi, buffet catering, office catering, home party catering, pooja prasad, New Ashok Nagar catering, negicaterer.in",
  },
} as const;

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return SITE_ORIGIN;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function phoneHref(phone = site.contact.phone) {
  return `tel:${phone}`;
}

export function emailHref(email = site.contact.email) {
  return `mailto:${email}`;
}

export function whatsappHref(
  number = site.contact.whatsapp,
  message = `Hi ${site.brand.name}, I want to enquire about catering.`,
) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function citiesLine() {
  return site.location.label;
}

export function mapsHref(address = site.location.address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function mapsEmbedSrc(address = site.location.address) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
