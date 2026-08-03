"use client";

import {
  ShieldCheck,
  Lock,
  Calendar,
  KeyRound,
} from "lucide-react";


interface SecurityCardProps {

  user:{
    password:string|null;
    createdAt:Date;
    updatedAt:Date;
  };

}



export default function SecurityCard({

  user

}:SecurityCardProps){


const hasPassword =
  Boolean(user.password);



return (

<div

className="
rounded-2xl
border
bg-white
p-6
shadow-sm
"

>


<div className="mb-6">


<h2
className="
text-lg
font-semibold
"
>
Security
</h2>


<p
className="
text-sm
text-gray-500
"
>
Manage your account security
</p>


</div>





<div className="space-y-4">



<SecurityItem

icon={<Lock size={18}/>}

title="Password"

value={
hasPassword
?
"Password set"
:
"No password"
}

status={
hasPassword
?
"Secure"
:
"Required"
}

/>





<SecurityItem

icon={<Calendar size={18}/>}

title="Account Created"

value={

user.createdAt.toLocaleDateString(
"en-US",
{
month:"long",
day:"numeric",
year:"numeric"
}

)

}

/>





<SecurityItem

icon={<KeyRound size={18}/>}

title="Last Updated"

value={

user.updatedAt.toLocaleDateString(
"en-US",
{
month:"long",
day:"numeric",
year:"numeric"
}

)

}

/>





<div
className="
flex
items-center
gap-3
rounded-xl
bg-green-50
p-4
"
>


<ShieldCheck
className="text-green-600"
size={22}
/>


<div>

<p className="
font-medium
">

Account Protection

</p>


<p className="
text-sm
text-green-700
">

Your account is active and protected.

</p>


</div>


</div>




</div>



</div>

);

}







function SecurityItem({

icon,
title,
value,
status

}:{

icon:React.ReactNode;

title:string;

value:string;

status?:string;

}){


return (

<div

className="
flex
items-center
justify-between
rounded-xl
border
p-4
"

>


<div

className="
flex
items-center
gap-3
"

>


<div className="text-gray-500">

{icon}

</div>


<div>

<p className="
text-sm
text-gray-500
">

{title}

</p>


<p className="
font-medium
">

{value}

</p>


</div>


</div>





{
status && (

<span
className="
rounded-full
bg-green-100
px-3
py-1
text-xs
text-green-700
"
>

{status}

</span>

)

}



</div>

);

}