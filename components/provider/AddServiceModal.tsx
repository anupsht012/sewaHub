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
import { Image as ImageIcon, X, Upload } from "lucide-react";
import Image from "next/image";

interface AddServiceModalProps {
  providerCategory?: string;
}

export default function AddServiceModal({ providerCategory }: AddServiceModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: providerCategory || "",
    description: "",
    price: "",
  });

  useEffect(() => {
    if (providerCategory) {
      setForm((prev) => ({...prev, category: providerCategory }));
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
          setForm((prev) => ({...prev, category: setupCategory }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingProfile(false);
      }
    }
    fetchProviderCategory();
  }, [open, providerCategory]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setImageFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Use FormData for image
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category || "");
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/provider/services", {
        method: "POST",
        body: formData, // don't set Content-Type, browser does it
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create service");
        return;
      }

      toast.success("Service created successfully");
      setOpen(false);
      setForm({ name: "", category: form.category, description: "", price: "" });
      removeImage();
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

      <DialogContent className="max-h- overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={createService} className="mt-4 space-y-4">
          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-medium">Service Image</label>
            {previewUrl? (
              <div className="relative mt-2 group">
                <div className="relative h-48 w-full overflow-hidden rounded-xl border bg-slate-50">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="mt-2 flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100">
                <Upload className="mb-2 text-slate-400" />
                <span className="text-sm text-slate-600">Click to upload image</span>
                <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <Input name="name" placeholder="Service name" value={form.name} onChange={handleChange} required />

          <Input
            className="bg-slate-100 text-slate-700 font-medium"
            name="category"
            placeholder={fetchingProfile? "Loading category..." : "Category"}
            value={form.category}
            disabled
            required
          />

          <textarea
            name="description"
            className="w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Service description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />

          <Input name="price" type="number" placeholder="Price (NPR)" value={form.price} onChange={handleChange} required />

          <Button type="submit" className="w-full" disabled={loading || fetchingProfile}>
            {loading? "Creating..." : "Create Service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}