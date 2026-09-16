/**
 * Single source of truth for site identity.
 * Update numbers/email here — FloatingActions, Footer, Contact, Header all use this.
 */
export const site = {
  brand: {
    shortName: "Negi",
    name: "Negi Caterers",
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
    whatsapp: "919876543210",
    /** E.164 style for tel: links */
    phone: "+919876543210",
    /** Display format */
    phoneDisplay: "+91 98765 43210",
    email: "hello@negicaterers.com",
    hours: "Mon–Sun · 9:00 AM – 9:00 PM",
  },
  location: {
    label: "Delhi NCR",
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
  reviews: {
    rating: 4.8,
    count: 128,
    /** Update with your real Google Business reviews link later */
    googleUrl: "https://www.google.com/maps",
  },
  seo: {
    title: "Negi Caterers and Tiffin | Since 1960",
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
