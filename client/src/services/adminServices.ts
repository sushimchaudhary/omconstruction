// import axiosInstance from "@/lib/config/axios.config";

// export interface AdminPayload {
//   username: string;
//   password?: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   mobile_number: string;
//   address: string;
//   restaurant?: string;
//   branch?: string;
// }

// export const AdminServices = {
//   //  /api/auth/users/ को सट्टा /user/ वा /user प्रयोग गर्नुहोस्
//   getAdmins: async () => {
//     const res = await axiosInstance.get("/user");
//     return res.data?.data ?? res.data;
//   },

//   getAdmin: async (id: string) => {
//     const res = await axiosInstance.get(`/user/${id}`);
//     return res.data?.data ?? res.data;
//   },

//   createAdmin: async (data: AdminPayload) => {
//     const res = await axiosInstance.post("/user", {
//       ...data,
//       is_staff: true,
//       is_admin: true,
//     });
//     return res.data;
//   },

//   updateAdmin: async (id: string, data: AdminPayload) => {
//     const res = await axiosInstance.put(`/user/${id}`, data);
//     return res.data;
//   },

//   deleteAdmin: async (id: string) => {
//     const res = await axiosInstance.delete(`/user/${id}`);
//     return res.data;
//   },

//   toggleBlockAdmin: async (id: string) => {
//     const res = await axiosInstance.patch(`/user/${id}/block`);
//     return res.data;
//   },

//   parseError: (exception: any): string => {
//     if (exception.response?.data) {
//       const data = exception.response.data;
//       if (data.detail) return data.detail;
//       if (data.response) return data.response;
//       if (data.message) return data.message;
//       if (typeof data === "object") {
//         const firstKey = Object.keys(data)[0];
//         const firstError = data[firstKey];
//         return Array.isArray(firstError)
//           ? `${firstKey}: ${firstError[0]}`
//           : `${firstKey}: ${firstError}`;
//       }
//     }
//     return exception.message || "Something went wrong";
//   },
// };