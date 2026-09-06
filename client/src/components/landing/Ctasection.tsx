"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <section className="mx-auto max-w-7xl px-5 md:py-16 py-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl px-6 py-20 sm:px-16 text-center text-white shadow-2xl"
      >
        <Image
          src="/2.jpg"
          alt="QR code stand on a restaurant table next to plated food"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0B2027]/60" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Ready to try it in{" "}
            <span className="italic bg-gradient-to-r from-[#32BCC5] to-[#8FD8DE] bg-clip-text text-transparent">
              your restaurant
            </span>
          </h2>
          <p className="text-white text-sm">
            We'll set it up with your menu and show your team how it works — free, no commitment.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={onOpenDemo}
              className="group rounded-lg bg-gradient-to-r from-[#32BCC5] to-[#127986] px-8 py-4 text-sm font-bold text-white shadow-lg cursor-pointer flex items-center justify-center gap-2.5 transition-shadow hover:shadow-cyan-500/25 hover:shadow-2xl"
            >
              <span>Book a Free Demo</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-2 group-active:translate-x-3" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}