"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, Copy, KeyRound, Share2 } from "lucide-react";
import { generateInvitation, type InvitationState } from "@/features/invitations/actions";
import "./participation-layout.css";

export function InitialInvitation({ nucleusId, initialCode, expiresAt, showManagementLink = true }: { nucleusId: string; initialCode: string; expiresAt?: string; showManagementLink?: boolean }) {
  const [state, action, pending] = useActionState(generateInvitation, { error: "", code: initialCode, preview: null } satisfies InvitationState);
  const [feedback, setFeedback] = useState("");

  async function copy() {
    try { await navigator.clipboard.writeText(state.code); setFeedback("Código copiado para compartilhar."); }
    catch { setFeedback("Não foi possível copiar. Selecione o código e copie manualmente."); }
  }

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: "Convite para o Nós", text: `Meu convite para o Núcleo: ${state.code}` });
      else { await navigator.clipboard.writeText(state.code); setFeedback("Código copiado para compartilhar."); }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") setFeedback("Compartilhamento cancelado.");
      else setFeedback("Não foi possível compartilhar neste dispositivo. Você pode copiar o código.");
    }
  }

  return <section className="invitation-generator" aria-label="Preparar convite">
    <p className="ui-copy">Quem tiver o código poderá conferir o Núcleo e entrar após aceitar o convite. O convite expira em sete dias e o aceite é sempre explícito.</p>
    {state.code ? <>
      <p className="invitation-code-label"><KeyRound size={17} aria-hidden="true" />Código de convite</p>
      <p className="invitation-code">{state.code}</p>
      {expiresAt && state.code === initialCode && <p className="invitation-small">Expira em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" }).format(new Date(expiresAt))} UTC.</p>}
      <div className="invitation-share-actions"><button type="button" onClick={share} className="ui-button"><Share2 size={17} aria-hidden="true" />Compartilhar código</button><button type="button" onClick={copy} className="ui-button-secondary"><Copy size={17} aria-hidden="true" />Copiar código</button></div>
      {feedback && <p role="status" className="invitation-feedback"><Check size={16} aria-hidden="true" />{feedback}</p>}
    </> : <form action={action} className="invitation-generation-form" aria-busy={pending}>
      <input type="hidden" name="nucleus_id" value={nucleusId} />
      {state.error && <p role="alert" className="ui-status">{state.error}</p>}
      <button type="submit" disabled={pending} className="ui-button"><KeyRound size={17} aria-hidden="true" />{pending ? "Gerando…" : "Gerar convite"}</button>
    </form>}
    {showManagementLink && <Link href={`/nucleos/${nucleusId}/convites`} className="invitation-management-link">Gerenciar convites</Link>}
    <p className="invitation-small">Esboço de funcionalidade · ainda não desenvolvido: QR (código de resposta rápida) e convites por link. Por enquanto, compartilhe o código para a outra pessoa conferir e aceitar na própria conta.</p>
  </section>;
}
