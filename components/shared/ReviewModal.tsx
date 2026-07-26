"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";


export default function ReviewModal({
  serviceId,
}: {
  serviceId: string;
}) {

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);



  async function submitReview() {

    setLoading(true);


    const res = await fetch(
      "/api/customer/reviews",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          serviceId,
          rating,
          comment,
        }),

      }
    );


    const data = await res.json();


    if (!res.ok) {

      toast.error(
        data.error || "Failed to submit review"
      );

      setLoading(false);
      return;

    }


    toast.success("Review submitted");


    setOpen(false);
    setComment("");
    setRating(5);

    setLoading(false);

  }



  return (

    <>

      <Button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 hover:bg-yellow-600"
      >
        ⭐ Leave Review
      </Button>



      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">


          <div className="w-full max-w-md rounded-xl bg-white p-6">


            <h2 className="text-xl font-bold">
              Write Review
            </h2>



            <div className="mt-4 flex gap-2">

              {[1,2,3,4,5].map((star)=>(

                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    rating >= star
                    ? "text-yellow-500"
                    : "text-gray-300"
                  }`}
                >
                  ★
                </button>

              ))}

            </div>



            <textarea
              className="mt-4 w-full rounded-lg border p-3"
              placeholder="Write your experience..."
              value={comment}
              onChange={(e)=>
                setComment(e.target.value)
              }
            />



            <div className="mt-5 flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>


              <Button
                disabled={loading}
                onClick={submitReview}
              >
                Submit
              </Button>

            </div>


          </div>


        </div>

      )}


    </>

  );

}