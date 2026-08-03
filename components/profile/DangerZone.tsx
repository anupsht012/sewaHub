"use client";

import {
  AlertTriangle,
  LogOut,
  UserX,
  Trash2,
} from "lucide-react";



type Role =
  | "CUSTOMER"
  | "PROVIDER"
  | "ADMIN";



interface DangerZoneProps {

  role:Role;

}





export default function DangerZone({

  role

}:DangerZoneProps){



return (

<div

className="
rounded-2xl
border
border-red-200
bg-red-50
p-6
"

>


<div className="mb-6 flex items-center gap-3">


<div
className="
rounded-full
bg-red-100
p-2
text-red-600
"
>

<AlertTriangle size={22}/>

</div>



<div>

<h2
className="
text-lg
font-semibold
text-red-700
"
>

Danger Zone

</h2>


<p
className="
text-sm
text-red-600
"
>

Irreversible account actions

</p>


</div>


</div>





<div className="space-y-4">



<ActionItem

icon={<LogOut size={18}/>}

title="Logout all devices"

description="Sign out from all active sessions."

button="Logout"

/>





<ActionItem

icon={<UserX size={18}/>}

title="Deactivate Account"

description={
role==="ADMIN"
?
"Admin accounts cannot be deactivated here."
:
"Temporarily disable your account."
}

button="Deactivate"

disabled={
role==="ADMIN"
}

/>





<ActionItem

icon={<Trash2 size={18}/>}

title="Delete Account"

description={
role==="ADMIN"
?
"Contact system owner to remove admin account."
:
"Delete your account permanently."
}

button="Delete"

danger

disabled={
role==="ADMIN"
}

/>



</div>



</div>

);

}








function ActionItem({

icon,

title,

description,

button,

danger,

disabled,

}:{

icon:React.ReactNode;

title:string;

description:string;

button:string;

danger?:boolean;

disabled?:boolean;

}){


return (

<div

className="
flex
flex-col
gap-4
rounded-xl
border
bg-white
p-4
sm:flex-row
sm:items-center
sm:justify-between
"

>


<div
className="
flex
gap-3
"
>


<div className="text-red-600">

{icon}

</div>



<div>

<h3
className="
font-medium
"
>

{title}

</h3>


<p
className="
text-sm
text-gray-500
"
>

{description}

</p>


</div>


</div>





<button

disabled={disabled}

className={`

rounded-lg
px-4
py-2
text-sm

${
danger
?
"bg-red-600 text-white hover:bg-red-700"
:
"border border-red-300 text-red-600 hover:bg-red-50"
}

${
disabled
?
"cursor-not-allowed opacity-50"
:
""
}

`}

>


{button}


</button>



</div>

);

}