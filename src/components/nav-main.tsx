"use client";

import { IconCirclePlusFilled, IconChevronDown } from "@tabler/icons-react";

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
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
  }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Melhor auto-expandir o submenu se já está em lançamentos:
  useEffect(() => {
    if (pathname.startsWith("/lancamentos")) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Entrada Rápida fixa */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Entrada Rápida"
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Entrada Rápida</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Divider */}
        <div className="px-4 py-2">
          <Separator />
        </div>

        {/* Menus principais */}
        <SidebarMenu>
          {items.map((item) =>
            item.title === "Lançamentos" ? (
              <SidebarMenuItem key={item.title}>
                <Collapsible open={open} onOpenChange={setOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`cursor-pointer transition-all duration-300 ${
                        pathname.startsWith("/lancamentos")
                          ? "bg-black/10 dark:bg-white/10"
                          : ""
                      }`}
                      tooltip={item.title}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <IconChevronDown
                        className={`ml-auto transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <SidebarMenu className="pl-4 pr-2 pt-3 w-full">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="w-full text-sm truncate"
                        >
                          <Link href="/lancamentos/entradas">Entradas</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="w-full text-sm truncate"
                        >
                          <Link href="/lancamentos/gastos">Gastos</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`cursor-pointer transition-all duration-300 ${
                    pathname === item.url ? "bg-black/10 dark:bg-white/10" : ""
                  }`}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
