import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./layout-system.css";

export const metadata: Metadata = {
  title: { default: "Nós — Cultive seus vínculos", template: "%s | Nós" },
  description: "Um espaço para cultivar vínculos, construir acordos e crescer juntos.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f5f7f1", viewportFit: "cover" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body className="font-sans antialiased">{children}</body></html>;
}
