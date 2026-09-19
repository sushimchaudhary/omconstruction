"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Image } from "antd"; // Ant Design Image Component
import { ProjectsServices } from "@/services/projectsServices"; // Adjust path if needed

export interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  client_name?: string;
  location?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  image?: string;
  images?: string[];
  attendances?: any[]; // excluded from UI display
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await ProjectsServices.getDetails();
        const list: ProjectItem[] = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        // Match slug based on title
        const matched = list.find((p) => slugify(p.title) === slug);

        if (matched) {
          setProject(matched);
          setSelectedImage(matched.image || matched.images?.[0] || "");
        } else {
          setError("Project not found.");
        }
      } catch (err: any) {
        setError(
          typeof ProjectsServices.parseError === "function"
            ? ProjectsServices.parseError(err)
            : err?.message || "Failed to load project details."
        );
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

  if (error || !project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Project Not Found</h2>
        <p className="text-slate-600 mb-6">
          {error || "The requested project could not be found."}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-[#173457] text-white font-semibold rounded hover:bg-slate-800 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const allGalleryImages = [
    ...(project.image ? [project.image] : []),
    ...(project.images || []),
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  return (
    <main className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12">
      <style>{`
        .ck-content { font-family: system-ui, sans-serif; color: #334155; line-height: 1.8; }
        .ck-content p { margin-bottom: 1.25rem; font-size: 1rem; }
        .ck-content h1, .ck-content h2, .ck-content h3 { font-weight: 700; color: #173457; margin: 1.25rem 0 0.5rem; }
        .ck-content ul { list-style: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .ck-content ol { list-style: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .ck-content strong { color: #173457; }
        .ck-content img { max-width: 100%; height: auto; border-radius: 0.375rem; margin: 1rem 0; }
        
        /* Ant Design Custom Styling to match Tailwind layout */
        .ant-image { width: 100%; height: 100%; }
        .ant-image-img { object-fit: cover !important; width: 100% !important; height: 100% !important; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Image Gallery with Ant Design Preview */}
          <div className="lg:col-span-5 w-full space-y-4 lg:sticky lg:top-8">
            <Image.PreviewGroup>
              {/* Main Featured Image Container */}
              {selectedImage ? (
                <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[420px] rounded overflow-hidden bg-slate-100 border border-slate-200/90 shadow-sm">
                  <Image
                    src={selectedImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-[320px] sm:h-[400px] rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              )}

              {/* Thumbnail Gallery */}
              {allGalleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allGalleryImages.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-16 h-16 rounded overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === imgUrl
                          ? "border-[#fd6102] scale-95"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Image.PreviewGroup>
          </div>

          {/* RIGHT SIDE: Details & Metadata */}
          <div className="lg:col-span-7 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-[#fd6102] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-[#fd6102] transition-colors">
                Projects
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-medium line-clamp-1">
                {project.title}
              </span>
            </div>

            {/* Title & Status */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173457] tracking-tight leading-tight">
                  {project.title}
                </h1>
                {project.status && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {project.status}
                  </span>
                )}
              </div>
              <div className="w-16 h-1 bg-[#fd6102] rounded-full" />
            </div>

            {/* Project Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
              {project.client_name && (
                <div>
                  <span className="block font-semibold text-slate-400 uppercase tracking-wider">
                    Client Name
                  </span>
                  <span className="text-slate-800 font-bold text-sm">
                    {project.client_name}
                  </span>
                </div>
              )}

              {project.location && (
                <div>
                  <span className="block font-semibold text-slate-400 uppercase tracking-wider">
                    Location
                  </span>
                  <span className="text-slate-800 font-bold text-sm uppercase">
                    {project.location}
                  </span>
                </div>
              )}

              {project.start_date && (
                <div>
                  <span className="block font-semibold text-slate-400 uppercase tracking-wider">
                    Start Date
                  </span>
                  <span className="text-slate-800 font-medium text-sm">
                    {formatDate(project.start_date)}
                  </span>
                </div>
              )}

              {project.end_date && (
                <div>
                  <span className="block font-semibold text-slate-400 uppercase tracking-wider">
                    End Date
                  </span>
                  <span className="text-slate-800 font-medium text-sm">
                    {formatDate(project.end_date)}
                  </span>
                </div>
              )}

              {project.created_at && (
                <div>
                  <span className="block font-semibold text-slate-400 uppercase tracking-wider">
                    Created At
                  </span>
                  <span className="text-slate-800 font-medium text-sm">
                    {formatDate(project.created_at)}
                  </span>
                </div>
              )}
            </div>

            {/* Description Section */}
            {project.description && (
              <div
                className="ck-content pt-2"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            )}
          </div>

        </div>
      </div>
    </main>
  );
}