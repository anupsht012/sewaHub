"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";



export default function CancelRequestModal({

    requestId,

}: {

    requestId: string;

}) {



    const router = useRouter();


    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);






    async function handleCancel() {


        setLoading(true);



        try {


            const res = await fetch(

                `/api/request-service/${requestId}/cancel`,

                {

                    method: "POST",

                }

            );





            const data = await res.json();




            if (!res.ok) {

                throw new Error(
                    data.error || "Cancel failed"
                );

            }




            toast.success(
                "Request cancelled"
            );



            setOpen(false);



            router.refresh();




        } catch (error) {


            toast.error(
                "Something went wrong"
            );



        } finally {


            setLoading(false);


        }



    }







    return (


        <Dialog

            open={open}

            onOpenChange={setOpen}

        >



            <DialogTrigger
                className="
    rounded-md
    border
    px-4
    py-2
    text-sm
    text-red-600
    hover:bg-gray-100
  "
            >
                Cancel
            </DialogTrigger> 








            <DialogContent

                className="
          rounded-2xl
        "

            >



                <DialogHeader>


                    <DialogTitle>

                        Cancel Service Request?

                    </DialogTitle>


                </DialogHeader>






                <p className="text-gray-600">


                    Are you sure you want to cancel this request?
                    This action cannot be undone.


                </p>







                <div className="mt-5 flex justify-end gap-3">



                    <Button

                        variant="outline"

                        onClick={() => setOpen(false)}

                    >

                        No, Keep It

                    </Button>






                    <Button


                        variant="destructive"


                        disabled={loading}


                        onClick={handleCancel}


                    >


                        {

                            loading

                                ? "Cancelling..."

                                : "Yes, Cancel"

                        }



                    </Button>




                </div>






            </DialogContent>






        </Dialog>


    );

}