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
  Filter,
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

interface PageProps {
  searchParams: Promise<{
    service?: string;
    category?: string;
    location?: string;
    sortBy?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 9;

export default async function ServicesPage({ searchParams }: PageProps) {
  const {
    service = "",
    category = "",
    location = "",
    sortBy = "newest",
    page = "1",
  } = await searchParams;

  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Dynamic sorting configuration
  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  if (sortBy === "price_desc") orderBy = { price: "desc" };

  // Fetch dynamic categories from DB
  const categoriesRaw = await prisma.service.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
    where: {
      category: {
        not: undefined,
      },
    },
  });

  const SERVICE_CATEGORIES = categoriesRaw
    .map((item) => item.category)
    .filter((cat): cat is string => Boolean(cat));

  // Fetch total matching services for pagination
  const totalServices = await prisma.service.count({
    where: {
      AND: [
        service
          ? {
              name: {
                contains: service,
                mode: "insensitive",
              },
            }
          : {},
        category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},
        location
          ? {
              provider: {
                location: {
                  contains: location,
                  mode: "insensitive",
                },
              },
            }
          : {},
      ],
    },
  });

  // Fetch paginated results
  const services = await prisma.service.findMany({
    where: {
      ...(service && {
        name: {
          contains: service,
          mode: "insensitive",
        },
      }),
      ...(category && {
        category: {
          equals: category,
          mode: "insensitive",
        },
      }),
      ...(location && {
        provider: {
          location: {
            contains: location,
            mode: "insensitive",
          },
        },
      }),
    },
    include: {
      provider: {
        include: {
          user: true,
        },
      },
      reviews: true,
    },
    orderBy,
    skip,
    take: ITEMS_PER_PAGE,
  });

  const totalPages = Math.ceil(totalServices / ITEMS_PER_PAGE);

  // Desktop Sidebar Filter Form
  const FilterSidebar = () => (
    <form method="GET" className="space-y-6">
      {/* Service Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Service Keyword
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            name="service"
            defaultValue={service}
            placeholder="Search service..."
            className="h-11 rounded-xl bg-slate-50/80 border-slate-200 pl-10 text-sm focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Dynamic Service Category Select Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Category
        </label>
        <div className="relative">
          <Grid className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            name="category"
            defaultValue={category}
            className="w-full h-11 rounded-xl bg-slate-50/80 border border-slate-200 pl-10 pr-4 text-sm text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
          >
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            name="location"
            defaultValue={location}
            placeholder="City or District..."
            className="h-11 rounded-xl bg-slate-50/80 border-slate-200 pl-10 text-sm focus:bg-white transition-all"
          />
        </div>
      </div>

      {sortBy && <input type="hidden" name="sortBy" value={sortBy} />}

      <div className="pt-2 space-y-2">
        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/10 transition-all"
        >
          Apply Filters
        </Button>

        {(service || category || location) && (
          <Link href="/services" className="block">
            <Button
              type="button"
              variant="ghost"
              className="w-full h-10 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <X className="h-4 w-4 mr-1.5" /> Clear All
            </Button>
          </Link>
        )}
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO HEADER */}
      <div className="border-b border-slate-200/80 bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                  <Sparkles className="h-3 w-3" /> Marketplace
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {service || category || location ? "Search Results" : "Explore Top Services"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Book verified professionals and trusted local service providers across Nepal.
              </p>
            </div>

            {/* TOP ACTIONS BAR */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Mobile Filter Drawer Button */}
              <div className="lg:hidden">
                <MobileFilterSheet
                  service={service}
                  category={category}
                  location={location}
                  sortBy={sortBy}
                  categories={SERVICE_CATEGORIES}
                />
              </div>

              {/* Sort Selector Form */}
              <form method="GET" className="flex items-center gap-2">
                {service && <input type="hidden" name="service" value={service} />}
                {category && <input type="hidden" name="category" value={category} />}
                {location && <input type="hidden" name="location" value={location} />}
                
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-2xs focus-within:ring-2 focus-within:ring-blue-500">
                  <ArrowUpDown className="h-4 w-4 text-slate-400 mr-2" />
                  <select
                    name="sortBy"
                    defaultValue={sortBy}
                    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer pr-1"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg ml-1"
                  >
                    Sort
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Filter
                </h2>
                {(service || category || location) && (
                  <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 bg-blue-50">
                    Active Filters
                  </Badge>
                )}
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* MAIN LISTINGS SECTION */}
          <main className="lg:col-span-3">
            
            {/* Active Filters Display Chips */}
            {(service || category || location) && (
              <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <span className="text-xs font-medium text-slate-500 mr-1">Active:</span>
                
                {service && (
                  <Badge variant="secondary" className="rounded-lg bg-white text-blue-700 border border-blue-200 px-2.5 py-1 text-xs shadow-2xs flex items-center gap-1.5">
                    Service: <span className="font-bold">{service}</span>
                  </Badge>
                )}

                {category && (
                  <Badge variant="secondary" className="rounded-lg bg-white text-blue-700 border border-blue-200 px-2.5 py-1 text-xs shadow-2xs flex items-center gap-1.5">
                    Category: <span className="font-bold">{category}</span>
                  </Badge>
                )}

                {location && (
                  <Badge variant="secondary" className="rounded-lg bg-white text-blue-700 border border-blue-200 px-2.5 py-1 text-xs shadow-2xs flex items-center gap-1.5">
                    Location: <span className="font-bold">{location}</span>
                  </Badge>
                )}

                <Link href="/services" className="ml-auto text-xs font-semibold text-blue-600 hover:underline">
                  Clear All
                </Link>
              </div>
            )}

            {/* EMPTY STATE */}
            {services.length === 0 ? (
              <Card className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
                <CardContent className="p-0">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                    <Search className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">No Services Found</h2>
                  <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                    We couldn't find any provider matching your specified criteria. Try clearing or expanding your search filters.
                  </p>
                  <Link href="/services">
                    <Button className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium">
                      Reset All Filters
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* 3 CARDS PER ROW GRID */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((serv: any) => {
                    const averageRating =
                      serv.reviews.length > 0
                        ? (
                            serv.reviews.reduce(
                              (sum: number, review: any) => sum + review.rating,
                              0
                            ) / serv.reviews.length
                          ).toFixed(1)
                        : null;

                    const providerUser = serv.provider?.user;

                    return (
                      <Card
                        key={serv.id}
                        className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
                      >
                        <CardContent className="flex flex-1 flex-col p-5">
                          
                          {/* Top Title & Price Tag */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h2 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {serv.name}
                              </h2>
                              {serv.category && (
                                <span className="inline-block mt-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                  {serv.category}
                                </span>
                              )}
                            </div>
                            <span className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white shadow-2xs">
                              Rs. {serv.price}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="mt-2.5 line-clamp-2.5 text-xs text-slate-500 leading-relaxed flex-1">
                            {serv.description ||
                              "Professional and reliable service offered by verified local experts."}
                          </p>

                          <div className="my-4 border-t border-slate-100" />

                          {/* Provider Profile Info */}
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-slate-200 ring-2 ring-slate-50">
                              <AvatarImage
                                src={providerUser?.image || ""}
                                alt={providerUser?.name || "Provider"}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs">
                                {providerUser?.name?.[0]?.toUpperCase() || "P"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-xs font-bold text-slate-800">
                                  {providerUser?.name}
                                </span>
                                {serv.provider?.verified && (
                                  <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500 fill-emerald-50" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="truncate">{serv.provider?.location || "Nepal"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Ratings Tag */}
                          <div className="mt-4 flex items-center justify-between text-xs">
                            {averageRating ? (
                              <div className="flex items-center gap-1 rounded-lg bg-amber-50/80 px-2.5 py-1 font-bold text-amber-800 border border-amber-200/60">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span>{averageRating}</span>
                                <span className="text-amber-600/80 font-normal text-[11px]">
                                  ({serv.reviews.length})
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium text-[11px]">
                                No reviews yet
                              </span>
                            )}
                          </div>

                          {/* Action Button */}
                          <Link href={`/services/${serv.id}`} className="mt-5 block">
                            <Button className="w-full cursor-pointer h-10 rounded-xl bg-slate-900 font-medium text-xs hover:bg-blue-400 transition-colors shadow-xs">
                              Book Service
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                      Showing Page <span className="font-bold text-slate-900">{currentPage}</span> of{" "}
                      <span className="font-bold text-slate-900">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-2">
                      <Link
                        href={{
                          pathname: "/services",
                          query: {
                            ...(service ? { service } : {}),
                            ...(category ? { category } : {}),
                            ...(location ? { location } : {}),
                            ...(sortBy ? { sortBy } : {}),
                            page: currentPage - 1,
                          },
                        }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-40" : ""}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage <= 1}
                          className="rounded-xl border-slate-200 text-slate-700"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                      </Link>

                      <Link
                        href={{
                          pathname: "/services",
                          query: {
                            ...(service ? { service } : {}),
                            ...(category ? { category } : {}),
                            ...(location ? { location } : {}),
                            ...(sortBy ? { sortBy } : {}),
                            page: currentPage + 1,
                          },
                        }}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-40" : ""}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage >= totalPages}
                          className="rounded-xl border-slate-200 text-slate-700"
                        >
                          Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
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