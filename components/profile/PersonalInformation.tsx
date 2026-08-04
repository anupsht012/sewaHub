"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  VenusAndMars,
  FileText,
} from "lucide-react";
import EditPersonalModal from "./modals/EditPersonalModal";

interface PersonalInformationProps {
  user: {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    gender?: string | null;
    dateOfBirth?: Date | string | null;
    bio?: string | null;
  };
}

export default function PersonalInformation({
  user,
}: PersonalInformationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(user);

  // Keep state in sync if parent prop changes
  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleSuccess = (updatedFields: Partial<typeof user>) => {
    setUserData((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return "Not added";
    const parsed = new Date(dateValue);
    if (isNaN(parsed.getTime())) return "Not added";
    return parsed.toLocaleDateString();
  };

  return (
    <>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="text-sm text-gray-500">Your account details</p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InfoItem
            icon={<User size={18} />}
            label="Full Name"
            value={userData.name}
          />

          <InfoItem
            icon={<Mail size={18} />}
            label="Email"
            value={userData.email}
          />

          <InfoItem
            icon={<Phone size={18} />}
            label="Phone"
            value={userData.phone ?? "Not added"}
          />

          <InfoItem
            icon={<VenusAndMars size={18} />}
            label="Gender"
            value={userData.gender ?? "Not added"}
          />

          <InfoItem
            icon={<Calendar size={18} />}
            label="Date of Birth"
            value={formatDate(userData.dateOfBirth)}
          />
        </div>

        <div className="mt-6">
          <InfoItem
            icon={<FileText size={18} />}
            label="Bio"
            value={userData.bio ?? "No bio added"}
          />
        </div>
      </div>

      <EditPersonalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData}
        onSuccess={handleSuccess}
      />
    </>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-gray-500">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}