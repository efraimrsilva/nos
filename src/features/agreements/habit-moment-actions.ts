"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseHabitMoment } from "@/features/agreements/habit-moment-input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";
import { uuid } from "@/features/agreements/habit-access";

export type HabitMomentActionState = { error: string };

export async function recordHabitMoment(nucleusId: string, agreementId: string,
  _previous: HabitMomentActionState, formData: FormData): Promise<HabitMomentActionState> {
  if (!uuid.test(nucleusId) || !uuid.test(agreementId)) return { error: "Hábito inválido." };
  const input = parseHabitMoment({ mood: String(formData.get("mood") ?? ""), note: String(formData.get("note") ?? "") });
  if (!input) return { error: "Escolha como foi o momento e escreva até 500 caracteres na nota." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Entre na sua conta novamente." };
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) return { error: isNucleusAuthUnavailable(authError) ? "Não foi possível conferir a sessão agora." : "Entre na sua conta novamente." };
  // A função no banco confere vínculo, aceite individual e estado antes de escrever; o formulário não concede acesso.
  const { error } = await supabase.rpc("record_nucleus_habit_moment", {
    target_nucleus: nucleusId, target_agreement: agreementId, moment_mood: input.mood, moment_note: input.note,
  });
  if (error) return { error: "Não foi possível registrar o momento. Atualize a página e confira se o hábito continua em teste." };
  const detailPath = `${routes.nucleus}/${nucleusId}/acordos/${agreementId}`;
  revalidatePath(detailPath);
  redirect(`${detailPath}?resultado=momento`);
}
