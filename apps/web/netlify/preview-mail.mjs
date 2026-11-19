import { readPublicConfig } from '../src/app/auth/public-config.ts';

const prefixFor = mode => mode === 'production' ? 'NOS_ANGULAR_PRODUCTION_' : 'NOS_ANGULAR_';

// Na virada do mesmo site, reutilize a configuração já hospedada sem copiar segredos.
// Se houver uma configuração Angular explícita, dados e credenciais vêm desse conjunto.
const useCurrentSiteConfig = (env,mode) => mode === 'production' &&
  env.NOS_ANGULAR_PRODUCTION_SUPABASE_URL === undefined &&
  env.NOS_ANGULAR_PRODUCTION_SUPABASE_PUBLIC_KEY === undefined;

export function readHostedConfig(env,mode) {
  if (!mode) return null;
  if (useCurrentSiteConfig(env,mode)) {
    return readPublicConfig({
      url:env.NEXT_PUBLIC_SUPABASE_URL,
      publicKey:env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      google:env.NOS_ANGULAR_PRODUCTION_GOOGLE === '1',
    },'hosted');
  }
  const prefix = prefixFor(mode);
  return readPublicConfig({
    url: env[prefix+'SUPABASE_URL'],
    publicKey: env[prefix+'SUPABASE_PUBLIC_KEY'],
    google: env[prefix+'GOOGLE'] === '1',
  }, 'hosted');
}

export function readNotificationCredentials(env,mode) {
  if (!mode) return null;
  if (useCurrentSiteConfig(env,mode)) {
    return {serviceKey:env.SUPABASE_SERVICE_ROLE_KEY,secret:env.ACCOUNT_NOTIFICATION_SECRET ?? ''};
  }
  const prefix = prefixFor(mode);
  return {
    serviceKey:env[prefix+'SUPABASE_SERVICE_ROLE_KEY'],
    secret:env[prefix+'ACCOUNT_NOTIFICATION_SECRET'] ?? '',
  };
}

export function selectMailMode(env,request,context) {
  // O site isolado também pode usar o contexto production para a sua caixa descartável.
  if (env.NOS_ANGULAR_PRODUCTION_MAIL !== '1' || context?.deploy?.context !== 'production') return 'sandbox';
  const origin = new URL(request.url).origin;
  const site = context.site?.url;
  // O contexto da plataforma e a origem canônica impedem envio oficial por URLs de ensaio ou por snapshots antigos.
  if (context.deploy.published !== true || !origin.startsWith('https://') || origin !== env.APP_ORIGIN ||
      !site || !URL.canParse(site) || new URL(site).origin !== origin) return null;
  return 'production';
}

export async function createHostedMail(env,mode) {
  if (mode === 'sandbox') return createPreviewMail(env);
  if (mode !== 'production') return null;
  const {supportMailTransport, sendNewAccountNotification, sendProblemReport} =
    await import('../../../src/features/support/mail-transport.ts');
  // Reutiliza o SMTP e o destinatário fixo do Next.js. O modo local não se aplica ao deploy publicado.
  const transport = supportMailTransport({...env,NOS_AUTH_TEST:undefined});
  if (!transport) return null;
  return {
    sendNotification: account => sendNewAccountNotification(transport,account),
    sendReport: (report,email,version) => sendProblemReport(transport,report,email,version),
  };
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
