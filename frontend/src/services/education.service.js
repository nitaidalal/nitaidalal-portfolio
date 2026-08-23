import axiosInstance from "../config/axios";
import { API_ROUTES } from "../utils/constants";

export const educationService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_ROUTES.EDUCATION);
    return res.data;
  },

  create: async (formData) => {
    const res = await axiosInstance.post(API_ROUTES.ADMIN_EDUCATION, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id, formData) => {
    const res = await axiosInstance.put(
      `${API_ROUTES.ADMIN_EDUCATION}/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(
      `${API_ROUTES.ADMIN_EDUCATION}/${id}`,
    );
    return res.data;
  },
};
