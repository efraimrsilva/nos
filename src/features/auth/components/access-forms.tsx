"use client";

import { useActionState, useEffect, useState } from "react";
import { requestAccessEmail, resetPassword } from "@/features/auth/access-actions";
import type { AuthFormState } from "@/features/auth/actions";
import { passwordHelp } from "@/features/auth/input";

const initial: AuthFormState = { message: "", success: false, revision: 0 };
const inputStyle = "mt-2 mb-5 w-full rounded-[14px] border border-line px-4 py-3.5 text-sm";
const buttonStyle = "continue-button mt-6 min-h-12 w-full rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60";

function Feedback({ state }: { state: AuthFormState }) {
  return state.message ? <p role={state.success ? "status" : "alert"} className={`mt-4 rounded-xl p-3 text-sm ${state.success ? "bg-[#eff3e6]" : "bg-[#fce9f1] text-[#9a3153]"}`}>{state.message}</p> : null;
}

export function EmailActionForm({ kind, next }: { kind: "recovery" | "confirmation"; next: string }) {
  const [state, action, pending] = useActionState(requestAccessEmail, initial);
  const [remaining, setRemaining] = useState(0);
  // O relógio local só informa o intervalo; o servidor e o Auth controlam a solicitação.
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.ceil(((state.retryAt ?? 0) - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [state.retryAt]);
  return <form action={action} noValidate className="mt-6 rounded-[22px] border border-line bg-white p-5 sm:p-7" aria-busy={pending}>
    <input type="hidden" name="kind" value={kind} />
    <input type="hidden" name="next" value={next} />
    <label htmlFor="access-email" className="block text-xs font-bold text-muted">E-mail da conta</label>
    <input id="access-email" name="email" type="email" autoComplete="email" maxLength={254} className={inputStyle} disabled={pending} />
    <p className="rounded-xl bg-[#eff3e6] p-3 text-xs leading-6 text-muted">{kind === "recovery" ? "Se houver uma conta para este e-mail, enviaremos as instruções. A mensagem não revela se alguém está cadastrado." : "Abra o link enviado ao cadastrar sua conta. Confira também o spam. Nunca compartilhe o link de acesso."}</p>
    <Feedback state={state} />
    <button type="submit" disabled={pending || remaining > 0} className={buttonStyle}>{pending ? "Solicitando…" : kind === "recovery" ? "Solicitar link" : "Reenviar confirmação"}</button>
    {remaining > 0 && <p className="mt-3 text-xs leading-5 text-muted">Você pode solicitar outro link em {remaining} segundos.</p>}
  </form>;
}

export function PasswordResetForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial);
  return <form action={action} noValidate className="mt-6 rounded-[22px] border border-line bg-white p-5 sm:p-7" aria-busy={pending}>
    <input type="hidden" name="next" value={next} />
    <label htmlFor="new-password" className="block text-xs font-bold text-muted">Nova senha</label>
    <input key={`password-${state.revision}`} id="new-password" name="password" type="password" autoComplete="new-password" maxLength={128} aria-describedby="password-help" className={inputStyle} />
    <label htmlFor="confirm-password" className="block text-xs font-bold text-muted">Confirmar nova senha</label>
    <input key={`confirmation-${state.revision}`} id="confirm-password" name="confirmation" type="password" autoComplete="new-password" maxLength={128} className={inputStyle} />
    <p id="password-help" className="text-xs leading-5 text-muted">{passwordHelp} Use até 128 caracteres.</p>
    <p className="mt-4 rounded-xl bg-[#eff3e6] p-3 text-xs leading-6 text-muted">Ao salvar, encerraremos as sessões da sua conta. Depois, entre com a nova senha.</p>
    <Feedback state={state} />
    <button type="submit" disabled={pending} className={buttonStyle}>{pending ? "Salvando…" : "Salvar senha"}</button>
  </form>;
}
