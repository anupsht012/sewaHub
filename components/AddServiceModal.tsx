"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


export default function AddServiceModal() {

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });


  const [loading, setLoading] = useState(false);



  async function createService(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);


    const res = await fetch("/api/provider/services", {
      method: "POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify(form),
    });


    const data = await res.json();


    setLoading(false);


    if(!res.ok){
     toast.error(data.error || "Failed to create service");
     return;
    }
    toast.success("Service created successfully");


    setOpen(false);

    setForm({
      name:"",
      description:"",
      price:"",
    });


    router.refresh();

  }



  return (

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>

        <Button>
          + Add Service
        </Button>

      </DialogTrigger>



      <DialogContent>


        <DialogHeader>

          <DialogTitle>
            Create New Service
          </DialogTitle>

        </DialogHeader>



        <form
          onSubmit={createService}
          className="space-y-4 mt-4"
        >


          <Input
            placeholder="Service name"
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
            placeholder="Description"
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
            placeholder="Price"
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
           {loading ? "Creating..." : "Create Service"}
         </Button>

        </form>


      </DialogContent>


    </Dialog>

  );
}