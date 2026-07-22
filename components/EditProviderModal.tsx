"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


export default function EditProviderModal({
  provider,
}: {
  provider: {
    bio: string | null;
    location: string;
  };
}) {


  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [bio, setBio] = useState(provider.bio || "");
  const [location, setLocation] = useState(provider.location);

  const [loading, setLoading] = useState(false);


async function updateProfile(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await fetch("/api/provider/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bio,
        location,
      }),
    });


    const data = await res.json();

    console.log("UPDATE RESPONSE:", data);


    if (!res.ok) {
      alert(data.error || "Update failed");
      return;
    }


    alert("Profile updated successfully");

    setOpen(false);

    router.refresh();


  } catch (error) {

    console.error("UPDATE ERROR:", error);
    alert("Something went wrong");

  } finally {

    setLoading(false);

  }
}


  return (
    <>

      <Button
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Edit Profile
      </Button>



      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">


          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">


            <h2 className="text-2xl font-bold">
              Edit Provider Profile
            </h2>



            <form
              onSubmit={updateProfile}
              className="mt-6 space-y-4"
            >


              <textarea
                className="w-full rounded-md border p-3"
                placeholder="About your service"
                value={bio}
                onChange={(e)=>
                  setBio(e.target.value)
                }
              />



              <Input
                placeholder="Location"
                value={location}
                onChange={(e)=>
                  setLocation(e.target.value)
                }
              />



              <div className="flex gap-3">


                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>



                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "Save"}
                </Button>


              </div>


            </form>


          </div>


        </div>

      )}

    </>
  );
}