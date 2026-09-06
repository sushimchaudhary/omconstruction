"use client";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Inbox,
  LucideImage,
  MapPin,
  Mail,
  Phone,
  Hash,
  ExternalLink,
  Globe,
  Clock,
  Calendar,
  Plus,
 
} from "lucide-react";
import { toast } from "sonner";
import { OrganizationServices } from "@/services/organizationServices";
import ConfirmModal from "@/components/delete/confirmModel";
import { Image as AntImage, Skeleton } from "antd";
import { ThemedButton } from "@/components/ui/themedButton";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsLinkedin } from "react-icons/bs";

// Custom Icon Component for X (formerly Twitter)
const XIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function OrganizationCards({
  onEdit,
  onAdd,
  refreshTrigger,
}: {
  onEdit: (data: any) => void;
  onAdd: () => void;
  refreshTrigger: number;
}) {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await OrganizationServices.getDetails();
      const list = Array.isArray(res) ? res : res?.data || res?.results || [];
      setDataList(list);
    } catch {
      toast.error("Failed to load organization details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await OrganizationServices.deleteDetails(deleteId);
      toast.success("Organization deleted successfully");
      OrganizationServices.clearCache?.();
      fetchData();
      setIsDeleteModalOpen(false);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="w-full flex-1">
      {/* Skeleton Loading State */}
      {loading ? (
        <div className="w-full space-y-4">
          <div className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex gap-3 items-center">
              <Skeleton.Avatar active size="large" shape="square" />
              <div className="flex-1">
                <Skeleton.Input active size="small" block />
              </div>
            </div>
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        </div>
      ) : dataList.length === 0 ? (
        /* Empty State (Data = 0: Show Add Button) */
        <div className="w-full bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="flex flex-col items-center justify-center gap-3">
            <Inbox size={40} className="text-gray-300" />
            <p className="text-sm font-semibold text-[#364a63]">
              No organization added yet.
            </p>
            <ThemedButton onClick={onAdd} size="sm" className="px-5 py-2 flex items-center gap-1.5">
              <Plus size={16} /> Add Details
            </ThemedButton>
          </div>
        </div>
      ) : (
        /* Cards Container */
        <div className="w-full flex flex-col gap-5 mt-5">
          {dataList.map((item) => {
            const logoUrl = getImageUrl(item.logo || item.logo_url);
            const hasSocial =
              item.facebook_url || item.twitter_url || item.instagram_url || item.linkedin_url;

            return (
              <div
                key={item.id}
                className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Header & Main Content */}
                <div className="p-5 space-y-4 w-full">
                  {/* Top Branding Bar */}
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 w-full">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                        {logoUrl ? (
                          <AntImage
                            src={logoUrl}
                            alt={item.company_name}
                            className="w-full h-full object-cover"
                            wrapperStyle={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <LucideImage size={20} className="text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-[#364a63] truncate">
                          {item.company_name || "-"}
                        </h3>
                        <p className="text-xs text-gray-400 italic truncate">
                          {item.tagline || "No tagline set"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEdit(item)}
                        title="Edit"
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg active:scale-90 transition-all"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete"
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg active:scale-90 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Primary Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#526484] w-full">
                    <div className="flex items-center gap-2 bg-gray-50/70 p-3 rounded-md border border-gray-100 w-full">
                      <Hash size={14} className="text-gray-400 shrink-0" />
                      <span className="font-semibold text-[#364a63]">PAN/VAT:</span>
                      <span className="truncate flex-1">{item.pan_vat_number || "-"}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50/70 p-3 rounded-md border border-gray-100 w-full">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span className="font-semibold text-[#364a63]">Address:</span>
                      <span className="truncate flex-1">{item.address || "-"}</span>
                    </div>

                    <div className="bg-gray-50/70 p-3 rounded-md border border-gray-100 space-y-1 w-full">
                      <div className="flex items-center gap-2 truncate w-full">
                        <Mail size={14} className="text-gray-400 shrink-0" />
                        <span className="font-semibold text-[#364a63]">Primary Email:</span>
                        <span className="truncate flex-1">{item.primary_email || "-"}</span>
                      </div>
                      {item.secondary_email && (
                        <div className="flex items-center gap-2 truncate pl-6 text-[11px] text-gray-500 w-full">
                          <span className="truncate">Secondary: {item.secondary_email}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50/70 p-3 rounded-md border border-gray-100 space-y-1 w-full">
                      <div className="flex items-center gap-2 truncate w-full">
                        <Phone size={14} className="text-gray-400 shrink-0" />
                        <span className="font-semibold text-[#364a63]">Primary Phone:</span>
                        <span className="truncate flex-1">{item.primary_phone || "-"}</span>
                      </div>
                      {item.secondary_phone && (
                        <div className="flex items-center gap-2 truncate pl-6 text-[11px] text-gray-500 w-full">
                          <span className="truncate">Secondary: {item.secondary_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Media Links with Brand Icons */}
                  {hasSocial && (
                    <div className="pt-1 w-full">
                      <span className="text-[10px] font-bold text-[#8094ae] uppercase mb-1.5 flex items-center gap-1">
                        <Globe size={11} /> Social Media
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs w-full">
                        {item.facebook_url && (
                          <a
                            href={item.facebook_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:bg-blue-100 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded text-[11px] font-medium transition-colors"
                          >
                            <FaFacebook size={12} /> Facebook <ExternalLink size={10} className="opacity-60" />
                          </a>
                        )}
                        {item.twitter_url && (
                          <a
                            href={item.twitter_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-900 hover:bg-gray-200 flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded text-[11px] font-medium transition-colors"
                          >
                            <XIcon className="w-3 h-3 text-black" /> Twitter <ExternalLink size={10} className="opacity-60" />
                          </a>
                        )}
                        {item.instagram_url && (
                          <a
                            href={item.instagram_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-pink-600 hover:bg-pink-100 flex items-center gap-1.5 bg-pink-50 px-3 py-1 rounded text-[11px] font-medium transition-colors"
                          >
                            <BsInstagram size={12} /> Instagram <ExternalLink size={10} className="opacity-60" />
                          </a>
                        )}
                        {item.linkedin_url && (
                          <a
                            href={item.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded text-[11px] font-medium transition-colors"
                          >
                            <BsLinkedin size={12} /> LinkedIn <ExternalLink size={10} className="opacity-60" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Map Preview */}
                  {item.location_map_url && (
                    <div className="pt-1 w-full">
                      <span className="text-[10px] font-bold text-[#8094ae] uppercase mb-1.5 flex items-center gap-1">
                        <MapPin size={11} /> Location Map
                      </span>
                      <div className="rounded-lg border overflow-hidden w-full">
                        <iframe
                          src={item.location_map_url}
                          width="100%"
                          height="160"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="bg-[#f5f6fa] px-5 py-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#8094ae] w-full">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {item.created_at
                      ? `Created: ${new Date(item.created_at).toLocaleDateString()}`
                      : "-"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {item.updated_at
                      ? `Updated: ${new Date(item.updated_at).toLocaleDateString()}`
                      : "-"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Organization?"
        message="Are you sure you want to delete this organization record?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
        loading={deleteLoading}
      />
    </div>
  );
}