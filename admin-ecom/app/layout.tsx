import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminShell } from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hasilaza Motor - Administration",
  description: "Panneau d'administration pour la gestion de Hasilaza Motor - Motos et pièces détachées au Sénégal",
  keywords: ["admin", "gestion motos", "Hasilaza Motor", "administration e-commerce"],
  authors: [{ name: "Hasilaza Motor" }],
  creator: "Hasilaza Motor",
  publisher: "Hasilaza Motor",
  metadataBase: new URL('https://admin.hasilaza-motor.com'),
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    url: 'https://admin.hasilaza-motor.com',
    title: "Hasilaza Motor - Administration",
    description: "Panneau d'administration pour la gestion de Hasilaza Motor",
    siteName: 'Hasilaza Motor Admin',
    images: [
      {
        url: '/logo/HasilazaMotor.png',
        width: 512,
        height: 512,
        alt: 'Hasilaza Motor Logo',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo/HasilazaMotor.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo/HasilazaMotor.png',
  },
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
