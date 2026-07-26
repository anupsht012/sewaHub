"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProviderBookings() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  async function loadBookings() {

    const res = await fetch("/api/provider/bookings");

    const data = await res.json();

    setBookings(data);

  }


  useEffect(() => {

    loadBookings();

  }, []);



  async function updateStatus(
    id: string,
    status:
      | "ACCEPTED"
      | "REJECTED"
      | "COMPLETED"
  ) {

    setLoading(true);


    await fetch(`/api/provider/bookings/${id}`, {

      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),

    });


    await loadBookings();


    setLoading(false);

  }



  if (bookings.length === 0) {

    return (
      <p className="mt-5 text-gray-500">
        No booking requests yet.
      </p>
    );

  }



  return (

    <div className="mt-6 space-y-4">


      {bookings?.map((booking) => (

        <div
          key={booking.id}
          className="rounded-xl border p-5"
        >


          <div className="flex justify-between">


            <div>

              <h3 className="font-bold">
                {booking.service.name}
              </h3>


              <p>
                Customer: {booking.customer.name}
              </p>


              <p>
                Phone: {booking.phone}
              </p>


              <p>
                Address: {booking.address}
              </p>


              <p>
                Date:{" "}
                {new Date(
                  booking.bookingDate
                ).toLocaleDateString()}
              </p>


            </div>



            <span
              className={`h-fit rounded-full px-3 py-1 ${
                booking.status === "ACCEPTED"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "COMPLETED"
                  ? "bg-blue-100 text-blue-700"
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




          {booking.status === "PENDING" && (

            <div className="mt-5 flex gap-3">


              <Button
                disabled={loading}
                onClick={() =>
                  updateStatus(
                    booking.id,
                    "ACCEPTED"
                  )
                }
              >
                Accept
              </Button>



              <Button
                variant="destructive"
                disabled={loading}
                onClick={() =>
                  updateStatus(
                    booking.id,
                    "REJECTED"
                  )
                }
              >
                Reject
              </Button>


            </div>

          )}




          {booking.status === "ACCEPTED" && (

            <div className="mt-5 flex justify-end">

              <Button
                disabled={loading}
                onClick={() =>
                  updateStatus(
                    booking.id,
                    "COMPLETED"
                  )
                }
              >
                Mark as Completed
              </Button>

            </div>

          )}



        </div>

      ))}


    </div>

  );

}