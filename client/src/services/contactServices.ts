import axiosInstance from "@/lib/config/axios.config";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  response?: string;
  data: T;
}

let contactCache: ApiResponse<ContactMessage[]> | null = null;
let contactCachePromise: Promise<ApiResponse<ContactMessage[]>> | null = null;

export const ContactServices = {
  // Error Parser for backend response format
  parseError: (exception: any): string => {
    if (exception.response?.data) {
      const data = exception.response.data;
      if (data.response) return data.response;
      if (data.message) return data.message;
      if (typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstError = data[firstKey];
        return Array.isArray(firstError)
          ? `${firstKey}: ${firstError[0]}`
          : `${firstKey}: ${firstError}`;
      }
    }
    return exception.message || "Something went wrong";
  },

  // 1. GET ALL CONTACT MESSAGES (Admin) - Supports ?is_read=true/false
  getList: async (params?: { is_read?: boolean }) => {
    const isBaseListCall = !params || Object.keys(params).length === 0;

    if (isBaseListCall) {
      if (contactCache !== null) return contactCache;
      if (contactCachePromise !== null) return contactCachePromise;

      contactCachePromise = axiosInstance
        .get<ApiResponse<ContactMessage[]>>("/contact", { params })
        .then((res) => {
          contactCache = res.data;
          contactCachePromise = null;
          return contactCache;
        })
        .catch((err) => {
          contactCachePromise = null;
          throw err;
        });

      return contactCachePromise;
    }

    const res = await axiosInstance.get<ApiResponse<ContactMessage[]>>("/contact", { params });
    return res.data;
  },

  // 2. GET SINGLE MESSAGE BY ID (Admin)
  getById: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<ContactMessage>>(`/contact/${id}`);
    return res.data;
  },

  // 3. CREATE / SUBMIT CONTACT MESSAGE (Public)
  create: async (data: ContactPayload) => {
    const res = await axiosInstance.post<ApiResponse<ContactMessage>>("/contact", data);
    ContactServices.clearCache();
    return res.data;
  },

  // 4. TOGGLE READ/UNREAD STATUS (Admin - PATCH /contact/:id/read)
  toggleReadStatus: async (id: string) => {
    const res = await axiosInstance.patch<ApiResponse<ContactMessage>>(`/contact/${id}/read`);
    ContactServices.clearCache();
    return res.data;
  },

  // 5. DELETE CONTACT MESSAGE (Admin - DELETE /contact/:id)
  delete: async (id: string) => {
    const res = await axiosInstance.delete<{ response: string }>(`/contact/${id}`);
    ContactServices.clearCache();
    return res.data;
  },

  // Clear in-memory cache
  clearCache: () => {
    contactCache = null;
    contactCachePromise = null;
  },
};