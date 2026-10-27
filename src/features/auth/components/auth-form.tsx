"use client";

import { useActionState, useState } from "react";
import { LoadingIndicator } from "@/shared/components/loading-indicator";
import { passwordHelp } from "@/features/auth/input";
import { AccountAccessDialog, type AccountAccessKind } from "./account-access-dialog";
import { submitAuth, type AuthFormState } from "@/features/auth/actions";
import "@/features/controls/accounts-layout.css";

const initialState: AuthFormState = { message: "", success: false, revision: 0 };

export function AuthForm({ next = "/nucleos", initialMode = "signup", initialAccess }: { next?: string; initialMode?: "signup" | "login"; initialAccess?: AccountAccessKind }) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode);

  return <section data-auth-panel data-auth-mode={mode} className="ui-panel auth-panel">
    <div className="auth-tabs" aria-label="Modo de acesso">
      <button type="button" onClick={() => setMode("signup")} aria-pressed={mode === "signup"}>Criar conta</button>
      <button type="button" onClick={() => setMode("login")} aria-pressed={mode === "login"}>Já tenho conta</button>
    </div>
    {/* A troca de modo reinicia apenas o formulário; destino e ações protegidas permanecem. */}
    <CredentialsForm key={mode} mode={mode} next={next} />
    <div className="auth-assistance"><AccountAccessDialog kind="recovery" next={next} defaultOpen={initialAccess === "recovery"} /><AccountAccessDialog kind="confirmation" next={next} defaultOpen={initialAccess === "confirmation"} /></div>
  </section>;
}

function CredentialsForm({ mode, next }: { mode: "signup" | "login"; next: string }) {
  const [state, action, pending] = useActionState(submitAuth, initialState);
  return <form action={action} noValidate className="auth-fields" aria-busy={pending}>
    <input type="hidden" name="mode" value={mode} />
    <input type="hidden" name="next" value={next} />
    {mode === "signup" && <div data-signup-extra className="auth-field"><label htmlFor="account-name">Nome</label><input id="account-name" name="name" autoComplete="name" maxLength={80} className="ui-field" /></div>}
    <div className="auth-field"><label htmlFor="account-email">E-mail</label><input id="account-email" name="email" type="email" autoComplete="email" className="ui-field" /></div>
    <div className="auth-field"><label htmlFor="account-password">Senha</label><input key={state.revision} id="account-password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} aria-describedby={mode === "signup" ? "account-password-help" : undefined} className="ui-field" />{mode === "signup" && <p data-signup-extra id="account-password-help">{passwordHelp}</p>}</div>
    {state.message && <p role={state.success ? "status" : "alert"} className="ui-feedback">{state.message}</p>}
    <button disabled={pending} aria-busy={pending} type="submit" className="ui-button">{pending ? <LoadingIndicator>Aguarde…</LoadingIndicator> : mode === "signup" ? "Criar conta" : "Entrar"}</button>
  </form>;
}
