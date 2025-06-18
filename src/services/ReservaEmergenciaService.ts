import { api } from "@/lib/api";
import { ReservaEmergencia } from "@/types/dashboard";

// Estrutura pra criar a reserva
export interface ReservaCreatePayload {
  valorObjetivo: number;
  valorAtual: number;
}

// Estrutura pra atualizar a reserva, sempre completo
export interface ReservaUpdatePayload {
  valorObjetivo: number;
  valorAtual: number;
  ativa: boolean;
}

// POST: criar uma nova reserva de emergência
export async function createReserva(
  payload: ReservaCreatePayload
): Promise<ReservaEmergencia> {
  const response = await api.post<ReservaEmergencia>(
    "/reserva-emergencia",
    payload
  );
  return response.data;
}

// PUT: atualizar a reserva de emergência existente
export async function updateReserva(
  payload: ReservaUpdatePayload
): Promise<ReservaEmergencia> {
  const response = await api.put<ReservaEmergencia>(
    "/reserva-emergencia",
    payload
  );
  return response.data;
}

// DELETE: remover a reserva de emergência
export async function deleteReserva(): Promise<void> {
  await api.delete("/reserva-emergencia");
}
