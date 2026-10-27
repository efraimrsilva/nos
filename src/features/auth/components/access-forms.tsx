"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { requestAccessEmail, resetPassword } from "@/features/auth/access-actions";
import type { AuthFormState } from "@/features/auth/actions";
import { passwordHelp } from "@/features/auth/input";
import "@/features/controls/accounts-layout.css";

const initial: AuthFormState = { message: "", success: false, revision: 0 };

function Feedback({ state }: { state: AuthFormState }) {
  return state.message ? <p role={state.success ? "status" : "alert"} className="ui-feedback">{state.message}</p> : null;
}

export function EmailActionForm({ kind, next, embedded = false, accountEmail = "" }: { kind: "recovery" | "confirmation"; next: string; embedded?: boolean; accountEmail?: string }) {
  const emailId = useId();
  const [email, setEmail] = useState(accountEmail);
  const [state, action, pending] = useActionState(requestAccessEmail, initial);
  const [remaining, setRemaining] = useState(0);
  // O relógio local informa o intervalo; o servidor e o Auth controlam cada solicitação.
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.ceil(((state.retryAt ?? 0) - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [state.retryAt]);
  return <form action={action} noValidate className={embedded ? "auth-fields" : "ui-panel auth-panel auth-fields"} aria-busy={pending}>
    <input type="hidden" name="kind" value={kind} /><input type="hidden" name="next" value={next} />
    <div className="auth-field"><label htmlFor={emailId}>E-mail da conta</label><input id={emailId} name="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} maxLength={254} className="ui-field" disabled={pending} /></div>
    <p className="auth-help">{kind === "recovery" ? "Vamos verificar se este e-mail possui uma conta. Se existir, enviaremos as instruções para recuperar o acesso. Nunca compartilhe o link recebido." : "Vamos verificar se este e-mail já está confirmado. Se a confirmação estiver pendente, enviaremos um novo link. Nunca compartilhe o link de acesso."}</p>
    {!pending && state.submittedEmail === email.trim().toLowerCase() && <Feedback state={state} />}
    <button type="submit" disabled={pending || remaining > 0} className="ui-button">{pending ? "Solicitando…" : kind === "recovery" ? "Solicitar link" : "Reenviar confirmação"}</button>
    {remaining > 0 && <p className="auth-help" role="status">Você pode solicitar outro link em {remaining} segundos.</p>}
  </form>;
}

export function PasswordResetForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial);
  return <form action={action} noValidate className="ui-panel auth-panel auth-fields" aria-busy={pending}>
    <input type="hidden" name="next" value={next} />
    <div className="auth-field"><label htmlFor="new-password">Nova senha</label><input key={`password-${state.revision}`} id="new-password" name="password" type="password" autoComplete="new-password" maxLength={128} aria-describedby="password-help" className="ui-field" /></div>
    <div className="auth-field"><label htmlFor="confirm-password">Confirmar nova senha</label><input key={`confirmation-${state.revision}`} id="confirm-password" name="confirmation" type="password" autoComplete="new-password" maxLength={128} className="ui-field" /></div>
    <p id="password-help" className="auth-help">{passwordHelp} Use até 128 caracteres.</p>
    <p className="auth-help">Ao salvar, encerraremos as sessões da sua conta. Depois, entre com a nova senha.</p>
    <Feedback state={state} />
    <button type="submit" disabled={pending} className="ui-button">{pending ? "Salvando…" : "Salvar senha"}</button>
  </form>;
}
