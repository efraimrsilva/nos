import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireControlsSession } from "@/features/controls/access";
import { manageNucleus } from "@/features/controls/actions";
import { ControlActionForm } from "@/features/controls/components/action-form";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { uuid } from "@/features/agreements/habit-access";

export const metadata: Metadata = { title: "Pessoas e administração" };
type Member = { user_id: string; display_name: string; role: string; nomination_pending: boolean };
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
  return <ControlsShell title="Pessoas e administração" subtitle={nucleus.name} back={`/nucleos/${id}`}>
    {query.resultado === "salvo" && <p role="status" className="text-leaf">Alteração concluída.</p>}
    {isAdmin && <ControlSection title="Convites"><p>Convide novas pessoas ou revogue códigos para impedir novos aceites.</p><nav className="flex flex-wrap gap-4 font-semibold text-leaf"><Link href={`/comecar/convite-inicial/${id}`} className="inline-flex min-h-11 items-center underline">Convidar alguém</Link><Link href={`/nucleos/${id}/convites`} className="inline-flex min-h-11 items-center underline">Gerenciar convites</Link></nav></ControlSection>}
    <ControlSection title="Participantes"><p>Administradores têm os mesmos poderes. Cada nomeação comum depende do aceite da pessoa. Administrar não dá acesso a conteúdos pessoais privados.</p>
      <ol className="mt-4 grid gap-4">{members.map(member => <li key={member.user_id} className="rounded-xl border border-line p-4">
        <p className="break-words font-semibold text-ink">{member.display_name || "Participante"}{member.user_id === user.id ? " · você" : ""}</p>
        <p>{member.role === "admin" ? "Administrador" : "Participante"}{member.nomination_pending ? " · nomeação aguardando aceite" : ""}</p>
        {member.user_id === user.id && member.nomination_pending && <>
          <ControlActionForm action={manageNucleus.bind(null, id, "accept", null)} label="Aceitar administração" confirmation="Desejo assumir a administração deste Núcleo." />
          <ControlActionForm action={manageNucleus.bind(null, id, "decline", null)} label="Recusar nomeação" confirmation="Desejo recusar esta nomeação." />
        </>}
        {isAdmin && member.user_id === user.id && members.some(other => other.user_id !== user.id && other.role === "admin") && <ControlActionForm action={manageNucleus.bind(null, id, "demote", member.user_id)} label="Deixar a administração" confirmation="Continuarei participante, e os outros administradores permanecerão na gestão." />}
        {isAdmin && member.user_id !== user.id && <>
          {member.role !== "admin" && !member.nomination_pending && <ControlActionForm action={manageNucleus.bind(null, id, "nominate", member.user_id)} label="Convidar para administrar" confirmation="Enviar nomeação; a pessoa precisará aceitar." />}
          {member.role === "admin" && <ControlActionForm action={manageNucleus.bind(null, id, "demote", member.user_id)} label="Retirar administração" confirmation="A pessoa permanecerá participante, sem poderes de administração." />}
          <ControlActionForm action={manageNucleus.bind(null, id, "remove", member.user_id)} label="Remover participante" confirmation="A pessoa perderá acesso. O histórico compartilhado permanecerá." />
        </>}
      </li>)}</ol>
    </ControlSection>
    {isAdmin && <ControlSection title="Nome e propósito"><ControlActionForm action={manageNucleus.bind(null, id, "details", null)} label="Salvar Núcleo" confirmation="Confirmo a alteração do nome e propósito compartilhados.">
      <label className="grid gap-1">Nome<input name="name" required maxLength={80} defaultValue={nucleus.name} className="min-h-11 rounded-xl border border-line px-3" /></label>
      <label className="grid gap-1">Propósito<textarea name="purpose" required maxLength={500} defaultValue={nucleus.purpose} rows={3} className="rounded-xl border border-line p-3" /></label>
    </ControlActionForm></ControlSection>}
    <ControlSection title="Quando alguém sai"><p>A saída não cancela acordos. Se o último administrador sair, uma pessoa restante será sorteada para administrar. Se não houver participantes restantes, o Núcleo será encerrado e seus convites revogados.</p></ControlSection>
    <Link href={`/nucleos/${id}/sair`} className="inline-flex min-h-11 items-center font-semibold text-leaf underline">Sair deste Núcleo</Link>
    {isAdmin && <ControlSection title="Encerrar Núcleo para todos">
      <p>Todos perderão acesso a este Núcleo, inclusive os administradores. Os convites serão revogados. Acordos, momentos e agenda permanecerão armazenados, sem acesso pelos antigos participantes. As contas das pessoas não serão apagadas.</p>
      <p>Não há opção de reabrir o Núcleo pelo aplicativo. Se deseja apenas deixar de participar, use “Sair deste Núcleo”.</p>
      <details className="mt-3 rounded-xl border border-red-200 p-4">
        <summary className="min-h-11 cursor-pointer font-semibold text-red-800">Quero encerrar este Núcleo</summary>
        <ControlActionForm action={manageNucleus.bind(null, id, "close", null)} label="Encerrar Núcleo" pendingLabel="Encerrando..." danger confirmation="Entendi que todos perderão acesso, os convites serão revogados e o histórico permanecerá armazenado.">
          <label className="grid gap-1">Digite o nome do Núcleo para confirmar: {nucleus.name}
            <input name="confirmationName" required maxLength={80} autoComplete="off" className="min-h-11 rounded-xl border border-line px-3" />
          </label>
        </ControlActionForm>
        <p className="mt-3 text-sm">Para cancelar, feche esta confirmação ou volte ao Início. Nada é alterado antes de confirmar o encerramento.</p>
      </details>
    </ControlSection>}
  </ControlsShell>;
}
