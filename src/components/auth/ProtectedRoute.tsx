"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  publicOnly?: boolean; // se true, só quem NÃO está autenticado pode acessar
  redirectTo?: string; // rota para redirecionar, padrão dashboard/private/login
};

export default function ProtectedRoute({
  children,
  publicOnly = false,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    if (publicOnly && isAuthenticated) {
      // Página só para não autenticados
      router.replace(redirectTo || "/dashboard");
    } else if (!publicOnly && !isAuthenticated) {
      // Página privada
      router.replace(redirectTo || "/auth/login");
    }
  }, [isHydrated, isAuthenticated, publicOnly, redirectTo, router]);

  if (!isHydrated) return null;
  if ((publicOnly && isAuthenticated) || (!publicOnly && !isAuthenticated))
    return null;

  return <>{children}</>;
}
