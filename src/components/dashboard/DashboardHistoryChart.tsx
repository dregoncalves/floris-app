// src/components/dashboard/DashboardHistoryChart.tsx
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { useDashboardHistorico } from "@/hooks/useDashboardHistorico";
import { formatCurrency } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";

// Configuração de cores e legendas para as áreas do gráfico
const chartConfig = {
  totalEntradas: {
    label: "Entradas",
    color: "hsl(var(--chart-2))", // Verde
  },
  totalGastos: {
    label: "Gastos",
    color: "hsl(var(--chart-5))", // Vermelho
  },
} satisfies ChartConfig;

export function DashboardHistoryChart() {
  const { data: historico, isLoading } = useDashboardHistorico();

  // Renomeia o campo 'mes' para 'date' para o gráfico e formata o mês
  const chartData = React.useMemo(() => {
    return (
      historico?.map((item) => ({
        ...item,
        date: new Date(item.mes + "-02").toLocaleDateString("pt-BR", {
          month: "short",
          year: "2-digit",
        }),
      })) ?? []
    );
  }, [historico]);

  return (
    <Card className="min-h-[380px]">
      <CardHeader>
        <CardTitle>Histórico de Entradas vs. Gastos</CardTitle>
        <CardDescription>Comparativo dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-totalEntradas)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-totalEntradas)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-totalGastos)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-totalGastos)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={85}
                tickFormatter={(value) => formatCurrency(Number(value))}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="totalGastos"
                type="natural"
                fill="url(#fillGastos)"
                stroke="var(--color-totalGastos)"
                stackId="1"
              />
              <Area
                dataKey="totalEntradas"
                type="natural"
                fill="url(#fillEntradas)"
                stroke="var(--color-totalEntradas)"
                stackId="2"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
