"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";
import { isValidEmail, isValidPassword, safeAuthNext, withAuthNext } from "./input";
import { recoveryCookie } from "./recovery-proof";
import { isAuthRetryableFetchError } from "@supabase/supabase-js";

export type AuthFormState = { message: string; success: boolean; revision: number; retryAt?: number };

export async function submitAuth(previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const mode = formData.get("mode") === "login" ? "login" : "signup";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const revision = previous.revision + 1;
  const next = safeAuthNext(formData.get("next"));
  const fail = (message: string) => ({ message, success: false, revision });

  if ((mode === "signup" && !name) || !email || !password) {
    return fail(mode === "signup" ? "Informe seu nome, e-mail e uma senha." : "Informe seu e-mail e senha.");
  }
  if (!isValidEmail(email)) return fail("Informe um e-mail válido.");
  if (password.length > 128) return fail("Use uma senha com até 128 caracteres.");
  if (mode === "signup" && (name.length > 80 || !isValidPassword(password))) {
    return fail("Use um nome de até 80 caracteres e uma senha com pelo menos 8 caracteres, letra, número e símbolo.");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("A autenticação ainda não está configurada neste ambiente.");

  if (mode === "signup") {
    const appOrigin = process.env.APP_ORIGIN;
    if (!appOrigin) return fail("O endereço do aplicativo ainda não está configurado.");
    const emailRedirectTo = new URL(withAuthNext("/auth/confirm", next), appOrigin).toString();
    // O link padrão confirma no Supabase e retorna para esta rota com um código de sessão PKCE.
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo } });
    if (error) return fail("Não foi possível criar a conta agora. Confira os dados e tente novamente.");
    if (!data.session) redirect(withAuthNext("/conta/confirmar-email", next));
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // O Auth distingue limite e falha de transporte de uma recusa das credenciais.
      if (error.status === 429) return fail("Muitas tentativas de acesso. Aguarde um pouco antes de tentar novamente.");
      if (isAuthRetryableFetchError(error) || (error.status ?? 0) >= 500) {
        return fail("Não foi possível acessar o serviço de autenticação. Tente novamente em instantes.");
      }
      return fail("Não foi possível entrar. Confira o e-mail e a senha.");
    }
  }

  // Um login comum não mantém uma prova anterior de recuperação de senha.
  (await cookies()).delete(recoveryCookie);
  redirect(next);
}

export async function signOut() {
  (await cookies()).delete(recoveryCookie);
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { error } = await supabase.auth.signOut();
  if (error) redirect(`${routes.account}?erro=saida`);
  redirect(routes.account);
}
