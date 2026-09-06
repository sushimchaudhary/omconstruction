import axiosInstance from "@/lib/config/axios.config";
import Cookies from "js-cookie";

let userCache: any = null;

export interface Profile {
  id?: string;
  _id?: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_number?: string;
  phone?: string;
  address?: string;
  role?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_admin?: boolean;
  created_at?: string;
}

interface GetDetailsArgs {
  id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const UserServices = {
  // Login Endpoint: /api/auth/login
  login: async (credentials: {
    identifier: string;
    password: string;
    recaptchaToken?: string;
  }) => {
    const response = await axiosInstance.post("/auth/login", {
      email: credentials.identifier,
      password: credentials.password,
      recaptcha_token: credentials.recaptchaToken,
    });
    return response.data;
  },

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

  // Users Endpoint Fix: /api/user (वा Specific User का लागि /api/user/:id)
  getDetails: async (args?: GetDetailsArgs | string, oldParams?: any) => {
    let url = "/user";
    let queryParams = {};

    if (typeof args === "string") {
      url = `/user/${args}`;
      queryParams = oldParams || {};
    } else if (args && typeof args === "object") {
      const { id, ...rest } = args;
      if (id) url = `/user/${id}`;
      queryParams = rest;
    }

    const res = await axiosInstance.get(url, { params: queryParams });
    return res.data;
  },

  clearCache: () => {
    userCache = null;
  },

  // User Register/Create Fix: /api/auth/register वा /api/user
  createDetails: async (data: FormData | any) => {
    const token = Cookies.get("access_token") || Cookies.get("token");

    const res = await axiosInstance.post("/auth/register", data, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    userCache = null;
    return res.data;
  },

  // User Update Fix: /api/user/:id
  updateDetails: async (id: string, data: FormData | any) => {
    const res = await axiosInstance.put(`/user/${id}`, data);
    userCache = null;
    return res.data;
  },

  // User Delete Fix: /api/user/:id
  deleteDetails: async (id: string) => {
    const res = await axiosInstance.delete(`/user/${id}`);
    userCache = null;
    return res.data;
  },

  // Get Profile Fix: /api/user/profile
  getProfile: async (): Promise<Profile> => {
    const res = await axiosInstance.get("/user/profile");
    return res.data?.data ?? res.data;
  },
};