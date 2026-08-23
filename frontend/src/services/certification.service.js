import axiosInstance from "../config/axios";
import { API_ROUTES } from "../utils/constants";

export const certificationService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_ROUTES.CERTIFICATIONS);
    return res.data;
  },

  create: async (formData) => {
    const res = await axiosInstance.post(
      API_ROUTES.ADMIN_CERTIFICATIONS,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  update: async (id, formData) => {
    const res = await axiosInstance.put(
      `${API_ROUTES.ADMIN_CERTIFICATIONS}/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(
      `${API_ROUTES.ADMIN_CERTIFICATIONS}/${id}`,
    );
    return res.data;
  },
};
