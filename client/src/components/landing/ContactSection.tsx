"use client";

import { useEffect, useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
 
  X,
  Send
} from "lucide-react";
import { ContactServices, ContactPayload } from "@/services/contactServices";
import { OrganizationServices } from "@/services/organizationServices";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter,  } from "react-icons/fa";

interface OrganizationData {
  company_name?: string;
  address?: string;
  primary_email?: string;
  secondary_email?: string;
  primary_phone?: string;
  secondary_phone?: string;
  location_map_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
}

export default function ContactSection() {
  const [org, setOrg] = useState<OrganizationData | null>(null);
  const [orgLoading, setOrgLoading] = useState(true);

  // Modal State for Chat Selection
  const [showChatModal, setShowChatModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    privacyAgree: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchOrgDetails() {
      try {
        setOrgLoading(true);
        const res = await OrganizationServices.getDetails();
        const dataList = res?.data || res;
        if (Array.isArray(dataList) && dataList.length > 0) {
          setOrg(dataList[0]);
        } else if (dataList && typeof dataList === "object") {
          setOrg(dataList);
        }
      } catch (err) {
        console.error("Failed to fetch organization details:", err);
      } finally {
        setOrgLoading(false);
      }
    }
    fetchOrgDetails();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAgree) {
      setErrorMsg("Please accept the privacy policy to proceed.");
      return;
    }

    setFormLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const payload: ContactPayload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const res = await ContactServices.create(payload);
      setSuccessMsg(res?.response || "Your message has been sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        privacyAgree: false,
      });
    } catch (err: any) {
      const parsedError = ContactServices.parseError(err);
      setErrorMsg(parsedError);
    } finally {
      setFormLoading(false);
    }
  };

  const formatWhatsAppUrl = (phone?: string) => {
    if (!phone) return "#";
    const cleanNum = phone.replace(/[^0-9]/g, "");
    const formattedNum = cleanNum.length === 10 ? `977${cleanNum}` : cleanNum;
    return `https://wa.me/${formattedNum}`;
  };

  return (
    <section id="contact" className="w-full py-16 sm:py-24 text-slate-800 font-sans relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Header Title */}
        <div className="mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#1c3551] bg-[#1c3551]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Contact Us
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c3551] capitalize">
            Connect to {org?.company_name || "Om Construction"}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            We'd love to hear from you. Please fill out this form or shoot us an email.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Details & Social Links */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
              
              {/* Email Card */}
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-[#1c3551] mb-4 bg-white shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1c3551]">Email</h3>
                <p className="mt-1 text-sm text-slate-600">Our team is here to help.</p>
                <div className="mt-3 flex flex-col space-y-1">
                  {org?.primary_email && (
                    <a
                      href={`mailto:${org.primary_email}`}
                      className="text-sm font-bold text-[#1c3551] hover:underline break-all"
                    >
                      {org.primary_email} <span className="text-xs font-normal text-slate-500"></span>
                    </a>
                  )}
                  {org?.secondary_email && (
                    <a
                      href={`mailto:${org.secondary_email}`}
                      className="text-sm font-bold text-[#1c3551] hover:underline break-all"
                    >
                      {org.secondary_email} <span className="text-xs font-normal text-slate-500"></span>
                    </a>
                  )}
                </div>
              </div>

              {/* Live Chat Card */}
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-[#1c3551] mb-4 bg-white shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1c3551]">Live chat</h3>
                <p className="mt-1 text-sm text-slate-600">Chat directly with us via WhatsApp.</p>
                <button
                  type="button"
                  onClick={() => setShowChatModal(true)}
                  className="mt-3 inline-block text-sm font-bold text-[#1c3551] hover:underline cursor-pointer text-left"
                >
                  Start new chat
                </button>
              </div>

              {/* Office Address Card */}
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-[#1c3551] mb-4 bg-white shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1c3551]">Office</h3>
                <p className="mt-1 text-sm text-slate-600">Come say hello at our office HQ.</p>
                <p className="mt-3 text-sm font-bold text-[#1c3551] leading-snug">
                  {org?.address || "Mourighat"}
                </p>
              </div>

              {/* Phone Card */}
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-[#1c3551] mb-4 bg-white shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1c3551]">Phone</h3>
                <p className="mt-1 text-sm text-slate-600">Sun-Fri from 9am to 6pm.</p>
                <div className="mt-3 flex flex-col space-y-1">
                  {org?.primary_phone && (
                    <a
                      href={`tel:${org.primary_phone}`}
                      className="text-sm font-bold text-[#1c3551] hover:underline"
                    >
                      {org.primary_phone} <span className="text-xs font-normal text-slate-500"></span>
                    </a>
                  )}
                  {org?.secondary_phone && (
                    <a
                      href={`tel:${org.secondary_phone}`}
                      className="text-sm font-bold text-[#1c3551] hover:underline"
                    >
                      {org.secondary_phone} <span className="text-xs font-normal text-slate-500"></span>
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Social Media Links Section */}
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                Connect With Us
              </h4>
              <div className="flex items-center gap-3">
                {org?.facebook_url && (
                  <a
                    href={org.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#1c3551] hover:border-[#1c3551] transition shadow-2xs"
                    title="Facebook"
                  >
                    <FaFacebook className="w-5 h-5" />
                  </a>
                )}
                {org?.twitter_url && (
                  <a
                    href={org.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#1c3551] hover:border-[#1c3551] transition shadow-2xs"
                    title="Twitter"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                )}
                {org?.instagram_url && (
                  <a
                    href={org.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#1c3551] hover:border-[#1c3551] transition shadow-2xs"
                    title="Instagram"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                )}
                {org?.linkedin_url && (
                  <a
                    href={org.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#1c3551] hover:border-[#1c3551] transition shadow-2xs"
                    title="LinkedIn"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 lg:p-10 rounded-2xl border border-slate-200/80 shadow-md">
            
            {successMsg && (
              <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1c3551] focus:ring-2 focus:ring-[#1c3551]/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1c3551] focus:ring-2 focus:ring-[#1c3551]/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1c3551] focus:ring-2 focus:ring-[#1c3551]/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Leave us a message..."
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1c3551] focus:ring-2 focus:ring-[#1c3551]/20 transition resize-none"
                />
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="privacyAgree"
                  name="privacyAgree"
                  checked={formData.privacyAgree}
                  onChange={handleChange}
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1c3551] focus:ring-[#1c3551] cursor-pointer"
                />
                <label htmlFor="privacyAgree" className="text-sm text-slate-600 cursor-pointer">
                  You agree to our friendly{" "}
                  <a href="/privacy-policy" className="underline font-semibold text-slate-800 hover:text-[#1c3551]">
                    privacy policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3.5 px-6 bg-[#1c3551] hover:bg-[#15283c] text-white font-bold text-sm rounded-xl shadow-md transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Dynamic Google Map Section */}
        {org?.location_map_url && (
          <div className="mt-16 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-200 min-h-[350px]">
            <iframe
              src={org.location_map_url}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Organization Location Map"
              className="w-full h-full"
            />
          </div>
        )}

      </div>

      {/* Select WhatsApp Number Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowChatModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#1c3551] mb-1">Select WhatsApp Chat</h3>
            <p className="text-xs text-slate-500 mb-5">Which number would you like to message?</p>

            <div className="space-y-3">
              {org?.primary_phone && (
                <a
                  href={formatWhatsAppUrl(org.primary_phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowChatModal(false)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-[#1c3551] hover:bg-slate-50 transition group"
                >
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase">Primary Number</span>
                    <span className="text-sm font-bold text-slate-800">{org.primary_phone}</span>
                  </div>
                  <Send className="w-4 h-4 text-slate-400 group-hover:text-[#1c3551]" />
                </a>
              )}

              {org?.secondary_phone && (
                <a
                  href={formatWhatsAppUrl(org.secondary_phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowChatModal(false)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-[#1c3551] hover:bg-slate-50 transition group"
                >
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase">Secondary Number</span>
                    <span className="text-sm font-bold text-slate-800">{org.secondary_phone}</span>
                  </div>
                  <Send className="w-4 h-4 text-slate-400 group-hover:text-[#1c3551]" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}