// "use client";
// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { X, Building2, User, Mail, Phone, Lock, Save, Loader2, Sparkles, ArrowLeft } from "lucide-react";
// import { ConfigProvider } from "antd";
// import { Form, FormItem, FormMessage } from "@/components/ui/form";
// import { ThemedButton } from "@/components/ui/themedButton";
// import { ThemedInput } from "@/components/ui/ThemedInput";
// import { CancelButton } from "@/components/ui/CancleButton";
// import { useTheme } from "@/lib/context/ThemeContext";
// import { toast } from "sonner";
// import { SubscriptionService } from "@/services/subscriptionService";

// type RegisterTenantValues = {
//   name: string;
//   address: string;
//   mobile_number: string;
//   username: string;
//   email: string;
//   password: string;
//   first_name: string;
//   last_name: string;
// };

// export function RegisterTenantModal({ isOpen, onClose, onSuccess }: any) {
//   const { primaryColor } = useTheme();
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const form = useForm<RegisterTenantValues>({
//     defaultValues: {
//       name: "",
//       address: "",
//       mobile_number: "",
//       username: "",
//       email: "",
//       password: "",
//       first_name: "",
//       last_name: "",
//     },
//   });

//   const handleClose = () => {
//     form.reset();
//     onClose();
//   };

//   const onSubmit = async (values: RegisterTenantValues) => {
//     setLoading(true);
//     try {
//       const res = await SubscriptionService.registerTenant(values);
//       toast.success(res.response || "Restaurant registered with 1-week free trial!");
//       if (res.token) {
//         localStorage.setItem("token", res.token);
//       }
//       onSuccess?.(res);
//       handleClose();
//     } catch (err: any) {
//       toast.error(SubscriptionService.parseError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Dynamic 3D Book Flip Keyframe Styles */}
//       <style jsx global>{`
//         @keyframes pageFlipIn {
//           0% {
//             transform: perspective(1200px) rotateY(-90deg) scale(0.9);
//             opacity: 0;
//             transform-origin: left center;
//           }
//           60% {
//             transform: perspective(1200px) rotateY(10deg) scale(1.02);
//             opacity: 1;
//           }
//           100% {
//             transform: perspective(1200px) rotateY(0deg) scale(1);
//             opacity: 1;
//             transform-origin: left center;
//           }
//         }
//         @keyframes pageFlipOut {
//           0% {
//             transform: perspective(1200px) rotateY(0deg) scale(1);
//             opacity: 1;
//             transform-origin: left center;
//           }
//           100% {
//             transform: perspective(1200px) rotateY(-90deg) scale(0.8);
//             opacity: 0;
//             transform-origin: left center;
//           }
//         }
//         .animate-page-flip-in {
//           animation: pageFlipIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//           backface-visibility: hidden;
//         }
//         .animate-page-flip-out {
//           animation: pageFlipOut 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards;
//           backface-visibility: hidden;
//         }
//       `}</style>

//       {/* Backdrop */}
//       <div
//         onClick={handleClose}
//         className={`fixed inset-0 h-full z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${
//           isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
//         }`}
//       />

//       {/* 3D Flip Modal Wrapper */}
//       <div
//         className={`fixed inset-0 z-[101] flex items-center justify-center p-4 ${
//           isOpen ? "pointer-events-auto" : "pointer-events-none"
//         }`}
//         style={{ perspective: "1500px" }}
//       >
//         <div
//           className={`w-full max-w-lg bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden  flex flex-col max-h-[92vh] ${
//             isOpen ? "animate-page-flip-in" : "animate-page-flip-out"
//           }`}
//           style={{ transformOrigin: "left center" }}
//         >
//           <ConfigProvider theme={{ token: { colorPrimary: primaryColor, borderRadius: 6 } }}>
//             {/* Header with Book Spine Accent */}
//             <div className="bg-slate-900 text-white px-5 py-3.5 border-b border-slate-800 flex justify-between items-center flex-shrink-0 relative">
//               {/* Left Side Decorative Book Spine Line */}
//               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#06B6D4]" />

//               <div className="flex items-center gap-2 pl-1">
//                 <Building2 size={18} className="text-[#06B6D4]" />
//                 <div>
//                   <h2 className="text-sm font-bold text-white leading-tight">
//                     Register New Restaurant
//                   </h2>
//                   <p className="text-[10px] text-slate-400">Step into RestoSync </p>
//                 </div>
//                 <span className="ml-2 text-[10px] font-bold px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30 flex items-center gap-1">
//                   <Sparkles size={10} /> 15 Days Free Trial
//                 </span>
//               </div>

//               <button
//                 onClick={handleClose}
//                 className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
//               >
//                 <ArrowLeft size={16} />
//                 <span className="hidden sm:inline">Back</span>
//               </button>
//             </div>

//             {/* Form Body */}
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="px-6 py-4 space-y-3 overflow-y-auto scrollbar-hide bg-slate-50/50"
//               >
//                 <div className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1">
//                   <Building2 size={12} /> Restaurant Information
//                 </div>

//                 <Controller
//                   control={form.control}
//                   name="name"
//                   rules={{ required: "Restaurant name is required" }}
//                   render={({ field }) => (
//                     <FormItem>
//                       <ThemedInput
//                         label="Restaurant Name *"
//                         icon={<Building2 size={12} />}
//                         placeholder="e.g. Royal Himalayan Cuisine"
//                         {...field}
//                       />
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="grid grid-cols-2 gap-3">
//                   <Controller
//                     control={form.control}
//                     name="mobile_number"
//                     rules={{ required: "Phone number is required" }}
//                     render={({ field }) => (
//                       <FormItem>
//                         <ThemedInput
//                           label="Mobile Number *"
//                           icon={<Phone size={12} />}
//                           placeholder="98XXXXXXXX"
//                           {...field}
//                         />
//                         <FormMessage className="text-[10px]" />
//                       </FormItem>
//                     )}
//                   />
//                   <Controller
//                     control={form.control}
//                     name="address"
//                     render={({ field }) => (
//                       <FormItem>
//                         <ThemedInput
//                           label="Address"
//                           placeholder="Kathmandu, Nepal"
//                           {...field}
//                         />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <div className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider pt-2 border-t border-slate-200 flex items-center gap-1">
//                   <User size={12} /> Owner Admin Account
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <Controller
//                     control={form.control}
//                     name="first_name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <ThemedInput label="First Name" placeholder="John" {...field} />
//                       </FormItem>
//                     )}
//                   />
//                   <Controller
//                     control={form.control}
//                     name="last_name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <ThemedInput label="Last Name" placeholder="Doe" {...field} />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <Controller
//                   control={form.control}
//                   name="username"
//                   rules={{ required: "Username is required" }}
//                   render={({ field }) => (
//                     <FormItem>
//                       <ThemedInput
//                         label="Admin Username *"
//                         icon={<User size={12} />}
//                         placeholder="admin_user"
//                         {...field}
//                       />
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="grid grid-cols-2 gap-3">
//                   <Controller
//                     control={form.control}
//                     name="email"
//                     rules={{ required: "Email is required" }}
//                     render={({ field }) => (
//                       <FormItem>
//                         <ThemedInput
//                           label="Admin Email *"
//                           icon={<Mail size={12} />}
//                           placeholder="admin@example.com"
//                           {...field}
//                         />
//                         <FormMessage className="text-[10px]" />
//                       </FormItem>
//                     )}
//                   />
//                   <Controller
//                     control={form.control}
//                     name="password"
//                     rules={{ required: "Password is required" }}
//                     render={({ field }) => (
//                       <FormItem>
//                         <ThemedInput
//                           label="Password *"
//                           type="password"
//                           icon={<Lock size={12} />}
//                           placeholder="••••••••"
//                           {...field}
//                         />
//                         <FormMessage className="text-[10px]" />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Footer Buttons */}
//                 <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
//                   <CancelButton onClick={handleClose} disabled={loading} />
//                   <ThemedButton type="submit" size="sm" disabled={loading}>
//                     <div className="flex items-center gap-2">
//                       {loading ? (
//                         <Loader2 size={14} className="animate-spin" />
//                       ) : (
//                         <Save size={14} />
//                       )}
//                       <span>Register & Start Trial</span>
//                     </div>
//                   </ThemedButton>
//                 </div>
//               </form>
//             </Form>
//           </ConfigProvider>
//         </div>
//       </div>
//     </>
//   );
// }