export const occasions = [
  "House Party",
  "Birthday",
  "Corporate Parties",
  "Anniversary",
  "Pooja",
  "Wedding",
  "Festival",
] as const;

export type Occasion = (typeof occasions)[number];