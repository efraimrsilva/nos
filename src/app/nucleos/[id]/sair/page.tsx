import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { uuid } from "@/features/agreements/habit-access";

export const metadata: Metadata = { title: "Sair de um Núcleo" };
export default async function LeaveNucleusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuid.test(id)) notFound();
  const { supabase, user } = await requireControlsSession(`/nucleos/${id}/sair`);
  // Não basta conhecer o ID: conferir vínculo próprio antes de revelar contexto de saída.
  const { data: member, error } = await supabase.from("nucleus_members").select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (error) throw new Error("Não foi possível consultar sua participação.");
  if (!member) notFound();
  return <ControlsShell title="Sair de um Núcleo" subtitle="Uma escolha com consequências claras." back={`/nucleos/${id}`}>
    <ControlSection title="Saída do Núcleo" planned><p>A remoção da participação ainda não está disponível. Consultar esta página ou voltar não altera seu vínculo.</p></ControlSection>
    <ControlSection title="Combinados e registros"><p>Retirar um participante original pode bloquear a confirmação de Hábitos; não reduz automaticamente o conjunto original de votos. É necessário definir o destino das decisões pendentes e a retenção do histórico compartilhado antes de oferecer a saída.</p></ControlSection>
    {member.role === "creator" && <ControlSection title="Você é o criador deste Núcleo" planned><p>A transferência do papel de criador precisa de aceite e regras próprias antes de permitir sua saída. Ainda não há ação para transferir esse papel.</p></ControlSection>}
    <ControlSection title="Sair da conta é outra ação"><p>Você pode sair da conta em Conta e segurança. Isso encerra o acesso à sessão e conserva sua participação neste espaço.</p></ControlSection>
  </ControlsShell>;
}
