"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseProblemReport } from "./input";
import { sendProblemReport, supportMailTransport } from "./mail";

export type ProblemReportState = { error?: string; success?: boolean; retryAt?: number };

export async function submitProblemReport(_previous: ProblemReportState, form: FormData): Promise<ProblemReportState> {
  const input = parseProblemReport(form);
  if (!input) return { error: "Descreva o problema com 10 a 2.000 caracteres. Os passos podem ter até 1.000 caracteres." };
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { error: "Não foi possível conferir sua conta. Tente novamente em instantes." };
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.email || !user.email_confirmed_at) return { error: "Entre com uma conta de e-mail confirmado para enviar o relato." };
    const mail = supportMailTransport();
    if (!mail) return { error: "O envio de relatos está indisponível neste ambiente. Seu texto foi mantido." };
    // A reserva é atômica e por conta, compartilhada por abas/instâncias. Não
    // armazena o relato; tentativas falhas também respeitam o intervalo antiabuso.
    const reservation = await supabase.rpc("reserve_problem_report");
    if (reservation.error) return { error: "Não foi possível preparar o envio. Seu texto foi mantido; tente novamente em instantes." };
    const retryAt = Date.now() + 60_000;
    if (!reservation.data) return { error: "Aguarde um minuto entre os envios de relatos.", retryAt };
    try {
      await sendProblemReport(mail, input, user.email);
      return { success: true, retryAt };
    } catch {
      return { error: "Não foi possível confirmar o envio. Seu texto foi mantido. Aguarde um minuto e tente novamente.", retryAt };
    }
  } catch {
    return { error: "Não foi possível enviar agora. Seu texto foi mantido; tente novamente em instantes." };
  }
}
