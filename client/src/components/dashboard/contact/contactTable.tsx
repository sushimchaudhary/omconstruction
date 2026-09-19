"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  SearchX,
  Download,
  Mail,
  MailOpen,
  User,
  Phone,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ContactServices } from "@/services/contactServices";
import TableLoadingSkeleton from "../tableLoadingSkeleton";
import ConfirmModal from "@/components/delete/confirmModel";
import { Popover, Tag } from "antd";

const PAGE_SIZE = 20;

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getReadStatusTag(isRead: boolean) {
  return isRead ? (
    <Tag color="green">Read</Tag>
  ) : (
    <Tag color="orange">Unread</Tag>
  );
}

export default function ContactTable({
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
      const res = await ContactServices.getList();
      const messages = Array.isArray(res) ? res : res?.data || [];
      setDataList(messages);
    } catch {
      toast.error("Failed to load contact messages");
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
          i.email?.toLowerCase().includes(q) ||
          i.phone?.toLowerCase().includes(q) ||
          i.subject?.toLowerCase().includes(q) ||
          i.message?.toLowerCase().includes(q),
      ),
    );
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, dataList]);

  const paginated = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;

  const handleSelectAll = () =>
    selectedIds.length === paginated.length
      ? setSelectedIds([])
      : setSelectedIds(paginated.map((i) => i.id));

  const handleSelectOne = (id: any) =>
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const handleToggleRead = async (id: string) => {
    try {
      const res = await ContactServices.toggleReadStatus(id);
      toast.success(res?.response || "Read status updated");
      setDataList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: !item.is_read } : item,
        ),
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    const ids =
      selectedIds.length > 0 ? selectedIds : deleteId ? [deleteId] : [];
    if (!ids.length) return;
    try {
      setDeleteLoading(true);
      await Promise.all(ids.map((id) => ContactServices.delete(id)));
      toast.success(`${ids.length} message(s) deleted`);
      setDataList((p) => p.filter((i) => !ids.includes(i.id)));
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
    doc.text("Contact Messages", 14, 15);
    autoTable(doc, {
      head: [["S.N.", "Sender", "Email", "Phone", "Subject", "Status", "Date"]],
      body: paginated.map((item, i) => [
        (currentPage - 1) * PAGE_SIZE + i + 1,
        item.name,
        item.email || "-",
        item.phone || "-",
        item.subject || "-",
        item.is_read ? "Read" : "Unread",
        formatDate(item.created_at),
      ]),
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [54, 74, 99] },
    });
    doc.save("Contact_Messages.pdf");
    toast.success("PDF Downloaded");
  };

  return (
    <div className="space-y-3 font-mukta">
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] scrollbar-hide relative">
          <table className="w-full text-left border-separate border-spacing-0">
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
                  Sender Details
                </th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                  Contact Info
                </th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                  Subject & Message
                </th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                  Status
                </th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase whitespace-nowrap">
                  Received Date
                </th>
                <th className="px-3 py-2 text-[11px] font-bold text-[#8094ae] uppercase text-right w-20 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableLoadingSkeleton rows={5} cols={8} />
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      {searchQuery ? (
                        <SearchX size={32} className="text-rose-300" />
                      ) : (
                        <Inbox size={32} className="text-gray-200" />
                      )}
                      <span className="text-sm font-bold text-[#364a63]">
                        {searchQuery
                          ? "No results found."
                          : "No contact messages yet."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((item, index) => {
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isSelected ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item.id)}
                          className="rounded border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2 text-[10px] text-[#526484] whitespace-nowrap">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}.
                      </td>

                      {/* Sender Name */}
                      <td className="px-3 py-2 whitespace-nowrap max-w-[150px]">
                        <span className="text-[11px] font-bold text-[#364a63] flex items-center gap-1.5 truncate">
                          <User size={12} className="text-gray-400 shrink-0" />
                          {item.name}
                        </span>
                      </td>

                      {/* Contact Info (Email & Phone) */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-[10px] text-[#526484] space-y-0.5">
                          {/* Direct Gmail Compose Link */}
                          {item.email ? (
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.email)}&su=${encodeURIComponent(item.subject || "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            >
                              <Mail
                                size={10}
                                className="text-gray-400 shrink-0"
                              />
                              <span>{item.email}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Mail
                                size={10}
                                className="text-gray-400 shrink-0"
                              />
                              <span>-</span>
                            </div>
                          )}

                          {/* Phone Call Link */}
                          {item.phone && (
                            <div className="flex items-center gap-1 text-[9px] text-[#8094ae]">
                              <Phone
                                size={10}
                                className="text-gray-400 shrink-0"
                              />
                              <a
                                href={`tel:${item.phone}`}
                                className="hover:text-blue-600 hover:underline transition-colors"
                              >
                                {item.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Subject & Popover Message Preview */}
                      <td className="px-3 py-2 max-w-[240px]">
                        <Popover
                          trigger="hover"
                          mouseEnterDelay={0.2}
                          placement="top"
                          overlayStyle={{ width: "500px" }}
                          title={
                            <div className="text-xs font-bold text-[#364a63] border-b pb-1 truncate">
                              {item.subject || "Contact Message"}
                            </div>
                          }
                          content={
                            <div className="max-h-60 overflow-y-auto text-xs text-gray-700 leading-relaxed pr-1 select-text whitespace-pre-wrap break-words">
                              {item.message}
                            </div>
                          }
                        >
                          <div className="cursor-pointer group">
                            <span className="text-[11px] font-semibold text-[#364a63] truncate block group-hover:text-blue-600 transition-colors">
                              {item.subject || "No Subject"}
                            </span>
                            <span className="text-[10px] text-[#8094ae] truncate block">
                              {item.message}
                            </span>
                          </div>
                        </Popover>
                      </td>

                      {/* Read/Unread Status */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        {getReadStatusTag(item.is_read)}
                      </td>

                      {/* Received Date */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-[10px] text-[#8094ae] flex items-center gap-1">
                          <Calendar
                            size={10}
                            className="text-gray-400 shrink-0"
                          />
                          {formatDate(item.created_at)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1">
                          {/* Toggle Read Status Button */}
                          <button
                            onClick={() => handleToggleRead(item.id)}
                            title={
                              item.is_read ? "Mark as Unread" : "Mark as Read"
                            }
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded active:scale-90 transition-all"
                          >
                            {item.is_read ? (
                              <MailOpen
                                size={12}
                                className="text-emerald-600"
                              />
                            ) : (
                              <Mail size={12} className="text-amber-500" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setSelectedIds([]);
                              setDeleteId(item.id);
                              setIsModalOpen(true);
                            }}
                            title="Delete Message"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded active:scale-90 transition-all"
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

        {/* Footer Pagination & PDF Export */}
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
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
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

      {/* Batch Selection Action Bar */}
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
        title="Delete Message?"
        message={
          selectedIds.length > 0
            ? `Delete ${selectedIds.length} contact messages?`
            : "Delete this contact message?"
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
