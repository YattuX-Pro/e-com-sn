import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminShell } from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin E-Com",
  description: "Panneau d'administration E-Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
