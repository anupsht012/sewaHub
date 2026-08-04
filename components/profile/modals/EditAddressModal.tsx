"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface Address {
  id?: string;
  label: string | null;
  province: string;
  district: string;
  city: string;
  area: string | null;
  street: string | null;
  landmark: string | null;
  isDefault: boolean;
}

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit: Address | null;
  onSuccess?: (savedAddress: Address) => void;
}

export default function EditAddressModal({
  isOpen,
  onClose,
  addressToEdit,
  onSuccess,
}: EditAddressModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [label, setLabel] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Sync state whenever the modal opens or addressToEdit changes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (addressToEdit) {
        setLabel(addressToEdit.label || "");
        setProvince(addressToEdit.province || "");
        setDistrict(addressToEdit.district || "");
        setCity(addressToEdit.city || "");
        setArea(addressToEdit.area || "");
        setStreet(addressToEdit.street || "");
        setLandmark(addressToEdit.landmark || "");
        setIsDefault(addressToEdit.isDefault || false);
      } else {
        // Reset form for "Add New Address"
        setLabel("");
        setProvince("");
        setDistrict("");
        setCity("");
        setArea("");
        setStreet("");
        setLandmark("");
        setIsDefault(false);
      }
    }
  }, [isOpen, addressToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: Address = {
      ...(addressToEdit?.id && { id: addressToEdit.id }),
      label: label || null,
      province,
      district,
      city,
      area: area || null,
      street: street || null,
      landmark: landmark || null,
      isDefault,
    };

    try {
      const endpoint = addressToEdit?.id
        ? `/api/user/address/${addressToEdit.id}`
        : "/api/user/address";

      const method = addressToEdit?.id ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to save address");
      }

      const responseData = await response.json().catch(() => ({}));
      const savedAddress = responseData.address || payload;

      if (onSuccess) {
        onSuccess(savedAddress);
      }

      onClose();
      router.refresh();
    } catch (error: any) {
      console.error("Error saving address:", error);
      setErrorMessage(error.message || "Something went wrong while saving address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-6 bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {addressToEdit ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {errorMessage && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Address Label
            </label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Home, Office, Apartment"
              className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Province
              </label>
              <Input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Bagmati"
                required
                className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                District
              </label>
              <Input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Kathmandu"
                required
                className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                City
              </label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kathmandu"
                required
                className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Area
              </label>
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Baneshwor"
                className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Street
              </label>
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Main Street"
                className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Landmark
              </label>
              <Input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Near Water Tank"
                className="h-11 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              Set as default address
            </label>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
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
              ) : addressToEdit ? (
                "Update Address"
              ) : (
                "Save Address"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}