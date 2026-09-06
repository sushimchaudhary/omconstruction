


"use client";

import { useEffect, useState } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { publicAxios } from "@/lib/config/axios.config";
import { PublicPlan } from "@/types/authType";
import ScrollProgress from "@/components/landing/Scrollprogress";
import BackgroundGlow from "@/components/landing/Backgroundglow";
import Hero from "@/components/landing/Hero";
import SectionDivider from "@/components/landing/Sectiondivider";
import TrustStrip from "@/components/landing/Truststrip";
import HowItWorks from "@/components/landing/Howtoworks";
import Features from "@/components/landing/Features";
import DownloadApp from "@/components/landing/Download";
import SystemMetrics from "@/components/landing/Systemmetrics";
import PricingSection from "@/components/landing/Pricingsection";
import CTASection from "@/components/landing/Ctasection";

import ScrollToTop from "@/components/ScrollTop";
import AboutSection from "@/components/landing/about";
import ServicesSection from "@/components/landing/services";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export default function LandingPage() {
  const [stats, setStats] = useState({ restaurants: 0, branches: 0 });
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // ── PWA INSTALL LOGIC (mirrors the admin login page) ──
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) {
      setIsInstallable(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else if (typeof window !== "undefined") {
      // Fallback for browsers that don't fire beforeinstallprompt (e.g. iOS Safari).
      window.alert("To install the app, tap 'Add to Home Screen' in your browser menu.");
    }
  };

  useEffect(() => {
    async function fetchPublicData() {
      try {
        setLoading(true);
        const response = await publicAxios.get("/public/stats");
        const resData = response.data?.data;

        if (resData) {
          setStats({
            restaurants: resData.restaurants || 0,
            branches: resData.branches || 0,
          });
          setPlans(resData.plans || []);
        }
      } catch (err) {
        console.error("Failed to load landing page stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicData();
  }, []);

return (
  <div
    className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-[var(--font-inter)] bg-[color:var(--rc-bg)] text-[color:var(--rc-text)] antialiased min-h-screen w-full selection:bg-[#32BCC5] selection:text-white`}
    style={
      {
        "--rc-bg": "#F5FBFC",
        "--rc-surface": "#FFFFFF",
        "--rc-border": "#E4F2F3",
        "--rc-teal": "#32BCC5",
        "--rc-teal-2": "#127986",
        "--rc-text": "#0B2027",
        "--rc-text-muted": "#4B6367",
      } as React.CSSProperties
    }
  >

   

    {/* 2. Main ra Footer lai wrapper ma rakhera horizontal overflow blck garne */}
    <div className="w-full overflow-x-hidden">
      <main>
        <Hero  />
        <SectionDivider />
        <TrustStrip />
        <AboutSection/>
        <ServicesSection/>
         <HowItWorks />
        <Features />
        <DownloadApp isInstallable={isInstallable} onInstallClick={handleInstallClick} />
        <SystemMetrics stats={stats} />
        <PricingSection plans={plans} loading={loading} onOpenDemo={() => setIsDemoOpen(true)} />
        <CTASection onOpenDemo={() => setIsDemoOpen(true)} />
      </main>
    </div>

   
    <ScrollToTop />
  </div>
);
}