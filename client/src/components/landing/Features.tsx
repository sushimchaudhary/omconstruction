"use client";

import { motion } from "framer-motion";
import { BarChart3, Building2, CloudCog, PackageSearch, QrCode, Users, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer } from "@/types/motionvariants";
import RevealHeading from "./Revealheading";

export default function Features() {
  const list = [
    { icon: CloudCog, tag: "Billing", title: "Take orders & print bills", desc: "Ring up orders fast, split a bill between guests, move a table, or apply a discount in a couple of taps." },
    { icon: PackageSearch, tag: "Stock", title: "Know what's running low", desc: "Stock goes down automatically as dishes are ordered, so you know what to reorder before you run out." },
    { icon: Building2, tag: "Branches", title: "Manage every branch at once", desc: "One login for all your outlets — same menu, same prices, same reports, no re-entering anything." },
    { icon: BarChart3, tag: "Reports", title: "See how business is doing", desc: "Check your busiest hours, best-selling dishes, and daily totals without waiting for someone to tally it up." },
    { icon: QrCode, tag: "QR Menu", title: "Let guests order themselves", desc: "A QR code on each table opens a menu with photos, so guests can order without waiting to flag a waiter." },
    { icon: Users, tag: "Staff", title: "Control who can do what", desc: "Give managers, cashiers, waiters, and kitchen staff their own logins and their own level of access." },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-5 md:py-20 py-5 md:px-8 bg-slate-50/50">
      <RevealHeading eyebrow="What you get" title="Everything a restaurant needs, in one place" />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
      >
        {list.map((item) => (
          <motion.div
            key={item.title}
            layout
            variants={fadeUp}
            transition={{ type: "spring", stiffness: 160, damping: 7, mass: 1.7 }}
            whileHover={{
              y: -10,
              scale: 1.02,
              boxShadow: "0 25px 50px -20px rgba(15,23,42,0.18)",
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col justify-between rounded-lg border border-slate-200/80 bg-white p-8 shadow-sm transition-colors duration-300 hover:border-[#32BCC5] will-change-transform"
          >
            <div>
              {/* Header with Icon and Tag */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <motion.span
                  whileHover={{ scale: 1.12, rotate: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-[#32BCC5] border border-emerald-100 transition-colors group-hover:bg-gradient-to-br group-hover:from-[#32BCC5] group-hover:to-teal-600 group-hover:text-white"
                >
                  <item.icon className="h-6 w-6" />
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-[var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#32BCC5]" />
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
                <h3 className="font-[var(--font-sora)] text-lg font-bold text-slate-900 group-hover:text-emerald-950 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-medium">
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