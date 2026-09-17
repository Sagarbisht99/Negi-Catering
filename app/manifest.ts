import type { MetadataRoute } from "next";
import { SITE_ORIGIN, site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.brand.fullName,
    short_name: site.brand.shortName,
    description: site.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f3ebe1",
    theme_color: "#c45c26",
    lang: "en-IN",
    categories: ["food", "business"],
    icons: [
      {
        src: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    id: SITE_ORIGIN,
  };
}
