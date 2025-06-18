import { api } from "@/lib/api";
import type {
  Gasto,
  GastoCreatePayload,
  GastoUpdatePayload,
  GastosPage,
} from "@/types/lancamentos";

// Parâmetros pra buscar gastos (paginação, tamanho, ordenação)
interface GetGastosParams {
  page?: number;
  size?: number;
  sort?: string;
}

// 1. Listar todos os gastos, com paginação
export async function getGastos(params: GetGastosParams): Promise<GastosPage> {
  const response = await api.get<GastosPage>("/gastos", { params });
  return response.data;
}

// 2. Buscar um gasto pelo ID
export async function getGastoById(id: number): Promise<Gasto> {
  const response = await api.get<Gasto>(`/gastos/${id}`);
  return response.data;
}

// 3. Criar um novo gasto
export async function createGasto(payload: GastoCreatePayload): Promise<Gasto> {
  const response = await api.post<Gasto>("/gastos", payload);
  return response.data;
}

// 4. Atualizar um gasto existente
export async function updateGasto(
  id: number,
  payload: GastoUpdatePayload
): Promise<Gasto> {
  const response = await api.put<Gasto>(`/gastos/${id}`, payload);
  return response.data;
}

// 5. Deletar um gasto pelo ID
export async function deleteGasto(id: number): Promise<void> {
  await api.delete(`/gastos/${id}`);
}
