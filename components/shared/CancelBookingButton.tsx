"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";


export default function CancelBookingButton({
    bookingId,
}: {
    bookingId: string;
}) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);



    async function cancelBooking() {

        setLoading(true);


        const res = await fetch(
            `/api/customer/bookings/${bookingId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "CANCELLED",
                }),
            }
        );



        if (res.ok) {

            setOpen(false);

            window.location.reload();
            toast.success("Booking cancelled successfully");
        } else {
            const error = await res.json();

            toast.error(
                error.error || "Failed to cancel booking"
            );

        }


        setLoading(false);

    }



    return (

        <>


            <Button
                variant="destructive"
                onClick={() => setOpen(true)}
            >
                Cancel Booking
            </Button>



            <Dialog
                open={open}
                onOpenChange={setOpen}
            >

                <DialogContent>


                    <DialogHeader>

                        <DialogTitle>
                            Cancel Booking?
                        </DialogTitle>


                        <DialogDescription>
                            Are you sure you want to cancel this booking?
                            This action cannot be undone.
                        </DialogDescription>


                    </DialogHeader>



                    <DialogFooter>


                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Keep Booking
                        </Button>



                        <Button
                            variant="destructive"
                            onClick={cancelBooking}
                            disabled={loading}
                        >

                            {loading
                                ? "Cancelling..."
                                : "Yes, Cancel"
                            }

                        </Button>



                    </DialogFooter>


                </DialogContent>


            </Dialog>


        </>

    );

}