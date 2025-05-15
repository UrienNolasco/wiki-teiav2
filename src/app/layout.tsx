import "./globals.css";

import type { Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import AuthProvider from "./providers/auth";


export const metadata: Metadata = {
  title: "Wiki Teia",
  description: "Wiki teia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto p-6">
              <AuthProvider>{children}</AuthProvider>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
