import Link from "next/link";
import {
  Search,
  CalendarCheck,
  Handshake,
} from "lucide-react";


const steps = [
  {
    title: "Find a Service",
    description:
      "Search electricians, tutors, cleaners, painters and other trusted professionals.",
    icon: Search,
    link: "/services",
    button: "Browse Services",
  },

  {
    title: "Book a Professional",
    description:
      "Choose your preferred provider and schedule a convenient time.",
    icon: CalendarCheck,
    link: "/services",
    button: "Book Now",
  },

  {
    title: "Get the Job Done",
    description:
      "Your verified professional completes the work. Rate your experience.",
    icon: Handshake,
    link: "/dashboard#reviews",
    button: "Leave Review",
  },
];



export default function HowItWorks() {


  return (

    <section className="bg-gray-50 py-16 sm:py-20">


      <div className="container mx-auto px-4 sm:px-6">





        <div className="mb-10 text-center sm:mb-12">


          <h2 className="
          text-3xl
          font-bold
          sm:text-4xl
          ">

            How SewaHub Nepal Works

          </h2>




          <p className="
          mt-3
          text-sm
          text-gray-600
          sm:text-base
          ">

            Getting professional help is simple.

          </p>



        </div>








        <div className="
        grid
        gap-6
        sm:gap-8
        md:grid-cols-3
        ">




          {steps.map((step,index)=>{


            const Icon = step.icon;



            return (



              <Link

                href={step.link}

                key={step.title}

                className="
                group
                "

              >



                <div className="
                h-full
                rounded-3xl
                bg-white
                p-6
                text-center
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
                sm:p-8
                ">





                  <div className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-100
                  text-blue-600
                  transition
                  group-hover:bg-blue-600
                  group-hover:text-white
                  sm:h-16
                  sm:w-16
                  ">


                    <Icon className="
                    h-7
                    w-7
                    sm:h-8
                    sm:w-8
                    "/>


                  </div>







                  <div className="
                  mt-5
                  text-xs
                  font-bold
                  text-blue-600
                  sm:mt-6
                  sm:text-sm
                  ">

                    STEP {index + 1}

                  </div>






                  <h3 className="
                  mt-2
                  text-lg
                  font-bold
                  sm:text-xl
                  ">

                    {step.title}

                  </h3>






                  <p className="
                  mt-3
                  text-sm
                  text-gray-500
                  sm:text-base
                  ">

                    {step.description}

                  </p>







                  <span className="
                  mt-6
                  inline-block
                  rounded-full
                  bg-blue-50
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-blue-600
                  transition
                  group-hover:bg-blue-600
                  group-hover:text-white
                  ">

                    {step.button}

                  </span>





                </div>



              </Link>



            );



          })}





        </div>






      </div>


    </section>


  );

}