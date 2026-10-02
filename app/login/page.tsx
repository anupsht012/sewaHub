"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

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

    // Get fresh session for role
    const session = await authClient.getSession();
    const role = (session.data?.user as { role?: string } | undefined)?.role;

    setLoading(false);

    // If callbackUrl exists (from Book button), go there first - except ADMIN
    if (callbackUrl) {
      // Don't send ADMIN to customer page
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "PROVIDER" && callbackUrl.startsWith("/services")) {
        // Provider tried to book a service - send to provider dashboard
        toast.info("Provider accounts cannot book services");
        router.push("/provider");
      } else {
        router.push(callbackUrl);
      }
    } else {
      // No callback - normal role redirect
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "PROVIDER") {
        router.push("/provider");
      } else {
        router.push("/");
      }
    }

    setTimeout(() => router.refresh(), 300);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-gray-500">Login to your KaamSewa account</p>

        {callbackUrl && callbackUrl.startsWith("/services/") && (
          <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
            Please login to continue booking this service
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register"}
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