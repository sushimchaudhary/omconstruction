"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const orgName = orgData?.name || orgData?.title || "RMS Logo";

  // Smooth Scroll Handler With Offset Calculation
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id.startsWith("#")) {
      e.preventDefault();
      setOpen(false);
      const element = document.querySelector(id);
      if (element) {
        const navHeight = 80; // Nav Height
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "border-slate-200/80 shadow-[0_1px_0_0_rgba(28,53,81,0.05),0_8px_24px_-16px_rgba(28,53,81,0.2)]"
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
          <a
            href="/services"
            className="text-[#1c3551] hover:text-[#f96400] transition-colors whitespace-nowrap"
          >
            Services
          </a>
          <a
            href="/projects"
            className="text-[#1c3551] hover:text-[#f96400] transition-colors whitespace-nowrap"
          >
            Projects
          </a>
          <a
            href="/about"
            className="text-[#1c3551] hover:text-[#f96400] transition-colors whitespace-nowrap"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="text-[#1c3551] hover:text-[#f96400] transition-colors whitespace-nowrap"
          >
            Contact
          </a>
          <a
            href="/get-started"
            className="text-[#1c3551] hover:text-[#f96400] transition-colors whitespace-nowrap"
          >
            Get Started
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="flex items-center gap-2 p-2 rounded-full bg-[#f96400] text-white text-sm font-semibold shadow-md shadow-[#1c3551]/20 hover:opacity-95 active:scale-95 transition-all"
          >
            <LogIn className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile & iPad Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/login"
            aria-label="Login"
            className="p-2 rounded-full bg-[#f96400] text-white shadow-md shadow-[#1c3551]/20 active:scale-95 transition-transform"
          >
            <LogIn className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="text-[#1c3551] p-2 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f96400] rounded-lg transition-colors"
          >
            {open ? <X className="h-6 w-6 text-[#f96400]" /> : <Menu className="h-6 w-6" />}
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
              <a
                href="/services"
                className="text-[#1c3551] hover:text-[#f96400] transition-colors py-1"
              >
                Services
              </a>
              <a
                href="/projects"
                className="text-[#1c3551] hover:text-[#f96400] transition-colors py-1"
              >
                Projects
              </a>
              <a
                href="/about"
                className="text-[#1c3551] hover:text-[#f96400] transition-colors py-1"
              >
                About Us
              </a>
              <a
                href="/contact"
                className="text-[#1c3551] hover:text-[#f96400] transition-colors py-1"
              >
                Contact
              </a>
              <a
                href="/get-started"
                className="text-[#1c3551] hover:text-[#f96400] transition-colors py-1"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}