import axiosInstance from "../config/axios";
import { API_ROUTES } from "../utils/constants";
    
export const profileService = {
  getProfile: async () => {
    const res = await axiosInstance.get(API_ROUTES.PROFILE);
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await axiosInstance.put(API_ROUTES.ADMIN_PROFILE, data);
    return res.data;
  },

  updateAvatar: async (formData) => {
    const res = await axiosInstance.put(
      `${API_ROUTES.ADMIN_PROFILE}/avatar`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  updateResume: async (formData) => {
    const res = await axiosInstance.put(
      `${API_ROUTES.ADMIN_PROFILE}/resume`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },
};
