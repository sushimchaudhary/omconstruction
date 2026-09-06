// import axiosInstance from "@/lib/config/axios.config";

// let aboutCache: any = null;
// let aboutCachePromise: Promise<any> | null = null;

// export interface AboutItem {
//   _id: string;
//   id?: string;
//   title?: string;
//   description?: string;
//   image?: string;
//   is_active?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface GetDetailsArgs {
//   id?: string;
//   search?: string;
//   page?: number;
//   limit?: number;
// }

// export const AboutService = {
//   parseError: (exception: any): string => {
//     if (exception.response?.data) {
//       const data = exception.response.data;
//       if (data.detail) return data.detail;
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

//   getDetails: async (args?: GetDetailsArgs | string, oldParams?: any) => {
//     let url = "/about";
//     let queryParams = {};

//     if (typeof args === "string") {
//       url = `/about/${args}`;
//       queryParams = oldParams || {};
//     } else if (args && typeof args === "object") {
//       const { id, ...rest } = args;
//       if (id) url = `/about/${id}`;
//       queryParams = rest;
//     }

//     const isBaseListCall = url === "/about" && Object.keys(queryParams).length === 0;

//     if (isBaseListCall) {
//       if (aboutCache !== null) return aboutCache;
//       if (aboutCachePromise !== null) return aboutCachePromise;

//       aboutCachePromise = axiosInstance
//         .get(url, { params: queryParams })
//         .then((res) => {
//           aboutCache = res.data;
//           aboutCachePromise = null;
//           return aboutCache;
//         })
//         .catch((err) => {
//           aboutCachePromise = null;
//           throw err;
//         });

//       return aboutCachePromise;
//     }

//     const res = await axiosInstance.get(url, { params: queryParams });
//     return res.data;
//   },

//   createDetails: async (data: FormData | any) => {
//     const res = await axiosInstance.post("/about", data);
//     AboutService.clearCache();
//     return res.data;
//   },

//   updateDetails: async (id: string, data: FormData | any) => {
//     const res = await axiosInstance.put(`/about/${id}`, data);
//     AboutService.clearCache();
//     return res.data;
//   },

//   deleteDetails: async (id: string) => {
//     const res = await axiosInstance.delete(`/about/${id}`);
//     AboutService.clearCache();
//     return res.data;
//   },

//   clearCache: () => {
//     aboutCache = null;
//     aboutCachePromise = null;
//   },
// };


import axiosInstance from "@/lib/config/axios.config";

let aboutCache: any = null;
let aboutCachePromise: Promise<any> | null = null;

export interface AboutItem {
  _id: string;
  id?: string;
  title?: string;
  description?: string;
  mission?: string;
  vision?: string;
  years_exp?: number;
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

export const AboutService = {
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
    let url = "/about";
    let queryParams = {};

    if (typeof args === "string") {
      url = `/about/${args}`;
      queryParams = oldParams || {};
    } else if (args && typeof args === "object") {
      const { id, ...rest } = args;
      if (id) url = `/about/${id}`;
      queryParams = rest;
    }

    const isBaseListCall = url === "/about" && Object.keys(queryParams).length === 0;

    if (isBaseListCall) {
      if (aboutCache !== null) return aboutCache;
      if (aboutCachePromise !== null) return aboutCachePromise;

      aboutCachePromise = axiosInstance
        .get(url, { params: queryParams })
        .then((res) => {
          aboutCache = res.data;
          aboutCachePromise = null;
          return aboutCache;
        })
        .catch((err) => {
          aboutCachePromise = null;
          throw err;
        });

      return aboutCachePromise;
    }

    const res = await axiosInstance.get(url, { params: queryParams });
    return res.data;
  },

  createDetails: async (data: FormData | any) => {
    const res = await axiosInstance.post("/about", data);
    AboutService.clearCache();
    return res.data;
  },

  updateDetails: async (id: string, data: FormData | any) => {
    const res = await axiosInstance.put(`/about/${id}`, data);
    AboutService.clearCache();
    return res.data;
  },

  deleteDetails: async (id: string) => {
    const res = await axiosInstance.delete(`/about/${id}`);
    AboutService.clearCache();
    return res.data;
  },

  clearCache: () => {
    aboutCache = null;
    aboutCachePromise = null;
  },
};