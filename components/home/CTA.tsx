import Link from "next/link";
import { Button } from "@/components/ui/button";

type UserProp = {
  role?: string | null;
} | null;

interface Props {
  user?: UserProp;
}

export default function CTA({ user }: Props) {
  const isProvider = user?.role === "PROVIDER";
  const isAdmin = user?.role === "ADMIN";

  return (
    <section className="bg-blue-600 py-14 sm:py-20 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600" />
      <div className="container relative mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold md:text-5xl tracking-tight leading-tight">Need a Professional Today?</h2>
        <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg text-blue-100 leading-relaxed">
          Find trusted electricians, tutors, cleaners, painters and more across Nepal. Verified, rated, nearby.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:gap-4 sm:flex-row">
          <Link href="/services" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 h-12 font-semibold cursor-pointer">
              Find a Service
            </Button>
          </Link>
          {!isProvider &&!isAdmin? (
            <Link href="/provider/setup" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 h-12 font-semibold border-white text-white bg-transparent hover:bg-white hover:text-blue-600 cursor-pointer">
                Become a Provider
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 h-12 font-semibold border-white text-white bg-transparent hover:bg-white hover:text-blue-600 cursor-pointer">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}