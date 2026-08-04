"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Home,
  Building2,
  Map,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import EditAddressModal, {
  Address,
} from "@/components/profile/modals/EditAddressModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AddressInformationProps {
  user: {
    address: Address | null;
  };
}

export default function AddressInformation({
  user,
}: AddressInformationProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  
  // Delete Modal State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    if (user.address) {
      toast.info("You already have an address configured. Edit your existing address instead.");
      return;
    }
    setAddressToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (address: Address) => {
    setAddressToEdit(address);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id?: string) => {
    if (!id) {
      toast.error("Address ID is missing");
      return;
    }
    setAddressToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDeleteId) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting address...");

    try {
      const response = await fetch(`/api/user/address/${addressToDeleteId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete address");
      }

      toast.success("Address deleted successfully!", { id: toastId });
      setIsDeleteDialogOpen(false);
      setAddressToDeleteId(null);
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast.error(error?.message || "Something went wrong while deleting address", {
        id: toastId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Address Information</h2>
            <p className="text-sm text-gray-500">Manage your saved address</p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>

        {!user.address ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
            No address added yet
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <div
              key={user.address.id}
              className="rounded-xl border p-5 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    <Home size={18} />
                    {user.address.label || "Address"}
                  </div>

                  <div className="flex items-center gap-2">
                    {user.address.isDefault && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 font-medium">
                        Default
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(user.address!)}
                      className="p-1 text-gray-500 hover:text-slate-900 cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(user.address?.id)}
                      className="p-1 text-gray-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <AddressItem
                    icon={<MapPin size={16} />}
                    label="Province"
                    value={user.address.province}
                  />

                  <AddressItem
                    icon={<Building2 size={16} />}
                    label="District"
                    value={user.address.district}
                  />

                  <AddressItem
                    icon={<Map size={16} />}
                    label="City"
                    value={user.address.city}
                  />

                  <AddressItem
                    icon={<Home size={16} />}
                    label="Area"
                    value={user.address.area || "Not added"}
                  />

                  <AddressItem
                    icon={<MapPin size={16} />}
                    label="Street"
                    value={user.address.street || "Not added"}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Address Modal */}
      <EditAddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Toast trigger after closing modal when editing/adding
          if (addressToEdit) {
            toast.success("Address updated successfully!");
          }
        }}
        addressToEdit={addressToEdit}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your saved address from our records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AddressItem({
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
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}