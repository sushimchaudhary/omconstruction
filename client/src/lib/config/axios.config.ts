import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// ==============================
// 🔐 Private Axios (with token)
// ==============================
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // CORS stable banauna help garxa
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // FIX: your login page sets `adminToken`, not `access_token` — the
    // Authorization header was never being attached before this change.
const token = Cookies.get("adminToken");

    const url = config.url?.toLowerCase() || "";

    // Login / Refresh jasto route ma token haldaina
    const isAuthRoute =
      url.includes("/login") ||
      url.includes("/refresh");
      // url.includes("/register");

    // Token attach garne
    if (token && !isAuthRoute) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // ❗ IMPORTANT FIX: FormData ma content-type manually set nagarne
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (optional but useful)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // NOTE: your login flow never stores a separate refresh token in
      // localStorage — only `adminToken` in a cookie. This refresh branch
      // will currently never run. Wire it up once your API issues a
      // refresh token, or remove it if your backend doesn't support one.
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        const res = await axios.post("/auth/token/refresh/", {
          refresh,
        });

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// ==============================
// 🌐 Public Axios (no auth)
// ==============================
export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// Export
// ==============================
export default axiosInstance;



// import axios from "axios";
// import Cookies from "js-cookie";

// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request Interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("adminToken");
//     const url = config.url?.toLowerCase() || "";

//     const isAuthRoute =
//       url.includes("/login") ||
//       url.includes("/refresh");

//     if (token && !isAuthRoute) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // ४०१ Unauthorized एरर आएमा टोकन रद्द भएको मानिनेछ र लगइनमा रिडाइरेक्ट हुनेछ
//     if (error.response?.status === 401) {
//       Cookies.remove("adminToken");
//       Cookies.remove("role");
//       Cookies.remove("user_info");
      
//       if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export const publicAxios = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosInstance;