import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    refreshToken: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.role || "guest", // admin, trader, guest
  },

  actions: {
    async login(email, password, remember) {
      const res = await api.post("/auth/login", {
        Email: email,
        Password: password,
      });
      const { AccessToken: token, ...user } = res.data;
      this.token = token;
      this.user = user;
      if (remember && this.token) {
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    },
    async register(userData) {
      await api.post("/auth/registercustomer", userData);
    },
    loadFromStorage() {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token) {
          this.token = token;
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        if (user) {
          this.user = JSON.parse(user);
        }
      } catch {}
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
    },
    getSettings: (userId) => api.get(`/auth/${userId}/settings`),
    updateSettings: (userId, settings) =>
      api.put(`/auth/${userId}/settings`, settings),
  },
});
