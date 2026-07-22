import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function CTA() {

  return (

    <section className="bg-blue-600 py-20 text-white">


      <div className="container mx-auto px-6 text-center">


        <h2 className="text-4xl font-bold md:text-5xl">

          Need a Professional Today?

        </h2>





        <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">

          Find trusted electricians, tutors, cleaners,
          painters and more across Nepal.

        </p>







        <div className="
          mt-8
          flex
          flex-col
          justify-center
          gap-4
          sm:flex-row
        ">



          <Link href="/services">


            <Button

              className="
              w-full
              cursor-pointer
              bg-white
              text-blue-600
              hover:bg-gray-100
              sm:w-auto
              "

            >

              Find a Service

            </Button>


          </Link>







          <Link href="/provider/setup">


            <Button

              variant="outline"

              className="
              w-full
              cursor-pointer
              border-white
              text-black
              hover:bg-white
              hover:text-blue-600
              sm:w-auto
              "

            >

              Become a Provider

            </Button>


          </Link>





        </div>





      </div>


    </section>

  );

}