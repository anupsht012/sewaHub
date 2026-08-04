"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface EditPersonalModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id?: string;
        name: string;
        email: string;
        phone?: string | null;
        gender?: string | null;
        dateOfBirth?: Date | string | null;
        bio?: string | null;
    };
    onSuccess?: (updatedData: {
        name: string;
        phone: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        bio: string | null;
    }) => void;
}

export default function EditPersonalModal({
    isOpen,
    onClose,
    user,
    onSuccess,
}: EditPersonalModalProps) {
    const router = useRouter();

    const [name, setName] = useState(user.name || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [gender, setGender] = useState<string | null>(user.gender ?? null);
    const [dateOfBirth, setDateOfBirth] = useState(
        user.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
            : ""
    );
    const [bio, setBio] = useState(user.bio || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Synchronize state when user prop changes
    useEffect(() => {
        setName(user.name || "");
        setPhone(user.phone || "");
        setGender(user.gender ?? null);
        setDateOfBirth(
            user.dateOfBirth
                ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                : ""
        );
        setBio(user.bio || "");
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        const updatedPayload = {
            name,
            phone: phone || null,
            gender: gender || null,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            bio: bio || null,
        };

        try {
            const response = await fetch("/api/user/personal-info", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPayload),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || data.error || "Failed to update personal information");
            }

            // Immediately notify parent component to update UI state
            if (onSuccess) {
                onSuccess(updatedPayload);
            }

            onClose();
            router.refresh();
        } catch (error: any) {
            console.error("Error updating personal info:", error);
            setErrorMessage(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl p-6 bg-white">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-lg font-bold text-slate-900">
                        Edit Personal Information
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {errorMessage && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                            {errorMessage}
                        </div>
                    )}

                    {/* Name Field */}
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

                    {/* Email Field (Disabled) */}
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

                    {/* Phone & Gender Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 234 567 890"
                                className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Gender
                            </label>
                            <Select value={gender ?? undefined} onValueChange={setGender}>
                                <SelectTrigger className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                    <SelectItem value="PREFER_NOT_TO_SAY">
                                        Prefer not to say
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Date of Birth Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Date of Birth
                        </label>
                        <Input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    {/* Bio Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Bio
                        </label>
                        <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us a little bit about yourself..."
                            rows={3}
                            className="rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 resize-none"
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