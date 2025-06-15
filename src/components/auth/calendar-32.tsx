"use client";

import * as React from "react";
import { CalendarPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";

interface Calendar32Props {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
}

export function Calendar32({
  value,
  onChange,
  label = "Data de nascimento",
}: Calendar32Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
            type="button"
          >
            {value ? value.toLocaleDateString() : "Selecione a data"}
            <CalendarPlusIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-auto overflow-hidden p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Selecione a data</DrawerTitle>
            <DrawerDescription>
              Informe sua data de nascimento
            </DrawerDescription>
          </DrawerHeader>
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
          />
        </DrawerContent>
      </Drawer>
      <div className="text-muted-foreground px-1 text-sm">
        Melhor experiência no mobile.
      </div>
    </div>
  );
}
