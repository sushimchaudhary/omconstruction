"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "@/lib/context/ThemeContext";
import SidebarNav, { type SidebarSize } from "@/components/dashboard/Sidebarnav";
import TopNavbar from "@/components/dashboard/Topnavbar";
import SettingsDrawer, {
  type PrimarySkin,
  type SkinMode,
  type SidebarStyle,
  type NavStyle,
  type UiStyle,
  type Direction,
  type TopbarColor,
  type MenuColor,
} from "@/components/ui/setting";
import { UserServices } from "@/services/userServices";
import { useOrganization } from "@/lib/hooks/useOrganization";
import { socket } from "@/lib/socket"; // 🟢 Socket Import
import { toast } from "sonner"; // 🟢 Toast alert
import Loading from "@/components/loading";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

export type FooterStyle = "fluid" | "fixed" | "hidden";

type LayoutSettings = {
  skinMode: SkinMode;
  sidebarStyle: SidebarStyle;
  navStyle: NavStyle;
  primarySkin: PrimarySkin;
  uiStyle: UiStyle;
  direction: Direction;
  layoutMode: "fluid" | "boxed" | "detached";
  topbarColor: TopbarColor;
  menuColor: MenuColor;
  sidebarSize: SidebarSize;
  customColor: string;
  footerStyle: FooterStyle;
};

const DEFAULTS: LayoutSettings = {
  skinMode: "light" as SkinMode,
  sidebarStyle: "light" as SidebarStyle,
  navStyle: "default" as NavStyle,
  primarySkin: "default" as PrimarySkin,
  uiStyle: "default" as UiStyle,
  direction: "ltr" as Direction,
  layoutMode: "fluid",
  topbarColor: "light" as TopbarColor,
  menuColor: "light" as MenuColor,
  sidebarSize: "default",
  customColor: "#06b6d4",
  footerStyle: "fluid" as FooterStyle,
};

const LS_KEY = "admin_layout_settings";

function loadSettings(): LayoutSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: LayoutSettings) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {}
}

function clearSettings() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}

const PRESET_COLORS: Record<string, string> = {
  default: "#06b6d4",
  bluelight: "#60a5fa",
  egyptian: "#0f4c3a",
  purple: "#8b5cf6",
  blue: "#3b82f6",
  red: "#ef4444",
  orange: "#f97316",
  pink: "#ec4899",
  cyan: "#236B28",
  yellow: "#eab308",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const token = getCookie("adminToken");
    const superUserFlag = getCookie("is_superuser") === "true";

    if (!token) {
      router.push("/login");
      return;
    }

    setIsSuperUser(superUserFlag);
    setIsMounted(true);

    // Construction Management Specific Routes check
    const workerRoutes = [
      "/cms",
      "/cms/projects",
      "/cms/tasks",
      "/cms/attendance",
      "/cms/materials",
    ];

    if (superUserFlag && workerRoutes.includes(pathname)) {
      router.push("/cms");
    }
  }, [pathname, router]);

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <DashboardContainer isSuperUser={isSuperUser}>
        {children}
      </DashboardContainer>
    </ThemeProvider>
  );
}

