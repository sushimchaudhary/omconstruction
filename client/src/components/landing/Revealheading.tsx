"use client";

import { fadeUp, staggerContainer } from "@/types/motionvariants";
import { motion } from "framer-motion";

export default function RevealHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="text-center max-w-2xl mx-auto space-y-3"
    >
      <motion.span
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="font-[var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[color:var(--rc-cyan)] block"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="font-[var(--font-sora)] text-3xl font-extrabold text-slate-900 sm:text-4xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="text-slate-600 text-sm sm:text-base">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}