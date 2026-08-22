import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (window.location.pathname.startsWith("/admin")) {
                window.location.href = "/admin/login";
              }
        }
        return Promise.reject(error);
    }
)

export default api;