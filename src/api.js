import axios from "axios";

const BASE = "http://localhost:8080";

const api = axios.create({ baseURL: BASE });

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: (username, password) =>
    api.post("/api/auth/login", { username, password }),
};

export const articlesApi = {
  getAll: () => api.get("/api/articles"),
  getById: (id) => api.get(`/api/articles/${id}`),
  create: (title, content) => api.post("/api/articles", { title, content }),
  update: (id, title, content) =>
    api.put(`/api/articles/${id}`, { title, content }),
  delete: (id) => api.delete(`/api/articles/${id}`),
};

export const usersApi = {
  getAll: () => api.get("/api/users"),
};

export default api;
