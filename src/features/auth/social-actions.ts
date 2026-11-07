"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveProfileName } from "@/features/controls/profile-name-action";
import { safeAuthNext, withAuthNext } from "./input";
import { authAppOrigin, socialProvider } from "./social-session";
import type { AuthFormState } from "./actions";

export async function startSocialLogin(previous: AuthFormState, form: FormData): Promise<AuthFormState> {
  const fail = (message: string) => ({ message, success: false, revision: previous.revision + 1 });
  const provider = form.getAll("provider").length === 1 ? socialProvider(form.get("provider")) : null;
  if (!provider) return fail("Escolha Google ou Apple para continuar.");
  const enabled = provider === "google" ? process.env.GOOGLE_AUTH_ENABLED : process.env.APPLE_AUTH_ENABLED;
  if (enabled !== "true") return fail(`O acesso com ${provider === "google" ? "Google" : "Apple"} ainda não está disponível. Use seu e-mail e senha.`);
  const origin = authAppOrigin(process.env.APP_ORIGIN);
  if (!origin) return fail("Não foi possível iniciar esse acesso agora. Tente novamente em instantes.");
  const next = safeAuthNext(form.getAll("next").length === 1 ? form.get("next") : undefined);
  let destination: string;
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return fail("Não foi possível iniciar esse acesso agora. Tente novamente em instantes.");
    // O cliente SSR grava o verificador PKCE em cookie antes de sair para o provedor.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: new URL(withAuthNext("/auth/callback", next), origin).href, skipBrowserRedirect: true },
    });
    if (error || !data.url) return fail("Não foi possível iniciar esse acesso agora. Tente novamente em instantes.");
    destination = data.url;
  } catch { return fail("Não foi possível conectar ao serviço de acesso. Tente novamente em instantes."); }
  redirect(destination);
}

export async function completeSocialProfile(previous: AuthFormState, form: FormData): Promise<AuthFormState> {
  // A ação de perfil confere sessão/conta antes de gravar, inclusive em abas antigas.
  const result = await saveProfileName(form.get("name"), String(form.get("userId") ?? ""));
  if (result.error) return { message: result.error, success: false, revision: previous.revision + 1 };
  redirect(safeAuthNext(form.get("next")));
}
