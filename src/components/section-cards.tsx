"use client";
import React, { useEffect, useState } from "react";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconPigMoney,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSmoothCountUp } from "@/hooks/use-smooth-count-up";

// Componente simples pra mostrar um esqueleto de carregamento
function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded bg-muted h-7 w-32 ${className}`} />
  );
}

// Tipagem dos dados financeiros
type FinanceData = {
  saldo: number;
  receitas: number;
  despesas: number;
  fixos: number;
};

export function SectionCards() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simula o carregamento dos dados da API
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData({
        saldo: 1250,
        receitas: 5000,
        despesas: 3750,
        fixos: 48,
      });
      setLoading(false);
    }, 1100);
  }, []);

  // Animações para os valores numéricos
  const saldoAnim = useSmoothCountUp(!data || loading ? 0 : data.saldo, 500, 2);
  const receitasAnim = useSmoothCountUp(
    !data || loading ? 0 : data.receitas,
    500,
    2
  );
  const despesasAnim = useSmoothCountUp(
    !data || loading ? 0 : data.despesas,
    500,
    2
  );
  const fixosAnim = useSmoothCountUp(!data || loading ? 0 : data.fixos, 500, 0);

  return (
    <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 font-sans">
      {/* Card de Saldo Final do Mês */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo projetado</CardDescription>
          <CardTitle className="text-3xl font-bold text-success @[250px]/card:text-4xl">
            {loading ? (
              <Skeleton />
            ) : (
              `R$ ${saldoAnim.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <IconTrendingUp className="size-4 text-success" />
              +R$150
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium items-center">
            {loading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <>
                Parabéns, você está no azul!
                <IconArrowUpRight className="size-5 text-success" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              "Continue assim para conquistar sua tranquilidade financeira!"
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Card de Total de Receitas */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Receitas totais</CardDescription>
          <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl">
            {loading ? (
              <Skeleton />
            ) : (
              `R$ ${receitasAnim.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <IconArrowUpRight className="size-4 text-info" />
              +2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium items-center">
            {loading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <>
                Suas receitas aumentaram este mês!
                <IconTrendingUp className="size-4 text-info" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              "Ótimo trabalho! Compare com os meses anteriores."
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Card de Total de Despesas */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Despesas totais</CardDescription>
          <CardTitle className="text-3xl font-bold text-danger @[250px]/card:text-4xl">
            {loading ? (
              <Skeleton />
            ) : (
              `R$ ${despesasAnim.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <IconArrowDownRight className="size-4 text-danger" />
              -5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium items-center">
            {loading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <>
                Você conseguiu reduzir seus gastos!
                <IconTrendingDown className="size-4 text-danger" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              "Controle de despesas é o segredo do sucesso."
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Card de Percentual de Gastos Fixos */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Gastos fixos % renda</CardDescription>
          <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl">
            {loading ? <Skeleton /> : `${fixosAnim}%`}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <IconAlertTriangle className="size-5 text-warning" />
              OK
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium items-center">
            {loading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <>
                Seus gastos fixos estão dentro do ideal!
                <IconPigMoney className="size-5 text-warning" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              "Continue monitorando e evite passar de 55%."
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
