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

  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({

    name: "",

    category: "",

    description: "",

    price: "",

  });



  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  }




  async function createService(
    e: React.FormEvent
  ) {

    e.preventDefault();


    setLoading(true);



    try {

      const res = await fetch(
        "/api/provider/services",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),

        }
      );



      const data = await res.json();



      if (!res.ok) {

        toast.error(
          data.error ||
          "Failed to create service"
        );

        return;

      }



      toast.success(
        "Service created successfully"
      );



      setOpen(false);



      setForm({

        name: "",

        category: "",

        description: "",

        price: "",

      });



      router.refresh();



    } catch (error) {

      console.error(error);

      toast.error(
        "Something went wrong"
      );


    } finally {

      setLoading(false);

    }

  }





  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >


      <DialogTrigger >

        <Button className="cursor-pointer">
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
          className="mt-4 space-y-4"
        >



          <Input

            name="name"

            placeholder="Service name"

            value={form.name}

            onChange={handleChange}

            required

          />




          <Input

            name="category"

            placeholder="Category (Plumber, Electrician, Cleaning...)"

            value={form.category}

            onChange={handleChange}

            required

          />





          <textarea

            name="description"

            className="w-full rounded-md border p-3"

            placeholder="Description"

            value={form.description}

            onChange={handleChange}

            rows={5}

          />





          <Input

            name="price"

            type="number"

            placeholder="Price"

            value={form.price}

            onChange={handleChange}

            required

          />






          <Button

            type="submit"

            className="w-full"

            disabled={loading}

          >

            {
              loading
              ? "Creating..."
              : "Create Service"
            }

          </Button>




        </form>


      </DialogContent>


    </Dialog>

  );

}