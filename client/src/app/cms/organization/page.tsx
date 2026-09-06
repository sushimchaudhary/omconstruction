"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import OrganizationForm from "@/components/dashboard/organization/organizationForm";
import OrganizationCards from "@/components/dashboard/organization/organizationTable";

export default function OrganizationPage() {
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
        title="Organization Details"
        description="Manage company details, contact information, social links, and branding."
      />

      <OrganizationCards
        onEdit={handleEdit}
        onAdd={() => setIsOpen(true)}
        refreshTrigger={refreshTrigger}
      />

      <OrganizationForm
        isOpen={isOpen}
        initialData={editData}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}