"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PaymentActions({ paymentId }: { paymentId: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handleAction(action: "APPROVE" | "REJECT") {
    setLoading(action);
    const fd = new FormData();
    fd.append("paymentId", paymentId);
    fd.append("action", action);
    const res = await fetch("/api/payments/manual/approve", { method: "POST", body: fd });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Failed");
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => handleAction("APPROVE")} disabled={!!loading} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
        {loading === "APPROVE" ? "Approving" : "Approve"}
      </button>
      <button onClick={() => handleAction("REJECT")} disabled={!!loading} className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50">
        {loading === "REJECT" ? "Rejecting" : "Reject"}
      </button>
    </div>
  );
}