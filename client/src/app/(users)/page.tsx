"use client";

import { useEffect, useState } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { publicAxios } from "@/lib/config/axios.config";
import { PublicPlan } from "@/types/authType";

import Hero from "@/components/landing/Hero";
import SectionDivider from "@/components/landing/Sectiondivider";
import TrustStrip from "@/components/landing/Truststrip";
import Features from "@/components/landing/Features";
import DownloadApp from "@/components/landing/Download";
import SystemMetrics from "@/components/landing/Systemmetrics";
import PricingSection from "@/components/landing/Pricingsection";
import CTASection from "@/components/landing/Ctasection";

import ScrollToTop from "@/components/ScrollTop";
import AboutSection from "@/components/landing/about";
import ServicesSection from "@/components/landing/services";
import ProjectsSection from "@/components/landing/ProjectSection";
import ContactSection from "@/components/landing/ContactSection";

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
  const [stats, setStats] = useState({ projects: 0, clients: 0 });
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // ── PWA INSTALL LOGIC ──
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
            projects: resData.projects || 0,
            clients: resData.clients || 0,
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
      className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-[var(--font-inter)] bg-[color:var(--rc-bg)] text-[color:var(--rc-text)] antialiased min-h-screen w-full selection:bg-[#FD6102] selection:text-white`}
      style={
        {
          "--rc-bg": "#FFFFFF",
          "--rc-surface": "#F8FAFC",
          "--rc-border": "#E2E8F0",
          "--rc-navy": "#153052",
          "--rc-orange": "#FD6102",
          "--rc-text": "#0F172A",
          "--rc-text-muted": "#475569",
        } as React.CSSProperties
      }
    >
      <div className="w-full overflow-x-hidden">
        <main>
          {/* 1. Hero Section - Primary Banner */}
          <Hero />

          {/* 2. Client Trust / Partners Logos */}
          <TrustStrip />

          {/* 3. Company Introduction & Vision */}
          <AboutSection />

          <SectionDivider />

          {/* 4. Core Offerings & Engineering Services */}
          <ServicesSection />

          {/* 5. Key Construction Capabilities / Highlights */}
          <Features />

          {/* 6. Live Metrics & Delivery Statistics */}
          <SystemMetrics />

          {/* 7. Portfolio Showcase (Completed & Ongoing) */}
          <ProjectsSection />

          <SectionDivider />

          {/* 8. Call to Action / App Download */}
          <DownloadApp isInstallable={isInstallable} onInstallClick={handleInstallClick} />

          {/* 9. Contact Section */}
          <ContactSection />
        </main>
      </div>

      
    </div>
  );
}