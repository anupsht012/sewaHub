"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, Phone, MapPin, StickyNote } from "lucide-react";
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
  DialogDescription,
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

export default function BookServiceModal({ serviceId, serviceName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  function resetForm() {
    setBookingDate(undefined);
    setPhone("");
    setAddress("");
    setNote("");
  }

  async function handleBooking() {
    if (!bookingDate) {
      toast.error("Please select a booking date.");
      return;
    }
    if (bookingDate < startOfDay(new Date())) {
      toast.error("Cannot book in the past.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error("Valid phone number is required (min 10 digits).");
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      toast.error("Service address is required (min 5 chars).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          bookingDate: bookingDate.toISOString(), // send ISO, not Date object
          phone: phone.trim(),
          address: address.trim(),
          note: note.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Booking failed.");
        return;
      }

      toast.success("Booking request sent!");
      resetForm();
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) resetForm();
    }}>
      <DialogTrigger >
        <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
          Book Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w- rounded-2xl p-0 overflow-hidden max-h- overflow-y-auto">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-lg">Book {serviceName}</DialogTitle>
          <DialogDescription className="text-xs">
            Select date and address — provider will confirm shortly.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          {/* DATE */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Booking Date *</label>
            <Popover>
              <PopoverTrigger >
                <Button variant="outline" className="w-full justify-start h-11 rounded-xl font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                  {bookingDate ? format(bookingDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={bookingDate}
                  onSelect={setBookingDate}
                  disabled={(date) => date < startOfDay(new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="tel"
                inputMode="numeric"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="h-11 pl-10 rounded-xl"
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Service Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="e.g. Baneshwor, Kathmandu"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11 pl-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Additional Notes <span className="font-normal text-slate-400">(Optional)</span></label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Textarea
                placeholder="Any specific requirements?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h- pl-10 rounded-xl resize-none"
                maxLength={300}
              />
            </div>
            <p className="text- text-slate-400 text-right">{note.length}/300</p>
          </div>
        </div>

        <DialogFooter className="p-4 bg-slate-50 flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 rounded-xl h-11" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={loading} className="flex-1 rounded-xl h-11 bg-blue-600 hover:bg-blue-700">
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}