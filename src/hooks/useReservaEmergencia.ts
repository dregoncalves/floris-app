import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createReserva,
  updateReserva,
  deleteReserva,
  ReservaUpdatePayload,
} from "@/services/ReservaEmergenciaService";

export function useReservaEmergenciaMutations() {
  const queryClient = useQueryClient();

  const invalidateDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
  };

  const createMutation = useMutation({
    mutationFn: createReserva,
    onSuccess: () => {
      toast.success("Reserva criada com sucesso!");
      invalidateDashboard();
    },
    onError: (err: Error) => toast.error(`Erro ao criar: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ReservaUpdatePayload) => updateReserva(payload),
    onSuccess: (data, variables) => {
      // Mensagem customizada se o valor atual mudou (aporte) ou não (edição de meta)
      if (
        variables.valorAtual >
        (queryClient.getQueryData(["dashboardData"]) as any)?.reservaData
          ?.valorAtual
      ) {
        toast.success("Aporte realizado com sucesso!");
      } else {
        toast.success("Reserva atualizada com sucesso!");
      }
      invalidateDashboard();
    },
    onError: (err: Error) => toast.error(`Erro ao atualizar: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReserva,
    onSuccess: () => {
      toast.success("Reserva excluída com sucesso!");
      invalidateDashboard();
    },
    onError: (err: Error) => toast.error(`Erro ao excluir: ${err.message}`),
  });

  // REMOVIDO: aporteMutation não existe mais

  return {
    createReserva: createMutation.mutate,
    updateReserva: updateMutation.mutate,
    deleteReserva: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
