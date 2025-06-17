import { api } from "@/lib/api";
import type {
  Entrada,
  EntradaCreatePayload,
  EntradaUpdatePayload,
  EntradasPage,
} from "@/types/lancamentos";

interface GetEntradasParams {
  page?: number;
  size?: number;
  sort?: string;
}

// 1. Listar todas as entradas (com paginação)
export async function getEntradas(
  params: GetEntradasParams
): Promise<EntradasPage> {
  const response = await api.get<EntradasPage>("/entradas", { params });
  return response.data;
}

// 2. Buscar entrada por ID
export async function getEntradaById(id: number): Promise<Entrada> {
  const response = await api.get<Entrada>(`/entradas/${id}`);
  return response.data;
}

// 3. Criar nova entrada
export async function createEntrada(
  payload: EntradaCreatePayload
): Promise<Entrada> {
  const response = await api.post<Entrada>("/entradas", payload);
  return response.data;
}

// 4. Atualizar uma entrada
export async function updateEntrada(
  id: number,
  payload: EntradaUpdatePayload
): Promise<Entrada> {
  const response = await api.put<Entrada>(`/entradas/${id}`, payload);
  return response.data;
}

// 5. Deletar uma entrada
export async function deleteEntrada(id: number): Promise<void> {
  await api.delete(`/entradas/${id}`);
}
