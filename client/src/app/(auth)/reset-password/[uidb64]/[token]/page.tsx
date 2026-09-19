"use client";

import { useState, use } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { ThemedInput } from "@/components/ui/ThemedInput";
import { useTheme } from "@/lib/context/ThemeContext";
import { AuthServices } from "@/services/authServices"; // Ensure AuthServices path matches your app

interface PageProps {
  params: Promise<{ userId: string; token: string }>;
}

export default function ResetPassword({ params }: PageProps) {
  // Unwrap promise params correctly
  const resolvedParams = use(params);
  const userId = resolvedParams?.userId;
  const token = resolvedParams?.token;

  const router = useRouter();
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#06B6D4";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password strength calculation
  const getStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#10b981"][
    strength
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !token) {
      const errorMsg = "Invalid or missing reset token parameters.";
      setStatus({ type: "error", text: errorMsg });
      toast.error(errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match!";
      setStatus({ type: "error", text: errorMsg });
      toast.error(errorMsg);
      return;
    }

    if (password.length < 8) {
      const errorMsg = "Password must be at least 8 characters.";
      setStatus({ type: "error", text: errorMsg });
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await AuthServices.resetPassword(userId, token, password);

      const successMsg = "Password updated successfully! Redirecting to login...";
      setStatus({ type: "success", text: successMsg });
      toast.success(successMsg);

      setTimeout(() => router.push("/login"), 1800);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || "Invalid token or expired link.";
      setStatus({ type: "error", text: errorMsg });
      toast.error(errorMsg);
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
        <div className="px-8 pt-4 text-center">
          <div className="inline-flex items-center justify-center py-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={220}
              height={80}
              quality={100}
              className="h-16 w-auto object-contain"
              priority
            />
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase mt-1">
            Create New Password
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Your new password must be different from previous passwords.
          </p>
        </div>

        {/* Card Body */}
        <div className="px-8 pb-8 pt-2">
          <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 mb-5 bg-cyan-50/70 border border-cyan-100/80 text-cyan-900">
            <ShieldCheck size={18} className="text-[#06B6D4] shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed text-slate-600">
              Choose a strong password (8+ characters) with uppercase letters,
              numbers, and symbols to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider block">
                New Password <span className="text-cyan-500">*</span>
              </label>
              <div className="relative">
                <ThemedInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  icon={<Lock size={16} className="text-slate-400" />}
                  className="w-full pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= strength ? strengthColor : "#e2e8f0",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-medium">
                      Strength:
                    </span>
                    <span
                      className="font-bold tracking-wide"
                      style={{ color: strengthColor }}
                    >
                      {strengthLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider block">
                Confirm Password <span className="text-cyan-500">*</span>
              </label>
              <div className="relative">
                <ThemedInput
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-type new password"
                  icon={<Lock size={16} className="text-slate-400" />}
                  className="w-full pr-10"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                {confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <CheckCircle2
                      size={16}
                      className={
                        password === confirmPassword
                          ? "text-emerald-500"
                          : "text-red-500"
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {status?.type === "error" && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold animate-in fade-in duration-200">
                <AlertCircle size={16} className="shrink-0" />
                <span>{status.text}</span>
              </div>
            )}

            {/* Success Message */}
            {status?.type === "success" && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold animate-in fade-in duration-200">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{status.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || status?.type === "success"}
              className="w-full text-white py-2.5 px-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-4"
              style={{ backgroundColor: themeColor }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Login Footer */}
          <div className="pt-4 text-center border-t border-slate-100 mt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#06B6D4] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Cancel & Return to Login</span>
            </Link>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="bg-slate-50 border-t border-slate-100 py-3.5 px-8 text-center flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <ShieldCheck size={14} className="text-[#06B6D4]" />
          <span>Secured Authentication Service</span>
        </div>
      </div>
    </div>
  );
}