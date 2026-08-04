"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  serviceId: string;
}

export default function DeleteServiceButton({ serviceId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/services/${serviceId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to delete service");
          return;
        }

        toast.success("Service deleted permanently");
        setOpen(false);
        router.refresh();
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button className="cursor-pointer" variant="destructive" disabled={pending}>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            service and remove its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? "Deleting..." : "Delete Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}