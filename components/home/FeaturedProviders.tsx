import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { MapPin, BadgeCheck, Briefcase, Star, Tags, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0; // ✅ forces fresh random on every refresh

export default async function FeaturedProviders() {
  // ✅ Get IDs only - fast
  const allIds = await prisma.provider.findMany({
    where: { services: { some: {} } },
    select: { id: true },
  });

  // ✅ Shuffle 3 random IDs every refresh
  const randomIds = allIds
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((p) => p.id);

  const providersRaw = randomIds.length
    ? await prisma.provider.findMany({
        where: { id: { in: randomIds } },
        include: {
          user: { select: { name: true, image: true } },
          services: {
            select: {
              id: true,
              name: true,
              image: true,
              reviews: { select: { rating: true } },
            },
            take: 4,
          },
        },
      })
    : [];

  // Keep the random order, not DB order
  const providers = randomIds
    .map((id) => providersRaw.find((p) => p.id === id)!)
    .filter(Boolean);

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Featured Providers</h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">Trusted professionals near you.</p>
        </div>

        {providers.length === 0? (
          <div className="rounded-3xl bg-gray-50 p-8 sm:p-10 text-center border border-dashed">
            <h3 className="text-lg sm:text-xl font-bold">No providers yet</h3>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">Providers will appear here after they add services.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => {
                const reviews = provider.services.flatMap((s) => s.reviews);
                const avg = reviews.length > 0? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
                const rating = avg? avg.toFixed(1) : null;
                const coverImage = provider.coverImage ; 

                return (
                  <Link
                    key={provider.id}
                    href={`/services?providerId=${provider.id}`}
                    className="group flex flex-col overflow-hidden rounded-3xl bg-white border shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300"
                  >
                    <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                      {coverImage? (
                        <Image
                          src={coverImage}
                          alt={provider.user.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                          <Tags className="h-8 w-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {provider.verified && (
                        <span className="absolute top-3 left-3 rounded-full bg-emerald-500 px-2.5 py-1 text- font-bold text-white flex items-center gap-1 shadow-sm">
                          <BadgeCheck size={12} /> VERIFIED
                        </span>
                      )}
                      {rating && (
                        <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text- font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                          <Star size={12} className="fill-amber-400 text-amber-400" /> {rating}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col p-5 sm:p-6 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-100">
                          {provider.user.image? (
                            <Image src={provider.user.image} alt={provider.user.name} fill className="object-cover" sizes="64px" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-blue-600 text-xl font-bold text-white">
                              {provider.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text- sm:text- font-bold truncate group-hover:text-blue-600 transition-colors">
                              {provider.user.name}
                            </h3>
                            {provider.verified && <BadgeCheck size={18} className="text-emerald-500 shrink-0" />}
                          </div>
                          <p className={`text- font-semibold mt-0.5 ${provider.verified? "text-emerald-600" : "text-slate-500"}`}>
                            {provider.verified? "Verified" : "New"} • {provider.services.length} services
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2 text- text-gray-600">
                        <p className="flex items-center gap-2 truncate">
                          <MapPin size={14} className="shrink-0 text-slate-400" /> {provider.location}
                        </p>
                        <p className="flex items-center gap-2 truncate">
                          <Tags size={14} className="shrink-0 text-slate-400" /> {provider.category || "General Services"}
                        </p>
                        <p className="flex items-center gap-2">
                          <Briefcase size={14} className="shrink-0 text-slate-400" /> {provider.services.length} Services • {reviews.length} reviews
                        </p>
                      </div>

                      {provider.bio && <p className="mt-4 line-clamp-2 text- leading-relaxed text-gray-500">{provider.bio}</p>}

                      {provider.services.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {provider.services.slice(0, 2).map((s) => (
                            <span key={s.id} className="rounded-full bg-slate-100 px-2.5 py-1 text- font-semibold text-slate-600">
                              {s.name}
                            </span>
                          ))}
                          {provider.services.length > 2 && (
                            <span className="rounded-full bg-slate-900 px-2.5 py-1 text- font-semibold text-white">
                              +{provider.services.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto pt-5">
                        <Button className="w-full cursor-pointer rounded-xl h-10 bg-slate-900 group-hover:bg-blue-600 transition-colors text-white font-semibold">
                          View Services
                        </Button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="/services">
                <Button variant="outline" className="rounded-full px-6 h-11 gap-2">
                  View All Provider Services <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}