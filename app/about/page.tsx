import Link from "next/link";
import {
  ShieldCheck,
  Users,
  MapPin,
  Star,
  Handshake,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";


const features = [
  {
    title: "Verified Professionals",
    description:
      "We help customers find trusted service providers through verification and customer feedback.",
    icon: ShieldCheck,
  },
  {
    title: "Local Services Across Nepal",
    description:
      "Discover electricians, plumbers, tutors, cleaners, painters, and many more professionals near you.",
    icon: MapPin,
  },
  {
    title: "Customer Reviews",
    description:
      "Real ratings and reviews help customers make better decisions before booking.",
    icon: Star,
  },
  {
    title: "Growing Provider Network",
    description:
      "We help skilled professionals connect with more customers and grow their businesses.",
    icon: Users,
  },
];


export default function AboutPage() {


  return (

    <div className="min-h-screen bg-gray-50">


      {/* Hero */}


      <section className="bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white">


        <div className="container mx-auto px-6 py-20 text-center">


          <h1 className="text-4xl font-extrabold md:text-6xl">

            Connecting Nepal with
            <span className="block text-yellow-300">
              Trusted Local Professionals
            </span>

          </h1>


          <p className="mx-auto mt-6 max-w-3xl text-lg text-blue-100">

            SewaHub Nepal is a service marketplace that makes it easier
            for customers to find reliable professionals and helps skilled
            providers grow their work.

          </p>



          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">


            <Link href="/services">

              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >

                Find Services

              </Button>

            </Link>



            <Link href="/provider">

              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-blue-600"
              >

                Become a Provider

              </Button>

            </Link>


          </div>


        </div>


      </section>







      {/* Mission */}


      <section className="py-20">


        <div className="container mx-auto grid gap-10 px-6 md:grid-cols-2">


          <div>


            <h2 className="text-4xl font-bold">

              Our Mission

            </h2>


            <p className="mt-5 leading-8 text-gray-600">

              Our mission is simple: make finding professional help
              easier, faster, and safer for everyone in Nepal.

              Whether you need a home repair, education support,
              cleaning service, or skilled professional,
              SewaHub connects you with trusted people nearby.

            </p>


            <p className="mt-5 leading-8 text-gray-600">

              We believe every skilled worker deserves an opportunity
              to showcase their expertise while customers deserve
              quality service they can trust.

            </p>


          </div>




          <div className="rounded-3xl bg-white p-8 shadow">


            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                <Handshake />

              </div>


              <div>

                <h3 className="text-xl font-bold">

                  Trust First

                </h3>


                <p className="text-gray-500">

                  Building reliable connections between customers
                  and professionals.

                </p>

              </div>


            </div>



            <div className="mt-8 flex items-center gap-4">


              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600">

                <Search />

              </div>


              <div>


                <h3 className="text-xl font-bold">

                  Easy Discovery

                </h3>


                <p className="text-gray-500">

                  Search and book services quickly from anywhere.

                </p>


              </div>


            </div>


          </div>


        </div>


      </section>









      {/* Features */}


      <section className="bg-white py-20">


        <div className="container mx-auto px-6">


          <div className="mb-12 text-center">


            <h2 className="text-4xl font-bold">

              Why Choose SewaHub?

            </h2>


            <p className="mt-3 text-gray-500">

              Everything you need to find and book trusted services.

            </p>


          </div>





          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">


            {features.map((item)=>{


              const Icon=item.icon;


              return (

                <div

                  key={item.title}

                  className="rounded-3xl border bg-gray-50 p-6 transition hover:-translate-y-2 hover:shadow-xl"

                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                    <Icon />

                  </div>


                  <h3 className="mt-5 font-bold">

                    {item.title}

                  </h3>


                  <p className="mt-3 text-sm text-gray-500">

                    {item.description}

                  </p>


                </div>

              );


            })}


          </div>


        </div>


      </section>






      {/* CTA */}


      <section className="py-20">


        <div className="container mx-auto px-6">


          <div className="rounded-3xl bg-blue-600 p-10 text-center text-white">


            <h2 className="text-3xl font-bold md:text-4xl">

              Ready to find your trusted professional?

            </h2>


            <p className="mt-4 text-blue-100">

              Explore services available near you today.

            </p>



            <Link href="/services">


              <Button

                className="mt-6 bg-white text-blue-600 hover:bg-gray-100"

              >

                Explore Services

              </Button>


            </Link>


          </div>


        </div>


      </section>


    </div>

  );

}