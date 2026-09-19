import type { Metadata } from "next";
import { listPublishedBlogs } from "@/app/actions/blogs";
import BlogListing from "@/components/BlogListing";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { site } from "@/data/site";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description: `Tips, menus, and catering ideas from ${site.brand.name} — for parties, offices, and everyday meals across ${site.location.label}.`,
  keywords: `catering blog, tiffin tips, party catering ideas, ${site.location.label}, ${site.brand.name}`,
  path: "/blog",
});

export default async function BlogIndexPage() {
  const blogs = await listPublishedBlogs();

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <section className="border-b border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
          <Breadcrumb items={[{ name: "Blog" }]} />
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
            Ideas for every occasion
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Practical catering tips, menu inspiration, and stories from{" "}
            {site.brand.name}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
        <BlogListing blogs={blogs} />
      </section>
    </div>
  );
}
