"use client";

import { Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        setScrollProgress(currentScroll / totalScroll);
      }

      if (currentScroll > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsLaunching(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (isLaunching) return;
    setIsLaunching(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG Progress Circle Calc
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-[9999] pointer-events-auto">
          {/* Launching Smoke Cloud Particles Effect */}
          {isLaunching && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0.8, scale: 0.3, x: 0, y: 0 }}
                  animate={{
                    opacity: [0.8, 0.4, 0],
                    scale: [0.4, 1.5 + i * 0.2, 2.8],
                    x: (i % 2 === 0 ? 1 : -1) * (i * 8 + 12),
                    y: i * 16 + 24,
                  }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  className="absolute h-6 w-6 -translate-x-1/2 rounded-full bg-slate-300/60 blur-md"
                />
              ))}
            </div>
          )}

          {/* Rocket Button with Curved Arc Path Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={
              isLaunching
                ? {
                    x: [0, -35, -110, -210, -350],
                    y: [0, -130, -340, -580, -900],
                    rotate: [0, -20, -38, -50, -65],
                    scale: [1, 1.12, 1.1, 0.85, 0.3],
                    opacity: [1, 1, 0.9, 0.5, 0],
                  }
                : { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }
            }
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={
              isLaunching
                ? { duration: 1.15, ease: [0.16, 1, 0.3, 1] }
                : { type: "spring", stiffness: 300, damping: 22 }
            }
          >
            <motion.button
              onClick={scrollToTop}
              whileHover={isLaunching ? {} : { scale: 1.1 }}
              whileTap={isLaunching ? {} : { scale: 0.92 }}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#153052] via-[#1a3d69] to-[#FD6102] text-white shadow-2xl shadow-[#153052]/40 border border-white/30 backdrop-blur-md cursor-pointer overflow-hidden transition-shadow hover:shadow-[#FD6102]/50"
              aria-label="Scroll to top"
            >
              {/* Dynamic Scroll Progress Circle */}
              <svg
                className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-0.5"
                viewBox="0 0 56 56"
              >
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className="stroke-white/20"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className="stroke-[#FD6102] transition-all duration-150 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Rocket Icon */}
              <Rocket className="h-6 w-6 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6" />

              {/* Exhaust Flame Thrust on Hover & Launch */}
              <motion.span
                animate={
                  isLaunching
                    ? { scale: [1, 1.8, 1.2], opacity: [0.8, 1, 0] }
                    : {}
                }
                className="absolute -bottom-1 h-3.5 w-3.5 rounded-full bg-gradient-to-t from-[#FD6102] to-amber-400 blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}