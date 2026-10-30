"use client";

import { useEffect, useId, useRef, useState, useTransition, type FormEvent } from "react";
import { Pencil, UsersRound } from "lucide-react";
import Link from "next/link";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { saveProfileName } from "../profile-name-action";
import { AccountRow } from "./account-row";

export function AccountDataDialog({ name, userId, email, emailConfirmed }: {
  name: string; userId: string; email?: string; emailConfirmed: boolean;
}) {
  const id = useId();
  const pencil = useRef<HTMLButtonElement>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  // Após substituir o formulário pelo resultado, devolve o foco ao lápis habilitado.
  useEffect(() => { if (success && !pending) pencil.current?.focus(); }, [success, pending]);
  function reset() {
    setEditing(false); setDraft(name); setError(""); setSuccess(false);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(""); setSuccess(false);
    startTransition(async () => {
      try {
        const result = await saveProfileName(draft, userId);
        if (result.error) { setError(result.error); return; }
        setEditing(false); setSuccess(true);
      } catch {
        setError("Não foi possível salvar seu nome. Confira a conexão e tente novamente.");
      }
    });
  }
  return <ActionDialog variant="text" className="account-dialog-trigger" title="Dados da conta" description="Nome e identificação do seu acesso." onClose={reset} trigger={<AccountRow icon={UsersRound} title="Dados da conta" description="Nome e identificação" />}>
    <dl className="wizard-summary"><div><dt>Nome</dt><dd className="account-name-value"><span>{name || "Nome não informado"}</span><button ref={pencil} type="button" className="ui-icon-button" aria-label="Editar nome do perfil" title="Editar nome do perfil" disabled={pending} onClick={() => { setDraft(name); setEditing(true); setError(""); setSuccess(false); }}><Pencil size={18} aria-hidden="true" /></button></dd></div></dl>
    {editing && <form onSubmit={submit} className="control-form account-name-form" aria-busy={pending}>
      <label htmlFor={id}>Nome do perfil</label>
      <input id={id} className="ui-field" name="name" autoComplete="name" value={draft} required maxLength={80} disabled={pending} autoFocus aria-describedby={`${id}-hint`} onChange={event => { setDraft(event.target.value); setError(""); }} />
      <p id={`${id}-hint`} className="settings-copy">Use de 1 a 80 caracteres. Este nome aparece no seu perfil e nos seus Núcleos.</p>
      <div className="account-name-actions"><button className="ui-button" type="submit" disabled={pending}>{pending ? "Salvando…" : "Salvar nome"}</button><button className="ui-button-secondary" type="button" disabled={pending} aria-label="Cancelar edição do nome" onClick={() => { reset(); pencil.current?.focus(); }}>Cancelar</button></div>
    </form>}
    {error && <p className="ui-feedback" role="alert">{error}</p>}
    {success && <p className="ui-feedback" role="status">Nome do perfil atualizado.</p>}
    <dl className="wizard-summary"><div><dt>E-mail</dt><dd>{email ?? "E-mail não disponível"}</dd></div><div><dt>Confirmação de e-mail</dt><dd>{emailConfirmed ? "E-mail confirmado" : "Confirmação pendente"}</dd></div></dl>
    <p className="settings-copy">Para solicitar outras correções dos seus dados, consulte Ajuda e suporte.</p>
    <Link href="/conta#ajuda-e-suporte" className="ui-button-secondary mt-5">Ajuda sobre meus dados</Link>
  </ActionDialog>;
}
