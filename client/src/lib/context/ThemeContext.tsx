"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

// ── Types ───────────────────────────────────────────────────────────────────
export type SkinMode = "light" | "dark";
export type SidebarStyle = "white" | "light" | "dark" | "theme";
export type NavStyle = "default" | "bluelight" | "dark" | "theme";
export type PrimarySkin =
  | "default"
  | "bluelight"
  | "egyptian"
  | "purple"
  | "blue"
  | "red"
  | "orange"
  | "pink"
  | "cyan"
  | "yellow"
  | "custom";
export type UiStyle = "default" | "softy";
export type Direction = "ltr" | "rtl";
export type TopbarColor = "light" | "dark" | "theme";
export type MenuColor = "light" | "dark" | "brand";
export type SidebarSize =
  | "default"
  | "compact"
  | "condensed"
  | "hover"
  | "full"
  | "fullscreen";
export type LayoutMode = "fluid" | "boxed" | "detached";
export type FooterStyle = "fluid" | "fixed" | "hidden";

export interface ThemeConfig {
  primaryColor: string;
  skinMode: SkinMode;
  topbarColor: TopbarColor;
  menuColor: MenuColor;
  sidebarSize: SidebarSize;
  direction: Direction;
  uiStyle: UiStyle;
  sidebarStyle: SidebarStyle;
  navStyle: NavStyle;
  primarySkin: PrimarySkin;
  customColor: string;
  layoutMode: LayoutMode;
  footerStyle: FooterStyle;
}

export interface ThemeProfile {
  id: string;
  name: string;
  branchName?: string;
  config: ThemeConfig;
  createdAt: number;
  updatedAt: number;
}

interface ThemeContextType extends ThemeConfig {
  setThemeConfig: (config: Partial<ThemeConfig>) => void;
  resetTheme: () => void;

  // Profiles
  profiles: ThemeProfile[];
  activeProfileId: string | null;
  saveProfile: (name: string, branchName?: string) => ThemeProfile;
  updateActiveProfile: () => void;
  applyProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  renameProfile: (id: string, name: string, branchName?: string) => void;
}

export const SKIN_COLORS: Record<Exclude<PrimarySkin, "custom">, string> = {
  default: "#06b6d4",
  bluelight: "#60a5fa",
  egyptian: "#0f4c3a",
  purple: "#8b5cf6",
  blue: "#2563eb",
  red: "#ef4444",
  orange: "#f97316",
  pink: "#ec4899",
  cyan: "#06b6d4",
  yellow: "#f59e0b",
};

const DEFAULT_CONFIG: ThemeConfig = {
  primaryColor: "#06b6d4",
  skinMode: "light",
  topbarColor: "light",
  menuColor: "light",
  sidebarSize: "default",
  direction: "ltr",
  uiStyle: "default",
  sidebarStyle: "white",
  navStyle: "default",
  primarySkin: "default",
  customColor: "#06b6d4",
  layoutMode: "fluid",
  footerStyle: "fluid",
};

const STORAGE_KEY = "restaurant-theme-config";
const PROFILES_KEY = "restaurant-theme-profiles";
const ACTIVE_PROFILE_KEY = "restaurant-theme-active-profile";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveColor(config: ThemeConfig): string {
  return config.primarySkin === "custom"
    ? config.customColor
    : SKIN_COLORS[config.primarySkin] ?? config.primaryColor;
}

function makeId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [profiles, setProfiles] = useState<ThemeProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // ── Hydrate from localStorage ───────────────────────────────────────────
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig) as Partial<ThemeConfig>;
        setConfig((prev) => ({ ...prev, ...parsed }));
      }
      const savedProfiles = localStorage.getItem(PROFILES_KEY);
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles) as ThemeProfile[]);
      }
      const savedActiveId = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (savedActiveId) setActiveProfileId(savedActiveId);
    } catch {
      // Fallback
    } finally {
      setHydrated(true);
    }
  }, []);

  // ── Persist config ────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config, hydrated]);

  // ── Persist profiles ──────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch {}
  }, [profiles, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (activeProfileId) {
        localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
      } else {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    } catch {}
  }, [activeProfileId, hydrated]);

  // ── CSS variables ────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-color", resolveColor(config));
    root.dataset.skinMode = config.skinMode;
    root.dataset.direction = config.direction;
    root.setAttribute("dir", config.direction);
  }, [config]);

  // 🟢 FIX 1: Wrap setThemeConfig in useCallback
  const setThemeConfig = useCallback((newConfig: Partial<ThemeConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...newConfig };

      if (newConfig.primarySkin && newConfig.primarySkin !== "custom") {
        next.primaryColor = SKIN_COLORS[newConfig.primarySkin];
      }
      if (newConfig.customColor && next.primarySkin === "custom") {
        next.primaryColor = newConfig.customColor;
      }

      return next;
    });
  }, []);

  // 🟢 FIX 2: Wrap all helper functions in useCallback
  const resetTheme = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setActiveProfileId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    } catch {}
  }, []);

  const saveProfile = useCallback((name: string, branchName?: string): ThemeProfile => {
    const profile: ThemeProfile = {
      id: makeId(),
      name: name.trim() || "Untitled profile",
      branchName: branchName?.trim() || undefined,
      config: { ...config },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProfiles((prev) => [...prev, profile]);
    setActiveProfileId(profile.id);
    return profile;
  }, [config]);

  const updateActiveProfile = useCallback(() => {
    if (!activeProfileId) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, config: { ...config }, updatedAt: Date.now() }
          : p
      )
    );
  }, [activeProfileId, config]);

  const applyProfile = useCallback((id: string) => {
    setProfiles((prev) => {
      const profile = prev.find((p) => p.id === id);
      if (profile) setConfig(profile.config);
      return prev;
    });
    setActiveProfileId(id);
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    setActiveProfileId((prevId) => (prevId === id ? null : prevId));
  }, []);

  const renameProfile = useCallback((id: string, name: string, branchName?: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: name.trim() || p.name,
              branchName: branchName?.trim() || undefined,
              updatedAt: Date.now(),
            }
          : p
      )
    );
  }, []);

  // 🟢 FIX 3: Memoize context value to avoid re-rendering dependents
  const contextValue = useMemo(
    () => ({
      ...config,
      setThemeConfig,
      resetTheme,
      profiles,
      activeProfileId,
      saveProfile,
      updateActiveProfile,
      applyProfile,
      deleteProfile,
      renameProfile,
    }),
    [
      config,
      setThemeConfig,
      resetTheme,
      profiles,
      activeProfileId,
      saveProfile,
      updateActiveProfile,
      applyProfile,
      deleteProfile,
      renameProfile,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}