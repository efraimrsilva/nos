"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { deleteOwnAccount } from "../delete-account-action";
import { ACCOUNT_DELETION_PHRASE, isAccountDeletionConfirmed } from "../account-deletion-input";

export function DeleteAccountForm() {
  const [phrase, setPhrase] = useState("");
  const [state, action, pending] = useActionState(deleteOwnAccount, { error: "" });
  const id = useId();
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const dialog = form.current?.closest("dialog");
    const resetConfirmation = () => setPhrase("");
    // Fechar com Escape ou X também exige uma nova confirmação na próxima abertura.
    dialog?.addEventListener("close", resetConfirmation);
    return () => dialog?.removeEventListener("close", resetConfirmation);
  }, []);

  return <form ref={form} action={action} className="control-form account-deletion-form">
    <div className="account-deletion-warning" id={`${id}-warning`}>
      <h3><TriangleAlert size={20} aria-hidden="true" />Apagar minha conta</h3>
      <p>Esta ação é definitiva. Seu acesso e seus dados de identificação serão excluídos, e você sairá de todos os Núcleos.</p>
      <p>Acordos, eventos, respostas e momentos compartilhados permanecem, com a autoria indicada como “Conta excluída”. O conteúdo dos textos ainda pode identificar você.</p>
      <p>Se você for a última pessoa administradora, outra participante será sorteada para administrar. Se for a última participante, o Núcleo será encerrado e os convites serão revogados.</p>
      <p>Uma nova conta não recupera os vínculos anteriores. Cópias de segurança seguem o tratamento de retenção do serviço; esta ação não as elimina imediatamente.</p>
    </div>
    <fieldset disabled={pending} aria-describedby={`${id}-warning`}>
      <div className="auth-field">
        <label htmlFor={`${id}-phrase`}>Para confirmar, digite {ACCOUNT_DELETION_PHRASE}</label>
        <input id={`${id}-phrase`} name="confirmationPhrase" className="ui-field" value={phrase} onChange={event => setPhrase(event.target.value)} required autoComplete="off" spellCheck={false} aria-describedby={`${id}-hint`} />
        <p id={`${id}-hint`}>Use as duas palavras em letras maiúsculas, com um espaço entre elas.</p>
      </div>
      <div className="account-deletion-actions">
        <button type="submit" className="ui-button ui-button-danger" disabled={!isAccountDeletionConfirmed(phrase) || pending} aria-busy={pending}>{pending ? "Apagando sua conta…" : "Apagar minha conta definitivamente"}</button>
        <button type="button" className="ui-button-secondary" onClick={event => {
          setPhrase("");
          // O formulário é usado dentro dos diálogos existentes; cancelar não envia a ação.
          event.currentTarget.closest("dialog")?.close();
        }}>Cancelar</button>
      </div>
    </fieldset>
    {state.error && <p role="alert" className="ui-feedback">{state.error}</p>}
    {pending && <p role="status">Aguarde a conclusão da exclusão.</p>}
  </form>;
}
