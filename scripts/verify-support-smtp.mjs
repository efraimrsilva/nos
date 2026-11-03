// Verifica conexão e autenticação; não envia nenhuma mensagem externa.
import { createTransport } from "nodemailer";
const required = ["SUPPORT_SMTP_HOST", "SUPPORT_SMTP_USER", "SUPPORT_SMTP_PASSWORD", "SUPPORT_MAIL_FROM"];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`Configuração incompleta: ${missing.join(", ")}. Preencha no ambiente do servidor, sem compartilhar segredos.`);
  process.exitCode = 1;
} else {
  const port = Number(process.env.SUPPORT_SMTP_PORT ?? "587");
  const transport = createTransport({ host: process.env.SUPPORT_SMTP_HOST, port, secure: port === 465, requireTLS: true,
    auth: { user: process.env.SUPPORT_SMTP_USER, pass: process.env.SUPPORT_SMTP_PASSWORD }, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000 });
  try { await transport.verify(); console.log("Conexão TLS e autenticação SMTP verificadas. Nenhuma mensagem foi enviada."); }
  catch (error) { console.error(`Não foi possível validar o envio: ${error.code || "transporte"}. Confira a credencial SMTP no provedor.`); process.exitCode = 1; }
  finally { transport.close(); }
}
