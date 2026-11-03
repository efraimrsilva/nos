import "server-only";

import { createTransport } from "nodemailer";
import manifest from "../../../package.json";
import type { ProblemReportInput } from "./input";

// Destinatário fixo no servidor. Não aceitar to/from/assunto vindos do formulário.
const recipient = "sintagmasoftware@gmail.com";

export function supportMailTransport() {
  const host = process.env.SUPPORT_SMTP_HOST;
  const port = Number(process.env.SUPPORT_SMTP_PORT ?? "587");
  const user = process.env.SUPPORT_SMTP_USER, pass = process.env.SUPPORT_SMTP_PASSWORD;
  const from = process.env.SUPPORT_MAIL_FROM;
  const local = host === "127.0.0.1" && process.env.NOS_AUTH_TEST === "1";
  if (!host || !from || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(from) || !Number.isInteger(port) || port < 1 || port > 65535 || (!local && (!user || !pass))) return null;
  return { from, transport: createTransport({
    host, port, secure: port === 465, requireTLS: !local,
    auth: local ? undefined : { user: user!, pass: pass! },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
    disableFileAccess: true, disableUrlAccess: true,
  }) };
}

export async function sendProblemReport(mail: NonNullable<ReturnType<typeof supportMailTransport>>, input: ProblemReportInput, accountEmail: string) {
  // Texto simples evita interpretar HTML/URLs enviados pelo usuário. O contato
  // vem da sessão validada, permitindo resposta sem revelar a caixa da equipe.
  const result = await mail.transport.sendMail({
    from: { name: "Nós — suporte", address: mail.from }, to: recipient,
    replyTo: accountEmail, subject: `[Nós v${manifest.version}] Relato de problema`,
    text: `Relato de problema no Nós\n\nTela: ${input.route}\nVersão: ${manifest.version}\nContato da conta: ${accountEmail}\n\nO que aconteceu?\n${input.description}\n\nComo repetir?\n${input.steps || "Não informado."}`,
  });
  if (result.rejected.length || !result.accepted.length) throw new Error("support_delivery_rejected");
}
