/**
 * Single source of truth for site identity.
 * Update numbers/email here — FloatingActions, Footer, Contact, Header all use this.
 */
export const SITE_DOMAIN = "negicaterer.in";
export const SITE_ORIGIN = `https://${SITE_DOMAIN}`;

const MAPS_URL =
  "https://www.google.com/maps/place/MAA+PITAMBARA+MEDICOS/@28.5908945,77.3094569,20.33z/data=!4m14!1m7!3m6!1s0x390ce4f30027dabd:0xe463c9af036d026a!2sDev+medicos!8m2!3d28.594286!4d77.3117633!16s%2Fg%2F1td56_d5!3m5!1s0x390ce500749d7573:0x26618f42985ec377!8m2!3d28.5908977!4d77.3096745!16s%2Fg%2F11wbtgdb5c?entry=ttu&g_ep=EgoyMDI2MDkxNC4wIKXMDSoASAFQAw%3D%3D";

export const site = {
  brand: {
    shortName: "Negi Caterers and Tiffin",
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
    /** Alternate line for the same business (E.164 style for tel: links) */
    phoneAlt: "+919354350373",
    /** Alternate line, display format */
    phoneAltDisplay: "+91 93543 50373",
    email: "pratyaksh25negi@gmail.com",
    hours: "Mon–Sun · 8:00 AM – 11:00 PM",
    openingHoursSpec: "Mo-Su 08:00-23:00",
  },
  location: {
    label: "Delhi NCR",
    address:
      "A-136, New Ashok Nagar Rd, Block A, New Ashok Nagar, New Delhi, Delhi 110096",
    /** Compact form for narrow columns (footer, cards) */
    shortAddress: "New Ashok Nagar, New Delhi 110096",
    postalCode: "110096",
    addressRegion: "Delhi",
    addressLocality: "New Ashok Nagar",
    addressCountry: "IN",
    lat: 28.5908977,
    lng: 77.3096745,
    mapsUrl: MAPS_URL,
  },
  reviews: {
    rating: 4.8,
    count: 128,
    googleUrl: MAPS_URL,
  },
  social: {
    instagram:
      "https://www.instagram.com/invites/contact/?utm_content=aqj3m62&stkn=81sxwuk2vtq3",
    instagramHandle: "@negicaterers",
  },
  seo: {
    title:
      "Negi Caterers and Tiffin | Best Catering & Tiffin Service in Delhi NCR",
    description:
      "Negi Caterers and Tiffin in New Ashok Nagar, Delhi NCR — home-style catering for house parties, offices, poojas and festivals. Daily tiffin, buffet menus and hygienic kitchen since 1960. Call +91 93151 13011.",
    keywords:
      "Negi Caterers, Negi Caterer, Negi Tiffin, catering Delhi NCR, tiffin service Delhi, tiffin New Ashok Nagar, buffet catering Delhi, office catering Delhi NCR, house party catering, pooja prasad catering, East Delhi caterers, Noida catering, Ghaziabad catering, hygienic catering Delhi, home style catering, negicaterer.in",
  },
} as const;

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return SITE_ORIGIN;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function phoneHref(phone: string = site.contact.phone) {
  return `tel:${phone}`;
}

/** All published phone lines, primary first. */
export function contactPhones() {
  return [
    { phone: site.contact.phone, display: site.contact.phoneDisplay },
    { phone: site.contact.phoneAlt, display: site.contact.phoneAltDisplay },
  ] as const;
}

export function phoneDisplayLine() {
  return contactPhones()
    .map((p) => p.display)
    .join(" · ");
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

export function mapsHref() {
  return site.location.mapsUrl;
}

export function mapsEmbedSrc() {
  const { lat, lng } = site.location;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
}
