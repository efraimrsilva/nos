"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, TriangleAlert, UsersRound } from "lucide-react";
import type { AccountNucleus } from "../account-nuclei";
import { manageNucleus } from "../actions";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { AccountRow } from "./account-row";
import { ControlActionForm } from "./action-form";

export function NucleusAccountOptions({ nuclei, privacyHidden }: { nuclei: AccountNucleus[] | null; privacyHidden?: boolean }) {
  const pathname = usePathname();
  const currentId = /^\/nucleos\/([0-9a-f-]{36})(?:\/|$)/i.exec(pathname)?.[1];
  const [chosenId, setChosenId] = useState<string>();
  if (nuclei === null) return <p role="alert" className="ui-feedback">Não foi possível consultar seus Núcleos. Atualize a página para gerenciar convites, sair ou encerrar um Núcleo.</p>;
  const admins = nuclei.filter(nucleus => nucleus.role === "admin");
  const choose = (list: AccountNucleus[]) => list.find(nucleus => nucleus.id === chosenId) ?? list.find(nucleus => nucleus.id === currentId) ?? list[0];
  const selected = choose(nuclei), closing = choose(admins);
  const picker = (list: AccountNucleus[], value: string) => list.length > 1 && <label className="ui-field">Escolha o Núcleo<select value={value} onChange={event => setChosenId(event.target.value)}>{list.map(nucleus => <option key={nucleus.id} value={nucleus.id}>{nucleus.name}</option>)}</select></label>;
  return <>
    {admins.length > 0 && <ActionDialog variant="text" className="account-dialog-trigger" title="Gerenciar convites" trigger={<AccountRow icon={UsersRound} title="Gerenciar convites" description="Convidar pessoas, conferir e revogar convites" />}>
      <p className="ui-copy">Escolha um Núcleo que você administra.</p>{admins.map(nucleus => <Link key={nucleus.id} className="ui-row" href={`/nucleos/${nucleus.id}/convites`}>{nucleus.name}<span>Gerenciar convites</span></Link>)}
    </ActionDialog>}
    {selected && <ActionDialog variant="text" className="account-dialog-trigger" title="Sair de um Núcleo" description="Confira as consequências antes de decidir." trigger={<AccountRow icon={LogOut} title="Sair de um Núcleo" description="Escolher o vínculo e conferir a saída" />}>
      {picker(nuclei, selected.id)}<h3>{selected.name}</h3>
      <p className="settings-copy">Você perderá acesso a este Núcleo. O histórico compartilhado de conversas e interações permanecerá para quem continuar, incluindo momentos, humor e notas. A saída não cancela acordos nem exclui sua conta. O aplicativo ainda não oferece conversa livre.</p>
      <p className="settings-copy">{privacyHidden === undefined ? "Não foi possível consultar sua preferência de autoria. Confira a preferência antes de sair." : privacyHidden ? "Sua autoria será ocultada após esta saída; o conteúdo permanecerá e o texto ainda pode identificar você." : "Sua autoria nos registros será preservada."}</p>
      <Link href="/configuracoes/privacidade" className="ui-text-link">Conferir minha preferência</Link>
      {selected.role === "admin" && <p className="settings-copy">Outro administrador continuará. Se você for o último administrador, uma pessoa restante será sorteada. Se ninguém permanecer, o Núcleo será encerrado e os convites revogados.</p>}
      {/* A troca do Núcleo reinicia confirmações para não reaproveitar a ciência de outro vínculo. */}
      {privacyHidden !== undefined && <ControlActionForm key={selected.id} action={manageNucleus.bind(null, selected.id, "leave", null)} label="Sair deste Núcleo" pendingLabel="Saindo…" danger confirmation="Entendi que perderei acesso e que o histórico compartilhado permanecerá." />}
    </ActionDialog>}
    {closing && <ActionDialog variant="text" className="account-dialog-trigger account-deletion-trigger" title="Encerrar Núcleo para todos" description="Todos perderão acesso. Confira as consequências antes de confirmar." size="wide" trigger={<AccountRow icon={TriangleAlert} title="Encerrar Núcleo para todos" description="Encerra o espaço compartilhado · exige confirmação por escrito" />}>
      {picker(admins, closing.id)}<h3>{closing.name}</h3>
      <p className="settings-copy">Todos perderão acesso a este Núcleo, inclusive os administradores. Os convites serão revogados. Acordos, momentos e agenda permanecerão armazenados, sem acesso pelos antigos participantes. As contas das pessoas não serão apagadas.</p>
      <p className="settings-copy">Não há opção de reabrir o Núcleo pelo aplicativo. Se deseja apenas deixar de participar, use “Sair de um Núcleo”.</p>
      <ControlActionForm key={closing.id} action={manageNucleus.bind(null, closing.id, "close", null)} label="Encerrar Núcleo" pendingLabel="Encerrando…" danger confirmation="Entendi que todos perderão acesso, os convites serão revogados e o histórico permanecerá armazenado.">
        <label className="ui-field">Digite o nome do Núcleo para confirmar: {closing.name}<input name="confirmationName" required maxLength={80} autoComplete="off" /></label>
      </ControlActionForm><p className="settings-copy">Para cancelar, feche esta confirmação. Nada é alterado antes de confirmar o encerramento.</p>
    </ActionDialog>}
  </>;
}
