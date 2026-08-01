"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";
import LOGO from "@/public/logo.png";
import NotificationBell from "../notifications/NotificationBell";

interface NavUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
}


export default function Navbar({
  user,
}: {
  user?: NavUser | null;
}) {

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);


  const navLinks = [
    {
      name: "Home",
      href: "/",
    },

    {
      name: "Services",
      href: "/services",
    },

    {
      name: "About",
      href: "/about",
    },

    {
      name: "Contact",
      href: "/contact",
    },
  ];




  const userLinks =

    user?.role === "PROVIDER"

      ? [

        {
          name: "Provider Dashboard",
          href: "/provider/dashboard",
        },

        {
          name: "My Services",
          href: "/provider/services",
        },

        {
          name: "My Offers",
          href: "/provider/offers",
        },

      ]


      : user?.role === "ADMIN"

        ? [

          {
            name: "Admin Panel",
            href: "/admin/dashboard",
          },

        ]


        : [

          {
            name: "Dashboard",
            href: "/dashboard",
          },

          {
            name: "My Requests",
            href: "/dashboard/requests",
          },

          {
            name: "My Bookings",
            href: "/dashboard/bookings",
          },

        ];







  async function handleLogout() {
    try {
      setLoggingOut(true);
      await authClient.signOut();

      setOpen(false);

      window.location.href = "/login";
      toast.success("Logged out successfully!");

    } catch (error) {
      setLoggingOut(false);
      console.error("Logout failed:", error);

    }
  }








  return (

    <header
      className="
sticky
top-0
z-50
border-b
bg-white/80
backdrop-blur
"
    >


      <div
        className="
container
mx-auto
flex
h-16
items-center
justify-between
px-4
"
      >



        {/* LOGO */}

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2"
        >

<div>
  <Image src={LOGO} alt="KaamSewa Logo" width={90} height={90} />
</div>


        </Link>









        {/* DESKTOP NAV */}

        <nav
          className="
hidden
items-center
gap-8
md:flex
"
        >


          {navLinks.map((item) => (

            <Link
              key={item.href}
              href={item.href}
              className="
text-sm
font-medium
text-gray-700
hover:text-blue-600
"
            >

              {item.name}

            </Link>

          ))}



          {(!user || user.role === "CUSTOMER") && (

            <Link
              href={user ? "/provider/apply" : "/login"}
              className="
text-sm
font-medium
text-blue-600
"
            >

              Become a Provider

            </Link>

          )}



        </nav>









        {/* DESKTOP ACCOUNT */}

        <div
          className="
hidden
items-center
gap-3
md:flex
"
        >


          {user ? (

            <>


              <div
                className="
relative
group
"
              >


                <div
                  className="
flex
cursor-pointer
items-center
gap-1
text-sm
font-medium
"
                >

                  Hi, {user.name}

                  <ChevronDown size={16} />

                </div>





                <div
                  className="
absolute
right-0
top-full
hidden
pt-3
group-hover:block
"
                >


                  <div
                    className="
w-52
rounded-xl
border
bg-white
p-2
shadow-xl
"
                  >


                    {userLinks.map((item) => (

                      <Link
                        key={item.href}
                        href={item.href}
                        className="
block
rounded-lg
px-3
py-2
text-sm
text-gray-700
hover:bg-gray-100
"
                      >

                        {item.name}

                      </Link>

                    ))}


                  </div>


                </div>


              </div>





              <NotificationBell  />
              <Button className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-2 py-2 text-white hover:bg-red-700 transition-colors" 
              onClick={handleLogout}
                disabled={loggingOut}>
      <LogOut size={20} />
    </Button>


            </>


          )

            : (

              <>

                <Link href="/login">

                  <Button
                    variant="outline"
                    className="cursor-pointer"
                  >

                    Login

                  </Button>

                </Link>


                <Link href="/register">

                  <Button className="cursor-pointer">

                    Get Started

                  </Button>

                </Link>


              </>

            )}



        </div>








        {/* MOBILE BUTTON */}

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >

          {
            open
              ?
              <X />
              :
              <Menu />
          }

        </Button>



      </div>










      {/* MOBILE MENU */}

      {

        open && (

          <div
            className="
border-t
bg-white
md:hidden
"
          >


            <div
              className="
container
mx-auto
flex
flex-col
gap-4
px-4
py-6
"
            >


              {navLinks.map((item) => (

                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="
text-sm
font-medium
"
                >

                  {item.name}

                </Link>

              ))}




              {(!user || user.role === "CUSTOMER") && (

                <Link
                  href="/provider/apply"
                  onClick={() => setOpen(false)}
                >

                  <Button
                    variant="outline"
                    className="w-full"
                  >

                    Become a Provider

                  </Button>

                </Link>

              )}




              <div
                className="
border-t
pt-4
"
              >


                {user ? (

                  <div
                    className="
flex
flex-col
gap-3
"
                  >


                    <p className="font-medium">

                      Hi, {user.name}

                    </p>



                    {userLinks.map((item) => (

                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                      >

                        <Button
                          variant="outline"
                          className="w-full"
                        >

                          {item.name}

                        </Button>

                      </Link>

                    ))}



                    <Button
                      variant="destructive"
                      className="w-full cursor-pointer"
                      onClick={handleLogout}
                    >

                      Logout

                    </Button>


                  </div>


                )

                  : (

                    <div
                      className="
flex
flex-col
gap-3
"
                    >


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

        )

      }



    </header>

  );

}