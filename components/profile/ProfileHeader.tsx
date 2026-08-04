"use client";

import { useState, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Camera,
  ShieldCheck,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import EditProfileModal from "@/components/profile/modals/EditProfileModal";
import { Badge } from "../ui/badge";

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface ProfileHeaderUser {
  id?: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  role?: Role;
  createdAt?: Date | string | null;
  gender?: string | null;
  dateOfBirth?: Date | string | null;
  bio?: string | null;
}

interface ProfileHeaderProps {
  user: ProfileHeaderUser;
  role?: Role;
}

export default function ProfileHeader({ user, role }: ProfileHeaderProps) {
  const activeRole: Role = role || user.role || "CUSTOMER";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.image || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Handle direct avatar upload from header
  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 1. Upload the image file
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json().catch(() => ({}));

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message ||
            uploadData.error ||
            `Upload failed (${uploadResponse.status})`
        );
      }

      const imageUrl = uploadData.url;

      // 2. Persist the updated image URL to user profile
      const updateResponse = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      const updateData = await updateResponse.json().catch(() => ({}));

      if (!updateResponse.ok) {
        throw new Error(
          updateData.message ||
            updateData.error ||
            `Profile update failed (${updateResponse.status})`
        );
      }

      setAvatarUrl(imageUrl);
    } catch (error: unknown) {
      console.error("Error updating avatar:", error);
      const msg =
        error instanceof Error ? error.message : "Failed to update avatar";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Member";

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
        {/* Top Banner Background */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-slate-900 via-slate-600 to-indigo-570" />

        <div className="relative pt-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          {/* User Info & Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar Component */}
            <div className="relative group h-24 w-24 rounded-2xl border-4 border-white bg-slate-100 shadow-md overflow-hidden flex items-center justify-center shrink-0">
              {isUploading ? (
                <div className="flex items-center justify-center bg-black/30 w-full h-full text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={40} className="text-slate-400" />
              )}

              {/* Upload Trigger */}
              <label
                htmlFor="profile-header-avatar"
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium"
              >
                <Camera size={18} className="mb-1" />
                <span>Change</span>
              </label>
              <input
                id="profile-header-avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            {/* Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">
                  {user.name}
                </h1>
                <RoleBadge role={activeRole} />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail size={15} className="text-slate-400" />
                  <span>{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={15} className="text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-slate-400" />
                  <span>Joined {formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer self-start md:self-end"
          >
            <Pencil size={15} />
            Edit Profile
          </button>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            image: avatarUrl,
          }}
          role={activeRole}
        />
      )}
    </>
  );
}

function RoleBadge({ role }: { role: Role }) {
  switch (role) {
    case "ADMIN":
      return (
        <Badge
          variant="secondary"
          className="bg-red-50 text-red-700 border-red-200/80 font-bold text-xs gap-1 px-2.5 py-1"
        >
          <ShieldCheck className="h-3.5 w-3.5" /> Admin
        </Badge>
      );
    case "PROVIDER":
      return (
        <Badge
          variant="secondary"
          className="bg-green-50 text-green-700 border-green-200/80 font-bold text-xs gap-1 px-2.5 py-1"
        >
          <Sparkles className="h-3.5 w-3.5" /> Provider
        </Badge>
      );
    case "CUSTOMER":
    default:
      return (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200/80 font-bold text-xs gap-1 px-2.5 py-1"
        >
          <Sparkles className="h-3.5 w-3.5" /> Customer
        </Badge>
      );
  }
}