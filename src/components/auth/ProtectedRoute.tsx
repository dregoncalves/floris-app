"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthContext from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = process.env.NEXT_PUBLIC_PUBLIC_ROUTES?.split(",").map(
    (route) => route.trim()
  ) ?? ["/auth/login", "/auth/register"];

  const isPublic = publicRoutes.some((route) => pathname?.startsWith(route));
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    // Garante que a checagem só ocorra após o carregamento do contexto
    if (!isAuthenticated && !isPublic) {
      router.replace("/auth/login");
    }
    setCheckedAuth(true);
  }, [isAuthenticated, isPublic, router]);

  if (!isPublic && !isAuthenticated && !checkedAuth) {
    // Pode adicionar spinner aqui se quiser
    return null;
  }

  return <>{children}</>;
}
