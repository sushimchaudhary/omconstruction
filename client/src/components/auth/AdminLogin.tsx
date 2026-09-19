"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  HelpCircle,
  Download,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { AuthServices } from "@/services/authServices";
import Link from "next/link";
import Cookies from "js-cookie";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const AdminLoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── PWA INSTALL LOGIC ──
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(true);

  useEffect(() => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
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
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
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
    } else {
      toast.info("To install app, tap 'Add to Home Screen' in browser menu.");
    }
  };

  useEffect(() => {
    const token = getCookie("adminToken");
    const role = getCookie("role");

    if (token) {
      if (role === "super_admin") {
        router.replace("/cms");
      } else {
        router.replace("/cms/profile");
      }
      return;
    }

    localStorage.clear();
    sessionStorage.clear();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await AuthServices.adminLogin(username, password);

      if (!data?.user) {
        toast.error("Backend did not return user object");
        return;
      }

      const user = data.user;
      const userDisplayName = user.username || username;

      const rawRole = String(user.role || "").trim().toLowerCase();
      const isSuperUser =
        Boolean((user as any).super_user) ||
        Boolean((user as any).is_superuser) ||
        rawRole === "super_admin";

      const userRole = isSuperUser ? "super_admin" : (rawRole || "worker");

      // Set Cookies
      Cookies.set("adminToken", data.token, { expires: 7, path: "/" });
      Cookies.set("role", userRole, { expires: 7, path: "/" });
      Cookies.set("is_superuser", isSuperUser ? "true" : "false", {
        expires: 7,
        path: "/",
      });
      Cookies.set("username", userDisplayName, { expires: 7, path: "/" });

      // Save LocalStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role: userRole,
          super_user: isSuperUser,
          is_superuser: isSuperUser,
        }),
      );

      toast.success(`Welcome back, ${userDisplayName}!`);

      if (userRole === "super_admin") {
        router.push("/cms");
      } else {
        router.push("/cms/profile");
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.response ||
        err?.response?.data?.message ||
        err?.message ||
        "Invalid credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#153052] selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-15 pointer-events-none bg-[#153052]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-200/80 relative z-10 transition-all">
        {/* Top Gradient Accent Line */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#153052] to-[#FD6102]" />

        {/* Card Header */}
        <div className="px-8 pt-4 pb-2 text-center relative">
          <div className="absolute top-4 left-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#153052] text-xs font-bold transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Home</span>
            </Link>
          </div>

          <div className="inline-flex items-center justify-center pt-2">
            <Image
              src="/logo.png"
              alt="Construction Portal Logo"
              width={200}
              height={100}
              quality={100}
              className="h-14 md:h-18 w-auto object-contain scale-150"
              priority
            />
          </div>

          
          <p className="text-xs font-medium text-slate-500 mt-5">
            Enter your credentials to access the Construction Management panel
          </p>
        </div>

        {/* Card Body */}
        <div className="px-8 pb-5 pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider block">
                Username <span className="text-cyan-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#153052] transition-colors pointer-events-none">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-[#153052] focus:ring-4 focus:ring-[#153052]/15 outline-none transition-all placeholder:text-slate-300 text-slate-800 text-xs font-medium shadow-xs"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-600 tracking-wider block">
                  Password <span className="text-cyan-500">*</span>
                </label>
                <Link href="/forgot-password">
                  <span className="text-xs text-[#153052] font-bold hover:underline transition-all">
                    Forgot password?
                  </span>
                </Link>
              </div>

              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#153052] transition-colors pointer-events-none">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-[#153052] focus:ring-4 focus:ring-[#153052]/15 outline-none transition-all placeholder:text-slate-300 text-slate-800 text-xs font-medium shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#153052] text-white py-2.5 px-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-[#153052]/20 cursor-pointer mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Download App Section */}
          {isInstallable && (
            <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-50 text-[#153052]">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Download Site App
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Install application on your device
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#153052] hover:bg-cyan-600 text-white font-bold text-xs rounded-lg transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
              >
                <Download size={14} />
                <span>Install</span>
              </button>
            </div>
          )}

          {/* Help Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <HelpCircle size={14} className="text-slate-400" />
            <span>Having trouble logging in?</span>
            <Link
              href="/support-teams"
              className="text-[#153052] font-bold hover:underline cursor-pointer"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;