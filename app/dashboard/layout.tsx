import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import CustomerSidebar from "@/components/customer/CustomerSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CUSTOMER") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      <CustomerSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}