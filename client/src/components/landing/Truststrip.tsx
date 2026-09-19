"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function TrustStrip() {
  const reduceMotion = useReducedMotion();

  const items = [
    "🏗️ Complete Construction Services",
    "📜 Municipal Approval Guaranteed",
    "📐 Architectural & 3D Design",
    "💎 Premium Quality Materials",
    "⏱️ On-Time Project Delivery",
    "👷 Expert On-Site Engineers",
  ];

  const loop = [...items, ...items, ...items];

  return (
    <section className="relative w-full bg-transparent py-8 sm:py-12 overflow-hidden my-4">
      {/* Top Wave Border Line Only */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          className="relative block w-full h-6 sm:h-10 text-[#1c3551]/20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 py-2">
        <div className="flex items-center justify-center gap-2 text-center text-xs font-black uppercase tracking-widest text-[#f96400] mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[#f96400]" />
          <span>Why Choose Om Construction</span>
          <Sparkles className="w-3.5 h-3.5 text-[#f96400]" />
        </div>

        {/* Endless Transparent Ticker Banner */}
        <div className="relative mx-auto max-w-full overflow-hidden">
          <motion.div
            animate={reduceMotion ? undefined : { x: ["0%", "-33.33%"] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 35, repeat: Infinity, ease: "linear" }
            }
            className="flex w-max items-center gap-6 text-xs sm:text-sm font-bold text-[#1c3551]"
          >
            {loop.map((item, i) => (
              <span
                key={i}
                className="whitespace-nowrap flex items-center gap-2 bg-white/60 backdrop-blur-xs px-5 py-2.5 rounded-full border border-[#1c3551]/20 shadow-xs hover:border-[#f96400] hover:text-[#f96400] transition-all cursor-default"
              >
                {item}
              </span>
            ))}
          </motion.div>

          {/* Side Fading Gradient Effects for Transparent Feel */}
          {!reduceMotion && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-30" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-30" />
            </>
          )}
        </div>
      </div>

      {/* Bottom Wave Border Line Only */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 rotate-180 pointer-events-none">
        <svg
          className="relative block w-full h-6 sm:h-10 text-[#1c3551]/20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
        </svg>
      </div>
    </section>
  );
}