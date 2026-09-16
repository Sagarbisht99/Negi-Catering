export const occasions = [
  "House Party",
  "Birthday",
  "Premium",
  "Office",
  "Anniversary",
  "Pooja",
  "Wedding",
  "Festival",
] as const;

export type Occasion = (typeof occasions)[number];
