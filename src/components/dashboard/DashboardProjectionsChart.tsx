// src/components/dashboard/DashboardProjectionsChart.tsx
"use client";

import * as React from "react";
// 1. Importando os componentes para o Gráfico de Barras
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Componentes da UI (mantidos)
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "../ui/skeleton";

// 2. Configuração de cores para as barras
const chartConfig = {
  saldo: {
    label: "Saldo",
  },
  "saldo-positivo": {
    label: "Saldo Positivo",
    color: "hsl(var(--chart-2))", // Verde
  },
  "saldo-negativo": {
    label: "Saldo Negativo",
    color: "hsl(var(--chart-5))", // Vermelho
  },
} satisfies ChartConfig;

export function DashboardProjectionsChart() {
  const isMobile = useIsMobile();
  const { data, isLoading } = useDashboard();
  const [timeRange, setTimeRange] = React.useState<"3m" | "6m">("6m");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("3m");
    }
  }, [isMobile]);

  const chartData = React.useMemo(() => {
    if (!data?.fluxoProjetadoProximosMeses) return [];
    const monthsToShow = timeRange === "3m" ? 3 : 6;
    return data.fluxoProjetadoProximosMeses
      .slice(0, monthsToShow)
      .map((item) => ({ ...item, date: item.mes }));
  }, [data, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex-1">
          <CardTitle>Projeção de Fluxo de Caixa</CardTitle>
          <CardDescription>
            Previsão do saldo final para os próximos meses
          </CardDescription>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value: "3m" | "6m") => value && setTimeRange(value)}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="3m">3 Meses</ToggleGroupItem>
            <ToggleGroupItem value="6m">6 Meses</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value: "3m" | "6m") => value && setTimeRange(value)}
          >
            <SelectTrigger
              className="flex w-32 @[767px]/card:hidden"
              size="sm"
              aria-label="Selecionar período"
            >
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="3m" className="rounded-lg">
                3 Meses
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                6 Meses
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            // 3. Usando o BarChart
            <BarChart data={chartData} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const [year, month] = value.split("-");
                  return new Date(
                    Number(year),
                    Number(month) - 1
                  ).toLocaleDateString("pt-BR", {
                    month: "short",
                    year: "2-digit",
                  });
                }}
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
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value + "-02").toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })
                    }
                    formatter={(value) => (
                      // Custom formatter para mostrar a cor certa no tooltip
                      <div className="flex items-start">
                        <div className="flex text-left justify-start gap-2">
                          <span className="text-muted-foreground">Saldo</span>
                          <span className="font-bold">
                            {formatCurrency(Number(value))}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              {/* 4. Lógica para renderizar cada barra com a cor correspondente */}
              <Bar dataKey="saldo" radius={4} maxBarSize={50}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.saldo >= 0 ? "var(--success)" : "var(--danger)"}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
