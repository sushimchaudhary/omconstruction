"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Layers,
  Save,
  Loader2,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { ConfigProvider, Switch } from "antd";
import { Form, FormItem, FormMessage } from "@/components/ui/form";
import { ThemedButton } from "@/components/ui/themedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { CancelButton } from "@/components/ui/CancleButton";
import { useTheme } from "@/lib/context/ThemeContext";
import { toast } from "sonner";
import { ServiceService } from "@/services/servicesServices";
import CKEditorField from "@/components/CkEditorfield";

export default function ServiceFormModal({
  initialData,
  onSuccess,
  onClose,
  isOpen,
}: any) {
  const { primaryColor } = useTheme();
  const isUpdate = !!initialData;
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      is_active: true,
      image: null as any,
      icon: null as any,
    },
  });

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const handleClose = () => {
    form.reset();
    setImagePreview(null);
    setIconPreview(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setImagePreview(getImageUrl(initialData.image));
        setIconPreview(getImageUrl(initialData.icon));
        form.reset({
          title: initialData.title || "",
          description: initialData.description || "",
          is_active:
            typeof initialData.is_active === "boolean"
              ? initialData.is_active
              : true,
          image: null,
          icon: null,
        });
      } else {
        setImagePreview(null);
        setIconPreview(null);
        form.reset({
          title: "",
          description: "",
          is_active: true,
          image: null,
          icon: null,
        });
      }
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const r = new FileReader();
      r.onloadend = () => setImagePreview(r.result as string);
      r.readAsDataURL(file);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("icon", file);
      const r = new FileReader();
      r.onloadend = () => setIconPreview(r.result as string);
      r.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    form.setValue("image", null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeIcon = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIconPreview(null);
    form.setValue("icon", null);
    if (iconInputRef.current) iconInputRef.current.value = "";
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("description", values.description);
      fd.append("is_active", String(values.is_active));

      if (values.image instanceof File) {
        fd.append("image", values.image);
      }
      if (values.icon instanceof File) {
        fd.append("icon", values.icon);
      }

      const id = initialData?.id || initialData?._id;

      if (isUpdate && id) {
        await ServiceService.updateDetails(id, fd);
        toast.success("Service updated!");
      } else {
        await ServiceService.addDetails(fd);
        toast.success("Service created!");
      }

      ServiceService.clearCache();
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      toast.error(ServiceService.parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 h-full z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-2xl bg-white rounded shadow-md border border-gray-200 overflow-hidden font-mukta max-h-[92vh] flex flex-col">
          <ConfigProvider
            theme={{ token: { colorPrimary: primaryColor, borderRadius: 4 } }}
          >
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Layers size={15} style={{ color: primaryColor }} />
                {isUpdate ? "Edit Service" : "New Service"}
              </h2>
              <button
                onClick={handleClose}
                className="text-red-500 hover:rotate-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 scrollbar-hide">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="px-6 py-4 space-y-4"
                >
                  {/* File Upload Section: Image & Icon */}
                  <div className="grid grid-cols-3 gap-3 pb-3 border-b border-dashed border-gray-200">
                    {/* Image Field (2 columns) */}
                    <div className="col-span-3">
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Service Cover Image
                      </label>
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="relative w-full h-32 rounded border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all group"
                        style={{
                          borderColor: imagePreview ? primaryColor : "#e5e7eb",
                        }}
                      >
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all z-10"
                              title="Remove Image"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-gray-400">
                            <Camera size={26} />
                            <span className="text-[10px] font-bold uppercase">
                              Click to upload image
                            </span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>

                    {/* Icon Field (1 column) */}
                    {/* <div className="col-span-1">
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Service Icon
                      </label>
                      <div
                        onClick={() => iconInputRef.current?.click()}
                        className="relative w-full h-32 rounded border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all group"
                        style={{
                          borderColor: iconPreview ? primaryColor : "#e5e7eb",
                        }}
                      >
                        {iconPreview ? (
                          <>
                            <img
                              src={iconPreview}
                              alt="Icon Preview"
                              className="w-12 h-12 object-contain"
                            />
                            <button
                              type="button"
                              onClick={removeIcon}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all z-10"
                              title="Remove Icon"
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-gray-400 text-center px-1">
                            <ImageIcon size={24} />
                            <span className="text-[9px] font-bold uppercase">
                              Upload Icon
                            </span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={iconInputRef}
                        className="hidden"
                        accept="image/*,.svg"
                        onChange={handleIconChange}
                      />
                    </div> */}
                  </div>

                  {/* Title & Active Status */}
                  <div className="grid grid-cols-3 gap-3 items-end">
                    <div className="col-span-2">
                      <Controller
                        control={form.control}
                        name="title"
                        rules={{ required: "Service title is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <ThemedInput
                              label="Service Title"
                              icon={<Layers size={12} />}
                              placeholder="e.g. Architectural Design"
                              {...field}
                            />
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-1">
                      <Controller
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem className="flex flex-col justify-end h-full pb-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
                              <CheckCircle2 size={12} /> Active Status
                            </label>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={field.value}
                                onChange={(checked) => field.onChange(checked)}
                              />
                              <span className="text-xs text-gray-600">
                                {field.value ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Description — CKEditor */}
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <CKEditorField
                        label="Description"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Detailed description of the service..."
                        height={180}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* Footer Action Buttons */}
                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
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
            </div>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}