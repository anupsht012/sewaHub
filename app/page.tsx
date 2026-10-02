import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProviders from "@/components/home/FeaturedProviders";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import HowItWorks from "@/components/home/HowItWorks";
import { getCurrentUser } from "@/lib/auth/get-user";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  // Normalize to what components need - fixes null vs undefined issue
  const user = currentUser
   ? {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role?? undefined, // null -> undefined
      }
    : null;

  return (
    <div className="overflow-hidden bg-white">
      <Hero />
      <Categories />
      <FeaturedProviders />
      <HowItWorks user={user} />
      <Testimonials />
      <CTA user={user} />
    </div>
  );
}