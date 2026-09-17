import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import QueryProvider from "@/components/QueryProvider";
import { getSiteUrl, site } from "@/data/site";
import { parseKeywords } from "@/lib/seo";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#c45c26",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: site.seo.title,
    template: `%s | ${site.brand.fullName}`,
  },
  description: site.seo.description,
  keywords: parseKeywords(site.seo.keywords),
  applicationName: site.brand.fullName,
  authors: [{ name: site.brand.fullName, url: getSiteUrl() }],
  creator: site.brand.fullName,
  publisher: site.brand.fullName,
  category: "Food & Catering",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.brand.fullName,
    title: site.seo.title,
    description: site.seo.description,
    url: "/",
    images: [
      {
        url: site.brand.ogImage,
        width: 1200,
        height: 630,
        alt: site.brand.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [site.brand.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      en: "/",
    },
  },
  other: {
    "geo.region": "IN-DL",
    "geo.placename": site.location.label,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${rubik.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col overflow-x-hidden bg-ivory font-sans text-ink"
        suppressHydrationWarning
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
