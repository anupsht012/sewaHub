import ProviderSidebar from "@/components/provider/ProviderSidebar";


export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <ProviderSidebar />

      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>

    </div>
  );
}