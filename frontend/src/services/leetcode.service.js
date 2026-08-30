import api from "../config/axios";

const leetcodeService = {
  getStats: async (username) => {
    const response = await api.get(`leetcode/${encodeURIComponent(username)}`);
    return response.data;
  },
};

export default leetcodeService;