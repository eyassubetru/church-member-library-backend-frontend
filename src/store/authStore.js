import { create } from "zustand";
import api from "../api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,

  login: async (identifier, password) => {
    const res = await api.post("/auth/login", { identifier, password });
    set({
      accessToken: res.data.accessToken,
      user: res.data.member,
      isAuthenticated: true,
      loading: false
    });
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false
    });
  },

  refreshSession: async () => {
    try {
      const res = await api.post("/auth/refresh");
      set({
        accessToken: res.data.accessToken,
        user: res.data.member,
        isAuthenticated: true,
        loading: false
      });
    } catch {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false
      });
    }
  }
}));
