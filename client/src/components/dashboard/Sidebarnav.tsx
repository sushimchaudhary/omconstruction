"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import {
  X,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Building2,
  Users,
  User as UserIcon,
  MessageSquareText,
  Circle,
  LogOut,
  Calendar,
  Shield,
  Mail,
  Phone,
  Briefcase,
  FolderKanban,
  CalendarCheck,
  Info,
  Wrench,
} from "lucide-react";
import { OrganizationServices } from "@/services/organizationServices"; // Adjust path if needed
import { UserServices } from "@/services/userServices";

export type SidebarStyle = "light" | "dark" | "white" | "theme";
export type MenuColor = "light" | "dark" | "brand";
export type SidebarSize =
  | "default"
  | "condensed"
  | "hover"
  | "compact"
  | "full"
  | "fullscreen";

interface SidebarNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarStyle: SidebarStyle;
  menuColor: MenuColor;
  sidebarSize: SidebarSize;
  setSidebarSize: React.Dispatch<React.SetStateAction<SidebarSize>>;
  activeColor: string;
  layoutMode: "fluid" | "boxed" | "detached";
  is_superuser?: boolean | string;
  setSidebarSizeAction?: React.Dispatch<React.SetStateAction<SidebarSize>>;
}

type SubMenuItem = {
  labelKey: string;
  href: string;
  icon?: React.ElementType;
};

type MenuItem = {
  icon: React.ElementType;
  labelKey: string;
  href?: string;
  children?: SubMenuItem[];
};

type MenuGroup = {
  groupKey: string;
  label?: string;
  items: MenuItem[];
};

// ── Super Admin Menu ──────────────────────────────────────────
const SUPERADMIN_MENU_GROUPS: MenuGroup[] = [
  {
    groupKey: "dashboard",
    items: [
      {
        icon: LayoutDashboard,
        labelKey: "Dashboard",
        href: "/cms",
      },
    ],
  },
  // {
  //   groupKey: "user_management",
  //   label: "User Management",
  //   items: [
  //     { icon: Users, labelKey: "Users", href: "/cms/users" },
  //     { icon: Briefcase, labelKey: "Team Members", href: "/cms/team-members" },
  //   ],
  // },
  {
    groupKey: "company_details",
    label: "Company Content",
    items: [
      { icon: Building2, labelKey: "Organization", href: "/cms/organization" },
      { icon: Info, labelKey: "About Us", href: "/cms/about" },
      { icon: Wrench, labelKey: "Services", href: "/cms/services" },
      { icon: FolderKanban, labelKey: "Projects", href: "/cms/project-manage" },
    ],
  },
  {
    groupKey: "operations",
    label: "Operations",
    items: [
      // { icon: CalendarCheck, labelKey: "Attendance Control", href: "/cms/attendances" },
      { icon: MessageSquareText, labelKey: "Contact Messages", href: "/cms/contact-messages" },
    ],
  },
];

// ── Worker / General Staff Menu ────────────────────────────────
const WORKER_MENU_GROUPS: MenuGroup[] = [
  {
    groupKey: "dashboard",
    items: [
      {
        icon: LayoutDashboard,
        labelKey: "Dashboard",
        href: "/profile",
      },
    ],
  },
];

const GROUP_LABELS: Record<string, string> = {
  dashboard: "Main",
  user_management: "User Management",
  company_details: "Company Content",
  operations: "Operations",
  work: "My Work",
  company: "Company Info",
};

