import "@radix-ui/themes/styles.css";
import "./globals.css";

import { Providers } from "@/presentation/lib/providers";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transfer.io",
  description: "Transfer.io - Transferências de dinheiro",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
