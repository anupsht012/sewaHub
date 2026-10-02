import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookServiceModal from "@/components/shared/BookServiceModal";
import { getCurrentUser } from "@/lib/auth/get-user";
import Link from "next/link";
import LoginToBookButton from "@/components/shared/LogintoBookBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  MessageSquareText,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { customer: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      provider: {
        include: {
          user: { select: { name: true, image: true } },
          services: { where: { id: { not: id } }, take: 3 }, // only 3 related
        },
      },
    },
  });

  if (!service) notFound();

  const isProvider = (user as any)?.role === "PROVIDER" ||!!(user as any)?.provider;
  const averageRating = service.reviews.length > 0
  ? (service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length).toFixed(1)
    : null;
  const hasImage =!!(service as any).image;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* NAV */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Services
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT - 2/3 */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              {/* OPTIONAL IMAGE HEADER */}
              {hasImage? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(service as any).image} alt={service.name} className="h-64 sm:h-80 w-full object-cover" />
              ) : (
                <div className="h-48 sm:h-56 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                  <div className="text-center"><ImageIcon className="mx-auto h-10 w-10 mb-1" /><p className="text-xs">No image provided</p></div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 text-xs mb-3">
                      <Sparkles className="h-3 w-3 mr-1" /> {service.category || "Service"}
                    </Badge>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{service.name}</h1>
                  </div>
                  <div className="shrink-0 rounded-xl bg-slate-900 px-5 py-3 text-white">
                    <span className="text- uppercase tracking-wider text-slate-400 block">Standard Rate</span>
                    <span className="text-xl font-black">Rs. {service.price}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3.5 border">
                  {averageRating? (
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <span className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 text-xs text-amber-800"><Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />{averageRating}</span>
                      <span className="text-xs font-medium text-slate-500">{service.reviews.length} review{service.reviews.length>1?"s":""}</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-slate-400"><Star className="h-4 w-4 text-slate-300" /> No reviews yet</span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{service.provider.location || "Nepal"}</span>
                </div>

                <div className="mt-8 border-t pt-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">About this service</h2>
                  {/* FULL DESCRIPTION - NOT CUT */}
                  <p className="whitespace-pre-line break-words text-sm sm:text- leading-relaxed text-slate-600">
                    {service.description || "No description provided for this service."}
                  </p>
                </div>
              </div>
            </Card>

            {/* REVIEWS */}
            <Card className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center gap-2"><MessageSquareText className="h-5 w-5 text-blue-600" /><h2 className="text-base font-bold">Customer Feedback</h2></div>
                <Badge variant="outline" className="text-xs">{service.reviews.length} Total</Badge>
              </div>
              {service.reviews.length === 0? (
                <div className="rounded-xl border border-dashed p-8 text-center bg-slate-50/50">
                  <Star className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm font-medium">No reviews yet</p>
                  <p className="text-xs text-slate-400 mt-1">Be the first to book and review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {service.reviews.map((review: any) => (
                    <div key={review.id} className="rounded-xl border bg-slate-50/50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border"><AvatarFallback className="bg-blue-600 text-white text-xs">{review.customer.name?.[0]?.toUpperCase() || "C"}</AvatarFallback></Avatar>
                          <div><p className="text-xs font-bold">{review.customer.name}</p><span className="text- text-slate-400">Verified Customer</span></div>
                        </div>
                        <div className="flex gap-0.5 rounded-md bg-amber-50 px-2 py-0.5 border">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 break-words">{review.comment || "No written review."}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <Card className="rounded-2xl border bg-white p-6 shadow-sm">
                <CardHeader className="p-0 mb-5">
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    Service Provider
                    {service.provider.verified? <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-"><BadgeCheck className="h-3.5 w-3.5 mr-1" /> Verified</Badge> : <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-">Pending</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-5">
                  <div className="flex items-center gap-3.5">
                    <Avatar className="h-12 w-12 border ring-2 ring-slate-50"><AvatarImage src={service.provider.user.image || ""} /><AvatarFallback className="bg-blue-600 text-white">{service.provider.user.name[0]}</AvatarFallback></Avatar>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-sm truncate">{service.provider.user.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /><span className="truncate">{service.provider.location}</span></div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Guaranteed quality</div>
                    <div className="flex gap-2"><Clock className="h-4 w-4 text-blue-600" /> Fast response</div>
                  </div>

                  <div className="border-t pt-5">
                    {!user? (
                      // Public view - redirect to login with callback
                      <LoginToBookButton callbackUrl={`/services/${service.id}`} />
                    ) : isProvider? (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2 text-amber-800"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><p className="text-xs font-medium">Provider accounts cannot book services.</p></div>
                    ) : (
                      <BookServiceModal serviceId={service.id} serviceName={service.name} />
                    )}
                    <p className="mt-3 text- text-center text-slate-400">Public viewing • Login required to book</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {service.provider.services.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h2 className="text-lg font-bold mb-5">More from {service.provider.user.name}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {service.provider.services.map((item: any) => (
                <Link key={item.id} href={`/services/${item.id}`} className="group rounded-2xl border bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex justify-between gap-2"><h3 className="font-bold text-sm line-clamp-1 group-hover:text-blue-600">{item.name}</h3><span className="text-xs font-bold text-blue-600">Rs. {item.price}</span></div>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 break-words">{item.description || "No description"}</p>
                  <div className="mt-3 flex items-center text-xs font-semibold text-blue-600">View Details <ChevronRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" /></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}