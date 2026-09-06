"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Building2, Gift, Tag, TrendingDown } from "lucide-react";
import { fadeUp, staggerContainer } from "@/types/motionvariants";
import RevealHeading from "./Revealheading";
import { PublicPlan } from "@/types/authType";

export default function PricingSection({
  plans,
  loading,
  
}: {
  plans: PublicPlan[];
  loading: boolean;
  onOpenDemo: () => void;
}) {
  // Discount calculation को लागि Monthly Price पत्ता लगाउने logic
  const monthlyPlan = plans.find((p) => p.type === "monthly" || p.duration_days === 30);
  const monthlyPrice = monthlyPlan ? monthlyPlan.price : 10000;

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 md:py-18 py-5 md:px-8 bg-slate-50">
      <RevealHeading
        eyebrow="Pricing"
        title="Simple pricing, per branch"
        description="Pick a plan that matches how many branches you run."
      />

      {loading ? (
        <div className="mt-12 flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#127986]" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch lg:items-stretch"
        >
          {plans.map((plan) => {
            const isFeatured = plan.type === "yearly" || plan.duration_days >= 360;
            const isFree = plan.price === 0 || plan.type === "free_trial";

            // Discount & Savings Calculation Logic
            let originalYearlyPrice = 0;
            let discountPercent = 0;
            let savingsAmount = 0;

            if (isFeatured) {
              originalYearlyPrice = monthlyPrice > 0 ? monthlyPrice * 12 : 120000;
              if (originalYearlyPrice > plan.price) {
                savingsAmount = originalYearlyPrice - plan.price;
                discountPercent = Math.round((savingsAmount / originalYearlyPrice) * 100);
              }
            }

            return (
              <motion.div
                key={plan.id}
                layout
                variants={fadeUp}
                transition={{ type: "spring", stiffness: 160, damping: 7, mass: 1.7 }}
                whileHover={{
                  y: -10,
                  scale: isFeatured ? 1.06 : 1.02,
                  boxShadow: isFeatured
                    ? "0 30px 60px -20px rgba(16,185,129,0.35)"
                    : "0 25px 50px -20px rgba(15,23,42,0.18)",
                }}
                whileTap={{ scale: 0.98 }}
                className={`group relative flex flex-col justify-between rounded-lg p-8 will-change-transform ${
                  isFeatured
                    ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/30 to-white lg:scale-105"
                    : "border border-slate-200 bg-white shadow-sm"
                }`}
              >
                {/* Featured / Best Value Badge with Discount % — gentle breathing pulse */}
                {isFeatured && (
                  <motion.span
                    initial={{ opacity: 0, y: -8, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white shadow-md whitespace-nowrap"
                  >
                    <motion.span
                      animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className="flex"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </motion.span>
                    Best Value • Save {discountPercent > 0 ? `${discountPercent}%` : "15%"}
                  </motion.span>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                    <div>
                      <h3 className="font-[var(--font-fraunces)] text-lg sm:text-xl font-bold text-slate-900 capitalize flex items-center gap-1.5">
                        {isFree && <Gift className="w-4 h-4 text-emerald-500" />}
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {isFree
                          ? "Initial access for new branch"
                          : `Complete operational suite for ${plan.duration_days} days`}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className={`p-2.5 rounded-xl ${
                        isFeatured
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </motion.div>
                  </div>

                  {/* Price Box with Strike-through & Discount Tag */}
                  <div
                    className={`rounded-xl p-4 border ${
                      isFeatured
                        ? "bg-emerald-50/60 border-emerald-200/80"
                        : "bg-slate-50/80 border-slate-100"
                    }`}
                  >
                    {isFeatured && (
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400 font-semibold line-through">
                          NPR {originalYearlyPrice.toLocaleString()}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          Save NPR {savingsAmount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="flex items-baseline gap-1.5 text-slate-900"
                    >
                      <span
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
                          isFeatured ? "text-emerald-950" : ""
                        }`}
                      >
                        {isFree ? "Free" : `NPR ${plan.price.toLocaleString()}`}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        / {plan.duration_days} Days
                      </span>
                    </motion.div>

                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium flex items-center justify-between">
                      <span className="truncate">Per branch, per cycle</span>
                      {isFeatured && (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0 ml-1">
                          <Tag className="w-3 h-3" /> Discounted
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Features List — each item settles in on its own beat */}
                  <motion.ul
                    variants={staggerContainer(0.06, 0.15)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mt-6 space-y-2.5 text-xs text-slate-700 font-medium"
                  >
                    {[
                      "Unlimited Digital Menu & Table Orders",
                      "Dynamic Multi-Table QR Code Generator",
                      "Real-time Kitchen Display & Waiter POS",
                      "Sales Analytics & Financial Reporting",
                    ].map((feature) => (
                      <motion.li
                        key={feature}
                        variants={fadeUp}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* Action Button — animated arrow nudges forward on hover */}
                {/* <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenDemo}
                  className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-lg py-3.5 text-xs font-bold transition-colors cursor-pointer ${
                    isFeatured
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg"
                      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Choose this plan
                  <motion.span
                    className="flex"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.span>
                </motion.button> */}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}