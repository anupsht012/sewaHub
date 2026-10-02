"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualQRForm({ bookingId, method }: { bookingId: string; method: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    try {
      const res = await fetch("/api/payments/manual", {
        method: "POST",
        body: formData,
      });
      
      // If API returns redirect, follow it manually
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        alert(data.error || "Failed to submit proof");
        setLoading(false);
        return;
      }

      // Success - go back to pay page with success message
      router.push(`/dashboard/bookings/${bookingId}/pay?success=Proof submitted! Waiting for verification`);
      router.refresh();
    } catch (err) {
      alert("Network error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-3">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="method" value={method} />
      <input type="file" name="proof" accept="image/*" required className="w-full text-sm border p-2 rounded-lg" />
      <button disabled={loading} type="submit" className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50">
        {loading ? "Submitting..." : "Submit Payment Proof"}
      </button>
    </form>
  );
}