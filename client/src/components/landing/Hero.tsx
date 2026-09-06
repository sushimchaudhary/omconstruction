"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Star,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/types/motionvariants";

export default function Hero({
  stats,
}: {
  stats?: { projects?: number; clients?: number };
  onOpenDemo?: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-950 text-white py-12 lg:py-20">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/herobanner.png"
          alt="Best construction company in Kathmandu, Nepal"
          fill
          priority
          /* object-cover ले Black Gap हटाउँछ र object-right ले फोटोको मुख्य भाग दायाँतिर राख्छ */
          className="object-cover object-right sm:object-center brightness-95 transition-transform duration-1000 ease-out"
        />
        
        {/* Left Side मा Text पढ्न सजिलो बनाउन र Right Side मा फोटो देखाउन Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-transparent " />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10 w-full">
        <motion.div
          variants={staggerContainer(0.12)}
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          className="flex flex-col items-start text-left max-w-2xl"
        >
          {/* Main Headline */}
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight  md:text-5xl text-white"
          >
            Best Construction Company{" "}
            <span className="bg-gradient-to-r from-orange-200 via-orange-400 to-[#f96400] bg-clip-text text-transparent block mt-1">
              in Kathmandu, Nepal
            </span>
          </motion.h1>

          {/* Subtitle / Description */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-6 text-left text-sm sm:text-base md:text-lg leading-relaxed text-slate-200 font-normal max-w-xl"
          >
            Building high-quality residential, commercial, and structural
            projects with engineering precision, safety, and modern design
            standards across Nepal.
          </motion.p>

          {/* Feature Badges */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-8 flex flex-wrap items-center justify-start gap-3 text-xs sm:text-sm font-medium text-white/90"
          >
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xs">
              <Building2 className="h-4 w-4 text-[#f96400]" />
              <span>Modern Architecture</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-[#f96400]" />
              <span>Certified Standards</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-[#f96400]" />
              <span>On-Time Delivery</span>
            </div>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-10 flex flex-col sm:flex-row w-full items-center justify-start gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href="#contact"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1c3551] to-[#f96400] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#f96400]/25 transition-all cursor-pointer hover:shadow-xl hover:shadow-[#f96400]/40"
            >
              <span className="whitespace-nowrap">Get In Touch</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#projects"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-slate-900/60 backdrop-blur-md px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:border-white"
            >
              <Play className="h-4 w-4 fill-white transition-colors group-hover:fill-[#f96400] group-hover:text-[#f96400]" />
              <span className="whitespace-nowrap">Our Projects</span>
            </motion.a>
          </motion.div>

          {/* Trust Ratings Footer */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 sm:gap-3 border-t border-white/10 pt-6 w-full"
          >
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-300">
              Trusted in over{" "}
              <strong className="text-white font-bold">
                {stats?.projects || "50+"} completed projects
              </strong>{" "}
              across Nepal
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}