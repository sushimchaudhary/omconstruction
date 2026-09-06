import axiosInstance from "@/lib/config/axios.config";

let staffCache: any = null;
let staffCachePromise: Promise<any> | null = null;

interface GetDetailsArgs {
  id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const StaffServices = {
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
    let url = "/staff/";
    let queryParams = {};

    if (typeof args === "string") {
      url = `/staff/${args}/`;
      queryParams = oldParams || {};
    } else if (args && typeof args === "object") {
      const { id, ...rest } = args;
      if (id) url = `/staff/${id}/`;
      queryParams = rest;
    }

    const isBaseListCall = url === "/staff/" && Object.keys(queryParams).length === 0;

    if (isBaseListCall) {
      if (staffCache !== null) return staffCache;
      if (staffCachePromise !== null) return staffCachePromise;

      staffCachePromise = axiosInstance
        .get(url, { params: queryParams })
        .then((res) => {
          staffCache = res.data;
          staffCachePromise = null;
          return staffCache;
        })
        .catch((err) => {
          staffCachePromise = null;
          throw err;
        });

      return staffCachePromise;
    }

    const res = await axiosInstance.get(url, { params: queryParams });
    return res.data;
  },

  createDetails: async (data: FormData) => {
    const res = await axiosInstance.post("/staff/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    StaffServices.clearCache();
    return res.data;
  },

  updateDetails: async (id: string, data: FormData) => {
    const res = await axiosInstance.patch(`/staff/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    StaffServices.clearCache();
    return res.data;
  },

  deleteDetails: async (id: string) => {
    const res = await axiosInstance.delete(`/staff/${id}/`);
    StaffServices.clearCache();
    return res.data;
  },

  clearCache: () => {
    staffCache = null;
    staffCachePromise = null;
  },
};