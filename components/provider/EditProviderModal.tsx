"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export default function EditProviderModal({
  provider,
}: {
  provider: {
    bio: string | null;
    location: string;
    category?: string | null;
    coverImage?: string | null;
  };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState(provider.bio || "");
  const [location, setLocation] = useState(provider.location);
  const [category, setCategory] = useState(provider.category || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(provider.coverImage || null);
  const [loading, setLoading] = useState(false);

  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Max 3MB");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("bio", bio);
      fd.append("location", location);
      fd.append("category", category);
      if (coverFile) fd.append("coverImage", coverFile);

      const res = await fetch("/api/provider/update", {
        method: "PATCH",
        body: fd, // ✅ FormData, no Content-Type header
      });

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (!res.ok) {
        toast.error(data.error || "Update failed");
        return;
      }

      toast.success("Profile updated successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="cursor-pointer mt-2">
        Edit Profile
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded- bg-white p-8 shadow-xl max-h- overflow-y-auto">
            <h2 className="text-2xl font-bold">Edit Provider Profile</h2>

            <form onSubmit={updateProfile} className="mt-6 space-y-5">
              {/* ✅ Cover Image Edit */}
              <div>
                <label className="text-sm font-medium">Cover Image</label>
                <div className="mt-2 relative overflow-hidden rounded-xl border-2 border-dashed">
                  {coverPreview? (
                    <div className="relative h-36 w-full">
                      <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => { setCoverPreview(null); setCoverFile(null); }}
                        className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-1">
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-xs text-gray-500">Upload cover image</span>
                      <Input type="file" accept="image/*" className="hidden" onChange={handleCover} />
                    </label>
                  )}
                </div>
                {coverPreview &&!coverFile && (
                  <label className="mt-2 inline-flex text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
                    Change image
                    <Input type="file" accept="image/*" className="hidden" onChange={handleCover} />
                  </label>
                )}
              </div>

              <Input
                placeholder="Service Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <textarea
                className="w-full rounded-md border p-3 text-sm"
                placeholder="About your service"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />

              <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}