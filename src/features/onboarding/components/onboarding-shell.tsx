import { cache, type ReactNode } from "react";
import { ApplicationShell } from "@/shared/components/application-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { readNavigationCounts } from "@/features/navigation/counts";
import { profileLetters } from "@/shared/profile-letters";

// Cache restrito à renderização da requisição; nunca compartilha totais entre contas.
const navigationCounts = cache(async () => {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return undefined;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return undefined;
    const counts = await readNavigationCounts(supabase).catch(() => undefined);
    return { counts, profileLabel: profileLetters(user.user_metadata?.name) };
  } catch { return undefined; }
});

// O conteúdo continua no servidor; a estrutura cuida somente da navegação e apresentação.
export async function OnboardingShell({ children, showTree = false, nucleusName }: { children: ReactNode; showTree?: boolean; nucleusName?: string }) {
  const context = showTree ? undefined : await navigationCounts();
  return <ApplicationShell showTree={showTree} nucleusName={nucleusName} counts={context?.counts} profileLabel={context?.profileLabel}>{children}</ApplicationShell>;
}
