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

export type TipoEntrada = "SALARIO" | "FREELA" | "RENDA_EXTRA" | "OUTROS";

export interface Entrada {
  id: number;
  descricao: string;
  valor: number;
  dataRecebimento: string; // Formato "YYYY-MM-DD"
  tipo: TipoEntrada;
  recorrente: boolean;
}

export type EntradaCreatePayload = Omit<Entrada, "id">;
export type EntradaUpdatePayload = Omit<Entrada, "id">;

export type EntradasPage = SpringPage<Entrada>;

// ===================================================================
// GASTOS
// ===================================================================

export type TipoGasto = "VARIAVEL" | "FIXO" | "PARCELADO";

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

// Para criação, não enviamos id nem valorMensal (calculado no backend)
export type GastoCreatePayload = Omit<Gasto, "id" | "valorMensal">;
export type GastoUpdatePayload = Omit<Gasto, "id" | "valorMensal">;

export type GastosPage = SpringPage<Gasto>;
