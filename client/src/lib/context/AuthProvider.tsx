"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { type IAuthContext, type IUser, type ICredentials } from "../../types/authType";
import Cookies from "js-cookie";
import axiosInstance from "../config/axios.config";
import Image from "next/image";
import Loading from "@/components/loading";

const AuthContext = createContext<IAuthContext>({
  login: async () => {},
  getLoggedInUser: async () => {},
  loggedInUser: null,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getLoggedInUser = useCallback(async (): Promise<IUser | void> => {
    try {
      const token = Cookies.get("adminToken");
      const savedUser = Cookies.get("user_info");

      // टोकन छैन भने युजर डाटा clear गर्ने
      if (!token) {
        setLoggedInUser(null);
        return;
      }

      if (savedUser) {
        const user = JSON.parse(savedUser);
        setLoggedInUser(user);
        return user;
      }
    } catch (error) {
      setLoggedInUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getLoggedInUser();
  }, [getLoggedInUser]);

  const login = async (credentials: ICredentials) => {
    const res = await axiosInstance.post("/auth/login/", {
      email: credentials.identifier,
      password: credentials.password,
    });
    const data = res.data;

    // १ महिना (३० दिन) का लागि कुकी सेट गरिएको छ
    if (data.token || data.access) {
      Cookies.set("adminToken", data.token || data.access, { expires: 30 });
    }
    if (data.role) {
      Cookies.set("role", data.role, { expires: 30 });
    }

    const baseUser: IUser = data.user ?? data.data ?? data;
    Cookies.set("user_info", JSON.stringify(baseUser), { expires: 30 });
    
    setLoggedInUser(baseUser);
    return baseUser;
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        getLoggedInUser,
        loggedInUser,
        user: loggedInUser,
        loading,
      }}
    >
      {loading ? (
        <Loading/>    
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;