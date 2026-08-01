import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

import DeleteUserButton from "@/components/admin/DeleteUserButton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Briefcase, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      provider: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                User Directory
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-600">
                {users.length} Total Accounts
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Manage Users
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View, inspect, and manage all registered KaamSewa platform user accounts.
            </p>
          </div>
        </div>

        {/* Card Wrapped Table Container */}
        <Card className="overflow-hidden border-slate-100 bg-white/80 backdrop-blur-sm shadow-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="font-bold text-slate-700">Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Email</TableHead>
                  <TableHead className="font-bold text-slate-700">Role</TableHead>
                  <TableHead className="font-bold text-slate-700">Provider Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                      No registered users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-slate-100 transition-colors hover:bg-slate-50/60"
                    >
                      <TableCell className="font-semibold text-slate-900">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-600">
                        {item.email}
                      </TableCell>
                      <TableCell>
                        {item.role === "ADMIN" ? (
                          <Badge className="border-none bg-violet-50 text-violet-700 hover:bg-violet-100 font-bold px-2.5 py-0.5">
                            <Shield className="mr-1 h-3 w-3" />
                            ADMIN
                          </Badge>
                        ) : item.role === "PROVIDER" ? (
                          <Badge className="border-none bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-2.5 py-0.5">
                            <Briefcase className="mr-1 h-3 w-3" />
                            PROVIDER
                          </Badge>
                        ) : (
                          <Badge className="border-none bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-2.5 py-0.5">
                            <Users className="mr-1 h-3 w-3" />
                            {item.role}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.provider ? (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50/50 text-emerald-700 font-medium">
                            <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-500 font-medium">
                            <XCircle className="mr-1 h-3 w-3 text-slate-400" />
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.role !== "ADMIN" && (
                          <DeleteUserButton userId={item.id} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}