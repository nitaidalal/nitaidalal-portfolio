import axiosInstance from "../config/axios";
import { API_ROUTES } from "../utils/constants";

export const projectService = {
  getFeatured: async () => {
    const res = await axiosInstance.get(API_ROUTES.FEATURED_PROJECTS);
    return res.data;
  },

  getAll: async (category = "") => {
    const params = category && category !== "All" ? { category } : {};
    const res = await axiosInstance.get(API_ROUTES.PROJECTS, { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`${API_ROUTES.PROJECTS}/${id}`);
    return res.data;
  },

  getAdminAll: async (filters = {}) => {
    const res = await axiosInstance.get(`${API_ROUTES.PROJECTS}/admin/all`, {
      params: filters,
    });
    return res.data;
  },

  create: async (formData) => {
    const res = await axiosInstance.post(API_ROUTES.ADMIN_PROJECTS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id, formData) => {
    const res = await axiosInstance.put(
      `${API_ROUTES.ADMIN_PROJECTS}/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(
      `${API_ROUTES.ADMIN_PROJECTS}/${id}`,
    );
    return res.data;
  },
};
