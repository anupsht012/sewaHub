import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";

export default async function Testimonials() {
  const reviews = await prisma.review.findMany({
    include: { customer: true, service: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <section className="bg-white py-14 sm:py-20 border-t">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What People Say</h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">Trusted by customers and professionals across Nepal.</p>
        </div>

        {reviews.length === 0? (
          <div className="rounded-3xl bg-gray-50 p-8 sm:p-10 text-center border border-dashed">
            <h3 className="text-lg sm:text-xl font-bold">No reviews yet</h3>
            <p className="mt-2 text-gray-500 text-sm">Customer reviews will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-3xl border bg-white p-6 sm:p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl flex flex-col">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < review.rating? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                  ))}
                </div>
                <p className="mt-4 text-gray-700 text- leading-relaxed line-clamp-4">"{review.comment || "Great service experience, highly recommended!"}"</p>
                <div className="mt-6 pt-4 border-t flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                    {review.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text- truncate">{review.customer.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">Customer • {review.service.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}