"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
} from "lucide-react";
import VerificationModal, {
  VerificationType,
} from "@/components/profile/modals/VerificationModal";

type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface VerificationCardProps {
  role: Role;
  user: {
    email?: string;
    emailVerified: boolean;
    phone?: string | null;
    phoneVerified?: boolean;
  };
  providerVerified?: boolean;
}

export default function VerificationCard({
  role,
  user,
  providerVerified = false,
}: VerificationCardProps) {
  const router = useRouter();

  const [activeModalType, setActiveModalType] = useState<VerificationType | null>(
    null
  );

  const handleOpenModal = useCallback((type: VerificationType) => {
    setActiveModalType(type);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModalType(null);
  }, []);

  const handleVerificationSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Verification</h2>
          <p className="text-sm text-gray-500">Account verification status</p>
        </div>

        <div className="space-y-4">
          <VerificationItem
            icon={<Mail size={18} />}
            title="Email Verification"
            verified={Boolean(user.emailVerified)}
            onVerify={() => handleOpenModal("EMAIL")}
          />

          <VerificationItem
            icon={<Phone size={18} />}
            title="Phone Verification"
            verified={Boolean(user.phoneVerified)}
            onVerify={() => handleOpenModal("PHONE")}
          />

          {role === "PROVIDER" && (
            <VerificationItem
              icon={<ShieldCheck size={18} />}
              title="Provider Verification"
              verified={Boolean(providerVerified)}
              onVerify={() => handleOpenModal("PROVIDER")}
            />
          )}

          {role === "ADMIN" && (
            <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-4">
              <BadgeCheck className="text-purple-600" size={22} />
              <div>
                <p className="font-medium">Administrator Account</p>
                <p className="text-sm text-purple-700">System verified</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {activeModalType && (
        <VerificationModal
          isOpen={Boolean(activeModalType)}
          onClose={handleCloseModal}
          type={activeModalType}
          userEmail={user.email}
          userPhone={user.phone}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </>
  );
}

function VerificationItem({
  icon,
  title,
  verified,
  onVerify,
}: {
  icon: React.ReactNode;
  title: string;
  verified: boolean;
  onVerify: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <div className="text-gray-500">{icon}</div>
        <span className="font-medium">{title}</span>
      </div>

      {verified ? (
        <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <BadgeCheck size={14} />
          Verified
        </span>
      ) : (
        <button
          type="button"
          onClick={onVerify}
          className="flex cursor-pointer items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 transition-colors hover:bg-yellow-200"
        >
          <Clock size={14} />
          Pending
        </button>
      )}
    </div>
  );
}