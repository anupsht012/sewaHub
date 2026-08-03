"use client";

import Image from "next/image";
import {
  Mail,
  Pencil,
  Camera,
  BadgeCheck,
} from "lucide-react";


type Role =
  | "CUSTOMER"
  | "PROVIDER"
  | "ADMIN";


interface ProfileHeaderProps {

  user:{
    name:string;
    email:string;
    image:string|null;
    emailVerified:boolean;
    createdAt:Date;
  };

  role:Role;

}



const roleConfig={

  CUSTOMER:{
    label:"Customer",
    color:"bg-blue-100 text-blue-700"
  },

  PROVIDER:{
    label:"Provider",
    color:"bg-green-100 text-green-700"
  },

  ADMIN:{
    label:"Admin",
    color:"bg-purple-100 text-purple-700"
  }

};




export default function ProfileHeader({

 user,
 role

}:ProfileHeaderProps){


  const profileCompletion =
    [
      user.name,
      user.email,
      user.image
    ]
    .filter(Boolean)
    .length
    /
    3
    *
    100;



return (

<div className="
 rounded-2xl
 border
 bg-white
 p-6
 shadow-sm
">


<div className="
 flex
 flex-col
 gap-6
 md:flex-row
 md:justify-between
">



<div className="
 flex
 items-center
 gap-5
">


<div className="
 relative
">


<div className="
 h-24
 w-24
 overflow-hidden
 rounded-full
 bg-gray-100
">


{
user.image ?

<Image

src={user.image}

alt={user.name}

width={96}

height={96}

className="
h-full
w-full
object-cover
"

/>

:

<div className="
flex
h-full
items-center
justify-center
text-3xl
font-bold
text-gray-500
">

{user.name.charAt(0)}

</div>

}


</div>



<button
className="
absolute
bottom-0
right-0
flex
h-8
w-8
items-center
justify-center
rounded-full
bg-primary
text-white
"
>

<Camera size={15}/>

</button>


</div>





<div>


<div className="
flex
items-center
gap-3
">


<h2 className="
text-2xl
font-bold
">

{user.name}

</h2>


<span
className={`
rounded-full
px-3
py-1
text-xs
font-medium
${roleConfig[role].color}
`}
>

{roleConfig[role].label}

</span>


</div>



<div className="
mt-2
flex
items-center
gap-2
text-sm
text-gray-500
">

<Mail size={15}/>

{user.email}

</div>




<p className="
mt-2
text-sm
text-gray-500
">

Joined{" "}

{
user.createdAt.toLocaleDateString(
"en-US",
{
month:"long",
year:"numeric"
}
)
}

</p>



{
user.emailVerified && (

<div className="
mt-3
inline-flex
items-center
gap-1
rounded-full
bg-green-100
px-3
py-1
text-xs
text-green-700
">

<BadgeCheck size={14}/>

Verified

</div>

)
}


</div>


</div>





<button
className="
flex
h-fit
items-center
gap-2
rounded-xl
border
px-4
py-2
text-sm
"
>

<Pencil size={16}/>

Edit Profile

</button>


</div>





<div className="mt-8">


<div className="
mb-2
flex
justify-between
text-sm
">

<span>
Profile Completion
</span>


<span>
{Math.round(profileCompletion)}%
</span>


</div>


<div className="
h-2
rounded-full
bg-gray-100
">

<div

className="
h-2
rounded-full
bg-primary
"

style={{
width:`${profileCompletion}%`
}}

/>


</div>


</div>


</div>

);

}