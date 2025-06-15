import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Função auxiliar para obter os tokens do localStorage
function getTokens() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return { accessToken, refreshToken };
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const { refreshToken } = getTokens();

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.accessToken}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${res.data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = "/auth/login";
        }
      } else {
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
