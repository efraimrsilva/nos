import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Leaf, LogOut, Plus, Settings2, ShieldCheck, Trash2, UserRound, UsersRound } from "lucide-react";
import { requireControlsSession } from "@/features/controls/access";
import { manageNucleus } from "@/features/controls/actions";
import { ControlActionForm } from "@/features/controls/components/action-form";
import { InitialInvitation } from "@/features/invitations/components/initial-invitation";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { uuid } from "@/features/agreements/habit-access";
import "@/features/invitations/components/participation-layout.css";

export const metadata: Metadata = { title: "Pessoas e administração" };
type Member = { user_id: string; display_name: string; role: string; nomination_pending: boolean };
const initials = (name: string) => name?.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join("").toLocaleUpperCase("pt-BR");

export default async function PeoplePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ resultado?: string }> }) {
  const { id } = await params;
  if (!uuid.test(id)) notFound();
  const { supabase, user } = await requireControlsSession(`/nucleos/${id}/pessoas`);
  const { data: membership, error: memberError } = await supabase.from("nucleus_members").select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (memberError) throw new Error("Não foi possível consultar sua participação.");
  if (!membership) notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei").select("name,purpose").eq("id", id).single();
  const { data: management, error: managementError } = await supabase.rpc("get_nucleus_management", { target_nucleus: id });
  if (nucleusError || managementError) throw new Error("Não foi possível consultar a administração.");
  const members = (management?.members ?? []) as Member[];
  const isAdmin = membership.role === "admin";
  const query = await searchParams;

  const invitation = <InitialInvitation nucleusId={id} initialCode="" showManagementLink={false} />;
  const editPurpose = <ControlActionForm action={manageNucleus.bind(null, id, "details", null)} label="Salvar Núcleo" confirmation="Confirmo a alteração do nome e propósito compartilhados.">
    <label className="ui-field">Nome<input name="name" required maxLength={80} defaultValue={nucleus.name} /></label>
    <label className="ui-field">Propósito<textarea name="purpose" required maxLength={500} defaultValue={nucleus.purpose} rows={3} /></label>
  </ControlActionForm>;

  return <OnboardingShell nucleusName={nucleus.name}>
    <header className="ui-page-header"><div><p className="ui-kicker">Pessoas e participação</p><h1 className="ui-title">Cada pessoa tem seu lugar.</h1><p className="ui-copy">Administração compartilhada. Autonomia individual.</p></div>
      {isAdmin && <ActionDialog trigger={<><Plus size={18} aria-hidden="true" />Convidar alguém</>} title="Convidar alguém" variant="primary" description="Um convite claro, com espaço para escolher.">{invitation}</ActionDialog>}
    </header>
    {query.resultado === "salvo" && <p role="status" className="ui-status">Alteração concluída.</p>}
    <div className="people-workspace">
      <section className="people-cards" aria-label="Participantes">
        {members.map((member, index) => <article key={member.user_id} className="person-card">
          <div aria-hidden="true" className={`person-portrait person-tone-${index % 3}`}>{initials(member.display_name) || <UserRound size={32} />}</div>
          <h2>{member.display_name || "Participante"}</h2>
          {member.user_id === user.id && <span className="person-self">Você</span>}
          <span className={`ui-badge ${member.role !== "admin" ? "person-role-participant" : ""}`}>{member.role === "admin" ? <ShieldCheck size={13} aria-hidden="true" /> : <UsersRound size={13} aria-hidden="true" />}{member.role === "admin" ? "Administrador" : "Participante"}</span>
          <p>{member.nomination_pending ? "Nomeação para administrar aguardando aceite." : member.role === "admin" ? "Cuida dos convites e da organização do Núcleo." : "Decide sobre sua própria participação."}</p>
          <ActionDialog trigger={<>Ver participação <ArrowRight size={15} aria-hidden="true" /></>} title={`Participação de ${member.display_name || "participante"}`}>
            <p className="ui-copy">Administradores têm os mesmos poderes. Cada nomeação depende do aceite da pessoa. Administrar não dá acesso a conteúdos pessoais privados.</p>
            {/* As permissões visuais refletem a participação atual; cada ação revalida o acesso no servidor. */}
            {member.user_id === user.id && member.nomination_pending && <>
              <ControlActionForm action={manageNucleus.bind(null, id, "accept", null)} label="Aceitar administração" confirmation="Desejo assumir a administração deste Núcleo." />
              <ControlActionForm action={manageNucleus.bind(null, id, "decline", null)} label="Recusar nomeação" confirmation="Desejo recusar esta nomeação." />
            </>}
            {isAdmin && member.user_id === user.id && members.some(other => other.user_id !== user.id && other.role === "admin") && <ControlActionForm action={manageNucleus.bind(null, id, "demote", member.user_id)} label="Deixar a administração" confirmation="Continuarei participante, e os outros administradores permanecerão na gestão." />}
            {isAdmin && member.user_id !== user.id && <>
              {member.role !== "admin" && !member.nomination_pending && <ControlActionForm action={manageNucleus.bind(null, id, "nominate", member.user_id)} label="Convidar para administrar" confirmation="Enviar nomeação; a pessoa precisará aceitar." />}
              {member.role === "admin" && <ControlActionForm action={manageNucleus.bind(null, id, "demote", member.user_id)} label="Retirar administração" confirmation="A pessoa permanecerá participante, sem poderes de administração." />}
              <ControlActionForm action={manageNucleus.bind(null, id, "remove", member.user_id)} label="Remover participante" danger confirmation="A pessoa perderá acesso. O histórico compartilhado permanecerá." />
            </>}
            {member.user_id === user.id && <Link href={`/nucleos/${id}/sair`} className="people-dialog-leave"><LogOut size={17} aria-hidden="true" />Sair deste Núcleo</Link>}
          </ActionDialog>
        </article>)}
        {members.length === 0 && <div className="ui-empty"><UsersRound size={30} aria-hidden="true" /><p>Não foi possível encontrar participantes para exibir.</p></div>}
        {isAdmin && <article className="ui-panel people-invite-card"><div className="ui-panel-heading"><h2>Um lugar à mesa</h2><ArrowRight size={17} aria-hidden="true" /></div><div className="people-invite-art" aria-hidden="true"><Plus size={35} /></div><p>Um convite claro, com espaço para escolher.</p><ActionDialog trigger={<>Preparar convite <ArrowRight size={16} aria-hidden="true" /></>} title="Preparar convite" variant="text">{invitation}</ActionDialog></article>}
      </section>
      <aside className="people-sidebar">
        <section className="people-purpose" aria-labelledby="people-purpose-heading"><Leaf className="people-purpose-icon" size={26} aria-hidden="true" /><p className="ui-kicker">Nosso propósito</p><h2 id="people-purpose-heading">{nucleus.purpose || "Um espaço para cultivar os nossos vínculos."}</h2><div className="people-avatar-line"><span>{members.slice(0, 4).map((member, index) => <span className={`ui-avatar person-tone-${index % 3}`} key={member.user_id} title={member.display_name}>{initials(member.display_name) || "·"}</span>)}</span><small>{members.length} {members.length === 1 ? "pessoa" : "pessoas"}</small></div></section>
        <section className="ui-panel people-administration" aria-labelledby="people-administration-heading"><div className="ui-panel-heading"><h2 id="people-administration-heading">{isAdmin ? "Administração" : "Seu lugar no Núcleo"}</h2><Settings2 size={19} aria-hidden="true" /></div>
          {isAdmin && <><Link className="ui-row" href={`/nucleos/${id}/convites`}><span className="people-row-icon"><UsersRound size={20} aria-hidden="true" /></span><span><strong>Convites do Núcleo</strong><small>Conferir e revogar</small></span><ArrowRight size={15} aria-hidden="true" /></Link>
          <ActionDialog trigger={<span className="ui-row"><span className="people-row-icon"><Leaf size={20} aria-hidden="true" /></span><span><strong>Nome e propósito</strong><small>Cuidar da identidade do espaço</small></span><ArrowRight size={15} aria-hidden="true" /></span>} title="Nome e propósito" variant="card">{editPurpose}</ActionDialog></>}
          <Link className="ui-row" href={`/nucleos/${id}/sair`}><span className="people-row-icon"><LogOut size={20} aria-hidden="true" /></span><span><strong>Sair do Núcleo</strong><small>Entender as consequências</small></span><ArrowRight size={15} aria-hidden="true" /></Link>
          <ActionDialog trigger={<>Quando alguém sai <ArrowRight size={14} aria-hidden="true" /></>} title="Quando alguém sai" variant="text"><p className="ui-copy">A saída não cancela acordos. Se o último administrador sair, uma pessoa restante será sorteada para administrar. Se não houver participantes restantes, o Núcleo será encerrado e seus convites revogados.</p></ActionDialog>
        </section>
        {isAdmin && <div className="people-close"><ActionDialog trigger={<><Trash2 size={16} aria-hidden="true" />Encerrar Núcleo para todos</>} title="Encerrar Núcleo para todos" variant="text" className="people-danger-trigger">
          <p className="ui-copy">Todos perderão acesso a este Núcleo, inclusive os administradores. Os convites serão revogados. Acordos, momentos e agenda permanecerão armazenados, sem acesso pelos antigos participantes. As contas das pessoas não serão apagadas.</p>
          <p className="people-close-note">Não há opção de reabrir o Núcleo pelo aplicativo. Se deseja apenas deixar de participar, use “Sair deste Núcleo”.</p>
          <ControlActionForm action={manageNucleus.bind(null, id, "close", null)} label="Encerrar Núcleo" pendingLabel="Encerrando..." danger confirmation="Entendi que todos perderão acesso, os convites serão revogados e o histórico permanecerá armazenado.">
            <label className="ui-field">Digite o nome do Núcleo para confirmar: {nucleus.name}<input name="confirmationName" required maxLength={80} autoComplete="off" /></label>
          </ControlActionForm><p className="people-close-note">Para cancelar, feche esta confirmação. Nada é alterado antes de confirmar o encerramento.</p>
        </ActionDialog></div>}
      </aside>
    </div>
  </OnboardingShell>;
}
