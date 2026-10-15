import type { Metadata } from "next";
import Link from "next/link";
import { requireControlsSession } from "@/features/controls/access";
import { savePrivacyPreference } from "@/features/controls/actions";
import { ControlActionForm } from "@/features/controls/components/action-form";
import { ControlsShell, ControlSection } from "@/features/controls/components/controls-shell";
import { routes } from "@/shared/routes";
export const metadata: Metadata = { title: "Privacidade e visibilidade" };
export default async function PrivacyPage() {
  const { supabase } = await requireControlsSession(routes.privacy);
  const { data: hidden, error } = await supabase.rpc("get_my_privacy_preference");
  if (error) throw new Error("Não foi possível consultar sua preferência.");
  return <ControlsShell title="Privacidade e visibilidade" subtitle="Escolhas claras sobre seu histórico compartilhado." back={routes.settings}>
    <ControlSection title="Núcleos privados"><p>Somente pessoas associadas consultam o espaço. Administradores gerenciam pessoas e convites; esse papel não permite consultar conteúdos pessoais privados.</p></ControlSection>
    <ControlSection title="O que é compartilhado"><p>Nome e propósito do Núcleo, termos dos acordos, momentos do Hábito com humor e nota, histórico de alterações e agenda ficam disponíveis às pessoas associadas. Cada pessoa aceita sua própria participação; silêncio não é aceite.</p></ControlSection>
    <ControlSection title="Ocultar autoria depois de sair"><p>Esta preferência vale para suas próximas saídas de qualquer Núcleo. Ela preserva o conteúdo e oculta a identificação da autoria; não apaga notas nem altera saídas anteriores. Uma autoria já ocultada não será revelada ao desativar a preferência. O próprio texto ainda pode identificar você.</p><ControlActionForm action={savePrivacyPreference} label="Salvar preferência"><label className="flex items-start gap-3"><input name="hideAuthorship" type="checkbox" defaultChecked={Boolean(hidden)} className="mt-1 h-5 w-5 shrink-0" /><span>Ocultar minha autoria nas interações após sair de um Núcleo</span></label></ControlActionForm></ControlSection>
    <ControlSection title="Seus dados"><p>Acesso, correção, exportação e exclusão são solicitados manualmente ao suporte. O atendimento verifica a titularidade e protege informações de outras pessoas. Sair de um Núcleo é diferente de excluir sua conta.</p><Link href={routes.help} className="inline-flex min-h-11 items-center font-semibold text-leaf underline">Consultar responsável e solicitar atendimento</Link></ControlSection>
    <ControlSection title="Próximas opções" planned><p>Perfil afetivo, rascunhos, conversas livres, mídia e seleção de leitores terão controles próprios. Essas funções ainda não estão disponíveis.</p></ControlSection>
  </ControlsShell>;
}
