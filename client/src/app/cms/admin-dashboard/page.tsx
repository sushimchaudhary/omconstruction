"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  DollarSign,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Wallet,
  Receipt,
  ArrowUpRight,
  Clock,
  ChevronRight,
  ChevronLeft,
  VolumeX,
  Volume2,
  CalendarRange,
  Search,
  TrendingUp,
  TrendingDown,
  Sparkles,
  HardHat,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { format, subDays, isSameDay, startOfDay, endOfDay } from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

import { useTheme } from "@/lib/context/ThemeContext";
import { OrganizationServices } from "@/services/organizationServices";
import { UserServices, Profile } from "@/services/userServices";
import { socket } from "@/lib/socket";
import { SliderServices } from "@/services/sliderServices";

import CategoryRatingCard from "@/components/dashboard/rating";

const { RangePicker } = DatePicker;

const DEFAULT_HERO_SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop",
];

// ── Types ─────────────────────────────────────────────────────────────────
interface DashboardStats {
  totalRecords: number;
  approvedRecords: number;
  pendingRecords: number;
  totalBudget: number;
  pendingBudget: number;
  avgCostValue: number;
  todayBudget: number;
  todayTasks: number;
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
  cancelledTasks: number;
  budgetTrend?: number;
}

type PresetKey = "today" | "7d" | "30d" | "custom";

const CATEGORY_PALETTE = [
  "#6366f1",
  "#f59e0b",
  "#22c55e",
  "#ec4899",
  "#06b6d4",
  "#a855f7",
  "#ef4444",
  "#84cc16",
];

// ── Color helpers ────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shade(hex: string, percent: number) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ── Date range presets ───────────────────────────────────────────────────
function buildPresetRange(key: PresetKey): { start: Date; end: Date } {
  const now = new Date();
  if (key === "today") return { start: startOfDay(now), end: endOfDay(now) };
  if (key === "7d")
    return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
  if (key === "30d")
    return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
  return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
}

// ── Build last-30-days trend ─────────────────────
function buildTrend(records: any[], tasks: any[]) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return { date, label: format(date, "dd MMM"), revenue: 0, orders: 0 };
  });

  records.forEach((rec) => {
    if (!rec.created_at) return;
    const recDate = new Date(rec.created_at);
    const bucket = days.find(
      (d) => d.date.toDateString() === recDate.toDateString(),
    );
    if (bucket) bucket.revenue += Number(rec.amount || rec.grand_total) || 0;
  });

  tasks.forEach((task) => {
    if (!task.created_at) return;
    const taskDate = new Date(task.created_at);
    const bucket = days.find(
      (d) => d.date.toDateString() === taskDate.toDateString(),
    );
    if (bucket) bucket.orders += 1;
  });

  return days;
}

// ── Export helpers ───────────────────────────────────────────────────────
function recordsToRows(records: any[]) {
  return records.map((r, i) => ({
    "S.N.": i + 1,
    "Record ID": r.record_number || r.id,
    Project: r.project_name ?? "—",
    "Amount (NPR)": Number(r.amount || r.grand_total || 0).toFixed(2),
    Status: r.is_paid || r.is_approved ? "Approved" : "Pending",
    Date: r.created_at
      ? format(new Date(r.created_at), "yyyy-MM-dd HH:mm")
      : "—",
  }));
}

function exportToExcel(records: any[], filename: string) {
  const rows = recordsToRows(records);
  if (rows.length === 0) {
    toast.error("Nothing to export for this range");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Construction_Logs");
  XLSX.writeFile(wb, `${filename}.xlsx`);
  toast.success("Excel file downloaded");
}

function exportToCSV(records: any[], filename: string) {
  const rows = recordsToRows(records);
  if (rows.length === 0) {
    toast.error("Nothing to export for this range");
    return;
  }
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => `"${String((r as any)[h]).replace(/"/g, '""')}"`)
        .join(","),
    ),
  ];
  const blob = new Blob([csvLines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  toast.success("CSV file downloaded");
}

// ── Skeleton ─────────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse p-6">
      <div className="h-28 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-80 bg-gray-200 rounded-lg" />
        <div className="h-80 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-96 bg-gray-200 rounded-lg" />
    </div>
  );
}

