import Faq from "@/components/Faq";
import FoodGallery from "@/components/FoodGallery";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Occasions from "@/components/Occasions";
import StatsBanner from "@/components/StatsBanner";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FoodGallery preview />
      <Occasions />
      <StatsBanner />
      <HowItWorks />
      <Testimonials />
      <Faq />
    </>
  );
}
