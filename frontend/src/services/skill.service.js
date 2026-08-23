import axiosInstance from "../config/axios";
import { API_ROUTES } from "../utils/constants";

export const skillService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_ROUTES.SKILLS);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post(API_ROUTES.ADMIN_SKILLS, data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(
      `${API_ROUTES.ADMIN_SKILLS}/${id}`,
      data,
    );
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`${API_ROUTES.ADMIN_SKILLS}/${id}`);
    return res.data;
  },

  reorder: async (skills) => {
    const res = await axiosInstance.patch(
      `${API_ROUTES.ADMIN_SKILLS}/reorder`,
      { skills },
    );
    return res.data;
  },
};
