"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddServiceModalProps {
  providerCategory?: string;
}

export default function AddServiceModal({ providerCategory }: AddServiceModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: providerCategory,
    description: "",
    price: "",
  });

  // Sync prop when provided, or fetch fallback when modal opens
  useEffect(() => {
    if (providerCategory) {
      setForm((prev) => ({ ...prev, category: providerCategory }));
      return;
    }

    async function fetchProviderCategory() {
      if (!open) return;

      try {
        setFetchingProfile(true);
        const res = await fetch("/api/provider/setup");
        const data = await res.json();

        const setupCategory = data?.category || data?.provider?.category || "";

        if (res.ok && setupCategory) {
          setForm((prev) => ({
            ...prev,
            category: setupCategory,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch provider category:", error);
      } finally {
        setFetchingProfile(false);
      }
    }

    fetchProviderCategory();
  }, [open, providerCategory]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function createService(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/provider/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create service");
        return;
      }

      toast.success("Service created successfully");

      setOpen(false);

      setForm({
        name: "",
        category: form.category,
        description: "",
        price: "",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button className="cursor-pointer">+ Add Service</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={createService} className="mt-4 space-y-4">
          <div>
           
            <Input
              className="mt-1"
              name="name"
              placeholder="Service name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
           
            <Input
              className="mt-1 bg-slate-100 text-slate-700 cursor-not-allowed font-medium"
              name="category"
              placeholder={
                fetchingProfile
                  ? "Loading category..."
                  : form.category 
              }
              value={form.category}
              disabled
              required
            />
          </div>

          <div>
           
            <textarea
              name="description"
              className="mt-1 w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Service description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div>
           
            <Input
              className="mt-1"
              name="price"
              type="number"
              placeholder="Price (NPR)"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading || fetchingProfile}
          >
            {loading ? "Creating..." : "Create Service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}