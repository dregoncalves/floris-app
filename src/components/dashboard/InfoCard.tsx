// src/components/dashboard/InfoCard.tsx
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  value: number;
  footerText: string;
  badgeText: string;
  icon?: ReactNode;
  badgeIcon?: ReactNode;
  isLoading: boolean;
  colorClass?: string;
}

export function InfoCard({
  title,
  value,
  footerText,
  badgeText,
  icon,
  badgeIcon,
  isLoading,
  colorClass = "text-foreground",
}: InfoCardProps) {
  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <Skeleton className="w-24 h-4" />
          </CardDescription>
          <CardTitle className="text-3xl font-bold @[250px]/card:text-4xl">
            <Skeleton className="w-32 h-8" />
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
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle
          className={cn(
            "text-3xl font-bold @[250px]/card:text-4xl",
            colorClass
          )}
        >
          {formatCurrency(value)}
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className="gap-1">
            {badgeIcon}
            {badgeText}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex gap-2 font-medium items-center">
          {footerText}
          {icon}
        </div>
      </CardFooter>
    </Card>
  );
}
