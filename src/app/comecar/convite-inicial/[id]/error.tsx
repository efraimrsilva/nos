"use client";

import Link from "next/link";
export default function InitialInvitationError({ reset }: { reset: () => void }) {
  return <section>
    <h1 className="font-display text-[30px]">Não conseguimos consultar o convite agora.</h1>
    <p className="mt-3 text-sm leading-7 text-muted">Tente novamente. Esta falha não significa que seu Núcleo foi removido.</p>
    <button onClick={reset} className="continue-button mt-5 min-h-11 rounded-xl bg-forest px-5 text-sm font-semibold text-white">Tentar novamente</button>
    <Link href="/nucleos" className="mt-4 flex min-h-11 items-center text-sm font-semibold text-leaf underline">Voltar a Seus Núcleos</Link>
  </section>;
}
