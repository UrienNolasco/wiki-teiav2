import "./globals.css";

import type { Metadata } from "next";

import ClientLayout from "@/components/client-layout";

import AuthProvider from "./providers/auth";

export const metadata: Metadata = {
  title: "Wiki Teia",
  description: "Wiki teia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
