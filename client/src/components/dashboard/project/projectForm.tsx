// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { X, FolderKanban, FileText, Save, Loader2, Camera, MapPin, User, Calendar, Activity } from "lucide-react";
// import { ConfigProvider, Select, DatePicker } from "antd";
// import dayjs from "dayjs";
// import { Form, FormItem, FormMessage } from "@/components/ui/form";
// import { ThemedButton } from "@/components/ui/themedButton";
// import { ThemedInput } from "@/components/ui/ThemedInput";
// import { CancelButton } from "@/components/ui/CancleButton";
// import { useTheme } from "@/lib/context/ThemeContext";
// import { toast } from "sonner";
// import { ProjectsServices } from "@/services/projectsServices";
// import CKEditorField from "@/components/CkEditorfield";

// export function ProjectForm({ initialData, onSuccess, onClose, isOpen }: any) {
//   const { primaryColor } = useTheme();
//   const isUpdate = !!initialData;
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const form = useForm({
//     defaultValues: { 
//       title: "", 
//       description: "", 
//       location: "",
//       client_name: "",
//       status: "ongoing",
//       start_date: null as any,
//       end_date: null as any,
//       image: null as any 
//     },
//   });

//   const handleClose = () => {
//     form.reset();
//     setImagePreview(null);
//     onClose();
//   };

//   useEffect(() => {
//     if (isOpen) {
//       if (initialData) {
//         setImagePreview(initialData.image || null);
//         form.reset({
//           title: initialData.title || "",
//           description: initialData.description || "",
//           location: initialData.location || "",
//           client_name: initialData.client_name || "",
//           status: initialData.status || "ongoing",
//           start_date: initialData.start_date ? dayjs(initialData.start_date) : null,
//           end_date: initialData.end_date ? dayjs(initialData.end_date) : null,
//           image: null,
//         });
//       } else {
//         setImagePreview(null);
//         form.reset({ 
//           title: "", 
//           description: "", 
//           location: "",
//           client_name: "",
//           status: "ongoing",
//           start_date: null,
//           end_date: null,
//           image: null 
//         });
//       }
//     }
//   }, [initialData, isOpen]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       form.setValue("image", file);
//       const r = new FileReader();
//       r.onloadend = () => setImagePreview(r.result as string);
//       r.readAsDataURL(file);
//     }
//   };

//   const onSubmit = async (values: any) => {
//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("title", values.title);
//       fd.append("description", values.description);
//       if (values.location) fd.append("location", values.location);
//       if (values.client_name) fd.append("client_name", values.client_name);
//       if (values.status) fd.append("status", values.status);
      
//       if (values.start_date) {
//         fd.append("start_date", values.start_date.toISOString());
//       }
//       if (values.end_date) {
//         fd.append("end_date", values.end_date.toISOString());
//       }

//       if (values.image instanceof File) {
//         fd.append("image", values.image);
//       }

//       if (isUpdate) {
//         await ProjectsServices.updateDetails(initialData.id, fd);
//         toast.success("Project updated!");
//       } else {
//         await ProjectsServices.createDetails(fd);
//         toast.success("Project created!");
//       }
//       onSuccess?.();
//       handleClose();
//     } catch (err: any) {
//       toast.error(ProjectsServices.parseError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={handleClose}
//         className={`fixed inset-0 h-full z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
//           isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//       />

//       {/* Modal */}
//       <div
//         className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${
//           isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
//         }`}
//       >
//         <div className="w-full max-w-2xl bg-white rounded shadow-md border border-gray-200 overflow-hidden font-mukta max-h-[92vh] flex flex-col">
//           <ConfigProvider
//             theme={{ token: { colorPrimary: primaryColor, borderRadius: 4 } }}
//           >
//             {/* Header */}
//             <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
//               <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
//                 <FolderKanban size={15} style={{ color: primaryColor }} />
//                 {isUpdate ? "Edit Project" : "New Project"}
//               </h2>
//               <button
//                 onClick={handleClose}
//                 className="text-red-500 hover:rotate-90 transition-transform"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Scrollable body */}
//             <div className="overflow-y-auto flex-1 scrollbar-hide">
//               <Form {...form}>
//                 <form
//                   onSubmit={form.handleSubmit(onSubmit)}
//                   className="px-6 py-4 space-y-4"
//                 >
//                   {/* Image upload */}
//                   <div className="flex flex-col items-center pb-3 border-b border-dashed border-gray-200">
//                     <div
//                       onClick={() => fileInputRef.current?.click()}
//                       className="w-full h-36 rounded border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all"
//                       style={{ borderColor: imagePreview ? primaryColor : "#e5e7eb" }}
//                     >
//                       {imagePreview ? (
//                         <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
//                       ) : (
//                         <div className="flex flex-col items-center gap-2 text-gray-300">
//                           <Camera size={32} />
//                           <span className="text-[11px] font-bold uppercase">Click to upload image</span>
//                           <p className="text-[11px] text-gray-400 mt-2 font-bold uppercase">
//                             Project image (Max 5MB)
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                     />
//                   </div>

//                   {/* Title */}
//                   <Controller
//                     control={form.control}
//                     name="title"
//                     render={({ field }) => (
//                       <FormItem>
//                         <ThemedInput
//                           label="Project Title"
//                           icon={<FolderKanban size={12} />}
//                           placeholder="Enter project title"
//                           {...field}
//                         />
//                         <FormMessage className="text-[10px]" />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Description — CKEditor */}
//                   <Controller
//                     control={form.control}
//                     name="description"
//                     render={({ field, fieldState }) => (
//                       <CKEditorField
//                         label="Description"
//                         value={field.value}
//                         onChange={field.onChange}
//                         placeholder="Project description..."
//                         height={200}
//                         error={fieldState.error?.message}
//                       />
//                     )}
//                   />

//                   {/* Location & Client Name */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <Controller
//                       control={form.control}
//                       name="location"
//                       render={({ field }) => (
//                         <FormItem>
//                           <ThemedInput
//                             label="Location"
//                             icon={<MapPin size={12} />}
//                             placeholder="Location name"
//                             {...field}
//                           />
//                           <FormMessage className="text-[10px]" />
//                         </FormItem>
//                       )}
//                     />

//                     <Controller
//                       control={form.control}
//                       name="client_name"
//                       render={({ field }) => (
//                         <FormItem>
//                           <ThemedInput
//                             label="Client Name"
//                             icon={<User size={12} />}
//                             placeholder="Client name"
//                             {...field}
//                           />
//                           <FormMessage className="text-[10px]" />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* Status, Start Date & End Date */}
//                   <div className="grid grid-cols-3 gap-3">
//                     <Controller
//                       control={form.control}
//                       name="status"
//                       render={({ field }) => (
//                         <FormItem>
//                           <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
//                             <Activity size={12} /> Status
//                           </label>
//                           <Select
//                             {...field}
//                             className="w-full"
//                             options={[
//                               { value: "ongoing", label: "Ongoing" },
//                               { value: "completed", label: "Completed" },
//                               { value: "on_hold", label: "On Hold" },
//                             ]}
//                           />
//                           <FormMessage className="text-[10px]" />
//                         </FormItem>
//                       )}
//                     />

//                     <Controller
//                       control={form.control}
//                       name="start_date"
//                       render={({ field }) => (
//                         <FormItem>
//                           <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
//                             <Calendar size={12} /> Start Date
//                           </label>
//                           <DatePicker
//                             value={field.value}
//                             onChange={(date) => field.onChange(date)}
//                             className="w-full"
//                           />
//                           <FormMessage className="text-[10px]" />
//                         </FormItem>
//                       )}
//                     />

//                     <Controller
//                       control={form.control}
//                       name="end_date"
//                       render={({ field }) => (
//                         <FormItem>
//                           <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
//                             <Calendar size={12} /> End Date
//                           </label>
//                           <DatePicker
//                             value={field.value}
//                             onChange={(date) => field.onChange(date)}
//                             className="w-full"
//                           />
//                           <FormMessage className="text-[10px]" />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* Footer */}
//                   <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
//                     <CancelButton onClick={handleClose} disabled={loading} />
//                     <ThemedButton type="submit" size="sm" disabled={loading}>
//                       <div className="flex items-center gap-2">
//                         {loading ? (
//                           <Loader2 size={12} className="animate-spin" />
//                         ) : (
//                           <Save size={12} />
//                         )}
//                         <span>{isUpdate ? "Update" : "Create"}</span>
//                       </div>
//                     </ThemedButton>
//                   </div>
//                 </form>
//               </Form>
//             </div>
//           </ConfigProvider>
//         </div>
//       </div>
//     </>
//   );
// }



"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, FolderKanban, Save, Loader2, Camera, MapPin, User, Calendar, Activity, Images } from "lucide-react";
import { ConfigProvider, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { Form, FormItem, FormMessage } from "@/components/ui/form";
import { ThemedButton } from "@/components/ui/themedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { CancelButton } from "@/components/ui/CancleButton";
import { useTheme } from "@/lib/context/ThemeContext";
import { toast } from "sonner";
import { ProjectsServices } from "@/services/projectsServices";
import CKEditorField from "@/components/CkEditorfield";

export function ProjectForm({ initialData, onSuccess, onClose, isOpen }: any) {
  const { primaryColor } = useTheme();
  const isUpdate = !!initialData;
  const [loading, setLoading] = useState(false);

  // Single Image State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gallery States
  const [existingImages, setExistingImages] = useState<string[]>([]); // Server bata aayeko URLs
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]); // User le add gareko naya files
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]); // Naya files ko preview
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: { 
      title: "", 
      description: "", 
      location: "",
      client_name: "",
      status: "ongoing",
      start_date: null as any,
      end_date: null as any,
      image: null as any
    },
  });

  const handleClose = () => {
    form.reset();
    setImagePreview(null);
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setImagePreview(initialData.image || null);
        setExistingImages(initialData.images || []);
        setNewImageFiles([]);
        setNewImagePreviews([]);
        form.reset({
          title: initialData.title || "",
          description: initialData.description || "",
          location: initialData.location || "",
          client_name: initialData.client_name || "",
          status: initialData.status || "ongoing",
          start_date: initialData.start_date ? dayjs(initialData.start_date) : null,
          end_date: initialData.end_date ? dayjs(initialData.end_date) : null,
          image: null,
        });
      } else {
        setImagePreview(null);
        setExistingImages([]);
        setNewImageFiles([]);
        setNewImagePreviews([]);
        form.reset({ 
          title: "", 
          description: "", 
          location: "",
          client_name: "",
          status: "ongoing",
          start_date: null,
          end_date: null,
          image: null
        });
      }
    }
  }, [initialData, isOpen]);

  // Main Cover Image Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const r = new FileReader();
      r.onloadend = () => setImagePreview(r.result as string);
      r.readAsDataURL(file);
    }
  };

  // Gallery Naya Files Select गर्दा
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewImageFiles((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const r = new FileReader();
        r.onloadend = () => {
          setNewImagePreviews((prev) => [...prev, r.result as string]);
        };
        r.readAsDataURL(file);
      });
    }
  };

  // Purano (Existing) Image Hataune
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Naya Add Gareko Image Hataune
  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("description", values.description);
      if (values.location) fd.append("location", values.location);
      if (values.client_name) fd.append("client_name", values.client_name);
      if (values.status) fd.append("status", values.status);
      
      if (values.start_date) {
        fd.append("start_date", values.start_date.toISOString());
      }
      if (values.end_date) {
        fd.append("end_date", values.end_date.toISOString());
      }

      // Main Cover Image
      if (values.image instanceof File) {
        fd.append("image", values.image);
      }

      // Existing images JSON stringify गरेर पठाउने
      fd.append("existing_images", JSON.stringify(existingImages));

      // Naya added multiple files append गर्ने
      newImageFiles.forEach((file: File) => {
        fd.append("images", file);
      });

      if (isUpdate) {
        await ProjectsServices.updateDetails(initialData.id, fd);
        toast.success("Project updated!");
      } else {
        await ProjectsServices.createDetails(fd);
        toast.success("Project created!");
      }
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      toast.error(ProjectsServices.parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 h-full z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-2xl bg-white rounded shadow-md border border-gray-200 overflow-hidden font-mukta max-h-[92vh] flex flex-col">
          <ConfigProvider
            theme={{ token: { colorPrimary: primaryColor, borderRadius: 4 } }}
          >
            <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FolderKanban size={15} style={{ color: primaryColor }} />
                {isUpdate ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={handleClose}
                className="text-red-500 hover:rotate-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 scrollbar-hide">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="px-6 py-4 space-y-4"
                >
                  {/* Single Cover Image */}
                  <div className="flex flex-col items-center pb-3 border-b border-dashed border-gray-200">
                    <label className="text-xs font-semibold text-gray-700 self-start mb-1">
                      Main Cover Image
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 rounded border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all"
                      style={{ borderColor: imagePreview ? primaryColor : "#e5e7eb" }}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <Camera size={24} />
                          <span className="text-[11px] font-bold uppercase">Upload Cover Image</span>
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

                  {/* Gallery Images (Existing + New) */}
                  <div className="space-y-2 pb-3 border-b border-dashed border-gray-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Images size={14} /> Project Gallery Images
                      </label>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        + Add Images
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {/* Purana Images (Server Bata Aayeko) */}
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative h-20 rounded overflow-hidden border border-gray-200 group">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {/* Naya Add Gareka Images */}
                      {newImagePreviews.map((src, index) => (
                        <div key={`new-${index}`} className="relative h-20 rounded overflow-hidden border-2 border-blue-400 group">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      <div
                        onClick={() => galleryInputRef.current?.click()}
                        className="h-20 rounded border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition"
                      >
                        <Camera size={20} />
                        <span className="text-[10px] font-bold mt-1">+ Upload</span>
                      </div>
                    </div>

                    <input
                      type="file"
                      ref={galleryInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                    />
                  </div>

                  {/* Title */}
                  <Controller
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <ThemedInput
                          label="Project Title"
                          icon={<FolderKanban size={12} />}
                          placeholder="Enter project title"
                          {...field}
                        />
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <CKEditorField
                        label="Description"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Project description..."
                        height={180}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* Location & Client Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <Controller
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <ThemedInput
                            label="Location"
                            icon={<MapPin size={12} />}
                            placeholder="Location name"
                            {...field}
                          />
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="client_name"
                      render={({ field }) => (
                        <FormItem>
                          <ThemedInput
                            label="Client Name"
                            icon={<User size={12} />}
                            placeholder="Client name"
                            {...field}
                          />
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Status & Dates */}
                  <div className="grid grid-cols-3 gap-3">
                    <Controller
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                            <Activity size={12} /> Status
                          </label>
                          <Select
                            {...field}
                            className="w-full"
                            options={[
                              { value: "ongoing", label: "Ongoing" },
                              { value: "completed", label: "Completed" },
                              { value: "on_hold", label: "On Hold" },
                            ]}
                          />
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                            <Calendar size={12} /> Start Date
                          </label>
                          <DatePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            className="w-full"
                          />
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                            <Calendar size={12} /> End Date
                          </label>
                          <DatePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            className="w-full"
                          />
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

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