"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Efeito pra checar o status de autenticação e configurar o ouvinte de erro
  useEffect(() => {
    // Checa se o usuário já tá logado via cookie
    const checkAuthStatus = async () => {
      try {
        const response = await api.get<User>("/users/me");
        setUser(response.data); // Usuário autenticado
      } catch (error) {
        setUser(null); // Sem sessão ativa
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };

    checkAuthStatus();

    // Ouve o evento de erro de autenticação pra deslogar
    const handleAuthError = () => logout();
    window.addEventListener("auth-error", handleAuthError);

    // Limpa o ouvinte ao desmontar
    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, []); // Roda só uma vez

  // Faz login e redireciona pro dashboard
  const login = (userData: User) => {
    setUser(userData);
    router.push("/dashboard");
  };

  // Faz logout, invalida a sessão na API e limpa o estado local
  const logout = async () => {
    if (!user) return; // Se já deslogado, não faz nada

    try {
      await api.post("/auth/logout"); // Invalida o cookie na API
    } catch (error) {
      console.error("Erro ao fazer logout na API:", error);
    } finally {
      setUser(null); // Limpa o estado
      router.push("/auth/login"); // Redireciona
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook pra usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
