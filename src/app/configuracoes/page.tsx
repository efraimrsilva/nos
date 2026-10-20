import type { Metadata } from "next";
import Link from "next/link";
import { Bell, BookOpen, Heart, LockKeyhole, LogOut, MessageSquare, ShieldCheck } from "lucide-react";
import { requireControlsSession } from "@/features/controls/access";
import { ControlsShell } from "@/features/controls/components/controls-shell";
import { AccountRow } from "@/features/controls/components/account-row";
import { HelpContent, PrivacyContent, SecurityContent } from "@/features/controls/components/settings-content";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const { supabase } = await requireControlsSession(routes.settings);
  const { data: hidden, error } = await supabase.rpc("get_my_privacy_preference");
  if (error) throw new Error("Não foi possível consultar sua preferência.");

  return <ControlsShell title="Privacidade com clareza." subtitle="Preferências, segurança e ajuda sem caminhos escondidos." back={routes.nucleus} showBack={false}>
    <div className="settings-grid">
      <section className="ui-panel settings-panel"><h2>Privacidade</h2>
        <ActionDialog variant="text" className="account-dialog-trigger" title="Privacidade e visibilidade" description="Escolhas claras sobre seu histórico compartilhado." size="wide" trigger={<AccountRow icon={LockKeyhole} title="Visibilidade das próximas saídas" description="Uma escolha para as próximas ações" />}><PrivacyContent hidden={Boolean(hidden)} /></ActionDialog>
        <ActionDialog variant="text" className="account-dialog-trigger" title="Dados e autonomia" description="Orientações e limites do produto." size="wide" trigger={<AccountRow icon={BookOpen} title="Dados e autonomia" description="Orientações e limites do produto" />}><HelpContent /></ActionDialog>
      </section>
      <section className="ui-panel settings-panel"><h2>Notificações · planejado</h2><span className="ui-badge">Esboço de funcionalidade · ainda não desenvolvido</span>
        <ActionDialog variant="text" className="account-dialog-trigger" title="Presença também precisa de silêncio" trigger={<AccountRow icon={Bell} title="Presença também precisa de silêncio" description="Preferências de comunicação futuras" />}><div className="settings-copy"><p className="ui-badge mb-4">Esboço de funcionalidade · ainda não desenvolvido</p><p>Canais de aviso e horários de silêncio ainda não estão disponíveis. Este esboço apresenta a próxima área de preferências; nenhuma configuração de notificação é alterada aqui.</p></div></ActionDialog>
      </section>
      <section className="ui-panel settings-panel"><h2>Ajuda e suporte</h2>
        <ActionDialog variant="text" className="account-dialog-trigger" title="Ajuda e suporte" description="Orientação e contato com a responsável pelo aplicativo." size="wide" trigger={<AccountRow icon={MessageSquare} title="Preciso de orientação" description="Responsável e canal de contato" />}><HelpContent /></ActionDialog>
        <Link href={routes.help}><AccountRow icon={Heart} title="Entender os combinados" description="Participação, termos e administração" /></Link>
      </section>
      <section className="ui-panel settings-panel"><h2>Conta e Núcleos</h2>
        <ActionDialog variant="text" className="account-dialog-trigger" title="Conta e segurança" description="Cuide também do seu acesso." size="wide" trigger={<AccountRow icon={ShieldCheck} title="Conta e segurança" description="Senha, recuperação e acesso" />}><SecurityContent /></ActionDialog>
        <ActionDialog variant="text" className="account-dialog-trigger" title="Sair de um Núcleo" description="Confira as consequências antes de decidir." trigger={<AccountRow icon={LogOut} title="Sair de um Núcleo" description="Escolher o vínculo e conferir a saída" />}><div className="settings-copy"><p>Abra o Núcleo do qual deseja sair e selecione a opção de saída. Você poderá conferir sua preferência de autoria e as consequências antes de confirmar.</p><p className="mt-3">O histórico compartilhado permanece para as pessoas que continuarem. Sair de um Núcleo não exclui sua conta.</p><Link href={routes.nucleus} className="ui-button mt-5">Escolher um Núcleo</Link></div></ActionDialog>
      </section>
    </div>
  </ControlsShell>;
}
