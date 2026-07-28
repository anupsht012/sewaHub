"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { toast } from "sonner";


export default function RequestServiceForm() {


  const [loading, setLoading] = useState(false);

  const [categoriesLoading, setCategoriesLoading] = useState(true);


  const [categories, setCategories] = useState<
    {
      category: string;
    }[]
  >([]);



  const [form, setForm] = useState({

    category: "",
    title: "",
    description: "",
    location: "",
    phone: "",
    budget: "",
    preferredDate: "",

  });





  useEffect(() => {


    async function fetchCategories() {


      try {


        const res = await fetch(
          "/api/categories"
        );


        const data = await res.json();


        if (!res.ok) {

          throw new Error(
            data.error || "Failed to load categories"
          );

        }


        setCategories(data);


      } catch (error:any) {


        toast.error(
          error.message
        );


      } finally {


        setCategoriesLoading(false);


      }


    }


    fetchCategories();


  }, []);







  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
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

            budget: form.budget
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




      if (!res.ok) {


        throw new Error(
          data.error || "Request failed"
        );


      }




      toast.success(
        "Service request submitted"
      );



      setForm({

        category: "",
        title: "",
        description: "",
        location: "",
        phone: "",
        budget: "",
        preferredDate: "",

      });



    } catch(error:any) {


      toast.error(
        error.message
      );


    } finally {


      setLoading(false);


    }


  }







  return (


    <Card className="rounded-2xl shadow-sm">


      <CardContent className="p-5 md:p-6">


        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >



          <select

            name="category"

            value={form.category}

            onChange={handleChange}

            className="
              w-full
              rounded-lg
              border
              p-2.5
              text-sm
            "

            required

          >

            <option value="">

              {
                categoriesLoading
                ? "Loading categories..."
                : "Select Service"
              }

            </option>


            {categories.map((item)=>(
              
              <option
                key={item.category}
                value={item.category}
              >

                {item.category}

              </option>

            ))}


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

            rows={3}

            required

          />







          <div className="grid gap-3 md:grid-cols-2">


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


          </div>








          <div className="grid gap-3 md:grid-cols-2">


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


          </div>







          <Button

            disabled={loading}

            type="submit"

            className="
              mt-2
              w-full
              bg-blue-600
              hover:bg-blue-700
            "

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