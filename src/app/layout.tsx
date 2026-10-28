import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./layout-system.css";
import "@/features/appearance/themes.css";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveTheme } from "@/features/appearance/themes";
import { ThemeProvider } from "@/features/appearance/theme-provider";

export const metadata: Metadata = {
  title: { default: "Nós — Cultive seus vínculos", template: "%s | Nós" },
  description: "Um espaço para cultivar vínculos, construir acordos e crescer juntos.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f5f7f1", viewportFit: "cover" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const result = await supabase?.auth.getUser();
  const user = result?.error ? null : result?.data.user;
  const theme = resolveTheme(user?.user_metadata.appearance_theme);
  // A primeira pintura já recebe as cores da conta; sem preferência global que vaze entre pessoas.
  return <html lang="pt-BR" data-theme={theme} data-scroll-behavior="smooth"><body className="font-sans antialiased"><ThemeProvider key={user?.id ?? "visitor"} initialTheme={theme} userId={user?.id ?? null}>{children}</ThemeProvider></body></html>;
}
