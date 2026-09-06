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
  HardHat,
  Download,
  Smartphone,
  ArrowLeft,
  Hammer,
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

    if (token) {
      router.replace("/cms");
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

      // Type error नआउने गरी safely check गरिएको logic:
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

      if (isSuperUser) {
        router.push("/cms/admin-dashboard");
      } else {
        router.push("/cms");
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
    <div className="min-h-screen w-full flex bg-slate-50 selection:bg-[#06B6D4] selection:text-white items-stretch relative">
      {/* ── LEFT DECORATIVE SECTION WITH CONSTRUCTION BACKGROUND IMAGE ── */}
      <div
        className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        {/* Soft Dark Overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/40 to-slate-900/40 backdrop-blur-[1px] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 px-5">
            <Image
              src="/logo.png"
              alt="Construction Portal Logo"
              width={400}
              height={200}
              quality={100}
              className="h-30 md:h-34 w-auto object-contain scale-170 md:scale-[2.8]"
              priority
            />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-md hover:shadow-cyan-500/10 shrink-0"
          >
            <ArrowLeft size={16} className="text-[#06B6D4]" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md mb-6 shadow-lg">
            <HardHat size={16} className="text-[#06B6D4]" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
              Construction Portal
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-[1.15] tracking-tight mb-4 drop-shadow-lg">
            Build with confidence. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#06B6D4] via-cyan-300 to-white">
              Manage Site Operations.
            </span>
          </h1>

          <p className="text-slate-200 text-base max-w-md leading-relaxed drop-shadow-sm font-normal">
            Take complete control of site operations, project tasks, team progress, and material attendance in one central hub.
          </p>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 flex items-center justify-between text-xs font-medium text-slate-300 border-t border-white/10 pt-6">
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-conditions"
              className="hover:text-cyan-400 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
          <span className="text-slate-400">
            © {new Date().getFullYear()}{" "}
            <Link
              href="https://sushimchaudhary.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-cyan-400 transition-colors"
            >
              sushim dev
            </Link>
          </span>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 bg-slate-50 min-h-screen relative">
        {/* Back to Home Button for Mobile Screens */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-700 text-xs font-bold"
          >
            <ArrowLeft size={14} className="text-[#06B6D4]" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="w-full max-w-105 my-auto">
          <div className="lg:hidden flex justify-center mb-2">
            <div className="flex items-center px-5">
              <Image
                src="/logo.png"
                alt="Construction Portal Logo"
                width={400}
                height={200}
                quality={100}
                className="h-30 md:h-32 w-auto object-contain scale-[2.4]"
                priority
              />
            </div>
          </div>

          <div className="mb-4 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Sign In
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Enter your credentials to access the Construction Management panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex items-center gap-2 mb-2 py-1.5 px-3 rounded-lg bg-cyan-50 border border-cyan-100 w-fit">
              <ShieldCheck size={18} className="text-[#06B6D4]" />
              <span className="text-xs font-bold text-cyan-900 tracking-wider uppercase">
                Admin & Site Control Access
              </span>
            </div>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider block">
                Username <span className="text-cyan-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#06B6D4] transition-colors pointer-events-none">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded focus:border-[#06B6D4] focus:ring-4 focus:ring-[#06B6D4]/15 outline-none transition-all placeholder:text-slate-300 text-slate-800 text-sm font-medium shadow-sm"
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
                  <span className="text-xs text-[#06B6D4] font-bold hover:underline transition-all">
                    Forgot password?
                  </span>
                </Link>
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#06B6D4] transition-colors pointer-events-none">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-2 bg-white border border-slate-200 rounded focus:border-[#06B6D4] focus:ring-4 focus:ring-[#06B6D4]/15 outline-none transition-all placeholder:text-slate-300 text-slate-800 text-sm font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#06B6D4] hover:bg-cyan-600 text-white py-2.5 rounded font-bold text-sm tracking-wide transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-[#06B6D4]/25 mt-5 cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* ── DOWNLOAD OUR APP SECTION ── */}
          {isInstallable && (
            <div className="mt-4 p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-50 text-[#06B6D4]">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Download Site App
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Install application on your device for quick access
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06B6D4] hover:bg-cyan-600 text-white font-bold text-xs rounded transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
              >
                <Download size={14} />
                <span>Install</span>
              </button>
            </div>
          )}

          {/* Help Footer */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-center gap-2 text-xs text-slate-500">
            <HelpCircle size={14} className="text-slate-400" />
            <span>Having trouble logging in?</span>
            <Link
              href="/support-teams"
              className="text-[#06B6D4] font-bold hover:underline cursor-pointer"
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