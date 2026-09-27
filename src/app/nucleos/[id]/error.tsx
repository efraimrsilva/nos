"use client";

import Link from "next/link";
import { routes } from "@/shared/routes";

export default function NucleusError({ reset }: { reset: () => void }) {
  return <main className="app-shell mx-auto flex max-w-xl flex-col justify-center">
    <h1 className="font-display text-[30px] leading-tight">Não conseguimos carregar este Núcleo agora.</h1>
    <p className="mt-3 text-sm leading-7 text-muted">Tente novamente em instantes.</p>
    <button type="button" onClick={reset} className="continue-button mt-6 min-h-11 self-start rounded-xl bg-forest px-5 text-sm font-semibold text-white">Tentar novamente</button>
    <Link href={routes.account} className="mt-4 inline-flex min-h-11 items-center self-start text-sm font-semibold text-leaf underline">Minha conta</Link>
  </main>;
}
