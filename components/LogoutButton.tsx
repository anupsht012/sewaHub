"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.refresh();
    router.push("/login");
  }

  return (
    <Button
      variant="destructive"
      className="cursor-pointer"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}