import axiosInstance from "../config/axios";
import { API_ROUTES } from "../utils/constants";

export const achievementService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_ROUTES.ACHIEVEMENTS);
    return res.data;
  },

  create: async (formData) => {
    const res = await axiosInstance.post(
      API_ROUTES.ADMIN_ACHIEVEMENTS,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  update: async (id, formData) => {
    const res = await axiosInstance.put(
      `${API_ROUTES.ADMIN_ACHIEVEMENTS}/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(
      `${API_ROUTES.ADMIN_ACHIEVEMENTS}/${id}`,
    );
    return res.data;
  },
};
