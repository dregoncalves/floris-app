"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  return null;
}
