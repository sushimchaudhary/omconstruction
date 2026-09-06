"use client";

export default function BackgroundGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. Warm Restaurant Overhead Spotlight / Pendant Lighting */}
      <div className="absolute top-[-15%] left-1/2 h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300/25 via-[#32BCC5]/15 to-transparent blur-[120px]" />

      {/* 2. Cozy Restaurant Corner Warm Amber Glow */}
      <div className="absolute top-[25%] -right-[15%] h-[600px] w-[600px] rounded-full bg-orange-400/15 blur-[160px]" />

      {/* 3. Modern POS Kitchen Screen Teal Glow */}
      <div className="absolute top-[55%] -left-[15%] h-[600px] w-[600px] rounded-full bg-[#32BCC5]/20 blur-[150px]" />

      {/* 4. Fine-Dining Atmospheric Mesh / Warm Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(#0e7491 1px, transparent 1px), radial-gradient(#f59e0b 1px, transparent 1px)`,
          backgroundSize: `40px 40px`,
          backgroundPosition: `0 0, 20px 20px`
        }}
      />

      {/* 5. Subtle Steam & Flare Bokeh (Kitchen & Fresh Food Ambient) */}
      <div className="absolute inset-0">
        <div className="absolute top-[15%] left-[12%] h-48 w-48 rounded-full bg-amber-200/20 blur-3xl animate-pulse duration-1000" />
        <div className="absolute top-[40%] right-[10%] h-64 w-64 rounded-full bg-[#32BCC5]/15 blur-3xl animate-pulse duration-700" />
        <div className="absolute bottom-[15%] left-[20%] h-52 w-52 rounded-full bg-orange-300/15 blur-3xl" />
      </div>

      {/* 6. Floating Ambient Culinary Sparkles */}
      {/* <div className="absolute inset-0 opacity-50">
        <span className="absolute top-[22%] left-[18%] text-amber-500 text-sm animate-ping">✦</span>
        <span className="absolute top-[38%] right-[22%] text-[#32BCC5] text-xs animate-pulse">✦</span>
        <span className="absolute top-[68%] left-[14%] text-orange-400 text-sm animate-pulse">★</span>
        <span className="absolute top-[82%] right-[15%] text-[#0e7491] text-xs">✦</span>
      </div> */}
    </div>
  );
}