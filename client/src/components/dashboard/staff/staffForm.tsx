"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Building,
  CreditCard,
  Save,
  Loader2,
  Camera,
  Hash,
  GitBranch,
  QrCode,
  Trash2,
  Upload,
} from "lucide-react";
import { ConfigProvider, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { Form, FormItem, FormMessage } from "@/components/ui/form";
import { ThemedButton } from "@/components/ui/themedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { CancelButton } from "@/components/ui/CancleButton";
import { useTheme } from "@/lib/context/ThemeContext";
import { useOrganization } from "@/lib/hooks/useOrganization";
import { toast } from "sonner";
import { StaffServices } from "@/services/staffServices";

interface IFormValues {
  name: string;
  email: string;
  phone: string;
  designation: string;
  joinedDate: any;
  employmentType: string;
  status: string;
  branch: string;
  order: number;
  salaryBasic: number;
  salaryAllowance: number;
  salaryDeductions: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankBranch: string;
  accountQrCode?: any;
  image?: any;
}

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function StaffForm({
  initialData,
  onSuccess,
  onClose,
  isOpen,
  branches = [],
  userProfile,
}: any) {
  const { primaryColor } = useTheme();
  const { organization } = useOrganization();
  const isUpdate = !!initialData;
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [branchDisplayName, setBranchDisplayName] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  // Helper Function to Resolve Branch Details
  const resolveBranchDetails = () => {
    const safeBranches = Array.isArray(branches) ? branches : [];

    const findBranchNameById = (id: string) => {
      if (!id) return "";
      const matched = safeBranches.find(
        (b: any) => String(b._id || b.id) === String(id)
      );
      return matched ? matched.name || matched.title || "" : "";
    };

    if (initialData?.branch) {
      if (typeof initialData.branch === "object") {
        const branchObj = initialData.branch;
        const bName =
          branchObj.name ||
          branchObj.title ||
          findBranchNameById(branchObj._id || branchObj.id);

        return {
          id: String(branchObj._id || branchObj.id || ""),
          name: bName || "N/A",
        };
      }

      const branchId = String(initialData.branch);
      const matchedName = findBranchNameById(branchId);
      return {
        id: branchId,
        name: matchedName || userProfile?.branch?.name || "N/A",
      };
    }

    if (initialData?.branch_id) {
      const branchId = String(initialData.branch_id);
      const matchedName = findBranchNameById(branchId);
      return {
        id: branchId,
        name: matchedName || userProfile?.branch?.name || "N/A",
      };
    }

    if (userProfile?.branch) {
      if (typeof userProfile.branch === "object") {
        const bName =
          userProfile.branch.name ||
          userProfile.branch.title ||
          findBranchNameById(userProfile.branch._id || userProfile.branch.id);

        return {
          id: String(
            userProfile.branch._id ||
              userProfile.branch.id ||
              userProfile.branch_id ||
              ""
          ),
          name: bName || "N/A",
        };
      }

      const branchId = String(userProfile.branch_id || userProfile.branch);
      const matchedName = findBranchNameById(branchId);
      return {
        id: branchId,
        name: matchedName || "N/A",
      };
    }

    const orgObj = Array.isArray(organization) ? organization[0] : organization;
    if (orgObj?.branch_id) {
      const matchedName = findBranchNameById(orgObj.branch_id);
      if (matchedName) {
        return {
          id: String(orgObj.branch_id),
          name: matchedName,
        };
      }
    }

    if (safeBranches.length > 0) {
      return {
        id: String(safeBranches[0]._id || safeBranches[0].id || ""),
        name: safeBranches[0].name || safeBranches[0].title || "",
      };
    }

    return { id: "", name: "N/A" };
  };

  const form = useForm<IFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      joinedDate: dayjs(),
      employmentType: "full-time",
      status: "active",
      branch: "",
      order: 1,
      salaryBasic: 0,
      salaryAllowance: 0,
      salaryDeductions: 0,
      bankName: "",
      accountName: "",
      accountNumber: "",
      bankBranch: "",
      accountQrCode: null,
      image: null,
    },
  });

  const handleClose = () => {
    form.reset();
    setImagePreview(null);
    setQrCodePreview(null);
    setBranchDisplayName("");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const activeBranch = resolveBranchDetails();
    setBranchDisplayName(activeBranch.name);

    if (initialData) {
      // 🟢 Fix Profile & QR Code URLs
      const rawImg = initialData.image_url || initialData.image;
      setImagePreview(rawImg ? getImageUrl(rawImg) : null);

      const rawQr =
        initialData.bank_qr_code || initialData.bankDetails?.qrCode;
      setQrCodePreview(rawQr ? getImageUrl(rawQr) : null);

      // 🟢 Fix Employment Type enum formatting ("full_time" -> "full-time")
      const formattedEmpType = initialData.employmentType
        ? String(initialData.employmentType).replace("_", "-")
        : "full-time";

      // 🟢 Reset Form supporting Flat fields from Database
      form.reset({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        designation: initialData.designation || "",
        joinedDate: initialData.joinedDate
          ? dayjs(initialData.joinedDate)
          : dayjs(),
        employmentType: formattedEmpType,
        status: initialData.status || "active",
        branch: activeBranch.id,
        order: initialData.order !== undefined ? Number(initialData.order) : 1,
        salaryBasic:
          initialData.salary_basic ?? initialData.salary?.basic ?? 0,
        salaryAllowance:
          initialData.salary_allowance ?? initialData.salary?.allowance ?? 0,
        salaryDeductions:
          initialData.salary_deductions ?? initialData.salary?.deductions ?? 0,
        bankName: initialData.bank_name || initialData.bankDetails?.bankName || "",
        accountName:
          initialData.bank_account_name ||
          initialData.bankDetails?.accountName ||
          "",
        accountNumber:
          initialData.bank_account_number ||
          initialData.bankDetails?.accountNumber ||
          "",
        bankBranch:
          initialData.bank_branch || initialData.bankDetails?.branch || "",
        accountQrCode: null,
        image: null,
      });
    } else {
      setImagePreview(null);
      setQrCodePreview(null);
      form.reset({
        name: "",
        email: "",
        phone: "",
        designation: "",
        joinedDate: dayjs(),
        employmentType: "full-time",
        status: "active",
        branch: activeBranch.id,
        order: 1,
        salaryBasic: 0,
        salaryAllowance: 0,
        salaryDeductions: 0,
        bankName: "",
        accountName: "",
        accountNumber: "",
        bankBranch: "",
        accountQrCode: null,
        image: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData?._id || initialData?.id]);

  // Profile photo handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // QR Code handler
  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("QR Code image must be under 5MB");
        return;
      }
      form.setValue("accountQrCode", file);
      const reader = new FileReader();
      reader.onloadend = () => setQrCodePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeQrCode = () => {
    setQrCodePreview(null);
    form.setValue("accountQrCode", null);
    if (qrInputRef.current) qrInputRef.current.value = "";
  };

  const onSubmit = async (values: IFormValues) => {
    if (!isUpdate && !values.image) {
      toast.error("Please select a profile image");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("designation", values.designation);
      fd.append(
        "joinedDate",
        values.joinedDate
          ? values.joinedDate.toISOString()
          : new Date().toISOString()
      );
      fd.append("employmentType", values.employmentType);
      fd.append("status", values.status);
      fd.append("branch", values.branch);
      fd.append("order", String(values.order));

      // Salary details
      fd.append("salary[basic]", String(values.salaryBasic));
      fd.append("salary[allowance]", String(values.salaryAllowance));
      fd.append("salary[deductions]", String(values.salaryDeductions));

      // Bank Details
      fd.append("bankDetails[bankName]", values.bankName);
      fd.append("bankDetails[accountName]", values.accountName);
      fd.append("bankDetails[accountNumber]", values.accountNumber);
      fd.append("bankDetails[branch]", values.bankBranch);

      if (values.accountQrCode instanceof File) {
        fd.append("accountQrCode", values.accountQrCode);
      } else if (
        (initialData?.bank_qr_code || initialData?.bankDetails?.qrCode) &&
        qrCodePreview
      ) {
        fd.append(
          "bankDetails[qrCode]",
          initialData.bank_qr_code || initialData.bankDetails?.qrCode
        );
      }

      if (values.image instanceof File) {
        fd.append("image", values.image);
      } else if (initialData?.image && imagePreview) {
        fd.append("image", initialData.image);
      }

      const staffId = initialData?.id || initialData?._id;
      if (isUpdate) {
        if (!staffId) {
          toast.error("Staff ID not found");
          return;
        }
        await StaffServices.updateDetails(staffId, fd);
        toast.success("Staff updated successfully!");
      } else {
        await StaffServices.createDetails(fd);
        toast.success("Staff member added successfully!");
      }
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      toast.error(StaffServices.parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-100 h-full bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
      <div
        className={`fixed inset-0 z-101 flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-2xl bg-white rounded shadow-md border border-gray-200 overflow-hidden font-mukta max-h-[90vh] flex flex-col">
          <ConfigProvider
            theme={{ token: { colorPrimary: primaryColor, borderRadius: 4 } }}
          >
            {/* Header */}
            <div className="bg-white px-5 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <User size={16} style={{ color: primaryColor }} />
                {isUpdate ? "Edit Staff Details" : "Add New Staff"}
              </h2>
              <button
                onClick={handleClose}
                className="text-red-500 hover:rotate-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto px-6 space-y-5 py-4 scrollbar-hide">
                  {/* Photo Upload */}
                  <div className="flex flex-col items-center pb-2 border-b border-dashed border-gray-200">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all"
                      style={{
                        borderColor: imagePreview ? primaryColor : "#e5e7eb",
                      }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera size={26} className="text-gray-300" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase">
                      Profile Photo (Max 5MB)
                    </p>
                  </div>

                  {/* Section 1: Personal & Role Info */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 pb-1 border-b">
                      1. Personal & Role Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Controller
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Full Name *"
                              icon={<User size={12} />}
                              placeholder="Full Name"
                              {...field}
                            />
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Email *"
                              type="email"
                              icon={<Mail size={12} />}
                              placeholder="email@domain.com"
                              {...field}
                            />
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Phone Number *"
                              icon={<Phone size={12} />}
                              placeholder="98xxxxxxxx"
                              {...field}
                            />
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Designation / Role *"
                              icon={<Briefcase size={12} />}
                              placeholder="e.g. Head Chef, Waiter"
                              {...field}
                            />
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Section 2: Employment & Branch */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 pb-1 border-b">
                      2. Employment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Controller
                        control={form.control}
                        name="joinedDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <label className="text-xs font-bold text-gray-600 mb-1">
                              Joined Date *
                            </label>
                            <DatePicker
                              className="w-full h-9"
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                            />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="employmentType"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <label className="text-xs font-bold text-gray-600 mb-1">
                              Employment Type
                            </label>
                            <Select
                              className="w-full h-9"
                              value={field.value}
                              onChange={(val) => field.onChange(val)}
                              options={[
                                { label: "Full-Time", value: "full-time" },
                                { label: "Part-Time", value: "part-time" },
                                { label: "Contract", value: "contract" },
                                { label: "Intern", value: "intern" },
                              ]}
                            />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <label className="text-xs font-bold text-gray-600 mb-1">
                              Status
                            </label>
                            <Select
                              className="w-full h-9"
                              value={field.value}
                              onChange={(val) => field.onChange(val)}
                              options={[
                                { label: "Active", value: "active" },
                                { label: "Inactive", value: "inactive" },
                                { label: "On Leave", value: "on-leave" },
                                { label: "Terminated", value: "terminated" },
                              ]}
                            />
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <ThemedInput
                          label="Branch"
                          icon={<GitBranch size={12} />}
                          value={branchDisplayName}
                          disabled
                          className="bg-gray-100 font-semibold cursor-not-allowed text-gray-700"
                        />
                      </FormItem>

                      <Controller
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Display Order"
                              icon={<Hash size={12} />}
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Section 3: Salary */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 pb-1 border-b">
                      3. Salary Structure
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Controller
                        control={form.control}
                        name="salaryBasic"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Basic Salary *"
                              type="number"
                              icon={<DollarSign size={12} />}
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="salaryAllowance"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Allowance"
                              type="number"
                              icon={<DollarSign size={12} />}
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="salaryDeductions"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Deductions"
                              type="number"
                              icon={<DollarSign size={12} />}
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Section 4: Bank Account & QR Code Details */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 pb-1 border-b">
                      4. Bank Account Details & QR Code
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Controller
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Bank Name *"
                              icon={<Building size={12} />}
                              placeholder="Nabil Bank, NIC Asia..."
                              {...field}
                            />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="accountName"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Account Name *"
                              icon={<User size={12} />}
                              placeholder="Account holder name"
                              {...field}
                            />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Account Number *"
                              icon={<CreditCard size={12} />}
                              placeholder="Account number"
                              {...field}
                            />
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="bankBranch"
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Bank Branch"
                              icon={<Building size={12} />}
                              placeholder="Branch location"
                              {...field}
                            />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Account QR Code Field */}
                    <div className="mt-3">
                      <label className="text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
                        <QrCode size={13} />
                        <span>Account QR Code</span>
                      </label>

                      <div className="flex items-center gap-4 mt-1 border border-dashed border-gray-300 rounded p-3 bg-gray-50/50">
                        {qrCodePreview ? (
                          <div className="relative group w-20 h-20 border rounded overflow-hidden bg-white shrink-0">
                            <img
                              src={qrCodePreview}
                              alt="QR Code Preview"
                              className="w-full h-full object-contain p-1"
                            />
                            <button
                              type="button"
                              onClick={removeQrCode}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => qrInputRef.current?.click()}
                            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all shrink-0 bg-white"
                          >
                            <Upload size={18} className="text-gray-400 mb-1" />
                            <span className="text-[10px] text-gray-500 font-semibold">
                              Upload
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          <p className="font-semibold text-gray-700">
                            Upload Bank QR Image
                          </p>
                          <p className="text-[11px] text-gray-400">
                            PNG, JPG or WEBP (Max 5MB)
                          </p>
                          {qrCodePreview && (
                            <button
                              type="button"
                              onClick={() => qrInputRef.current?.click()}
                              className="mt-1 text-xs text-blue-600 hover:underline font-medium"
                            >
                              Change QR Code
                            </button>
                          )}
                        </div>

                        <input
                          type="file"
                          ref={qrInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleQrCodeChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Bottom Submit/Cancel Buttons */}
                <div className="flex justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-white shrink-0">
                  <CancelButton onClick={handleClose} disabled={loading} />
                  <ThemedButton type="submit" size="sm" disabled={loading}>
                    <div className="flex items-center gap-2">
                      {loading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Save size={12} />
                      )}
                      <span>{isUpdate ? "Update Staff" : "Add Staff"}</span>
                    </div>
                  </ThemedButton>
                </div>
              </form>
            </Form>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}