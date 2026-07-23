"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function EditServiceModal({
  service,
}: {
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
  };
}) {

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: service.name,
    description: service.description || "",
    price: service.price.toString(),
  });


  const [loading, setLoading] = useState(false);



  async function updateService(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);


    const res = await fetch(
      `/api/provider/services/${service.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );


    const data = await res.json();


    setLoading(false);

    if (!res.ok) {
            toast.error(data.error || "Failed to update service");
      return;
    }   

    toast.success("Service updated successfully");

    setOpen(false); 

    router.refresh();

  }



  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger>

        <Button variant="outline">
          Edit
        </Button>

      </DialogTrigger>


      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Edit Service
          </DialogTitle>

        </DialogHeader>



        <form
          onSubmit={updateService}
          className="space-y-4"
        >

          <Input
            value={form.name}
            onChange={(e)=>
              setForm({
                ...form,
                name:e.target.value
              })
            }
          />


          <textarea
            className="w-full rounded-md border p-3"
            value={form.description}
            onChange={(e)=>
              setForm({
                ...form,
                description:e.target.value
              })
            }
          />


          <Input
            type="number"
            value={form.price}
            onChange={(e)=>
              setForm({
                ...form,
                price:e.target.value
              })
            }
          />


         
 <Button
           type="submit"
           className="w-full"
           disabled={loading}
         >
           {loading ? "Saving..." : "Save Changes"}
         </Button>

        </form>


      </DialogContent>


    </Dialog>

  );
}