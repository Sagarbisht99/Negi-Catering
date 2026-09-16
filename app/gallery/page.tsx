import type { Metadata } from "next";
import FoodGallery from "@/components/FoodGallery";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Gallery | ${site.brand.fullName}`,
  description: `Browse ${site.brand.name} dishes by category — starters, mains, live counters, desserts, and more.`,
};

export default function GalleryPage() {
  return (
    <div className="pb-8">
      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-6 md:pt-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
          Food Gallery
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink md:text-5xl">
          Our Dishes
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
          Filter by category and click any photo to view it larger.
        </p>
      </section>
      <FoodGallery showTitle={false} />
    </div>
  );
}
