import axiosInstance from "@/lib/config/axios.config";

let projectsCache: any = null;
let projectsCachePromise: Promise<any> | null = null;

interface GetDetailsArgs {
  id?: string;
  status?: string;
}

export const ProjectsServices = {
  parseError: (exception: any): string => {
    if (exception.response?.data) {
      const data = exception.response.data;
      if (data.response) return data.response;
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
    let url = "/project";
    let queryParams = {};

    if (typeof args === "string") {
      url = `/project/${args}`;
      queryParams = oldParams || {};
    } else if (args && typeof args === "object") {
      const { id, ...rest } = args;
      if (id) url = `/project/${id}`;
      queryParams = rest;
    }

    const isBaseListCall = url === "/project" && Object.keys(queryParams).length === 0;

    if (isBaseListCall) {
      if (projectsCache !== null) return projectsCache;
      if (projectsCachePromise !== null) return projectsCachePromise;

      projectsCachePromise = axiosInstance
        .get(url, { params: queryParams })
        .then((res) => {
          projectsCache = res.data;
          projectsCachePromise = null;
          return projectsCache;
        })
        .catch((err) => {
          projectsCachePromise = null;
          throw err;
        });

      return projectsCachePromise;
    }

    const res = await axiosInstance.get(url, { params: queryParams });
    return res.data;
  },

  createDetails: async (data: FormData) => {
    const res = await axiosInstance.post("/project", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    ProjectsServices.clearCache();
    return res.data;
  },

  updateDetails: async (id: string, data: FormData) => {
    // 🟢 Express Router support PUT for update
    const res = await axiosInstance.put(`/project/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    ProjectsServices.clearCache();
    return res.data;
  },

  deleteDetails: async (id: string) => {
    const res = await axiosInstance.delete(`/project/${id}`);
    ProjectsServices.clearCache();
    return res.data;
  },

  clearCache: () => {
    projectsCache = null;
    projectsCachePromise = null;
  },
};