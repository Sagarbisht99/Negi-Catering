import type { Metadata } from "next";
import { listPublishedBlogs } from "@/app/actions/blogs";
import { listPublishedServices } from "@/app/actions/services";
import BlogSection from "@/components/BlogSection";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import JsonLd from "@/components/JsonLd";
import Occasions from "@/components/Occasions";
import StatsBanner from "@/components/StatsBanner";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import { site } from "@/data/site";
import {
  buildPageMetadata,
  faqPageJsonLd,
  localBusinessJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: site.seo.title,
  description: site.seo.description,
  keywords: site.seo.keywords,
  path: "/",
  image: site.brand.ogImage,
});

export default async function Home() {
  const [services, blogs] = await Promise.all([
    listPublishedServices(10),
    listPublishedBlogs(4),
  ]);

  return (
    <>
      <JsonLd data={[localBusinessJsonLd(), websiteJsonLd(), faqPageJsonLd()]} />
      <Hero />
      <Occasions initialServices={services} />
      <StatsBanner />
      <WhyChooseUs />
      <HowItWorks />
      <BlogSection blogs={blogs} />
      <Testimonials />
      <Faq />
    </>
  );
}
