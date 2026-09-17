export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function resolveSlug(explicit: string, fallbackTitle: string) {
  const fromExplicit = slugify(explicit);
  if (fromExplicit) return fromExplicit;
  const fromTitle = slugify(fallbackTitle);
  if (fromTitle) return fromTitle;
  throw new Error("Slug is required");
}
