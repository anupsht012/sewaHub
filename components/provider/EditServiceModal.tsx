"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload } from "lucide-react";
import Image from "next/image";

export default function EditServiceModal({
  service,
}: {
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image?: string | null;
  };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(service.image || null);
  const [removeImage, setRemoveImage] = useState(false);

  const [form, setForm] = useState({
    name: service.name,
    description: service.description || "",
    price: service.price.toString(),
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setImageFile(file);
    setRemoveImage(false);
    if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setRemoveImage(true);
  }

  async function updateService(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (imageFile) formData.append("image", imageFile);
      if (removeImage) formData.append("removeImage", "true");

      const res = await fetch(`/api/provider/services/${service.id}`, {
        method: "PATCH",
        body: formData, // important: no Content-Type header
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update service");
        return;
      }

      toast.success("Service updated successfully");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button variant="outline" className="cursor-pointer">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h- overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={updateService} className="space-y-4">
          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium">Service Image</label>
            {previewUrl? (
              <div className="relative mt-2">
                <div className="relative h-48 w-full overflow-hidden rounded-xl border bg-slate-50">
                  <Image src={previewUrl} alt="Service" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
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

          <Input
            placeholder="Service name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value })}
            required
          />

          <textarea
            className="w-full h-32 rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Service description"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Price (NPR)"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value })}
            required
          />

          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}