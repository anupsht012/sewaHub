"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export type VerificationType = "EMAIL" | "PHONE" | "PROVIDER";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: VerificationType | null;
  userEmail?: string;
  userPhone?: string | null;
  onSuccess?: () => void;
}

export default function VerificationModal({
  isOpen,
  onClose,
  type,
  userEmail = "",
  userPhone = "",
  onSuccess,
}: VerificationModalProps) {
  const [step, setStep] = useState<"REQUEST" | "VERIFY" | "SUCCESS">("REQUEST");
  const [inputVal, setInputVal] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync default input value when type changes
  useEffect(() => {
    if (type === "EMAIL") {
      setInputVal(userEmail);
    } else if (type === "PHONE") {
      setInputVal(userPhone || "");
    } else {
      setInputVal("");
    }
    setStep("REQUEST");
    setCode("");
    setError(null);
  }, [type, userEmail, userPhone, isOpen]);

  if (!type) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/verification/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, target: inputVal }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to send verification request");
      }

      setStep("VERIFY");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, code, target: inputVal }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Invalid verification code");
      }

      setStep("SUCCESS");
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "EMAIL":
        return <Mail className="h-6 w-6 text-indigo-600" />;
      case "PHONE":
        return <Phone className="h-6 w-6 text-indigo-600" />;
      case "PROVIDER":
        return <ShieldCheck className="h-6 w-6 text-indigo-600" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "EMAIL":
        return "Verify Email Address";
      case "PHONE":
        return "Verify Phone Number";
      case "PROVIDER":
        return "Provider Verification";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-6 bg-white">
        <DialogHeader className="flex flex-row items-center gap-3 border-b pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            {renderIcon()}
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {getTitle()}
            </DialogTitle>
          </div>
        </DialogHeader>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {step === "REQUEST" && (
          <form onSubmit={handleSendCode} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {type === "EMAIL"
                  ? "Email Address"
                  : type === "PHONE"
                  ? "Phone Number"
                  : "License / Document ID"}
              </label>
              <Input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  type === "EMAIL"
                    ? "name@example.com"
                    : type === "PHONE"
                    ? "+1 234 567 890"
                    : "Enter license number"
                }
                required
                className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
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
                disabled={isSubmitting || !inputVal}
                className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Code"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "VERIFY" && (
          <form onSubmit={handleVerifyCode} className="space-y-4 pt-4">
            <p className="text-sm text-slate-600">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-slate-900">{inputVal}</span>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Verification Code
              </label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                className="h-11 rounded-xl border-slate-200 text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("REQUEST")}
                className="rounded-xl text-slate-600 cursor-pointer"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || code.length < 4}
                className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Confirm Code"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "SUCCESS" && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h3 className="text-lg font-bold text-slate-900">
              Verified Successfully!
            </h3>
            <p className="text-sm text-slate-500">
              Your status has been updated.
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}