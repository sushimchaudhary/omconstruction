"use client";

import { useEffect, useState } from "react";
import { AboutService, type AboutItem } from "../../services/aboutServices";

const TABS = [
  { key: "description", label: "Overview" },
  { key: "mission", label: "Mission" },
  { key: "vision", label: "Vision" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AboutSection() {
  const [record, setRecord] = useState<AboutItem | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [active, setActive] = useState<TabKey>("description");
  const [isAnimating, setIsAnimating] = useState(false);

  const load = async () => {
    setStatus("loading");
    try {
      const res = await AboutService.getDetails();
      const item: AboutItem | undefined = Array.isArray(res?.data)
        ? res.data[0]
        : res?.data ?? res;
      if (!item) throw new Error("No about content has been published yet.");
      setRecord(item);
      setActive("description");
      setStatus("ready");
    } catch (err: any) {
      setErrorMsg(
        typeof AboutService.parseError === "function"
          ? AboutService.parseError(err)
          : err?.message || "Something went wrong"
      );
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleTabChange = (key: TabKey) => {
    if (key === active) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActive(key);
      setIsAnimating(false);
    }, 180);
  };

  return (
    <section id="about" className="about-root w-full bg-white py-6 sm:py-12 md:py-20 px-4 sm:px-6 lg:px-12">
      <style>{`
        .about-root {
          --navy: #173457;
          --navy-light: #2a4d78;
          --orange: #fd6102;
          --ink: #334155;
          --ink-soft: #64748b;
          --line: #e2e8f0;
          --font-display: "Fraunces", Georgia, "Times New Roman", serif;
          --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
          font-family: var(--font-body);
        }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

        /* CKEditor raw typography integration */
        .ck-content { font-family: var(--font-body); color: var(--ink); }
        .ck-content p { margin-bottom: 1.25rem; line-height: 1.75; font-size: 1rem; }
        @media (min-width: 640px) {
          .ck-content p { margin-bottom: 1.5rem; line-height: 1.85; font-size: 1.125rem; }
        }
        .ck-content p:last-child { margin-bottom: 0; }
        .ck-content h1, .ck-content h2, .ck-content h3,
        .ck-content h4, .ck-content h5, .ck-content h6 {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--navy);
          margin: 1.5rem 0 0.75rem;
          line-height: 1.3;
        }
        .ck-content h1 { font-size: 1.5rem; }
        .ck-content h2 { font-size: 1.35rem; }
        @media (min-width: 640px) {
          .ck-content h1 { font-size: 1.875rem; }
          .ck-content h2 { font-size: 1.5rem; }
        }
        .ck-content ul { list-style: disc; padding-left: 1.25rem; margin: 1rem 0; }
        .ck-content ol { list-style: decimal; padding-left: 1.25rem; margin: 1rem 0; }
        .ck-content li { margin-bottom: 0.5rem; font-size: 1rem; line-height: 1.6; }
        @media (min-width: 640px) {
          .ck-content li { font-size: 1.125rem; line-height: 1.75; }
        }
        .ck-content strong, .ck-content b { font-weight: 700; color: var(--navy); }
        .ck-content a { color: var(--orange); text-decoration: underline; text-underline-offset: 4px; }
        .ck-content blockquote {
          border-left: 4px solid var(--orange);
          padding-left: 1rem;
          margin: 1.25rem 0;
          color: var(--navy-light);
          font-style: italic;
          font-size: 1.05rem;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {status === "loading" && <AboutSkeleton />}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded border border-red-200 max-w-md mx-auto text-center">
            <p className="text-slate-700 font-medium mb-4">{errorMsg}</p>
            <button
              type="button"
              className="px-6 py-2.5 bg-[var(--navy)] text-white font-semibold rounded hover:bg-slate-800 transition shadow-sm"
              onClick={load}
            >
              Try again
            </button>
          </div>
        )}

        {status === "ready" && record && (
          <ReadyView
            record={record}
            active={active}
            handleTabChange={handleTabChange}
            isAnimating={isAnimating}
          />
        )}
      </div>
    </section>
  );
}

function ReadyView({
  record,
  active,
  handleTabChange,
  isAnimating,
}: {
  record: AboutItem;
  active: TabKey;
  handleTabChange: (k: TabKey) => void;
  isAnimating: boolean;
}) {
  const panels: Record<TabKey, string | undefined> = {
    description: record.description,
    mission: record.mission,
    vision: record.vision,
  };
  const availableTabs = TABS.filter((t) => panels[t.key]);

  return (
    <div className="space-y-6 sm:space-y-10 md:space-y-12">
      {/* 1. Website Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
          Company Overview
        </span>
        <h1
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
        >
          {record.title}
        </h1>
        <div className="w-12 sm:w-16 h-1 bg-[var(--orange)] mx-auto mt-2 sm:mt-4 rounded-full" />
      </div>

      {/* 2. Responsive Hero Banner Image + Overlapped Floating Badge */}
      {record.image && (
        <div className="relative w-full rounded-md overflow-hidden border border-slate-100 shadow-lg bg-slate-900 group">
          <img
            src={record.image}
            alt={record.title || "About us"}
            className="w-full h-[220px] sm:h-[300px] md:h-[380px] object-cover transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/10 to-transparent pointer-events-none" />

          {/* Organic Natural Flower Badge */}
          {typeof record.years_exp === "number" && (
            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-10 flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 drop-shadow-xl hover:scale-105 transition-transform duration-300">
              {/* Background Flower Layer 1 */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full text-[var(--orange)] opacity-20 scale-110 blur-[2px]"
                aria-hidden="true"
              >
                <path
                  d="M50 0 C58 10, 68 8, 75 13 C82 18, 88 26, 90 35 C92 44, 98 52, 95 61 C92 70, 85 78, 77 82 C69 86, 60 92, 50 92 C40 92, 31 86, 23 82 C15 78, 8 70, 5 61 C2 52, 8 44, 10 35 C12 26, 18 18, 25 13 C32 8, 42 10, 50 0 Z"
                  fill="currentColor"
                />
              </svg>

              {/* Background Flower Layer 2 */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full text-[var(--orange)] fill-current drop-shadow-md"
                aria-hidden="true"
              >
                <path
                  d="M50 2 
                     C54 12, 64 10, 71 16 
                     C78 22, 84 31, 85 40 
                     C86 49, 94 56, 91 65 
                     C88 74, 80 81, 72 85 
                     C64 89, 56 94, 50 94 
                     C44 94, 36 89, 28 85 
                     C20 81, 12 74, 9 65 
                     C6 56, 14 49, 15 40 
                     C16 31, 22 22, 29 16 
                     C36 10, 46 12, 50 2 Z"
                />
              </svg>

              {/* Inner White Flower Ring & Content */}
              <div className="relative z-10 w-[78%] h-[78%] bg-white rounded-full flex flex-col items-center justify-center text-center p-1 sm:p-2 border border-amber-100 sm:border-2 shadow-inner">
                <div className="flex items-baseline justify-center">
                  <span
                    className="text-xl sm:text-3xl md:text-4xl font-black leading-none tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
                  >
                    {record.years_exp}
                  </span>
                  <span className="text-sm sm:text-xl md:text-2xl font-black text-[var(--orange)] ml-0.5">
                    +
                  </span>
                </div>
                <span className="text-[7px] sm:text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider text-[var(--orange)] leading-tight mt-0.5 sm:mt-1 max-w-[55px] sm:max-w-[65px]">
                  Years of Experience
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Sleek Website-Style Tab Navigation */}
      {availableTabs.length > 1 && (
        <div className="border-b border-slate-200">
          <div className="flex justify-center -mb-px space-x-6 sm:space-x-12">
            {availableTabs.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => handleTabChange(t.key)}
                  className={`py-2.5 sm:py-4 text-sm sm:text-lg font-bold tracking-wide transition-all border-b-2 ${
                    isActive
                      ? "text-[var(--navy)] border-[var(--orange)]"
                      : "text-slate-400 border-transparent hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Pure Clean Text Container */}
      <div className="max-w-4xl mx-auto pt-1 sm:pt-2 min-h-[180px]">
        <div
          className={`transition-all duration-300 ease-out transform ${
            isAnimating
              ? "opacity-0 translate-x-4 scale-[0.99]"
              : "opacity-100 translate-x-0 scale-100"
          }`}
        >
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{ __html: panels[active] || "" }}
          />
        </div>
      </div>
    </div>
  );
}

function AboutSkeleton() {
  return (
    <div className="space-y-8 sm:space-y-12 animate-pulse">
      <div className="h-8 sm:h-12 bg-slate-200 rounded w-1/2 mx-auto" />
      <div className="h-[220px] sm:h-[380px] bg-slate-200 rounded w-full" />
      <div className="h-8 sm:h-10 bg-slate-200 rounded w-64 mx-auto" />
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="h-4 bg-slate-200 rounded w-4/6" />
      </div>
    </div>
  );
}