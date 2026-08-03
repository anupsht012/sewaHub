"use client";

import {
  User,
  Mail,
  Phone,
  Calendar,
  VenusAndMars,
  FileText,
} from "lucide-react";


interface PersonalInformationProps {

  user:{
    name:string;
    email:string;
    phone?:string|null;
    gender?:string|null;
    dateOfBirth?:Date|null;
    bio?:string|null;
  };

}



export default function PersonalInformation({
  user,
}:PersonalInformationProps){


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


{/* Header */}

<div className="
mb-6
flex
items-center
justify-between
">


<div>

<h2 className="
text-lg
font-semibold
">

Personal Information

</h2>


<p className="
text-sm
text-gray-500
">

Your account details

</p>


</div>



<button
className="
rounded-xl
border
px-4
py-2
text-sm
hover:bg-gray-50
"
>

Edit

</button>


</div>





<div
className="
grid
gap-6
md:grid-cols-2
"
>


<InfoItem

icon={<User size={18}/>}

label="Full Name"

value={user.name}

/>



<InfoItem

icon={<Mail size={18}/>}

label="Email"

value={user.email}

/>



<InfoItem

icon={<Phone size={18}/>}

label="Phone"

value={
user.phone ?? "Not added"
}

/>



<InfoItem

icon={<VenusAndMars size={18}/>}

label="Gender"

value={
user.gender ?? "Not added"
}

/>



<InfoItem

icon={<Calendar size={18}/>}

label="Date of Birth"

value={
user.dateOfBirth
?
user.dateOfBirth.toLocaleDateString()
:
"Not added"
}

/>


</div>





<div className="mt-6">


<InfoItem

icon={<FileText size={18}/>}

label="Bio"

value={
user.bio ?? "No bio added"
}

/>


</div>



</div>

);

}






function InfoItem({

icon,
label,
value,

}:{

icon:React.ReactNode;

label:string;

value:string;

}){


return (

<div
className="
flex
gap-3
"
>


<div className="
mt-1
text-gray-500
">

{icon}

</div>



<div>

<p className="
text-sm
text-gray-500
">

{label}

</p>


<p className="
font-medium
">

{value}

</p>


</div>


</div>

);

}