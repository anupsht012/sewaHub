"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, Search, MapPin, X } from "lucide-react";
import Link from "next/link";

interface MobileFilterSheetProps {
  service?: string;
  location?: string;
  sortBy?: string;
}

export function MobileFilterSheet({
  service,
  location,
  sortBy,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger >
        <Button variant="outline" className="flex items-center gap-2 rounded-xl">
          <Filter className="h-4 w-4 text-slate-600" />
          <span>Filters</span>
          {(service || location) && (
            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[400px] p-6">
        <SheetHeader className="mb-6 flex flex-row items-center justify-between border-b pb-4">
          <SheetTitle className="text-xl font-bold">Filter Services</SheetTitle>
        </SheetHeader>

        <form method="GET" onSubmit={() => setOpen(false)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Service
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                name="service"
                defaultValue={service || ""}
                placeholder="Plumbing, Cleaning, Electrical..."
                className="h-11 rounded-xl bg-slate-50 border-slate-200 pl-10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                name="location"
                defaultValue={location || ""}
                placeholder="Kathmandu, Pokhara, Lalitpur..."
                className="h-11 rounded-xl bg-slate-50 border-slate-200 pl-10 focus:bg-white transition-all"
              />
            </div>
          </div>

          {sortBy && <input type="hidden" name="sortBy" value={sortBy} />}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/10"
            >
              Apply Filters
            </Button>
            {(service || location) && (
              <Link href="/services" onClick={() => setOpen(false)} className="w-full">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-11 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-4 w-4 mr-2" /> Reset Filters
                </Button>
              </Link>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}