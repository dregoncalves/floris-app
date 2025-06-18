import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardData } from "@/types/dashboard";

// Hook pra buscar os dados do dashboard
export const useDashboard = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboardData"], // Chave pro cache
    queryFn: async () => {
      const response = await api.get<DashboardData>("/dashboard");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Dados "frescos" por 5 minutos
    refetchOnWindowFocus: false, // Não refaz a requisição ao focar na janela
    retry: 3, // Tenta 3 vezes se der erro
  });
};
