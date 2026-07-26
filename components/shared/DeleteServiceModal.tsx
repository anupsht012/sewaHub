"use client";

import { useState } from "react";
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


export default function DeleteServiceModal({
  serviceId,
}: {
  serviceId: string;
}) {


  const router = useRouter();

  const [loading,setLoading]=useState(false);



  async function deleteService(){


    setLoading(true);


    const res = await fetch(
      `/api/provider/services/${serviceId}`,
      {
        method:"DELETE",
      }
    );


    setLoading(false);



    if (!res.ok) {

  toast.error("Failed to delete service");

  return;

}


toast.success("Service deleted successfully");

router.refresh();

  }



  return (

    <AlertDialog>

      <AlertDialogTrigger>

        <Button variant="destructive" className="cursor-pointer">
          Delete
        </Button>

      </AlertDialogTrigger>



      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle >
            Delete service?
          </AlertDialogTitle>


          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>


        </AlertDialogHeader>



        <AlertDialogFooter>


          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>


          <AlertDialogAction
            onClick={deleteService}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>


        </AlertDialogFooter>


      </AlertDialogContent>


    </AlertDialog>

  );

}