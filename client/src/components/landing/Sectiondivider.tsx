"use client";

/** A soft curved seam between the hero and the strip below it, instead of a hard edge. */
export default function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative h-10 sm:h-14">
      <svg
        className="absolute inset-0 h-full w-full text-white/60"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <path d="M0,32 C240,60 480,0 720,16 C960,32 1200,58 1440,28 L1440,60 L0,60 Z" fill="currentColor" />
      </svg>
    </div>
  );
}