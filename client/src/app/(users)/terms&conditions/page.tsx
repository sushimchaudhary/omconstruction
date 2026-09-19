"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Mail,
  Scale,
  AlertCircle,
  HelpCircle,
  HardHat,
  Building2,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

export default function TermsAndConditionsPage() {
  const { primaryColor } = useTheme();
  const themeColor =  "#153052";
  const lastUpdated = "July 2026";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700 selection:bg-[#06B6D4] selection:text-white">
      {/* Main Container */}
      <main className="max-w-6xl mx-auto py-8 space-y-8">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-2xl text-white p-8 sm:p-10 shadow-xl border border-slate-700/50"
          style={{ backgroundColor: themeColor }}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#fff" }}
              >
                <HardHat size={14} className="text-cyan-400" />
                <span>Construction Legal Agreement & Service Rules</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Terms and Conditions
              </h1>
              <p className="text-slate-100/90 text-sm leading-relaxed">
                Please review our client agreement and service policies carefully before engaging with Om Construction for commercial, residential, or architectural projects.
              </p>
              <p className="text-xs text-white/70 pt-1">
                Last Updated: {lastUpdated}
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner shrink-0">
              <Scale size={40} className="text-white" />
            </div>
          </div>

          {/* Background Decorative Glow */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: "#06B6D4" }}
          />
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner mb-4"
              style={{
                backgroundColor: `${themeColor}15`,
                color: themeColor,
              }}
            >
              <Building2 size={22} />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Project Execution
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All architectural, civil, and structural works are governed by agreed contract scopes, site specifications, and municipal engineering codes.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner mb-4"
              style={{
                backgroundColor: `${themeColor}15`,
                color: themeColor,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Safety & Standards
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We uphold strict building codes, quality raw materials, site safety regulations, and structural engineering certifications for every project.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner mb-4"
              style={{
                backgroundColor: `${themeColor}15`,
                color: themeColor,
              }}
            >
              <FileCheck2 size={22} />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Service Quotations
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Project estimation quotes, material BOQs, and payment milestones are finalized prior to construction site mobilization.
            </p>
          </div>
        </div>

        {/* Detailed Terms Text Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-cyan-600 font-extrabold">1.</span> Acceptance of Terms & Scope
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              By hiring or accessing services provided by <strong>Om Construction</strong>, you agree to comply with and be legally bound by these Terms and Conditions. Our services encompass residential construction, commercial building development, architectural blueprints, interior design, structural engineering consulting, and site management.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-cyan-600 font-extrabold">2.</span> Services Provided & Client Responsibilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              Om Construction delivers complete turnkey construction solutions. Clients must provide accurate site ownership documents, boundary clearances, and cooperate during municipality approval processes.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <strong>Site Access & Approvals:</strong> Clients are responsible for granting full site access to our engineers and workers during scheduled hours.
              </li>
              <li>
                <strong>Design Approvals:</strong> Any modifications to approved 2D/3D blueprints or structural drawings must be communicated in writing before construction phases begin.
              </li>
              <li>
                <strong>Payment Schedules:</strong> Payments must strictly follow the milestone agreement (e.g., foundation, slab casting, finishing phases).
              </li>
            </ul>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-cyan-600 font-extrabold">3.</span> Project Estimation, Materials & Variations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
              Estimations and Bill of Quantities (BOQ) are provided based on agreed material grades (e.g., steel, cement, fixtures). Any addition or change in materials during construction will lead to cost and timeline variations.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Om Construction reserves the right to adjust delivery schedules in cases of extreme weather, force majeure, material supply delays, or regulatory holds.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-cyan-600 font-extrabold">4.</span> Intellectual Property & Architectural Designs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All custom architectural drawings, 3D renderings, structural calculations, and design documentation created by Om Construction remain the intellectual property of the firm until final project handover and complete settlement of fees.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-cyan-600 font-extrabold">5.</span> Contract Termination & Liability Limit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Either party may request contract termination in writing if material breach occurs. Om Construction is not liable for structural modifications performed by third-party contractors post-handover without our engineer's written consent.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 6 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-cyan-600 font-extrabold">6.</span> Legal Contact & Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              If you have any questions regarding our legal policies, project contracts, or engineering compliance, please reach out to our legal support team:
            </p>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 text-sm sm:text-base">
                  Om Construction Legal & Project Support
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  numeshpunk4@gmail.com
                </p>
              </div>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=numeshpunk4@gmail.com&su=Legal%20%26%20Terms%20Inquiry%20-%20Om%20Construction"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md hover:opacity-90 shrink-0"
                style={{ backgroundColor: themeColor }}
              >
                <Mail size={16} />
                <span>Contact Support</span>
              </a>
            </div>
          </div>
        </div>
      </main>

   
    </div>
  );
}