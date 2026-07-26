"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";


interface RequestData {

  id: string;

  category: string;

  title: string;

  description: string;

  location: string;

  phone: string;

  budget?: number | null;

  preferredDate?: Date | string | null;

}



export default function EditRequestModal({

  request,

}: {

  request: RequestData;

}) {


  const router = useRouter();


  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);



  const [form, setForm] = useState({

    category: request.category,

    title: request.title,

    description: request.description,

    location: request.location,

    phone: request.phone,

    budget: request.budget ?? "",

    preferredDate:

      request.preferredDate

        ? new Date(request.preferredDate)

        : undefined,

  });



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





  async function handleUpdate() {


    setLoading(true);


    try {


      const response = await fetch(

        `/api/request-service/${request.id}`,

        {

          method: "PUT",

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

                ? form.preferredDate.toISOString()

                : null,

          }),


        }

      );



      const data = await response.json();



      if (!response.ok) {

        throw new Error(

          data.error || "Update failed"

        );

      }



      toast.success(
        "Request updated successfully"
      );


      setOpen(false);


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


      <DialogTrigger

        className="
          rounded-md
          border
          px-4
          py-2
          text-sm
          hover:bg-gray-100
        "

      >

        Edit

      </DialogTrigger>





      <DialogContent

        className="
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
        "

      >


        <DialogHeader>

          <DialogTitle>

            Edit Service Request

          </DialogTitle>

        </DialogHeader>





        <div className="space-y-4">





          <select

            name="category"

            value={form.category}

            onChange={handleChange}

            className="
              w-full
              rounded-lg
              border
              p-3
            "

          >

            <option value="Electrician">
              Electrician
            </option>

            <option value="Plumber">
              Plumber
            </option>

            <option value="Cleaner">
              Cleaner
            </option>

            <option value="Painter">
              Painter
            </option>

            <option value="Tutor">
              Tutor
            </option>

            <option value="Carpenter">
              Carpenter
            </option>


          </select>





          <Input

            name="title"

            value={form.title}

            onChange={handleChange}

            placeholder="Service title"

          />





          <Textarea

            name="description"

            value={form.description}

            onChange={handleChange}

            placeholder="Describe your requirement"

            rows={5}

          />





          <Input

            name="location"

            value={form.location}

            onChange={handleChange}

            placeholder="Location"

          />





          <Input

            name="phone"

            value={form.phone}

            onChange={handleChange}

            placeholder="Phone"

          />





          <Input

            name="budget"

            type="number"

            value={form.budget}

            onChange={handleChange}

            placeholder="Budget"

          />






          <Popover>


            <PopoverTrigger

              className="
                flex
                w-full
                items-center
                rounded-lg
                border
                px-3
                py-3
                text-left
                text-sm
                hover:bg-gray-100
              "

            >


              <CalendarIcon

                className="
                  mr-2
                  h-4
                  w-4
                "

              />


              {

                form.preferredDate

                  ? format(

                      form.preferredDate,

                      "PPP"

                    )

                  : "Pick preferred date"

              }


            </PopoverTrigger>





            <PopoverContent

              className="w-auto p-0"

              align="start"

            >


              <Calendar

                mode="single"


                selected={
                  form.preferredDate
                }


                onSelect={(date)=>{

                  setForm({

                    ...form,

                    preferredDate: date,

                  });


                }}


                disabled={(date)=>
                  date < new Date()
                }


              />


            </PopoverContent>



          </Popover>







          <button

            disabled={loading}

            onClick={handleUpdate}

            className="
              w-full
              rounded-lg
              bg-blue-600
              px-4
              py-3
              text-white
              hover:bg-blue-700
              disabled:opacity-50
            "

          >

            {

              loading

                ? "Saving..."

                : "Save Changes"

            }


          </button>





        </div>



      </DialogContent>



    </Dialog>


  );

}