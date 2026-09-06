"use client";

import React, { useState } from "react";
import {
  Mail,
  LifeBuoy,
  AlertTriangle,
  Send,
  CheckCircle2,
  ExternalLink,
  Edit3,
  ShieldAlert,
  ArrowRight,
  MessageSquare,
  ArrowLeft,
  Scale,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import Link from "next/link";

export default function SupportTeamPage() {
  const { primaryColor } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const supportEmail = "sushimchaudhary.developer1@gmail.com";

  // Formats email body with structured sections for Gmail
  const getGmailUrl = () => {
    const formattedBody = `--- SYSTEM PROBLEM REPORT ---
Title: ${formData.subject}
Date: ${new Date().toLocaleString()}

--- DESCRIPTION ---
${formData.message}

---------------------------------
Sent via Support Center Portal`;

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      supportEmail,
    )}&su=${encodeURIComponent(`[System Issue] ${formData.subject}`)}&body=${encodeURIComponent(
      formattedBody,
    )}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleDirectGmailClick = () => {
    const directUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      supportEmail,
    )}`;
    window.open(directUrl, "_blank");
  };
  const themeColor = primaryColor || "#06B6D4";

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
            <HelpCircle size={20} style={{ color: themeColor }} />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              RMS Support Teams
            </span>
          </div>
        </div>
      </header>

       <main className="max-w-6xl mx-auto py-8 px-6 space-y-8">
              <div
        className="relative overflow-hidden rounded-lg  text-white p-8 shadow-xl border border-slate-700/50"
        style={{ backgroundColor: `${primaryColor}` }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10"
              style={{ backgroundColor: `${primaryColor}30`, color: "#fff" }}
            >
              <LifeBuoy size={14} className="animate-spin-slow" />
              <span>Support & Technical Center</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Need Help with the System?
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Encountered a bug or system failure? Submit a ticket below to
              generate a pre-formatted Gmail issue report or connect directly
              with technical support.
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 shadow-inner">
            <AlertTriangle size={40} className="text-amber-400" />
          </div>
        </div>
        {/* Decorative background glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Direct Email Card */}
        <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow duration-300 lg:col-span-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                <Mail size={24} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Direct Contact
              </span>
            </div>

            <div>
              <h2 className="font-bold text-slate-800 text-lg">
                Lead Developer
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Reach out directly for urgent database errors, server downtime,
                or critical access issues.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldAlert size={14} className="text-amber-500" />
                <span>Priority Assistance</span>
              </div>
              <p className="text-xs text-slate-600 font-mono break-all font-semibold">
                {supportEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleDirectGmailClick}
            className="w-full text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <span>Open Direct Email</span>
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Problem Reporting Form */}
        <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-bold text-slate-800 text-xl flex items-center gap-2.5">
              <MessageSquare size={22} style={{ color: primaryColor }} />
              <span>Submit Issue Details</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Step {submitted ? "2" : "1"} of 2
            </span>
          </div>

          {submitted ? (
            <div className="bg-gradient-to-b from-emerald-50/80 to-white border border-emerald-200/80 rounded-lg p-8 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-lg">
                  Report Generated Successfully!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the button below to launch Gmail with your issue
                  pre-filled and structured for the tech team.
                </p>
              </div>

              {/* Email Content Preview */}
              <div className="text-left bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono space-y-2 border border-slate-800 max-h-40 overflow-y-auto shadow-inner">
                <div className="text-slate-400 border-b border-slate-800 pb-1 font-semibold">
                  Subject: [System Issue] {formData.subject}
                </div>
                <div className="whitespace-pre-wrap text-slate-300 pt-1">
                  {formData.message}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getGmailUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send size={15} />
                  <span>Open Gmail & Send</span>
                  <ArrowRight size={14} />
                </a>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Edit3 size={14} />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Issue Title / Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Order status not updating in Branch dashboard"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2"
                  style={{
                    // Dynamic accent ring color
                    boxShadow: "none",
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Description of Problem
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe what went wrong, steps to reproduce, or relevant error details..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white py-3.5 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <Send size={15} />
                <span>Prepare Gmail Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
