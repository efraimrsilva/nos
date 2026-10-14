"use client";
import Link from "next/link";
export default function ControlsError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-xl p-6"><h1 className="font-display text-2xl">Não foi possível abrir esta página</h1><p role="alert" className="mt-3 text-sm leading-7">Tente novamente em instantes. Nenhuma configuração foi alterada.</p><button onClick={reset} className="mt-4 min-h-11 rounded-xl border border-line px-4">Tentar novamente</button><Link href="/nucleos" className="ml-4 inline-flex min-h-11 items-center underline">Seus Núcleos</Link></main>;
}
