"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { saveThemePreference } from "./actions";
import { themes, type ThemeId } from "./themes";

type ThemeContextValue = { theme: ThemeId; available: boolean; saving: boolean; message: string; error: boolean; select: (theme: ThemeId) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themes.find(item => item.id === theme)!.canvas);
}

export function ThemeProvider({ children, initialTheme, userId }: { children: ReactNode; initialTheme: ThemeId; userId: string | null }) {
  const pathname = usePathname();
  const publicEntry = pathname === "/boas-vindas" || pathname.startsWith("/conta/") || (pathname === "/conta" && !userId);
  const [theme, setTheme] = useState(initialTheme);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const pending = useRef<ThemeId | null>(null);
  const running = useRef(false);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => { applyTheme(publicEntry ? "light" : theme); }, [theme, publicEntry, initialTheme]);

  async function select(nextTheme: ThemeId) {
    if (!userId) return;
    setTheme(nextTheme);
    applyTheme(publicEntry ? "light" : nextTheme);
    pending.current = nextTheme;
    setSaving(true); setError(false); setMessage("Salvando sua escolha…");
    if (running.current) return;
    running.current = true;
    try {
      // Serializa gravações e agrupa cliques rápidos; a última escolha sempre é gravada por último.
      while (pending.current && active.current) {
        const desired = pending.current;
        pending.current = null;
        let result: { error: string };
        try { result = await saveThemePreference(desired, userId); }
        catch { result = { error: "O tema está aplicado, mas a conexão falhou ao salvar. Tente novamente." }; }
        if (!active.current) return;
        if (!pending.current) {
          setError(Boolean(result.error));
          setMessage(result.error || "Tema salvo na sua conta.");
        }
      }
    } finally {
      running.current = false;
      if (active.current) setSaving(false);
    }
  }

  return <ThemeContext.Provider value={{ theme, available: Boolean(userId), saving, message, error, select }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("A aparência precisa do provedor de tema.");
  return value;
}
