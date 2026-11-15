import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { localSupabaseConfig } from './local-supabase.mjs';

const root = new URL('../', import.meta.url);
process.chdir(fileURLToPath(root));
const { API_URL: url, PUBLISHABLE_KEY, ANON_KEY } = localSupabaseConfig();
const app = new URL('apps/web/', root);
const port = process.argv[2] ?? '4200';
if (!/^\d{4,5}$/.test(port) || Number(port) > 65535) throw new Error('Porta inválida.');

// O build padrão não copia esta pasta. Só a configuração de desenvolvimento expõe a chave pública.
const config = new URL('.local/', app);
mkdirSync(config, { recursive: true });
writeFileSync(new URL('supabase.json', config), JSON.stringify({ url, publicKey: PUBLISHABLE_KEY || ANON_KEY }));
const child = spawn(process.execPath, [fileURLToPath(new URL('node_modules/@angular/cli/bin/ng.js', app)),
  'serve', '--host', '127.0.0.1', '--port', port], {
  cwd: app, stdio: 'inherit', windowsHide: true, env: { ...process.env, NG_CLI_ANALYTICS: 'false' },
});
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill());
