"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

interface Props {
  serviceId: string;
  serviceName: string;
}

export default function BookServiceModal({
  serviceId,
  serviceName,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bookingDate, setBookingDate] = useState<Date>();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  async function handleBooking() {
    if (!bookingDate) {
      toast.error("Please select a booking date.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (!address.trim()) {
      toast.error("Address is required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          bookingDate,
          phone,
          address,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Booking failed.");
        return;
      }

      toast.success("Booking request sent!");

      setOpen(false);

      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger >
        <Button className="w-full cursor-pointer">
          Book Now
        </Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Book {serviceName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Popover>

            <PopoverTrigger >

              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {bookingDate
                  ? format(bookingDate, "PPP")
                  : "Select Booking Date"}
              </Button>

            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">

              <Calendar
                mode="single"
                selected={bookingDate}
                onSelect={setBookingDate}
              />

            </PopoverContent>

          </Popover>

          <Input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            placeholder="Service Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Textarea
            placeholder="Additional Notes (Optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleBooking}
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Service"}
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}