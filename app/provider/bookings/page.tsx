import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Phone, FileText, CheckCircle2, XCircle, AlertCircle, Sparkles, CalendarCheck, User, CreditCard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BookingActions from "@/components/provider/BookingActions";

export default async function ProviderBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role!== "PROVIDER") redirect("/");

  const provider = await prisma.provider.findUnique({ where: { userId: user.id } });
  if (!provider) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-2xl p-8 text-center"><AlertCircle className="h-8 w-8 mx-auto mb-3 text-amber-500" /><h2 className="font-bold">Setup provider profile first</h2></Card>
      </div>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: { service: { providerId: provider.id } },
    include: {
      customer: { select: { name: true, email: true, image: true } },
      service: { select: { name: true, price: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED": return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Accepted</Badge>;
      case "COMPLETED": return <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Completed</Badge>;
      case "REJECTED": return <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "CANCELLED": return <Badge variant="outline" className="text-xs">Cancelled</Badge>;
      default: return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-xs mb-2"><Sparkles className="h-3 w-3 mr-1" />Booking Management</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold">My Bookings</h1>
          <p className="text-sm text-slate-500">Accept pending requests and mark paid bookings as completed</p>
        </div>

        {bookings.length === 0? (
          <Card className="rounded-2xl p-12 text-center"><CalendarCheck className="h-10 w-10 mx-auto mb-3 text-slate-300" /><h2 className="font-bold">No Bookings Yet</h2><p className="text-sm text-slate-500">Customer requests will appear here</p></Card>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="grid gap-4 lg:hidden">
              {bookings.map((b) => (
                <Card key={b.id} className="rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div><p className="font-bold text-sm">{b.service.name}</p><p className="text-xs text-blue-600 font-bold">Rs. {b.service.price}</p></div>
                    {getStatusBadge(b.status)}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex gap-2"><User className="h-3.5 w-3.5" />{b.customer.name} • {b.customer.email}</div>
                    <div className="flex gap-2"><Phone className="h-3.5 w-3.5" />{b.phone}</div>
                    <div className="flex gap-2"><MapPin className="h-3.5 w-3.5" />{b.address}</div>
                    <div className="flex gap-2"><Calendar className="h-3.5 w-3.5" />{new Date(b.bookingDate).toLocaleDateString()}</div>
                    {b.note && <div className="flex gap-2"><FileText className="h-3.5 w-3.5" />{b.note}</div>}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge className={b.payment?.status === "SUCCESS"? "bg-emerald-50 text-emerald-700 text-" : "bg-amber-50 text-amber-700 text-"}>{b.payment?.status === "SUCCESS"? "Paid" : "Unpaid"}</Badge>
                    <BookingActions bookingId={b.id} status={b.status} isPaid={b.payment?.status === "SUCCESS"} />
                  </div>
                </Card>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <Card className="rounded-2xl overflow-hidden hidden lg:block">
              <CardHeader className="p-6 border-b"><CardTitle className="flex gap-2 text-base"><Calendar className="h-5 w-5 text-blue-600" />Customer Bookings</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50"><TableRow><TableHead>Service</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Contact</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {bookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-bold text-sm">{b.service.name}<br /><span className="text-blue-600">Rs. {b.service.price}</span></TableCell>
                          <TableCell><div className="flex gap-2 items-center"><Avatar className="h-7 w-7"><AvatarImage src={b.customer.image || ""} /><AvatarFallback className="text-">{b.customer.name?.[0]}</AvatarFallback></Avatar><div><p className="text-xs font-bold">{b.customer.name}</p><p className="text- text-slate-400">{b.customer.email}</p></div></div></TableCell>
                          <TableCell className="text-xs">{new Date(b.bookingDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-xs max-w- truncate"><div>{b.phone}</div><div className="text-slate-500 truncate">{b.address}</div></TableCell>
                          <TableCell>{b.payment?.status === "SUCCESS"? <Badge className="bg-emerald-50 text-emerald-700 text-"><CreditCard className="h-3 w-3 mr-1" />Paid</Badge> : <Badge variant="outline" className="text-">Unpaid</Badge>}</TableCell>
                          <TableCell>{getStatusBadge(b.status)}</TableCell>
                          <TableCell className="text-right"><BookingActions bookingId={b.id} status={b.status} isPaid={b.payment?.status === "SUCCESS"} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}