"use client";

import * as React from "react";
import { IconChartBar, IconSettings } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArrowLeftRight, LayoutDashboard, PiggyBank } from "lucide-react";
import Image from "next/image";

const data = {
  user: {
    name: "Drezolis",
    email: "drezolis@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Configurações",
      url: "#",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  src={"/plant-pot-teste.png"}
                  width={20}
                  height={20}
                  alt="Floris Icon"
                ></Image>
                <span className="text-base font-semibold">Floris</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
            { title: "Lançamentos", url: "/lancamentos", icon: ArrowLeftRight },
            { title: "Metas", url: "/metas", icon: IconChartBar },
            {
              title: "Reserva de Emergência",
              url: "/reserva-emergencia",
              icon: PiggyBank,
            },
          ]}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
