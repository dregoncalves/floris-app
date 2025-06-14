import { api, endpoints } from "./api";

// Login: só chama a API, cookie é gerenciado pelo browser
export async function login(login: string, password: string) {
  await api.post(endpoints.login, { login, password });
}

// Register: já pode logar automaticamente
export async function register(userData: {
  name: string;
  username: string;
  email: string;
  password: string;
  age: number;
}) {
  await api.post(endpoints.register, userData);
}

// Logout: backend expira o cookie
export async function logout() {
  await api.post(endpoints.logout);
}
