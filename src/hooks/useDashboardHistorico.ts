import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Interface para tipar os dados que vêm da API
export interface HistoricoMensal {
  mes: string;
  totalEntradas: number;
  totalGastos: number;
}

// Função que busca os dados na API
async function fetchHistorico(): Promise<HistoricoMensal[]> {
  const { data } = await api.get("/dashboard/historico");
  return data;
}

// O hook customizado que usa o React Query
export function useDashboardHistorico() {
  return useQuery<HistoricoMensal[]>({
    queryKey: ["dashboard-historico"],
    queryFn: fetchHistorico,
  });
}
