"use client";

import { useActionState, useState } from "react";
import { generateInvitation, type InvitationState } from "@/features/invitations/actions";

export function InitialInvitation({ nucleusId, initialCode }: { nucleusId: string; initialCode: string }) {
  const [state, action, pending] = useActionState(generateInvitation, { error: "", code: initialCode, preview: null } satisfies InvitationState);
  const [feedback, setFeedback] = useState("");

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: "Convite para o Nós", text: `Meu convite para o Núcleo: ${state.code}` });
      else { await navigator.clipboard.writeText(state.code); setFeedback("Código copiado para compartilhar."); }
    } catch { setFeedback("Não foi possível compartilhar neste dispositivo."); }
  }

  return <section className="mt-7 rounded-[22px] border border-line bg-white p-5 sm:p-7">
    <p className="text-sm leading-7 text-muted">Quem tiver o código poderá conferir o Núcleo e entrar após aceitar o convite. O convite expira em sete dias e o aceite é sempre explícito.</p>
    {state.code ? <>
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-muted">Código de convite</p>
      <p className="mt-2 break-all rounded-xl bg-[#eff3e6] p-4 font-mono text-sm font-semibold tracking-wider">{state.code}</p>
      <button type="button" onClick={share} className="mt-4 min-h-11 rounded-xl border border-line px-5 text-sm font-semibold transition-colors hover:bg-canvas">Compartilhar código</button>
      {feedback && <p role="status" className="mt-2 text-sm text-muted">{feedback}</p>}
    </> : <form action={action} className="mt-6">
      <input type="hidden" name="nucleus_id" value={nucleusId} />
      {state.error && <p role="alert" className="mb-3 text-sm font-semibold text-[#9a3153]">{state.error}</p>}
      <button type="submit" disabled={pending} className="continue-button min-h-12 w-full rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Gerando…" : "Gerar convite"}</button>
    </form>}
  </section>;
}
