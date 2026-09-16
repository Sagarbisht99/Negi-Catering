export type HardcodedService = {
  id: string;
  title: string;
  accent: string;
  description: string;
  points: string[];
  img: string;
  tag?: string;
  guests: string;
};

/** Default services shown on /services — hardcoded, not from admin. */
export const hardcodedServices: HardcodedService[] = [
  {
    id: "tiffin",
    title: "Tiffin",
    accent: "Daily",
    description: "Fresh home-style meals delivered on a schedule that fits your day.",
    points: ["No mess, no stress", "Fresh home-style meals", "Flexible schedules"],
    img: "/images/thali.jpg",
    tag: "Most Loved",
    guests: "For 1–10 guests",
  },
  {
    id: "buffet",
    title: "Buffet",
    accent: "Negi",
    description: "Elegant buffet setups with presentation and optional service staff.",
    points: ["Hassle-free setup", "Elegant presentation", "Service staff available"],
    img: "/images/feast.jpg",
    tag: "Most Loved",
    guests: "For 25+ guests",
  },
  {
    id: "live",
    title: "Counters",
    accent: "Live",
    description: "On-site chefs and interactive stations that guests love.",
    points: ["On-site chefs", "Interactive stations", "Crowd favourites"],
    img: "/images/chef.jpg",
    guests: "For 40+ guests",
  },
  {
    id: "office",
    title: "Meals",
    accent: "Office",
    description: "Punctual trays for meetings, celebrations, and staff lunches.",
    points: ["Punctual delivery", "Veg & Jain options", "Meeting-ready trays"],
    img: "/images/office.jpg",
    guests: "For 10+ guests",
  },
  {
    id: "wedding",
    title: "Feasts",
    accent: "Wedding",
    description: "Grand menus and multi-day support for your biggest celebrations.",
    points: ["Grand menus", "Multi-day support", "Traditional & fusion"],
    img: "/images/wedding.jpg",
    tag: "Signature",
    guests: "For 100+ guests",
  },
  {
    id: "pooja",
    title: "Prasad",
    accent: "Pooja",
    description: "Clean, satvik menus suited for poojas and family rituals.",
    points: ["Satvik options", "Neat packing", "On-time delivery"],
    img: "/images/diya.jpg",
    guests: "For 20+ guests",
  },
];
