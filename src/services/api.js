import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_KEY = "tumortech_token";
const USER_KEY = "tumortech_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const api = axios.create({ baseURL: `${API_URL}/api/v1` });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Session expired: clear it and send the user back to login
    if (err.response?.status === 401 && getToken()) {
      clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const errorMessage = (err) => {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  if (err?.code === "ERR_NETWORK") return "Cannot reach the server. Is the backend running?";
  return err?.message || "Something went wrong";
};

// ---------- Auth ----------
export const registerUser = async ({ fullName, email, password }) => {
  const { data } = await api.post("/auth/register", {
    full_name: fullName,
    email,
    password,
  });
  return data; // { access_token, user: { full_name, email } }
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { access_token, user: { full_name, email } }
};

// ---------- Scans ----------
export const predictImage = async (file, scanType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("scan_type", scanType); // "MRI" or "CT"
  const { data } = await api.post("/predict/", formData);
  return data;
};

export const fetchPredictions = async () => {
  const { data } = await api.get("/predictions/");
  return Array.isArray(data) ? data : data.predictions ?? [];
};

export const downloadReport = async (id) => {
  const res = await api.get(`/predictions/${id}/report`, { responseType: "blob" });
  const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `TumorTech-report-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
