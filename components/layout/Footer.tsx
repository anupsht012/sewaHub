import Link from "next/link";


const links = [

  {
    name: "Services",
    href: "/services",
  },

  {
    name: "About",
    href: "/#about",
  },

  {
    name: "Contact",
    href: "/#contact",
  },

  {
    name: "Privacy Policy",
    href: "/privacy",
  },

  {
    name: "Terms",
    href: "/terms",
  },

];



export default function Footer() {


  return (

    <footer className="bg-gray-900 text-gray-300">


      <div className="container mx-auto px-6 py-12">



        <div className="
        grid
        gap-10
        sm:grid-cols-2
        md:grid-cols-3
        ">





          {/* Brand */}


          <div>


            <h2 className="
            text-2xl
            font-bold
            text-white
            ">

              SewaHub Nepal

            </h2>





            <p className="
            mt-3
            max-w-sm
            text-sm
            text-gray-400
            ">

              Nepal's trusted marketplace for finding
              verified local professionals.

            </p>





            <Link

              href="/services"

              className="
              mt-5
              inline-block
              rounded-full
              bg-blue-600
              px-5
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              "

            >

              Find Services

            </Link>



          </div>







          {/* Links */}


          <div>


            <h3 className="
            font-semibold
            text-white
            ">

              Quick Links

            </h3>





            <div className="
            mt-4
            flex
            flex-col
            gap-3
            ">


              {links.map((link)=>(


                <Link

                  key={link.name}

                  href={link.href}

                  className="
                  text-sm
                  transition
                  hover:text-white
                  "

                >

                  {link.name}

                </Link>


              ))}


            </div>


          </div>









          {/* Contact */}


          <div id="contact">


            <h3 className="
            font-semibold
            text-white
            ">

              Contact

            </h3>





            <div className="
            mt-4
            space-y-3
            text-sm
            ">


              <p>

                📍 Kathmandu, Nepal

              </p>



              <p>

                ✉️ support@sewahub.com

              </p>



              <p>

                📞 +977 9800000000

              </p>



            </div>





          </div>





        </div>









        <div className="
        mt-10
        border-t
        border-gray-700
        pt-6
        text-center
        text-sm
        ">


          © 2026 SewaHub Nepal.
          All rights reserved.



        </div>





      </div>


    </footer>


  );

}