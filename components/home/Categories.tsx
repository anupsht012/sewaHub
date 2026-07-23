"use client";

import {
  Wrench,
  Paintbrush,
  Sparkles,
  GraduationCap,
  Hammer,
  Droplets,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";

import { useRouter } from "next/navigation";

import Autoplay from "embla-carousel-autoplay";



const categories = [

  {
    title: "Electrician",
    search: "electrician",
    icon: Sparkles,
    color: "bg-yellow-100 text-yellow-600",
  },

  {
    title: "Plumber",
    search: "plumber",
    icon: Droplets,
    color: "bg-blue-100 text-blue-600",
  },

  {
    title: "Painter",
    search: "painter",
    icon: Paintbrush,
    color: "bg-pink-100 text-pink-600",
  },

  {
    title: "Tutor",
    search: "tutor",
    icon: GraduationCap,
    color: "bg-green-100 text-green-600",
  },

  {
    title: "Carpenter",
    search: "carpenter",
    icon: Hammer,
    color: "bg-orange-100 text-orange-600",
  },

  {
    title: "Cleaner",
    search: "cleaner",
    icon: Wrench,
    color: "bg-purple-100 text-purple-600",
  },

];




export default function Categories() {


  const router = useRouter();



  const autoplay = Autoplay({

    delay: 2500,

    stopOnInteraction: false,

    stopOnMouseEnter: true,

  });





  function handleCategoryClick(category:string){


    router.push(
      `/services?service=${category}`
    );


  }





  return (

    <section className="bg-gray-50 py-16">


      <div className="container mx-auto px-6">



        <div className="mb-10 text-center">


          <h2 className="text-4xl font-bold">

            Popular Service Categories

          </h2>



          <p className="mt-3 text-gray-600">

            Choose from Nepal's trusted local professionals.

          </p>


        </div>








        <Carousel

          plugins={[autoplay]}

          opts={{

            align: "start",

            loop: true,

          }}

          className="w-full"

        >




          <CarouselContent>



            {categories?.map((category)=>{


              const Icon = category.icon;




              return (


                <CarouselItem

                  key={category.title}

                  className="
                    basis-1/2
                    sm:basis-1/3
                    md:basis-1/4
                    lg:basis-1/6
                  "

                >




                  <Card

                    onClick={() =>
                      handleCategoryClick(
                        category.search
                      )
                    }


                    className="
                      cursor-pointer
                      transition-all
                      hover:-translate-y-2
                      hover:shadow-xl
                    "

                  >



                    <CardContent className="p-6 text-center">





                      <div

                        className={`
                          mx-auto
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-2xl
                          ${category.color}
                        `}

                      >

                        <Icon className="h-8 w-8"/>

                      </div>






                      <h3 className="mt-5 font-semibold">

                        {category.title}

                      </h3>







                      <p className="mt-2 text-sm text-gray-500">

                        Find professionals

                      </p>





                    </CardContent>


                  </Card>




                </CarouselItem>


              );


            })}




          </CarouselContent>





          <CarouselPrevious />

          <CarouselNext />



        </Carousel>




      </div>


    </section>


  );

}