export default function SidebarNav({
  sidebarOpen,
  setSidebarOpen,
  sidebarStyle,
  menuColor,
  sidebarSize,
  setSidebarSize,
  activeColor,
  layoutMode,
  is_superuser,
}: SidebarNavProps) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // Organization state
  const [organization, setOrganization] = useState<any>(null);
  const [orgLoading, setOrgLoading] = useState<boolean>(true);

  // User State Declarations
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch Organization Details via OrganizationServices
  useEffect(() => {
    setOrgLoading(true);
    OrganizationServices.getDetails()
      .then((res: any) => {
        const data = Array.isArray(res) ? res[0] : res?.data?.[0] || res?.data || res;
        setOrganization(data);
      })
      .catch((err) => console.error("Failed to load organization in sidebar", err))
      .finally(() => setOrgLoading(false));
  }, []);

  const cookieSuperUser = Cookies.get("is_superuser");
  const isSuperUser =
    is_superuser === true ||
    is_superuser === "true" ||
    cookieSuperUser === "true" ||
    userRole === "super_admin" ||
    profile?.role?.toLowerCase() === "super_admin";

  // Click outside to close profile popup
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Profile Info
  useEffect(() => {
    setLoadingProfile(true);
    UserServices.getProfile()
      .then((res: any) => {
        const profileData = res?.data || res;
        setProfile(profileData);

        if (profileData?.role) {
          const normalizedRole = String(profileData.role).trim().toLowerCase();
          setUserRole(normalizedRole);

          if (normalizedRole === "super_admin") {
            Cookies.set("is_superuser", "true", { path: "/" });
          }
        }
      })
      .catch((err) => console.error("Failed to load profile in sidebar", err))
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleLogout = () => {
    Cookies.remove("adminToken", { path: "/" });
    Cookies.remove("is_superuser", { path: "/" });
    Cookies.remove("username", { path: "/" });
    Cookies.remove("token", { path: "/" });
    Cookies.remove("access_token", { path: "/" });
    window.location.href = "/login";
  };

  const formatJoinedDate = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Menu selection logic based on Role
  const menuGroups = isSuperUser ? SUPERADMIN_MENU_GROUPS : WORKER_MENU_GROUPS;

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  useEffect(() => {
    menuGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (sub) =>
              pathname === sub.href || pathname.startsWith(sub.href + "/")
          );
          if (hasActiveChild) {
            setOpenSubmenus((prev) => ({ ...prev, [item.labelKey]: true }));
          }
        }
      });
    });
  }, [pathname, menuGroups]);

  const toggleSubmenu = (labelKey: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [labelKey]: !prev[labelKey] }));
  };

  const isDarkSidebar = menuColor !== "light" || sidebarStyle !== "white";

  const getSidebarClass = () => {
    if (menuColor === "dark")
      return "bg-[#06b6d4] text-cyan-50 border-r border-cyan-900/30";
    if (menuColor === "brand") return "text-white";
    if (sidebarStyle === "white")
      return "bg-white text-slate-700 border-r border-gray-200";
    if (sidebarStyle === "light")
      return "bg-[#06b6d4] text-cyan-50 border-r border-cyan-900/30";
    if (sidebarStyle === "dark") return "bg-slate-950 text-slate-300";
    return "text-white";
  };

  const getSidebarInlineStyle = (): React.CSSProperties => {
    if (menuColor === "brand") return { backgroundColor: activeColor };
    if (menuColor !== "light") return {};
    return sidebarStyle === "theme" ? { backgroundColor: activeColor } : {};
  };

  const getSidebarWidth = () => {
    if (!sidebarOpen || sidebarSize === "condensed") return "md:w-[58px]";
    if (sidebarSize === "hover") return "md:w-[58px]";
    if (sidebarSize === "compact") return "md:w-[160px]";
    if (sidebarSize === "full") return "md:w-[280px]";
    if (sidebarSize === "fullscreen") return "md:w-screen";
    return "md:w-[220px]";
  };

  const showLabels =
    sidebarOpen && sidebarSize !== "condensed" && sidebarSize !== "hover";

  const scrollbarStyle: React.CSSProperties = {
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.15) transparent",
  };

  const homeHref = isSuperUser ? "/" : "/admin-dashboard";

  const handleItemClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

