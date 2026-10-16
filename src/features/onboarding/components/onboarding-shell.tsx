import Image from "next/image";
import { Sprout } from "lucide-react";
import type { ReactNode } from "react";
import { AccountReflections } from "@/features/onboarding/components/account-reflections";

export function OnboardingShell({ children, showTree = false }: { children: ReactNode; showTree?: boolean }) {
  return (
    // Reutilizado pelas etapas iniciais para preservar marca, acessibilidade e áreas seguras.
    <div className="app-shell flex flex-col">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2.5" aria-label="Nós">
          <Sprout size={30} strokeWidth={1.6} aria-hidden="true" className="text-leaf" />
          <span className="brand-word">nós<span className="text-lilac">.</span></span>
        </div>
        <span className="rounded-full border border-line px-3.5 py-2 text-[10px] font-semibold tracking-wide text-muted sm:text-xs">UM COMEÇO, MUITAS POSSIBILIDADES</span>
      </header>

      {/* A marca ilustrada é opcional; os fluxos internos priorizam o conteúdo. */}
      <div className={`welcome-grid grid flex-1 items-center gap-7 py-8 md:py-16 ${showTree ? "md:grid-cols-[.95fr_1.05fr] md:gap-16 lg:gap-24" : "content-layout"}`}>
        {showTree && <aside className="text-center">
          <div className="garden-art mx-auto w-40 md:w-full md:max-w-96">
            <Image src="/brand/nos-tree.png" alt="Árvore com troncos entrelaçados, símbolo dos vínculos que cultivamos" width={877} height={875} sizes="(max-width: 767px) 160px, 384px" priority />
          </div>
          <AccountReflections />
        </aside>}

        <main id="conteudo" tabIndex={-1} className="min-w-0 scroll-mt-6 focus:outline-none">{children}</main>
      </div>

      <footer className="mx-auto w-full max-w-3xl text-center text-[11px] leading-5 text-muted">
        <p>© 2026 Nós - Vínculos reais, Pequenos cuidados, No tempo de vocês. Desenvolvido com 💖 por <a href="https://sintagmasoftware.netlify.app/" className="underline underline-offset-2 transition-colors hover:text-leaf motion-reduce:transition-none">Sintagma Software</a>. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
