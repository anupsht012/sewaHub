import RequestServiceForm from "@/components/RequestServiceForm";

export default function RequestServicePage() {
  return (
    <main className="min-h-screen bg-gray-50">

      <section className="bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 py-20 text-white">
        <div className="container mx-auto px-6 text-center">

          <h1 className="text-4xl font-bold md:text-6xl">
            Request a Service
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Tell us what service you need and
            trusted professionals will help you.
          </p>

        </div>
      </section>


      <section className="py-16">

        <div className="container mx-auto max-w-3xl px-6">

          <RequestServiceForm />

        </div>

      </section>

    </main>
  );
}