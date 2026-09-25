import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nós — Cultive seus vínculos", template: "%s | Nós" },
  description: "Um espaço para cultivar vínculos, construir acordos e crescer juntos.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f6f3eb", viewportFit: "cover" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><body className="font-sans antialiased">{children}</body></html>;
}
