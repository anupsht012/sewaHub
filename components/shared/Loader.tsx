import { Sparkles, Command } from "lucide-react";

export default function Loader({
  text = "Please wait...",
}: {
  text?: string;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-6">
      {/* Dynamic Radial Mesh Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute h-[500px] w-[500px] animate-pulse rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Main Spinner & Visual Core */}
      <div className="relative flex flex-col items-center gap-8 text-center">
        {/* Layered Orbit Rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ripple Ring */}
          <div className="absolute h-28 w-28 animate-ping rounded-full border border-blue-500/20 opacity-75" />
          
          {/* Fast Reverse Outer Spinner */}
          <div className="absolute h-24 w-24 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-dashed border-indigo-500/30" />

          {/* Glowing Forward Gradient Orbit */}
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-500 shadow-[0_0_25px_rgba(59,130,246,0.5)]" />

          {/* Central Glass Core Icon */}
          <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner backdrop-blur-md">
            <Command className="h-6 w-6 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Text & Status Badge */}
        <div className="space-y-3">
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-blue-300" />
            <span>Processing Request</span>
          </div>

          {/* Custom Loading Message */}
          <p className="text-lg font-bold tracking-wide text-slate-900">
            {text}
          </p>

          {/* Animated Loading Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" />
          </div>
        </div>
      </div>

      {/* Subtle Footer Watermark */}
      <div className="absolute bottom-6 text-[11px] font-medium tracking-widest uppercase text-slate-600">
        KaamSewa Platform
      </div>
    </div>
  );
}