"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function ProviderSetupForm() {

    const router = useRouter();


    const [form, setForm] = useState({
        bio: "",
        location: "",
    });


    const [loading, setLoading] = useState(false);



    async function submit(e: React.FormEvent) {
        e.preventDefault();
        console.log('btn clicked')
        setLoading(true);

        try {
            const res = await fetch("/api/provider/setup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });


            const data = await res.json();

            console.log("PROVIDER SETUP RESPONSE:", data);


            if (!res.ok) {
                alert(data.error || "Something went wrong");
                return;
            }


            alert("Provider profile created!");

            router.push("/provider/dashboard");
            router.refresh();


        } catch (error) {

            console.error("SETUP ERROR:", error);
            alert("Network error");

        } finally {

            setLoading(false);

        }
    }



    return (

        <form
            onSubmit={submit}
            className="space-y-4"
        >

            <textarea
                className="w-full rounded-md border p-3"
                placeholder="About your service..."
                value={form.bio}
                onChange={(e) =>
                    setForm({
                        ...form,
                        bio: e.target.value
                    })
                }
            />


            <Input
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                    setForm({
                        ...form,
                        location: e.target.value
                    })
                }
            />


            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? "Saving..." : "Create Profile"}
            </Button>


        </form>

    );
}