

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import {
//   Pencil,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Inbox,
//   SearchX,
//   Mail,
//   Phone,
//   MapPin,
//   Utensils,
//   Store,
//   ShieldCheck,
//   Calendar,
//   UserCog,
//   Ban,
//   ShieldOff,
//   MoreVertical,
//   Lock,
//   Clock,
//   AlertCircle,
//   CheckCircle2,
// } from "lucide-react";
// import { toast } from "sonner";
// import Avatar from "antd/es/avatar/Avatar";
// import { AdminServices } from "@/services/adminServices";
// import { RestaurantServices } from "@/services/restaurantServices";
// import { BranchServices } from "@/services/baranchServices";
// import ConfirmModal from "@/components/delete/confirmModel";
// import TableLoadingSkeleton from "../dashboard/tableLoadingSkeleton";

// const PAGE_SIZE = 20;

// // Sub-component for 3-dot vertical action dropdown
// function ActionDropdown({
//   item,
//   isSuperUser,
//   isBlocked,
//   onEdit,
//   openBlockModal,
//   setDeleteId,
//   setIsModalOpen,
//   setSelectedIds,
// }: any) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [coords, setCoords] = useState<{ top: number; left: number }>({
//     top: 0,
//     left: 0,
//   });
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const MENU_WIDTH = 144;

//   const computePosition = () => {
//     const btn = buttonRef.current;
//     if (!btn) return;
//     const rect = btn.getBoundingClientRect();
//     let left = rect.right - MENU_WIDTH;
//     if (left < 8) left = 8;
//     const maxLeft = window.innerWidth - MENU_WIDTH - 8;
//     if (left > maxLeft) left = maxLeft;
//     setCoords({
//       top: rect.bottom + window.scrollY + 4,
//       left: left + window.scrollX,
//     });
//   };

//   const toggleOpen = () => {
//     if (isSuperUser) return;
//     if (!isOpen) computePosition();
//     setIsOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node;
//       if (
//         buttonRef.current &&
//         !buttonRef.current.contains(target) &&
//         menuRef.current &&
//         !menuRef.current.contains(target)
//       ) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!isOpen) return;
//     const handleReposition = () => computePosition();
//     window.addEventListener("scroll", handleReposition, true);
//     window.addEventListener("resize", handleReposition);
//     return () => {
//       window.removeEventListener("scroll", handleReposition, true);
//       window.removeEventListener("resize", handleReposition);
//     };
//   }, [isOpen]);

//   const itemId = item.id || item._id;

//   if (isSuperUser) {
//     return (
//       <button
//         disabled
//         className="p-1.5 text-gray-300 cursor-not-allowed rounded-md"
//         title="Superadmin account is protected"
//       >
//         <Lock size={14} />
//       </button>
//     );
//   }

//   return (
//     <div className="relative inline-block text-right">
//       <button
//         ref={buttonRef}
//         onClick={toggleOpen}
//         className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
//         title="Actions"
//       >
//         <MoreVertical size={14} />
//       </button>

//       {isOpen &&
//         createPortal(
//           <div
//             ref={menuRef}
//             style={{
//               position: "absolute",
//               top: coords.top,
//               left: coords.left,
//               width: MENU_WIDTH,
//               zIndex: 9999,
//             }}
//             className="bg-white rounded-md shadow-lg border border-gray-200 py-1 text-left text-xs font-medium animate-in fade-in zoom-in-95 duration-100"
//           >
//             <button
//               onClick={() => {
//                 setIsOpen(false);
//                 onEdit(item);
//               }}
//               className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//             >
//               <Pencil size={13} />
//               <span>Edit</span>
//             </button>

//             <button
//               onClick={() => {
//                 setIsOpen(false);
//                 openBlockModal(item);
//               }}
//               className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
//                 isBlocked
//                   ? "text-green-600 hover:bg-green-50"
//                   : "text-amber-600 hover:bg-amber-50"
//               }`}
//             >
//               <Ban size={13} />
//               <span>{isBlocked ? "Unblock" : "Block"}</span>
//             </button>

//             <div className="my-1 border-t border-gray-100" />

//             <button
//               onClick={() => {
//                 setIsOpen(false);
//                 setSelectedIds([]);
//                 setDeleteId(itemId);
//                 setIsModalOpen(true);
//               }}
//               className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors text-red-600 hover:bg-red-50"
//             >
//               <Trash2 size={13} />
//               <span>Delete</span>
//             </button>
//           </div>,
//           document.body,
//         )}
//     </div>
//   );
// }

// export default function AdminTable({
//   onEdit,
//   refreshTrigger,
//   searchQuery = "",
// }: any) {
//   const [dataList, setDataList] = useState<any[]>([]);
//   const [restaurants, setRestaurants] = useState<any[]>([]);
//   const [branches, setBranches] = useState<any[]>([]);
//   const [filteredData, setFilteredData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<any[]>([]);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteId, setDeleteId] = useState<any>(null);

//   const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
//   const [blockTarget, setBlockTarget] = useState<any>(null);
//   const [blockLoading, setBlockLoading] = useState(false);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [adminRes, restaurantRes, branchRes] = await Promise.all([
//         AdminServices.getAdmins(),
//         RestaurantServices.getRestaurants(),
//         BranchServices.getBranches(),
//       ]);
//       const aList = Array.isArray(adminRes)
//         ? adminRes
//         : (adminRes as any)?.results || (adminRes as any)?.data || [];
//       const rList = Array.isArray(restaurantRes)
//         ? restaurantRes
//         : (restaurantRes as any)?.results || (restaurantRes as any)?.data || [];
//       const bList = Array.isArray(branchRes)
//         ? branchRes
//         : (branchRes as any)?.results || (branchRes as any)?.data || [];
//       setRestaurants(rList);
//       setBranches(bList);
//       setDataList([...aList].reverse());
//     } catch {
//       toast.error("Failed to load admins");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [refreshTrigger]);

//   useEffect(() => {
//     const q = searchQuery.toLowerCase();
//     setFilteredData(
//       dataList.filter(
//         (i) =>
//           i.username?.toLowerCase().includes(q) ||
//           i.first_name?.toLowerCase().includes(q) ||
//           i.last_name?.toLowerCase().includes(q) ||
//           i.email?.toLowerCase().includes(q) ||
//           i.mobile_number?.toLowerCase().includes(q) ||
//           i.role?.toLowerCase().includes(q) ||
//           i.address?.toLowerCase().includes(q),
//       ),
//     );
//     setCurrentPage(1);
//     setSelectedIds([]);
//   }, [searchQuery, dataList]);

//   const paginated = filteredData.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE,
//   );
//   const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

//   // Restaurant Object return गर्ने Helper Function
//   const getRestaurantObj = (id: string | null) => {
//     if (!id) return null;
//     return (
//       restaurants.find((r) => String(r.id || r._id) === String(id)) || null
//     );
//   };

//   // Branch Object (with subscription details) return गर्ने Helper Function 👈
//   const getBranchObj = (id: string | null) => {
//     if (!id) return null;
//     return branches.find((b) => String(b.id || b._id) === String(id)) || null;
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const isItemSuperUser = (item: any) =>
//     item.role === "superadmin" || item.super_user === true;

//   const handleSelectAll = () => {
//     const selectableItems = paginated.filter((i) => !isItemSuperUser(i));
//     if (selectedIds.length === selectableItems.length) {
//       setSelectedIds([]);
//     } else {
//       const allIds = selectableItems.map((i) => i.id || i._id);
//       setSelectedIds(allIds);
//       setDeleteId(null);
//       setIsModalOpen(true);
//     }
//   };

//   const handleSelectOne = (id: any, isSuperUser: boolean) => {
//     if (isSuperUser) return;
//     setSelectedIds((p) =>
//       p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
//     );
//   };

//   const handleConfirmDelete = async () => {
//     const ids =
//       selectedIds.length > 0 ? selectedIds : deleteId ? [deleteId] : [];
//     if (!ids.length) return;
//     try {
//       setDeleteLoading(true);
//       await Promise.all(ids.map((id) => AdminServices.deleteAdmin(id)));
//       toast.success(`${ids.length} record(s) deleted`);
//       setDataList((p) => p.filter((i) => !ids.includes(i.id || i._id)));
//       setIsModalOpen(false);
//       setSelectedIds([]);
//     } catch {
//       toast.error("Delete failed");
//     } finally {
//       setDeleteLoading(false);
//       setDeleteId(null);
//     }
//   };

//   const openBlockModal = (item: any) => {
//     setBlockTarget(item);
//     setIsBlockModalOpen(true);
//   };

//   const handleConfirmBlock = async () => {
//     if (!blockTarget) return;
//     const targetId = blockTarget.id || blockTarget._id;
//     try {
//       setBlockLoading(true);
//       const res = await AdminServices.toggleBlockAdmin(targetId);
//       toast.success(res?.response || "Status updated");
//       setDataList((p) =>
//         p.map((i) =>
//           (i.id || i._id) === targetId
//             ? { ...i, is_blocked: res?.is_blocked ?? !i.is_blocked }
//             : i,
//         ),
//       );
//       setIsBlockModalOpen(false);
//       setBlockTarget(null);
//     } catch (err: any) {
//       toast.error(
//         err?.response?.data?.response || "Failed to update block status",
//       );
//     } finally {
//       setBlockLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-3">
//       <div className="bg-white rounded shadow-sm border border-gray-200">
//         <div className="overflow-x-auto max-h-[480px] scrollbar-hide relative">
//           <table className="w-full text-left border-separate border-spacing-0">
//             <thead className="sticky top-0 z-30 shadow-sm">
//               <tr className="bg-[#f5f6fa]">
//                 <th className="px-2 py-1.5 w-10 text-center">
//                   <input
//                     type="checkbox"
//                     className="rounded border-gray-300 cursor-pointer"
//                     checked={
//                       selectedIds.length ===
//                         paginated.filter((i) => !isItemSuperUser(i)).length &&
//                       paginated.filter((i) => !isItemSuperUser(i)).length > 0
//                     }
//                     onChange={handleSelectAll}
//                   />
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase">
//                   S.N.
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase">
//                   Admin
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase">
//                   Contact
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase">
//                   Role
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase">
//                   Restaurant
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase">
//                   Assigned Branch
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase">
//                   Created Date
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase">
//                   Status
//                 </th>
//                 <th className="px-2 py-1.5 text-[11px] font-bold text-[#8094ae] uppercase text-right w-16">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <TableLoadingSkeleton rows={5} cols={10} />
//               ) : paginated.length === 0 ? (
//                 <tr>
//                   <td colSpan={10} className="text-center py-16">
//                     <div className="flex flex-col items-center gap-2">
//                       {searchQuery ? (
//                         <SearchX size={32} className="text-rose-300" />
//                       ) : (
//                         <Inbox size={32} className="text-gray-200" />
//                       )}
//                       <span className="text-sm font-bold text-[#364a63]">
//                         {searchQuery ? "No results found." : "No admins yet."}
//                       </span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 paginated.map((item, index) => {
//                   const itemId = item.id || item._id;
//                   const isSelected = selectedIds.includes(itemId);
//                   const isSuperUser = isItemSuperUser(item);
//                   const isBlocked = item.is_blocked === true;

//                   const restId =
//                     item.restaurant_id ||
//                     (typeof item.restaurant === "object"
//                       ? item.restaurant?.id || item.restaurant?._id
//                       : item.restaurant);
//                   const brId =
//                     item.branch_id ||
//                     (typeof item.branch === "object"
//                       ? item.branch?.id || item.branch?._id
//                       : item.branch);

//                   const restaurantObj = getRestaurantObj(restId);
//                   // 👈 Branch record and subscription fetched
//                   const branchObj = getBranchObj(brId);
//                   const branchSub = branchObj?.subscription;

//                   return (
//                     <tr
//                       key={itemId}
//                       className={`transition-colors ${
//                         isSuperUser
//                           ? "bg-gray-100/70 opacity-60 cursor-not-allowed select-none"
//                           : isSelected
//                             ? "bg-blue-50/40 hover:bg-gray-50"
//                             : isBlocked
//                               ? "bg-red-50/30 hover:bg-gray-50"
//                               : "hover:bg-gray-50"
//                       }`}
//                     >
//                       <td className="px-2 py-1.5 text-center">
//                         <input
//                           type="checkbox"
//                           className="rounded border-gray-300 cursor-not-allowed"
//                           checked={isSelected}
//                           disabled={isSuperUser}
//                           onChange={() => handleSelectOne(itemId, isSuperUser)}
//                         />
//                       </td>
//                       <td className="px-2 py-1.5 text-[10px] text-[#526484]">
//                         {(currentPage - 1) * PAGE_SIZE + index + 1}.
//                       </td>

//                       <td className="px-2 py-1.5 min-w-[180px]">
//                         <div className="flex items-center gap-3">
//                           {/* <Avatar
//                             icon={<UserCog size={14} />}
//                             size={32}
//                             shape="circle"
//                             className="border border-gray-100 shadow-sm bg-gray-50 text-blue-600 shrink-0"
//                           /> */}
//                           <div className="flex flex-col">
//                             <span className="text-[11px] text-[#364a63] font-bold uppercase">
//                               {item.first_name || item.username}{" "}
//                               {item.last_name || ""}
//                             </span>
//                             <span className="text-[10px] text-[#8094ae]">
//                               @{item.username}
//                             </span>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-2 py-1.5 min-w-[160px]">
//                         <div className="flex flex-col gap-0.5">
//                           <span className="text-[11px] text-[#526484] flex items-center gap-1">
//                             <Mail size={9} /> {item.email || "N/A"}
//                           </span>
//                           <span className="text-[10px] text-[#8094ae] flex items-center gap-1">
//                             <Phone size={9} /> {item.mobile_number || "N/A"}
//                             <MapPin size={9} className="ml-1" />{" "}
//                             {item.address || restaurantObj?.address || "N/A"}                          </span>
//                         </div>
//                       </td>

//                       <td className="px-2 py-1.5 text-[11px] text-[#526484]">
//                         <span
//                           className={`inline-flex items-center gap-1 font-semibold capitalize px-2 py-0.5 rounded-full text-[10px] ${
//                             isSuperUser
//                               ? "bg-amber-100 text-amber-700 border border-amber-200"
//                               : item.role?.toLowerCase() === "admin"
//                                 ? "bg-purple-100 text-purple-700 border border-purple-200" // 👈 Role 'admin' हुँदा Purple Color
//                                 : "bg-slate-100 text-slate-600 border border-slate-200" // 👈 Role 'staff' वा अरू हुँदा Slate Gray
//                           }`}
//                         >
//                           <ShieldCheck
//                             size={10}
//                             className={
//                               isSuperUser
//                                 ? "text-amber-500"
//                                 : item.role?.toLowerCase() === "admin"
//                                   ? "text-purple-600"
//                                   : "text-slate-500"
//                             }
//                           />
//                           {item.role || "N/A"}
//                         </span>
//                       </td>

//                       {/* Restaurant Column */}
//                       <td className="px-2 py-1.5 text-[11px] text-[#526484]">
//                         {isSuperUser ? (
//                           <span className="flex items-center gap-1">
//                             <Utensils size={9} /> N/A
//                           </span>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             {restaurantObj?.logo ? (
//                               <img
//                                 src={restaurantObj.logo}
//                                 alt={restaurantObj.name}
//                                 className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
//                               />
//                             ) : (
//                               <Utensils
//                                 size={12}
//                                 className="text-gray-400 shrink-0"
//                               />
//                             )}
//                             <span className="font-medium text-[#364a63] capitalize">
//                               {restaurantObj?.name || "N/A"}
//                             </span>
//                           </div>
//                         )}
//                       </td>

//                       {/* 👈 Assigned Branch Column (Includes Branch Name + Subscription Badge) */}
//                       <td className="px-2 py-1.5 text-[11px] text-[#526484]">
//                         {isSuperUser ? (
//                           <span className="flex items-center gap-1">
//                             <Store size={9} /> All Branches
//                           </span>
//                         ) : branchObj ? (
//                           <div className="flex flex-col gap-1">
//                             <div className="flex items-center gap-1.5">
//                               <Store
//                                 size={12}
//                                 className="text-blue-600 shrink-0"
//                               />
//                               <span className="font-bold text-[#364a63] uppercase">
//                                 {branchObj.name}
//                               </span>
//                             </div>

//                             {/* Branch Subscription Badge Display */}
//                             {branchSub ? (
//                               <div className="flex items-center gap-1">
//                                 <span
//                                   className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full capitalize w-fit ${
//                                     branchSub.is_expired
//                                       ? "bg-rose-100 text-rose-700 border border-rose-200"
//                                       : branchSub.status === "trial"
//                                         ? "bg-amber-100 text-amber-700 border border-amber-200"
//                                         : "bg-emerald-100 text-emerald-700 border border-emerald-200"
//                                   }`}
//                                 >
//                                   {branchSub.is_expired ? (
//                                     <AlertCircle size={9} />
//                                   ) : branchSub.status === "trial" ? (
//                                     <Clock size={9} />
//                                   ) : (
//                                     <CheckCircle2 size={9} />
//                                   )}
//                                   {branchSub.is_expired
//                                     ? "Expired"
//                                     : branchSub.status}
//                                 </span>
//                                 {!branchSub.is_expired &&
//                                   branchSub.days_left !== undefined && (
//                                     <span className="text-[9px] text-gray-500 font-medium">
//                                       ({branchSub.days_left}d left)
//                                     </span>
//                                   )}
//                               </div>
//                             ) : (
//                               <span className="text-[9px] text-gray-400">
//                                 No Plan
//                               </span>
//                             )}
//                           </div>
//                         ) : (
//                           <span className="text-[10px] text-gray-400">
//                             Unassigned
//                           </span>
//                         )}
//                       </td>

//                       <td className="px-2 py-1.5 text-[11px] text-[#526484]">
//                         <span className="flex items-center gap-1 whitespace-nowrap">
//                           <Calendar size={9} /> {formatDate(item.createdAt)}
//                         </span>
//                       </td>

//                       <td className="px-2 py-1.5">
//                         <span
//                           className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
//                             isBlocked
//                               ? "bg-red-100 text-red-600"
//                               : "bg-green-100 text-green-600"
//                           }`}
//                         >
//                           {isBlocked ? (
//                             <>
//                               <ShieldOff size={9} /> Blocked
//                             </>
//                           ) : (
//                             <>
//                               <ShieldCheck size={9} /> Active
//                             </>
//                           )}
//                         </span>
//                       </td>

//                       <td className="px-2 py-1.5 text-right">
//                         <ActionDropdown
//                           item={item}
//                           isSuperUser={isSuperUser}
//                           isBlocked={isBlocked}
//                           onEdit={onEdit}
//                           openBlockModal={openBlockModal}
//                           setDeleteId={setDeleteId}
//                           setIsModalOpen={setIsModalOpen}
//                           setSelectedIds={setSelectedIds}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {!loading && filteredData.length > 0 && (
//           <div className="flex items-center justify-between px-6 py-1.5 border-t border-gray-300 bg-[#f5f6fa]">
//             <span className="text-[11px] text-[#8094ae]">
//               Showing {(currentPage - 1) * PAGE_SIZE + 1}–
//               {Math.min(currentPage * PAGE_SIZE, filteredData.length)} of{" "}
//               {filteredData.length}
//             </span>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="p-1 disabled:opacity-30"
//               >
//                 <ChevronLeft size={14} />
//               </button>
//               <span className="text-[11px] font-bold px-2">
//                 {currentPage} / {totalPages}
//               </span>
//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(p + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="p-1 disabled:opacity-30"
//               >
//                 <ChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedIds.length > 0 && (
//         <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
//           <span className="text-xs font-bold text-red-600 uppercase">
//             {selectedIds.length} Selected
//           </span>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white rounded text-[11px] font-bold hover:bg-red-600 active:scale-95"
//           >
//             <Trash2 size={12} /> Delete Selected
//           </button>
//         </div>
//       )}

//       <ConfirmModal
//         isOpen={isModalOpen}
//         title={
//           selectedIds.length > 0 ? "Delete Selected Admins?" : "Remove Admin?"
//         }
//         message={
//           selectedIds.length > 0
//             ? `Are you sure you want to delete ${selectedIds.length} admins? This will remove all associated data.`
//             : "Are you sure you want to delete this admin? This action cannot be undone."
//         }
//         onConfirm={handleConfirmDelete}
//         onCancel={() => {
//           setIsModalOpen(false);
//           setDeleteId(null);
//         }}
//         loading={deleteLoading}
//       />

//       <ConfirmModal
//         isOpen={isBlockModalOpen}
//         title={blockTarget?.is_blocked ? "Unblock Admin?" : "Block Admin?"}
//         message={
//           blockTarget?.is_blocked
//             ? `Are you sure you want to unblock ${blockTarget?.username}? They will be able to log in again.`
//             : `Are you sure you want to block ${blockTarget?.username}? They will not be able to log in until unblocked.`
//         }
//         onConfirm={handleConfirmBlock}
//         onCancel={() => {
//           setIsBlockModalOpen(false);
//           setBlockTarget(null);
//         }}
//         loading={blockLoading}
//       />
//     </div>
//   );
// }
