"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadBookings() {
    try {
      const res = await fetch("/api/provider/bookings");
      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateStatus(
    id: string,
    status: "ACCEPTED" | "REJECTED" | "COMPLETED"
  ) {
    setUpdatingId(id);

    try {
      const res = await fetch(`/api/provider/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      await loadBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <p className="mt-5 text-gray-500">Loading bookings...</p>;
  }

  if (bookings.length === 0) {
    return <p className="mt-5 text-gray-500">No booking requests yet.</p>;
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-semibold">
                {booking.service?.name || "N/A"}
              </TableCell>
              <TableCell className="text-gray-600">
                {booking.customer?.name || "N/A"}
              </TableCell>
              <TableCell className="text-gray-600">
                {booking.phone || "N/A"}
              </TableCell>
              <TableCell className="max-w-xs truncate text-gray-600">
                {booking.address || "N/A"}
              </TableCell>
              <TableCell className="text-gray-600">
                {booking.bookingDate
                  ? new Date(booking.bookingDate).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    booking.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-700"
                      : booking.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : booking.status === "CANCELLED"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {booking.status === "PENDING" && (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      disabled={updatingId === booking.id}
                      onClick={() => updateStatus(booking.id, "ACCEPTED")}
                    >
                      {updatingId === booking.id ? "..." : "Accept"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={updatingId === booking.id}
                      onClick={() => updateStatus(booking.id, "REJECTED")}
                    >
                      {updatingId === booking.id ? "..." : "Reject"}
                    </Button>
                  </div>
                )}

                {booking.status === "ACCEPTED" && (
                  <Button
                    size="sm"
                    disabled={updatingId === booking.id}
                    onClick={() => updateStatus(booking.id, "COMPLETED")}
                  >
                    {updatingId === booking.id ? "..." : "Mark Complete"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}