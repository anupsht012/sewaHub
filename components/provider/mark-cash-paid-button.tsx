"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface MarkCashPaidButtonProps {
  paymentId: string;
}

export default function MarkCashPaidButton({ paymentId }: MarkCashPaidButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleMarkAsPaid = async (e: React.MouseEvent) => {
    // Prevent closing dialog immediately on click
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payments/mark-cash-collected", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update payment status");
      }

      setOpen(false);
      // Refresh Server Component data in Next.js
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong while updating payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Mark Cash Paid</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Cash Collection</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you have collected the cash payment for this booking? This action will mark the payment as completed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={() => setErrorMessage(null)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleMarkAsPaid}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}