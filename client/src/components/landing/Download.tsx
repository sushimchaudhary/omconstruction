"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Smartphone, X, HelpCircle, Check, HardHat } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Platform icons — served from /public as static images              */
/* ------------------------------------------------------------------ */

type PlatformId = "android" | "ios" | "desktop";

const PLATFORMS: {
  id: PlatformId;
  label: string;
  iconSrc: string;
  steps: string[];
}[] = [
  {
    id: "android",
    label: "Android",
    iconSrc: "/android.png",
    steps: [
      "Open Om Construction site in Chrome browser.",
      'Tap "Install" on the pop-up banner, or open the menu (⋮) at top right.',
      'Select "Add to Home screen" or "Install app" to complete setup.',
    ],
  },
  {
    id: "ios",
    label: "iPhone / iPad",
    iconSrc: "/iphone.png",
    steps: [
      "Open Om Construction site in Safari browser.",
      "Tap the Share button at the bottom of the screen.",
      'Scroll down and choose "Add to Home Screen", then tap "Add".',
    ],
  },
  {
    id: "desktop",
    label: "Desktop",
    iconSrc: "/chrome.png",
    steps: [
      "Open Om Construction portal in Chrome or Microsoft Edge.",
      "Click the Install icon located on the right side of the address bar.",
      'Or open browser settings and click "Install Om Construction".',
    ],
  },
];

export default function DownloadApp({
  isInstallable,
  onInstallClick,
}: {
  isInstallable: boolean;
  onInstallClick: () => void;
}) {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<PlatformId>("android");

  useEffect(() => {
    if (!showGuideModal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowGuideModal(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showGuideModal]);

  if (!isInstallable) return null;

  const active = PLATFORMS.find((p) => p.id === activeTab)!;

  return (
    <>
      <section id="how-to-download" className="mx-auto max-w-7xl px-5 pb-4 sm:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* ambient accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#153052]/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -bottom-16 h-40 w-40 rounded-full bg-[#FD6102]/10 blur-3xl"
          />

          <div className="relative z-10 flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <motion.span
              whileHover={{ scale: 1.08, rotate: -4 }}
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#153052]/10 to-[#FD6102]/10 text-[#153052] border border-[#FD6102]/20"
            >
              <Smartphone className="h-7 w-7 text-[#153052]" />
            </motion.span>
            <div>
              <span className="font-[var(--font-mono)] text-[10px] font-bold uppercase tracking-wider text-[#FD6102] flex items-center justify-center sm:justify-start gap-1">
                <HardHat className="h-3 w-3" /> Quick Site Portal Access
              </span>
              <h3 className="mt-1 font-[var(--font-sora)] text-lg sm:text-xl font-bold text-[#153052]">
                Get Om Construction Portal App
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                Install our application directly to your home screen for quick access to site operations, project tracking, and engineering updates — no app store required.
              </p>
              {/* supported platforms strip */}
              <div className="mt-2.5 flex items-center justify-center gap-2 sm:justify-start">
                {PLATFORMS.map(({ id, iconSrc, label }) => (
                  <span
                    key={id}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-50 border border-slate-200/80"
                  >
                    <img src={iconSrc} alt={label} className="h-3.5 w-3.5 object-contain" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGuideModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <HelpCircle className="h-4 w-4 text-[#FD6102]" />
              <span>How to Install</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onInstallClick}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#153052] to-[#FD6102] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#153052]/20 transition-all hover:shadow-xl hover:shadow-[#FD6102]/25 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Install App</span>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Installation Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowGuideModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="install-guide-title"
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100"
            >
              {/* header */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FD6102]/10 text-[#FD6102]">
                    <HelpCircle className="h-4.5 w-4.5" />
                  </span>
                  <h3 id="install-guide-title" className="text-base font-bold text-[#153052]">
                    How to Install Site App
                  </h3>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  aria-label="Close"
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* platform tabs */}
              <div className="flex gap-1 px-5 pt-4">
                {PLATFORMS.map(({ id, label, iconSrc }) => {
                  const isActive = id === activeTab;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`relative flex flex-1 flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition cursor-pointer ${
                        isActive
                          ? "bg-[#153052]/10 text-[#153052]"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      <img src={iconSrc} alt="" className="h-5 w-5 object-contain" />
                      <span>{label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="active-platform-underline"
                          className="absolute -bottom-[1px] left-2 right-2 h-0.5 rounded-full bg-[#FD6102]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* step list */}
              <div className="px-5 py-5">
                <AnimatePresence mode="wait">
                  <motion.ol
                    key={activeTab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3"
                  >
                    {active.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#153052]/10 text-[10px] font-bold text-[#153052]">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-slate-600">{step}</p>
                      </li>
                    ))}
                  </motion.ol>
                </AnimatePresence>
              </div>

              {/* footer */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <Check className="h-3.5 w-3.5 text-[#FD6102]" />
                  Fast & works offline
                </span>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="rounded-xl bg-[#153052] px-4 py-2 text-xs font-semibold text-white hover:bg-[#153052]/90 transition cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}