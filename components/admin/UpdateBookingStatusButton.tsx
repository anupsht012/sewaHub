"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";


interface Props {
  bookingId: string;
  status: string;
}


export default function UpdateBookingStatusButton({
  bookingId,
  status,
}: Props) {


  const router = useRouter();

  const [pending, startTransition] = useTransition();



  function updateStatus(newStatus:string){


    startTransition(async()=>{


      try {


        const res = await fetch(
          `/api/admin/bookings/${bookingId}`,
          {
            method:"PATCH",

            headers:{
              "Content-Type":"application/json",
            },

            body:JSON.stringify({
              status:newStatus,
            }),

          }
        );



        const data = await res.json();



        if(!res.ok){

          toast.error(
            data.error || "Update failed"
          );

          return;

        }



        toast.success(
          "Booking status updated"
        );


        router.refresh();



      } catch {


        toast.error(
          "Something went wrong"
        );


      }


    });


  }




  return (

    <div className="flex flex-col gap-2">


      {
        status === "PENDING" && (

          <>

            <Button
              disabled={pending}
              onClick={()=>updateStatus("ACCEPTED")}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              Accept
            </Button>


            <Button
              disabled={pending}
              onClick={()=>updateStatus("REJECTED")}
              variant="destructive"
              className="cursor-pointer"
            >
              Reject
            </Button>


          </>

        )
      }





      {
        status === "ACCEPTED" && (

          <Button
            disabled={pending}
            onClick={()=>updateStatus("COMPLETED")}
          >
            Mark Completed
          </Button>

        )
      }




      {
        status !== "COMPLETED" &&
        status !== "REJECTED" && (

          <Button
            disabled={pending}
            variant="outline"
            onClick={()=>updateStatus("CANCELLED")}
            className="cursor-pointer"
          >
            Cancel
          </Button>

        )
      }



    </div>

  );

}