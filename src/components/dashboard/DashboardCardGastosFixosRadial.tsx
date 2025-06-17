"use client";

import { AlertTriangle, PiggyBank } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface DashboardCardGastosFixosRadialProps {
  percentual: number;
  isLoading: boolean;
}

export function DashboardCardGastosFixosRadial({
  percentual,
  isLoading,
}: DashboardCardGastosFixosRadialProps) {
  // Lógica de cor e texto
  let fillColor = "var(--success)";
  let footerTextColorClass = "text-success-foreground";
  let icon = <PiggyBank className="size-6 text-success" />;
  let status = "Ótimo";
  let statusMessage = "Seus gastos fixos estão em um nível saudável!";

  if (percentual > 65) {
    fillColor = "var(--danger)";
    footerTextColorClass = "text-danger-foreground";
    icon = <AlertTriangle className="size-6 text-danger" />;
    status = "Crítico";
    statusMessage =
      "Atenção: Seus gastos fixos estão muito altos. Considere revisar!";
  } else if (percentual > 50) {
    fillColor = "var(--warning)";
    footerTextColorClass = "text-warning";
    icon = <AlertTriangle className="size-6 text-warning" />;
    status = "Atenção";
    statusMessage = "Fique de olho: Seus gastos fixos exigem atenção.";
  }

  // Prepara os dados do gráfico
  const chartData = [{ nome: "fixos", valor: percentual, fill: fillColor }];

  const chartConfig = {
    valor: { label: "Percentual" },
    fixos: { label: "Gastos Fixos", color: fillColor },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div className="flex justify-between">
          <CardTitle>Gastos fixos % da renda</CardTitle>
          <Badge variant="outline" className="gap-1">
            {icon}
            {status}
          </Badge>
        </div>
        <CardDescription>Quanto da sua renda está comprometida</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(percentual / 100) * 360}
            innerRadius={70}
            outerRadius={95}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[76, 62]}
            />
            <RadialBar dataKey="valor" background cornerRadius={10} />
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {isLoading
                            ? "..."
                            : percentual.toFixed(1).replace(".", ",") + "%"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          da sua renda
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter
        className={cn("flex-col gap-2 text-sm", footerTextColorClass)}
      >
        <div className="flex items-start gap-2 leading-none font-medium">
          <span>{statusMessage}</span>
        </div>
        <div className="text-muted-foreground leading-none">
          Continue monitorando e evite passar de 55%.
        </div>
      </CardFooter>
    </Card>
  );
}
