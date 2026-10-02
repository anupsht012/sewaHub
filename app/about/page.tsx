import Link from "next/link";
import {
  ShieldCheck,
  Users,
  MapPin,
  Star,
  Handshake,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Verified Professionals",
    description: "Every provider is manually verified with ID and skill proof before they can take bookings.",
    icon: ShieldCheck,
    color: "bg-blue-600",
  },
  {
    title: "Local Across Nepal",
    description: "From Kathmandu to Pokhara — find electricians, plumbers, tutors & 50+ services near you.",
    icon: MapPin,
    color: "bg-emerald-600",
  },
  {
    title: "Real Customer Reviews",
    description: "No fake ratings. Only reviews from real bookings help you choose with confidence.",
    icon: Star,
    color: "bg-amber-500",
  },
  {
    title: "Grow Your Business",
    description: "Skilled workers get direct customers, bookings, and payments — no middleman cut.",
    icon: Users,
    color: "bg-violet-600",
  },
];

const stats = [
  { value: "2,500+", label: "Verified Providers" },
  { value: "15k+", label: "Jobs Completed" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "20+", label: "Cities in Nepal" },
];

const steps = [
  { n: "01", title: "Search Service", desc: "Tell us what you need and where you are." },
  { n: "02", title: "Compare Providers", desc: "Check profiles, ratings, and real reviews." },
  { n: "03", title: "Book & Relax", desc: "Book in seconds. Provider arrives, job done." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      {/* Hero - Improved */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-violet-600/20 to-cyan-400/20" />
        <div className="absolute -top-32 -right-32 h- w- rounded-full bg-blue-600/30 blur-" />
        <div className="absolute -bottom-32 -left-32 h- w- rounded-full bg-cyan-400/20 blur-" />

        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text- font-semibold tracking-wide backdrop-blur">
              <Sparkles size={14} className="text-yellow-300" /> NEPAL'S TRUSTED SERVICE MARKETPLACE
            </div>

            <h1 className="text- font-black leading-[0.95] tracking-tight md:text-">
              Connecting Nepal with
              <span className="mt-2 block bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Trusted Professionals
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text- leading-7 text-slate-300 md:text- md:leading-8">
              KaamSewa makes it effortless to find reliable electricians, plumbers, tutors, cleaners and more —
              while helping skilled Nepali workers grow their income.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/services">
                <Button size="lg" className="h-12 rounded-full bg-white px-8 text- font-bold text-slate-900 hover:bg-slate-100">
                  Find Services <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
              <Link href="/provider">
                <Button size="lg" variant="outline" className="h-12 rounded-full border-white/20 bg-transparent px-8 text- font-bold text-white hover:bg-white hover:text-slate-900">
                  Become a Provider
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black md:text-3xl">{s.value}</div>
                  <div className="mt-1 text- font-semibold uppercase tracking-widest text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission - Better UX */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8 items-start">
            <div className="md:col-span-6">
              <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text- font-bold uppercase tracking-widest text-blue-600">Our Mission</div>
              <h2 className="mt-4 text- font-black leading-tight tracking-tight md:text-">
                We make hiring <span className="text-slate-400">help simple, fast & safe.</span>
              </h2>
              <div className="mt-6 space-y-4 text- leading-7 text-slate-600">
                <p>Whether you need a home repair, education support, or cleaning — KaamSewa connects you with trusted people nearby in under 60 seconds.</p>
                <p>We believe every skilled worker deserves visibility, and every customer deserves work they can trust.</p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                {["ID verified providers", "Secure booking & support", "Pay after service completion"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text- font-semibold text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-500" /> {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-6">
              <div className="rounded- bg-white p-3 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.15)] ring-1 ring-slate-100">
                <div className="rounded- bg-slate-50 p-6 md:p-8">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow">
                      <Handshake size={20} />
                    </div>
                    <div>
                      <h3 className="text- font-bold">Trust First, Always</h3>
                      <p className="mt-1 text- leading-6 text-slate-500">We manually verify every provider. No fake profiles, no spam. Only real, skilled Nepalis ready to work.</p>
                    </div>
                  </div>
                  <div className="my-6 h-px bg-slate-200" />
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-200">
                      <Search size={20} />
                    </div>
                    <div>
                      <h3 className="text- font-bold">Search in 10 seconds</h3>
                      <p className="mt-1 text- leading-6 text-slate-500">Type location + service, compare top rated providers, and book. No calls, no bargaining needed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - New Section for UX */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="relative rounded- border bg-slate-50 p-6">
                <div className="text- font-black text-slate-200">{step.n}</div>
                <h4 className="mt-1 text- font-bold">{step.title}</h4>
                <p className="mt-2 text- leading-6 text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Improved cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text- font-black tracking-tight md:text-">Why 15,000+ people choose KaamSewa</h2>
            <p className="mt-3 text- text-slate-500">Built for Nepal — simple, reliable, and focused on quality.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group rounded- bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text- font-bold">{item.title}</h3>
                  <p className="mt-2 text- leading-6 text-slate-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Better */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded- bg-slate-900 p-8 text-center md:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-600 opacity-80" />
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <h2 className="text- font-black leading-tight text-white md:text-">Ready to get work done?</h2>
              <p className="mx-auto mt-3 max-w-xl text- leading-6 text-blue-100">Join thousands of happy customers who found their trusted professional on KaamSewa.</p>
              <div className="mt-7 flex justify-center gap-3">
                <Link href="/services">
                  <Button className="h-11 rounded-full bg-white px-7 font-bold text-slate-900 hover:bg-slate-100">Explore Services <ArrowRight size={16} className="ml-1" /></Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}