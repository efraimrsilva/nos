"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseCalendarEvent } from "@/features/calendar/event-input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/shared/routes";

export type CalendarActionState = { error: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function authenticatedClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { client: null, authUnavailable: false };
  const { data: { user }, error } = await supabase.auth.getUser();
  return { client: error || !user ? null : supabase, authUnavailable: isNucleusAuthUnavailable(error) };
}

export async function saveCalendarEvent(nucleusId: string, eventId: string | null,
  _previous: CalendarActionState, formData: FormData): Promise<CalendarActionState> {
  if (!uuid.test(nucleusId) || (eventId && !uuid.test(eventId))) return { error: "Evento inválido." };
  const input = parseCalendarEvent({
    title: String(formData.get("title") ?? ""),
    intention: String(formData.get("intention") ?? ""),
    startsAt: String(formData.get("startsAt") ?? ""),
    endsAt: String(formData.get("endsAt") ?? ""),
    timeZone: String(formData.get("timeZone") ?? ""),
  });
  if (!input) return { error: "Confira título, horários, intenção e fuso antes de salvar." };
  if (Date.parse(input.endsAt) <= Date.now()) return { error: "Escolha um evento que termine no futuro." };
  const { client: supabase, authUnavailable } = await authenticatedClient();
  if (!supabase) return { error: authUnavailable ? "Não foi possível conferir a sessão agora. Tente novamente." : "Entre na sua conta novamente para salvar o evento." };
  // A RPC valida a associação ao Núcleo e executa evento + participantes na mesma transação.
  const fields = {
    event_title: input.title,
    event_intention: input.intention,
    event_starts_at: input.startsAt,
    event_ends_at: input.endsAt,
    event_time_zone: input.timeZone,
  };
  const result = eventId
    ? await supabase.rpc("update_nucleus_event", { target_event: eventId, ...fields })
    : await supabase.rpc("create_nucleus_event", { target_nucleus: nucleusId, ...fields });
  if (result.error) return { error: "Não foi possível salvar o evento. Tente novamente." };
  revalidatePath(`${routes.nucleus}/${nucleusId}/agenda`);
  redirect(`${routes.nucleus}/${nucleusId}/agenda?resultado=salvo`);
}

export async function respondCalendarEvent(nucleusId: string, eventId: string, response: "accepted" | "declined") {
  if (!uuid.test(nucleusId) || !uuid.test(eventId)) return;
  const { client: supabase, authUnavailable } = await authenticatedClient();
  if (!supabase) redirect(authUnavailable ? `${routes.nucleus}/${nucleusId}/agenda?resultado=erro` : routes.account);
  const { error } = await supabase.rpc("respond_nucleus_event", { target_event: eventId, event_response: response });
  revalidatePath(`${routes.nucleus}/${nucleusId}/agenda`);
  redirect(`${routes.nucleus}/${nucleusId}/agenda?resultado=${error ? "erro" : "resposta"}`);
}

export async function deleteCalendarEvent(nucleusId: string, eventId: string) {
  if (!uuid.test(nucleusId) || !uuid.test(eventId)) return;
  const { client: supabase, authUnavailable } = await authenticatedClient();
  if (!supabase) redirect(authUnavailable ? `${routes.nucleus}/${nucleusId}/agenda?resultado=erro` : routes.account);
  const { error } = await supabase.rpc("delete_nucleus_event", { target_event: eventId });
  revalidatePath(`${routes.nucleus}/${nucleusId}/agenda`);
  redirect(`${routes.nucleus}/${nucleusId}/agenda?resultado=${error ? "erro" : "removido"}`);
}