const LogoDisplay = ({
  hoverMode = false,
  isMobile = false,
}: {
  hoverMode?: boolean;
  isMobile?: boolean;
}) => {
  const isCollapsed = !isMobile && !showLabels && !hoverMode;
  // Size 
  const sizeClass = isCollapsed ? "w-10 h-10" : "w-14 h-14 md:w-16 md:h-16";

  if (orgLoading) {
    return <div className={`${sizeClass} rounded-full bg-white/20 animate-pulse`} />;
  }

  const rawLogo = organization?.logo || organization?.image;
  const displayLogo = rawLogo
    ? rawLogo.startsWith("http")
      ? rawLogo
      : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${
          rawLogo.startsWith("/") ? "" : "/"
        }${rawLogo}`
    : "/logo.png";

  return (
    <Link href={homeHref} className="block shrink-0">
      <div
        className={`${sizeClass} rounded-full bg-white shadow-sm ring-1 ring-black/10 overflow-hidden flex items-center justify-center p-2 transition-all`}
      >
        <Image
          src={displayLogo}
          alt={organization?.company_name || "Logo"}
          width={120}
          height={120}
          className="max-w-full max-h-full w-auto h-auto object-contain"
          priority
          unoptimized
        />
      </div>
    </Link>
  );
};

  const renderItem = (item: MenuItem, hoverMode = false, isMobile = false) => {
    const label = item.labelKey;
    const isActive = item.href
      ? item.href === homeHref
        ? pathname === homeHref
        : pathname === item.href || pathname.startsWith(item.href + "/")
      : false;
    const hasChildren = !!item.children?.length;
    const isSubOpen = openSubmenus[item.labelKey] ?? false;
    const labelsOn = isMobile ? true : hoverMode ? true : showLabels;

    if (hasChildren) {
      return (
        <div key={item.labelKey}>
          <div
            onClick={() => toggleSubmenu(item.labelKey)}
            className={`flex items-center justify-between px-2 py-1.5 cursor-pointer transition-colors mx-3 rounded my-0.5 ${
              isActive
                ? "bg-white/20 text-white font-semibold"
                : isDarkSidebar
                  ? "text-slate-100 hover:text-white hover:bg-white/10"
                  : "text-slate-400 hover:text-slate-800 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <item.icon
                size={16}
                className={`shrink-0 ${
                  isActive ? "text-white" : "text-slate-100"
                }`}
              />
              {labelsOn && (
                <span
                  className={`text-sm truncate ${
                    isActive ? "font-semibold text-white" : ""
                  }`}
                >
                  {label}
                </span>
              )}
            </div>
            {labelsOn && (
              <span className="shrink-0">
                {isSubOpen ? (
                  <ChevronDown size={13} className="text-slate-100" />
                ) : (
                  <ChevronRight size={13} className="text-slate-100" />
                )}
              </span>
            )}
          </div>

          {isSubOpen && labelsOn && (
            <div className="ml-4 mt-0.5 mb-1 flex flex-col gap-0.5">
              {item.children!.map((sub) => {
                const subLabel = sub.labelKey;
                const isSubActive =
                  pathname === sub.href || pathname.startsWith(sub.href + "/");
                const SubIcon = sub.icon ?? Circle;
                return (
                  <Link
                    href={sub.href}
                    key={sub.labelKey}
                    onClick={handleItemClick}
                  >
                    <div
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors mx-1 ${
                        isSubActive
                          ? "bg-white/20 text-white font-semibold"
                          : isDarkSidebar
                            ? "text-slate-100 hover:text-white hover:bg-white/10"
                            : "text-slate-700 hover:text-slate-800 hover:bg-gray-100"
                      }`}
                    >
                      <SubIcon
                        size={13}
                        className={`shrink-0 ${
                          isSubActive ? "text-white" : "text-slate-100"
                        }`}
                      />
                      <span className="truncate">{subLabel}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href || "#"}
        key={item.labelKey}
        onClick={handleItemClick}
      >
        <div
          className={`flex items-center gap-3 px-2 py-1.5 cursor-pointer transition-colors mx-3 rounded my-0.5 ${
            isActive
              ? "bg-white/20 text-white font-semibold"
              : isDarkSidebar
                ? "text-slate-100 hover:text-white hover:bg-white/10"
                : "text-slate-700 hover:text-slate-800 hover:bg-gray-100"
          }`}
        >
          <span className="relative shrink-0">
            <item.icon
              size={16}
              className={isActive ? "text-white" : "text-slate-100"}
            />
          </span>
          {labelsOn && (
            <span
              className={`text-sm truncate flex-1 ${
                isActive ? "font-semibold text-white" : ""
              }`}
            >
              {label}
            </span>
          )}
        </div>
      </Link>
    );
  };

  const renderGroupedNav = (isMobile = false) =>
    menuGroups.map((group, gi) => (
      <div key={group.groupKey}>
        <div className={`${gi === 0 ? "mt-1" : "mt-3"} mb-1`}>
          {isMobile || showLabels ? (
            <p className="px-5 text-[10px] font-bold uppercase tracking-widest select-none text-black/80 dark:text-white/80">
              {GROUP_LABELS[group.groupKey] ?? group.label ?? group.groupKey}
            </p>
          ) : (
            gi > 0 && <div className="mx-4 border-t border-white/10" />
          )}
        </div>
        {group.items.map((item) => renderItem(item, false, isMobile))}
      </div>
    ));

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      <aside
        className={[
          "h-screen shrink-0 flex flex-col transition-all duration-300 z-50",
          getSidebarClass(),
          "fixed inset-y-0 left-0 w-[240px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:static md:z-40",
          getSidebarWidth(),
          layoutMode === "detached"
            ? "md:rounded-xl md:mt-15 md:mb-2 md:ml-0"
            : "",
          sidebarSize === "hover" ? "group relative" : "",
          sidebarSize === "fullscreen" ? "md:absolute md:inset-0 md:z-50" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={getSidebarInlineStyle()}
      >
        {sidebarSize === "hover" && (
          <div
            className={`absolute left-full top-0 h-full w-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 hidden md:flex flex-col ${getSidebarClass()} shadow-xl`}
            style={getSidebarInlineStyle()}
          >
            <div
              className={`shrink-0 h-14 flex items-center px-4 gap-3 border-b ${
                isDarkSidebar ? "border-white/10" : "border-gray-100"
              }`}
            >
              <LogoDisplay hoverMode />
              <span className="text-sm font-bold text-white tracking-wide truncate">
                {organization?.company_name ?? "Dashboard"}
              </span>
            </div>
            <nav
              className="flex-1 min-h-0 py-3 overflow-y-auto overflow-x-hidden"
              style={scrollbarStyle}
            >
              {menuGroups.map((group, gi) => (
                <div key={group.groupKey}>
                  <div className={`${gi === 0 ? "mt-1" : "mt-3"} mb-1`}>
                    <p className="px-5 text-[10px] font-semibold uppercase tracking-widest text-slate-800 select-none">
                      {GROUP_LABELS[group.groupKey] ??
                        group.label ??
                        group.groupKey}
                    </p>
                  </div>
                  {group.items.map((item) => renderItem(item, true))}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Header Area */}
        <div
          className={`shrink-0 p-2 flex items-center justify-between md:justify-center border-b ${
            isDarkSidebar ? "border-white/10" : "border-gray-100"
          }`}
        >
          <div className="flex justify-center items-center w-full min-h-10">
            <div className="hidden md:block">
              <LogoDisplay />
            </div>
            <div className="md:hidden">
              <LogoDisplay isMobile />
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/80 hover:text-white p-1"
          >
            <X size={20} />
          </button>

          {sidebarSize === "fullscreen" && (
            <button
              onClick={() => setSidebarSize("default")}
              className="hidden md:block absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Area */}
        <nav
          className="flex-1 min-h-0 pb-4 overflow-y-auto overflow-x-hidden"
          style={scrollbarStyle}
        >
          <div className="hidden md:block">{renderGroupedNav(false)}</div>
          <div className="md:hidden">{renderGroupedNav(true)}</div>
        </nav>

        {/* ── FOOTER PROFILE SECTION ── */}
        <div
          className="shrink-0 border-t border-white/20 p-2 relative"
          ref={profileRef}
        >
          <div className="w-full flex items-center justify-between gap-1 p-1">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex-1 flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-white/10 text-left text-white cursor-pointer min-w-0 overflow-hidden"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border border-gray-100 shrink-0 uppercase"
                style={{ backgroundColor: activeColor || "#0284c7" }}
              >
                {profile?.username
                  ? profile.username.slice(0, 2).toUpperCase()
                  : <UserIcon size={15} />}
              </div>

              {showLabels && (
                <div className="flex-1 min-w-0 pr-1">
                  <p
                    className="text-sm font-semibold capitalize leading-tight break-words line-clamp-2"
                    title={profile?.username || Cookies.get("username") || "User"}
                  >
                    {profile?.username || Cookies.get("username") || "User"}
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* Profile Popover / Dropdown Menu */}
          {profileOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-[calc(100vw-32px)] max-w-[250px] md:bottom-0 md:left-full md:ml-3 md:w-80 bg-white text-slate-700 ml-4 border border-gray-200 rounded-lg shadow-2xl overflow-hidden z-[9999]">
              <div className="p-3 bg-slate-50 border-b border-gray-200 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0 uppercase"
                  style={{ backgroundColor: activeColor || "#0284c7" }}
                >
                  {profile?.username
                    ? profile.username.slice(0, 2).toUpperCase()
                    : <UserIcon size={18} />}
                </div>
                <div className="overflow-hidden flex-1">
                  <h4 className="font-bold text-xs text-slate-800 truncate capitalize">
                    {profile?.username || Cookies.get("username") || "Loading..."}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">
                    Role: <b className="uppercase">{profile?.role || "Worker"}</b>
                  </p>
                </div>
              </div>

              {loadingProfile ? (
                <div className="p-5 flex justify-center items-center text-xs text-gray-400 gap-2">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  Fetching details...
                </div>
              ) : (
                <div className="p-3 max-h-[260px] overflow-y-auto space-y-2 text-xs">
                  {profile?.email && (
                    <div className="flex items-center gap-2 px-1 text-slate-600">
                      <Mail size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-2 px-1 text-slate-600">
                      <Phone size={13} className="text-gray-400 shrink-0" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.created_at && (
                    <div className="flex items-center gap-2 px-1 text-slate-600">
                      <Calendar size={13} className="text-gray-400 shrink-0" />
                      <span>Joined: {formatJoinedDate(profile.created_at)}</span>
                    </div>
                  )}

                  <hr className="border-gray-100 my-1" />

                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100 text-[11px] flex items-center gap-1">
                    <Shield size={12} className="text-indigo-500" />
                    <span>
                      Role: <b className="uppercase">{profile?.role || "worker"}</b>
                    </span>
                  </div>
                </div>
              )}

              <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors w-full justify-center border border-transparent hover:border-red-100"
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}