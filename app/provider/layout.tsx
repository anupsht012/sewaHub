import ProviderSidebar from "@/components/provider/ProviderSidebar";


export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">

      <ProviderSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
}