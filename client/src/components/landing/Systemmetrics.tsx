"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { ProjectsServices } from "@/services/projectsServices"; // Route path update garnus

interface MetricsState {
  total: number;
  completed: number;
  ongoing: number;
}

export default function SystemMetrics() {
  const [counts, setCounts] = useState<MetricsState>({
    total: 0,
    completed: 0,
    ongoing: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjectStats() {
      try {
        const res = await ProjectsServices.getDetails();
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

        const total = data.length;
        const completed = data.filter(
          (p: any) =>
            p.status?.toLowerCase() === "completed" ||
            p.status?.toLowerCase() === "complete"
        ).length;
        const ongoing = data.filter(
          (p: any) =>
            p.status?.toLowerCase() === "ongoing" ||
            p.status?.toLowerCase() === "in_progress" ||
            p.status?.toLowerCase() === "active"
        ).length;

        setCounts({ total, completed, ongoing });
      } catch (error) {
        console.error("Failed to fetch project stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectStats();
  }, []);

  const metrics = [
    {
      value: counts.total,
      suffix: "+",
      label: "Total Projects Delivered",
      accentColor: "text-[#f96400]",
    },
    {
      value: counts.completed,
      suffix: "+",
      label: "Successfully Completed",
      accentColor: "text-[#f96400]",
    },
    {
      value: counts.ongoing,
      suffix: "",
      label: "Active Construction Sites",
      accentColor: "text-[#f96400]",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-[#1c3551]/20 text-white">
      {/* Local Image Background /systemmatrix.png */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/systemmatrix.png')`,
        }}
      />

      {/* Dark Overlay gradient for contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1c3551]/60 via-[#1c3551]/65 to-[#1c3551]/70" />

      {/* Clean Text-only Metrics Row */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className={`flex flex-col items-center justify-center ${
                idx !== 0 ? "pt-8 sm:pt-0 sm:pl-8" : ""
              }`}
            >
              {/* Animated Big Typography Numbers */}
              <CountUpMetric
                value={m.value}
                suffix={m.suffix}
                accentColor={m.accentColor}
                isLoading={loading}
              />

              {/* Minimal Text Label */}
              <p className="mt-2 text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-200 drop-shadow-sm">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUpMetric({
  value,
  suffix,
  accentColor,
  isLoading,
}: {
  value: number;
  suffix: string;
  accentColor: string;
  isLoading: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || isLoading) return;

    if (reduceMotion || value === 0) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });

    return () => controls.stop();
  }, [inView, value, reduceMotion, isLoading]);

  return (
    <p
      ref={ref}
      className={`font-mono text-6xl sm:text-7xl font-black ${accentColor} tracking-tight drop-shadow-md`}
    >
      {isLoading ? (
        <span className="animate-pulse text-white/40">--</span>
      ) : (
        <>
          {Math.round(display)}
          <span className="text-5xl sm:text-6xl font-bold text-white/90 ml-1">
            {suffix}
          </span>
        </>
      )}
    </p>
  );
}