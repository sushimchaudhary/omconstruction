"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AIServices } from "@/services/aiServices";

export default function AIComponent() {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const aiCalledRef = useRef(false);

  // AI Insight fetch garne function with Client-side Caching
  const fetchAIInsight = useCallback(async (forceRefresh = false) => {
    // Check session storage cache first if not forced
    if (!forceRefresh) {
      const cachedData = sessionStorage.getItem("ai_sales_insight");
      if (cachedData) {
        setAiInsight(cachedData);
        return;
      }
    }

    try {
      setAiLoading(true);
      const data = await AIServices.getSalesInsights();

      if (data && data.success && data.insights) {
        setAiInsight(data.insights);
        sessionStorage.setItem("ai_sales_insight", data.insights);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error: any) {
      console.error("AI Insight Fetch Error:", error);

      // Default smart fallback response when rate limited or error occurs
      const fallbackInsight =
        "1. **Peak Hour Combos:** Create meal bundles for high-demand lunch/dinner hours to increase ticket value.\n" +
        "2. **Menu Optimization:** Feature high-margin beverage items prominently on the menu page.\n" +
        "3. **Prompts for Fast-Sellers:** Promote daily fast-selling specials during low-volume time slots.";

      setAiInsight(fallbackInsight);
    } finally {
      setAiLoading(false);
    }
  }, []);

  // Initial page load (Strict mode duplicated execution prevention)
  useEffect(() => {
    if (!aiCalledRef.current) {
      aiCalledRef.current = true;
      fetchAIInsight();
    }
  }, [fetchAIInsight]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white rounded-xl shadow-md p-5 border border-indigo-500/20 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-amber-300 border border-indigo-500/30">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                AI Smart Assistant &amp; Sales Insights
              </h3>
              {/* ── COMING SOON TAG ── */}
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-gray-300">
              Automated recommendations based on real-time order history
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchAIInsight(true)}
          disabled={true} // Feature नआउन्जेलका लागि डिसेबल राखिएको छ
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed opacity-60"
        >
          <Sparkles size={12} />
          Re-Analyze
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 text-xs md:text-sm text-gray-200 leading-relaxed">
        {aiLoading ? (
          <div className="flex items-center gap-2 text-indigo-300 py-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Analyzing sales data, top revenue categories &amp; peak hours...
          </div>
        ) : aiInsight ? (
          <div className="whitespace-pre-line text-gray-100">{aiInsight}</div>
        ) : (
          <p className="text-gray-400 italic">
            Click &quot;Re-Analyze&quot; to generate AI suggestions for your restaurant business.
          </p>
        )}
      </div>
    </motion.div>
  );
}