"use client";

import { usePathname } from "next/navigation";

import MainLayout from "@/components/mainlayout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Verifica se está na rota de login
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Aplica o layout com sidebar para outras rotas
  return <MainLayout>{children}</MainLayout>;
}
