"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
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

export default function DeleteReviewButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/customer/reviews/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Review deleted successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to delete review");
      }
    } catch {
      toast.error("An error occurred while deleting the review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger >
        <Button
          size="sm"
          variant="ghost"
          className="h-8 cursor-pointer text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-100 rounded-lg gap-1.5 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5 shrink-0" />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg">
        <AlertDialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-base font-bold text-slate-900">
            Delete Review?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 mt-1">
            Are you sure you want to delete this review? This action cannot be undone and will permanently remove your feedback from this service.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-5 gap-2 sm:gap-0">
          <AlertDialogCancel
            disabled={loading}
            className="h-9 text-xs font-semibold rounded-lg text-slate-700 border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="h-9 cursor-pointer text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}