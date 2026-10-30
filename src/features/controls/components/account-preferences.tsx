import Link from "next/link";
import { Bell, BookOpen, Check, KeyRound, LockKeyhole, LogOut, MessageSquare, UsersRound } from "lucide-react";
import { AccountAccessDialog, type AccountAccessKind } from "@/features/auth/components/account-access-dialog";
import { signOut } from "@/features/auth/actions";
import { AppearanceOption } from "@/features/appearance/theme-picker";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { profileLetters } from "@/shared/profile-letters";
import { routes } from "@/shared/routes";
import { AccountRow } from "./account-row";
import { HelpContent, PrivacyContent } from "./settings-content";
import { DeleteAccountOption } from "./delete-account-option";
import { SignOutButton } from "./sign-out-button";
import { AccountDataDialog } from "./account-data-dialog";

export function AccountPreferences({ name, userId, email, emailConfirmed, next, initialAccess, privacyHidden, embedded = false }: {
  name: string; userId: string; email?: string; emailConfirmed: boolean; next: string;
  initialAccess?: AccountAccessKind; privacyHidden?: boolean; embedded?: boolean;
}) {
  const sectionId = (id: string) => embedded ? `profile-popover-${id}` : id;
  return <div className="settings-grid account-preferences-sections">
    <section id={sectionId("perfil")} className="ui-panel account-panel"><h2>Perfil</h2>
      <div className="account-profile"><span className="ui-avatar" aria-hidden="true">{profileLetters(name)}</span><h2>{name || "Sua conta"}</h2><p>Você está conectado como {email ?? "membro do Nós"}.</p></div>
      <AccountDataDialog key={userId} name={name} userId={userId} email={email} emailConfirmed={emailConfirmed} />
    </section>
    <section id={sectionId("entrar-e-recuperar")} className="ui-panel account-panel"><h2>Entrar e recuperar</h2>
      <AccountAccessDialog kind="recovery" next={next} accountEmail={email} defaultOpen={initialAccess === "recovery"} className="account-dialog-trigger" trigger={<AccountRow icon={KeyRound} title="Recuperar acesso" description="Link de recuperação e nova senha" />} />
      <AccountAccessDialog kind="confirmation" next={next} accountEmail={email} emailConfirmed={emailConfirmed} defaultOpen={initialAccess === "confirmation"} className="account-dialog-trigger" trigger={<AccountRow icon={Check} title="Confirmar e-mail" description={emailConfirmed ? "Seu e-mail já está confirmado" : "Conferir a etapa de confirmação"} />} />
      <ActionDialog variant="text" className="account-dialog-trigger" title="Sair da conta" description="Encerrar o acesso desta conta." trigger={<AccountRow icon={LogOut} title="Sair da conta" description="Encerrar acesso com segurança" />}><p className="settings-copy">Sair encerra a sessão e não remove sua participação em nenhum Núcleo. Para voltar, entre novamente com sua conta.</p><form action={signOut} className="mt-5"><SignOutButton /></form></ActionDialog>
    </section>
    <section id={sectionId("conta-e-nucleos")} className="ui-panel account-panel"><h2>Conta e Núcleos</h2>
      <Link href={routes.nucleus}><AccountRow icon={UsersRound} title="Seus Núcleos" description="Escolher um vínculo ou criar e entrar em um Núcleo" /></Link>
      <ActionDialog variant="text" className="account-dialog-trigger" title="Sair de um Núcleo" description="Confira as consequências antes de decidir." trigger={<AccountRow icon={LogOut} title="Sair de um Núcleo" description="Escolher o vínculo e conferir a saída" />}><div className="settings-copy"><p>Abra o Núcleo do qual deseja sair e selecione a opção de saída. Você poderá conferir sua preferência de autoria e as consequências antes de confirmar.</p><p className="mt-3">O histórico compartilhado permanece para as pessoas que continuarem. Sair de um Núcleo não exclui sua conta.</p><Link href={routes.nucleus} className="ui-button mt-5">Escolher um Núcleo</Link></div></ActionDialog>
    </section>
    {!embedded && <section id={sectionId("notificacoes")} className="ui-panel account-panel"><h2>Notificações</h2><span className="ui-badge">Esboço de funcionalidade · ainda não desenvolvido</span>
      <ActionDialog variant="text" className="account-dialog-trigger" title="Presença também precisa de silêncio" trigger={<AccountRow icon={Bell} title="Presença também precisa de silêncio" description="Preferências de comunicação futuras" />}><div className="settings-copy"><p className="ui-badge mb-4">Esboço de funcionalidade · ainda não desenvolvido</p><p>Canais de aviso e horários de silêncio ainda não estão disponíveis. Nenhuma configuração de notificação é alterada aqui.</p></div></ActionDialog>
    </section>}
    <section id={sectionId("aparencia")} className="ui-panel account-panel"><h2>Aparência</h2><p className="settings-copy">Escolha as cores do seu espaço. A preferência é salva na sua conta.</p><AppearanceOption className="account-dialog-trigger" /></section>
    <section id={sectionId("privacidade")} className="ui-panel account-panel"><h2>Privacidade</h2>
      {privacyHidden === undefined ? <p role="alert" className="ui-feedback">Não foi possível consultar sua preferência de privacidade. Atualize a página para tentar novamente.</p> : <ActionDialog variant="text" className="account-dialog-trigger" title="Privacidade e visibilidade" description="Escolhas claras sobre seu histórico compartilhado." size="wide" trigger={<AccountRow icon={LockKeyhole} title="Visibilidade das próximas saídas" description="Uma escolha para as próximas ações" />}><PrivacyContent hidden={privacyHidden} /></ActionDialog>}
      <ActionDialog variant="text" className="account-dialog-trigger" title="Dados e autonomia" description="Orientações e limites do produto." size="wide" trigger={<AccountRow icon={BookOpen} title="Dados e autonomia" description="Orientações e limites do produto" />}><HelpContent /></ActionDialog>
    </section>
    <section id={sectionId("ajuda-e-suporte")} className="ui-panel account-panel"><h2>Ajuda e suporte</h2>
      <ActionDialog variant="text" className="account-dialog-trigger" title="Ajuda e suporte" description="Orientação e contato com a responsável pelo aplicativo." size="wide" trigger={<AccountRow icon={MessageSquare} title="Preciso de orientação" description="Responsável e canal de contato" />}><HelpContent /></ActionDialog>
      <ActionDialog variant="text" className="account-dialog-trigger" title="Entender os combinados" description="Participação, termos e administração." size="wide" trigger={<AccountRow icon={BookOpen} title="Entender os combinados" description="Participação, termos e administração" />}><HelpContent /></ActionDialog>
    </section>
    {!embedded && <section id={sectionId("apagar-minha-conta")} className="ui-panel account-panel"><h2>Apagar minha conta</h2>
      <p className="settings-copy">A exclusão é definitiva. Confira as consequências antes de confirmar.</p>
      <DeleteAccountOption />
    </section>}
  </div>;
}
