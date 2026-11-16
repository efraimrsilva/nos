import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { readPublicConfig } from '../apps/web/src/app/auth/public-config.ts';
import { createPreviewMail } from '../apps/web/netlify/preview-mail.mjs';
import { createNotificationEndpoint } from '../apps/web/netlify/functions/account-notifications.mjs';

const key = 'sb_publishable_fixture';
const hosted = {url: 'https://project.example.test', publicKey: key, google: true};

test('configuração pública separa loopback e HTTPS e recusa credenciais de serviço', () => {
  assert.deepEqual(readPublicConfig({...hosted, ignored:'secret'}, 'hosted'), hosted);
  for (const url of ['http://project.example.test', 'https://user:secret@project.example.test', 'https://project.example.test/path', 'https://localhost', 'https://localhost.', 'https://127.0.0.2', 'https://[::1]']) {
    assert.equal(readPublicConfig({...hosted,url}, 'hosted'), null);
  }
  const local = {...hosted,url:'http://127.0.0.1:54321'};
  assert.deepEqual(readPublicConfig(local,'local'), local);
  assert.equal(readPublicConfig(local,'hosted'), null);
  assert.equal(readPublicConfig(hosted,'local'), null);
  const jwt = role => 'e30.' + Buffer.from(JSON.stringify({role})).toString('base64url') + '.fixture';
  assert.equal(readPublicConfig({...hosted,publicKey:jwt('anon')},'hosted')?.publicKey, jwt('anon'));
  for (const publicKey of ['sb_secret_fixture', jwt('service_role'), jwt('authenticated'), 'bad']) {
    assert.equal(readPublicConfig({...hosted,publicKey}, 'hosted'), null);
  }
});

test('receptor mantém os métodos e falha fechado sem configuração de prévia', async () => {
  const handler = createNotificationEndpoint({});
  const url = 'https://preview.example.test/api/account-notifications';
  const get = await handler(new Request(url));
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('allow'), 'POST');
  const post = await handler(new Request(url,{method:'POST',body:'{}'}));
  assert.equal(post.status,503);
  assert.equal(post.headers.get('cache-control'),'no-store');
});

test('integra o contrato assinado ao cliente e não reenvia evento confirmado', async () => {
  const secret = 'secret-only-in-fixture-with-32-characters';
  const eventId = '9ee513e5-e80c-4adc-9b39-2c3cc598421f';
  const person = {name:'Pessoa de exemplo',email:'person@example.test'};
  const env = {
    NOS_ANGULAR_SUPABASE_URL:hosted.url,
    NOS_ANGULAR_SUPABASE_PUBLIC_KEY:key,
    NOS_ANGULAR_SUPABASE_SERVICE_ROLE_KEY:'fixture-service',
    NOS_ANGULAR_ACCOUNT_NOTIFICATION_SECRET:secret,
  };
  const calls = [];
  let sent = false;
  const handler = createNotificationEndpoint(env,{
    client(url, credential, options) {
      assert.equal(url,hosted.url);
      assert.equal(credential,'fixture-service');
      assert.equal(options.auth.persistSession,false);
      calls.push(['client']);
      return {async rpc(name, args) {
        calls.push([name,args]);
        if (name === 'claim_account_notification') return {data:sent ? {state:'sent'} : {state:'claimed',...person}};
        assert.equal(name,'finish_account_notification');
        sent = args.delivered;
        return {data:true};
      }};
    },
    mailer:async () => ({async sendNotification(account) { calls.push(['mail',account]); }}),
  });
  function signed(key) {
    const timestamp = String(Math.floor(Date.now()/1000));
    return new Request('https://preview.example.test/api/account-notifications',{
      method:'POST', body:'{}', headers:{
        'x-notification-id':eventId,
        'x-notification-timestamp':timestamp,
        'x-notification-signature':createHmac('sha256',key).update(eventId+'.'+timestamp).digest('hex'),
      },
    });
  }
  assert.equal((await handler(signed('invalid'))).status,401);
  assert.deepEqual(calls,[]);
  assert.equal((await handler(signed(secret))).status,200);
  assert.equal((await handler(signed(secret))).status,200);
  assert.deepEqual(calls,[
    ['client'], ['claim_account_notification',{event_id:eventId}], ['mail',person],
    ['finish_account_notification',{event_id:eventId,delivered:true}],
    ['client'], ['claim_account_notification',{event_id:eventId}],
  ]);
});

test('transporte de ensaio recusa destinatário fora da caixa de teste', async () => {
  assert.equal(await createPreviewMail({}),null);
  assert.equal(await createPreviewMail({NOS_ANGULAR_SANDBOX_MAIL_TO:'person@example.com'}),null);
});

test('Netlify reserva as APIs antes da rota padrão Angular e não fixa segredos', () => {
  const file = new URL('../apps/web/netlify.toml',import.meta.url);
  const toml = readFileSync(file,'utf8');
  const paths = Array.from(toml.matchAll(/^  from = "([^"]+)"/gm),match => match[1]);
  assert.deepEqual(paths,['/api/account-notifications','/api/problem-report','/api/*','/*']);
  assert.match(toml,/from = "\/api\/\*"\s+to = "\/404\.html"\s+status = 404/);
  assert.match(toml,/from = "\/\*"\s+to = "\/index\.html"\s+status = 200/);
  assert.match(toml,/Cache-Control = "no-store"/);
  assert.match(toml,/Referrer-Policy = "no-referrer"/);
  assert.doesNotMatch(toml,/SERVICE_ROLE|SECRET|PASSWORD/);
});
