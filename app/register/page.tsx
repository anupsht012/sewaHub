"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

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

    const { error } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message || "Registration failed");
      return;
    }

    // Update role
    try {
      await fetch("/api/user/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: form.role }),
      });
    } catch (err) {
      console.error("ROLE UPDATE FAILED", err);
    }

    toast.success("Account created! Please login.");
    setLoading(false);

    // Preserve callbackUrl to login
    if (callbackUrl) {
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-gray-500">Join KaamSewa Nepal today.</p>

        {callbackUrl && callbackUrl.startsWith("/services/") && (
          <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
            Create account to continue booking this service
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            minLength={2}
          />

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
              placeholder="Password (min 8 chars)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <select
            className="w-full rounded-xl border border-slate-200 h-11 px-3 text-sm cursor-pointer bg-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CUSTOMER">Customer - I need services</option>
            <option value="PROVIDER">Service Provider - I offer services</option>
          </select>

          <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
              className="font-medium text-blue-600 hover:underline"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}