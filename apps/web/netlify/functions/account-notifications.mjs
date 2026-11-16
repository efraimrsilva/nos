import { createClient } from '@supabase/supabase-js';
import { handleAccountNotification } from '../../../../src/features/account-notifications/handler.ts';
import { createPreviewMail, readPreviewConfig } from '../preview-mail.mjs';

export function createNotificationEndpoint(env, {client = createClient, mailer = createPreviewMail} = {}) {
  return async request => {
    if (request.method !== 'POST') {
      return new Response(null, {status:405, headers:{Allow:'POST','Cache-Control':'no-store'}});
    }
    const config = readPreviewConfig(env);
    const serviceKey = env.NOS_ANGULAR_SUPABASE_SERVICE_ROLE_KEY;
    const secret = env.NOS_ANGULAR_ACCOUNT_NOTIFICATION_SECRET ?? '';
    let mail;
    try { if (config && serviceKey && secret.length >= 32) mail = await mailer(env); }
    catch { /* Falha do transporte retorna o mesmo 503 sem detalhes internos. */ }

    // A função aprova assinatura e envelope antes de usar o cliente administrativo.
    let database;
    const rpc = (name, args) => {
      database ??= client(config.url, serviceKey, {auth:{persistSession:false,autoRefreshToken:false}});
      return database.rpc(name, args);
    };
    return handleAccountNotification(request, {
      secret,
      ready: Boolean(config && serviceKey && mail),
      async claim(id) {
        const result = await rpc('claim_account_notification', {event_id:id});
        if (result.error) throw new Error('notification_claim_failed');
        return result.data;
      },
      async send(account) { await mail.sendNotification(account); },
      async finish(id, sent) {
        const result = await rpc('finish_account_notification', {event_id:id,delivered:sent});
        if (result.error || result.data !== true) throw new Error('notification_finish_failed');
      },
    });
  };
}

export default createNotificationEndpoint(process.env);
