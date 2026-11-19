import { createHmac, timingSafeEqual } from "node:crypto";

export type NewAccount = { name: string; email: string };
type Dependencies = {
  secret: string;
  ready: boolean;
  claim(id: string): Promise<{ state: string; name?: string; email?: string }>;
  send(account: NewAccount): Promise<void>;
  finish(id: string, sent: boolean): Promise<void>;
};

export async function handleAccountNotification(request: Request, deps: Dependencies) {
  const respond = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });
  if (!deps.ready || deps.secret.length < 32) return respond(503);
  const id = request.headers.get("x-notification-id") ?? "";
  const timestamp = request.headers.get("x-notification-timestamp") ?? "";
  const signature = request.headers.get("x-notification-signature") ?? "";
  const age = Date.now() / 1000 - Number(timestamp);
  // Assinatura temporária: a fila pg_net não recebe segredo reutilizável, nome ou e-mail.
  if (!/^\d{10}$/.test(timestamp) || age < -30 || age > 300 || !/^[a-f0-9]{64}$/.test(signature)) return respond(401);
  const expected = createHmac("sha256", deps.secret).update(`${id}.${timestamp}`).digest();
  if (!timingSafeEqual(Buffer.from(signature, "hex"), expected)) return respond(401);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return respond(400);

  try {
    // Limite durante a leitura, mesmo quando o chamador omite Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return respond(400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 2048) { await reader.cancel(); return respond(400); }
      chunks.push(chunk.value);
    }
    const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length) return respond(400);
  } catch { return respond(400); }

  try {
    // Reserva no banco compartilha a deduplicação entre instâncias do aplicativo.
    const result = await deps.claim(id);
    const state = result.state;
    if (state === "sent") return respond(200);
    if (state !== "claimed") return respond(state === "busy" ? 409 : 404);
    try {
      // Nome/e-mail vêm exclusivamente da RPC privada, nunca do chamador HTTP.
      const { name, email } = result;
      if (typeof name !== "string" || !name.trim() || [...name].length > 200 || /[\x00-\x1f\x7f]/.test(name) ||
        typeof email !== "string" || email.length > 320 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new Error("invalid_account");
      await deps.send({ name, email });
    }
    catch {
      await deps.finish(id, false);
      return respond(503);
    }
    // Se a confirmação no banco falhar depois do SMTP, manter a reserva até expirar.
    // SMTP não oferece exatamente uma entrega; esse caso pode repetir a mensagem.
    await deps.finish(id, true);
    return respond(200);
  } catch { return respond(503); }
}
