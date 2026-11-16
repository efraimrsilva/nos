import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import './prepare-angular-assets.mjs';
import { localSupabaseConfig } from './local-supabase.mjs';
import { createSupportServer } from './angular-support.mjs';

const root = new URL('../', import.meta.url);
process.chdir(fileURLToPath(root));
const { API_URL: url, PUBLISHABLE_KEY, ANON_KEY } = localSupabaseConfig();
const app = new URL('apps/web/', root);
const port = process.argv[2] ?? '4200';
if (!/^\d{4,5}$/.test(port) || Number(port) > 65535) throw new Error('Porta inválida.');

// O build padrão não copia esta pasta. Só a configuração de desenvolvimento expõe a chave pública.
const config = new URL('.local/', app);
mkdirSync(config, { recursive: true });
writeFileSync(new URL('supabase.json', config), JSON.stringify({ url, publicKey: PUBLISHABLE_KEY || ANON_KEY, google: process.env.NOS_ANGULAR_GOOGLE === '1' }));
const {version} = JSON.parse(readFileSync(new URL('package.json', app), 'utf8'));
const support = createSupportServer({url, publicKey: PUBLISHABLE_KEY || ANON_KEY, version,
  smtpPort: process.env.NOS_ANGULAR_SUPPORT_SMTP_PORT});
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
