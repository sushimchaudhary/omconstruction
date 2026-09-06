// "use client";

// import React, { useState } from "react";
// import { Mail, Loader2, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";
// import { ThemedInput } from "@/components/ui/ThemedInput";
// import { ThemedButton } from "@/components/ui/themedButton";
// import axiosInstance from "@/lib/config/axios.config";
// import { toast } from "sonner";
// import { useTheme } from "@/lib/context/ThemeContext";
// import Link from "next/link"; // Navigation ko lagi
// import Image from "next/image";

// export default function ForgotPasswordPage() {
//   const { primaryColor } = useTheme();
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [sent, setSent] = useState(false);

//   const hexToRgba = (hex: string, alpha: number) => {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);
//     return `rgba(${r}, ${g}, ${b}, ${alpha})`;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) return toast.error("Please enter your email.");

//     try {
//       setLoading(true);
//       await axiosInstance.post("auth/forgot-password/", { email });
//       setSent(true);
//       toast.success("Reset link sent!");
//     } catch (error: any) {
//       const serverError = error.response?.data;
//       toast.error(serverError?.detail || serverError?.email || "Failed to send reset link.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3">
//       <div className="w-full max-w-md bg-white rounded-md shadow-xl overflow-hidden border border-gray-100">

//         {/* Top Accent Bar */}
//         <div className="border-t-4 border-[#c47c30]"
//         />

//         {/* Card Header */}
//         <div className="px-4 pt-4 pb-4 text-center">
//           <div
//                         className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-2 shadow-sm"
//                         style={{ backgroundColor: `${primaryColor}10` }}
//                       >
//                         <Image src="/logo.png" alt="login icon" width={54} height={54} />

//                       </div>
//           <h1 className="text-xl font-bold text-slate-800">Forgot Password?</h1>
//           <p className="text-[13px] text-slate-500 mt-2">
//             No worries, we'll send you reset instructions.
//           </p>
//         </div>

//         <div className="px-4 pb-10">
//           {!sent ? (
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="space-y-2 ">
//                 <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider ml-1 ">
//                   Email Address
//                 </label>
//                 <ThemedInput
//                   type="email"
//                   placeholder="Enter your registered email"
//                   className="mt-1"
//                   icon={<Mail size={15} />}
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>

//               <button
//                 type="submit"
//   className="w-full mt-4 text-sm font-bold shadow-md bg-[#c47c30] hover:bg-[#a86a28] text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <Loader2 size={15} className="animate-spin" />
//                 ) : (
//                   <>
//                     <span>Send Reset Link</span>
//                     <ArrowRight size={18} />
//                   </>
//                 )}
//               </button>

//               <div className="text-center mt-4">
//                 <Link
//                   href="/login"
//                   className="text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
//                 >
//                   ← Back to Login
//                 </Link>
//               </div>
//             </form>
//           ) : (
//             /* Success State */
//             <div className="text-center py-4 space-y-6">
//               <div
//                 className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
//                 style={{ backgroundColor: "#ecfdf5" }}
//               >
//                 <CheckCircle2 size={32} className="text-emerald-500" />
//               </div>

//               <div className="space-y-2">
//                 <h2 className="text-lg font-bold text-slate-800">Check your email</h2>
//                 <p className="text-[13px] text-slate-500 leading-relaxed">
//                   Instructions have been sent to <br />
//                   <span className="font-bold text-slate-700 italic">{email}</span>
//                 </p>
//               </div>

//               <div className="pt-2">
//                 <p className="text-[12px] text-slate-400">
//                   Didn't receive the email?{" "}
//                   <button
//                     onClick={() => setSent(false)}
//                     className="font-bold underline italic underline-offset-4"
//                     style={{ color: primaryColor }}
//                   >
//                     Click to resend
//                   </button>
//                 </p>
//               </div>

//               <Link href="/login" className="block w-full">
//                 <ThemedButton type="button" className="w-full py-2 rounded font-bold">
//                   Back to Login
//                 </ThemedButton>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

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
              width={400}
              height={200}
              quality={100}
              className="h-30 md:h-32 w-auto object-contain scale-170 md:scale-[2.2] "
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
