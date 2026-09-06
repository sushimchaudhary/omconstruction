"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function TrustStrip() {
  const reduceMotion = useReducedMotion();

  // Short & Sweet Construction Points
  const items = [
    "🏗️ Complete Construction Services",
    "📜 Municipal Approval Guaranteed",
    "📐 Architectural & 3D Design",
    "💎 Premium Quality Materials",
    "⏱️ On-Time Project Delivery",
    "👷 Expert On-Site Engineers",
  ];

  const loop = [...items, ...items];

  return (
    <div className="border-y border-slate-200/80 bg-slate-50/80 py-4 backdrop-blur overflow-hidden">
      <p className="text-center text-[11px] font-bold uppercase tracking-widest text-[#1c3551] font-[var(--font-mono)] mb-2.5">
        Why Choose Om Construction
      </p>

      <div className="relative mx-auto max-w-7xl px-5">
        <motion.div
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 45, repeat: Infinity, ease: "linear" } // Duration to 45s for smoother, slower scrolling
          }
          className="flex w-max items-center gap-10 text-xs sm:text-sm font-semibold text-slate-700"
        >
          {loop.map((item, i) => (
            <span
              key={i}
              className="whitespace-nowrap flex items-center gap-2 hover:text-[#f96400] transition-colors cursor-default"
            >
              {item}
            </span>
          ))}
        </motion.div>

        {!reduceMotion && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent" />
          </>
        )}
      </div>
    </div>
  );
}