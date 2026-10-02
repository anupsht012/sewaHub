"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Phone, Clock, Search, Check, CheckCheck, Trash2, Inbox } from "lucide-react";

const statusStyles: any = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200 border-amber-200",
  READ: "bg-blue-50 text-blue-700 ring-blue-200 border-blue-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-200 border-emerald-200",
};

export default function AdminContactsClient({ initialContacts }: { initialContacts: any[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = contacts.filter(c => {
    const matchStatus = filter === "ALL" || c.status === filter;
    const matchQuery = `${c.name} ${c.email} ${c.subject}`.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Marked as ${status.toLowerCase()}`);
      setContacts(prev => prev.map(c => c.id === id? {...c, status} : c));
    } else toast.error("Failed to update");
  }

  async function deleteContact(id: string) {
    if (!confirm("Delete this message permanently?")) return;
    const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setContacts(prev => prev.filter(c => c.id!== id));
      toast.success("Deleted");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Contact Messages</h1>
          <p className="mt-1 text-sm text-slate-500">{filtered.length} messages • {contacts.filter(c=>c.status==="PENDING").length} pending</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email, subject..." className="w-full rounded-xl border bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex gap-2">
        {["ALL","PENDING","READ","RESOLVED"].map(s => (
          <button key={s} onClick={()=>setFilter(s)} className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${filter===s? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 hover:bg-slate-100"}`}>{s} {s!=="ALL" && `(${contacts.filter(c=>c.status===s).length})`}</button>
        ))}
      </div>

      {/* LIST */}
      {filtered.length===0? (
        <div className="grid place-items-center rounded-2xl border border-dashed bg-white py-20 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100"><Inbox className="text-slate-400" /></div>
          <p className="mt-4 font-medium text-slate-900">No messages found</p>
          <p className="text-sm text-slate-500">Try changing filter or search</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => (
            <div key={c.id} className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-200">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">{c.name[0]?.toUpperCase()}</div>
                  <div>
                    <p className="font-semibold text-slate-900 leading-none">{c.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mail size={12}/>{c.email}</span>
                      {c.phone && <span className="flex items-center gap-1"><Phone size={12}/>{c.phone}</span>}
                      <span className="flex items-center gap-1"><Clock size={12}/>{new Date(c.createdAt).toLocaleDateString()} • {new Date(c.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text- font-bold tracking-wider ring-1 ${statusStyles[c.status]}`}>{c.status}</span>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-800">{c.subject}</p>
                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">{c.message}</p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {c.status!=="READ" && <Button size="sm" variant="outline" className="h-8 rounded-full" onClick={()=>updateStatus(c.id, "READ")}><Check size={14}/> Mark Read</Button>}
                {c.status!=="RESOLVED" && <Button size="sm" className="h-8 rounded-full bg-slate-900 hover:bg-slate-800" onClick={()=>updateStatus(c.id, "RESOLVED")}><CheckCheck size={14}/> Resolve</Button>}
                <div className="ml-auto">
                  <Button size="sm" variant="ghost" className="h-8 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={()=>deleteContact(c.id)}><Trash2 size={14}/></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}