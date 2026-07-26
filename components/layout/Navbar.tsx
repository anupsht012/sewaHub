"use client";

import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
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



  const user =
    session?.user as NavUser | undefined;



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





  async function handleLogout(){

    await authClient.signOut();

    await refetch();

    router.refresh();

    router.push("/login");

    setOpen(false);

  }






  if(isPending){

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
className="flex items-center gap-2"
onClick={()=>setOpen(false)}
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





{/* Desktop links */}

<nav className="hidden items-center gap-8 md:flex">


{navLinks.map((item)=>(

<Link
key={item.href}
href={item.href}
className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
>

{item.name}

</Link>

))}


</nav>





{/* Desktop account */}

<div className="hidden items-center gap-3 md:flex">


{user ? (

<>


<div className="relative group">


<div className="flex cursor-pointer items-center gap-1 text-sm font-medium">

Hi, {user.name}

<ChevronDown size={16}/>

</div>




<div
className="
absolute 
right-0
top-full
pt-3
hidden
group-hover:block
z-50
"
>


<div className="w-52 rounded-xl border bg-white p-2 shadow-xl">


{userLinks.map((item)=>(


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





<Button

variant="destructive"

className="cursor-pointer"

onClick={handleLogout}

>

Logout

</Button>


</>


):(


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

<Button
className="cursor-pointer"
>

Get Started

</Button>

</Link>


</>


)}


</div>







{/* Mobile button */}


<Button

variant="ghost"

size="icon"

className="md:hidden"

onClick={()=>setOpen(!open)}

>


{open ?

<X/>

:

<Menu/>

}


</Button>



</div>








{/* Mobile menu */}

{open && (

<div className="border-t bg-white md:hidden">


<div className="container mx-auto flex flex-col gap-4 px-4 py-6">



{navLinks.map((item)=>(


<Link

key={item.href}

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




{userLinks.map((item)=>(

<Link

key={item.href}

href={item.href}

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

className="w-full"

onClick={handleLogout}

>

Logout

</Button>


</div>


):(


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

<Button className="w-full">

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