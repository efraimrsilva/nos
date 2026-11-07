// Validação real em serviços locais; nunca carrega .env.local nem envia e-mail externo.
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomBytes, randomUUID, createHmac } from 'node:crypto';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { localSupabaseConfig } from './local-supabase.mjs';

const config = localSupabaseConfig();
const origin = 'http://127.0.0.1:3198';
const container = `nos-notification-test-${process.pid}`;
const secret = randomBytes(32).toString('hex');
const userId = randomUUID();
const email = `notification-${userId}@example.test`;
const name = 'Pessoa local de notificação';
const sql = query => execFileSync('docker', ['exec', '-i', 'supabase_db_nos', 'psql', '-U', 'postgres', '-d', 'postgres', '-At', '-v', 'ON_ERROR_STOP=1'], { input: query, encoding: 'utf8', windowsHide: true }).trim();
const admin = createClient(config.API_URL, config.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const workspace = process.env.NOS_NOTIFICATION_WORKSPACE ?? mkdtempSync(path.join(tmpdir(), 'nos-notification-'));
assert.equal(path.dirname(path.resolve(workspace)), path.resolve(tmpdir()));
assert.ok(path.basename(workspace).startsWith('nos-notification-'));
for (const entry of ['src', 'public', 'package.json', 'package-lock.json', 'tsconfig.json', 'next.config.ts', 'postcss.config.mjs']) cpSync(path.resolve(entry), path.join(workspace, entry), { recursive: true });
if (!process.env.NOS_NOTIFICATION_WORKSPACE) {
mkdirSync(path.join(workspace, 'node_modules'));
for (const entry of readdirSync('node_modules', { withFileTypes: true })) {
  const source = path.resolve('node_modules', entry.name), target = path.join(workspace, 'node_modules', entry.name);
  if (entry.name === 'next' || !entry.isDirectory()) cpSync(source, target, { recursive: true });
  else symlinkSync(source, target, 'junction');
}
}
// Não copiar credenciais do projeto. Até o transporte SMTP aponta para a caixa descartável.
const env = { ...process.env, NOS_LOCAL_VERIFY: '1', NOS_AUTH_TEST: '1', PLAYWRIGHT_TEST: '',
  NEXT_PUBLIC_SUPABASE_URL: config.API_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: config.SERVICE_ROLE_KEY, APP_ORIGIN: origin, ACCOUNT_NOTIFICATION_SECRET: secret,
  SUPPORT_SMTP_HOST: '127.0.0.1', SUPPORT_SMTP_PORT: '3026', SUPPORT_SMTP_USER: '', SUPPORT_SMTP_PASSWORD: '',
  SUPPORT_MAIL_FROM: 'notifications@example.test', NO_PROXY: 'localhost,127.0.0.1,::1', no_proxy: 'localhost,127.0.0.1,::1' };
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let server;
let vaultIds = [];
let mailIds = [];
let startedContainer = false;
const vaultId = value => /^[0-9a-f-]{36}$/.test(value);
const run = args => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, args, { cwd: workspace, env, stdio: 'inherit', windowsHide: true });
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Verificação terminou com código ${code}`)));
  child.on('error', reject);
});
try {
  assert.equal(sql("select count(*) from vault.secrets where name in ('account_notification_url','account_notification_secret')"), '0', 'não sobrescrever configuração local existente');
  assert.equal(sql('select count(*) from private.account_notifications where sent_at is null'), '0', 'validar somente a fila descartável desta execução');
  execFileSync('docker', ['run', '--rm', '-d', '--name', container, '-p', '127.0.0.1:3026:1025', '-p', '127.0.0.1:8027:8025', 'public.ecr.aws/supabase/mailpit:v1.30.2'], { stdio: 'ignore', windowsHide: true });
  startedContainer = true;
  if (process.argv.includes('--build')) {
    await run(['node_modules/next/dist/bin/next', 'typegen']);
    await run(['node_modules/typescript/bin/tsc', '--noEmit', '--incremental', 'false']);
    await run(['node_modules/next/dist/bin/next', 'build', '--webpack']);
  }
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', process.argv.includes('--build') ? 'start' : 'dev', ...(process.argv.includes('--build') ? [] : ['--webpack']), '--hostname', '0.0.0.0', '--port', '3198'], { cwd: workspace, env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  // Não imprimir logs de solicitações; erros das verificações têm mensagens fixas.
  for (const stream of [server.stdout, server.stderr]) stream.on('data', () => {});
  for (let i = 0; ; i++) {
    try { if ((await fetch(`${origin}/api/account-notifications`, { signal: AbortSignal.timeout(3000) })).status === 405) break; } catch {}
    if (i >= 60 || server.exitCode !== null) throw new Error('Receptor local indisponível');
    await wait(1000);
  }
  assert.equal((await fetch(`${origin}/api/account-notifications`, { method: 'POST', body: '{}' })).status, 401);
  vaultIds = sql(`select vault.create_secret('http://host.docker.internal:3198/api/account-notifications','account_notification_url'); select vault.create_secret('${secret}','account_notification_secret');`).split(/\r?\n/);
  assert.ok(vaultIds.every(vaultId));
  // Inserção SQL usa somente conta descartável e demonstra o gatilho real após COMMIT.
  sql(`insert into auth.users(id,email,raw_user_meta_data) values('${userId}','${email}','{"name":"${name}"}'); select private.dispatch_account_notifications();`);
  for (let i = 0; ; i++) {
    if (sql(`select sent_at is not null from private.account_notifications where id='${userId}'`) === 't') break;
    if (i >= 40) throw new Error('Envio local não foi confirmado');
    await wait(500);
  }
  const messages = await (await fetch('http://127.0.0.1:8027/api/v1/messages')).json();
  assert.equal(messages.total, 1);
  mailIds = messages.messages.map(item => item.ID);
  const message = await (await fetch(`http://127.0.0.1:8027/api/v1/message/${mailIds[0]}`)).json();
  assert.equal(message.Text.replaceAll('\r\n', '\n').trim(), `Nome: ${name}\nE-mail: ${email}`);
  assert.equal(message.Subject, 'Nós — Nova conta criada');
  assert.equal(message.To[0].Address, 'sintagmasoftware@gmail.com');
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac('sha256', secret).update(`${userId}.${timestamp}`).digest('hex');
  const headers = { 'x-notification-signature': signature, 'x-notification-timestamp': timestamp, 'content-type': 'application/json', 'x-notification-id': userId };
  assert.equal((await fetch(`${origin}/api/account-notifications`, { method: 'POST', headers, body: '{}' })).status, 200);
  assert.equal((await (await fetch('http://127.0.0.1:8027/api/v1/messages')).json()).total, 1);
  console.log('Integração local aprovada: INSERT → fila → pg_net → rota protegida → SMTP → mensagem com somente nome/e-mail; reentrega sem duplicidade.');
} finally {
  if (server) {
    // Somente a árvore do processo iniciado por este teste.
    if (process.platform === 'win32') { try { execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true }); } catch {} }
    else server.kill();
  }
  sql(`delete from auth.users where id='${userId}';`);
  for (const id of vaultIds.filter(vaultId)) sql(`delete from vault.secrets where id='${id}';`);
  if (startedContainer) execFileSync('docker', ['stop', container], { stdio: 'ignore', windowsHide: true });
  // Preservar cópia sem credenciais para inspecionar tipos/build; não remover diretórios do usuário.
  console.log(`Cópia de validação sem arquivos de ambiente: ${workspace}`);
}
