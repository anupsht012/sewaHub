"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  serviceId: string;
}

export default function DeleteServiceButton({
  serviceId,
}: Props) {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  function handleDelete() {
    if (
      !confirm(
        "Delete this service permanently?"
      )
    ) {
      return;
    }

    startTransition(async () => {
      const res = await fetch(
        `/api/admin/services/${serviceId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Service deleted");

      router.refresh();
    });
  }

  return (
    <Button
      variant="destructive"
      disabled={pending}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
}