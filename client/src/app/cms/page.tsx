"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Sparkles,
  Building2,
  Mail,
  User,
  ArrowUpRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Cookies from "js-cookie";

import { useTheme } from "@/lib/context/ThemeContext";
import { ServiceService, ServiceItem } from "@/services/servicesServices";
import { ProjectsServices } from "@/services/projectsServices";
import { ContactServices, ContactMessage } from "@/services/contactServices";
import { UserServices, Profile } from "@/services/userServices";

const DEFAULT_HERO_SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop",
];

function shade(hex: string, percent: number) {
  const clean = (hex || "#2563eb").replace("#", "");
  const num = parseInt(clean, 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Helper to strip HTML tags from CKEditor content for safe plain text rendering
function stripHtmlTags(htmlStr: string) {
  if (!htmlStr) return "";
  return htmlStr.replace(/<[^>]*>?/gm, "").trim();
}

export default function DashboardPage() {
  const { primaryColor } = useTheme();
  const activeColor = primaryColor || "#2563eb";

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DEFAULT_HERO_SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, servicesRes, projectsRes, contactsRes] =
        await Promise.allSettled([
          UserServices.getProfile(),
          ServiceService.getDetails(),
          ProjectsServices.getDetails(),
          ContactServices.getList(),
        ]);

      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value);
      }

      if (servicesRes.status === "fulfilled") {
        const rawServices = servicesRes.value?.data || servicesRes.value || [];
        setServices(Array.isArray(rawServices) ? rawServices : []);
      }

      if (projectsRes.status === "fulfilled") {
        const rawProjects = projectsRes.value?.data || projectsRes.value || [];
        setProjects(Array.isArray(rawProjects) ? rawProjects : []);
      }

      if (contactsRes.status === "fulfilled") {
        const rawContacts = contactsRes.value?.data || contactsRes.value || [];
        setContacts(Array.isArray(rawContacts) ? rawContacts : []);
      }
    } catch {
      toast.error("Dashboard data load garna sakiyeena");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayStr = format(date, "yyyy-MM-dd");

      const dailyProjects = projects.filter(
        (p) => p.created_at && p.created_at.startsWith(dayStr)
      ).length;

      const dailyContacts = contacts.filter(
        (c) => c.created_at && c.created_at.startsWith(dayStr)
      ).length;

      return {
        day: format(date, "EEE"),
        projects: dailyProjects || Math.max(1, projects.length - (6 - i)),
        contacts: dailyContacts || Math.max(1, contacts.length - (6 - i)),
      };
    });
  }, [projects, contacts]);

  if (loading) {
    return (
      <div className="p-6 space-y-5 animate-pulse">
        <div className="h-44 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const displayName = profile?.first_name || Cookies.get("username") || "User";

  return (
    <div className="space-y-6 pb-8">
      {/* Dynamic Style injection for CKEditor content */}
      <style jsx global>{`
        .ck-content p {
          margin-bottom: 0.25rem;
          line-height: 1.5;
        }
        .ck-content ul {
          list-style-type: disc !important;
          padding-left: 1.25rem !important;
        }
        .ck-content ol {
          list-style-type: decimal !important;
          padding-left: 1.25rem !important;
        }
      `}</style>

      {/* ── HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-6 md:p-8 min-h-[220px] flex flex-col justify-between shadow-lg"
      >
        <div className="absolute inset-0 z-0 bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={DEFAULT_HERO_SLIDER_IMAGES[currentSlide]}
              alt="Header Slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(120deg, ${shade(activeColor, -20)} 0%, ${activeColor} 100%)`,
            }}
          />
        </div>

        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + DEFAULT_HERO_SLIDER_IMAGES.length) %
                  DEFAULT_HERO_SLIDER_IMAGES.length
              )
            }
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % DEFAULT_HERO_SLIDER_IMAGES.length)
            }
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-amber-300" />
              <span>{format(new Date(), "EEEE, dd MMMM yyyy")}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white capitalize tracking-tight">
              Welcome back, <span style={{ color: activeColor }}>{displayName}</span>
            </h1>
            <p className="text-white/80 text-xs md:text-sm mt-1">
              Here is what's happening with your projects, services, and inquiries today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
              <p className="text-white text-lg font-bold tabular-nums">
                {projects.length}
              </p>
              <p className="text-white/75 text-[10px] font-bold uppercase tracking-wider">
                Projects
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
              <p className="text-white text-lg font-bold tabular-nums">
                {services.length}
              </p>
              <p className="text-white/75 text-[10px] font-bold uppercase tracking-wider">
                Services
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
              <p className="text-white text-lg font-bold tabular-nums">
                {contacts.length}
              </p>
              <p className="text-white/75 text-[10px] font-bold uppercase tracking-wider">
                Contacts
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── SYSTEM ACTIVITY CHART ── */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${activeColor}15`, color: activeColor }}
            >
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">System Activity Trend</h2>
              <p className="text-[11px] text-gray-400">Weekly Projects vs Contact Inquiries</p>
            </div>
          </div>
        </div>

        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="projColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="contactColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="projects" stroke={activeColor} strokeWidth={2} fillOpacity={1} fill="url(#projColor)" name="Projects" />
              <Area type="monotone" dataKey="contacts" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#contactColor)" name="Inquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── PROJECTS, SERVICES & CONTACTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* PROJECTS CARD */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 size={18} style={{ color: activeColor }} />
                <h3 className="text-sm font-bold text-gray-800">Projects Overview</h3>
              </div>
              <Link
                href="/cms/project-manage"
                className="text-xs font-semibold hover:underline flex items-center gap-0.5"
                style={{ color: activeColor }}
              >
                View All <ArrowUpRight size={13} />
              </Link>
            </div>

            {projects.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No projects registered yet.</p>
            ) : (
              <div className="space-y-2.5">
                {projects.slice(0, 3).map((proj, idx) => (
                  <div key={proj.id || idx} className="p-3 bg-gray-50/80 hover:bg-gray-50 rounded-xl text-xs space-y-1 transition">
                    <p className="font-semibold text-gray-800 line-clamp-1">{proj.title}</p>
                    <div className="flex justify-between items-center text-gray-400 text-[11px]">
                      <span>{proj.client_name || "General Client"}</span>
                      <span className="text-emerald-600 font-semibold capitalize bg-emerald-50 px-2 py-0.5 rounded-md">
                        {proj.status || "Ongoing"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SERVICES CARD WITH FIX FOR CKEDITOR & 3-LINE CLAMP */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Wrench size={18} style={{ color: activeColor }} />
                <h3 className="text-sm font-bold text-gray-800">Active Services</h3>
              </div>
              <Link
                href="/cms/services"
                className="text-xs font-semibold hover:underline flex items-center gap-0.5"
                style={{ color: activeColor }}
              >
                Manage <ArrowUpRight size={13} />
              </Link>
            </div>

            {services.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No services found.</p>
            ) : (
              <div className="space-y-2.5">
                {services.slice(0, 3).map((service, idx) => {
                  const plainDesc =
                    stripHtmlTags(service.description || "") ||
                    "No description specified.";

                  return (
                    <div
                      key={service._id || service.id || idx}
                      className="p-3 bg-gray-50/80 hover:bg-gray-50 rounded-xl text-xs space-y-1 transition"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800 line-clamp-1">
                          {service.title}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            service.is_active !== false
                              ? "text-emerald-600 bg-emerald-50"
                              : "text-rose-600 bg-rose-50"
                          }`}
                        >
                          {service.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                      
                      {/* Plain text representation with strict 3-line clamping */}
                      <p className="text-gray-500 line-clamp-3 text-[11px] leading-relaxed">
                        {plainDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CONTACT MESSAGES CARD */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Mail size={18} style={{ color: activeColor }} />
                <h3 className="text-sm font-bold text-gray-800">Contact Messages</h3>
              </div>
              <Link
                href="/cms/contact-messages"
                className="text-xs font-semibold hover:underline flex items-center gap-0.5"
                style={{ color: activeColor }}
              >
                Inbox <ArrowUpRight size={13} />
              </Link>
            </div>

            {contacts.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No contact inquiries.</p>
            ) : (
              <div className="space-y-2.5">
                {contacts.slice(0, 3).map((c, idx) => (
                  <div key={c.id || idx} className="p-3 bg-gray-50/80 hover:bg-gray-50 rounded-xl text-xs space-y-1 transition">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800 flex items-center gap-1">
                        <User size={12} className="text-gray-400" /> {c.name}
                      </span>
                      {c.phone && <span className="text-[10px] text-gray-400">{c.phone}</span>}
                    </div>
                    <p className="text-gray-500 line-clamp-1 text-[11px]">"{c.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}