"use client";

import { useActionState, useState, type FormEvent } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { createNucleus } from "@/features/nuclei/actions";
import { routes } from "@/shared/routes";

export function NucleusPurposeForm({ suggestion, type }: { suggestion: string; type: string }) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [creation, createAction, creating] = useActionState(createNucleus, { error: "" });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !purpose.trim()) {
      setError("Informe o nome e o propósito para conferir o rascunho.");
      return;
    }
    setName(name.trim());
    setPurpose(purpose.trim());
    setError("");
    setPreview(true);
  }

  if (preview) {
    return (
      <section className="mt-6 rounded-[22px] border border-line bg-white p-6" aria-label="Rascunho do Núcleo">
        <h2 className="font-display text-2xl">Confira seu rascunho</h2>
        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-muted">Nome do Núcleo</p>
        <p className="mt-1 break-words text-lg font-semibold">{name}</p>
        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-muted">Nosso propósito</p>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-7">{purpose}</p>
        <p className="mt-6 rounded-xl bg-[#eff3e6] p-4 text-xs leading-6 text-muted">Nenhum Núcleo foi criado. Este rascunho não é salvo e será perdido ao recarregar a página. Para criar, você precisa entrar na sua conta e ter o serviço configurado.</p>
        <p className="mt-4 text-sm leading-6 text-muted">Ainda não tem conta? <Link href={routes.account} className="font-semibold text-leaf underline">Criar conta ou entrar</Link>. Ao sair desta página, será necessário preencher o rascunho novamente.</p>
        <form action={createAction} className="mt-4">
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="purpose" value={purpose} />
          {creation.error && <p role="alert" className="mb-3 text-sm font-semibold text-[#9a3153]">{creation.error}</p>}
          <button type="submit" disabled={creating} className="continue-button min-h-12 w-full rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{creating ? "Criando…" : "Criar Núcleo"}</button>
        </form>
        <button type="button" onClick={() => setPreview(false)} className="mt-5 min-h-11 rounded-xl border border-line px-5 text-sm font-semibold transition-colors hover:bg-canvas">Editar</button>
      </section>
    );
  }

  return (
    // Não usamos submissão GET: nome e propósito não podem entrar na URL ou nos logs de navegação.
    <form onSubmit={submit} className="mt-6" noValidate>
      <label htmlFor="nucleus-name" className="block text-xs font-bold text-muted">Nome do Núcleo</label>
      <input id="nucleus-name" type="text" autoComplete="off" maxLength={80} value={name} onChange={event => { setName(event.target.value); setError(""); }} placeholder="Ex.: Nós dois" className="mt-2 w-full rounded-[14px] border border-line bg-white px-4 py-3.5 text-sm font-semibold text-forest" aria-invalid={!!error && !name.trim()} aria-describedby={error ? "purpose-error" : undefined} />

      <label htmlFor="nucleus-purpose" className="mt-5 block text-xs font-bold text-muted">Nosso propósito</label>
      <textarea id="nucleus-purpose" rows={4} maxLength={500} value={purpose} onChange={event => { setPurpose(event.target.value); setError(""); }} placeholder="O que vocês querem cultivar juntos?" className="mt-2 w-full resize-y rounded-[14px] border border-line bg-white px-4 py-3.5 text-sm leading-6 text-forest" aria-invalid={!!error && !purpose.trim()} aria-describedby={error ? "purpose-error" : undefined} />

      <div className="mt-3 rounded-[14px] bg-[#eff3e6] p-4">
        <p className="flex items-start gap-2 text-xs leading-5 text-muted"><Lightbulb size={16} className="mt-0.5 shrink-0 text-leaf" aria-hidden="true" />Sugestão para este tipo de Núcleo: {suggestion}</p>
        <button type="button" onClick={() => { setPurpose(suggestion); setError(""); }} className="mt-2 min-h-11 rounded-lg px-2 text-sm font-semibold text-leaf transition-colors hover:bg-white">Usar sugestão</button>
      </div>
      {error && <p id="purpose-error" role="alert" className="mt-3 text-sm font-semibold text-[#9a3153]">{error}</p>}
      <p className="mt-4 text-xs leading-6 text-muted">Esta etapa é uma prévia. Seus textos ainda não serão salvos.</p>
      <button type="submit" className="continue-button mt-4 flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white">Continuar<ArrowRight size={18} aria-hidden="true" /></button>
    </form>
  );
}
