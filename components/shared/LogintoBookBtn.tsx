"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginToBookButton() {

  const router = useRouter();


  return (
    <Button
      onClick={() => router.push("/login")}
      className="w-full cursor-pointer"
    >
      Login to Book
    </Button>
  );

}