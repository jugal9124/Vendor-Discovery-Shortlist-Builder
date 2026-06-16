import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL, timeout: 30000 });

api.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(new Error(err.response?.data?.error || err.message || "Request failed"))
);

export const buildShortlist = (payload) => api.post("/api/shortlist/build", payload);
export const getShortlist = (id) => api.get(`/api/shortlist/${id}`);
export const getHistory = (sessionId) => api.get(`/api/shortlist/history/${sessionId}`);
export const deleteShortlist = (id) => api.delete(`/api/shortlist/${id}`);
export const getHealth = () => api.get("/api/health");

export default api;
