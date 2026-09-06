import axiosInstance from "@/lib/config/axios.config";

let serviceCache: any = null;
let serviceCachePromise: Promise<any> | null = null;

export interface ServiceItem {
  _id: string;
  id?: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface GetDetailsArgs {
  id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const ServiceService = {
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
    let url = "/service";
    let queryParams = {};

    if (typeof args === "string") {
      url = `/service/${args}`;
      queryParams = oldParams || {};
    } else if (args && typeof args === "object") {
      const { id, ...rest } = args;
      if (id) url = `/service/${id}`;
      queryParams = rest;
    }

    const isBaseListCall = url === "/service" && Object.keys(queryParams).length === 0;

    if (isBaseListCall) {
      if (serviceCache !== null) return serviceCache;
      if (serviceCachePromise !== null) return serviceCachePromise;

      serviceCachePromise = axiosInstance
        .get(url, { params: queryParams })
        .then((res) => {
          serviceCache = res.data;
          serviceCachePromise = null;
          return serviceCache;
        })
        .catch((err) => {
          serviceCachePromise = null;
          throw err;
        });

      return serviceCachePromise;
    }

    const res = await axiosInstance.get(url, { params: queryParams });
    return res.data;
  },

  addDetails: async (data: FormData | any) => {
    const res = await axiosInstance.post("/service", data);
    ServiceService.clearCache();
    return res.data;
  },

  updateDetails: async (id: string, data: FormData | any) => {
    const res = await axiosInstance.put(`/service/${id}`, data);
    ServiceService.clearCache();
    return res.data;
  },

  deleteDetails: async (id: string) => {
    const res = await axiosInstance.delete(`/service/${id}`);
    ServiceService.clearCache();
    return res.data;
  },

  clearCache: () => {
    serviceCache = null;
    serviceCachePromise = null;
  },
};