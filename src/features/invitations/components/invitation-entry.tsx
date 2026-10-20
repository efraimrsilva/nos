"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { acceptInvitation, inspectInvitation, type InvitationState } from "@/features/invitations/actions";
import { routes } from "@/shared/routes";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import "./participation-layout.css";

const emptyState: InvitationState = { error: "", code: "", preview: null };

export function InvitationEntry({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [enteredCode, setEnteredCode] = useState("");
  const [inspection, inspectAction, inspecting] = useActionState(inspectInvitation, emptyState);
  const [acceptance, acceptAction, accepting] = useActionState(acceptInvitation, emptyState);
  // O aceite só pode usar a prévia associada ao código que ainda está no campo.
  const previewMatchesInput = inspection.preview && enteredCode.trim().toLowerCase() === inspection.code;

  return <div className="invitation-entry">
    <section className="ui-panel invitation-entry-card" aria-label="Conferir um convite">
      <p className="ui-copy">Recebeu um convite? Confira o contexto do Núcleo antes de decidir.</p>
      <form action={inspectAction} noValidate aria-busy={inspecting}>
        <label className="ui-field" htmlFor="invitation-code">Código de convite<input id="invitation-code" name="code" type="text" autoComplete="off" spellCheck={false} maxLength={32} value={enteredCode} onChange={event => setEnteredCode(event.target.value)} className="invitation-entry-code" placeholder="Cole o código recebido" /></label>
        {inspection.error && <p role="alert" className="ui-status">{inspection.error}</p>}
        <button type="submit" disabled={inspecting} className="ui-button"><KeyRound size={17} aria-hidden="true" />{inspecting ? "Conferindo…" : "Conferir convite"}</button>
      </form>
    </section>
    {previewMatchesInput && inspection.preview && <section className="ui-panel invitation-entry-card" aria-label="Prévia do convite">
      <p className="ui-kicker">Confira antes de aceitar</p><h2>{inspection.preview.name}</h2>
      <span className="ui-badge">{findNucleusType(inspection.preview.type)?.label ?? "Núcleo"}</span>
      <p className="invitation-preview-purpose">Propósito: {inspection.preview.purpose}</p>
      <p className="ui-copy">Ao aceitar, você fará parte deste Núcleo e poderá ver as informações compartilhadas nele. A decisão é sua.</p>
      <form action={acceptAction} aria-busy={accepting}>
        <input type="hidden" name="code" value={inspection.code} />
        {/* Um erro pertence ao código enviado; editar o campo não deve mostrar falhas de outro convite. */}
        {acceptance.error && acceptance.code === inspection.code && <p role="alert" className="ui-status">{acceptance.error}</p>}
        <div className="invitation-entry-actions"><button type="submit" disabled={accepting} className="ui-button"><ShieldCheck size={18} aria-hidden="true" />{accepting ? "Aceitando…" : "Aceitar convite"}<ArrowRight size={16} aria-hidden="true" /></button><Link href={routes.nucleus} className="ui-button-secondary">Agora não</Link></div>
      </form>
    </section>}
    <Link href={routes.nucleus} className="invitation-entry-back"><ArrowLeft size={17} aria-hidden="true" />Voltar a Seus Núcleos</Link>
    {!isAuthenticated && <p className="invitation-signin-note">Você precisa de uma conta para conferir e aceitar um convite. <Link href={`${routes.account}?next=%2Fcomecar%2Fconvite`}>Criar conta ou entrar</Link>.</p>}
  </div>;
}
