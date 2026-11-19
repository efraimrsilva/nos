import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { readPublicConfig } from '../apps/web/src/app/auth/public-config.ts';
import { createHostedMail, createPreviewMail, readHostedConfig, readNotificationCredentials, selectMailMode } from '../apps/web/netlify/preview-mail.mjs';
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

test('somente o deploy publicado no domínio oficial pode selecionar envio de produção', () => {
  const domain = 'https://noslife.netlify.app';
  const official = new Request(domain + '/api/problem-report');
  const env = {APP_ORIGIN:domain,NOS_ANGULAR_PRODUCTION_MAIL:'1'};
  const published = {deploy:{context:'production',published:true},site:{url:domain}};
  const preview = {deploy:{context:'deploy-preview',published:false},site:{url:domain}};
  assert.equal(selectMailMode(env,official,published),'production');
  assert.equal(selectMailMode(env,official,preview),'sandbox');
  assert.equal(selectMailMode(env,official),'sandbox');
  assert.equal(selectMailMode({...env,NOS_ANGULAR_PRODUCTION_MAIL:'0'},official,published),'sandbox');
  assert.equal(selectMailMode(env,official,{...published,deploy:{...published.deploy,published:false}}),null);
  const alias = new Request('https://draft--noslife.netlify.app/api/problem-report',{
    headers:{'x-forwarded-host':'noslife.netlify.app'},
  });
  assert.equal(selectMailMode(env,alias,published),null);
  assert.equal(selectMailMode(env,official,{...published,site:{url:'https://other.netlify.app'}}),null);
});

test('transporte oficial usa configuração autenticada e o de ensaio não usa variáveis oficiais', async () => {
  const official = {
    SUPPORT_SMTP_HOST:'mail.example.test',SUPPORT_SMTP_USER:'fixture',
    SUPPORT_SMTP_PASSWORD:'fixture-only',SUPPORT_MAIL_FROM:'sender@example.test',
  };
  assert.ok(await createHostedMail(official,'production'));
  assert.equal(await createHostedMail(official,'sandbox'),null);
  assert.equal(await createHostedMail({...official,SUPPORT_SMTP_PASSWORD:''},'production'),null);
  assert.equal(await createHostedMail({
    ...official, SUPPORT_SMTP_HOST:'127.0.0.1', SUPPORT_SMTP_PASSWORD:'', NOS_AUTH_TEST:'1',
  },'production'),null);
});

test('receptor usa o contexto entregue pela Netlify e recusa deploy de produção desativado', async () => {
  const domain = 'https://noslife.netlify.app';
  const env = {
    APP_ORIGIN:domain,NOS_ANGULAR_PRODUCTION_MAIL:'1',
    NOS_ANGULAR_PRODUCTION_SUPABASE_URL:hosted.url,NOS_ANGULAR_PRODUCTION_SUPABASE_PUBLIC_KEY:key,
    NOS_ANGULAR_PRODUCTION_SUPABASE_SERVICE_ROLE_KEY:'fixture-service',
    NOS_ANGULAR_PRODUCTION_ACCOUNT_NOTIFICATION_SECRET:'fixture-secret-with-more-than-32-characters',
  };
  const modes = [];
  const handler = createNotificationEndpoint(env,{mailer:async (_env,mode)=>{
    modes.push(mode);
    return {sendNotification:async()=>assert.fail('Uma chamada sem assinatura não deve enviar e-mail.')};
  }});
  const request=()=>new Request(domain+'/api/account-notifications',{method:'POST',body:'{}'});
  assert.equal((await handler(request(),{deploy:{context:'deploy-preview',published:false},site:{url:domain}})).status,503);
  assert.equal((await handler(request(),{deploy:{context:'production',published:false},site:{url:domain}})).status,503);
  assert.deepEqual(modes,[]);
  assert.equal((await handler(request(),{deploy:{context:'production',published:true},site:{url:domain}})).status,401);
  assert.deepEqual(modes,['production']);

  const sandboxOnly = createNotificationEndpoint({
    APP_ORIGIN:domain,NOS_ANGULAR_PRODUCTION_MAIL:'1',
    NOS_ANGULAR_SUPABASE_URL:hosted.url,NOS_ANGULAR_SUPABASE_PUBLIC_KEY:key,
    NOS_ANGULAR_SUPABASE_SERVICE_ROLE_KEY:'sandbox-service',
    NOS_ANGULAR_ACCOUNT_NOTIFICATION_SECRET:'sandbox-secret-with-more-than-32-characters',
  },{mailer:async()=>assert.fail('Produção não pode aproveitar credenciais da prévia.')});
  assert.equal((await sandboxOnly(request(),{deploy:{context:'production',published:true},site:{url:domain}})).status,503);
});

