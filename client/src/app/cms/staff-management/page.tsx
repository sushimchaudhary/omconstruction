"use client";
import React, { useState, useEffect } from "react";
import { Search, X, UserPlus, Plus } from "lucide-react";
import { ThemedButton } from "@/components/ui/themedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { PageHeader } from "@/components/dashboard/PageHeader";
import StaffForm from "@/components/dashboard/staff/staffForm";
import StaffTable from "@/components/dashboard/staff/staffTable";
import { UserServices, Profile } from "@/services/userServices";

export default function StaffPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editData, setEditData] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  // ── Logged-in User Profile Fetch गर्ने ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UserServices.getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setEditData(null);
  };

  const handleEdit = (data: any) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleSuccess = () => setRefreshTrigger((p) => p + 1);

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* ── Staff Management Header Text ── */}
        <PageHeader
          title="Staff Management"
          description="Manage your restaurant staff, roles, employment details, and payroll information."
        />
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <ThemedInput
              type="text"
              placeholder="Search staff by name, phone, designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={15} />}
              className="h-7"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 z-20"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <ThemedButton onClick={() => setIsOpen(true)} size="sm" className="px-3 py-1.5 flex items-center gap-1.5">
                    <Plus size={14} />
              <span>Staff</span>
          </ThemedButton>
        </div>
      </div>

      <StaffTable onEdit={handleEdit} refreshTrigger={refreshTrigger} searchQuery={searchQuery} />

      {/* ── Staff Form ── */}
      <StaffForm
        isOpen={isOpen}
        initialData={editData}
        onClose={handleClose}
        onSuccess={handleSuccess}
        userProfile={userProfile}
      />
    </div>
  );
}