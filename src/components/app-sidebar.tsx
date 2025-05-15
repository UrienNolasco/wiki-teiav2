"use client";

import {
  BarChart2,
  BookOpen,
  ChevronRight,
  Edit,
  FileText,
  Home,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Página Inicial",
    url: "/",
    icon: Home,
  },
  {
    title: "Biblioteca de Conteúdos",
    url: "/biblioteca",
    icon: BookOpen,
  },
  {
    title: "Dashboard de Progresso",
    url: "/progresso",
    icon: BarChart2,
  },
  {
    title: "Gerenciamento de Funções",
    url: "/configuracoes",
    icon: Settings,
  },
  {
    title: "Gerenciar Conteúdos",
    url: "/biblioteca-crud",
    icon: Edit,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    // This would typically handle actual logout functionality
  };

  return (
    <Sidebar className="border-r border-border bg-white dark:bg-gray-950">
      <div className="py-4 px-3 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8 px-3">
          <div className="h-8 w-8 rounded-full bg-purple-gradient flex items-center justify-center text-white font-bold">
            W
          </div>
          <span className="text-lg font-semibold">Workshop Manager</span>
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (item.url !== "/" && pathname.startsWith(item.url));

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "flex items-center justify-between",
                          isActive &&
                            "bg-purple-100 text-purple-700 font-medium"
                        )}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center w-full"
                        >
                          <item.icon className="mr-3 h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {isActive && (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-8">
            <SidebarGroupLabel>Links Rápidos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/devolutivas" className="flex items-center">
                      <FileText className="mr-3 h-4 w-4" />
                      <span className="flex-1">Devolutivas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/busca" className="flex items-center">
                      <Search className="mr-3 h-4 w-4" />
                      <span className="flex-1">Busca Avançada</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="mt-auto p-3 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Usuário</span>
                    <span className="text-xs text-muted-foreground">
                      user@example.com
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Sidebar>
  );
}
