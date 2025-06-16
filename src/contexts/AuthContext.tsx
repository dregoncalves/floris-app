"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextProps = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    let parsedUser: User | null = null;
    if (storedUser && storedUser !== "undefined") {
      try {
        parsedUser = JSON.parse(storedUser);
      } catch {
        parsedUser = null;
      }
    }

    // Seta os states só se todos os dados estiverem válidos
    if (parsedUser && storedAccessToken && storedRefreshToken) {
      setUser(parsedUser);
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    } else {
      // Garante storage limpo se tiver lixo
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    setIsHydrated(true);
  }, []);

  // Função para login seguro
  const login = ({
    accessToken,
    refreshToken,
    user,
  }: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    console.log("AuthProvider: login chamado", { user, accessToken });

    // Só salva se o usuário é válido
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  // Função para logout seguro
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/auth/login");
  };

  // Evita hydration mismatch: só renderiza children depois da hidratação
  if (!isHydrated) {
    return null; // Ou um skeleton/loading se preferir
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        isAuthenticated: !!accessToken,
        isHydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
