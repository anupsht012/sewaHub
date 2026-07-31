"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


export default function CompleteBookingButton({
  bookingId,
  canComplete,
}: {
  bookingId: string;
  canComplete: boolean;
}) {

  const [loading, setLoading] = useState(false);


  async function handleComplete() {

    setLoading(true);

    try {

      const res = await fetch(
        `/api/provider/bookings/${bookingId}/complete`,
        {
          method: "PATCH",
        }
      );


      const data = await res.json();


      if (!res.ok) {

        throw new Error(
          data.error || "Failed"
        );

      }


      toast.success(
        "Booking completed"
      );


      window.location.reload();


    } catch(error:any) {

      toast.error(
        error.message
      );

    } finally {

      setLoading(false);

    }

  }



  return (

    <Button

      onClick={handleComplete}

      disabled={
        loading || !canComplete
      }

      className={
        canComplete
        ? "mt-4 w-full bg-blue-600 hover:bg-blue-700"
        : "mt-4 w-full cursor-not-allowed bg-gray-300 text-gray-600"
      }

    >

      {
        loading
        ? "Completing..."
        : canComplete
        ? "Mark Completed"
        : "Payment Pending"
      }

    </Button>

  );

}