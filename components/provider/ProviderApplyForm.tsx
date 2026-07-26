"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


export default function ProviderApplyForm() {


  const router = useRouter();


  const [loading,setLoading] = useState(false);


  const [form,setForm] = useState({

    businessName:"",
    category:"",
    description:"",
    location:"",
    phone:"",

  });



  function handleChange(
    e:React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ){

    setForm({

      ...form,

      [e.target.name]:
      e.target.value,

    });

  }



  async function handleSubmit(
    e:React.FormEvent
  ){

    e.preventDefault();


    setLoading(true);



    try{


      const res = await fetch(
        "/api/provider/apply",
        {

          method:"POST",

          headers:{
            "Content-Type":"application/json",
          },


          body:JSON.stringify(form),

        }
      );



      const data = await res.json();



      if(!res.ok){

        throw new Error(
          data.error || "Application failed"
        );

      }



      toast.success(
        "Provider application submitted"
      );



      router.push(
        "/dashboard"
      );


      router.refresh();



    }catch(error:any){


      toast.error(
        error.message
      );


    }finally{

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
        required
      />



      <Input
        name="category"
        placeholder="Service Category (Electrician, Plumber...)"
        value={form.category}
        onChange={handleChange}
        required
      />



      <Textarea
        name="description"
        placeholder="Describe your experience and service"
        value={form.description}
        onChange={handleChange}
        rows={5}
        required
      />



      <Input
        name="location"
        placeholder="Your working location"
        value={form.location}
        onChange={handleChange}
        required
      />



      <Input
        name="phone"
        placeholder="Phone number"
        value={form.phone}
        onChange={handleChange}
        required
      />



      <Button
        disabled={loading}
        className="w-full"
      >

        {
          loading
          ? "Submitting..."
          : "Submit Application"
        }


      </Button>


    </form>

  );

}