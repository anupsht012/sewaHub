"use client";

import {
  CalendarDays,
  CreditCard,
  Bell,
  CheckCircle,
  UserRound,
  XCircle,
} from "lucide-react";


interface RecentActivityProps {

  activities:{
    id:string;
    title:string;
    message:string;
    type:
      | "BOOKING_REQUEST"
      | "BOOKING_ACCEPTED"
      | "BOOKING_REJECTED"
      | "BOOKING_COMPLETED"
      | "BOOKING_CANCELLED"
      | "PAYMENT_SUCCESS"
      | "PAYMENT_FAILED"
      | "SYSTEM_ALERT"
      | "PROVIDER_APPLICATION"
      | "SERVICE_CREATED"
      | "SERVICE_UPDATED"
      | "SERVICE_DELETED";
    createdAt:Date;
    isRead:boolean;
  }[];

}





export default function RecentActivity({

  activities

}:RecentActivityProps){



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
Recent Activity
</h2>


<p
className="
text-sm
text-gray-500
"
>
Latest account updates
</p>


</div>





{
activities.length === 0 ?


(

<div
className="
rounded-xl
border-dashed
border
p-8
text-center
text-sm
text-gray-500
"
>

No activity yet

</div>

)


:


(

<div className="space-y-4">


{
activities.map(activity=>(


<div

key={activity.id}

className="
flex
gap-4
rounded-xl
border
p-4
"

>


<div
className="
mt-1
"
>

<ActivityIcon

type={activity.type}

/>

</div>




<div className="flex-1">


<div
className="
flex
justify-between
gap-3
"
>


<h3
className="
font-medium
"
>

{activity.title}

</h3>



{
!activity.isRead && (

<span
className="
h-2
w-2
rounded-full
bg-blue-600
"
>

</span>

)

}


</div>



<p
className="
text-sm
text-gray-500
"
>

{activity.message}

</p>



<p
className="
mt-1
text-xs
text-gray-400
"
>

{
activity.createdAt.toLocaleDateString(
"en-US",
{
month:"short",
day:"numeric",
year:"numeric"
}
)

}

</p>



</div>



</div>


))

}


</div>

)

}


</div>

);

}







function ActivityIcon({

type

}:{

type:string;

}){


if(type.includes("PAYMENT"))

return (

<CreditCard
className="text-green-600"
/>

);



if(type.includes("BOOKING"))

return (

<CalendarDays
className="text-blue-600"
/>

);



if(
type === "BOOKING_REJECTED" ||
type === "PAYMENT_FAILED"
)

return (

<XCircle
className="text-red-600"
/>

);



if(
type==="PROVIDER_APPLICATION" ||
type==="SYSTEM_ALERT"
)

return (

<UserRound
className="text-purple-600"
/>

);



if(
type.includes("SERVICE")
)

return (

<CheckCircle
className="text-green-600"
/>

);



return (

<Bell
className="text-gray-500"
/>

);


}