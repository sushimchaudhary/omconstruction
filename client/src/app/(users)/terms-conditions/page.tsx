"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Mail,
  Scale,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

export default function TermsAndConditionsPage() {
  const { primaryColor } = useTheme();
  // Fallback to #06B6D4 if theme context is loading or unset
  const themeColor = primaryColor || "#06B6D4";
  const lastUpdated = "July 2026";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700 selection:bg-[#06B6D4] selection:text-white">
      {/* Top Header Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>

          <div className="flex items-center gap-2">
            <Scale size={20} style={{ color: themeColor }} />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              RMS Legal Center
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto py-8 px-6 space-y-8">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-xl text-white p-8 sm:p-10 shadow-xl border border-slate-700/50"
          style={{ backgroundColor: themeColor }}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10"
                style={{ backgroundColor: `${themeColor}30`, color: "#fff" }}
              >
                <FileText size={14} />
                <span>User Agreement & Rules</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Terms and Conditions
              </h1>
              <p className="text-slate-100/90 text-sm leading-relaxed">
                Please read these terms and conditions carefully before using the Restaurant Management System (RMS) provided by Sushim dev.
              </p>
              <p className="text-xs text-white/70 pt-1">
                Last Updated: {lastUpdated}
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner">
              <Scale size={40} className="text-white" />
            </div>
          </div>

          {/* Background Decorative Glow */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: themeColor }}
          />
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner mb-4"
              style={{
                backgroundColor: `${themeColor}15`,
                color: themeColor,
              }}
            >
              <CheckCircle2 size={22} />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Account Usage
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Users are responsible for maintaining the security of their credentials and administrative access.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner mb-4"
              style={{
                backgroundColor: `${themeColor}15`,
                color: themeColor,
              }}
            >
              <AlertCircle size={22} />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              System Guidelines
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unauthorised access, data scraping, or disruption of RMS operations is strictly prohibited.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner mb-4"
              style={{
                backgroundColor: `${themeColor}15`,
                color: themeColor,
              }}
            >
              <HelpCircle size={22} />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Service Updates
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We continuously improve features and may update terms periodically to match software upgrades.
            </p>
          </div>
        </div>

        {/* Detailed Terms Text Container */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              
              1. Acceptance of Terms
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              By accessing or using the Restaurant Management System (RMS), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access or use the system dashboard.
            </p>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              
              2. User Accounts and Security
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs text-slate-600">
              <li>You are responsible for safeguarding your password and access tokens.</li>
              <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
            </ul>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              
              3. Intellectual Property
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The RMS software, including its original code, user interface designs, logos, databases, and structural layout, are the exclusive property of Sushim dev and are protected by applicable intellectual property laws.
            </p>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              
              4. Termination
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms and Conditions.
            </p>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              
              5. Contact Information
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              If you have any questions about these Terms, please reach out to our team:
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  Sushim dev Support Team
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  sushimchaudhary.developer1@gmail.com
                </p>
              </div>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=sushimchaudhary.developer1@gmail.com&su=Terms%20Inquiry%20-%20RMS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-bold transition-all shadow-sm hover:opacity-90"
                style={{ backgroundColor: themeColor }}
              >
                <Mail size={14} />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()}{" "}
        <Link 
          href="https://sushimchaudhay.com.np" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline hover:text-slate-700 transition-colors"
        >
          Sushim dev
        </Link>
        . All rights reserved.
      </footer>
    </div>
  );
}