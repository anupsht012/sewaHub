import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import ReviewModal from "@/components/shared/ReviewModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Inbox,
  User,
  Eye,
  Tag,
  Receipt,
  ArrowRight,
  CreditCard,
  AlertCircle,
} from "lucide-react";

export default async function CustomerBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role!== "CUSTOMER") redirect("/");

  const bookings = await prisma.booking.findMany({
    where: { customerId: user.id },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          provider: { select: { user: { select: { name: true } } } },
        },
      },
      // ADD PAYMENT
      payment: {
        select: {
          id: true,
          status: true,
          amount: true,
          method: true,
          transactionUuid: true,
          proofImageUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-xs gap-1 px-2.5 py-1"><Clock className="h-3.5 w-3.5" /> PENDING</Badge>;
      case "ACCEPTED":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs gap-1 px-2.5 py-1"><CheckCircle2 className="h-3.5 w-3.5" /> ACCEPTED</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs gap-1 px-2.5 py-1"><Sparkles className="h-3.5 w-3.5" /> COMPLETED</Badge>;
      default:
        return <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-bold text-xs gap-1 px-2.5 py-1"><XCircle className="h-3.5 w-3.5" /> {status}</Badge>;
    }
  };

  const getPaymentBadge = (status?: string) => {
    if (!status) return <Badge variant="outline" className="text-">No Payment</Badge>;
    if (status === "PENDING") return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-"><Clock className="h-3 w-3 mr-1" />Payment Pending</Badge>;
    if (status === "SUCCESS") return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>;
    if (status === "FAILED") return <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    return <Badge variant="outline" className="text-">{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 pt-6 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <Badge variant="secondary" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 font-medium text-xs"><Receipt className="h-3 w-3 mr-1" /> Service Log</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Track bookings and payment verification status</p>
        </div>

        {bookings.length === 0? (
          <Card className="rounded-2xl border bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3"><Inbox className="h-6 w-6" /></div>
            <h2 className="text-base font-bold">No bookings found</h2>
            <p className="mt-1 text-xs text-slate-500">You haven't booked any services yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Desktop */}
            <div className="hidden md:block overflow-hidden rounded-2xl border bg-white shadow-2xs">
              <Table>
                <TableHeader className="bg-slate-50/70">
                  <TableRow>
                    <TableHead className="text-xs font-bold uppercase">Service</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Provider</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Payment</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Price</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Date</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-slate-50/50">
                      <TableCell className="py-4">
                        <p className="font-bold text-sm">{booking.service.name}</p>
                        <div className="flex items-center gap-1 text- text-slate-400"><Tag className="h-3 w-3" />ID: {booking.id.slice(0, 8)}</div>
                      </TableCell>
                      <TableCell className="py-4"><div className="flex items-center gap-2 text-xs font-semibold"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100"><User className="h-3.5 w-3.5" /></div>{booking.service.provider.user.name || "Provider"}</div></TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          {getPaymentBadge(booking.payment?.status)}
                          <p className="text- text-slate-500 flex items-center gap-1"><CreditCard className="h-3 w-3" />{booking.payment?.method || "-"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-bold text-xs">NPR {booking.service.price.toLocaleString("ne-NP")}</TableCell>
                      <TableCell className="py-4"><div className="flex items-center gap-1.5 text-xs"><Calendar className="h-3.5 w-3.5 text-slate-400" />{new Date(booking.bookingDate).toLocaleDateString()}</div></TableCell>
                      <TableCell className="py-4">{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/bookings/${booking.id}`}><Button variant="outline" size="sm" className="h-8 rounded-xl text-xs"><Eye className="h-3.5 w-3.5 mr-1" />View</Button></Link>
                          {booking.status === "COMPLETED" && <ReviewModal serviceId={booking.service.id} />}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {bookings.map((booking) => (
                <Card key={booking.id} className="rounded-2xl border bg-white p-5 shadow-2xs">
                  <CardContent className="p-0 space-y-3">
                    <div className="flex items-start justify-between gap-3 border-b pb-3">
                      <div><h2 className="text-base font-extrabold">{booking.service.name}</h2><p className="text- text-slate-400">ID: {booking.id.slice(0, 8)}</p></div>
                      {getStatusBadge(booking.status)}
                    </div>

                    {/* PAYMENT STATUS - MOST IMPORTANT */}
                    {booking.payment && (
                      <div className={`rounded-xl border p-3 flex gap-2 ${booking.payment.status === "PENDING"? "bg-amber-50 border-amber-200" : booking.payment.status === "SUCCESS"? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                        <div className="mt-0.5">{booking.payment.status === "PENDING"? <Clock className="h-4 w-4 text-amber-600" /> : booking.payment.status === "SUCCESS"? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}</div>
                        <div className="flex-1">
                          <p className="text-xs font-bold">{booking.payment.status === "PENDING"? "Payment Verification Pending" : booking.payment.status === "SUCCESS"? "Payment Verified" : "Payment Failed"}</p>
                          <p className="text- text-slate-600">Rs. {booking.payment.amount} via {booking.payment.method} • {booking.payment.transactionUuid?.slice(0, 12)}</p>
                          {booking.payment.status === "PENDING" && <p className="text- text-amber-700 mt-1">Admin will verify your screenshot in 30 mins. Booking will be confirmed after.</p>}
                          {booking.payment.status === "FAILED" && <Link href={`/booking/${booking.id}/pay`} className="text- font-bold text-rose-700 underline">Try Pay Again</Link>}
                        </div>
                        {booking.payment.proofImageUrl && <a href={booking.payment.proofImageUrl} target="_blank"><img src={booking.payment.proofImageUrl} className="h-10 w-10 rounded-lg border object-cover" alt="" /></a>}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border"><User className="h-3.5 w-3.5 text-slate-400" /><span className="truncate">{booking.service.provider.user.name || "Provider"}</span></div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border"><Calendar className="h-3.5 w-3.5 text-slate-400" /><span>{new Date(booking.bookingDate).toLocaleDateString()}</span></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div><span className="text- text-slate-400">Total</span><span className="text-sm font-extrabold block">NPR {booking.service.price.toLocaleString("ne-NP")}</span></div>
                      <div className="flex gap-2"><Link href={`/dashboard/bookings/${booking.id}`}><Button variant="outline" size="sm" className="h-8 rounded-xl text-xs">View Details<ArrowRight className="h-3 w-3 ml-1" /></Button></Link>{booking.status === "COMPLETED" && <ReviewModal serviceId={booking.service.id} />}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}