import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";
import ApproveProviderButton from "@/components/admin/ApproveProviderButton";
import RejectProviderButton from "@/components/admin/RejectProviderButton";

export default async function ProviderApplicationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const applications = await prisma.providerApplication.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl p-8">

      <h1 className="text-3xl font-bold">
        Provider Applications
      </h1>

      <p className="mt-2 text-gray-500">
        Review new provider requests.
      </p>

      {applications.length === 0 ? (
        <div className="mt-8 rounded-xl bg-white p-8 shadow">
          No pending applications.
        </div>
      ) : (
        <div className="mt-8 space-y-6">

          {applications.map((application) => (

            <div
              key={application.id}
              className="rounded-2xl bg-white p-6 shadow"
            >

              <div className="flex items-start justify-between">

                <div className="space-y-2">

                  <h2 className="text-xl font-bold">
                    {application.businessName}
                  </h2>

                  <p>
                    <strong>Applicant:</strong> {application.user.name}
                  </p>

                  <p>
                    <strong>Email:</strong> {application.user.email}
                  </p>

                  <p>
                    <strong>Category:</strong> {application.category}
                  </p>

                  <p>
                    <strong>Location:</strong> {application.location}
                  </p>

                  <p>
                    <strong>Phone:</strong> {application.phone}
                  </p>

                  <p className="text-gray-600">
                    {application.description}
                  </p>

                </div>

                <div className="flex gap-3">

                  <ApproveProviderButton
                    applicationId={application.id}
                  />

                  <RejectProviderButton
                    applicationId={application.id}
                  />

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}