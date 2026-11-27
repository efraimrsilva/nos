import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import { readPublicConfig } from '../apps/web/src/app/auth/public-config.ts';
import { localSupabaseConfig } from './local-supabase.mjs';
import { createSupportServer } from './angular-support.mjs';

const root = new URL('../', import.meta.url);
process.chdir(fileURLToPath(root));
const app = new URL('apps/web/', root);
const port = process.argv[2] ?? '4200';
if (!/^\d{4,5}$/.test(port) || Number(port) > 65535) throw new Error('Porta inválida.');

const hostedPreview = process.env.NOS_LOCAL_HOSTED_SUPABASE === '1';
const envFile = new URL('.env.local', root);
// A preferência fica no checkout. Uma opção explícita no terminal tem precedência.
const env = existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {};
const google = (process.env.NOS_ANGULAR_GOOGLE ?? env.NOS_ANGULAR_GOOGLE) === '1';
let publicConfig;
if (hostedPreview) {
  // Lê apenas a URL e a chave pública; o ambiente do servidor Angular não recebe os segredos do arquivo.
  publicConfig = readPublicConfig({
    url: env.NEXT_PUBLIC_SUPABASE_URL, publicKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, google,
  }, 'hosted');
  if (!publicConfig) throw new Error('Configuração pública do Supabase hospedado inválida em .env.local.');
} else {
  const { API_URL, PUBLISHABLE_KEY, ANON_KEY } = localSupabaseConfig();
  publicConfig = {url: API_URL, publicKey: PUBLISHABLE_KEY || ANON_KEY, google};
}

// O build padrão não copia esta pasta. Só a configuração de desenvolvimento expõe a chave pública.
const config = new URL('.local/', app);
mkdirSync(config, { recursive: true });
writeFileSync(new URL('supabase.json', config), JSON.stringify({...publicConfig, hostedPreview}));
const {version} = JSON.parse(readFileSync(new URL('package.json', app), 'utf8'));
const support = createSupportServer({...publicConfig, version,
  smtpPort: hostedPreview ? undefined : process.env.NOS_ANGULAR_SUPPORT_SMTP_PORT});
support.listen(0, '127.0.0.1');
await once(support, 'listening');
const proxy = fileURLToPath(new URL('support-proxy-' + port + '.json', config));
writeFileSync(proxy, JSON.stringify({'/api/problem-report': {target: 'http://127.0.0.1:' + support.address().port}}));
const child = spawn(process.execPath, [fileURLToPath(new URL('node_modules/@angular/cli/bin/ng.js', app)),
  'serve', '--host', '127.0.0.1', '--port', port, '--proxy-config', proxy], {
  cwd: app, stdio: 'inherit', windowsHide: true, env: { ...process.env, NG_CLI_ANALYTICS: 'false' },
});
child.on('exit', code => { support.close(); process.exitCode = code ?? 1; });
child.on('error', () => { support.close(); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill());
