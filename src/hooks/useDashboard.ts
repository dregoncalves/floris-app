import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api"; // Certifique-se de que este caminho está correto para sua instância do axios
import { DashboardData } from "@/types/dashboard"; // Importa o tipo que acabamos de criar

export const useDashboard = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const response = await api.get<DashboardData>("/dashboard");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Os dados são considerados 'fresh' por 5 minutos
    refetchOnWindowFocus: false, // Evita refetch desnecessário ao focar na janela
    retry: 3, // Tenta 3 vezes em caso de falha
  });
};
