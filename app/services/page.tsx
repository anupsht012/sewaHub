import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  MapPin,
  Star,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Grid,
} from "lucide-react";
import { MobileFilterSheet } from "@/components/shared/MobileFilterSheet";
import Image from "next/image";

interface PageProps {
  searchParams: Promise<{
    service?: string;
    category?: string;
    location?: string;
    providerId?: string;
    sortBy?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 9;
export const dynamic = "force-dynamic";

export default async function ServicesPage({ searchParams }: PageProps) {
  const {
    service = "",
    category = "",
    location = "",
    providerId = "",
    sortBy = "newest",
    page = "1",
  } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  if (sortBy === "price_desc") orderBy = { price: "desc" };

  // ✅ FIX 1: Show ALL - removed verified:true
  const where: any = {
   ...(service && { name: { contains: service, mode: "insensitive" } }),
   ...(category && { category: { equals: category, mode: "insensitive" } }),
    provider: {
     ...(providerId && { id: providerId }),
     ...(location && { location: { contains: location, mode: "insensitive" } }),
    },
  };

  const [categoriesRaw, providerData, totalServices, services] = await Promise.all([
    prisma.service.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { category: { not: null } },
    }),
    providerId
     ? prisma.provider.findUnique({
          where: { id: providerId },
          select: { user: { select: { name: true } } },
        })
      : null,
    prisma.service.count({ where }),
    prisma.service.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        image: true,
        createdAt: true,
        provider: {
          select: {
            id: true,
            location: true,
            verified: true,
            user: { select: { name: true, image: true } },
          },
        },
        reviews: { select: { rating: true } },
      },
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const SERVICE_CATEGORIES = categoriesRaw.map((i) => i.category!).filter(Boolean);
  const providerName = providerData?.user.name || "";
  const totalPages = Math.ceil(totalServices / ITEMS_PER_PAGE);

  const buildQuery = (overrides: any = {}) => {
    const q: any = {};
    if (service) q.service = service;
    if (category) q.category = category;
    if (location) q.location = location;
    if (providerId) q.providerId = providerId;
    if (sortBy) q.sortBy = sortBy;
    return {...q,...overrides };
  };

  const FilterSidebar = () => (
    <form method="GET" className="space-y-5">
      <input type="hidden" name="page" value="1" />
      {providerId && <input type="hidden" name="providerId" value={providerId} />}
      <input type="hidden" name="sortBy" value={sortBy} />

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Keyword</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input name="service" defaultValue={service} placeholder="e.g. electrician, tutor" className="h-11 rounded-xl bg-slate-50 border-slate-200 pl-10 text-sm focus:bg-white text-gray-900 placeholder:text-gray-400" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
        <div className="relative">
          <Grid className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <select name="category" defaultValue={category} className="w-full h-11 rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none">
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input name="location" defaultValue={location} placeholder="Kathmandu, Pokhara..." className="h-11 rounded-xl bg-slate-50 border-slate-200 pl-10 text-sm focus:bg-white text-gray-900 placeholder:text-gray-400" />
        </div>
      </div>

      <div className="pt-2 space-y-2">
        <Button type="submit" className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-medium">Apply Filters</Button>
        {(service || category || location || providerId) && (
          <Link href="/services" className="block">
            <Button type="button" variant="ghost" className="w-full h-10 rounded-xl text-slate-600">
              <X className="h-4 w-4 mr-1.5" /> Clear All
            </Button>
          </Link>
        )}
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                <Sparkles className="h-3 w-3" /> Marketplace
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {providerId? `${providerName || "Provider"} Services` : service || category || location? "Search Results" : "Explore Top Services"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {totalServices} {totalServices === 1? "service" : "services"} found • All providers
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <MobileFilterSheet service={service} category={category} location={location} sortBy={sortBy} categories={SERVICE_CATEGORIES} />
              </div>
              {/* ✅ FIX 2: Sort with Link - no form submit, no full reload flicker */}
              <div className="flex items-center rounded-xl border bg-white px-3 py-2 gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <Link href={{ pathname: "/services", query: buildQuery({ sortBy: "newest", page: 1 }) }} className={`text-xs font-bold px-2 py-1 rounded ${sortBy==="newest"? "bg-slate-900 text-white" : "text-slate-600"}`}>Newest</Link>
                <Link href={{ pathname: "/services", query: buildQuery({ sortBy: "price_asc", page: 1 }) }} className={`text-xs font-bold px-2 py-1 rounded ${sortBy==="price_asc"? "bg-slate-900 text-white" : "text-slate-600"}`}>Low</Link>
                <Link href={{ pathname: "/services", query: buildQuery({ sortBy: "price_desc", page: 1 }) }} className={`text-xs font-bold px-2 py-1 rounded ${sortBy==="price_desc"? "bg-slate-900 text-white" : "text-slate-600"}`}>High</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-4 border-b">
                <h2 className="text-base font-bold flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-blue-600" /> Filter</h2>
                {(service || category || location || providerId) && <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Active</Badge>}
              </div>
              <FilterSidebar />
            </div>
          </aside>

          <main className="lg:col-span-3">
            {(service || category || location || providerId) && (
              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <span className="text-xs font-medium text-slate-500 mr-1">Filters:</span>
                {service && <Badge className="bg-white text-blue-700 border">Service: {service}</Badge>}
                {category && <Badge className="bg-white text-blue-700 border">Category: {category}</Badge>}
                {location && <Badge className="bg-white text-blue-700 border">Location: {location}</Badge>}
                {providerId && <Badge className="bg-white text-blue-700 border">Provider: {providerName}</Badge>}
                <Link href="/services" className="ml-auto text-xs font-semibold text-blue-600 hover:underline">Clear All</Link>
              </div>
            )}

            {services.length === 0? (
              <Card className="rounded-2xl p-12 text-center">
                <CardContent className="p-0">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4"><Search className="h-8 w-8" /></div>
                  <h2 className="text-xl font-bold">No Services Found</h2>
                  <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">No provider matches your filters. Try clearing filters to see all services.</p>
                  <Link href="/services"><Button className="mt-6 rounded-xl bg-blue-600">Reset Filters</Button></Link>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((serv: any) => {
                    const averageRating =
                      serv.reviews.length > 0
                       ? (serv.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / serv.reviews.length).toFixed(1)
                        : null;
                    const providerUser = serv.provider?.user;

                    return (
                      <Card key={serv.id} className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                          {serv.image? (
                            <Image src={serv.image} alt={serv.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400"><Grid className="h-8 w-8" /></div>
                          )}
                          <span className="absolute top-3 right-3 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">Rs. {serv.price}</span>
                          {serv.provider?.verified && <span className="absolute top-3 left-3 rounded-full bg-emerald-500 px-2.5 py-1 text- font-bold text-white">VERIFIED</span>}
                        </div>

                        <CardContent className="flex flex-1 flex-col p-5">
                          <h2 className="font-bold line-clamp-1 group-hover:text-blue-600">{serv.name}</h2>
                          {serv.category && <span className="mt-1 w-fit rounded-md bg-slate-100 px-2 py-0.5 text- font-semibold text-slate-600">{serv.category}</span>}

                          <p className="mt-2.5 text-xs text-slate-500 leading-relaxed line-clamp-2">{serv.description || "Professional service by experts."}</p>

                          <div className="my-4 border-t border-slate-100" />

                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={providerUser?.image || ""} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs">{providerUser?.name?.[0]?.toUpperCase() || "P"}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-xs font-bold text-slate-800">{providerUser?.name}</span>
                                {serv.provider?.verified && <BadgeCheck className="h-4 w-4 text-emerald-500 fill-emerald-50" />}
                              </div>
                              <div className="flex items-center gap-1 text- text-slate-500 mt-0.5"><MapPin className="h-3 w-3" /><span className="truncate">{serv.provider?.location || "Nepal"}</span></div>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs">
                            {averageRating? (
                              <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 font-bold text-amber-800 border border-amber-200/60"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span>{averageRating}</span><span className="font-normal text-">({serv.reviews.length})</span></div>
                            ) : (
                              <span className="text-slate-400 text-">No reviews yet</span>
                            )}
                          </div>

                          <Link href={`/services/${serv.id}`} className="mt-5 block"><Button className="w-full h-10 rounded-xl bg-slate-900 hover:bg-blue-600 text-xs">View & Book</Button></Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-between border-t pt-6">
                    <p className="text-xs text-slate-500">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-2">
                      <Link href={{ pathname: "/services", query: buildQuery({ page: currentPage - 1 }) }} className={currentPage <= 1? "pointer-events-none opacity-40" : ""}><Button variant="outline" size="sm" className="rounded-xl"><ChevronLeft className="h-4 w-4" /> Prev</Button></Link>
                      <Link href={{ pathname: "/services", query: buildQuery({ page: currentPage + 1 }) }} className={currentPage >= totalPages? "pointer-events-none opacity-40" : ""}><Button variant="outline" size="sm" className="rounded-xl">Next <ChevronRight className="h-4 w-4" /></Button></Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}