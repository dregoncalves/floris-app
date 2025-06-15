"use client";

import { useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = process.env.NEXT_PUBLIC_PUBLIC_ROUTES?.split(",") ?? [];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  useEffect(() => {
    if (!accessToken && !isPublicRoute) {
      router.push("/auth/login");
    }
  }, [accessToken, isPublicRoute, router]);

  if (!accessToken && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
