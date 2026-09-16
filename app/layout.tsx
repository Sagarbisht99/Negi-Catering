import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import { site } from "@/data/site";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description,
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ivory font-sans text-ink">
        <EnquiryProvider>
          <Header />
          <main className="flex-1 pb-12">{children}</main>
          <Footer />
          <FloatingActions />
          <Ticker />
        </EnquiryProvider>
      </body>
    </html>
  );
}
