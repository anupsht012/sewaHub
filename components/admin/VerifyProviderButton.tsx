"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function VerifyProviderButton({
  providerId,
}: {
  providerId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleVerify() {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/providers/${providerId}/verify`,
          {
            method: "PATCH",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to verify provider");
          return;
        }

        toast.success("Provider verified");

        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Button
      onClick={handleVerify}
      disabled={pending}
      className="bg-green-600 hover:bg-green-700 cursor-pointer"
    >
      {pending ? "Verifying..." : "Verify"}
    </Button>
  );
}