function DashboardContainer({
  children,
  isSuperUser,
}: {
  children: React.ReactNode;
  isSuperUser: boolean;
}) {
  const { setThemeConfig } = useTheme();
  const { organization } = useOrganization();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // 🔊 Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  }, []);

  // 🔇 Sound Enabled Preference Sync State & Listener
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sound_notifications_enabled") !== "false";
    }
    return true;
  });

  const soundEnabledRef = useRef(soundEnabled);

  // 🔄 Real-time Sound Sync Listener
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;

    const syncSoundState = () => {
      const currentState = localStorage.getItem("sound_notifications_enabled") !== "false";
      setSoundEnabled(currentState);
      soundEnabledRef.current = currentState;
    };

    window.addEventListener("soundStateChanged", syncSoundState);
    window.addEventListener("storage", syncSoundState);

    return () => {
      window.removeEventListener("soundStateChanged", syncSoundState);
      window.removeEventListener("storage", syncSoundState);
    };
  }, [soundEnabled]);

  // 🎵 Notification Sound Function
  const playNotificationSound = useCallback(() => {
    if (!soundEnabledRef.current) return;

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
      playTone(880, now, 0.90);
      playTone(1108.73, now + 0.65, 0.65);
    } catch {
      // Fail silently
    }
  }, [getAudioContext]);

  // 📡 Real-time Socket Listening for Construction Updates/Alerts
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleConnect = () => socket.emit("join_admin");
    socket.on("connect", handleConnect);
    if (socket.connected) socket.emit("join_admin");

    const handleSiteUpdate = (data: any) => {
      playNotificationSound();
      toast.success(data?.message || "New project notification received", {
        icon: "🔔",
      });
    };

    socket.on("project:updated", handleSiteUpdate);
    socket.on("task:assigned", handleSiteUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("project:updated", handleSiteUpdate);
      socket.off("task:assigned", handleSiteUpdate);
    };
  }, [playNotificationSound]);

  // Load Profile
  useEffect(() => {
    UserServices.getProfile()
      .then((res: any) => {
        const profileData = res?.data || res;
        setProfile(profileData);
      })
      .catch((err) => console.error("Failed to load profile for footer", err));
  }, []);

  const saved = loadSettings();
  const [skinMode, setSkinMode] = useState<SkinMode>(saved.skinMode);
  const [sidebarStyle, setSidebarStyle] = useState<SidebarStyle>(saved.sidebarStyle);
  const [navStyle, setNavStyle] = useState<NavStyle>(saved.navStyle);
  const [primarySkin, setPrimarySkin] = useState<PrimarySkin>(saved.primarySkin);
  const [uiStyle, setUiStyle] = useState<UiStyle>(saved.uiStyle);
  const [direction, setDirection] = useState<Direction>(saved.direction);
  const [layoutMode, setLayoutMode] = useState<"fluid" | "boxed" | "detached">(saved.layoutMode);
  const [topbarColor, setTopbarColor] = useState<TopbarColor>(saved.topbarColor);
  const [menuColor, setMenuColor] = useState<MenuColor>(saved.menuColor);
  const [sidebarSize, setSidebarSize] = useState<SidebarSize>(saved.sidebarSize);
  const [customColor, setCustomColor] = useState<string>(saved.customColor);
  const [footerStyle, setFooterStyle] = useState<FooterStyle>(saved.footerStyle);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeColor =
    primarySkin === "custom" ? customColor : PRESET_COLORS[primarySkin] ?? "#06b6d4";

  useEffect(() => {
    setThemeConfig({ primaryColor: activeColor });
  }, [activeColor, setThemeConfig]);

  useEffect(() => {
    if (mounted) {
      saveSettings({
        skinMode, sidebarStyle, navStyle, primarySkin, uiStyle,
        direction, layoutMode, topbarColor, menuColor, sidebarSize, customColor, footerStyle,
      });
    }
  }, [skinMode, sidebarStyle, navStyle, primarySkin, uiStyle, direction,
      layoutMode, topbarColor, menuColor, sidebarSize, customColor, footerStyle, mounted]);

  const handleReset = () => {
    clearSettings();
    setSkinMode(DEFAULTS.skinMode);
    setSidebarStyle(DEFAULTS.sidebarStyle);
    setNavStyle(DEFAULTS.navStyle);
    setPrimarySkin(DEFAULTS.primarySkin);
    setUiStyle(DEFAULTS.uiStyle);
    setDirection(DEFAULTS.direction);
    setLayoutMode(DEFAULTS.layoutMode);
    setTopbarColor(DEFAULTS.topbarColor);
    setMenuColor(DEFAULTS.menuColor);
    setSidebarSize(DEFAULTS.sidebarSize);
    setCustomColor(DEFAULTS.customColor);
    setFooterStyle(DEFAULTS.footerStyle);
  };

  const getLayoutWrapperClass = () => {
    if (layoutMode === "boxed") return "max-w-[1280px] mx-auto shadow-2xl";
    if (layoutMode === "detached") return "max-w-[1400px] mx-auto px-4 pt-3";
    return "";
  };

  const companyTitle =
    profile?.company_name ||
    (organization as any)?.company_name ||
    (organization as any)?.title ||
    "Construction Portal";

  return (
    <div
      dir={direction}
      className={`flex h-screen font-sans overflow-hidden ${
        skinMode === "dark" ? "bg-slate-950 text-white" : "bg-[#f0f2f5] text-slate-700"
      }`}
    >
      <div className={`flex flex-1 h-full min-w-0 ${getLayoutWrapperClass()}`}>
        <SidebarNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarStyle={sidebarStyle}
          menuColor={menuColor}
          sidebarSize={sidebarSize}
          setSidebarSize={setSidebarSize}
          setSidebarSizeAction={setSidebarSize}
          activeColor={activeColor}
          layoutMode={layoutMode}
          is_superuser={isSuperUser}
        />

        <div className="flex-1 flex flex-col min-w-0 relative">
          <TopNavbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            topbarColor={topbarColor}
            navStyle={navStyle}
            activeColor={activeColor}
            layoutMode={layoutMode}
            onSettingsOpen={() => setSettingsOpen(true)}
          />

          <main className="bg-white/80 flex-1 overflow-y-auto p-3">
            {children}
          </main>

          {footerStyle !== "hidden" && (
            <footer
              className={`py-3 px-6 text-xs border-t flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0 ${
                skinMode === "dark"
                  ? "bg-slate-900 border-slate-800 text-slate-400"
                  : "bg-white border-gray-200 text-slate-500"
              } ${footerStyle === "fixed" ? "sticky bottom-0 z-30 shadow-md" : ""}`}
            >
              <div className="flex items-center gap-1.5 font-medium truncate">
                {companyTitle && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-slate-400">{companyTitle}</span>
                  </>
                )}
                <span className="text-gray-400 ml-1">© {new Date().getFullYear()}. All rights reserved.</span>
              </div>
              <span className="font-semibold text-gray-400">v2.0.0</span>
            </footer>
          )}

          {settingsOpen && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-300"
              onClick={() => setSettingsOpen(false)}
            />
          )}

          <SettingsDrawer
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            onReset={handleReset}
            activeColor={activeColor}
            skinMode={skinMode}
            setSkinMode={setSkinMode}
            topbarColor={topbarColor}
            setTopbarColor={setTopbarColor}
            menuColor={menuColor}
            setMenuColor={setMenuColor}
            sidebarSize={sidebarSize}
            setSidebarSize={setSidebarSize}
            direction={direction}
            setDirection={setDirection}
            uiStyle={uiStyle}
            setUiStyle={setUiStyle}
            sidebarStyle={sidebarStyle}
            setSidebarStyle={setSidebarStyle}
            navStyle={navStyle}
            setNavStyle={setNavStyle}
            primarySkin={primarySkin}
            setPrimarySkin={setPrimarySkin}
            customColor={customColor}
            setCustomColor={setCustomColor}
          />
        </div>
      </div>
    </div>
  );
}