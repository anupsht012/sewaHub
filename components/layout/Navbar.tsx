"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";


const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Become a Provider", href: "/provider" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];


interface NavUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export default function Navbar() {


  const router = useRouter();

  const [open, setOpen] = useState(false);


  const {
    data: session,
    isPending,
    refetch,
  } = authClient.useSession();


  const user = (session?.user as unknown) as NavUser | undefined;



  const dashboardLink =
    user?.role === "PROVIDER"
      ? "/provider/dashboard"
      : user?.role === "ADMIN"
      ? "/admin/dashboard"
      : "/dashboard";




  async function handleLogout() {

    await authClient.signOut();

    await refetch();

    router.refresh();

    router.push("/login");

    setOpen(false);

  }





  if (isPending) {

    return (

      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">

        <div className="container mx-auto flex h-16 items-center px-4">

          <span className="font-bold">
            SewaHub Nepal
          </span>

        </div>

      </header>

    );

  }






  return (


    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">


      <div className="container mx-auto flex h-16 items-center justify-between px-4">



        {/* Logo */}


        <Link
          href="/"
          onClick={()=>setOpen(false)}
          className="flex items-center gap-2"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">

            S

          </div>


          <div className="hidden sm:block">

            <h1 className="text-lg font-bold">
              SewaHub Nepal
            </h1>

            <p className="text-xs text-gray-500">
              Trusted Local Services
            </p>

          </div>


        </Link>







        {/* Desktop Navigation */}


        <nav className="hidden items-center gap-8 md:flex">


          {navLinks?.map((item)=>(


            <Link

              key={item.name}

              href={item.href}

              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"

            >

              {item.name}

            </Link>


          ))}


        </nav>







        {/* Desktop Actions */}


        <div className="hidden items-center gap-3 md:flex">


          {user ? (

            <>


              <span className="text-sm font-medium">

                Hi, {user.name}

              </span>



              <Link href={dashboardLink}>

                <Button className="cursor-pointer">

                  Dashboard

                </Button>

              </Link>




              <Button

                variant="destructive"
className='cursor-pointer'
                onClick={handleLogout}

              >

                Logout

              </Button>


            </>


          ) : (


            <>


              <Link href="/login">

                <Button variant="outline" className='cursor-pointer'>

                  Login

                </Button>

              </Link>



              <Link href="/register">

                <Button className='cursor-pointer'>

                  Get Started

                </Button>

              </Link>


            </>


          )}



        </div>







        {/* Mobile Menu Button */}


        <Button

          variant="ghost"

          size="icon"

          className="md:hidden"

          onClick={()=>setOpen(!open)}

        >


          {open ? (

            <X className="h-6 w-6"/>

          ) : (

            <Menu className="h-6 w-6"/>

          )}



        </Button>




      </div>








      {/* Mobile Menu */}


      {open && (


        <div className="border-t bg-white md:hidden">


          <div className="container mx-auto flex flex-col gap-4 px-4 py-6">



            {navLinks?.map((item)=>(


              <Link

                key={item.name}

                href={item.href}

                onClick={()=>setOpen(false)}

                className="text-sm font-medium text-gray-700 hover:text-blue-600"

              >

                {item.name}

              </Link>


            ))}






            <div className="border-t pt-4">


              {user ? (

                <div className="flex flex-col gap-3">


                  <p className="text-sm font-medium">

                    Hi, {user.name}

                  </p>



                  <Link href={dashboardLink}>

                    <Button className="w-full cursor-pointer">

                      Dashboard

                    </Button>

                  </Link>



                  <Button

                    variant="destructive"

                    className="w-full cursor-pointer"

                    onClick={handleLogout}

                  >

                    Logout

                  </Button>



                </div>


              ) : (


                <div className="flex flex-col gap-3">


                  <Link href="/login">

                    <Button

                      variant="outline"

                      className="w-full"

                    >

                      Login

                    </Button>

                  </Link>




                  <Link href="/register">


                    <Button

                      className="w-full"

                    >

                      Get Started

                    </Button>


                  </Link>


                </div>


              )}


            </div>



          </div>


        </div>


      )}



    </header>


  );

}