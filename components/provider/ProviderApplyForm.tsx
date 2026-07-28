"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


export default function ProviderApplyForm() {


  const router = useRouter();


  const [loading, setLoading] = useState(false);



  const [form, setForm] = useState({

    businessName: "",
    category: "",
    description: "",
    location: "",
    phone: "",

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





  async function handleSubmit(
    e: React.FormEvent
  ) {


    e.preventDefault();



    if (loading) return;




    if (
      !form.businessName ||
      !form.category ||
      !form.description ||
      !form.location ||
      !form.phone
    ) {

      toast.error(
        "Please fill all fields"
      );

      return;

    }




    try {


      setLoading(true);



      const res = await fetch(
        "/api/provider/apply",
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


        throw new Error(
          data.error ||
          "Application failed"
        );


      }






      toast.success(
        "Provider application submitted successfully"
      );





      setForm({

        businessName: "",
        category: "",
        description: "",
        location: "",
        phone: "",

      });




      router.refresh();


      router.push(
        "/dashboard"
      );




    } catch(error:any) {


      toast.error(
        error.message ||
        "Something went wrong"
      );


    } finally {


      setLoading(false);


    }


  }






  return (


    <form

      onSubmit={handleSubmit}

      className="space-y-5"

    >




      <Input

        name="businessName"

        placeholder="Business / Service Name"

        value={form.businessName}

        onChange={handleChange}

        disabled={loading}

        required

      />






      <Input

        name="category"

        placeholder="Service Category (Electrician, Plumber...)"

        value={form.category}

        onChange={handleChange}

        disabled={loading}

        required

      />







      <Textarea

        name="description"

        placeholder="Describe your experience and service"

        value={form.description}

        onChange={handleChange}

        rows={5}

        disabled={loading}

        required

      />







      <Input

        name="location"

        placeholder="Your working location"

        value={form.location}

        onChange={handleChange}

        disabled={loading}

        required

      />







      <Input

        name="phone"

        placeholder="Phone number"

        value={form.phone}

        onChange={handleChange}

        disabled={loading}

        required

      />








      <Button

        type="submit"

        disabled={loading}

        className="w-full"

      >


        {

          loading

          ? "Submitting Application..."

          : "Submit Application"

        }


      </Button>





    </form>


  );

}