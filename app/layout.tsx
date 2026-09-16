import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import QueryProvider from "@/components/QueryProvider";
import { site } from "@/data/site";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3ebe1",
};

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description,
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-ivory font-sans text-ink">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
