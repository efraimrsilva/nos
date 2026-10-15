import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireControlsSession } from "@/features/controls/access";
import { manageNucleus } from "@/features/controls/actions";
import { ControlActionForm } from "@/features/controls/components/action-form";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { uuid } from "@/features/agreements/habit-access";
export const metadata: Metadata = { title: "Sair de um Núcleo" };
export default async function LeaveNucleusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuid.test(id)) notFound();
  const { supabase, user } = await requireControlsSession(`/nucleos/${id}/sair`);
  const { data: member, error } = await supabase.from("nucleus_members").select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (error) throw new Error("Não foi possível consultar sua participação.");
  if (!member) notFound();
  const { data: hidden, error: preferenceError } = await supabase.rpc("get_my_privacy_preference");
  if (preferenceError) throw new Error("Não foi possível consultar sua preferência.");
  return <ControlsShell title="Sair de um Núcleo" subtitle="Você pode sair a qualquer momento." back={`/nucleos/${id}`}>
    <ControlSection title="Antes de sair"><p>Você perderá acesso ao Núcleo. O histórico compartilhado de conversas e interações permanecerá para as pessoas que continuarem, incluindo os momentos, o humor e as notas já registrados. A saída não cancela acordos.</p><p className="mt-2">O aplicativo ainda não oferece uma conversa livre; quando essa função existir, o aviso também abrangerá esse histórico.</p></ControlSection>
    <ControlSection title="Autoria dos registros"><p>{hidden ? "Sua preferência está ativada: a autoria de suas interações será ocultada após esta saída; o conteúdo permanecerá." : "Sua preferência está desativada: a autoria dos registros será preservada."} O texto ainda pode identificar você.</p><Link href="/configuracoes/privacidade" className="inline-flex min-h-11 items-center font-semibold text-leaf underline">Conferir minha preferência</Link></ControlSection>
    {member.role === "admin" && <ControlSection title="Você administra este Núcleo"><p>Outro administrador continuará administrando. Se você for o último administrador, uma pessoa restante será sorteada automaticamente. Se ninguém permanecer, o Núcleo será encerrado e os convites revogados.</p></ControlSection>}
    <ControlSection title="Confirmar saída"><ControlActionForm action={manageNucleus.bind(null, id, "leave", null)} label="Sair deste Núcleo" confirmation="Entendi que perderei acesso e que o histórico compartilhado permanecerá." /></ControlSection>
  </ControlsShell>;
}
