"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export type AuthFormState = { message: string; success: boolean; revision: number };

export async function submitAuth(previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const mode = formData.get("mode") === "login" ? "login" : "signup";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const revision = previous.revision + 1;
  const fail = (message: string) => ({ message, success: false, revision });

  if ((mode === "signup" && !name) || !email || !password) {
    return fail(mode === "signup" ? "Informe seu nome, e-mail e uma senha." : "Informe seu e-mail e senha.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Informe um e-mail válido.");
  if (mode === "signup" && (name.length > 80 || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z\d]/.test(password))) {
    return fail("Use um nome de até 80 caracteres e uma senha com pelo menos 8 caracteres, letra, número e símbolo.");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fail("A autenticação ainda não está configurada neste ambiente.");

  if (mode === "signup") {
    const appOrigin = process.env.APP_ORIGIN;
    if (!appOrigin) return fail("O endereço do aplicativo ainda não está configurado.");
    const emailRedirectTo = new URL("/auth/confirm", appOrigin).toString();
    // O link padrão confirma no Supabase e retorna para esta rota com um código de sessão PKCE.
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo } });
    if (error) return fail("Não foi possível criar a conta agora. Confira os dados e tente novamente.");
    if (!data.session) return { message: "Confira seu e-mail para confirmar a conta antes de entrar.", success: true, revision };
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return fail("Não foi possível entrar. Confira o e-mail e a senha.");
  }

  redirect(routes.start);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { error } = await supabase.auth.signOut();
  if (error) redirect(`${routes.account}?erro=saida`);
  redirect(routes.account);
}
