"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    toast.success("Logged in successfully!");
    // Get the logged-in user
    const session = await authClient.getSession();

    setLoading(false);

    const role = (session.data?.user as { role?: string } | undefined)?.role;

    router.refresh();

    if (role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (role === "PROVIDER") {
      router.push("/provider");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-gray-500">
          Login to your SewaHub account
        </p>


        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >

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
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>


          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register"
              className="font-medium text-blue-600 hover:underline"
            >

              Register Here
            </Link>
          </div>
        </form>


      </div>

    </div>
  );
}

