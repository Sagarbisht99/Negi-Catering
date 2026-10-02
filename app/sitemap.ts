import type { MetadataRoute } from "next";
import { listPublishedBlogs } from "@/app/actions/blogs";
import { listPublishedServices } from "@/app/actions/services";
import { SITE_ORIGIN } from "@/data/site";

/** Build/deploy time — used as lastModified for pages that rarely change. */
const BUILD_DATE = new Date();

/** Slugs that carry the most commercial intent for tiffin + catering. */
const HIGH_INTENT_SLUGS = new Set([
  "daily-tiffin-service",
  "house-party-catering",
  "corporate-event-catering",
  "birthday-party-catering",
  "wedding-catering",
  "pooja-catering",
  "festival-catering",
]);

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.95 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/sitemap", changeFrequency: "weekly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_ORIGIN;
  const [services, blogs] = await Promise.all([
    listPublishedServices(),
    listPublishedBlogs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: BUILD_DATE,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: service.updatedAt
      ? new Date(service.updatedAt)
      : service.createdAt
        ? new Date(service.createdAt)
        : BUILD_DATE,
    changeFrequency: "monthly",
    priority: HIGH_INTENT_SLUGS.has(service.slug) ? 0.9 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${base}/blog/${blog.slug}`,
    lastModified: blog.updatedAt
      ? new Date(blog.updatedAt)
      : blog.createdAt
        ? new Date(blog.createdAt)
        : BUILD_DATE,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
