import { createClient } from '@supabase/supabase-js';
import { parseProblemReport } from '../../src/domain/support/input.ts';

const maxBytes = 16 * 1024;
const unavailable = 'O envio de relatos está indisponível neste ambiente. Seu texto foi mantido.';

async function readInput(request) {
  const reader = request.body?.getReader();
  if (!reader) return {status:400};
  try {
    const chunks = [];
    let bytes = 0;
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) return {status:413};
      chunks.push(value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const form = new FormData();
    for (const key of ['description', 'steps', 'route']) {
      if (typeof body?.[key] === 'string') form.set(key, body[key]);
      else if (body?.[key] !== undefined) return {status:400};
    }
    const input = parseProblemReport(form);
    return input ? {input} : {status:400};
  } catch {
    return {status:400};
  } finally {
    reader.releaseLock();
  }
}

export async function handlePreviewProblemReport(request, {config, getSender}) {
  const reply = (status, body, headers = {}) => Response.json(body, {
    status, headers:{'Cache-Control':'no-store', ...headers},
  });
  if (request.method !== 'POST') return reply(405, {error:'Use POST para enviar o relato.'}, {Allow:'POST'});
  const token = /^Bearer ([A-Za-z0-9._-]{1,8192})$/.exec(request.headers.get('authorization') ?? '')?.[1];
  if (!token) return reply(401, {error:'Entre novamente para enviar um relato.'});
  if (request.headers.get('content-type')?.split(';', 1)[0] !== 'application/json') {
    return reply(415, {error:'Formato de relato inválido.'});
  }
  const {input,status} = await readInput(request);
  if (!input) return reply(status, {error:status === 413 ? 'O relato excede o tamanho permitido.'
    : 'Descreva o problema com 10 a 2.000 caracteres. Os passos podem ter até 1.000 caracteres.'});
  if (!config) return reply(503, {error:unavailable});
  const {url, publicKey} = config;
  try {
    const auth = createClient(url, publicKey, {auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user},error} = await auth.auth.getUser(token);
    if (error || !user?.email || !user.email_confirmed_at) {
      return reply(401, {error:'Entre com uma conta de e-mail confirmado para enviar o relato.'});
    }

    const send = await getSender();
    if (!send) return reply(503, {error:unavailable});
    // Reserva e identidade usam o token verificado da mesma conta, sem acesso administrativo.
    const scoped = createClient(url, publicKey, {accessToken:async () => token});
    const reservation = await scoped.rpc('reserve_problem_report');
    if (reservation.error) return reply(503, {error:'Não foi possível preparar o envio. Seu texto foi mantido.'});
    const retryAt = Date.now() + 60_000;
    if (!reservation.data) return reply(429, {error:'Aguarde um minuto entre os envios de relatos.', retryAt});
    try {
      await send(input,user.email);
      return reply(200,{success:true,retryAt});
    } catch {
      return reply(502,{error:'Não foi possível confirmar o envio. Seu texto foi mantido.',retryAt});
    }
  } catch {
    return reply(503, {error:'Não foi possível enviar agora. Seu texto foi mantido.'});
  }
}
