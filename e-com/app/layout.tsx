import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hasilaza Motor - Motos et Pièces Détachées au Sénégal",
  description: "Leader dans la vente de motos et pièces détachées au Sénégal. Découvrez nos motos performantes à prix abordables avec un service après-vente d'excellence.",
  keywords: ["motos Sénégal", "pièces détachées motos", "Hasilaza Motor", "vente motos Dakar", "tricycles", "service après-vente motos"],
  authors: [{ name: "Hasilaza Motor" }],
  creator: "Hasilaza Motor",
  publisher: "Hasilaza Motor",
  metadataBase: new URL('https://hasilaza-motor.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    url: 'https://hasilaza-motor.com',
    title: "Hasilaza Motor - Motos et Pièces Détachées au Sénégal",
    description: "Leader dans la vente de motos et pièces détachées au Sénégal. Découvrez nos motos performantes à prix abordables avec un service après-vente d'excellence.",
    siteName: 'Hasilaza Motor',
    images: [
      {
        url: '/logo/HasilazaMotor.png',
        width: 512,
        height: 512,
        alt: 'Hasilaza Motor Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Hasilaza Motor - Motos et Pièces Détachées au Sénégal",
    description: "Leader dans la vente de motos et pièces détachées au Sénégal. Découvrez nos motos performantes à prix abordables avec un service après-vente d'excellence.",
    images: ['/logo/HasilazaMotor.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
