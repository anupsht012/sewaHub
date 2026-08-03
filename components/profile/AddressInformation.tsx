"use client";

import {
  MapPin,
  Home,
  Building2,
  Map,
  Plus,
} from "lucide-react";


interface AddressInformationProps {

  user:{
    addresses:{
      id:string;
      label:string|null;
      province:string;
      district:string;
      city:string;
      area:string|null;
      street:string|null;
      landmark:string|null;
      isDefault:boolean;
    }[];
  };

}



export default function AddressInformation({

  user,

}:AddressInformationProps){


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

<div
className="
mb-6
flex
items-center
justify-between
"
>


<div>

<h2
className="
text-lg
font-semibold
"
>
Address Information
</h2>


<p
className="
text-sm
text-gray-500
"
>
Manage your saved addresses
</p>


</div>



<button
className="
flex
items-center
gap-2
rounded-xl
border
px-4
py-2
text-sm
hover:bg-gray-50
"
>

<Plus size={16}/>

Add Address

</button>


</div>





{
user.addresses.length === 0 ?


(

<div
className="
rounded-xl
border
border-dashed
p-8
text-center
text-sm
text-gray-500
"
>

No address added yet

</div>

)


:


(

<div
className="
grid
gap-5
md:grid-cols-2
"
>


{
user.addresses.map((address)=>(


<div

key={address.id}

className="
rounded-xl
border
p-5
"

>


<div
className="
mb-4
flex
items-center
justify-between
"
>


<div
className="
flex
items-center
gap-2
font-semibold
"
>

<Home size={18}/>

{address.label || "Address"}

</div>




{
address.isDefault && (

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
Default
</span>

)
}


</div>





<div className="space-y-3">


<AddressItem

icon={<MapPin size={16}/>}

label="Province"

value={address.province}

/>



<AddressItem

icon={<Building2 size={16}/>}

label="District"

value={address.district}

/>



<AddressItem

icon={<Map size={16}/>}

label="City"

value={address.city}

/>



<AddressItem

icon={<Home size={16}/>}

label="Area"

value={address.area || "Not added"}

/>



<AddressItem

icon={<MapPin size={16}/>}

label="Street"

value={address.street || "Not added"}

/>



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





function AddressItem({

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


<div
className="
mt-1
text-gray-500
"
>
{icon}
</div>



<div>

<p
className="
text-xs
text-gray-500
"
>
{label}
</p>


<p
className="
font-medium
"
>
{value}
</p>


</div>


</div>

);

}