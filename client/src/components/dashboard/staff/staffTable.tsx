"use client";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  SearchX,
  LucideImage,
  Download,
  QrCode,
  Building2,
  Mail,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

import TableLoadingSkeleton from "../tableLoadingSkeleton";
import ConfirmModal from "@/components/delete/confirmModel";
import { StaffServices } from "@/services/staffServices";
import { Image as AntImage, Tag, Popover } from "antd";

const PAGE_SIZE = 20;

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function StaffTable({
  onEdit,
  refreshTrigger,
  searchQuery = "",
}: any) {
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
      const res = await StaffServices.getDetails();
      setDataList(Array.isArray(res) ? res : res?.results || []);
    } catch {
      toast.error("Failed to load staff list");
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
          i.name?.toLowerCase().includes(q) ||
          i.designation?.toLowerCase().includes(q) ||
          i.email?.toLowerCase().includes(q) ||
          i.phone?.includes(q)
      )
    );
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, dataList]);

  const paginated = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;

  const handleSelectAll = () => {
    if (selectedIds.length === paginated.length) {
      setSelectedIds([]);
    } else {
      const allIds = paginated.map((i) => i.id || i._id);
      setSelectedIds(allIds);
      setDeleteId(null);
      setIsModalOpen(true);
    }
  };

  const handleSelectOne = (id: any) => {
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const handleConfirmDelete = async () => {
    const ids =
      selectedIds.length > 0 ? selectedIds : deleteId ? [deleteId] : [];
    if (!ids.length) return;
    try {
      setDeleteLoading(true);
      await Promise.all(ids.map((id) => StaffServices.deleteDetails(id)));
      toast.success(`${ids.length} staff record(s) deleted`);
      setDataList((p) => p.filter((i) => !ids.includes(i.id || i._id)));
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
    doc.setFontSize(16);
    doc.setTextColor(54, 74, 99);
    doc.text("Staff Directory & Payroll Details", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(128, 148, 174);
    doc.text(
      `Exported ${paginated.length} of ${filteredData.length} records.`,
      14,
      22
    );

    autoTable(doc, {
      head: [
        [
          "S.N.",
          "Name",
          "Designation",
          "Phone",
          "Basic",
          "Allowance",
          "Net Salary",
          "Status",
        ],
      ],
      body: paginated.map((item, i) => {
        const basic = item.salary_basic ?? item.salary?.basic ?? 0;
        const allowance = item.salary_allowance ?? item.salary?.allowance ?? 0;
        const deductions = item.salary_deductions ?? item.salary?.deductions ?? 0;
        const netSalary = basic + allowance - deductions;
        return [
          (currentPage - 1) * PAGE_SIZE + i + 1,
          item.name,
          item.designation,
          item.phone,
          `Rs. ${basic}`,
          `Rs. ${allowance}`,
          `Rs. ${netSalary}`,
          item.status,
        ];
      }),
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [54, 74, 99] },
    });
    doc.save("Staff_Report.pdf");
    toast.success("PDF Downloaded");
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "active":
        return <Tag color="green">Active</Tag>;
      case "on_leave":
        return <Tag color="orange">On Leave</Tag>;
      case "terminated":
        return <Tag color="red">Terminated</Tag>;
      default:
        return <Tag color="default">Inactive</Tag>;
    }
  };

  // 🟢 Helper to get Status Color for Staff Info (Dot and Text)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return {
          dot: "bg-emerald-500",
          text: "text-emerald-600 font-semibold",
        };
      case "on_leave":
        return {
          dot: "bg-amber-500",
          text: "text-amber-600 font-semibold",
        };
      case "terminated":
        return {
          dot: "bg-rose-500",
          text: "text-rose-600 font-semibold",
        };
      default:
        return {
          dot: "bg-slate-400",
          text: "text-slate-500 font-medium",
        };
    }
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto max-h-[550px] scrollbar-thin scrollbar-thumb-gray-200 relative">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-30 shadow-sm">
              <tr className="bg-[#f5f6fa] whitespace-nowrap">
                <th className="px-3 py-1.5 w-10 text-center border-b border-gray-200">
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
                <th className="px-3 py-1.5 w-12 text-center text-[11px] font-bold text-[#8094ae] uppercase border-b border-gray-200">
                  S.N.
                </th>
                <th className="px-3 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase border-b border-gray-200">
                  Staff Info
                </th>
                <th className="px-3 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase border-b border-gray-200">
                  Role & Contact
                </th>
                <th className="px-3 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase border-b border-gray-200">
                  Salary Details
                </th>
                <th className="px-3 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase text-center border-b border-gray-200">
                  Bank Details & QR
                </th>
                <th className="px-3 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase border-b border-gray-200">
                  Joined Date
                </th>
                <th className="px-3 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase border-b border-gray-200">
                  Status
                </th>
                <th className="px-3 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase text-right w-20 border-b border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableLoadingSkeleton rows={5} cols={9} />
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      {searchQuery ? (
                        <SearchX size={32} className="text-rose-300" />
                      ) : (
                        <Inbox size={32} className="text-gray-200" />
                      )}
                      <span className="text-sm font-bold text-[#364a63]">
                        {searchQuery
                          ? "No matching staff found."
                          : "No staff records found."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((item, index) => {
                  const itemId = item.id || item._id;
                  const isSelected = selectedIds.includes(itemId);
                  
                  // Profile & QR Code URLs
                  const formattedProfileUrl = getImageUrl(item.image);
                  const formattedQrUrl = getImageUrl(item.bank_qr_code || item.bankDetails?.qrCode);

                  // Salary Details Mapping
                  const basic = item.salary_basic ?? item.salary?.basic ?? 0;
                  const allowance = item.salary_allowance ?? item.salary?.allowance ?? 0;
                  const deductions = item.salary_deductions ?? item.salary?.deductions ?? 0;
                  const netSalary = basic + allowance - deductions;

                  // Bank Details Mapping
                  const bankName = item.bank_name || item.bankDetails?.bankName;
                  const accountName = item.bank_account_name || item.bankDetails?.accountName;
                  const accountNumber = item.bank_account_number || item.bankDetails?.accountNumber;
                  const bankBranch = item.bank_branch || item.bankDetails?.branch;

                  const snNumber = (currentPage - 1) * PAGE_SIZE + index + 1;

                  // Dynamic Status Color
                  const statusColor = getStatusColor(item.status);

                  return (
                    <tr
                      key={itemId}
                      className={`hover:bg-gray-50/80 transition-all duration-200 ${
                        isSelected ? "bg-blue-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-1.5 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(itemId)}
                          className="rounded border-gray-300 cursor-pointer"
                        />
                      </td>

                      {/* S.N. */}
                      <td className="px-3 py-1.5 text-center text-[11px] font-semibold text-[#8094ae] whitespace-nowrap">
                        {snNumber}
                      </td>

                      {/* Staff Photo & Name */}
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 shadow-xs">
                            {formattedProfileUrl ? (
                              <AntImage
                                src={formattedProfileUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                styles={{
                                  root: { width: "100%", height: "100%" },
                                }}
                              />
                            ) : (
                              <LucideImage
                                size={15}
                                className="text-gray-300"
                              />
                            )}
                          </div>
                          <div className="min-w-[120px]">
                            <p className="text-[12px] font-bold text-[#364a63] capitalize leading-tight whitespace-nowrap">
                              {item.name}
                            </p>
                            {/* 🟢 Status अनुसार Dynamic Dot र Text Color */}
                            <p
                              className={`text-[10px] capitalize flex items-center gap-1.5 mt-0.5 whitespace-nowrap ${statusColor.text}`}
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${statusColor.dot}`}
                              />
                              {(item.employmentType || "full_time").replace("_", "-")}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Designation & Contact */}
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        <p className="text-[11px] font-bold text-[#364a63] capitalize whitespace-nowrap">
                          {item.designation}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                          {item.phone}
                        </p>
                        {item.email && (
                          <p className="text-[10px] text-gray-400 truncate max-w-[140px] flex items-center gap-1 whitespace-nowrap">
                            <Mail size={10} className="shrink-0" />
                            {item.email}
                          </p>
                        )}
                      </td>

                      {/* Salary */}
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-emerald-600 whitespace-nowrap">
                            Rs. {netSalary.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-gray-400 whitespace-nowrap">
                            Basic: Rs. {basic.toLocaleString()}
                          </span>
                          {(allowance > 0 || deductions > 0) && (
                            <span className="text-[9px] text-gray-400 whitespace-nowrap">
                              +Allw: {allowance} | -Ded: {deductions}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Bank Details & QR Code */}
                      <td className="px-3 py-1.5 text-center whitespace-nowrap">
                        {bankName || formattedQrUrl ? (
                          <Popover
                            trigger="click"
                            placement="bottomRight"
                            content={
                              <div className="w-64 max-w-[85vw] bg-white space-y-1.5">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                  <Building2
                                    size={16}
                                    className="text-blue-600 shrink-0"
                                  />
                                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                                    Bank Account Details
                                  </span>
                                </div>
                                {formattedQrUrl ? (
                                  <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded border border-dashed border-gray-200">
                                    <div className="w-28 h-28 bg-white p-1 rounded border shadow-xs">
                                      <AntImage
                                        src={formattedQrUrl}
                                        alt="Bank QR Code"
                                        className="w-full h-full object-contain"
                                        styles={{
                                          root: {
                                            width: "100%",
                                            height: "100%",
                                          },
                                        }}
                                      />
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 font-semibold flex items-center gap-1">
                                      <QrCode size={10} /> Scan to Pay /
                                      Transfer
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-gray-400 italic text-center py-1">
                                    No QR Code available
                                  </div>
                                )}
                                <div className="space-y-1.5 text-xs bg-white p-2 rounded border border-gray-100">
                                  <div>
                                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                                      Bank Name
                                    </span>
                                    <p className="font-bold text-gray-800">
                                      {bankName || "-"}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 pt-1">
                                    <div>
                                      <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                                        Account Name
                                      </span>
                                      <p className="font-medium text-gray-700 capitalize truncate">
                                        {accountName || "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                                        Account Number
                                      </span>
                                      <p className="font-mono font-bold text-blue-700 truncate">
                                        {accountNumber || "-"}
                                      </p>
                                    </div>
                                  </div>

                                  {bankBranch && (
                                    <div className="pt-1">
                                      <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                                        Bank Branch
                                      </span>
                                      <p className="font-medium text-gray-700 capitalize">
                                        {bankBranch}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            }
                          >
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-all cursor-pointer whitespace-nowrap"
                            >
                              <Eye size={13} />
                              <span>View Details</span>
                            </button>
                          </Popover>
                        ) : (
                          <span className="text-[10px] text-gray-300 italic whitespace-nowrap">
                            No Bank Details
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-3 py-1.5 text-[10px] font-medium text-gray-500 whitespace-nowrap">
                        {item.joinedDate
                          ? dayjs(item.joinedDate).format("YYYY-MM-DD")
                          : "-"}
                      </td>

                      {/* Status Tag */}
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        {getStatusTag(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-1.5 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md active:scale-90 transition-all border border-transparent hover:border-blue-200"
                            title="Edit Staff"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedIds([]);
                              setDeleteId(itemId);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md active:scale-90 transition-all border border-transparent hover:border-red-200"
                            title="Delete Staff"
                          >
                            <Trash2 size={13} />
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

        {/* Footer / Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="flex items-center justify-between px-6 py-1.5 border-t border-gray-300 bg-[#f5f6fa] whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8094ae]">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredData.length)} of{" "}
                {filteredData.length}
              </span>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
              >
                <Download size={12} /> PDF
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 disabled:opacity-30 cursor-pointer"
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
                className="p-1 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Staff Record?"
        message={
          selectedIds.length > 0
            ? `Are you sure you want to delete these ${selectedIds.length} staff record(s)?`
            : "Are you sure you want to delete this staff member?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setDeleteId(null);
        }}
        loading={deleteLoading}
      />
    </div>
  );
}