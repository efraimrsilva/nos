"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authCookieOptions } from "@/lib/supabase/cookie-options";
import type { AuthFormState } from "./actions";
import { isValidEmail, isValidPassword, passwordHelp, safeAuthNext, withAuthNext } from "./input";
import { getRecoverySession } from "./recovery-session";
import { recoveryCookie, recoverySecret } from "./recovery-proof";

export async function requestAccessEmail(previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const revision = previous.revision + 1;
  const fail = (message: string): AuthFormState => ({ message, success: false, revision, submittedEmail: email });
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) return fail("Informe um e-mail válido.");
  const kind = formData.get("kind") === "confirmation" ? "confirmation" : "recovery";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("A autenticação ainda não está configurada neste ambiente.");
  {
    // Recuperação e reenvio retornam sucesso até para endereços inexistentes.
    // A consulta explícita evita informar envio para uma conta que não existe.
    try {
      const { data, error } = await supabase.rpc("get_email_confirmation_status", { account_email: email });
      if (error || !["confirmed", "pending", "missing"].includes(data)) return fail(kind === "recovery" ? "Não foi possível verificar se este e-mail possui conta. Tente novamente em instantes." : "Não foi possível verificar a confirmação deste e-mail. Tente novamente em instantes.");
      if (kind === "confirmation" && data === "confirmed") return { message: "Este e-mail já está confirmado. Você já pode entrar na sua conta.", success: true, revision, submittedEmail: email };
      if (data === "missing") return fail("Não encontramos uma conta para este e-mail. Confira o endereço ou crie sua conta.");
    } catch {
      return fail(kind === "recovery" ? "Não foi possível verificar se este e-mail possui conta. Tente novamente em instantes." : "Não foi possível verificar a confirmação deste e-mail. Tente novamente em instantes.");
    }
  }
  if (!process.env.APP_ORIGIN || (kind === "recovery" && !recoverySecret())) return fail(kind === "recovery" ? "Encontramos uma conta para este e-mail, mas o envio de recuperação ainda não está configurado neste ambiente." : "O envio de links ainda não está configurado neste ambiente.");
  const next = safeAuthNext(formData.get("next"));
  const jar = await cookies();
  const cooldown = `nos-email-${kind}`;
  const retryAt = Number(jar.get(cooldown)?.value || 0);
  if (Number.isFinite(retryAt) && retryAt > Date.now()) return { ...fail(kind === "recovery" ? "Encontramos uma conta para este e-mail. Aguarde o intervalo de 60 segundos antes de solicitar outro link." : "Aguarde o intervalo de 60 segundos antes de solicitar outro link."), retryAt };
  const newRetryAt = Date.now() + 60_000;
  // Intervalo por navegador complementa o rate limit autoritativo do Auth; não o substitui.
  jar.set(cooldown, String(newRetryAt), { ...authCookieOptions, path: "/", maxAge: 60 });
  const callback = new URL(withAuthNext(kind === "recovery" ? "/auth/recovery" : "/auth/confirm", next), process.env.APP_ORIGIN).toString();
  const sendFailure = kind === "recovery"
    ? "Encontramos uma conta para este e-mail, mas não foi possível enviar a recuperação. Tente novamente em instantes."
    : "Não foi possível enviar a confirmação. Tente novamente em instantes.";
  try {
    const { error } = kind === "confirmation"
      ? await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: callback } })
      : await supabase.auth.resetPasswordForEmail(email, { redirectTo: callback });
    if (error) return { ...fail(error.status === 429
      ? (kind === "recovery" ? "Encontramos uma conta para este e-mail. Muitas solicitações: aguarde um pouco antes de tentar novamente." : "Muitas solicitações. Aguarde um pouco antes de tentar novamente.")
      : sendFailure), retryAt: newRetryAt };
  } catch {
    return { ...fail(sendFailure), retryAt: newRetryAt };
  }
  return { message: kind === "recovery"
    ? "Encontramos uma conta para este e-mail. Enviamos as instruções de recuperação. Confira sua caixa de entrada e também o spam. Nunca compartilhe o link recebido."
    : "Enviamos a confirmação para o seu e-mail. Confira sua caixa de entrada e também o spam.", success: true, revision, retryAt: newRetryAt, submittedEmail: email };
}

export async function resetPassword(previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const revision = previous.revision + 1;
  const fail = (message: string) => ({ message, success: false, revision });
  const supabase = await getRecoverySession();
  if (!supabase) return fail("Abra um link de recuperação válido para redefinir sua senha.");
  const password = String(formData.get("password") ?? "");
  if (!isValidPassword(password)) return fail(`${passwordHelp} Use até 128 caracteres.`);
  if (password !== String(formData.get("confirmation") ?? "")) return fail("As senhas precisam ser iguais.");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return fail("Não foi possível salvar a senha. Use uma senha diferente da anterior ou solicite outro link.");
  // A senha pertence ao Auth. A revogação global impede a renovação em outros dispositivos.
  const { error: signOutError } = await supabase.auth.signOut({ scope: "global" });
  (await cookies()).delete(recoveryCookie);
  const next = safeAuthNext(formData.get("next"));
  redirect(withAuthNext(signOutError ? "/conta?resultado=senha&erro=revogacao" : "/conta?resultado=senha", next));
}
