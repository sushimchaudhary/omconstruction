"use client";

import { ReactNode } from "react";
import Navbar from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import BackgroundGlow from "@/components/landing/Backgroundglow";
import ScrollProgress from "@/components/landing/Scrollprogress";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    /* Outer wrapper बाट overflow-x-hidden हटाइयो ताकि sticky navbar ले काम गरोस् */
    <div className="relative min-h-screen w-full bg-[color:var(--rc-bg,#F5FBFC)] text-[color:var(--rc-text,#0B2027)] antialiased">
      <ScrollProgress />
      <BackgroundGlow />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Content मा overflow-x-hidden थपियो */}
      <main className="relative z-10 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <div className="w-full overflow-x-hidden">
        <Footer />
      </div>
    </div>
  );
}