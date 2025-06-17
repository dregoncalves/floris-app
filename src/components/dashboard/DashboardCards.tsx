// src/components/dashboard/DashboardCards.tsx
"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent, // Importar CardContent também
} from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useSmoothCountUp } from "@/hooks/use-smooth-count-up"; // Certifique-se de que este hook existe

// Ícones do Tabler Icons
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconPigMoney,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";

// Componentes para o Radial Chart
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { DashboardCardGastosFixosRadial } from "./DashboardCardGastosFixosRadial";

// --- Componente Skeleton ---
// Reutilizamos a versão simples do Skeleton que estava no SectionCards
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded bg-muted h-7 w-32", className)} />
  );
}

// --- Componente RadialChartGastosFixos (adaptado para o Card 4) ---
// Este componente agora inclui seu próprio Card Header/Content/Footer para ser o Card 4 completo
interface RadialChartGastosFixosProps {
  percentual: number;
  isLoading: boolean; // Prop para controlar o estado de loading interno
}

export function RadialChartGastosFixos({
  percentual,
  isLoading,
}: RadialChartGastosFixosProps) {
  // Lógica de cores e mensagens baseada na porcentagem
  let chartFillColor = "var(--success)"; // Cor para status saudável (verde)
  let statusMessage = "Seus gastos fixos estão em um nível saudável!";
  let icon = <IconPigMoney className="size-5 text-success" />; // Ícone padrão
  let footerTextColorClass = "text-success-foreground"; // Cor do texto do footer

  if (percentual > 65) {
    chartFillColor = "var(--danger)"; // Cor para alto comprometimento (vermelho)
    statusMessage =
      "Atenção: Seus gastos fixos estão muito altos. Considere revisar!";
    icon = <IconAlertTriangle className="size-5 text-danger" />;
    footerTextColorClass = "text-danger-foreground";
  } else if (percentual > 50) {
    chartFillColor = "var(--warning)"; // Cor para atenção (amarelo)
    statusMessage = "Fique de olho: Seus gastos fixos exigem atenção.";
    icon = <IconAlertTriangle className="size-5 text-warning" />;
    footerTextColorClass = "text-warning-foreground";
  }

  // Dados para o gráfico radial
  const chartData = [
    { name: "Fixos", value: percentual, fill: chartFillColor },
  ];

  // Configuração do gráfico
  const chartConfig = {
    fixos: {
      label: "Gastos Fixos",
      color: chartFillColor,
    },
    value: {
      label: "Porcentagem",
    },
  } satisfies ChartConfig;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Gastos fixos % renda</CardDescription>
        <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl">
          {isLoading ? <Skeleton /> : `${percentual.toFixed(0)}%`}
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className="gap-1">
            {isLoading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              <>
                {icon}
                {percentual <= 50
                  ? "Ótimo"
                  : percentual <= 65
                  ? "Atenção"
                  : "Crítico"}
              </>
            )}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" /> // Skeleton para a área do gráfico
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={(percentual / 100) * 360}
              innerRadius={60}
              outerRadius={90}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[66, 54]}
              />
              <RadialBar dataKey="value" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {percentual.toFixed(1)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            da sua renda
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter
        className={cn(
          "flex-col items-start gap-1.5 text-sm",
          footerTextColorClass
        )}
      >
        <div className="flex gap-2 font-medium items-center">
          {isLoading ? <Skeleton className="h-5 w-40" /> : statusMessage}
          {!isLoading && icon}
        </div>
        <div className="text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            "Continue monitorando e evite passar de 55%."
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

// --- Componente Principal DashboardCards ---
export function DashboardCards() {
  const { data, isLoading, isError, error } = useDashboard();

  // Animate numbers using useSmoothCountUp
  const saldoAnim = useSmoothCountUp(
    isLoading || !data ? 0 : data.saldoAtual,
    500,
    2
  );
  const receitasAnim = useSmoothCountUp(
    isLoading || !data ? 0 : data.totalEntradas,
    500,
    2
  );
  const despesasAnim = useSmoothCountUp(
    isLoading || !data ? 0 : data.totalGastosFixos + data.totalGastosVariaveis,
    500,
    2
  );
  const fixosPercentAnim = useSmoothCountUp(
    isLoading || !data ? 0 : data.percentualFixos,
    500,
    0
  );

  if (isError) {
    return (
      <div className="text-danger p-4">
        Erro ao carregar os dados do dashboard:{" "}
        {error?.message || "Erro desconhecido."}
      </div>
    );
  }

  // Renderiza skeletons enquanto carrega
  if (isLoading || !data) {
    return (
      <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 font-sans">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="w-24" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl">
              <Skeleton />
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <Skeleton className="h-4 w-16" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium items-center">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="w-24" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl">
              <Skeleton />
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <Skeleton className="h-4 w-16" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium items-center">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="w-24" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl">
              <Skeleton />
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <Skeleton className="h-4 w-16" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium items-center">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardFooter>
        </Card>
        {/* Card 4 (Radial Chart) skeleton - diferente por ter CardContent */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="w-24" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl">
              <Skeleton />
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <Skeleton className="h-4 w-16" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 pb-0 flex items-center justify-center">
            <Skeleton className="h-[200px] w-full" />{" "}
            {/* Skeleton para o gráfico */}
          </CardContent>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium items-center">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const totalGastos = data.totalGastosFixos + data.totalGastosVariaveis;

  // Lógica para o Saldo (Card 1)
  const isSaldoPositive = data.saldoAtual >= 0;
  const saldoColorClass = isSaldoPositive ? "text-success" : "text-danger";
  const saldoBadgeValue = isSaldoPositive
    ? `+${formatCurrency(data.saldoAtual)}`
    : formatCurrency(data.saldoAtual);
  const saldoBadgeIcon = isSaldoPositive ? (
    <IconTrendingUp className="size-12 text-success" />
  ) : (
    <IconTrendingDown className="size-12 text-danger" />
  );
  const saldoMessage = isSaldoPositive
    ? "Parabéns, você está no azul!"
    : "Atenção: Saldo negativo para o mês!";
  const saldoFooterText = isSaldoPositive
    ? "Continue assim para conquistar sua tranquilidade financeira!"
    : "Ajustes são necessários para equilibrar o orçamento.";

  return (
    <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 font-sans">
      {/* Card 1: Saldo Líquido Projetado */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo projetado</CardDescription>
          <CardTitle
            className={cn(
              "text-3xl font-bold @[250px]/card:text-2xl",
              saldoColorClass
            )}
          >
            {formatCurrency(saldoAnim)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {saldoBadgeIcon}
              {saldoBadgeValue}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium items-center">
            {saldoMessage}
            {isSaldoPositive ? (
              <IconArrowUpRight className="size-5 text-success" />
            ) : (
              <IconArrowDownRight className="size-5 text-danger" />
            )}
          </div>
          <div className="text-muted-foreground">{saldoFooterText}</div>
        </CardFooter>
      </Card>

      {/* Card 2: Total de Receitas */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Receitas totais</CardDescription>
          <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl text-success">
            {formatCurrency(receitasAnim)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <IconArrowUpRight className="size-4 text-success" />
              {/* Se você tiver dados de variação, pode colocar aqui */}+
              Receitas
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium items-center">
            Suas receitas para o mês de {data.mesReferencia}!
            <IconTrendingUp className="size-4 text-success" />
          </div>
          <div className="text-muted-foreground">
            Ótimo trabalho! Compare com os meses anteriores.
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Total de Despesas */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Despesas totais</CardDescription>
          <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl text-danger">
            {formatCurrency(despesasAnim)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <IconArrowDownRight className="size-4 text-danger" />
              {/* Se você tiver dados de variação, pode colocar aqui */}
              Total de Gastos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium items-center">
            Acompanhe seus gastos para manter o controle!
            <IconTrendingDown className="size-4 text-danger" />
          </div>
          <div className="text-muted-foreground">
            Controle de despesas é o segredo do sucesso.
          </div>
        </CardFooter>
      </Card>

      {/* Card 4: Percentual de Gastos Fixos (Radial Chart) */}
      <DashboardCardGastosFixosRadial
        percentual={fixosPercentAnim}
        isLoading={isLoading}
      />
    </div>
  );
}
