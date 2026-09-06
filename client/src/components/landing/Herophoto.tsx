"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import CurveBadge from "./Curvedbadge";

const MENU_ITEMS = [
  { src: "/3.jpg", alt: "step 1" },
  { src: "/1.jpg", alt: "step 2" },
  { src: "/2.jpg", alt: "step 3" },
  { src: "/4.jpg", alt: "step 4" },
  { src: "/5.jpg", alt: "step 5" },
];

export default function HeroPhoto() {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % MENU_ITEMS.length);
    }, 3200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 6);
    rotateX.set(py * -6);
  }
  
  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const corner = "absolute h-6 w-6 border-[#32BCC5] z-10";

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none" style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        /* Aspect Ratio लाई 4/3 पारिएको छ जसले गर्दा height/width ठूलो देखिन्छ */
        className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden  shadow-2xl shadow-[#0B2027]/30 border border-[#DCEEF0] bg-[#0B2027]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={MENU_ITEMS[active].src}
            initial={reduceMotion ? { opacity: 0 } : { rotateY: 90, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { rotateY: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            className="absolute inset-0"
          >
            <Image
              src={MENU_ITEMS[active].src}
              alt={MENU_ITEMS[active].alt}
              fill
              className="object-cover"
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Viewfinder corner brackets */}
        <span className={`${corner} left-4 top-4 border-l-2 border-t-2`} />
        <span className={`${corner} right-4 top-4 border-r-2 border-t-2`} />
        <span className={`${corner} bottom-4 left-4 border-b-2 border-l-2`} />
        <span className={`${corner} bottom-4 right-4 border-b-2 border-r-2`} />

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {MENU_ITEMS.map((item, i) => (
            <span
              key={item.src}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-[#32BCC5]" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Signature curved-type stamp */}
      <div className="absolute -bottom-6 -right-6 hidden sm:block drop-shadow-xl z-20">
        <CurveBadge text="Fresh Orders • Live Kitchen" size={132} />
      </div>
    </div>
  );
}