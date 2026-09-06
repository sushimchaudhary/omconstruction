"use client";
import { AuthProvider } from "@/lib/context/AuthProvider";
import { ConfigProvider } from "antd"; 

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ConfigProvider>
  );
}