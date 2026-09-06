"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ServiceService, type ServiceItem } from "@/services/servicesServices";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await ServiceService.getDetails();
        const list: ServiceItem[] = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        // Find service matching title slug
        const matched = list.find((s) => slugify(s.title) === slug);

        if (matched) {
          setService(matched);
        } else {
          setError("Service not found.");
        }
      } catch (err: any) {
        setError(ServiceService.parseError(err) || "Failed to load service detail.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fd6102]" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Service Not Found</h2>
        <p className="text-slate-600 mb-6">{error || "The requested service could not be found."}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-[#173457] text-white font-semibold rounded hover:bg-slate-800 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12">
      <style>{`
        .ck-content { font-family: system-ui, sans-serif; color: #334155; line-height: 1.8; }
        .ck-content p { margin-bottom: 1.25rem; font-size: 1rem; }
        .ck-content h1, .ck-content h2, .ck-content h3 { font-weight: 700; color: #173457; margin: 1.25rem 0 0.5rem; }
        .ck-content ul { list-style: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .ck-content ol { list-style: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .ck-content strong { color: #173457; }
      `}</style>

      {/* Main Container - No background, no wrapper border */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Image (Only Image gets Border & Shadow) */}
          <div className="lg:col-span-5 w-full">
            {service.image ? (
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[450px] rounded overflow-hidden bg-slate-100 border border-slate-200/90 shadow-sm sticky top-8">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-[320px] sm:h-[400px] rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Content (Clean Text Section) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-[#fd6102] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-medium line-clamp-1">{service.title}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173457] tracking-tight leading-tight">
              {service.title}
            </h1>

            <div className="w-16 h-1 bg-[#fd6102] rounded-full" />

            {/* Description */}
            <div
              className="ck-content pt-2"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          </div>

        </div>
      </div>
    </main>
  );
}