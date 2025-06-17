"use client";

import { useState } from "react";
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
import {
  PlusCircle,
  ShieldCheck,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReservaEmergenciaMutations } from "@/hooks/useReservaEmergencia";

// Componentes de UI
import { ReservaFormModal } from "./ReservaFormModal";
import { AporteFormModal } from "./AporteFormModal";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

// Tipos de Payload
import {
  ReservaCreatePayload,
  ReservaUpdatePayload,
} from "@/services/ReservaEmergenciaService";

interface Props {
  reservaData: ReservaEmergencia | null;
  isLoading: boolean;
}

const chartConfig = {
  percentual: { label: "Percentual" },
  reserva: { label: "Reserva", color: "hsl(var(--foreground))" },
} satisfies ChartConfig;

export function DashboardCardReservaEmergencia({
  reservaData,
  isLoading,
}: Props) {
  const [isCreateEditModalOpen, setCreateEditModalOpen] = useState(false);
  const [isAporteModalOpen, setAporteModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    createReserva,
    updateReserva,
    deleteReserva,
    isCreating,
    isUpdating,
    isDeleting,
  } = useReservaEmergenciaMutations();

  const handleSaveMeta = (data: { valorObjetivo: number }) => {
    if (reservaData?.id) {
      // Editando a meta de uma reserva existente
      const payload: ReservaUpdatePayload = {
        valorObjetivo: data.valorObjetivo,
        valorAtual: reservaData.valorAtual, // Mantém o valor atual que já existe
        ativa: reservaData.ativa,
      };
      updateReserva(payload, {
        onSuccess: () => setCreateEditModalOpen(false),
      });
    } else {
      // Criando uma nova reserva
      const payload: ReservaCreatePayload = {
        valorObjetivo: data.valorObjetivo,
        valorAtual: 0, // Ao criar, valor atual é 0
      };
      createReserva(payload, {
        onSuccess: () => setCreateEditModalOpen(false),
      });
    }
  };

  const handleAporte = (data: { valor: number }) => {
    if (!reservaData) return; // Segurança: não deveria ser possível aportar sem reserva

    const novoValorAtual = reservaData.valorAtual + data.valor;

    const payload: ReservaUpdatePayload = {
      valorObjetivo: reservaData.valorObjetivo, // Mantém a meta existente
      valorAtual: novoValorAtual, // Envia o novo valor somado
      ativa: reservaData.ativa,
    };
    updateReserva(payload, { onSuccess: () => setAporteModalOpen(false) });
  };

  const handleDelete = () => {
    deleteReserva(undefined, {
      onSuccess: () => setDeleteModalOpen(false),
    });
  };

  if (isLoading) {
    return (
      <Card className="flex-1 min-w-[300px] flex flex-col justify-between">
        <CardHeader className="items-center pb-0">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center">
          <Skeleton className="mx-auto aspect-square max-h-[180px] w-[180px] rounded-full" />
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm items-center">
          <Skeleton className="h-4 w-3/4" />
        </CardFooter>
      </Card>
    );
  }

  if (!reservaData) {
    return (
      <>
        <Card className="flex-1 flex flex-col justify-center items-center text-center p-6 min-w-[300px]">
          <PlusCircle className="size-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Crie sua Reserva de Emergência</CardTitle>
          <CardDescription className="mb-4">
            Comece a construir sua segurança financeira para imprevistos.
          </CardDescription>
          <Button onClick={() => setCreateEditModalOpen(true)}>
            Começar Agora
          </Button>
        </Card>
        <ReservaFormModal
          isOpen={isCreateEditModalOpen}
          onClose={() => setCreateEditModalOpen(false)}
          onSave={handleSaveMeta}
          isSaving={isCreating}
          initialData={{}}
        />
      </>
    );
  }

  const { percentualConcluido, valorAtual, valorObjetivo } = reservaData;
  const chartData = [
    {
      nome: "reserva",
      percentual: percentualConcluido > 100 ? 100 : percentualConcluido,
      fill: "var(--danger)",
    },
  ];
  const endAngle =
    0 + ((percentualConcluido > 100 ? 100 : percentualConcluido) / 100) * 360;

  return (
    <>
      <Card className="flex flex-col flex-1 min-w-[300px]">
        <CardHeader className="items-center pb-0 relative">
          <CardTitle>Reserva de Emergência</CardTitle>
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setAporteModalOpen(true)}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Aportar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCreateEditModalOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar Meta</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteModalOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
              innerRadius="60%"
              outerRadius="95%"
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="fill-muted"
              />
              <RadialBar dataKey="percentual" background cornerRadius={10} />
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
                            {`${Math.round(percentualConcluido)}%`}
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
        <CardFooter className="flex-col gap-2 text-sm items-center">
          <div className="flex items-center gap-2 font-medium leading-none">
            Meta de Reserva <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="text-muted-foreground leading-none">
            {formatCurrency(valorAtual)} de {formatCurrency(valorObjetivo)}
          </div>
        </CardFooter>
      </Card>

      {/* Modais sendo renderizados */}
      <ReservaFormModal
        isOpen={isCreateEditModalOpen}
        onClose={() => setCreateEditModalOpen(false)}
        onSave={handleSaveMeta}
        isSaving={isCreating || isUpdating}
        initialData={reservaData}
      />
      <AporteFormModal
        isOpen={isAporteModalOpen}
        onClose={() => setAporteModalOpen(false)}
        onSave={handleAporte}
        isSaving={isUpdating}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
