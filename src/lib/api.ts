// src/lib/api.ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  withCredentials: true, // ESSENCIAL para o navegador enviar cookies httpOnly
});

// O interceptor de resposta agora serve apenas para capturar um erro de
// autenticação e notificar a aplicação para deslogar o usuário.
api.interceptors.response.use(
  (response) => response, // Se a resposta for sucesso, não faz nada.
  (error) => {
    // Se a API retornar 401, significa que a sessão é inválida ou expirou.
    if (error.response?.status === 401) {
      // Disparamos um evento global. O AuthContext irá "ouvir" esse evento e
      // executará a função de logout. Isso evita importações circulares.
      window.dispatchEvent(new Event("auth-error"));
    }
    return Promise.reject(error);
  }
);
