"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id?: string;
    name: string;
    email: string;
    image: string | null;
  };
  role: Role;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  role,
}: EditProfileModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name || "");
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name || "");
    setImagePreview(user.image);
    setSelectedFile(null);
    setErrorMessage(null);
  }, [user, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size limit (max 4MB to prevent server payload errors)
      if (file.size > 4 * 1024 * 1024) {
        setErrorMessage("Image size must be less than 4MB");
        return;
      }
      setErrorMessage(null);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);

      if (user.id) {
        formData.append("userId", user.id);
      }

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        body: formData,
      });

      let responseData: { error?: string; message?: string } = {};
      try {
        responseData = await response.json();
      } catch {
        responseData = {};
      }

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            responseData.message ||
            `Server error (${response.status}: ${response.statusText})`
        );
      }

      onClose();
      router.refresh();
      // Force page reload as fallback if NextJS client cache doesn't reflect session changes instantly
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const msg =
        error instanceof Error ? error.message : "Failed to update profile";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-6 bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Edit {role.charAt(0) + role.slice(1).toLowerCase()} Profile
          </DialogTitle>
        </DialogHeader>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xl font-bold text-slate-400">
                  {name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Upload size={14} /> Change Photo
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
              className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <Input
              value={user.email}
              disabled
              className="h-11 rounded-xl border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl text-slate-600 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}