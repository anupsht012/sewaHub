"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, startOfDay } from "date-fns";
import {
  CalendarDays,
  Phone,
  MapPin,
  StickyNote,
  CheckCircle2,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react";
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
    if (!bookingDate) return toast.error("Please select a booking date.");
    if (bookingDate < startOfDay(new Date())) return toast.error("Cannot book in the past.");
    if (phone.trim().length!== 10) return toast.error("Enter valid 10-digit phone.");
    if (address.trim().length < 5) return toast.error("Enter valid address.");
    try {
      setLoading(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          bookingDate: bookingDate.toISOString(),
          phone: phone.trim(),
          address: address.trim(),
          note: note.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      toast.success("Booking request sent!");
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) { setOpen(v); if (!v) resetForm(); }}}>
      <DialogTrigger >
        <Button className="h-11 w-full rounded-xl bg-blue-600 font-semibold shadow-sm hover:bg-blue-700">
          Book Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-24px)] max-w-[520px] max-h-[92dvh] sm:max-h-[90vh] gap-0 overflow-hidden rounded- border-0 p-0 shadow-2xl flex flex-col sm:w-full [&>button]:hidden">
        {/* HEADER */}
        <div className="relative shrink-0 border-b bg-gradient-to-br from-blue-50 via-white to-white px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3 min-w-0">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 grid place-items-center text-white">
                <CalendarDays className="h-5 w-5" />
              </div>
              <DialogHeader className="text-left space-y-1">
                <DialogTitle className="text- sm:text- font-bold tracking-tight">Book Your Service</DialogTitle>
                <DialogDescription className="text- sm:text- leading-snug">Fill details to request a booking</DialogDescription>
              </DialogHeader>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8 shrink-0 rounded-full -mt-1 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl border bg-white p-3">
            <div className="h-9 w-9 rounded-lg bg-blue-50 grid place-items-center text-blue-600"><CheckCircle2 className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1">
              <p className="text- font-semibold uppercase tracking-wider text-slate-400">Selected</p>
              <p className="truncate text- font-bold">{serviceName}</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text- font-bold text-amber-700">Pending Approval</span>
          </div>
        </div>

        {/* FORM */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text- font-bold uppercase tracking-wide text-slate-600">Date *</label>
              <Popover>
                <PopoverTrigger >
                  <Button variant="outline" className={`h-11 w-full justify-start rounded-xl border text- font-medium ${bookingDate? "bg-blue-50/50 border-blue-200 text-slate-900" : "text-slate-500"}`}>
                    <CalendarDays className="mr-2 h-4 w-4 text-blue-600" />
                    {bookingDate? format(bookingDate, "MMM d, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 rounded-xl" align="start">
                  <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} disabled={(d) => d < startOfDay(new Date())} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <label className="text- font-bold uppercase tracking-wide text-slate-600">Phone *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text- font-medium text-slate-400">+977</span>
                <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98XXXXXXXX" className="h-11 rounded-xl pl- text-" maxLength={10} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text- font-bold uppercase tracking-wide text-slate-600 flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Address *</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Baneshwor, Kathmandu" className="h-11 rounded-xl text-" />
          </div>

          <div className="space-y-1.5">
            <label className="text- font-bold uppercase tracking-wide text-slate-600 flex justify-between">
              <span className="flex items-center gap-1.5"><StickyNote className="h-3 w-3" /> Notes</span>
              <span className="font-normal normal-case text-slate-400">Optional</span>
            </label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 300))} placeholder="Requirements..." className="min-h- max-h- resize-none rounded-xl text-" maxLength={300} />
            <div className="flex justify-between text- text-slate-400"><span>Helps provider understand</span><span className={note.length > 250? "text-amber-600 font-medium" : ""}>{note.length}/300</span></div>
          </div>

          <div className="flex gap-2.5 rounded-xl bg-blue-50/70 border border-blue-100 p-3 text- leading-relaxed text-blue-900">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
            You will get notified when provider accepts your request.
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="shrink-0 flex-row gap-2.5 border-t bg-slate-50/80 px-5 py-3.5 sm:px-7">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="flex-1 h-11 rounded-xl bg-white font-semibold text-">Cancel</Button>
          <Button onClick={handleBooking} disabled={loading} className="flex-[1.4] h-11 rounded-xl bg-blue-600 font-semibold text- shadow-sm hover:bg-blue-700">
            {loading? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : <>Confirm <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}