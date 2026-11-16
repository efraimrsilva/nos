import { readPublicConfig } from '../src/app/auth/public-config.ts';

export function readPreviewConfig(env) {
  return readPublicConfig({
    url: env.NOS_ANGULAR_SUPABASE_URL,
    publicKey: env.NOS_ANGULAR_SUPABASE_PUBLIC_KEY,
  }, 'hosted');
}

export async function createPreviewMail(env) {
  // Envio opt-in somente para caixa de ensaio. Variáveis de produção não são aproveitadas.
  const recipient = env.NOS_ANGULAR_SANDBOX_MAIL_TO ?? '';
  if (!/^[\w.+-]+@example\.test$/i.test(recipient)) return null;
  const {supportMailTransport, sendNewAccountNotification, sendProblemReport} =
    await import('../../../src/features/support/mail-transport.ts');
  const transport = supportMailTransport({
    SUPPORT_SMTP_HOST: env.NOS_ANGULAR_SANDBOX_SMTP_HOST,
    SUPPORT_SMTP_PORT: env.NOS_ANGULAR_SANDBOX_SMTP_PORT,
    SUPPORT_SMTP_USER: env.NOS_ANGULAR_SANDBOX_SMTP_USER,
    SUPPORT_SMTP_PASSWORD: env.NOS_ANGULAR_SANDBOX_SMTP_PASSWORD,
    SUPPORT_MAIL_FROM: env.NOS_ANGULAR_SANDBOX_MAIL_FROM,
  });
  if (!transport) return null;
  return {
    sendNotification: account => sendNewAccountNotification(transport, account, recipient),
    sendReport: (report, email, version) => sendProblemReport(transport, report, email, version, recipient),
  };
}
