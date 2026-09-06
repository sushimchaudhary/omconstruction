import axiosInstance from "@/lib/config/axios.config";

let cache: any = null;
let cachePromise: Promise<any> | null = null;

export const OrganizationServices = {
  parseError: (exception: any): string => {
    if (exception.response?.data) {
      const data = exception.response.data;
      if (data.response) return data.response;
      if (data.detail) return data.detail;
      if (data.message) return data.message;
    }
    return exception.message || "Something went wrong";
  },

  getDetails: async () => {
    if (cache !== null) return cache;
    if (cachePromise !== null) return cachePromise;

    cachePromise = axiosInstance
      .get("/organization")
      .then((res) => {
        cache = res.data;
        cachePromise = null;
        return cache;
      })
      .catch((err) => {
        cachePromise = null;
        throw err;
      });

    return cachePromise;
  },

  createDetails: async (data: FormData) => {
    const res = await axiosInstance.post("/organization", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    OrganizationServices.clearCache();
    return res.data;
  },

  updateDetails: async (id: string, data: FormData) => {
    const res = await axiosInstance.put(`/organization/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    OrganizationServices.clearCache();
    return res.data;
  },

  deleteDetails: async (id: string) => {
    const res = await axiosInstance.delete(`/organization/${id}`);
    OrganizationServices.clearCache();
    return res.data;
  },

  clearCache: () => {
    cache = null;
    cachePromise = null;
  },
};