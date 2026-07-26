"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";  
import { toast } from "sonner"; 


export default function RequestServiceForm() {


  const [loading,setLoading] = useState(false);


  const [form,setForm] = useState({

    category:"",
    title:"",
    description:"",
    location:"",
    phone:"",
    budget:"",
    preferredDate:"",

  });



  function handleChange(
    e:React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ){

    setForm({

      ...form,

      [e.target.name]:
      e.target.value,

    });

  }



async function handleSubmit(
  
  e: React.FormEvent
) {

  e.preventDefault();

  setLoading(true);

  try {

    const res = await fetch(
      "/api/request-service",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          ...form,

          budget:
            form.budget
              ? Number(form.budget)
              : null,

          preferredDate:
            form.preferredDate
              ? new Date(form.preferredDate)
              : null,

        }),

      }
    );


    const data = await res.json();



    console.log("API RESPONSE:", data);



    if(!res.ok){

      throw new Error(
        data.error || "Request failed"
      );

    }



    toast.success(
      "Service request submitted"
    );



    setForm({

      category:"",
      title:"",
      description:"",
      location:"",
      phone:"",
      budget:"",
      preferredDate:"",

    });



  } catch(error:any) {


    console.error(error);


    toast.error(
      error.message
    );


  } finally {


    setLoading(false);


  }

}



  return (

    <Card className="rounded-3xl shadow">

      <CardContent className="p-6 md:p-10">


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          >

            <option value="">
              Select Service
            </option>

            <option>
              Electrician
            </option>

            <option>
              Plumber
            </option>

            <option>
              Cleaner
            </option>

            <option>
              Painter
            </option>

            <option>
              Tutor
            </option>

            <option>
              Carpenter
            </option>

          </select>



          <Input
            name="title"
            placeholder="Service title"
            value={form.title}
            onChange={handleChange}
            required
          />



          <Textarea
            name="description"
            placeholder="Describe your requirement"
            value={form.description}
            onChange={handleChange}
            rows={5}
            required
          />



          <Input
            name="location"
            placeholder="Location"
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



          <Input
            name="budget"
            type="number"
            placeholder="Budget (optional)"
            value={form.budget}
            onChange={handleChange}
          />



          <Input
            name="preferredDate"
            type="date"
            value={form.preferredDate}
            onChange={handleChange}
          />



          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >

            {
              loading
              ? "Submitting..."
              : "Submit Request"
            }

          </Button>


        </form>


      </CardContent>

    </Card>

  );

}