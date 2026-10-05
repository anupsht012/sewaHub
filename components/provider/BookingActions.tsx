"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BookingActions({ bookingId, status, isPaid }: { bookingId: string; status: string; isPaid: boolean }) {
  const [loading, setLoading] = useState("");
  const router = useRouter();
  const s = status?.toUpperCase().trim(); // FIX HERE

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Booking ${newStatus.toLowerCase()}`);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed");
      console.error(e);
    } finally {
      setLoading("");
    }
  }

  if (s.includes("PENDING")) { // FIX: includes, not ===
    return (
      <div className="flex gap-2">
        <Button size="sm" className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs" disabled={!!loading} onClick={() => updateStatus("ACCEPTED")}>{loading === "ACCEPTED"? "..." : "Accept"}</Button>
        <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" disabled={!!loading} onClick={() => updateStatus("REJECTED")}>Reject</Button>
      </div>
    );
  }

  if (s === "ACCEPTED") {
    return (
      <Button size="sm" className="h-8 rounded-lg bg-blue-600 text-xs" disabled={!isPaid ||!!loading} onClick={() => updateStatus("COMPLETED")} title={!isPaid? "Payment required before completion" : ""}>
        {loading === "COMPLETED"? "..." : isPaid? "Complete" : "Unpaid"}
      </Button>
    );
  }

  return <span className="text-xs text-slate-400">{s}</span>;
}