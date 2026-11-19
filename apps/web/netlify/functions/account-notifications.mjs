import { createClient } from '@supabase/supabase-js';
import { handleAccountNotification } from '../../server/account-notifications/handler.ts';
import { createHostedMail, readHostedConfig, readNotificationCredentials, selectMailMode } from '../preview-mail.mjs';

export function createNotificationEndpoint(env, {client = createClient, mailer = createHostedMail} = {}) {
  return async (request,context) => {
    if (request.method !== 'POST') {
      return new Response(null, {status:405, headers:{Allow:'POST','Cache-Control':'no-store'}});
    }
    const mode = selectMailMode(env,request,context);
    const config = readHostedConfig(env,mode);
    const {serviceKey,secret = ''} = readNotificationCredentials(env,mode) ?? {};
    let mail;
    try { if (mode && config && serviceKey && secret.length >= 32) mail = await mailer(env,mode); }
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