// ── Primary Stat Component ──────────────────────────────────────────────
function PrimaryStat({
  icon: Icon,
  label,
  value,
  href,
  trend,
  primaryColor,
  index,
  pulse,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  href: string;
  trend?: number;
  primaryColor: string;
  index: number;
  pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link href={href}>
        <div className="group relative bg-white rounded-lg border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer">
          {pulse && (
            <motion.div
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 1.2, repeat: 2 }}
              className="absolute inset-0 rounded-lg border-2 pointer-events-none"
              style={{ borderColor: primaryColor }}
            />
          )}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.05)}, transparent 60%)`,
            }}
          />
          <div className="relative flex items-start justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: hexToRgba(primaryColor, 0.1),
                color: primaryColor,
              }}
            >
              <Icon size={18} />
            </div>
            <ArrowUpRight
              size={14}
              className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </div>
          <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none">
            {value}
          </p>
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {label}
            </p>
            {trend !== undefined && (
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  trend >= 0
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-rose-600 bg-rose-50"
                }`}
              >
                {trend >= 0 ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Mini Stat Component ─────────────────────────────────────────────────
function MiniStat({
  icon: Icon,
  label,
  value,
  href,
  primaryColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  href: string;
  primaryColor: string;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer group">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: hexToRgba(primaryColor, 0.1),
            color: primaryColor,
          }}
        >
          <Icon size={14} />
        </div>
        <span className="text-[12px] font-bold text-gray-600 flex-1">
          {label}
        </span>
        <span className="text-[13px] font-bold text-gray-900 tabular-nums">
          {value}
        </span>
        <ChevronRight
          size={12}
          className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </Link>
  );
}

