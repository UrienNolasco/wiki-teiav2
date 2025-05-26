"use client";

import { AvatarImage } from "@radix-ui/react-avatar";
import {
  BarChart2,
  BookOpen,
  CheckSquare,
  ChevronRight,
  Edit,
  FileText,
  Home,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import React from "react";

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

import { Avatar } from "./ui/avatar";

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
    url: "/dashboard",
    icon: BarChart2,
  }
];

export function AppSidebar() {
  const data = useSession();
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border bg-white dark:bg-gray-950">
      <div className="py-4 px-3 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8 px-3">
          <Avatar>
            <AvatarImage src="/teia-logo-512.jpg"/>
          </Avatar>
          <span className="text-lg font-semibold" style={{ fontFamily: "Tan Mon Cheri" }}>WikiTeia</span>
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = pathname === item.url || 
                    (item.url !== "/" && pathname.startsWith(item.url));
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        className={cn(
                          "flex items-center justify-between",
                          isActive && "bg-purple-100 text-purple-700 font-medium"
                        )}
                      >
                        <Link href={item.url} className="flex items-center w-full">
                          <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                          <span className="flex-1 truncate">{item.title}</span>
                          {isActive && <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Devolutivas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/devolutiva" className="flex items-center">
                      <FileText className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 truncate">Devolutivas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/devolutiva/approve" className="flex items-center">
                      <CheckSquare className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 truncate">Aprovar Devolutivas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>


          <SidebarGroup>
            <SidebarGroupLabel>Configurações</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/gerenciamento" className="flex items-center">
                      <Edit className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 truncate">Gerenciamento de Funções</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/lib-manegement" className="flex items-center">
                      <Edit className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 truncate">Gerenciar Conteúdos</span>
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
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                    <AvatarImage className="object-fill"
                    src={data.data?.user.image ?? ""}
                    alt={data.data?.user.name ?? "User"}
                  />
                    </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{data.data?.user.name}</span>
                    <span className="text-xs text-muted-foreground">{data.data?.user.email}</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                signOut();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Sidebar>
  );
}
