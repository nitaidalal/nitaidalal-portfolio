import axiosInstance from "../config/axios";
import { API_ROUTES } from "../utils/constants";

export const authService = {
  login: async (email, password) => {
    const res = await axiosInstance.post(API_ROUTES.LOGIN, { email, password });
    return res.data;
  },

  logout: async () => {
    const res = await axiosInstance.post(API_ROUTES.LOGOUT);
    return res.data;
  },

  getMe: async () => {
    const res = await axiosInstance.get(API_ROUTES.ME);
    return res.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await axiosInstance.put(API_ROUTES.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return res.data;
  },
};
