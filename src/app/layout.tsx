import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlacarGreen - IA para Apostas",
  description: "Plataforma profissional de inteligência para apostas esportivas com IA, ML e dados em tempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
