/**
 * Single source of truth for site identity.
 * Update numbers/email here — FloatingActions, Footer, Contact, Header all use this.
 */
export const site = {
  brand: {
    shortName: "Negi",
    name: "Negi Caterers and Tiffin",
    fullName: "Negi Caterers and Tiffin",
    tagline: "Caterers & Tiffin",
    since: 1960,
    sinceLabel: "Since 1960",
    logo: "/logo.png",
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
  },
  location: {
    label: "Delhi NCR",
    address: "A-136, New Ashok Nagar, Gali No. 13, Delhi — 110096",
  },
  reviews: {
    rating: 4.8,
    count: 128,
    /** Update with your real Google Business reviews link later */
    googleUrl: "https://www.google.com/maps",
  },
  seo: {
    title: "Negi Caterers and Tiffin Services | Since 1960",
    description:
      "Traditional catering and tiffin service for every occasion — house parties, weddings, offices, and festivals. Since 1960.",
  },
} as const;

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
