interface SpringPage<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ===================================================================
// ENTRADAS
// ===================================================================

// Tipos possíveis de entrada
export type TipoEntrada = "SALARIO" | "FREELA" | "RENDA_EXTRA" | "OUTROS";

// Estrutura de uma entrada
export interface Entrada {
  id: number;
  descricao: string;
  valor: number;
  dataRecebimento: string; // Formato "YYYY-MM-DD"
  tipo: TipoEntrada;
  recorrente: boolean;
}

// Payload para criar uma entrada (sem o ID)
export type EntradaCreatePayload = Omit<Entrada, "id">;
// Payload para atualizar uma entrada (sem o ID)
export type EntradaUpdatePayload = Omit<Entrada, "id">;

// Página de entradas, usando a interface SpringPage
export type EntradasPage = SpringPage<Entrada>;

// ===================================================================
// GASTOS
// ===================================================================

// Tipos possíveis de gasto
export type TipoGasto = "VARIAVEL" | "FIXO" | "PARCELADO";

// Estrutura de um gasto
export interface Gasto {
  id: number;
  descricao: string;
  valor: number;
  valorMensal: number;
  tipo: TipoGasto;
  dataVencimento: string; // Formato "YYYY-MM-DD"
  numeroParcelaAtual: number | null;
  totalParcelas: number | null;
  gastoCartao: boolean;
  pago: boolean;
}

// Payload para criar gasto (sem id e valorMensal)
export type GastoCreatePayload = Omit<Gasto, "id" | "valorMensal">;
// Payload para atualizar gasto (sem id e valorMensal)
export type GastoUpdatePayload = Omit<Gasto, "id" | "valorMensal">;

// Página de gastos, usando a interface SpringPage
export type GastosPage = SpringPage<Gasto>;
