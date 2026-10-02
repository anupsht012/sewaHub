"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaymentFilterControls({
  initialQuery,
  initialStatus,
}: {
  initialQuery: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Use local state to keep input responsive and prevent focus loss during typing
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value); // Immediately update local typing state

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    params.set("page", "1"); // Reset to page 1 on search

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleStatusChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "ALL") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.set("page", "1"); // Reset to page 1 on filter change

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by customer, email, txn..."
          className="pl-9 text-xs sm:text-sm bg-slate-50/50"
        />
      </div>

      <Select value={initialStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[140px] text-xs sm:text-sm bg-slate-50/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="SUCCESS">Success</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}