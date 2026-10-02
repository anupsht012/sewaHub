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

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (service.trim()) params.append("service", service.trim());
    if (location.trim()) params.append("location", location.trim());
    router.push(`/services?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white">
      <div className="container relative mx-auto px-4 sm:px-6 py-10">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-xs sm:text-sm font-medium backdrop-blur border border-white/20">
            🇳🇵 Nepal's Trusted Service Marketplace
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold leading-[1.1] lg:text-7xl tracking-tight">
            Find Trusted
            <span className="block text-yellow-300">Local Professionals</span>
            Near You
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-blue-100 leading-relaxed">
            Book verified electricians, plumbers, tutors, cleaners, painters, carpenters and more — all in one trusted platform.
          </p>

          {/* SEARCH BOX - FIXED VISIBILITY */}
          <form
            onSubmit={handleSearch}
            className="mt-8 sm:mt-10 flex flex-col gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-2xl md:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="What service do you need?"
                className="h-12 sm:h-14 w-full pl-11 pr-4 text- font-medium text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl shadow-none"
              />
            </div>

            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your location"
                className="h-12 sm:h-14 w-full pl-11 pr-4 text- font-medium text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl shadow-none"
              />
            </div>

            <Button type="submit" size="lg" className="h-12 sm:h-14 px-8 rounded-xl text-base font-semibold cursor-pointer shrink-0">
              Search
            </Button>
          </form>

          {/* Trust */}
          <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2.5 text-blue-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><ShieldCheck className="h-4 w-4 text-yellow-300" /></span>
              Verified Professionals
            </div>
            <div className="flex items-center gap-2.5 text-blue-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><Star className="h-4 w-4 text-yellow-300" /></span>
              Customer Ratings
            </div>
            <div className="flex items-center gap-2.5 text-blue-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><Zap className="h-4 w-4 text-yellow-300" /></span>
              Fast Booking
            </div>
            <div className="flex items-center gap-2.5 text-blue-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><CreditCard className="h-4 w-4 text-yellow-300" /></span>
              Secure Payments
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}