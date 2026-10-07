import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sprout, UserRound } from "lucide-react";

export const metadata: Metadata = { title: "Boas-vindas" };

// Apresentação opcional: cada botão leva diretamente ao modo correspondente de Conta.
export default function WelcomePage() {
  return <div className="welcome-entry min-h-dvh px-[22px] py-10">
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <main id="conteudo" tabIndex={-1} className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-[402px] flex-col items-center justify-center text-center focus:outline-none">
      <div className="garden-art w-56 md:w-64"><Image src="/brand/nos-tree.png" width={877} height={875} sizes="(max-width: 767px) 224px, 256px" priority alt="Árvore com troncos entrelaçados, símbolo dos vínculos que cultivamos" /></div>
      <h1 className="mt-4 font-display text-[76px] font-semibold leading-none text-leaf">nós<span className="text-lilac">.</span></h1>
      <Heart size={17} className="mt-3 text-leaf" aria-hidden="true" />
      <p className="mt-3 max-w-72 text-base font-semibold leading-6 text-muted">Fortalecendo os laços<br />que unem quem você ama.</p>
      <div className="mt-12 w-full">
        <Link href="/conta" className="continue-button flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3 font-semibold text-white"><Sprout size={19} aria-hidden="true" />Começar agora</Link>
        <Link href="/conta?modo=login" className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-leaf/40 bg-white/40 px-5 py-3 font-semibold text-leaf"><UserRound size={19} aria-hidden="true" />Entrar na minha conta</Link>
      </div>
      <p className="mt-8 text-xs leading-6 text-muted">Vínculos reais. Pequenos cuidados. No tempo de vocês.</p>
    </main>
  </div>;
}
