import { createClient } from "@supabase/supabase-js";
import { handleAccountNotification } from "@/features/account-notifications/handler";
import { sendNewAccountNotification, supportMailTransport } from "@/features/support/mail";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const mail = supportMailTransport();
  // Cliente administrativo exclusivo desta integração; nunca usa sessão/cookies do visitante.
  const database = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return handleAccountNotification(request, {
    secret: process.env.ACCOUNT_NOTIFICATION_SECRET ?? "", ready: Boolean(mail && database),
    async claim(id) {
      const result = await database!.rpc("claim_account_notification", { event_id: id });
      if (result.error) throw new Error("notification_claim_failed");
      return result.data;
    },
    async send(account) { await sendNewAccountNotification(mail!, account); },
    async finish(id, sent) {
      const result = await database!.rpc("finish_account_notification", { event_id: id, delivered: sent });
      if (result.error || result.data !== true) throw new Error("notification_finish_failed");
    },
  });
}
