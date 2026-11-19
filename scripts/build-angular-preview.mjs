import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readHostedConfig } from '../apps/web/netlify/preview-mail.mjs';

const app = new URL('../apps/web/', import.meta.url);
const args = process.argv.slice(2);
if (args.length && (args.length !== 1 || args[0] !== '--production')) {
  console.error('Use node scripts/build-angular-preview.mjs [--production].');
  process.exit(1);
}
const mode = args.length ? 'production' : 'sandbox';
const config = readHostedConfig(process.env,mode);
if (!config) {
  const prefix = mode === 'production' ? 'NOS_ANGULAR_PRODUCTION_' : 'NOS_ANGULAR_';
  console.error('Configure '+prefix+'SUPABASE_URL (HTTPS) e '+prefix+'SUPABASE_PUBLIC_KEY (publishable ou anon).');
  process.exit(1);
}

const angular = new URL('node_modules/@angular/cli/bin/ng.js', app);
if (!existsSync(angular)) {
  console.error('Instale as dependências da prévia com npm ci --prefix apps/web.');
  process.exit(1);
}
const build = spawnSync(process.execPath, [fileURLToPath(angular), 'build'], {cwd:app, stdio:'inherit'});
if (build.status !== 0) process.exit(build.status ?? 1);

const browser = new URL('dist/nos-web/browser/', app);
if (!existsSync(new URL('index.html', browser))) throw new Error('A saída Angular não contém index.html.');
writeFileSync(new URL('supabase.json', browser), JSON.stringify(config));
copyFileSync(new URL('netlify/404.html', app), new URL('404.html', browser));
