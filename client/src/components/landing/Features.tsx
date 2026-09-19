"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Ruler, 
  FileCheck2, 
  ShieldCheck, 
  HardHat, 
  Truck, 
  Sparkles 
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/types/motionvariants";
import RevealHeading from "./Revealheading";

export default function Features() {
  const list = [
    {
      icon: Building2,
      tag: "Residential",
      title: "Turnkey Home Construction",
      desc: "Complete end-to-end home building solutions, from structural foundation and brickwork to interior finishes and final handover.",
    },
    {
      icon: Ruler,
      tag: "Architecture",
      title: "3D Elevation & Planning",
      desc: "Custom architectural blueprints, 2D floor plans, and realistic 3D exterior renderings designed by experienced engineers.",
    },
    {
      icon: FileCheck2,
      tag: "Approvals",
      title: "Municipal & Code Compliance",
      desc: "Hassle-free support for local municipality (Napa) drawing approvals, structural safety verification, and legal documentation.",
    },
    {
      icon: ShieldCheck,
      tag: "Quality",
      title: "Certified Structural Safety",
      desc: "Built to withstand seismic activity using high-grade TMT steel bars, certified cement brands, and lab-tested concrete mix.",
    },
    {
      icon: HardHat,
      tag: "Supervision",
      title: "On-Site Civil Engineers",
      desc: "Continuous site supervision by experienced site engineers to ensure precision craftsmanship and zero compromise on safety.",
    },
    {
      icon: Truck,
      tag: "Turnkey",
      title: "Commercial & Infra Works",
      desc: "Full-scale construction for commercial complexes, office spaces, warehouses, and structural renovation projects across Nepal.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-12 md:py-20 md:px-8 bg-slate-50/60">
      <RevealHeading 
        eyebrow="Our Core Capabilities" 
        title="Comprehensive Construction Services Under One Roof" 
      />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
      >
        {list.map((item) => (
          <motion.div
            key={item.title}
            layout
            variants={fadeUp}
            transition={{ type: "spring", stiffness: 160, damping: 7, mass: 1.7 }}
            whileHover={{
              y: -8,
              scale: 1.015,
              boxShadow: "0 20px 40px -15px rgba(28, 53, 81, 0.12)",
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col justify-between rounded border border-slate-200/90 bg-white p-7 shadow-xs transition-colors duration-300 hover:border-[#f96400]/60 will-change-transform"
          >
            <div>
              {/* Header with Icon and Tag */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <motion.span
                  whileHover={{ scale: 1.1, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1c3551]/5 text-[#1c3551] border border-[#1c3551]/10 transition-colors group-hover:bg-[#f96400] group-hover:text-white group-hover:border-[#f96400]"
                >
                  <item.icon className="h-6 w-6" />
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-[var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-slate-600 group-hover:bg-[#f96400]/10 group-hover:text-[#f96400] transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#f96400]" />
                  {item.tag}
                </motion.span>
              </div>

              {/* Title & Description */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h3 className="font-[var(--font-sora)] text-lg font-extrabold text-[#1c3551] group-hover:text-[#1c3551] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}