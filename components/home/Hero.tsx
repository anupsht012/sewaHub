"use client";

import { Search, MapPin, ShieldCheck, Star, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {

  const router = useRouter();

  const [service, setService] = useState("");
  const [location, setLocation] = useState("");



  function handleSearch() {

    const params = new URLSearchParams();


    if (service) {
      params.append("service", service);
    }


    if (location) {
      params.append("location", location);
    }


    router.push(`/services?${params.toString()}`);

  }





  return (

<section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white">

      <div className="container mx-auto px-6 py-24 lg:py-8">


        <div className="max-w-3xl">


          <div className="inline-flex rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">

            🇳🇵 Nepal's Trusted Service Marketplace

          </div>





          <h1 className="mt-6 text-5xl font-extrabold leading-tight lg:text-7xl">

            Find Trusted

            <span className="block text-yellow-300">
              Local Professionals
            </span>

            Near You

          </h1>





          <p className="mt-6 max-w-2xl text-lg text-blue-100">

            Book verified electricians, plumbers, tutors,
            cleaners, painters, carpenters and more—all
            in one trusted platform.

          </p>







          {/* Search Box */}


          <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-2xl md:flex-row">





            <div className="relative flex-1">

              <Search
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              />


              <Input

                value={service}

                onChange={(e)=>
                  setService(e.target.value)
                }

                placeholder="What service do you need?"

                className="h-12 border-0 pl-10 text-black"

              />


            </div>








            <div className="relative flex-1">


              <MapPin
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              />


              <Input

                value={location}

                onChange={(e)=>
                  setLocation(e.target.value)
                }

                placeholder="Your location"

                className="h-12 border-0 pl-10 text-black"

              />


            </div>







            <Button

              size="lg"

              onClick={handleSearch}

              className="h-12 px-8"

            >

              Search

            </Button>





          </div>









          {/* Trust Features */}


          <div className="mt-10 grid gap-4 sm:grid-cols-2">





            <div className="flex items-center gap-2 text-blue-100">

              <ShieldCheck className="h-5 w-5 text-yellow-300"/>

              Verified Professionals

            </div>





            <div className="flex items-center gap-2 text-blue-100">

              <Star className="h-5 w-5 text-yellow-300"/>

              Customer Ratings

            </div>





            <div className="flex items-center gap-2 text-blue-100">

              <Zap className="h-5 w-5 text-yellow-300"/>

              Fast Booking

            </div>





            <div className="flex items-center gap-2 text-blue-100">

              <CreditCard className="h-5 w-5 text-yellow-300"/>

              Secure Payments

            </div>




          </div>





        </div>


      </div>


    </section>

  );

}