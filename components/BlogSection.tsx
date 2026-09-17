import type { BlogRecord } from "@/app/actions/blogs";
import MediaImage from "@/components/MediaImage";
import Link from "next/link";

export default function BlogSection({ blogs }: { blogs: BlogRecord[] }) {
  if (blogs.length === 0) return null;

  return (
    <section
      id="blog"
      className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
            From the kitchen
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
            Latest from our blog
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Menus, occasion tips, and catering ideas for every celebration.
          </p>
        </div>
        <Link
          href="/blog"
          className="text-sm font-bold text-terracotta transition hover:text-terracotta-dark"
        >
          View all posts
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-4 xl:gap-8">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="overflow-hidden rounded-[22px] bg-card shadow-sm ring-1 ring-line"
          >
            <Link href={`/blog/${blog.slug}`} className="block h-full">
              <div className="relative aspect-[16/10] overflow-hidden">
                <MediaImage
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw"
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-display text-lg font-semibold text-ink md:text-xl">
                  {blog.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {blog.excerpt}
                </p>
                <span className="mt-3 inline-flex text-sm font-bold text-terracotta">
                  Read more
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
