"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginToBookButton({ callbackUrl = "/services" }: { callbackUrl?: string }) {
  return (
    <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="block">
      <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
        <LogIn className="h-4 w-4 mr-2" /> Login to Book
      </Button>
    </Link>
  );
}