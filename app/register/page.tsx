"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });


  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);

 const { data, error } = await authClient.signUp.email({
  name: form.name,
  email: form.email,
  password: form.password,
});

  setLoading(false);

  if (error) {
  console.log("BETTER AUTH ERROR:", error);
  alert(JSON.stringify(error));
  return;
}

  alert("Account created successfully!");

await fetch("/api/user/update-role", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    role: form.role,
  }),
});

router.push("/login");
}



  return (

    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">


        <h1 className="text-3xl font-bold">
          Create Account
        </h1>


        <p className="mt-2 text-gray-500">
          Join SewaHub Nepal today.
        </p>



        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >


          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />



          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />



          <div className="relative">

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />


            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >

              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}

            </button>


          </div>




          <select
            className="w-full rounded-md border p-2 cursor-pointer"
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
              })
            }
          >

            <option value="CUSTOMER">
              Customer
            </option>


            <option value="PROVIDER">
              Service Provider
            </option>


          </select>




          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >

            {loading
              ? "Creating..."
              : "Create Account"}

          </Button>



        </form>


      </div>

    </div>

  );
}