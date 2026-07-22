import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProviders from "@/components/home/FeaturedProviders";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";  
import HowItWorks from "@/components/home/HowItWorks";
export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Categories />
      <FeaturedProviders />
      <HowItWorks/>
      <Testimonials />
      <CTA />
    </div>
  );
}