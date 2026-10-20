"use client";

import { useState } from "react";
import { ArrowRight, Clock3, Mail, ShieldCheck } from "lucide-react";
import { RevokeInvitation } from "./revoke-invitation";
import "./participation-layout.css";

export type InvitationSummary = { id: string; created_at: string; expires_at: string; revoked_at: string | null };
const date = (value: string) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" }).format(new Date(value));

export function InvitationWorkspace({ nucleusId, invitations, status }: { nucleusId: string; invitations: InvitationSummary[]; status: "ativos" | "expirados" | "revogados" }) {
  const [selection, setSelection] = useState(invitations[0]?.id);
  const selected = invitations.find(invitation => invitation.id === selection) ?? invitations[0];
  const label = status === "ativos" ? "Ativo" : status === "expirados" ? "Expirado" : "Revogado";
  return <div className="invitation-workspace">
    <section className="ui-panel invitation-list" aria-label="Convites do Núcleo">
      <div className="ui-panel-heading"><h2>Convites {status}</h2><span className="ui-badge">{invitations.length} nesta página</span></div>
      {invitations.length ? invitations.map((invitation, index) => <button type="button" key={invitation.id} className={`invitation-list-item ${selected?.id === invitation.id ? "is-selected" : ""}`} aria-pressed={selected?.id === invitation.id} onClick={() => setSelection(invitation.id)}>
        <span className={`invitation-list-icon invitation-tone-${status}`}><Mail size={22} aria-hidden="true" /></span><span><strong>Convite {String(index + 1).padStart(2, "0")}</strong><small>Criado em {date(invitation.created_at)} UTC</small></span><span className={`ui-badge invitation-tone-${status}`}>{label}</span><ArrowRight size={16} aria-hidden="true" />
      </button>) : <div className="ui-empty"><Mail size={31} aria-hidden="true" /><p>Nenhum convite {label.toLowerCase()} nesta página.</p><p>Um novo convite pode ser preparado quando fizer sentido para o Núcleo.</p></div>}
    </section>
    <aside className="invitation-sidebar">
      <section className="ui-panel invitation-detail" aria-labelledby="invitation-detail-heading"><div className="ui-panel-heading"><h2 id="invitation-detail-heading">{selected ? "Sobre este convite" : "Um convite com cuidado"}</h2><Mail size={19} aria-hidden="true" /></div>
        {selected ? <><span className={`ui-badge invitation-tone-${status}`}>{label}</span><dl><dt>Criado em</dt><dd>{date(selected.created_at)} UTC</dd><dt>{selected.revoked_at ? "Revogado em" : "Validade até"}</dt><dd>{date(selected.revoked_at ?? selected.expires_at)} UTC</dd></dl><p>O código fica disponível no momento em que é gerado. A lista preserva os dados de validade e revogação.</p>{status === "ativos" && <RevokeInvitation nucleusId={nucleusId} invitationId={selected.id} key={selected.id} />}</> : <p>Administradores preparam convites. A outra pessoa confere o contexto e escolhe se deseja entrar.</p>}
      </section>
      <section className="invitation-privacy"><ShieldCheck size={24} aria-hidden="true" /><h2>Uma escolha livre</h2><p>Revogar um convite impede novos aceites. Quem já faz parte do Núcleo continua participando.</p><p><Clock3 size={15} aria-hidden="true" />Os horários aparecem em UTC (Tempo Universal Coordenado).</p></section>
    </aside>
  </div>;
}
