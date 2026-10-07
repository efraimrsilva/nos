"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authCookieOptions } from "@/lib/supabase/cookie-options";
import type { AuthFormState } from "./actions";
import { isValidEmail, isValidPassword, passwordHelp, safeAuthNext, withAuthNext } from "./input";
import { getRecoverySession } from "./recovery-session";
import { recoveryCookie, recoverySecret } from "./recovery-proof";
import { sendAccessEmail } from "./access-email";

export async function requestAccessEmail(previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const revision = previous.revision + 1;
  const fail = (message: string): AuthFormState => ({ message, success: false, revision });
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) return fail("Informe um e-mail válido.");
  const kind = formData.get("kind") === "confirmation" ? "confirmation" : "recovery";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("A autenticação ainda não está configurada neste ambiente.");
  if (!process.env.APP_ORIGIN || (kind === "recovery" && !recoverySecret())) return fail("O envio de links ainda não está configurado neste ambiente.");
  const next = safeAuthNext(formData.get("next"));
  const jar = await cookies();
  const cooldown = `nos-email-${kind}`;
  const retryAt = Number(jar.get(cooldown)?.value || 0);
  if (Number.isFinite(retryAt) && retryAt > Date.now()) return { ...fail("Aguarde o intervalo de 60 segundos antes de solicitar outro link."), retryAt };
  const newRetryAt = Date.now() + 60_000;
  // Intervalo por navegador complementa o rate limit autoritativo do Auth; não o substitui.
  jar.set(cooldown, String(newRetryAt), { ...authCookieOptions, path: "/", maxAge: 60 });
  const callback = new URL(withAuthNext(kind === "recovery" ? "/auth/recovery" : "/auth/confirm", next), process.env.APP_ORIGIN).toString();
  const message = await sendAccessEmail(kind, async () => kind === "recovery"
      ? await supabase.auth.resetPasswordForEmail(email, { redirectTo: callback })
      : await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: callback } }),
    // Diagnóstico sem endereço, corpo de erro, URL ou credenciais.
    () => console.warn(`[auth-email] Falha na solicitação de ${kind}.`));
  return { message, success: true, revision, retryAt: newRetryAt };
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
