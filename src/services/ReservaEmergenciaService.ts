import { api } from "@/lib/api";
import { ReservaEmergencia } from "@/types/dashboard";

// Payload para CRIAR a reserva
export interface ReservaCreatePayload {
  valorObjetivo: number;
  valorAtual: number;
}

// ATUALIZADO: Payload para ATUALIZAR a reserva (sempre completo)
export interface ReservaUpdatePayload {
  valorObjetivo: number;
  valorAtual: number;
  ativa: boolean;
}

// Aporte não é um tipo de payload, é uma ação que gera um ReservaUpdatePayload

// POST /reserva-emergencia
export async function createReserva(
  payload: ReservaCreatePayload
): Promise<ReservaEmergencia> {
  const response = await api.post<ReservaEmergencia>(
    "/reserva-emergencia",
    payload
  );
  return response.data;
}

// PUT /reserva-emergencia
export async function updateReserva(
  payload: ReservaUpdatePayload
): Promise<ReservaEmergencia> {
  const response = await api.put<ReservaEmergencia>(
    "/reserva-emergencia",
    payload
  );
  return response.data;
}

// DELETE /reserva-emergencia
export async function deleteReserva(): Promise<void> {
  await api.delete("/reserva-emergencia");
}
