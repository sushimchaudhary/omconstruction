"use client";

import { useEffect, useState, useCallback } from "react";
import { NoticeServices, NoticeItem } from "@/services/noticeServices";
import { FiCalendar, FiShield, FiEye, FiCheckCircle } from "react-icons/fi";
import { useTheme } from "@/lib/context/ThemeContext";
import { FileText, MapPin, Store } from "lucide-react";
import { socket } from "@/lib/socket";
import { SupportNoticeServices } from "@/services/supportNoticeServices";

export default function NoticePage() {
  const { primaryColor } = useTheme();

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SupportNoticeServices.getDetails();
      const activeNotices = data.filter(
        (notice: NoticeItem) => notice.is_active,
      );
      setNotices(activeNotices);
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();

    // 🟢 Connect Socket
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("🟢 Socket connected successfully! ID:", socket.id);
      socket.emit("join_admin");
    });

    socket.on("joined", (data) => {
      console.log("🟢 Room joined:", data);
    });

    // 🟢 1. Realtime Notice Created Handled
    const handleCreated = (newNotice: NoticeItem) => {
      console.log("⚡ Realtime notice created:", newNotice);

      // यदि active छ भने state मा सिधै Top मा थप्ने (बिना API Refresh)
      if (newNotice.is_active) {
        setNotices((prevNotices) => {
          // Duplicate entry रोक्न checking
          const exists = prevNotices.some((item) => item.id === newNotice.id);
          if (exists) return prevNotices;
          return [newNotice, ...prevNotices];
        });
      }
    };

    // 🟢 2. Realtime Notice Updated Handled
    const handleUpdated = (updatedNotice: NoticeItem) => {
      console.log("⚡ Realtime notice updated:", updatedNotice);

      setNotices((prevNotices) => {
        // यदि notice deactivate गरिएको छ भने लिस्टबाट हटाउने
        if (!updatedNotice.is_active) {
          return prevNotices.filter((item) => item.id !== updatedNotice.id);
        }

        // यदि पहिले लिस्टमा थिएन भने थप्ने, छ भने update गर्ने
        const exists = prevNotices.some(
          (item) => item.id === updatedNotice.id,
        );
        if (!exists) {
          return [updatedNotice, ...prevNotices];
        }

        return prevNotices.map((item) =>
          item.id === updatedNotice.id ? updatedNotice : item,
        );
      });
    };

    // 🟢 3. Realtime Notice Deleted Handled
    const handleDeleted = (data: { id: string }) => {
      console.log("⚡ Realtime notice deleted:", data);
      setNotices((prevNotices) =>
        prevNotices.filter((item) => item.id !== data.id),
      );
    };

    socket.on("notice:created", handleCreated);
    socket.on("notice:updated", handleUpdated);
    socket.on("notice:deleted", handleDeleted);

    return () => {
      socket.off("connect");
      socket.off("joined");
      socket.off("notice:created", handleCreated);
      socket.off("notice:updated", handleUpdated);
      socket.off("notice:deleted", handleDeleted);
    };
  }, [fetchNotices]);

  // 🟢 Handle Mark Notice as Seen
  const handleMarkAsSeen = async (id: string) => {
    try {
      await NoticeServices.markAsSeen(id);
      fetchNotices(); // Refresh notice list to update seen count
    } catch (err) {
      console.error("Failed to mark notice as seen", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-gray-50/50 min-h-screen ">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row py-3 md:items-center md:justify-between gap-2 relative overflow-hidden">
        <div className="space-y-1.5 pl-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-sm"
              style={{ backgroundColor: primaryColor || "#236B28" }}
            >
              <FiShield className="w-3.5 h-3.5" />
              Support Team Announcement
            </span>
            <span className="text-xs text-gray-400">• Official Broadcast</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Notice Management
          </h1>
          <p className="text-sm text-gray-500">
            Official announcements, updates, and notices directly issued for
            your branch.
          </p>
        </div>
      </div>

      {/* Notices List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-gray-100 rounded-lg h-80 animate-pulse p-4 space-y-4"
            >
              <div className="bg-gray-100 h-40 rounded-xl w-full" />
              <div className="bg-gray-100 h-4 rounded w-3/4" />
              <div className="bg-gray-100 h-4 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm p-8 space-y-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-lg font-bold text-white shadow-sm"
            style={{ backgroundColor: primaryColor || "#236B28" }}
          >
            <FileText />
          </div>
          <h3 className="text-gray-800 font-semibold text-lg">
            No active notices found
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            There are no active notices at the moment.
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {notices.map((notice) => {
            const imageUrl = notice.image
              ? notice.image.startsWith("http")
                ? notice.image
                : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${
                    notice.image.startsWith("/") ? "" : "/"
                  }${notice.image}`
              : null;

            const seenCount = notice.seen?.length || 0;

            return (
              <div
                key={notice.id}
                className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row group"
              >
                {/* 🖼️ Notice Image */}
                {imageUrl && (
                  <div className="relative md:w-2/5 h-64 md:h-auto bg-gray-100 overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={notice.title}
                      className="object-cover w-full h-full "
                    />
                  </div>
                )}

                {/* 📝 Content & Description */}
                <div className="flex-1 flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {new Date(notice.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>

                      {/* 👁️ Seen Count Badge */}
                      {/* <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        <FiEye className="w-3.5 h-3.5 text-gray-600" />
                        Seen by {seenCount} {seenCount === 1 ? "user" : "users"}
                      </span> */}
                    </div>

                    <h3 className="font-bold text-gray-900 text-xl leading-snug">
                      {notice.title}
                    </h3>

                    {/* 🟢 Notice Description Display */}
                    {notice.description && (
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {notice.description}
                      </p>
                    )}
                  </div>

                  {/* 🟢 Footer Info & Mark as Read */}
                  <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {notice.restaurant && (
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium border border-blue-100/50">
                          <Store className="h-3.5 w-3.5" />
                          {notice.restaurant.name}
                        </span>
                      )}

                      {notice.branch && (
                        <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-medium border border-purple-100/50">
                          <MapPin className="h-3.5 w-3.5" />
                          {notice.branch.name}
                        </span>
                      )}
                    </div>

                    {/* <button
                      onClick={() => handleMarkAsSeen(notice.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <FiCheckCircle className="w-3.5 h-3.5 text-green-600" />
                      Mark as Seen
                    </button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
