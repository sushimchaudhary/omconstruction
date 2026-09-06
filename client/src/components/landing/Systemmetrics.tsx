"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export default function SystemMetrics({ stats }: { stats: { restaurants: number; branches: number } }) {
  const restaurantCount = stats?.restaurants ?? 0;
  const branchCount = stats?.branches ?? 0;

  const metrics = [
    { value: restaurantCount, decimals: 0, suffix: "+", label: "Restaurants using RestoCloud", color: "text-[#32BCC5]" },
    { value: branchCount, decimals: 0, suffix: "+", label: "Branches running live", color: "text-[#32BCC5]" },
    { value: 99.9, decimals: 1, suffix: "%", label: "Uptime (always working)", color: "text-[#32BCC5]" },
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-slate-900 text-white">
      {/* Direct Unsplash Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop')`
        }}
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-900/40 to-slate-950/30"></div>

      {/* Floating Star & Bubble Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Shiny Stars / Cross Glows */}
        <div className="absolute top-8 left-[15%] text-[#32BCC5] opacity-40 animate-pulse text-xl">✦</div>
        <div className="absolute bottom-10 left-[45%] text-[#0e7491] opacity-50 animate-bounce text-sm">★</div>
        <div className="absolute top-12 right-[20%] text-[#32BCC5] opacity-40 animate-pulse text-lg">✦</div>
        
        {/* Glowing Bubbles */}
        <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-[#32BCC5]/15 blur-xl"></div>
        <div className="absolute bottom-1/3 right-12 w-32 h-32 rounded-full bg-[#0e7491]/20 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#32BCC5]/10 blur-3xl"></div>
      </div>

      {/* Banner Content (Without Card Box) */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800/60">
          {metrics.map((m, idx) => (
            <div key={m.label} className={idx !== 0 ? "pt-8 sm:pt-0 sm:pl-8" : ""}>
              <CountUpMetric {...m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUpMetric({
  value,
  decimals,
  suffix,
  label,
  color,
}: {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  color: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    
    if (reduceMotion || value === 0) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });

    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  return (
    <div className="group">
      <p ref={ref} className={`font-[var(--font-mono)] text-5xl sm:text-6xl font-black ${color} tracking-tight drop-shadow-md`}>
        {decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
        <span className="text-4xl sm:text-5xl font-extrabold text-white/80 ml-1">{suffix}</span>
      </p>
      <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300/90">{label}</p>
    </div>
  );
}