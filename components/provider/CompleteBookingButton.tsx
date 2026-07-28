"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


export default function CompleteBookingButton({
  bookingId,
}: {
  bookingId: string;
}) {

  const [loading, setLoading] = useState(false);



  async function handleComplete() {

    setLoading(true);


    try {

      const res = await fetch(
        `/api/provider/bookings/${bookingId}/complete`,
        {
          method:"PATCH",
        }
      );


      const data = await res.json();


      if(!res.ok){

        throw new Error(
          data.error || "Failed"
        );

      }


      toast.success(
        "Booking completed"
      );


      window.location.reload();


    } catch(error:any){

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
      disabled={loading}
      className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
    >

      {
        loading
        ? "Completing..."
        : "Mark Completed"
      }

    </Button>

  );

}