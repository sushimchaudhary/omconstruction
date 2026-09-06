"use client";

import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Inbox,
  LucideImage,
  Clock,
  Calendar,
  Plus,
  Target,
  Eye,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { AboutService } from "@/services/aboutServices";
import ConfirmModal from "@/components/delete/confirmModel";
import { Image as AntImage, Skeleton } from "antd";
import { ThemedButton } from "@/components/ui/themedButton";

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function AboutCards({
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

  // Track expanded descriptions per item
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await AboutService.getDetails();
      const list = Array.isArray(res) ? res : res?.data || res?.results || [];
      setDataList(list);
    } catch {
      toast.error("Failed to load about details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await AboutService.deleteDetails(deleteId);
      toast.success("About record deleted successfully");
      AboutService.clearCache?.();
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
        /* Empty State */
        <div className="w-full bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="flex flex-col items-center justify-center gap-3">
            <Inbox size={40} className="text-gray-300" />
            <p className="text-sm font-semibold text-[#364a63]">
              No about details added yet.
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
            const itemId = item.id || item._id;
            const imgUrl = getImageUrl(item.image);
            const isExpanded = !!expandedItems[itemId];

            return (
              <div
                key={itemId}
                className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Header & Main Content */}
                <div className="p-5 space-y-4 w-full">
                  {/* Top Branding Bar */}
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 w-full">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                        {imgUrl ? (
                          <AntImage
                            src={imgUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            wrapperStyle={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <LucideImage size={24} className="text-gray-300" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#364a63] truncate">
                            {item.title || "-"}
                          </h3>
                          {item.years_exp > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                              <Award size={10} /> {item.years_exp}+ Yrs Exp
                            </span>
                          )}
                        </div>

                        {/* Description Section with CKEditor content styling */}
                        {item.description ? (
                          <div className="mt-1">
                            <div
                              className={`text-xs text-gray-600 ck-content transition-all duration-300 ease-in-out ${
                                isExpanded ? "max-h-[2000px] opacity-100" : "line-clamp-3 overflow-hidden"
                              }`}
                              dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                            
                            {/* Toggle Button */}
                            <button
                              type="button"
                              onClick={() => toggleExpand(itemId)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-1 transition-colors focus:outline-none"
                            >
                              {isExpanded ? (
                                <>
                                  <span>See Less</span>
                                  <ChevronUp size={12} />
                                </>
                              ) : (
                                <>
                                  <span>See More</span>
                                  <ChevronDown size={12} />
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1 italic">
                            No description provided
                          </p>
                        )}
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
                          setDeleteId(itemId);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete"
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg active:scale-90 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Mission & Vision Section */}
                  {(item.mission || item.vision) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#526484] w-full">
                      {item.mission && (
                        <div className="bg-gray-50/70 p-3 rounded-md border border-gray-100 space-y-1 w-full">
                          <span className="font-bold text-[#364a63] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <Target size={12} className="text-indigo-500" /> Mission
                          </span>
                          <div
                            className="text-gray-600 text-xs leading-relaxed ck-content"
                            dangerouslySetInnerHTML={{ __html: item.mission }}
                          />
                        </div>
                      )}

                      {item.vision && (
                        <div className="bg-gray-50/70 p-3 rounded-md border border-gray-100 space-y-1 w-full">
                          <span className="font-bold text-[#364a63] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <Eye size={12} className="text-[#09c] text-teal-500" /> Vision
                          </span>
                          <div
                            className="text-gray-600 text-xs leading-relaxed ck-content"
                            dangerouslySetInnerHTML={{ __html: item.vision }}
                          />
                        </div>
                      )}
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
        title="Delete About Details?"
        message="Are you sure you want to delete this about section?"
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