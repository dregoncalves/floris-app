export type ReservaEmergencia = {
  id: number;
  usuarioId: number;
  valorObjetivo: number;
  valorAtual: number;
  percentualConcluido: number;
  ativa: boolean;
  dataCriacao: string;
  ultimaAtualizacao: string;
};

export type MetaFinanceira = {
  id: number;
  descricao: string;
  valorObjetivo: number;
  valorAtual: number;
  prazoFinal: string;
  concluida: boolean;
  percentualConcluido: number;
};

export type FluxoProjetadoMes = {
  mes: string;
  saldo: number;
};

export type DivisaoGasto = {
  tipo: string;
  valor: number;
  percentual: number;
};

export type DashboardData = {
  mesReferencia: string;
  saldoAtual: number;
  totalEntradas: number;
  totalGastosFixos: number;
  totalGastosVariaveis: number;
  totalLivre: number;
  percentualFixos: number;
  percentualVariaveis: number;
  percentualLivre: number;
  reservaEmergencia: ReservaEmergencia | null;
  metasFinanceiras: MetaFinanceira[];
  fluxoProjetadoProximosMeses: FluxoProjetadoMes[];
  divisaoGastos: DivisaoGasto[];
  diagnostico: string[];
  alertas: string[];
};
