import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";


export async function POST(
 request:Request,
 {
  params,
 }:{
  params:Promise<{id:string}>
 }
){


 const user =
 await getCurrentUser();



 if(!user){

  return NextResponse.redirect(
    new URL(
      "/login",
      request.url
    )
  );

 }



 const {id}=await params;



 const serviceRequest =
 await prisma.serviceRequest.findUnique({

  where:{
    id
  }

 });



 if(!serviceRequest){

  return NextResponse.json(
    {
      error:"Request not found"
    },
    {
      status:404
    }
  );

 }





 if(serviceRequest.customerId !== user.id){

  return NextResponse.json(
    {
      error:"Forbidden"
    },
    {
      status:403
    }
  );

 }





 await prisma.serviceRequest.update({

  where:{
    id
  },


  data:{
    status:"CANCELLED"
  }


 });





 return NextResponse.redirect(

  new URL(
    "/dashboard/requests",
    request.url
  )

 );


}