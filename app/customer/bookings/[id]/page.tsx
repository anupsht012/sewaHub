import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import Link from "next/link";
import CancelBookingButton from "@/components/CancelBookingButton";
import ReviewModal from "@/components/ReviewModal";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}



export default async function BookingDetailsPage({
  params,
}: PageProps) {


  const user = await getCurrentUser();


  if (!user) {
    redirect("/login");
  }



  const { id } = await params;



  const booking = await prisma.booking.findFirst({

    where: {
      id,
      customerId: user.id,
    },


    include: {

      service: {

        include: {

          provider: {

            include: {
              user: true,
            },

          },

        },

      },

    },

  });



  if (!booking) {
    notFound();
  }





  return (

    <div className="min-h-screen bg-gray-50 p-10">


      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">


        <Link
          href="/dashboard"
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>





        {/* Header */}

        <div className="mt-6 flex justify-between gap-5">



          <div>


            <h1 className="text-3xl font-bold">
              {booking.service.name}
            </h1>


            <p className="mt-3 text-gray-600">
              {booking.service.description}
            </p>


          </div>





          <div className="flex flex-col items-end gap-3">


            <span
              className={`h-fit rounded-full px-4 py-2 ${
                booking.status === "ACCEPTED"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : booking.status === "CANCELLED"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.status}
            </span>




           



          </div>



        </div>







        {/* Booking Information */}

        <div className="mt-8 space-y-3 rounded-xl border p-5">


          <h2 className="text-xl font-bold">
            Booking Information
          </h2>



          <p>
            Price: Rs. {booking.service.price}
          </p>



          <p>
            Booking Date:{" "}
            {new Date(
              booking.bookingDate
            ).toLocaleDateString()}
          </p>



          <p>
            Phone: {booking.phone}
          </p>



          <p>
            Address: {booking.address}
          </p>



          <p>
            Note: {booking.note || "No note"}
          </p>



        </div>








        {/* Provider Details */}

        <div className="mt-6 rounded-xl border p-5">


          <h2 className="text-xl font-bold">
            Provider Details
          </h2>



          <p className="mt-3">
            Name: {booking.service.provider.user.name}
          </p>



          <p>
            Location: {booking.service.provider.location}
          </p>





          {booking.service.provider.verified ? (

            <p className="mt-3 text-green-600">
              ✅ Verified Provider
            </p>

          ) : (

            <p className="mt-3 text-yellow-600">
              Pending Verification
            </p>

          )}



        </div>


{booking.status === "PENDING" && (
  <div className="mt-6 flex justify-end">

    <CancelBookingButton
      bookingId={booking.id}
    />

  </div>
)}
{booking.status === "COMPLETED" && (
  <div className="mt-6 flex justify-end">

    <ReviewModal
      serviceId={booking.service.id}
    />

  </div>
)}


      </div>


    </div>

  );

}