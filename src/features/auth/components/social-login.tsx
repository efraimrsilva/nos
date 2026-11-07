"use client";

import { useActionState } from "react";
import { startSocialLogin, completeSocialProfile } from "../social-actions";
import type { AuthFormState } from "../actions";
import { LoadingIndicator } from "@/shared/components/loading-indicator";

const initial: AuthFormState = { message: "", success: false, revision: 0 };

export function SocialLogin({ next }: { next: string }) {
  const [state, action, pending] = useActionState(startSocialLogin, initial);
  return <div className="auth-social">
    <form action={action} aria-label="Outras formas de acesso" role="group" aria-busy={pending}>
      <input type="hidden" name="next" value={next} />
      <button className="ui-button secondary auth-social-button" type="submit" name="provider" value="google" disabled={pending}>Continuar com Google</button>
      {pending && <p role="status" className="auth-help"><LoadingIndicator>Abrindo acesso seguro…</LoadingIndicator></p>}
      {state.message && <p role="alert" className="ui-feedback">{state.message}</p>}
    </form>
    <p className="auth-divider">ou continue com seu e-mail</p>
  </div>;
}

export function SocialProfileForm({ userId, next, suggestedName = "" }: { userId: string; next: string; suggestedName?: string }) {
  const [state, action, pending] = useActionState(completeSocialProfile, initial);
  return <section className="ui-panel auth-panel"><h2 className="ui-title">Como podemos chamar você?</h2>
    <p className="ui-copy">Complete seu nome para continuar. Ele será usado no seu perfil e nos seus Núcleos.</p>
    <form action={action} className="auth-fields" aria-busy={pending}>
      <input type="hidden" name="userId" value={userId} /><input type="hidden" name="next" value={next} />
      <div className="auth-field"><label htmlFor="social-profile-name">Nome</label><input id="social-profile-name" name="name" autoComplete="name" required maxLength={80} defaultValue={suggestedName} disabled={pending} className="ui-field" /></div>
      {state.message && <p role="alert" className="ui-feedback">{state.message}</p>}
      <button className="ui-button" disabled={pending}>{pending ? "Salvando…" : "Salvar e continuar"}</button>
    </form>
  </section>;
}
