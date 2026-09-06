import axiosInstance from "@/lib/config/axios.config";

let noticeCache: any = null;
let noticeCachePromise: Promise<any> | null = null;

export interface NoticeUser {
  _id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
}

export interface NoticeItem {
  _id: string;
  id?: string;
  title: string;
  description?: string; // 🟢 Added
  image?: string;
  is_active: boolean;
  restaurant?: { _id: string; name: string };
  branch?: { _id: string; name: string };
  seen?: NoticeUser[]; // 🟢 Added
  createdAt: string;
  updatedAt: string;
}

interface GetDetailsArgs {
  id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetNoticeParams {
  restaurant?: string;
  branch?: string;
  search?: string;
}

export const NoticeServices = {
  parseError: (exception: any): string => {
    if (exception.response?.data) {
      const data = exception.response.data;
      if (data.detail) return data.detail;
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

  getDetails: async (args?: GetDetailsArgs | string, oldParams?: any) => {
    let url = "/notices";
    let queryParams = {};

    if (typeof args === "string") {
      url = `/notices/${args}`;
      queryParams = oldParams || {};
    } else if (args && typeof args === "object") {
      const { id, ...rest } = args;
      if (id) url = `/notices/${id}`;
      queryParams = rest;
    }

    const isBaseListCall = url === "/notices" && Object.keys(queryParams).length === 0;

    if (isBaseListCall) {
      if (noticeCache !== null) return noticeCache;
      if (noticeCachePromise !== null) return noticeCachePromise;

      noticeCachePromise = axiosInstance
        .get(url, { params: queryParams })
        .then((res) => {
          noticeCache = res.data;
          noticeCachePromise = null;
          return noticeCache;
        })
        .catch((err) => {
          noticeCachePromise = null;
          throw err;
        });

      return noticeCachePromise;
    }

    const res = await axiosInstance.get(url, { params: queryParams });
    return res.data;
  },

  createDetails: async (data: FormData | any) => {
    const res = await axiosInstance.post("/notices", data);
    NoticeServices.clearCache();
    return res.data;
  },

  updateDetails: async (id: string, data: FormData | any) => {
    const res = await axiosInstance.patch(`/notices/${id}`, data);
    NoticeServices.clearCache();
    return res.data;
  },

  // 🟢 Mark notice as seen by current user
  markAsSeen: async (id: string) => {
    const res = await axiosInstance.patch(`/notices/${id}/seen`);
    NoticeServices.clearCache();
    return res.data;
  },

  deleteDetails: async (id: string) => {
    const res = await axiosInstance.delete(`/notices/${id}`);
    NoticeServices.clearCache();
    return res.data;
  },

  clearCache: () => {
    noticeCache = null;
    noticeCachePromise = null;
  },
};