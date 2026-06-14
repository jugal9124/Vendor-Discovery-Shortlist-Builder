import axios from "axios";

const api = axios.create({ baseURL: "/api", timeout: 30_000 });

api.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(new Error(err.response?.data?.error || err.message || "Request failed"))
);

export const buildShortlist = (payload) => api.post("/shortlist/build", payload);
export const getShortlist = (id) => api.get(`/shortlist/${id}`);
export const getHistory = (sessionId) => api.get(`/shortlist/history/${sessionId}`);
export const deleteShortlist = (id) => api.delete(`/shortlist/${id}`);
export const getHealth = () => api.get("/health");

export default api;
