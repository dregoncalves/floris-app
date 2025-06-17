// src/components/dashboard/DashboardCardReservaEmergencia.tsx
"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { ReservaEmergencia } from "@/types/dashboard";
import { PlusCircle, ShieldCheck } from "lucide-react";

interface Props {
  reservaData: ReservaEmergencia | null;
  isLoading: boolean;
}

// 1. Ajuste na cor da barra principal para usar a cor de primeiro plano do tema
const chartConfig = {
  percentual: {
    label: "Percentual",
  },
  reserva: {
    label: "Reserva",
    color: "hsl(var(--foreground))", // Cor principal da barra
  },
} satisfies ChartConfig;

export function DashboardCardReservaEmergencia({
  reservaData,
  isLoading,
}: Props) {
  // 1. Estado de Carregamento (Mantido)
  if (isLoading) {
    return (
      <Card className="flex-1 min-w-[300px] flex flex-col justify-between">
        <CardHeader className="items-center pb-0">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center">
          <Skeleton className="mx-auto aspect-square max-h-[180px] w-[180px] rounded-full" />
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm items-center">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardFooter>
      </Card>
    );
  }

  // 2. Estado Vazio (Reserva não criada - Mantido)
  if (!reservaData) {
    return (
      <Card className="flex-1 flex flex-col justify-center items-center text-center p-6 min-w-[300px]">
        <PlusCircle className="size-12 text-muted-foreground mb-4" />
        <CardTitle className="mb-2">Crie sua Reserva de Emergência</CardTitle>
        <CardDescription className="mb-4">
          Comece a construir sua segurança financeira para imprevistos.
        </CardDescription>
        <Button>Começar Agora</Button>
      </Card>
    );
  }

  // 3. Estado com Dados (Design refinado)
  const { percentualConcluido, valorAtual, valorObjetivo } = reservaData;
  const chartData = [
    {
      nome: "reserva",
      percentual: percentualConcluido,
      fill: "var(--color-reserva)",
    },
  ];
  const endAngle = 0 + (percentualConcluido / 100) * 360;

  return (
    <Card className="flex flex-col flex-1 min-w-[300px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Reserva de Emergência</CardTitle>
        <CardDescription>Sua segurança para imprevistos</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            innerRadius={60}
            outerRadius={85} // Mantém o raio externo
            barSize={10} // Define a espessura da barra
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="fill-muted" // Fundo transparente
            />
            {/* 2. Cor de fundo da barra agora é um tom sutil da cor de borda */}
            <RadialBar
              dataKey="percentual"
              background={{ fill: "var(--primary) / 0.5)" }}
              cornerRadius={20}
              className="fill-[var(--primary)]" // Aplica a cor do foreground diretamente aqui
            />
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
                          {percentualConcluido.toFixed(0)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Concluído
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
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm items-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          Meta de Reserva <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <div className="text-muted-foreground leading-none">
          {formatCurrency(valorAtual)} de {formatCurrency(valorObjetivo)}
        </div>
      </CardFooter>
    </Card>
  );
}
