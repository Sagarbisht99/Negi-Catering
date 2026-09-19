export const occasions = [
  "House Party",
  "Birthday",
  "Corporate Parties",
  "Anniversary",
  "Pooja",
  "Festival",
] as const;

export type Occasion = (typeof occasions)[number];