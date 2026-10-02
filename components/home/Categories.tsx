"use client";

import { Wrench, Paintbrush, Sparkles, GraduationCap, Hammer, Droplets } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";

const categories = [
  { title: "Electrician", search: "electrician", icon: Sparkles, color: "bg-yellow-100 text-yellow-600" },
  { title: "Plumber", search: "plumber", icon: Droplets, color: "bg-blue-100 text-blue-600" },
  { title: "Painter", search: "painter", icon: Paintbrush, color: "bg-pink-100 text-pink-600" },
  { title: "Tutor", search: "tutor", icon: GraduationCap, color: "bg-green-100 text-green-600" },
  { title: "Carpenter", search: "carpenter", icon: Hammer, color: "bg-orange-100 text-orange-600" },
  { title: "Cleaner", search: "cleaner", icon: Wrench, color: "bg-purple-100 text-purple-600" },
];

export default function Categories() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const autoplay = Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true });

  function handleCategoryClick(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("service", category);
    router.push(`/services?${params.toString()}`);
  }

  return (
    <section className="bg-gray-50 py-14 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Popular Service Categories</h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">Choose from Nepal's trusted local professionals — tap to explore.</p>
        </div>

        <Carousel plugins={[autoplay]} opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <CarouselItem key={category.title} className="pl-3 basis-[46%] sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <Card onClick={() => handleCategoryClick(category.search)} className="cursor-pointer border-0 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl rounded-2xl h-full">
                    <CardContent className="p-5 sm:p-6 text-center">
                      <div className={`mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl ${category.color}`}>
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                      </div>
                      <h3 className="mt-4 sm:mt-5 font-semibold text- sm:text-base">{category.title}</h3>
                      <p className="mt-1.5 text-xs sm:text-sm text-gray-500">Find professionals</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}