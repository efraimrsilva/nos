"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNucleusIdentityVersion } from "../identity-actions";

export function NucleusIdentitySync({ version }: { version: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    let disposed = false, inFlight = false, firstCheck = true;
    async function update() {
      if (disposed || inFlight || document.hidden || !navigator.onLine) return;
      inFlight = true;
      try {
        const next = await getNucleusIdentityVersion();
        if (!disposed && next !== null && (next !== version || firstCheck)) {
          firstCheck = false;
          // Somente a prop do servidor confirma que a versão chegou à tela.
          // Se o refresh falhar, os próximos ciclos continuam tentando aplicá-la.
          // Confere cada nova versão do servidor, fechando a janela entre a
          // leitura da página e do resumo também durante edições concorrentes.
          // O resumo inclui nomes dos integrantes atuais dos Núcleos compartilhados.
          // Atualiza cabeçalhos, listas e menus renderizados no servidor sem
          // navegar/remontar o documento nem apagar rascunhos dos formulários.
          router.refresh();
        }
      } catch {
        // Falha transitória preserva os dados exibidos; o próximo ciclo retenta.
      } finally { inFlight = false; }
    }
    void update();
    const timer = window.setInterval(() => { void update(); }, 3000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("online", update);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("online", update);
    };
  }, [version, pathname, router]);
  return null;
}
