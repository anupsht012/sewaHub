"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function RejectProviderButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleReject() {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/provider-applications/${applicationId}/reject`,
          {
            method: "PATCH",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to reject");
          return;
        }

        toast.success("Application rejected");

        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Button
      variant="destructive"
      onClick={handleReject}
      disabled={pending}
    >
      {pending ? "Rejecting..." : "Reject"}
    </Button>
  );
}