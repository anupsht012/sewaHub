"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function UnverifyProviderButton({
  providerId,
}: {
  providerId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleUnverify() {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/providers/${providerId}/unverify`,
          {
            method: "PATCH",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to unverify provider");
          return;
        }

        toast.success("Provider unverified");

        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Button
      variant="destructive"
      onClick={handleUnverify}
      disabled={pending}
      className="cursor-pointer"
    >
      {pending ? "Updating..." : "Unverify"}
    </Button>
  );
}