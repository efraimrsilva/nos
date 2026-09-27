"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { acceptInvitation, inspectInvitation, type InvitationState } from "@/features/invitations/actions";
import { routes } from "@/shared/routes";

const emptyState: InvitationState = { error: "", code: "", preview: null };

export function InvitationEntry({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [enteredCode, setEnteredCode] = useState("");
  const [inspection, inspectAction, inspecting] = useActionState(inspectInvitation, emptyState);
  const [acceptance, acceptAction, accepting] = useActionState(acceptInvitation, emptyState);
  // O aceite só pode usar a prévia associada ao código que ainda está no campo.
  const previewMatchesInput = inspection.preview && enteredCode.trim().toLowerCase() === inspection.code;

  return <>
    <form action={inspectAction} noValidate className="mt-7 rounded-[22px] border border-line bg-white p-5 sm:p-7">
      <label htmlFor="invitation-code" className="block text-xs font-bold text-muted">Código de convite</label>
      <input id="invitation-code" name="code" type="text" autoComplete="off" spellCheck={false} maxLength={32} value={enteredCode} onChange={event => setEnteredCode(event.target.value)} className="mt-2 w-full rounded-[14px] border border-line px-4 py-3.5 font-mono text-sm tracking-wide uppercase" placeholder="Cole o código recebido" />
      {inspection.error && <p role="alert" className="mt-3 text-sm font-semibold text-[#9a3153]">{inspection.error}</p>}
      <button type="submit" disabled={inspecting} className="continue-button mt-5 min-h-12 w-full rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{inspecting ? "Conferindo…" : "Conferir convite"}</button>
    </form>
    {previewMatchesInput && inspection.preview && <section className="mt-5 rounded-[22px] border border-line bg-white p-5 sm:p-7" aria-label="Prévia do convite">
      <p className="step-label text-lilac">Confira antes de aceitar</p>
      <h2 className="mt-2 font-display text-2xl">{inspection.preview.name}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">Propósito: {inspection.preview.purpose}</p>
      <p className="mt-4 text-xs leading-6 text-muted">Ao aceitar, você fará parte deste Núcleo e poderá ver as informações compartilhadas nele. A decisão é sua.</p>
      <form action={acceptAction} className="mt-5">
        <input type="hidden" name="code" value={inspection.code} />
        {acceptance.error && <p role="alert" className="mb-3 text-sm font-semibold text-[#9a3153]">{acceptance.error}</p>}
        <button type="submit" disabled={accepting} className="continue-button min-h-12 w-full rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{accepting ? "Aceitando…" : "Aceitar convite"}</button>
      </form>
    </section>}
    {!isAuthenticated && <p className="mt-5 text-xs leading-6 text-muted">Você precisa de uma conta para conferir e aceitar um convite. <Link href={routes.account} className="font-semibold text-leaf underline">Criar conta ou entrar</Link>.</p>}
  </>;
}
