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
    restaurant: string;
    branch: string;
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
    const res = await axiosInstance.post("/auth/forgot-password", { email });
    return res.data;
  },

  // Fixed payload key: uidb64 -> userId
  resetPassword: async (userId: string, token: string, new_password: string) => {
    const res = await axiosInstance.post("/auth/reset-password", {
      userId,
      token,
      new_password,
    });
    return res.data;
  },
};