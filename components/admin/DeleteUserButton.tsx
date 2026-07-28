"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
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

import { Button } from "@/components/ui/button";


export default function DeleteUserButton({
  userId,
}: {
  userId: string;
}) {

  const router = useRouter();

  const [pending, startTransition] = useTransition();



  function handleDelete() {

    startTransition(async()=>{

      try {

        const res = await fetch(
          `/api/admin/users/${userId}`,
          {
            method:"DELETE",
          }
        );


        const data = await res.json();


        if(!res.ok){

          toast.error(
            data.error || "Delete failed"
          );

          return;

        }


        toast.success(
          "User deleted successfully"
        );


        router.refresh();


      } catch {

        toast.error(
          "Something went wrong"
        );

      }

    });

  }



  return (

    <AlertDialog>


      <AlertDialogTrigger >

        <Button
          size="sm"
          disabled={pending}
          className="cursor-pointer hover:bg-amber-950 bg-black"
        >

          {pending ? "Deleting..." : "Delete"}

        </Button>

      </AlertDialogTrigger>




      <AlertDialogContent>


        <AlertDialogHeader>


          <AlertDialogTitle>
            Delete User?
          </AlertDialogTitle>


          <AlertDialogDescription>

            This action cannot be undone.
            The user account and related data may be removed.

          </AlertDialogDescription>


        </AlertDialogHeader>




        <AlertDialogFooter>


          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>



          <AlertDialogAction
            onClick={handleDelete}
          >

            Delete

          </AlertDialogAction>


        </AlertDialogFooter>


      </AlertDialogContent>


    </AlertDialog>

  );
}