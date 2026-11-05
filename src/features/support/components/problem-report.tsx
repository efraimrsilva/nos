"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Bug } from "lucide-react";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { AccountRow } from "@/features/controls/components/account-row";
import { submitProblemReport } from "../actions";
import { reportRoute } from "../input";
import { useProblemReportReminder } from "./problem-report-reminder";

function ReportForm() {
  const id = useId(), pathname = usePathname();
  const [state, submit, pending] = useActionState(submitProblemReport, {});
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!state.retryAt || state.success) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [state.retryAt, state.success]);
  const remaining = Math.max(0, Math.ceil(((state.retryAt ?? 0) - now) / 1000));
  if (state.success) return <div role="status" className="ui-status"><strong>Relato enviado à equipe.</strong><p>Obrigado por ajudar a melhorar o Nós. Se precisarmos de mais detalhes, usaremos o e-mail da sua conta.</p></div>;
  return <form action={submit} className="control-form problem-report-form" aria-busy={pending}>
    <p id={`${id}-privacy`} className="settings-copy">Conte apenas o necessário. Não inclua senhas, códigos de acesso ou conteúdo íntimo de outras pessoas.</p>
    <fieldset disabled={pending}>
      <input type="hidden" name="route" value={reportRoute(pathname)} />
      <div className="ui-field"><label htmlFor={`${id}-description`}>O que aconteceu?</label><textarea id={`${id}-description`} name="description" value={description} onChange={event => setDescription(event.target.value)} required minLength={10} maxLength={2000} rows={4} aria-describedby={`${id}-privacy`} placeholder="Ex.: tentei salvar o propósito, mas apareceu uma mensagem de erro." /></div>
      <div className="ui-field"><label htmlFor={`${id}-steps`}>Como repetir o problema? (opcional)</label><textarea id={`${id}-steps`} name="steps" value={steps} onChange={event => setSteps(event.target.value)} maxLength={1000} rows={2} placeholder="Ex.: abri o Núcleo, toquei no lápis e depois em Salvar." /></div>
      <p className="settings-copy">Em último caso, o e-mail da conta poderá ser usado para contato.</p>
      <button className="ui-button" disabled={pending || remaining > 0}>{pending ? "Enviando…" : remaining > 0 ? `Aguarde ${remaining}s` : "Enviar relato"}</button>
    </fieldset>
    {state.error && <p role="alert" className="ui-feedback">{state.error}</p>}
  </form>;
}

export function ProblemReport({ placement = "row", reminderAccountId }: { placement?: "row" | "header" | "inline"; reminderAccountId?: string }) {
  const [revision, setRevision] = useState(0);
  const reminder = useProblemReportReminder(placement === "header" ? reminderAccountId : undefined);
  const isHeader = placement === "header";
  const dialog = <ActionDialog
    variant="text"
    className={isHeader ? "problem-report-header" : placement === "row" ? "account-dialog-trigger" : "problem-report-inline"}
    title="Relatar um problema"
    description="Descreva o que não funcionou. O relato será enviado à equipe responsável."
    onOpen={isHeader ? reminder.dismiss : undefined}
    onClose={() => setRevision(value => value + 1)}
    trigger={placement === "row"
      ? <AccountRow icon={Bug} title="Relatar um problema" description="Avise a equipe sobre algo que não funcionou" />
      : <><Bug size={20} aria-hidden="true" /><span className={isHeader ? "sr-only" : ""}>Relatar um problema</span>
        {isHeader && <span className="problem-report-label" aria-hidden="true"><strong>Encontrou algum problema?</strong><small>Relatar um problema</small></span>}</>}
  >
    <ReportForm key={revision} />
  </ActionDialog>;

  // O botão é o mesmo durante a transição, inclusive para quem está usando o teclado.
  return isHeader ? <div className="problem-report-anchor" data-reminder-visible={reminder.visible}>
    {dialog}
    <span className="sr-only" role="status">{reminder.visible ? "Encontrou algum problema? Selecione Relatar um problema no cabeçalho." : ""}</span>
  </div> : dialog;
}
