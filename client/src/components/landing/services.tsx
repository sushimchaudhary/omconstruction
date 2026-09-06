"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ServiceService, type ServiceItem } from "@/services/servicesServices";

// Helper function to generate URL slug from title
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.25 },
  },
};

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [showAll, setShowAll] = useState(false);

  const loadServices = async () => {
    setStatus("loading");
    try {
      const res = await ServiceService.getDetails();
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setServices(list);
      setStatus("ready");
    } catch (err: any) {
      setErrorMsg(
        typeof ServiceService.parseError === "function"
          ? ServiceService.parseError(err)
          : err?.message || "Failed to load services"
      );
      setStatus("error");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Compute displayed services dynamically based on state
  const INITIAL_COUNT = 4;
  const visibleServices = showAll ? services : services.slice(0, INITIAL_COUNT);

  return (
    <section id="services" className="services-root w-full bg-slate-50/50 py-16 md:py-24 px-4 sm:px-6 lg:px-12">
      <style>{`
        .services-root {
          --navy: #173457;
          --orange: #fd6102;
          --ink: #334155;
          --font-display: "Fraunces", Georgia, serif;
          --font-body: "Inter", system-ui, sans-serif;
          font-family: var(--font-body);
        }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@400;500;600;700&display=swap');

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
            What We Offer
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
          >
            Our Featured Services
          </h2>
          <div className="w-12 h-1 bg-[var(--orange)] rounded-full mx-auto" />
        </motion.div>

        {status === "loading" && <ServicesSkeleton />}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-red-200 rounded-lg max-w-md mx-auto text-center shadow-sm">
            <p className="text-slate-700 font-medium mb-4">{errorMsg}</p>
            <button
              type="button"
              className="px-5 py-2.5 bg-[var(--navy)] text-white font-semibold rounded hover:bg-slate-800 transition"
              onClick={loadServices}
            >
              Retry
            </button>
          </div>
        )}

        {status === "ready" && (
          <>
            <motion.div
              layout
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch max-w-7xl mx-auto"
            >
              <AnimatePresence>
                {visibleServices.map((item) => (
                  <ServiceCard key={item.id || item._id} item={item} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Toggle View More / View Less Slide Button */}
            {services.length > INITIAL_COUNT && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-4"
              >
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[var(--navy)] text-white font-semibold text-sm shadow-md hover:bg-[var(--orange)] transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  <span>{showAll ? "Show Less" : "View More Services"}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showAll ? "rotate-180" : "group-hover:translate-y-0.5"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ item }: { item: ServiceItem }) {
  const plainTextDescription = item.description
    ? item.description.replace(/<[^>]+>/g, "")
    : "";

  const slug = slugify(item.title);

  return (
    <motion.div
      layout
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{
        y: -8,
        scale: 1.01,
        boxShadow: "0 20px 40px -15px rgba(15,23,42,0.15)",
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col justify-between rounded-lg border border-slate-200/80 bg-white p-2 shadow-sm transition-colors duration-300 hover:border-[var(--orange)] will-change-transform overflow-hidden"
    >
      <Link href={`/services/${slug}`} className="flex flex-col h-full justify-between w-full">
        <div>
          <div className="relative h-48 w-full overflow-hidden rounded-md bg-slate-100">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-80" />

            {item.icon && (
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-md border border-slate-100 shadow-md">
                <img src={item.icon} alt="" className="w-4 h-4 object-contain" />
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 space-y-2 px-2 pb-2"
          >
            <h3
              className="text-lg font-bold transition-colors group-hover:text-[var(--orange)]"
              style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
            >
              {item.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
              {plainTextDescription}
            </p>
          </motion.div>
        </div>

        <div className="mt-4 px-2 pb-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--navy)] group-hover:text-[var(--orange)] transition-colors">
          <span>Read More</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto animate-pulse">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="bg-white rounded-lg border border-slate-200 h-96 flex flex-col p-2">
          <div className="h-48 bg-slate-200 rounded-md w-full" />
          <div className="p-2 space-y-3 mt-4 flex-1">
            <div className="h-5 bg-slate-200 rounded w-3/4" />
            <div className="space-y-2 pt-1">
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}