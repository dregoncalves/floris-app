// src/hooks/useGastos.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getGastos,
  createGasto,
  updateGasto,
  deleteGasto,
} from "@/services/GastosService";
import { GastoCreatePayload } from "@/types/lancamentos";

// Hook para buscar a lista de gastos com paginação
export function useGastos(pagination: { pageIndex: number; pageSize: number }) {
  return useQuery({
    queryKey: ["gastos", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getGastos({ page: pagination.pageIndex, size: pagination.pageSize }),
    placeholderData: keepPreviousData,
  });
}

// Hook que agrupa todas as mutações de gastos
export function useGastoMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createGasto,
    onSuccess: () => {
      toast.success("Gasto criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["gastos"] });
    },
    onError: (err: Error) => toast.error(`Erro ao criar gasto: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: GastoCreatePayload;
    }) => updateGasto(id, payload),
    onSuccess: () => {
      toast.success("Gasto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["gastos"] });
    },
    onError: (err: Error) =>
      toast.error(`Erro ao atualizar gasto: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGasto,
    onSuccess: () => {
      toast.success("Gasto excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["gastos"] });
    },
    onError: (err: Error) =>
      toast.error(`Erro ao excluir gasto: ${err.message}`),
  });

  return {
    createGasto: createMutation.mutate,
    updateGasto: updateMutation.mutate,
    deleteGasto: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
