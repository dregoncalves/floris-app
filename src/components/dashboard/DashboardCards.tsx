// src/components/dashboard/DashboardCards.tsx
"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useSmoothCountUp } from "@/hooks/use-smooth-count-up";

// Componentes
import { InfoCard } from "./InfoCard";
import { DashboardCardGastosFixosRadial } from "./DashboardCardGastosFixosRadial";
import { DashboardCardReservaEmergencia } from "./DashboardCardReservaEmergencia";

// Ícones
import {
  IconTrendingUp,
  IconTrendingDown,
  IconPigMoney,
  IconInfoCircle,
} from "@tabler/icons-react";

export function DashboardCards() {
  const { data, isLoading, isError } = useDashboard();

  // Animações
  const saldoAnim = useSmoothCountUp(data?.saldoAtual ?? 0, 800, 2);
  const receitasAnim = useSmoothCountUp(data?.totalEntradas ?? 0, 800, 2);
  const despesasAnim = useSmoothCountUp(
    (data?.totalGastosFixos ?? 0) + (data?.totalGastosVariaveis ?? 0),
    800,
    2
  );
  const livreAnim = useSmoothCountUp(data?.totalLivre ?? 0, 800, 2);
  const percentualFixosAnim = useSmoothCountUp(
    data?.percentualFixos ?? 0,
    800,
    1
  );

  if (isError) {
    return <div className="text-danger p-4">Erro ao carregar dados.</div>;
  }

  // --- Lógica para o card de Saldo ---
  const isSaldoPositive = (data?.saldoAtual ?? 0) >= 0;
  const saldoColorClass = isSaldoPositive ? "text-success" : "text-danger";
  const saldoMessage = isSaldoPositive
    ? "Parabéns, você está no azul!"
    : "Atenção: Saldo negativo!";

  return (
    // Grade principal com 2 colunas em telas maiores
    <div className="grid grid-cols-1 @3xl/main:grid-cols-2 gap-4 lg:gap-6 px-4 lg:px-6">
      {/* Coluna da Esquerda: Sub-grade 2x2 para os InfoCards */}
      <div className="grid grid-cols-1 @md/main:grid-cols-2 gap-4 lg:gap-6">
        <InfoCard
          title="Saldo Projetado do Mês"
          value={saldoAnim}
          colorClass={saldoColorClass}
          badgeText={isSaldoPositive ? "Positivo" : "Negativo"}
          badgeIcon={
            isSaldoPositive ? <IconTrendingUp /> : <IconTrendingDown />
          }
          footerText={saldoMessage}
          icon={<IconInfoCircle className="text-muted-foreground" />}
          isLoading={isLoading}
        />
        <InfoCard
          title="Receitas Totais"
          value={receitasAnim}
          colorClass="text-success"
          badgeText="Entradas"
          badgeIcon={<IconTrendingUp />}
          footerText="Total de entradas no mês."
          icon={<IconInfoCircle className="text-muted-foreground" />}
          isLoading={isLoading}
        />
        <InfoCard
          title="Despesas Totais"
          value={despesasAnim}
          colorClass="text-danger"
          badgeText="Saídas"
          badgeIcon={<IconTrendingDown />}
          footerText="Soma de gastos fixos e variáveis."
          icon={<IconInfoCircle className="text-muted-foreground" />}
          isLoading={isLoading}
        />
        <InfoCard
          title="Renda Livre"
          value={livreAnim}
          colorClass="text-primary"
          badgeText="Disponível"
          badgeIcon={<IconPigMoney />}
          footerText="Valor que sobra após gastos essenciais."
          icon={<IconInfoCircle className="text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      {/* Coluna da Direita: Container Flex para os dois gráficos */}
      <div className="flex flex-col @5xl/main:flex-row gap-4 lg:gap-6 w-full">
        <DashboardCardGastosFixosRadial
          percentual={percentualFixosAnim}
          isLoading={isLoading}
        />
        <DashboardCardReservaEmergencia
          reservaData={data?.reservaEmergencia ?? null}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
