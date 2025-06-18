import axios from "axios";

// URL base da API
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  withCredentials: true, // Pra enviar cookies
});

// Interceptor pra tratar erro de autenticação (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth-error")); // Dispara evento global
    }
    return Promise.reject(error);
  }
);
