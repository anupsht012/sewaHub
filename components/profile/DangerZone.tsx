"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  LogOut,
  UserX,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface DangerZoneProps {
  role: Role;
}

type ActionType = "LOGOUT_ALL" | "DEACTIVATE" | "DELETE" | null;

export default function DangerZone({ role }: DangerZoneProps) {
  const router = useRouter();

  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActionConfirm = async () => {
    if (!activeAction) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let endpoint = "";
      let method = "POST";

      switch (activeAction) {
        case "LOGOUT_ALL":
          endpoint = "/api/auth/logout-all";
          break;
        case "DEACTIVATE":
          endpoint = "/api/user/deactivate";
          method = "PATCH";
          break;
        case "DELETE":
          endpoint = "/api/user/delete";
          method = "DELETE";
          break;
      }

      const res = await fetch(endpoint, { method });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to perform action");
      }

      setActiveAction(null);

      if (activeAction === "LOGOUT_ALL" || activeAction === "DELETE") {
        router.push("/login");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 shadow-xs">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
            <AlertTriangle size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-red-900 tracking-tight">
              Danger Zone
            </h2>
            <p className="text-xs font-medium text-red-600">
              Irreversible account actions and destructive operations
            </p>
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-3">
          <ActionItem
            icon={<LogOut size={18} />}
            title="Logout all devices"
            description="Sign out from all active sessions across all devices and browsers."
            buttonText="Logout All"
            onClick={() => setActiveAction("LOGOUT_ALL")}
          />

          <ActionItem
            icon={<UserX size={18} />}
            title="Deactivate Account"
            description={
              role === "ADMIN"
                ? "Admin accounts cannot be deactivated here."
                : "Temporarily disable your profile and hide your services."
            }
            buttonText="Deactivate"
            disabled={role === "ADMIN"}
            onClick={() => setActiveAction("DEACTIVATE")}
          />

          <ActionItem
            icon={<Trash2 size={18} />}
            title="Delete Account"
            description={
              role === "ADMIN"
                ? "Contact system owner to remove admin accounts."
                : "Permanently delete your account and remove all personal data."
            }
            buttonText="Delete Account"
            danger
            disabled={role === "ADMIN"}
            onClick={() => setActiveAction("DELETE")}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={activeAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setActiveAction(null);
            setError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6 bg-white">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-slate-900">
              {activeAction === "LOGOUT_ALL" && "Logout from all devices?"}
              {activeAction === "DEACTIVATE" && "Deactivate your account?"}
              {activeAction === "DELETE" && "Permanently delete account?"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {activeAction === "LOGOUT_ALL" &&
                "This will end all active sessions across all browsers. You will need to log back in."}
              {activeAction === "DEACTIVATE" &&
                "Your profile will be hidden. You can reactivate by logging back in anytime."}
              {activeAction === "DELETE" &&
                "This action cannot be undone. All your bookings, services, and profile data will be erased."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveAction(null)}
              disabled={isSubmitting}
              className="rounded-xl text-slate-600 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleActionConfirm}
              disabled={isSubmitting}
              className={`rounded-xl text-white cursor-pointer ${
                activeAction === "DELETE"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : activeAction === "DELETE" ? (
                "Yes, Delete Account"
              ) : activeAction === "DEACTIVATE" ? (
                "Yes, Deactivate"
              ) : (
                "Confirm Logout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ActionItem({
  icon,
  title,
  description,
  buttonText,
  danger,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-red-100 bg-white p-4 transition-all sm:flex-row sm:items-center sm:justify-between shadow-2xs">
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 shrink-0 text-red-600">{icon}</div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
          danger
            ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
            : "border border-red-200 bg-red-50/50 text-red-700 hover:bg-red-100"
        } ${disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent" : ""}`}
      >
        {buttonText}
      </button>
    </div>
  );
}