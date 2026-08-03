"use client";

import {
  BadgeCheck,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
} from "lucide-react";


type Role =
  | "CUSTOMER"
  | "PROVIDER"
  | "ADMIN";



interface VerificationCardProps {


  role:Role;


  user:{

    emailVerified:boolean;

    phone?:string|null;

    phoneVerified?:boolean;

  };


  providerVerified?:boolean;


}





export default function VerificationCard({

  role,

  user,

  providerVerified

}:VerificationCardProps){



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
Verification
</h2>


<p
className="
text-sm
text-gray-500
"
>
Account verification status
</p>


</div>





<div className="space-y-4">



<VerificationItem

icon={<Mail size={18}/>}

title="Email Verification"

verified={user.emailVerified}

/>





<VerificationItem

icon={<Phone size={18}/>}

title="Phone Verification"

verified={
user.phoneVerified ?? false
}

/>





{
role === "PROVIDER" && (


<VerificationItem

icon={<ShieldCheck size={18}/>}

title="Provider Verification"

verified={
providerVerified ?? false
}

/>


)

}






{
role === "ADMIN" && (

<div
className="
flex
items-center
gap-3
rounded-xl
bg-purple-50
p-4
"
>


<BadgeCheck
className="text-purple-600"
size={22}
/>



<div>

<p
className="
font-medium
"
>
Administrator Account
</p>


<p
className="
text-sm
text-purple-700
"
>
System verified
</p>


</div>


</div>


)

}



</div>



</div>


);

}





function VerificationItem({

icon,

title,

verified


}:{

icon:React.ReactNode;

title:string;

verified:boolean;

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



<span className="font-medium">

{title}

</span>



</div>





{
verified ?


<span
className="
flex
items-center
gap-1
rounded-full
bg-green-100
px-3
py-1
text-xs
text-green-700
"
>

<BadgeCheck size={14}/>

Verified

</span>


:


<span
className="
flex
items-center
gap-1
rounded-full
bg-yellow-100
px-3
py-1
text-xs
text-yellow-700
"
>

<Clock size={14}/>

Pending

</span>


}



</div>

);

}