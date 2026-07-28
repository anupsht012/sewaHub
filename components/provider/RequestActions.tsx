"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


export default function RequestActions({
  requestId,
}: {
  requestId: string;
}) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);



  async function updateRequest(action: "accept" | "reject") {

    setLoading(true);


    try {

      const res = await fetch(
        `/api/provider/requests/${requestId}/${action}`,
        {
          method: "POST",
        }
      );


      const data = await res.json();



      if (!res.ok) {

        throw new Error(
          data.error || "Something went wrong"
        );

      }



      toast.success(
        action === "accept"
          ? "Request accepted"
          : "Request rejected"
      );


      router.refresh();



    } catch(error:any) {

      toast.error(
        error.message
      );


    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="mt-6 flex gap-3">


      <Button
        disabled={loading}
        onClick={() => updateRequest("accept")}
        className="
          flex-1
          bg-green-600
          hover:bg-green-700
        "
      >

        Accept

      </Button>



      <Button
        disabled={loading}
        onClick={() => updateRequest("reject")}
        variant="destructive"
        className="flex-1"
      >

        Reject

      </Button>


    </div>

  );

}