// ── Chart Tooltip ────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, primaryColor }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2.5 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                p.dataKey === "revenue" ? primaryColor : "#fbbf24",
            }}
          />
          <span className="text-gray-500 capitalize">
            {p.dataKey === "revenue" ? "Budget" : "Tasks"}:
          </span>
          <span className="font-bold text-gray-800">
            {p.dataKey === "revenue"
              ? `Rs ${Number(p.value).toFixed(2)}`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Date Range Filter Toolbar ────────────────────────────────────────────
function FilterToolbar({
  preset,
  setPreset,
  customStart,
  customEnd,
  setCustomStart,
  setCustomEnd,
  primaryColor,
  onExportExcel,
  onExportCSV,
}: {
  preset: PresetKey;
  setPreset: (p: PresetKey) => void;
  customStart: string;
  customEnd: string;
  setCustomStart: (s: string) => void;
  setCustomEnd: (s: string) => void;
  primaryColor: string;
  onExportExcel: () => void;
  onExportCSV: () => void;
}) {
  const isHex = primaryColor?.startsWith("#");
  const presets: { key: PresetKey; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 shrink-0">
        <CalendarRange size={14} style={isHex ? { color: primaryColor } : {}} />
        Date Range
      </div>

      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 flex-wrap">
        {presets.map((p) => {
          const active = preset === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              style={active && isHex ? { backgroundColor: primaryColor } : {}}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                active
                  ? "text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-white"
              } ${active && !isHex ? `bg-${primaryColor}` : ""}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {preset === "custom" && (
        <RangePicker
          size="small"
          value={[
            customStart ? dayjs(customStart) : null,
            customEnd ? dayjs(customEnd) : null,
          ]}
          onChange={(dates, dateStrings) => {
            if (dates) {
              setCustomStart(dateStrings[0]);
              setCustomEnd(dateStrings[1]);
            } else {
              setCustomStart("");
              setCustomEnd("");
            }
          }}
          className="text-xs font-semibold"
        />
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* Excel Button */}
        <button
          onClick={onExportExcel}
          title="Export to Excel"
          aria-label="Export to Excel"
          className="cursor-pointer"
        >
          <img
            src="/excel.png"
            alt="Excel"
            className="w-7 h-7 object-contain"
          />
        </button>

        {/* CSV Button */}
        <button
          onClick={onExportCSV}
          title="Export to CSV"
          aria-label="Export to CSV"
          className="cursor-pointer"
        >
          <img src="/csv.png" alt="CSV" className="w-7 h-7 object-contain" />
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { primaryColor } = useTheme();
  const isHex = primaryColor?.startsWith("#");
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [constructionOrg, setConstructionOrg] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRecords: 0,
    approvedRecords: 0,
    pendingRecords: 0,
    totalBudget: 0,
    pendingBudget: 0,
    avgCostValue: 0,
    todayBudget: 0,
    todayTasks: 0,
    totalTasks: 0,
    openTasks: 0,
    completedTasks: 0,
    cancelledTasks: 0,
  });
  const [trend, setTrend] = useState<any[]>([]);

  // Date range filter
  const [preset, setPreset] = useState<PresetKey>("7d");
  const [customStart, setCustomStart] = useState(
    format(subDays(new Date(), 6), "yyyy-MM-dd"),
  );
  const [customEnd, setCustomEnd] = useState(format(new Date(), "yyyy-MM-dd"));

  const activeRange = useMemo(() => {
    if (preset === "custom") {
      const start = customStart
        ? startOfDay(new Date(customStart))
        : startOfDay(new Date());
      const end = customEnd
        ? endOfDay(new Date(customEnd))
        : endOfDay(new Date());
      return { start, end };
    }
    return buildPresetRange(preset);
  }, [preset, customStart, customEnd]);

  // History table state
  const [historySearch, setHistorySearch] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const HISTORY_PAGE_SIZE = 8;

  // Sound and Socket state
  const [newUpdatePulse, setNewUpdatePulse] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(true);

  // Dynamic Hero Slider Images state
  const [sliderImages, setSliderImages] = useState<string[]>(
    DEFAULT_HERO_SLIDER_IMAGES,
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const playTone = (freq: number, startTime: number, duration: number) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playTone(880, now, 0.25);
      playTone(1108.73, now + 0.15, 0.35);
    } catch {
      // Fail silently
    }
  }, [getAudioContext]);

  useEffect(() => {
    UserServices.getProfile()
      .then((data) => setProfile(data))
      .catch((err) =>
        console.error("Failed to load user profile in dashboard", err),
      );
  }, []);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const recordsRef = useRef<any[]>([]);
  const tasksRef = useRef<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchAll = useCallback(
    async (opts: { silent?: boolean } = {}) => {
      try {
        if (!opts.silent) setLoading(true);

       

        const recordsList: any[] = [];
        const tasksList: any[] = [];

       ;

        

       

        
        if (JSON.stringify(recordsRef.current) !== JSON.stringify(recordsList)) {
          recordsRef.current = recordsList;
          setRecords(recordsList);
        }
        if (JSON.stringify(tasksRef.current) !== JSON.stringify(tasksList)) {
          tasksRef.current = tasksList;
          setTasks(tasksList);
        }
      

        const approved = recordsList.filter((b: any) => b.is_paid || b.is_approved);
        const pending = recordsList.filter((b: any) => !(b.is_paid || b.is_approved));
        const totalBudget = approved.reduce(
          (sum: number, b: any) => sum + (Number(b.amount || b.grand_total) || 0),
          0,
        );
        const pendingBudget = pending.reduce(
          (sum: number, b: any) => sum + (Number(b.amount || b.grand_total) || 0),
          0,
        );
        const avgCostValue = approved.length > 0 ? totalBudget / approved.length : 0;

        const today = new Date();
        const yesterday = subDays(today, 1);
        const todayRecords = recordsList.filter(
          (b: any) => b.created_at && isSameDay(new Date(b.created_at), today),
        );
        const yesterdayRecords = recordsList.filter(
          (b: any) =>
            b.created_at && isSameDay(new Date(b.created_at), yesterday),
        );
        const todayTasksList = tasksList.filter(
          (o: any) => o.created_at && isSameDay(new Date(o.created_at), today),
        );

        const todayBudget = todayRecords.reduce(
          (sum: number, b: any) => sum + (Number(b.amount || b.grand_total) || 0),
          0,
        );
        const yesterdayBudget = yesterdayRecords.reduce(
          (sum: number, b: any) => sum + (Number(b.amount || b.grand_total) || 0),
          0,
        );
        const budgetTrend =
          yesterdayBudget > 0
            ? Math.round(
                ((todayBudget - yesterdayBudget) / yesterdayBudget) * 100,
              )
            : undefined;

        const openTasks = tasksList.filter((o: any) =>
          ["pending", "in_progress", "active"].includes(o.status),
        ).length;
        const completedTasks = tasksList.filter(
          (o: any) => o.status === "completed",
        ).length;
        const cancelledTasks = tasksList.filter(
          (o: any) => o.status === "cancelled" || o.status === "rejected",
        ).length;

        setStats({
          totalRecords: recordsList.length,
          approvedRecords: approved.length,
          pendingRecords: pending.length,
          totalBudget,
          pendingBudget,
          avgCostValue,
          todayBudget,
          todayTasks: todayTasksList.length,
          totalTasks: tasksList.length,
          openTasks,
          completedTasks,
          cancelledTasks,
          budgetTrend,
        });

        setTrend(buildTrend(recordsList, tasksList));
      } catch {
        if (!opts.silent) toast.error("Failed to load dashboard data");
      } finally {
        if (!opts.silent) setLoading(false);
        hasLoadedOnce.current = true;
      }
    },
    [playNotificationSound],
  );

  useEffect(() => {
    if (sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Realtime Socket.IO
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleConnect = () => socket.emit("join_admin");
    socket.on("connect", handleConnect);
    if (socket.connected) socket.emit("join_admin");

    const handleUpdate = () => fetchAll({ silent: true });

    socket.on("project:updated", handleUpdate);
    socket.on("task:created", handleUpdate);
    socket.on("task:updated", handleUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("project:updated", handleUpdate);
      socket.off("task:created", handleUpdate);
      socket.off("task:updated", handleUpdate);
    };
  }, [fetchAll]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!socket.connected) fetchAll({ silent: true });
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Derived: date-range filtered records / tasks
  const filteredRecords = useMemo(() => {
    return records.filter((b) => {
      if (!b.created_at) return false;
      const d = new Date(b.created_at);
      return d >= activeRange.start && d <= activeRange.end;
    });
  }, [records, activeRange]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((o) => {
      if (!o.created_at) return false;
      const d = new Date(o.created_at);
      return d >= activeRange.start && d <= activeRange.end;
    });
  }, [tasks, activeRange]);

  const rangeStats = useMemo(() => {
    const approved = filteredRecords.filter((b) => b.is_paid || b.is_approved);
    const pending = filteredRecords.filter((b) => !(b.is_paid || b.is_approved));
    const budget = approved.reduce((s, b) => s + (Number(b.amount || b.grand_total) || 0), 0);
    return {
      budget,
      approvedCount: approved.length,
      pendingCount: pending.length,
      pendingAmount: pending.reduce(
        (s, b) => s + (Number(b.amount || b.grand_total) || 0),
        0,
      ),
      tasksCount: filteredTasks.length,
    };
  }, [filteredRecords, filteredTasks]);

  // History table
  const historyRows = useMemo(() => {
    const q = historySearch.toLowerCase();
    return [...filteredRecords]
      .filter((b) => {
        if (!q) return true;
        return (
          String(b.record_number || b.id)
            .toLowerCase()
            .includes(q) ||
          String(b.project_name ?? "")
            .toLowerCase()
            .includes(q)
        );
      })
      .sort((a, b) =>
        a.created_at && b.created_at
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : 0,
      );
  }, [filteredRecords, historySearch]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historySearch, activeRange]);

  const historyTotalPages = Math.max(
    1,
    Math.ceil(historyRows.length / HISTORY_PAGE_SIZE),
  );
  const historyPaginated = historyRows.slice(
    (historyPage - 1) * HISTORY_PAGE_SIZE,
    historyPage * HISTORY_PAGE_SIZE,
  );

  const rangeLabel =
    preset === "today"
      ? "Today"
      : preset === "7d"
        ? "Last 7 Days"
        : preset === "30d"
          ? "Last 30 Days"
          : `${format(activeRange.start, "dd MMM")} – ${format(activeRange.end, "dd MMM")}`;

  const exportFilename = `construction_${format(activeRange.start, "yyyyMMdd")}_${format(activeRange.end, "yyyyMMdd")}`;

  if (loading) return <DashboardSkeleton />;

  const displayName = profile?.first_name || Cookies.get("username") || "User";

  return (
    <div className="h-screen scrollbar-hide space-y-5 pb-4">
      {/* HERO WELCOME HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-lg overflow-hidden p-6 md:p-8 min-h-[250px] flex flex-col justify-between shadow-lg"
      >
        <div className="absolute inset-0 z-0 bg-slate-900">
          <AnimatePresence mode="wait">
            {sliderImages.length > 0 && (
              <motion.img
                key={currentSlide}
                src={sliderImages[currentSlide % sliderImages.length]}
                alt="Construction Site background"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.35, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="w-full h-full object-cover"
              />
            )}
          </AnimatePresence>

          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(120deg, ${shade(primaryColor, -20)} 0%, ${primaryColor} 100%)`,
              mixBlendMode: "multiply",
            }}
          />

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-20">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={13} className="text-amber-300" />
              <span>{format(new Date(), "EEEE, dd MMMM yyyy")}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight capitalize tracking-tight flex items-center gap-2">
              Welcome back
              <span style={{ color: primaryColor }}>{displayName}</span>
            </h1>

            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
              {stats.totalRecords} project log{stats.totalRecords !== 1 ? "s" : ""}{" "}
              recorded so far, with{" "}
              <span className="font-bold text-white">{stats.pendingRecords}</span>{" "}
              awaiting approval.
            </p>
          </div>

          <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                soundEnabledRef.current = nextState;
                localStorage.setItem(
                  "sound_notifications_enabled",
                  String(nextState),
                );

                window.dispatchEvent(new Event("soundStateChanged"));

                toast.info(
                  nextState
                    ? "Sound notifications enabled"
                    : "Sound notifications muted",
                );
              }}
              title={
                soundEnabled ? "Mute notifications" : "Unmute notifications"
              }
              className="w-full md:w-10 h-10 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20 active:scale-95"
            >
              {soundEnabled ? (
                <Volume2 size={16} className="text-emerald-300" />
              ) : (
                <VolumeX size={16} className="text-rose-300" />
              )}
            </button>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-center w-full md:w-auto md:min-w-[95px]">
              <p className="text-white text-lg font-bold tabular-nums">
                Rs {stats.todayBudget.toFixed(0)}
              </p>
              <p className="text-white/75 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                Expense Today
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-center w-full md:w-auto md:min-w-[95px]">
              <p className="text-white text-lg font-bold tabular-nums">
                {stats.todayTasks}
              </p>
              <p className="text-white/75 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                Tasks Today
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* DATE RANGE FILTER + EXPORT */}
      <FilterToolbar
        preset={preset}
        setPreset={setPreset}
        customStart={customStart}
        customEnd={customEnd}
        setCustomStart={setCustomStart}
        setCustomEnd={setCustomEnd}
        primaryColor={primaryColor}
        onExportExcel={() => exportToExcel(filteredRecords, exportFilename)}
        onExportCSV={() => exportToCSV(filteredRecords, exportFilename)}
      />

      {/* PRIMARY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PrimaryStat
          icon={DollarSign}
          label={`Budget · ${rangeLabel}`}
          value={`Rs ${rangeStats.budget.toFixed(2)}`}
          href="/cms/projects"
          trend={preset === "today" ? stats.budgetTrend : undefined}
          primaryColor={primaryColor}
          index={0}
        />
        <PrimaryStat
          icon={ClipboardList}
          label={`Tasks · ${rangeLabel}`}
          value={rangeStats.tasksCount}
          href="/cms/tasks"
          primaryColor={primaryColor}
          index={1}
          pulse={newUpdatePulse}
        />
        <PrimaryStat
          icon={HardHat}
          label="Active Site Tasks"
          value={stats.openTasks}
          href="/cms/tasks"
          primaryColor={primaryColor}
          index={2}
          pulse={newUpdatePulse}
        />
        <PrimaryStat
          icon={AlertCircle}
          label={`Pending · ${rangeLabel}`}
          value={rangeStats.pendingCount}
          href="/cms/projects"
          primaryColor={primaryColor}
          index={3}
        />
      </div>

      {/* TREND + CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-lg border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Project Budget &amp; Active Tasks — Last 30 Days
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Daily expenditure vs. ongoing site activities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-[11px] text-gray-500 font-medium">
                  Expenses
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-[11px] text-gray-500 font-medium">
                  Tasks
                </span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={trend}
              margin={{ top: 16, right: 8, left: -4, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={primaryColor}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor={primaryColor}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="ordGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(v) => `Rs ${v}`}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip content={<ChartTooltip primaryColor={primaryColor} />} />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke={primaryColor}
                strokeWidth={2.5}
                fill="url(#revGradient)"
              />
              <Area
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke="#fbbf24"
                strokeWidth={2.5}
                fill="url(#ordGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

      </div>

      <CategoryRatingCard orders={tasks} primaryColor={primaryColor} />

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.34 }}
          className="bg-white rounded-lg border border-gray-100 shadow-sm p-4"
        >
          <h3 className="text-sm font-bold text-gray-800 px-1 mb-1">
            Construction Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-2">
            <MiniStat
              icon={CheckCircle2}
              label="Approved Logs"
              value={stats.approvedRecords}
              href="/cms/projects"
              primaryColor={primaryColor}
            />
            <MiniStat
              icon={AlertCircle}
              label="Pending Approval"
              value={stats.pendingRecords}
              href="/cms/projects"
              primaryColor={primaryColor}
            />
            <MiniStat
              icon={XCircle}
              label="Cancelled Tasks"
              value={stats.cancelledTasks}
              href="/cms/tasks"
              primaryColor={primaryColor}
            />
            <MiniStat
              icon={Wallet}
              label="Avg Cost / Log"
              value={`Rs ${stats.avgCostValue.toFixed(2)}`}
              href="/cms/projects"
              primaryColor={primaryColor}
            />
          </div>
        </motion.div>
      </div>

      {/* HISTORY TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.4 }}
        className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Receipt size={16} style={isHex ? { color: primaryColor } : {}} />
            <h3 className="text-sm font-bold text-gray-800">
              Project Logs · {rangeLabel}
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {historyRows.length} record{historyRows.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <input
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search record, project..."
                className="pl-7 pr-3 py-1.5 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 w-52"
              />
            </div>
            <Link
              href="/cms/projects"
              className="text-[11px] font-bold uppercase tracking-wider hover:underline shrink-0"
              style={isHex ? { color: primaryColor } : {}}
            >
              View All
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f9fafb]">
                <th className="px-5 py-2 text-[10px] font-bold text-[#8094ae] uppercase">
                  Record ID
                </th>
                <th className="px-5 py-2 text-[10px] font-bold text-[#8094ae] uppercase">
                  Project
                </th>
                <th className="px-5 py-2 text-[10px] font-bold text-[#8094ae] uppercase">
                  Amount
                </th>
                <th className="px-5 py-2 text-[10px] font-bold text-[#8094ae] uppercase">
                  Status
                </th>
                <th className="px-5 py-2 text-[10px] font-bold text-[#8094ae] uppercase text-right">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historyPaginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="flex flex-col items-center gap-2">
                      <Receipt size={26} className="text-gray-200" />
                      <p className="text-xs text-gray-400">
                        No records found for this range.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                historyPaginated.map((b) => {
                  const shortCode = b.record_number
                    ? b.record_number.split("-").pop()
                    : b.id;
                  const isApproved = b.is_paid || b.is_approved;
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-2.5">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          #{shortCode}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-[11px] font-semibold text-gray-600">
                        {b.project_name ?? "—"}
                      </td>
                      <td className="px-5 py-2.5 text-[12px] font-bold text-gray-800 tabular-nums">
                        Rs {Number(b.amount || b.grand_total || 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isApproved
                              ? "text-emerald-600 bg-emerald-50"
                              : "text-rose-600 bg-rose-50"
                          }`}
                        >
                          {isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        {b.created_at && (
                          <span className="flex items-center justify-end gap-1 text-[10px] text-gray-400">
                            <Clock size={10} />
                            {format(new Date(b.created_at), "dd MMM, HH:mm")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {historyRows.length > 0 && (
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-[#f9fafb]">
            <span className="text-[11px] text-[#8094ae]">
              Showing {(historyPage - 1) * HISTORY_PAGE_SIZE + 1}–
              {Math.min(historyPage * HISTORY_PAGE_SIZE, historyRows.length)} of{" "}
              {historyRows.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setHistoryPage((p) => Math.max(p - 1, 1))}
                disabled={historyPage === 1}
                className="p-1 disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px] font-bold px-2">
                {historyPage} / {historyTotalPages}
              </span>
              <button
                onClick={() =>
                  setHistoryPage((p) => Math.min(p + 1, historyTotalPages))
                }
                disabled={historyPage === historyTotalPages}
                className="p-1 disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <p className="text-center border-t border-gray-200 pt-4 pb-2 text-[11px] text-gray-400">
        {constructionOrg?.title || "Construction Management System"} · CMS · © {new Date().getFullYear()}
      </p>
    </div>
  );
}