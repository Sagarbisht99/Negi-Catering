import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedBlogBySlug, listPublishedBlogs } from "@/app/actions/blogs";
import JsonLd from "@/components/JsonLd";
import MediaImage from "@/components/MediaImage";
import Breadcrumb from "@/components/Breadcrumb";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  seoDescription,
  seoTitle,
} from "@/lib/seo";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const blogs = await listPublishedBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) return { title: "Blog" };

  return buildPageMetadata({
    title: seoTitle(blog, blog.title),
    description: seoDescription(blog, blog.excerpt),
    keywords: blog.metaKeywords,
    path: `/blog/${blog.slug}`,
    image: blog.image,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) notFound();

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: blog.title, path: `/blog/${blog.slug}` },
          ]),
          blogPostingJsonLd(blog),
        ]}
      />
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <MediaImage
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/65" />
        </div>
        <div className="relative mx-auto max-w-4xl px-3 py-14 sm:px-4 md:px-6 md:py-24">
          <Breadcrumb
            variant="dark"
            items={[
              { name: "Blog", href: "/blog" },
              { name: blog.title },
            ]}
          />
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            {blog.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 md:text-lg">
            {blog.excerpt}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted md:text-base">
          {blog.content}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Link
            href="/blog"
            className="text-sm font-bold text-terracotta transition hover:text-terracotta-dark"
          >
            ← All posts
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center rounded-lg bg-terracotta px-5 py-2 text-sm font-bold text-white transition hover:bg-terracotta-dark"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </article>
  );
}
