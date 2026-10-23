"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireControlsSession } from "./access";
import { isAccountDeletionConfirmed } from "./account-deletion-input";
import type { ControlActionState } from "./actions";
import { recoveryCookie } from "@/features/auth/recovery-proof";

export async function deleteOwnAccount(_previous: ControlActionState, form: FormData): Promise<ControlActionState> {
  if (!isAccountDeletionConfirmed(form.get("confirmationPhrase"))) return { error: "Digite exatamente APAGAR CONTA para confirmar." };
  const { supabase } = await requireControlsSession("/configuracoes/conta");
  // A RPC usa apenas auth.uid(): nem o formulário nem a ação aceitam uma conta de terceiros.
  const { error } = await supabase.rpc("delete_my_account", { confirmation_phrase: form.get("confirmationPhrase") });
  if (error?.code === "55000") return { error: "Há arquivos vinculados à sua conta. Consulte a ajuda para tratar esses arquivos antes de apagar a conta." };
  if (error) return { error: "Não foi possível confirmar a exclusão. Atualize a página para conferir sua sessão antes de tentar novamente ou consulte a ajuda." };

  // Auth já removeu sessões no banco. A limpeza local não deve transformar sucesso em erro.
  await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
  const store = await cookies();
  for (const cookie of store.getAll()) {
    if (cookie.name.startsWith("sb-") || cookie.name === recoveryCookie) store.delete(cookie.name);
  }
  revalidatePath("/", "layout");
  redirect("/conta?resultado=conta-excluida");
}
