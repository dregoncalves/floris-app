import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Formato do histórico mensal
export interface HistoricoMensal {
  mes: string;
  totalEntradas: number;
  totalGastos: number;
}

// Busca os dados de histórico mensal na API
async function fetchHistorico(): Promise<HistoricoMensal[]> {
  const { data } = await api.get("/dashboard/historico");
  return data;
}

// Hook pra pegar o histórico do dashboard
export function useDashboardHistorico() {
  return useQuery<HistoricoMensal[]>({
    queryKey: ["dashboard-historico"],
    queryFn: fetchHistorico,
  });
}
