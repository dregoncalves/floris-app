// services/api.ts
import axios, { AxiosError } from "axios";

// Rotas públicas
const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

// Criação da instância Axios
export const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

// Funções auxiliares para tokens (pode adaptar para cookies, localStorage, etc)
const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
const setAccessToken = (token: string) =>
  typeof window !== "undefined" && localStorage.setItem("accessToken", token);

// Interceptor para adicionar o token nas requests privadas
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && !PUBLIC_ROUTES.includes(config.url || "")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token logic
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("Refresh token não encontrado");
  const response = await api.post("/auth/refresh", { refreshToken });
  const { accessToken } = response.data;
  setAccessToken(accessToken);
  return accessToken;
};

// Interceptor de resposta para 401/403
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !PUBLIC_ROUTES.includes(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return refreshAccessToken()
        .then((newToken) => {
          processQueue(null, newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((err) => {
          processQueue(err, null);
          // Faça logout do usuário, limpe tokens, etc
          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(error);
  }
);
