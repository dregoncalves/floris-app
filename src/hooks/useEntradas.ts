// src/hooks/useEntradas.ts

// 1. Importamos 'keepPreviousData' para usar como placeholder
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getEntradas,
  createEntrada,
  updateEntrada,
  deleteEntrada,
} from "@/services/EntradasService";
import { EntradaCreatePayload } from "@/types/lancamentos";

// Hook para buscar a lista de entradas
export function useEntradas(pagination: {
  pageIndex: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: ["entradas", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getEntradas({ page: pagination.pageIndex, size: pagination.pageSize }),
    placeholderData: keepPreviousData,
  });
}

// Hook para agrupar todas as mutações (criar, atualizar, deletar)
export function useEntradaMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createEntrada,
    onSuccess: () => {
      toast.success("Entrada criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
    },
    onError: (err: Error) => toast.error(`Erro ao criar: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: EntradaCreatePayload;
    }) => updateEntrada(id, payload),
    onSuccess: () => {
      toast.success("Entrada atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
    },
    onError: (err: Error) => toast.error(`Erro ao atualizar: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntrada,
    onSuccess: () => {
      toast.success("Entrada excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
    },
    onError: (err: Error) => toast.error(`Erro ao excluir: ${err.message}`),
  });

  return {
    createEntrada: createMutation.mutate,
    updateEntrada: updateMutation.mutate,
    deleteEntrada: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
