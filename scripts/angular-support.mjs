import { createServer } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { parseProblemReport } from '../src/features/support/input.ts';

const maxBytes = 16 * 1024;
const unavailable = 'O envio de relatos está indisponível neste ambiente. Seu texto foi mantido.';

export function createSupportServer({url, publicKey, version, smtpPort}) {
  return createServer(async (request, response) => {
    const reply = (status, payload) => {
      response.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'});
      response.end(JSON.stringify(payload));
    };
    if (request.url !== '/api/problem-report' || request.method !== 'POST') {
      reply(404, {error: 'Destino não encontrado.'});
      return;
    }
    const token = /^Bearer ([A-Za-z0-9._-]{1,8192})$/.exec(request.headers.authorization ?? '')?.[1];
    if (!token) { reply(401, {error: 'Entre novamente para enviar um relato.'}); return; }
    if (request.headers['content-type']?.split(';', 1)[0] !== 'application/json') {
      reply(415, {error: 'Formato de relato inválido.'});
      return;
    }
    try {
      const chunks = [];
      let bytes = 0;
      for await (const chunk of request.iterator({destroyOnReturn: false})) {
        bytes += chunk.length;
        if (bytes > maxBytes) {
          request.resume();
          reply(413, {error: 'O relato excede o tamanho permitido.'});
          return;
        }
        chunks.push(chunk);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { reply(400, {error: 'Formato de relato inválido.'}); return; }
      const form = new FormData();
      for (const key of ['description', 'steps', 'route']) {
        if (typeof body?.[key] === 'string') form.set(key, body[key]);
        else if (body?.[key] !== undefined) { reply(400, {error: 'Formato de relato inválido.'}); return; }
      }
      const input = parseProblemReport(form);
      if (!input) { reply(400, {error: 'Descreva o problema com 10 a 2.000 caracteres. Os passos podem ter até 1.000 caracteres.'}); return; }
      const auth = createClient(url, publicKey, {auth: {persistSession: false, autoRefreshToken: false}});
      const {data: {user}, error} = await auth.auth.getUser(token);
      if (error || !user?.email || !user.email_confirmed_at) {
        reply(401, {error: 'Entre com uma conta de e-mail confirmado para enviar o relato.'});
        return;
      }
      if (!smtpPort) { reply(503, {error: unavailable}); return; }
      // O transporte de desenvolvimento entrega somente para a caixa descartável no loopback.
      const {sendProblemReport, supportMailTransport} = await import('../src/features/support/mail-transport.ts');
      const mail = supportMailTransport({
        SUPPORT_SMTP_HOST: '127.0.0.1', SUPPORT_SMTP_PORT: smtpPort,
        SUPPORT_MAIL_FROM: 'support@example.test', NOS_AUTH_TEST: '1',
      });
      if (!mail) { reply(503, {error: unavailable}); return; }

      // O token conferido identifica a mesma conta na reserva atômica do banco.
      const scoped = createClient(url, publicKey, {accessToken: async () => token});
      const reservation = await scoped.rpc('reserve_problem_report');
      if (reservation.error) { reply(503, {error: 'Não foi possível preparar o envio. Seu texto foi mantido.'}); return; }
      const retryAt = Date.now() + 60_000;
      if (!reservation.data) { reply(429, {error: 'Aguarde um minuto entre os envios de relatos.', retryAt}); return; }
      try {
        await sendProblemReport(mail, input, user.email, version);
        reply(200, {success: true, retryAt});
      } catch {
        reply(502, {error: 'Não foi possível confirmar o envio. Seu texto foi mantido.', retryAt});
      }
    } catch {
      reply(503, {error: 'Não foi possível enviar agora. Seu texto foi mantido.'});
    }
  });
}
