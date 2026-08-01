import { prisma } from "@/lib/prisma";
import {
  Users,
  UserCheck,
  Wrench,
  CalendarCheck,
  Star,
  Mail,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminDashboardPage() {
  const [
    users,
    providers,
    services,
    bookings,
    reviews,
    messages,
    recentBookings,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.provider.count(),

    prisma.service.count(),

    prisma.booking.count(),

    prisma.review.count(),

    prisma.contactMessage.count(),

    prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
        service: true,
      },
    }),

    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const cards = [
    {
      title: "Users",
      value: users,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Providers",
      value: providers,
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Services",
      value: services,
      icon: Wrench,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Bookings",
      value: bookings,
      icon: CalendarCheck,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Reviews",
      value: reviews,
      icon: Star,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Messages",
      value: messages,
      icon: Mail,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">Admin Dashboard 👑</h1>

      {/* Cards Grid - Reduced Gap */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {cards?.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl bg-white p-4 shadow transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">
                  {card.title}
                </p>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <h2 className="mt-3 text-2xl font-bold">{card.value}</h2>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="mt-10 rounded-3xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold">Recent Bookings</h2>

        <div className="mt-5">
          {recentBookings?.length === 0 ? (
            <p className="text-gray-500">No bookings yet.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking: any) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-semibold">
                        {booking.service.name}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {booking.customer.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="mt-10 rounded-3xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold">New Users</h2>

        <div className="mt-5">
          {recentUsers?.length === 0 ? (
            <p className="text-gray-500">No users yet.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-semibold">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {user.role}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}