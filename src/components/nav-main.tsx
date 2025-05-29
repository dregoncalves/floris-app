"use client";

import {
  IconCirclePlusFilled,
  IconMail,
  IconChevronDown,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import React from "react";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string; // para aceitar qualquer Icon
  }[];
}) {
  // estado para o menu sanfona de lançamentos
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Entrada Rápida"
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Entrada Rápida</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Menus principais */}
        <SidebarMenu>
          {items.map((item) =>
            item.title === "Lançamentos" ? (
              <SidebarMenuItem key={item.title}>
                <Collapsible open={open} onOpenChange={setOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="cursor-pointer"
                      tooltip={item.title}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <IconChevronDown
                        className={`ml-auto transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <SidebarMenu className="pl-4 pr-2 w-full">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="w-full text-sm truncate"
                        >
                          <Link href="#">Entradas</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="w-full text-sm truncate"
                        >
                          <Link href="#">Saídas</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {/* <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="w-full text-sm truncate"
                        >
                          <Link href="#">Simular</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem> */}
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="cursor-pointer"
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
