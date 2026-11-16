import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readPublicConfig } from '../apps/web/src/app/auth/public-config.ts';

const app = new URL('../apps/web/', import.meta.url);
const config = readPublicConfig({
  url: process.env.NOS_ANGULAR_SUPABASE_URL,
  publicKey: process.env.NOS_ANGULAR_SUPABASE_PUBLIC_KEY,
  google: process.env.NOS_ANGULAR_GOOGLE === '1',
}, 'hosted');
if (!config) {
  console.error('Configure NOS_ANGULAR_SUPABASE_URL (HTTPS) e NOS_ANGULAR_SUPABASE_PUBLIC_KEY (publishable ou anon) para a prévia.');
  process.exit(1);
}

const assets = spawnSync(process.execPath, [fileURLToPath(new URL('./prepare-angular-assets.mjs', import.meta.url))], {stdio:'inherit'});
if (assets.status !== 0) process.exit(assets.status ?? 1);
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
