"use client";

import { motion } from "framer-motion";
import { HardHat, Building2, Ruler, Hammer, Wrench, Truck, Compass } from "lucide-react";

export default function BackgroundGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. Primary Top Center Glow (Brand Navy & Orange Accent Mix) */}
      <div className="absolute top-[-15%] left-1/2 h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FD6102]/20 via-[#153052]/15 to-transparent blur-[120px]" />

      {/* 2. Construction Brand Orange Glow (Top Right) */}
      <div className="absolute top-[25%] -right-[15%] h-[600px] w-[600px] rounded-full bg-[#FD6102]/15 blur-[160px]" />

      {/* 3. Deep Architectural Navy Glow (Middle Left) */}
      <div className="absolute top-[55%] -left-[15%] h-[600px] w-[600px] rounded-full bg-[#153052]/20 blur-[150px]" />

      {/* 4. Blueprint / Engineering Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(#153052 1px, transparent 1px), radial-gradient(#FD6102 1px, transparent 1px)`,
          backgroundSize: `40px 40px`,
          backgroundPosition: `0 0, 20px 20px`
        }}
      />

      {/* 5. Ambient Site Lighting Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[15%] left-[12%] h-48 w-48 rounded-full bg-[#FD6102]/15 blur-3xl animate-pulse duration-1000" />
        <div className="absolute top-[40%] right-[10%] h-64 w-64 rounded-full bg-[#153052]/20 blur-3xl animate-pulse duration-700" />
        <div className="absolute bottom-[15%] left-[20%] h-52 w-52 rounded-full bg-[#FD6102]/10 blur-3xl" />
      </div>

      {/* 6. Floating Construction Icons Background */}
      <div className="absolute inset-0 opacity-15">
        {/* Safety Helmet */}
        <motion.div 
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[18%] left-[10%] text-[#FD6102]"
        >
          <HardHat className="h-10 w-10 sm:h-14 sm:w-14 stroke-[1.5]" />
        </motion.div>

        {/* Commercial Building */}
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[32%] right-[12%] text-[#153052]"
        >
          <Building2 className="h-12 w-12 sm:h-16 sm:w-16 stroke-[1.5]" />
        </motion.div>

        {/* Architect Ruler */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [-12, -5, -12] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[52%] left-[8%] text-[#FD6102]"
        >
          <Ruler className="h-9 w-9 sm:h-12 sm:w-12 stroke-[1.5]" />
        </motion.div>

        {/* Hammer & Tools */}
        <motion.div 
          animate={{ y: [0, 14, 0], rotate: [15, 22, 15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[68%] right-[16%] text-[#153052]"
        >
          <Hammer className="h-10 w-10 sm:h-14 sm:w-14 stroke-[1.5]" />
        </motion.div>

        {/* Construction Truck */}
        <motion.div 
          animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[82%] left-[18%] text-[#FD6102]"
        >
          <Truck className="h-11 w-11 sm:h-14 sm:w-14 stroke-[1.5]" />
        </motion.div>

        {/* Engineering Compass */}
        <motion.div 
          animate={{ y: [0, 10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute top-[22%] right-[35%] text-[#153052]"
        >
          <Compass className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
        </motion.div>

        {/* Wrench */}
        <motion.div 
          animate={{ y: [0, -12, 0], rotate: [-20, -10, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute top-[45%] left-[40%] text-[#FD6102]"
        >
          <Wrench className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
        </motion.div>
      </div>
    </div>
  );
}