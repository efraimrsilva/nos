"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LogOut, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { manageNucleus, type ManagementOperation, type ControlActionState } from "@/features/controls/actions";
import { ControlActionForm } from "@/features/controls/components/action-form";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import "@/features/invitations/components/participation-layout.css";
export type NucleusMember = { user_id: string; display_name: string; role: string; nomination_pending: boolean };
const initials = (name: string) => name?.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join("").toLocaleUpperCase("pt-BR");
// A lista completa mantém as permissões; cada ação revalida o vínculo no servidor e no banco.
export function NucleusMembers({ id, members, userId, isAdmin }: { id: string; members: NucleusMember[]; userId: string; isAdmin: boolean }) {
  const [feedback, setFeedback] = useState("");
  // O retorno permanece mesmo quando a ação remove seu próprio formulário da lista atualizada.
  const act = (operation: ManagementOperation, target: string | null) => async (previous: ControlActionState, form: FormData) => {
    const result = await manageNucleus(id, operation, target, previous, form);
    setFeedback(result.success ?? "");
    return result;
  };
  return <section className="people-cards" aria-label="Participantes">
    {feedback && <p role="status" className="ui-feedback">{feedback}</p>}
        {members.map((member, index) => <article key={member.user_id} className="person-card">
          <div aria-hidden="true" className={`person-portrait person-tone-${index % 3}`}>{initials(member.display_name) || <UserRound size={32} />}</div>
          <h2>{member.display_name || "Participante"}</h2>
          {member.user_id === userId && <span className="person-self">Você</span>}
          <span className={`ui-badge ${member.role !== "admin" ? "person-role-participant" : ""}`}>{member.role === "admin" ? <ShieldCheck size={13} aria-hidden="true" /> : <UsersRound size={13} aria-hidden="true" />}{member.role === "admin" ? "Administrador" : "Participante"}</span>
          <p>{member.nomination_pending ? "Nomeação para administrar aguardando aceite." : member.role === "admin" ? "Cuida dos convites e da organização do Núcleo." : "Decide sobre sua própria participação."}</p>
          <ActionDialog trigger={<>Ver participação <ArrowRight size={15} aria-hidden="true" /></>} title={`Participação de ${member.display_name || "participante"}`}>
            {feedback && <p role="status" className="ui-feedback">{feedback}</p>}
            <p className="ui-copy">Administradores têm os mesmos poderes. Cada nomeação depende do aceite da pessoa. Administrar não dá acesso a conteúdos pessoais privados.</p>
            {/* As permissões visuais refletem a participação atual; cada ação revalida o acesso no servidor. */}
            {member.user_id === userId && member.nomination_pending && <>
              <ControlActionForm action={act("accept", null)} label="Aceitar administração" confirmation="Desejo assumir a administração deste Núcleo." />
              <ControlActionForm action={act("decline", null)} label="Recusar nomeação" confirmation="Desejo recusar esta nomeação." />
            </>}
            {isAdmin && member.user_id === userId && members.some(other => other.user_id !== userId && other.role === "admin") && <ControlActionForm action={act("demote", member.user_id)} label="Deixar a administração" confirmation="Continuarei participante, e os outros administradores permanecerão na gestão." />}
            {isAdmin && member.user_id !== userId && <>
              {member.role !== "admin" && !member.nomination_pending && <ControlActionForm action={act("nominate", member.user_id)} label="Convidar para administrar" confirmation="Enviar nomeação; a pessoa precisará aceitar." />}
              {member.role === "admin" && <ControlActionForm action={act("demote", member.user_id)} label="Retirar administração" confirmation="A pessoa permanecerá participante, sem poderes de administração." />}
              <ControlActionForm action={act("remove", member.user_id)} label="Remover participante" danger confirmation="A pessoa perderá acesso. O histórico compartilhado permanecerá." />
            </>}
            {member.user_id === userId && <Link href={`/nucleos/${id}/sair`} className="people-dialog-leave"><LogOut size={17} aria-hidden="true" />Sair deste Núcleo</Link>}
          </ActionDialog>
        </article>)}
        {members.length === 0 && <div className="ui-empty"><UsersRound size={30} aria-hidden="true" /><p>Não foi possível encontrar participantes para exibir.</p></div>}
</section>;
}
