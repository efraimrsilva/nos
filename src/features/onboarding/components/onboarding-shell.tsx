import { cache, type ReactNode } from "react";
import { ApplicationShell } from "@/shared/components/application-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { readNavigationCounts } from "@/features/navigation/counts";
import { profileLetters } from "@/shared/profile-letters";
import { AccountPreferences } from "@/features/controls/components/account-preferences";
import "@/features/controls/accounts-layout.css";
import { cookies } from "next/headers";

// Cache restrito à renderização da requisição; nunca compartilha totais entre contas.
const navigationCounts = cache(async () => {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return undefined;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return undefined;
    const lastId = (await cookies()).get(`nos-last-nucleus-${user.id}`)?.value;
    // A lembrança do navegador não autoriza acesso: a consulta usa a sessão e a RLS atual.
    const remembered = lastId && /^[0-9a-f-]{36}$/i.test(lastId)
      ? Promise.resolve(supabase.from("nuclei").select("id,name").eq("id", lastId).maybeSingle()).then(({ data, error }) => error ? undefined : data).catch(() => undefined)
      : Promise.resolve(null);
    const [counts, privacy, lastNucleus] = await Promise.all([
      readNavigationCounts(supabase).catch(() => undefined),
      Promise.resolve(supabase.rpc("get_my_privacy_preference")).then(({ data, error }) => error ? undefined : Boolean(data)).catch(() => undefined),
      remembered,
    ]);
    const name = typeof user.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "";
    return { counts, profileLabel: profileLetters(name), userId: user.id, name, email: user.email, emailConfirmed: Boolean(user.email_confirmed_at), privacy, lastNucleus };
  } catch { return undefined; }
});

// O conteúdo continua no servidor; a estrutura cuida somente da navegação e apresentação.
export async function OnboardingShell({ children, showTree = false, nucleusName }: { children: ReactNode; showTree?: boolean; nucleusName?: string }) {
  const context = showTree ? undefined : await navigationCounts();
  const accountMenuContent = context ? <AccountPreferences embedded userId={context.userId} name={context.name} email={context.email} emailConfirmed={context.emailConfirmed} privacyHidden={context.privacy} next="/conta" /> : undefined;
  return <ApplicationShell showTree={showTree} nucleusName={nucleusName} userId={context?.userId} lastNucleus={context?.lastNucleus} counts={context?.counts} profileLabel={context?.profileLabel} accountMenuContent={accountMenuContent}>{children}</ApplicationShell>;
}
