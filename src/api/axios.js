import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "https://church-member-library-backend.onrender.com/api",
  withCredentials: true // IMPORTANT for cookies
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshToken();
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(err);
  }
);

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
