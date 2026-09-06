"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import AboutCards from "@/components/about/aboutTable";
import AboutForm from "@/components/about/aboutForm";


export default function AboutPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleClose = () => {
    setIsOpen(false);
    setEditData(null);
  };

  const handleEdit = (data: any) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger((p) => p + 1);
    handleClose();
  };

  return (
    <div className="w-full space-y-4">
      <PageHeader
        title="About Us Details"
        description="Manage company story, mission, vision, image, and years of experience."
      />

      <AboutCards
        onEdit={handleEdit}
        onAdd={() => setIsOpen(true)}
        refreshTrigger={refreshTrigger}
      />

      <AboutForm
        isOpen={isOpen}
        initialData={editData}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}