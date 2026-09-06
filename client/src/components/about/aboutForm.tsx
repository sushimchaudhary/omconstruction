"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Info,
  Save,
  Loader2,
  Camera,
  FileText,
  Target,
  Eye,
  Award,
} from "lucide-react";
import { ConfigProvider } from "antd";
import { Form, FormItem, FormMessage } from "@/components/ui/form";
import { ThemedButton } from "@/components/ui/themedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { CancelButton } from "@/components/ui/CancleButton";
import { useTheme } from "@/lib/context/ThemeContext";
import { toast } from "sonner";
import { AboutService } from "@/services/aboutServices";
import CKEditorField from "@/components/CkEditorfield";

interface IFormValues {
  title: string;
  description: string;
  mission?: string;
  vision?: string;
  years_exp: number;
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

export default function AboutForm({
  initialData,
  onSuccess,
  onClose,
  isOpen,
}: any) {
  const { primaryColor } = useTheme();
  const isUpdate = !!initialData;
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<IFormValues>({
    defaultValues: {
      title: "",
      description: "",
      mission: "",
      vision: "",
      years_exp: 0,
      image: null,
    },
  });

  const handleClose = () => {
    form.reset();
    setImagePreview(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const rawImage = initialData.image;
      setImagePreview(rawImage ? getImageUrl(rawImage) : null);

      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        mission: initialData.mission || "",
        vision: initialData.vision || "",
        years_exp: Number(initialData.years_exp) || 0,
        image: initialData.image || null,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        mission: "",
        vision: "",
        years_exp: 0,
        image: null,
      });
      setImagePreview(null);
    }
  }, [isOpen, initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be under 5MB");
        return;
      }
      form.setValue("image", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: IFormValues) => {
    setLoading(true);
    try {
      const fd = new FormData();

      Object.entries(values).forEach(([k, v]) => {
        if (k !== "image" && v !== undefined && v !== null) {
          fd.append(k, String(v));
        }
      });

      if (values.image instanceof File) {
        fd.append("image", values.image);
      } else if (typeof values.image === "string") {
        fd.append("image", values.image);
      }

      const targetId = initialData?.id || initialData?._id;

      if (isUpdate) {
        if (!targetId) {
          toast.error("Record ID not found!");
          return;
        }
        await AboutService.updateDetails(targetId, fd);
        toast.success("About section updated successfully!");
      } else {
        await AboutService.createDetails(fd);
        toast.success("About section created successfully!");
      }
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      toast.error(
        AboutService?.parseError?.(err) || "An error occurred"
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
        required: ["title"].includes(name) ? "This field is required" : false,
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
            onChange={(e) => {
              const val = type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
              field.onChange(val);
            }}
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
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 h-full z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Modal Container */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden font-mukta max-h-[90vh] flex flex-col">
          <ConfigProvider
            theme={{ token: { colorPrimary: primaryColor, borderRadius: 4 } }}
          >
            {/* Header */}
            <div className="bg-white px-5 py-3.5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Info size={16} style={{ color: primaryColor }} />
                {isUpdate ? "Edit About Details" : "New About Details"}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-red-500 hover:rotate-90 transition-transform p-1 rounded-full hover:bg-red-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 scrollbar-hide bg-white">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 space-y-5"
                >
                  {/* Featured Image Upload */}
                  <div className="flex flex-col items-center pb-4 border-b border-dashed border-gray-200">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-40 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50/80 cursor-pointer hover:bg-gray-100/80 transition-all relative group"
                      style={{
                        borderColor: imagePreview ? primaryColor : "#e5e7eb",
                      }}
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="About Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                            <Camera size={16} /> Change Image
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-400">
                          <Camera size={32} />
                          <span className="text-xs font-semibold">
                            Click to upload featured image
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-medium">
                            PNG, JPG, WEBP (Max 5MB)
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Title & Years of Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Field
                        name="title"
                        label="Title *"
                        placeholder="e.g. Who We Are"
                        icon={<FileText size={13} />}
                      />
                    </div>
                    <Field
                      name="years_exp"
                      label="Years of Experience"
                      type="number"
                      placeholder="0"
                      icon={<Award size={13} />}
                    />
                  </div>

                  {/* Description — CKEditor */}
                  <Controller
                    control={form.control}
                    name="description"
                    rules={{ required: "Description is required" }}
                    render={({ field, fieldState }) => (
                      <CKEditorField
                        label="Description *"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter detailed description..."
                        height={200}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* Mission & Vision Section — Dual CKEditors */}
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    {/* Mission */}
                    <Controller
                      control={form.control}
                      name="mission"
                      render={({ field, fieldState }) => (
                        <CKEditorField
                          label="Mission Statement"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Enter company mission statement..."
                          height={160}
                          error={fieldState.error?.message}
                        />
                      )}
                    />

                    {/* Vision */}
                    <Controller
                      control={form.control}
                      name="vision"
                      render={({ field, fieldState }) => (
                        <CKEditorField
                          label="Vision Statement"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Enter company vision statement..."
                          height={160}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 bg-white sticky bottom-0 z-10">
                    <CancelButton onClick={handleClose} disabled={loading} />
                    <ThemedButton type="submit" size="sm" disabled={loading}>
                      <div className="flex items-center gap-2 px-1">
                        {loading ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Save size={13} />
                        )}
                        <span>{isUpdate ? "Update" : "Create"}</span>
                      </div>
                    </ThemedButton>
                  </div>
                </form>
              </Form>
            </div>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}