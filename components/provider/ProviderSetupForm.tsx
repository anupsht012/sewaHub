"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function ProviderSetupForm() {
    const router = useRouter();

    const [form, setForm] = useState({
        bio: "",
        location: "",
        category: "",
    });
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            toast.error("Cover image max 3MB");
            return;
        }
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // ✅ Use FormData for file upload
            const fd = new FormData();
            fd.append("bio", form.bio);
            fd.append("location", form.location);
            fd.append("category", form.category);
            if (coverFile) fd.append("coverImage", coverFile);

            const res = await fetch("/api/provider/setup", {
                method: "POST",
                body: fd, // no Content-Type header - browser sets it
            });

            const data = await res.json();
            console.log("PROVIDER SETUP RESPONSE:", data);

            if (!res.ok) {
                toast.error(data.error || "Something went wrong");
                return;
            }

            toast.success("Provider profile created!");
            router.push("/provider/dashboard");
            router.refresh();

        } catch (error) {
            console.error("SETUP ERROR:", error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* ✅ Cover Image */}
            <div>
                <Label className="text-sm font-medium">Cover Image (shown in Featured)</Label>
                <div className="mt-2 relative overflow-hidden rounded-md border-2 border-dashed">
                    {coverPreview? (
                        <div className="relative h-36 w-full">
                            <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => { setCoverPreview(null); setCoverFile(null); }}
                                className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-1 p-3">
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-xs text-gray-500">Click to upload cover (800x400)</span>
                            <Input type="file" accept="image/*" className="hidden" onChange={handleCover} />
                        </label>
                    )}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Service Category</label>
                <Input
                    className="mt-2"
                    placeholder="e.g. Home Maintenance, Plumbing, Beauty"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value })}
                    required
                />
            </div>

            <textarea
                className="w-full rounded-md border p-3 text-sm"
                placeholder="About your service..."
                value={form.bio}
                onChange={(e) => setForm({...form, bio: e.target.value })}
                rows={4}
            />

            <Input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({...form, location: e.target.value })}
                required
            />

            <Button type="submit" className="w-full" disabled={loading}>
                {loading? "Saving..." : "Create Profile"}
            </Button>
        </form>
    );
}