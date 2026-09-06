"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { OrganizationServices } from "@/services/organizationServices";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function Footer() {
  const [orgData, setOrgData] = useState<any>(null);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const res = await OrganizationServices.getDetails();
        const data = Array.isArray(res) ? res[0] : res?.data?.[0] || res?.data || res;
        setOrgData(data);
      } catch (err) {
        console.error("Failed to load organization data for footer", err);
      }
    };
    fetchOrgData();
  }, []);

  const logoUrl = getImageUrl(orgData?.logo || orgData?.image) || "/logo.png";
  const companyName = orgData?.company_name || "Company Name";
  const address = orgData?.address || "";

  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-5 md:px-10 flex flex-col gap-8">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          
          {/* Col 1: Brand Info & Socials */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src={logoUrl}
                alt={companyName}
                width={200}
                height={80}
                className="h-12 w-auto object-contain"
                priority
                unoptimized={logoUrl.startsWith("http")}
              />
            </Link>
            <p className="text-[#1c3551] font-bold text-sm">{companyName}</p>
            {orgData?.tagline && (
              <p className="text-slate-400 italic text-[11px]">{orgData.tagline}</p>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {orgData?.facebook_url && (
                <a
                  href={orgData.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1c3551] hover:text-[#f96400] transition-colors"
                >
                  <FaFacebook size={16} />
                </a>
              )}
              {orgData?.instagram_url && (
                <a
                  href={orgData.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1c3551] hover:text-[#f96400] transition-colors"
                >
                  <FaInstagram size={16} />
                </a>
              )}
              {orgData?.twitter_url && (
                <a
                  href={orgData.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1c3551] hover:text-[#f96400] transition-colors"
                >
                  <FaTwitter size={16} />
                </a>
              )}
              {orgData?.linkedin_url && (
                <a
                  href={orgData.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1c3551] hover:text-[#f96400] transition-colors"
                >
                  <FaLinkedin size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c3551]">Quick Links</h4>
            <ul className="space-y-2 font-medium text-slate-600">
              <li><a href="#services" className="hover:text-[#f96400] transition-colors">Services</a></li>
              <li><a href="#projects" className="hover:text-[#f96400] transition-colors">Projects</a></li>
              <li><a href="#about" className="hover:text-[#f96400] transition-colors">About Us</a></li>
              <li><a href="#team" className="hover:text-[#f96400] transition-colors">Team</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c3551]">Support & Legal</h4>
            <ul className="space-y-2 font-medium text-slate-600">
              <li><Link href="/support-teams" className="hover:text-[#f96400] transition-colors">Support Center</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#f96400] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-[#f96400] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 4: Dynamic Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c3551]">Contact Us</h4>
            <div className="space-y-2.5 font-medium text-slate-600">
              {/* Address */}
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#f96400] shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}

              {/* Emails */}
              {(orgData?.primary_email || orgData?.secondary_email) && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-[#f96400] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    {orgData?.primary_email && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${orgData.primary_email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#f96400] transition-colors break-all"
                      >
                        {orgData.primary_email}
                      </a>
                    )}
                    {orgData?.secondary_email &&
                      orgData.secondary_email !== orgData.primary_email && (
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${orgData.secondary_email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#f96400] transition-colors break-all text-[11px] text-slate-400"
                        >
                          {orgData.secondary_email} (Alt)
                        </a>
                      )}
                  </div>
                </div>
              )}

              {/* Phone Numbers */}
              {(orgData?.primary_phone || orgData?.secondary_phone) && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-[#f96400] shrink-0 mt-0.5" />
                  <div className="flex flex-wrap items-center gap-1">
                    {orgData?.primary_phone && (
                      <a
                        href={`tel:${orgData.primary_phone}`}
                        className="hover:text-[#f96400] transition-colors"
                      >
                        {orgData.primary_phone}
                      </a>
                    )}
                    {orgData?.secondary_phone && (
                      <>
                        <span className="text-slate-300">/</span>
                        <a
                          href={`tel:${orgData.secondary_phone}`}
                          className="hover:text-[#f96400] transition-colors"
                        >
                          {orgData.secondary_phone}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* PAN / VAT */}
              {orgData?.pan_vat_number && (
                <p className="text-[11px] text-slate-400 pt-1">
                  PAN/VAT: <span className="font-semibold text-slate-500">{orgData.pan_vat_number}</span>
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Developer Credit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://sushimchaudhary.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1c3551] hover:text-[#f96400] transition-colors underline underline-offset-2"
            >
              sushim dev
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}