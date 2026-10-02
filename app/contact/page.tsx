"use client";

import { Mail, MapPin, Phone, Clock, MessageCircle, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, ChangeEvent, FormEvent } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setStatus({ type: "success", msg: "Message sent! We'll reply within 2 hours." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", msg: "Something went wrong. Please try again or email us directly." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      {/* Hero - Fast, no heavy gradient */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-400/20" />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-600/20 blur-" />
        <div className="relative container mx-auto px-6 py-16 md:py-20 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text- font-bold tracking-widest text-blue-200 ring-1 ring-white/10">
            <MessageCircle size={12} /> WE REPLY IN 2 HOURS
          </div>
          <h1 className="mx-auto mt-4 max-w-3xl text- font-black leading-tight tracking-tight text-white md:text-">
            Talk to KaamSewa Team
          </h1>
          <p className="mx-auto mt-3 max-w-xl text- leading-6 text-slate-300 md:text-">
            Have a question, need support, or want to become a provider? We are here to help you — fast.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container mx-auto grid gap-6 px-6 lg:grid-cols-12">
          {/* Left Info - UX: Scannable, actionable */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h2 className="text- font-black tracking-tight md:text-">Get in touch, fast.</h2>
              <p className="mt-2 text- leading-6 text-slate-500">
                Whether you are looking for a professional or want to join as a provider — reach us via form, email, or phone.
              </p>
            </div>

            <Card className="rounded- border-0 shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-5 space-y-4">
                {[
                  { icon: MapPin, label: "Location", value: "Kathmandu, Nepal", sub: "Available in 20+ cities" },
                  { icon: Mail, label: "Email", value: "support@kaamsewa.com", sub: "Reply in 2 hours", href: "mailto:support@kaamsewa.com" },
                  { icon: Phone, label: "Phone", value: "+977 9800000000", sub: "Sun-Fri, 9AM-6PM", href: "tel:+9779800000000" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <item.icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text- font-bold uppercase tracking-widest text-slate-400">{item.label}</div>
                      {item.href? (
                        <a href={item.href} className="text- font-bold hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text- font-bold">{item.value}</div>
                      )}
                      <div className="text- text-slate-500">{item.sub}</div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
                  <Clock size={16} className="mt-0.5 shrink-0 text-amber-600" />
                  <div className="text- leading-5">
                    <span className="font-bold">Fast response:</span> Average reply time is 47 minutes during working hours.
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded- bg-slate-900 p-5 text-white">
              <div className="text- font-bold">For Providers</div>
              <p className="mt-1 text- leading-5 text-slate-300">Want more bookings? Join KaamSewa and get verified customers daily.</p>
              <a href="/provider" className="mt-3 inline-flex items-center gap-1 text- font-bold text-white underline">
                Become a Provider <ArrowRight size={12} />
              </a>
            </div>
          </div>

          {/* Form - UX: Big touch targets, clear feedback */}
          <div className="lg:col-span-7">
            <Card className="rounded- border-0 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] ring-1 ring-slate-100">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text- font-bold">Send a message</h3>
                  <span className="text- font-semibold text-slate-400">All fields required *</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text- font-bold uppercase tracking-wide text-slate-500">Your Name</label>
                      <Input name="name" value={form.name} onChange={handleChange} placeholder="Ram Bahadur" required className="h-11 rounded-xl bg-slate-50" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text- font-bold uppercase tracking-wide text-slate-500">Email Address</label>
                      <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ram@email.com" required className="h-11 rounded-xl bg-slate-50" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text- font-bold uppercase tracking-wide text-slate-500">Subject</label>
                    <Input name="subject" value={form.subject} onChange={handleChange} placeholder="I need help with booking..." required className="h-11 rounded-xl bg-slate-50" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text- font-bold uppercase tracking-wide text-slate-500">Message</label>
                    <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Write your message in detail..." rows={5} required className="rounded-xl bg-slate-50" />
                    <div className="mt-1.5 text-right text- text-slate-400">{form.message.length}/500</div>
                  </div>

                  <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-slate-900 text-white cursor-pointer font-bold hover:bg-black">
                    {loading? (
                      <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Sending...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send size={16} /> Send Message</span>
                    )}
                  </Button>

                  {status && (
                    <div className={`flex items-start gap-2 rounded-xl p-3 text- font-medium ${status.type === "success"? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "bg-red-50 text-red-700 ring-1 ring-red-100"}`}>
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                      {status.msg}
                    </div>
                  )}

                  <p className="text-center text-sm text-slate-400">We never share your email. Protected by spam filter.</p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}