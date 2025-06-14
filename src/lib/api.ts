import axios from "axios";

// Instância do axios
export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Endpoints centralizados
export const endpoints = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  me: "/users/me",
};
