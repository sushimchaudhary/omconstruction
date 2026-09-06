import axiosInstance from "@/lib/config/axios.config";

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile_number?: string;
    address?: string;
    role?: string;
    super_user: boolean;
    is_staff?: boolean;
    is_admin?: boolean;
    restaurant: string; // "" / undefined for super_user accounts
    branch: string; // "" / undefined for super_user accounts
  };
}

export const AuthServices = {
  adminLogin: async (
    username: string,
    password: string,
  ): Promise<AdminLoginResponse> => {
    const res = await axiosInstance.post("/auth/login", { username, password });
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await axiosInstance.post("/auth/forgot-password/", { email });
    return res.data;
  },

  resetPassword: async (uidb64: string, token: string, new_password: string) => {
    const res = await axiosInstance.post("/auth/reset-password/", {
      uidb64,
      token,
      new_password,
    });
    return res.data;
  },
};