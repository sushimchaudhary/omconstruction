"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/types/motionvariants";
import RevealHeading from "./Revealheading";

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Guest scans and orders",
      description:
        "A QR code sits on the table. The guest scans it, browses the menu on their own phone, and sends the order — no app to download.",
      image: "/3.jpg",
      alt: "Guest scanning the QR code on the restaurant table",
    },
    {
      step: "2",
      title: "Kitchen sees it right away",
      description:
        "The order shows up on the kitchen screen the moment it's placed, so nothing gets missed or written down twice.",
      image: "/4.jpg",
      alt: "Chef checking a new order on the kitchen screen",
    },
    {
      step: "3",
      title: "You see everything, live",
      description:
        "Sales, popular dishes, and how each branch is doing today — all in one dashboard you can check from anywhere.",
      image: "/5.jpg",
      alt: "Kitchen screen showing a list of active orders",
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 md:py-16 py-5 md:px-8 bg-slate-50/50">
      <RevealHeading
        eyebrow="How it works"
        title="From the table to the kitchen, in seconds"
        description="No training manuals needed. If your staff can use a phone, they can use this."
      />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
      >
        {steps.map((s) => (
          <motion.div
            key={s.step}
            layout
            variants={fadeUp}
            transition={{ type: "spring", stiffness: 160, damping: 7, mass: 1.7 }}
            whileHover={{
              y: -10,
              scale: 1.02,
              boxShadow: "0 25px 50px -20px rgba(15,23,42,0.18)",
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col justify-between rounded-lg border border-slate-200/80 bg-white p-2 shadow-sm transition-colors duration-300 hover:border-cyan-500 will-change-transform"
          >
            <div>
              {/* Image Container with Zoom Effect */}
              <div className="relative h-56 w-full overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

               
              </div>

              {/* Title & Description */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mt-5 space-y-2 px-2 pb-2"
              >
                <h3 className="font-[var(--font-sora)] text-lg font-bold text-slate-900 group-hover:text-emerald-950 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {s.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}