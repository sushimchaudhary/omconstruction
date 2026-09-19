"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";
import Image from "next/image";
import { OrganizationServices } from "@/services/organizationServices";

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function Nav({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [orgData, setOrgData] = useState<any>(null);
  
  // Current URL path पत्ता लगाउन
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const res = await OrganizationServices.getDetails();
        const data = Array.isArray(res)
          ? res[0]
          : res?.data?.[0] || res?.data || res;
        setOrgData(data);
      } catch (err) {
        console.error("Failed to load organization logo", err);
      }
    };
    fetchOrgData();
  }, []);

  const logoUrl = getImageUrl(orgData?.logo || orgData?.image) || "/logo.png";
  const orgName = orgData?.name || orgData?.title || "Om Construction Logo";

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/get-started", label: "Get Started" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "border-slate-200/80 shadow-[0_1px_0_0_rgba(21,48,82,0.05),0_8px_24px_-16px_rgba(21,48,82,0.2)]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center overflow-visible">
          <Image
            src={logoUrl}
            alt={orgName}
            width={400}
            height={200}
            quality={100}
            className="h-16 md:h-20 w-auto object-contain max-w-[200px]"
            priority
            unoptimized={logoUrl.startsWith("http")}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex font-medium text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#FD6102] font-semibold"
                    : "text-[#153052] hover:text-[#FD6102]"
                }`}
              >
                {link.label}
                {/* Active Underline Effect */}
               {/* { isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#FD6102]"
                  />
                )} */}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="flex items-center gap-2 p-2.5 rounded-full bg-[#FD6102] text-white text-sm font-semibold shadow-md shadow-[#153052]/20 hover:bg-[#153052] active:scale-95 transition-all"
          >
            <LogIn className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile & iPad Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/login"
            aria-label="Login"
            className="p-2 rounded-full bg-[#FD6102] text-white shadow-md shadow-[#153052]/20 active:scale-95 transition-transform"
          >
            <LogIn className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="text-[#153052] p-2 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FD6102] rounded-lg transition-colors"
          >
            {open ? <X className="h-6 w-6 text-[#FD6102]" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-200 bg-white shadow-xl lg:hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4 font-medium text-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`py-1 transition-colors flex items-center justify-between ${
                      isActive
                        ? "text-[#FD6102] font-bold"
                        : "text-[#153052] hover:text-[#FD6102]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-[#FD6102]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}