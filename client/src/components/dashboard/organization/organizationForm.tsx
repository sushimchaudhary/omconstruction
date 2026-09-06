"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  Camera,
  FileText,
  Bookmark,
  Map,
} from "lucide-react";
import { ConfigProvider } from "antd";
import { Form, FormItem, FormMessage } from "@/components/ui/form";
import { ThemedButton } from "@/components/ui/themedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { CancelButton } from "@/components/ui/CancleButton";
import { useTheme } from "@/lib/context/ThemeContext";
import { toast } from "sonner";
import { OrganizationServices } from "@/services/organizationServices";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";

interface IFormValues {
  company_name: string;
  tagline?: string;
  address: string;
  primary_email: string;
  secondary_email?: string;
  primary_phone: string;
  secondary_phone?: string;
  pan_vat_number?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  location_map_url?: string;
  logo?: any;
}

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function OrganizationForm({
  initialData,
  onSuccess,
  onClose,
  isOpen,
}: any) {
  const { primaryColor } = useTheme();
  const isUpdate = !!initialData;
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<IFormValues>({
    defaultValues: {
      company_name: "",
      tagline: "",
      address: "",
      primary_email: "",
      secondary_email: "",
      primary_phone: "",
      secondary_phone: "",
      pan_vat_number: "",
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
      linkedin_url: "",
      location_map_url: "",
      logo: null,
    },
  });

  const handleClose = () => {
    form.reset();
    setLogoPreview(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const rawLogo = initialData.logo || initialData.logo_url;
      setLogoPreview(rawLogo ? getImageUrl(rawLogo) : null);

      form.reset({
        company_name: initialData.company_name || "",
        tagline: initialData.tagline || "",
        address: initialData.address || "",
        primary_email: initialData.primary_email || "",
        secondary_email: initialData.secondary_email || "",
        primary_phone: initialData.primary_phone || "",
        secondary_phone: initialData.secondary_phone || "",
        pan_vat_number: initialData.pan_vat_number || "",
        facebook_url: initialData.facebook_url || "",
        twitter_url: initialData.twitter_url || "",
        instagram_url: initialData.instagram_url || "",
        linkedin_url: initialData.linkedin_url || "",
        location_map_url: initialData.location_map_url || "",
        logo: initialData.logo || null,
      });
    } else {
      form.reset({
        company_name: "",
        tagline: "",
        address: "",
        primary_email: "",
        secondary_email: "",
        primary_phone: "",
        secondary_phone: "",
        pan_vat_number: "",
        facebook_url: "",
        twitter_url: "",
        instagram_url: "",
        linkedin_url: "",
        location_map_url: "",
        logo: null,
      });
      setLogoPreview(null);
    }
  }, [isOpen, initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo size must be under 5MB");
        return;
      }
      form.setValue("logo", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: IFormValues) => {
    if (!isUpdate && !values.logo) {
      toast.error("Please upload an organization logo.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();

      Object.entries(values).forEach(([k, v]) => {
        if (k !== "logo" && v !== undefined && v !== null) {
          fd.append(k, String(v));
        }
      });

      if (values.logo instanceof File) {
        fd.append("logo", values.logo);
      } else if (typeof values.logo === "string") {
        fd.append("logo", values.logo);
      }

      const targetId = initialData?.id || initialData?._id;

      if (isUpdate) {
        if (!targetId) {
          toast.error("Organization ID not found!");
          return;
        }
        await OrganizationServices.updateDetails(targetId, fd);
        toast.success("Organization updated successfully!");
      } else {
        await OrganizationServices.createDetails(fd);
        toast.success("Organization created successfully!");
      }
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      toast.error(
        OrganizationServices?.parseError?.(err) || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    name,
    label,
    icon,
    placeholder,
    type = "text",
    rules,
    disabled,
  }: any) => (
    <Controller
      control={form.control}
      name={name}
      rules={{
        required: [
          "company_name",
          "address",
          "primary_email",
          "primary_phone",
        ].includes(name)
          ? "This field is required"
          : false,
        ...rules,
      }}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="w-full">
          <ThemedInput
            label={label}
            icon={icon}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            {...field}
          />
          {error && (
            <FormMessage className="text-[10px] text-red-500">
              {error.message}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[100] h-full w-full bg-slate-900/50 backdrop-blur-sm transition-all"
        />
      )}

      {/* Main Modal Window */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl border border-gray-200 font-mukta max-h-[90vh] flex flex-col my-auto pointer-events-auto z-[102]"
          >
            <ConfigProvider
              theme={{ token: { colorPrimary: primaryColor, borderRadius: 4 } }}
            >
              {/* Header */}
              <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0 rounded-t-lg">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Building2 size={15} style={{ color: primaryColor }} />
                  {isUpdate
                    ? "Edit Organization Details"
                    : "New Organization Details"}
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-red-500 hover:rotate-90 transition-transform p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col flex-1 min-h-0 bg-white"
                >
                  <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4 scrollbar-hide">
                    {/* Logo Upload Section */}
                    <div className="flex flex-col items-center pb-3 border-b border-dashed border-gray-200">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all"
                        style={{
                          borderColor: logoPreview ? primaryColor : "#e5e7eb",
                        }}
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera size={30} className="text-gray-300" />
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <p className="text-[11px] text-gray-400 mt-2 font-bold uppercase">
                        Organization Logo (Max 5MB){" "}
                        <span className="text-red-500">*</span>
                      </p>
                    </div>

                    {/* Company Name & Tagline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        name="company_name"
                        label="Company Name *"
                        placeholder="Enter company name"
                        icon={<Building2 size={12} />}
                      />
                      <Field
                        name="tagline"
                        label="Tagline"
                        placeholder="Enter tagline"
                        icon={<Bookmark size={12} />}
                      />
                    </div>

                    {/* PAN/VAT & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        name="pan_vat_number"
                        label="PAN / VAT Number"
                        placeholder="Enter PAN or VAT Number"
                        icon={<FileText size={12} />}
                      />
                      <Field
                        name="address"
                        label="Address *"
                        placeholder="Full address"
                        icon={<MapPin size={12} />}
                      />
                    </div>

                    {/* Primary & Secondary Phones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        name="primary_phone"
                        label="Primary Phone *"
                        placeholder="Enter primary phone"
                        icon={<Phone size={12} />}
                      />
                      <Field
                        name="secondary_phone"
                        label="Secondary Phone"
                        placeholder="Enter secondary phone"
                        icon={<Phone size={12} />}
                      />
                    </div>

                    {/* Primary & Secondary Emails */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        name="primary_email"
                        label="Primary Email *"
                        placeholder="info@company.com"
                        icon={<Mail size={12} />}
                        type="email"
                      />
                      <Field
                        name="secondary_email"
                        label="Secondary Email"
                        placeholder="support@company.com"
                        icon={<Mail size={12} />}
                        type="email"
                      />
                    </div>

                    {/* Location Map Embed URL */}
                    <div className="w-full">
                      <Field
                        name="location_map_url"
                        label="Location Map URL (Google Maps Embed)"
                        placeholder="https://www.google.com/maps/embed?..."
                        icon={<Map size={12} />}
                      />
                    </div>

                    {/* Social Media Links */}
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-t pt-3">
                      Social Media Links
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        name="facebook_url"
                        label="Facebook URL"
                        placeholder="https://facebook.com/..."
                        icon={<FaFacebook size={12} />}
                      />
                      <Field
                        name="twitter_url"
                        label="Twitter URL"
                        placeholder="https://twitter.com/..."
                        icon={<BsTwitter size={12} />}
                      />
                      <Field
                        name="instagram_url"
                        label="Instagram URL"
                        placeholder="https://instagram.com/..."
                        icon={<BsInstagram size={12} />}
                      />
                      <Field
                        name="linkedin_url"
                        label="LinkedIn URL"
                        placeholder="https://linkedin.com/..."
                        icon={<LiaLinkedin size={12} />}
                      />
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="flex justify-end gap-3 px-6 py-3 border-t border-gray-100 bg-white shrink-0 rounded-b-lg">
                    <CancelButton onClick={handleClose} disabled={loading} />
                    <ThemedButton type="submit" size="sm" disabled={loading}>
                      <div className="flex items-center gap-2">
                        {loading ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Save size={12} />
                        )}
                        <span>{isUpdate ? "Update" : "Create"}</span>
                      </div>
                    </ThemedButton>
                  </div>
                </form>
              </Form>
            </ConfigProvider>
          </div>
        </div>
      )}
    </>
  );
}