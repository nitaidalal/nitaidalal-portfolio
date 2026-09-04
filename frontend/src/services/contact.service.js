import axiosInstance from "../config/axios";
import { API_ROUTES } from "../utils/constants";

export const contactService = {
  send: async (data) => {
    const res = await axiosInstance.post(API_ROUTES.CONTACT, data);
    return res.data;
  },

  // admin
  getAll: async () => {
    const res = await axiosInstance.get(API_ROUTES.ADMIN_MESSAGES);
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await axiosInstance.patch(
      `${API_ROUTES.ADMIN_MESSAGES}/${id}/read`,
    );
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(
      `${API_ROUTES.ADMIN_MESSAGES}/${id}`,
    );
    return res.data;
  },
  reply: async (id, replyMessage) => {
    const res = await axiosInstance.post(
      `${API_ROUTES.ADMIN_MESSAGES}/${id}/reply`,
      { replyMessage },
    );
    return res.data;
  },
};
