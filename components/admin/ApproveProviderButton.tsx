"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ApproveProviderButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/provider-applications/${applicationId}/approve`,
          {
            method: "PATCH",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to approve");
          return;
        }

        toast.success("Provider approved");

        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Button
      onClick={handleApprove}
      disabled={pending}
      className="bg-green-600 hover:bg-green-700"
    >
      {pending ? "Approving..." : "Approve"}
    </Button>
  );
}