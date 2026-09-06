// services/supportNoticeServices.ts
import axiosInstance from "@/lib/config/axios.config";

let noticeCache: any = null;
let noticeCachePromise: Promise<any> | null = null;

export interface SupportNoticeItem {
  _id: string;
  title: string;
  image: string | null;
  is_active: boolean;
  seen?: string[];
  restaurant: { _id: string; name: string } | null;
  branch: { _id: string; name: string } | null;
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

export const SupportNoticeServices = {


  // getDetails: async (params?: GetNoticeParams): Promise<SupportNoticeItem[]> => {
  //   const isBaseCall = !params || Object.keys(params).length === 0;

  //   // 🟢 Cache check
  //   if (isBaseCall) {
  //     if (noticeCache !== null) return noticeCache;
  //     if (noticeCachePromise !== null) return noticeCachePromise;

  //     noticeCachePromise = axiosInstance
  //       .get("/notices", { params })
  //       .then((res) => {
  //         noticeCache = res.data;
  //         noticeCachePromise = null;
  //         return noticeCache;
  //       })
  //       .catch((err) => {
  //         noticeCachePromise = null;
  //         throw err;
  //       });

  //     return noticeCachePromise;
  //   }

  //   const res = await axiosInstance.get("/notices", { params });
  //   return res.data;
  // },


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

  getUnseenCount: async () => {
    const res = await axiosInstance.get("/notices/unseen-count");
    return res.data;
  },

  markAllSeen: async () => {
    const res = await axiosInstance.post("/notices/mark-seen");
    SupportNoticeServices.clearCache();
    return res.data;
  },

  clearCache: () => {
    noticeCache = null;
    noticeCachePromise = null;
  },
};