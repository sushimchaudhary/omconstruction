"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * CurveBadge — the page's signature element.
 * A slowly-rotating ring with the tagline set on a curved path, rendered
 * in the brand gradient (#32BCC5 → #127986). Used large in the Hero
 * (overlapping the product photo like a stamp) and small in the Footer.
 */
export default function CurveBadge({
  text,
  size = 148,
  className = "",
}: {
  text: string;
  size?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const id = `curve-${text.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${size}`;
  const radius = size / 2 - 16;
  const c = size / 2;

  return (
    <motion.div
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={reduceMotion ? undefined : { duration: 26, repeat: Infinity, ease: "linear" }}
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
        <defs>
          <path
            id={id}
            d={`M ${c - radius}, ${c} a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#32BCC5" />
            <stop offset="100%" stopColor="#127986" />
          </linearGradient>
        </defs>
        <circle cx={c} cy={c} r={radius - 11} fill="none" stroke={`url(#${id}-grad)`} strokeWidth="1" opacity="0.3" />
        <text
          fontSize={size < 100 ? 7.5 : 10.5}
          fontWeight={700}
          letterSpacing="2.5"
          fill={`url(#${id}-grad)`}
          className="font-[var(--font-mono)] uppercase"
        >
          <textPath href={`#${id}`} startOffset="0%">
            {text} • {text} •{" "}
          </textPath>
        </text>
      </svg>
      
      {/* Center Logo Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-full border border-[#32BCC5]/20 bg-white p-1.5 shadow-lg shadow-[#127986]/20 backdrop-blur"
          style={{ width: size * 0.42, height: size * 0.42 }}
        >
          <Image
            src="/loading.png"
            alt="Logo"
            width={size * 0.35}
            height={size * 0.35}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}