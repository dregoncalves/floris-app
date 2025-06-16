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
  isLoading: boolean; // Renomeado de isHydrated para maior clareza
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Sempre começa checando
  const router = useRouter();

  // Este useEffect é o coração da nova autenticação
  useEffect(() => {
    // 1. Função que verifica se o usuário já está logado
    const checkAuthStatus = async () => {
      try {
        // O navegador envia os cookies automaticamente com esta chamada
        const response = await api.get<User>("/users/me");
        // Se a API retornar dados, o usuário está autenticado
        setUser(response.data);
      } catch (error) {
        // Se der erro (ex: 401), o usuário não tem sessão ativa
        console.log(error);
        setUser(null);
      } finally {
        // Finaliza o estado de carregamento
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // 2. Ouvinte para o evento de erro de autenticação disparado pelo interceptor da API
    const handleAuthError = () => logout();
    window.addEventListener("auth-error", handleAuthError);

    // 3. Limpa o ouvinte quando o componente for desmontado
    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
    // O array de dependências vazio `[]` garante que isso rode apenas uma vez.
    // O `logout` precisaria ser envolvido em `useCallback` para ser adicionado aqui,
    // mas para esta lógica, não é estritamente necessário.
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    router.push("/dashboard");
  };

  const logout = async () => {
    // Se já estiver deslogado, não faz nada
    if (!user) return;

    try {
      // Chama o endpoint de logout da API para que ela invalide os cookies
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout na API:", error);
    } finally {
      // Limpa o estado no front-end e redireciona, independentemente da resposta da API
      setUser(null);
      router.push("/auth/login");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
