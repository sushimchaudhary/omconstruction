
"use client";

import React, { useState } from "react";
import {
  Mail,
  Loader2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedButton } from "@/components/ui/themedButton";
import axiosInstance from "@/lib/config/axios.config";
import { toast } from "sonner";
import { useTheme } from "@/lib/context/ThemeContext";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#06B6D4";

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");

    try {
      setLoading(true);
      await axiosInstance.post("auth/forgot-password/", { email });
      setSent(true);
      toast.success("Reset link sent!");
    } catch (error: any) {
      const serverError = error.response?.data;
      toast.error(
        serverError?.detail ||
          serverError?.email ||
          "Failed to send reset link.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#06B6D4] selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-200/80 relative z-10 transition-all">
        {/* Top Gradient Accent Line */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${themeColor} 0%, #0891B2 100%)`,
          }}
        />

        {/* Card Header */}
        <div className="px-8 pt-1 text-center">
          {/* Logo Container */}
          <div className="inline-flex items-center justify-center ">
            <Image
              src="/logo.png"
              alt="RestoSync Logo"
              width={100}
              height={100}
              quality={100}
              className="h-20 md:h-22 w-auto object-contain scale-170 md:scale-[2.2] "
              priority
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1.5">
            No worries, enter your email and we’ll send you reset instructions.
          </p>
        </div>

        {/* Card Body */}
        <div className="px-8 pb-4 pt-2">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-600 tracking-wider block">
                  Email Address <span className="text-cyan-500">*</span>
                </label>
                <ThemedInput
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full"
                  icon={<Mail size={16} className="text-slate-400" />}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-2 px-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-[#06B6D4]/20 cursor-pointer mt-2"
                style={{ backgroundColor: themeColor }}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#06B6D4] transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 mx-auto flex items-center justify-center text-emerald-500 shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Check Your Email
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Instructions have been sent to: <br />
                  <span className="font-bold text-slate-800 break-all">
                    {email}
                  </span>
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-400">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="font-bold text-[#06B6D4] hover:underline cursor-pointer"
                  >
                    Click to resend
                  </button>
                </p>
              </div>

              <Link href="/login" className="block w-full pt-2">
                <button
                  type="button"
                  className="w-full text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer"
                  style={{ backgroundColor: themeColor }}
                >
                  Return to Login
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="bg-slate-50 border-t border-slate-100 py-3.5 px-8 text-center flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <ShieldCheck size={14} className="text-[#06B6D4]" />
          <span>Secured RestoSync Authentication Service</span>
        </div>
      </div>
    </div>
  );
}