test('cada build e função lê apenas a configuração pública do seu ambiente', () => {
  const prodUrl='https://official.example.test';
  const env={
    NOS_ANGULAR_SUPABASE_URL:hosted.url,NOS_ANGULAR_SUPABASE_PUBLIC_KEY:key,
    NOS_ANGULAR_PRODUCTION_SUPABASE_URL:prodUrl,NOS_ANGULAR_PRODUCTION_SUPABASE_PUBLIC_KEY:'sb_publishable_official',
    NOS_ANGULAR_PRODUCTION_GOOGLE:'1',
  };
  assert.deepEqual(readHostedConfig(env,'production'),{url:prodUrl,publicKey:'sb_publishable_official',google:true});
  assert.deepEqual(readHostedConfig(env,'sandbox'),{url:hosted.url,publicKey:key,google:false});
  const onlyPreview={NOS_ANGULAR_SUPABASE_URL:hosted.url,NOS_ANGULAR_SUPABASE_PUBLIC_KEY:key};
  assert.equal(readHostedConfig(onlyPreview,'production'),null);
});

test('Netlify reserva as APIs antes da rota padrão Angular e não fixa segredos', () => {
  const toml = readFileSync(new URL('../netlify.toml',import.meta.url),'utf8');
  const preview = readFileSync(new URL('../apps/web/netlify.toml',import.meta.url),'utf8');
  assert.equal(toml.slice(toml.indexOf('[functions]')).replaceAll('\r\n','\n'),
    preview.slice(preview.indexOf('[functions]')).replaceAll('\r\n','\n'));
  assert.match(toml,/\[context\.production\]\s+command = "[^"\n]+--production"/);
  const paths = Array.from(toml.matchAll(/^  from = "([^"]+)"/gm),match => match[1]);
  assert.deepEqual(paths,['/api/account-notifications','/api/problem-report','/api/*','/*']);
  assert.match(toml,/from = "\/api\/\*"\s+to = "\/404\.html"\s+status = 404/);
  assert.match(toml,/from = "\/\*"\s+to = "\/index\.html"\s+status = 200/);
  assert.match(toml,/Cache-Control = "no-store"/);
  assert.match(toml,/Referrer-Policy = "no-referrer"/);
  assert.doesNotMatch(toml,/SERVICE_ROLE|ACCOUNT_NOTIFICATION_SECRET|PASSWORD/);
});

test('virada reaproveita a configuração do site atual somente em produção', () => {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: 'https://official.example.test',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_official',
    SUPABASE_SERVICE_ROLE_KEY: 'fixture-service',
    ACCOUNT_NOTIFICATION_SECRET: 'fixture-notification-secret',
  };
  assert.deepEqual(readHostedConfig(env, 'production'), {
    url: env.NEXT_PUBLIC_SUPABASE_URL, publicKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, google: false,
  });
  assert.deepEqual(readNotificationCredentials(env, 'production'), {
    serviceKey: env.SUPABASE_SERVICE_ROLE_KEY, secret: env.ACCOUNT_NOTIFICATION_SECRET,
  });
  assert.equal(readHostedConfig(env, 'sandbox'), null);
  assert.deepEqual(readNotificationCredentials(env, 'sandbox'), {serviceKey: undefined, secret: ''});

  // Um projeto Angular distinto nunca pode herdar as credenciais do banco anterior.
  const override = {...env, NOS_ANGULAR_PRODUCTION_SUPABASE_URL:'https://other.example.test'};
  assert.equal(readHostedConfig(override, 'production'), null);
  assert.deepEqual(readNotificationCredentials(override, 'production'), {serviceKey: undefined, secret: ''});
});
