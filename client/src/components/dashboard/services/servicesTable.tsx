"use client";

import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  SearchX,
  Download,
  LucideImage,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ConfirmModal from "@/components/delete/confirmModel";
import { Image as AntImage, Tag, Popover, ConfigProvider } from "antd";
import TableLoadingSkeleton from "../tableLoadingSkeleton";
import { ServiceService } from "@/services/servicesServices";
import { useTheme } from "@/lib/context/ThemeContext";

const PAGE_SIZE = 20;

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function ServiceTable({
  onEdit,
  refreshTrigger,
  searchQuery = "",
}: any) {
  const { primaryColor } = useTheme();
  const [dataList, setDataList] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await ServiceService.getDetails();
      const services = Array.isArray(res)
        ? res
        : res?.data || res?.results || [];
      setDataList(services);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredData(
      dataList.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q),
      ),
    );
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, dataList]);

  const paginated = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const handleSelectAll = () =>
    selectedIds.length === paginated.length
      ? setSelectedIds([])
      : setSelectedIds(paginated.map((i) => i.id || i._id));

  const handleSelectOne = (id: any) =>
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const handleConfirmDelete = async () => {
    const ids =
      selectedIds.length > 0 ? selectedIds : deleteId ? [deleteId] : [];
    if (!ids.length) return;
    try {
      setDeleteLoading(true);
      await Promise.all(ids.map((id) => ServiceService.deleteDetails(id)));
      toast.success(`${ids.length} service(s) deleted`);
      ServiceService.clearCache();
      fetchData();
      setIsModalOpen(false);
      setSelectedIds([]);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Services List", 14, 15);
    autoTable(doc, {
      head: [["S.N.", "Title", "Description", "Status", "Created At"]],
      body: paginated.map((item, i) => [
        (currentPage - 1) * PAGE_SIZE + i + 1,
        item.title || "-",
        stripHtml(item.description) || "-",
        item.is_active ? "Active" : "Inactive",
        formatDate(item.created_at || item.createdAt),
      ]),
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [54, 74, 99] },
    });
    doc.save("Services.pdf");
    toast.success("PDF Downloaded");
  };

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: primaryColor, borderRadius: 4 } }}
    >
      <div className="space-y-3">
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] scrollbar-hide relative">
            <table className="w-full text-left border-separate border-spacing-0 whitespace-nowrap">
              <thead className="sticky top-0 z-30 shadow-sm">
                <tr className="bg-[#f5f6fa]">
                  <th className="px-3 py-2 w-10 text-center whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === paginated.length &&
                        paginated.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                    S.N.
                  </th>
                  <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                    Image
                  </th>
                  <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                    Title
                  </th>
                  <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                    Dates
                  </th>
                  <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase text-right w-24 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <TableLoadingSkeleton rows={5} cols={8} />
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-16 whitespace-nowrap"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {searchQuery ? (
                          <SearchX size={32} className="text-rose-300" />
                        ) : (
                          <Inbox size={32} className="text-gray-200" />
                        )}
                        <span className="text-sm font-bold text-[#364a63]">
                          {searchQuery ? "No results." : "No services yet."}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, index) => {
                    const itemId = item.id || item._id;
                    const isSelected = selectedIds.includes(itemId);
                    const imgUrl = getImageUrl(item.image);
                    const iconUrl = getImageUrl(item.icon);

                    return (
                      <tr
                        key={itemId}
                        className={`hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-blue-50/40" : ""
                        }`}
                      >
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(itemId)}
                            className="rounded border-gray-300 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-2 text-[10px] text-[#526484] whitespace-nowrap">
                          {(currentPage - 1) * PAGE_SIZE + index + 1}.
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="w-12 h-9 rounded border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                            {imgUrl ? (
                              <AntImage
                                src={imgUrl}
                                alt={item.title || "Service"}
                                className="w-full h-full object-cover"
                                wrapperStyle={{ width: "100%", height: "100%" }}
                              />
                            ) : iconUrl ? (
                              <img
                                src={iconUrl}
                                alt="icon"
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <LucideImage
                                size={14}
                                className="text-gray-300"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="text-[11px] font-bold text-[#364a63] block truncate max-w-[200px]">
                            {item.title || "-"}
                          </span>
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap">
                          <Popover
                            trigger="hover"
                            mouseEnterDelay={0.2}
                            placement="top"
                            overlayStyle={{ width: "650px" }}
                            title={
                              <div className="text-xs font-bold text-[#364a63] border-b pb-1 truncate">
                                {item.title || "Description Details"}
                              </div>
                            }
                            content={
                              <div
                                className="max-h-60 overflow-y-auto text-xs text-gray-700 leading-relaxed pr-1 select-text whitespace-normal break-words [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_p]:mb-1"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    item.description ||
                                    "No description available",
                                }}
                              />
                            }
                          >
                            <span className="text-[10px] text-[#8094ae] truncate block max-w-[280px] cursor-pointer hover:text-blue-600 transition-colors">
                              {stripHtml(item.description)}
                            </span>
                          </Popover>
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap">
                          {item.is_active ? (
                            <Tag
                              color="green"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              <span className="flex items-center gap-1">
                                <CheckCircle2 size={10} />
                                Active
                              </span>
                            </Tag>
                          ) : (
                            <Tag
                              color="red"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              <span className="flex items-center gap-1">
                                <XCircle size={10} />
                                Inactive
                              </span>
                            </Tag>
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-[9px] text-[#8094ae] space-y-0.5">
                            <div className="flex items-center gap-1">
                              <Calendar size={9} className="text-gray-400" />
                              <span className="font-semibold text-gray-600">
                                Created:
                              </span>
                              {formatDate(item.created_at || item.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={9} className="text-gray-400" />
                              <span className="font-semibold text-gray-600">
                                Updated:
                              </span>
                              {formatDate(item.updated_at || item.updatedAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded active:scale-90 transition-all"
                              title="Edit"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedIds([]);
                                setDeleteId(itemId);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded active:scale-90 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredData.length > 0 && (
            <div className="flex items-center justify-between px-6 py-2 border-t border-gray-300 bg-[#f5f6fa] whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8094ae]">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filteredData.length)} of{" "}
                  {filteredData.length}
                </span>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Download size={12} /> PDF
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[11px] font-bold px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap">
            <span className="text-xs font-bold text-red-600 uppercase">
              {selectedIds.length} Selected
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white rounded text-[11px] font-bold hover:bg-red-600 active:scale-95"
            >
              <Trash2 size={12} /> Delete Selected
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isModalOpen}
          title="Delete Service?"
          message={
            selectedIds.length > 0
              ? `Delete ${selectedIds.length} service(s)?`
              : "Delete this service?"
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsModalOpen(false);
            setDeleteId(null);
          }}
          loading={deleteLoading}
        />
      </div>
    </ConfigProvider>
  );
}
