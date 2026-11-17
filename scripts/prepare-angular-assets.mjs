import { copyFileSync, mkdirSync } from 'node:fs';

// Angular restringe assets ao seu workspace. Gera uma cópia de build da marca mantida pelo projeto.
const brand = new URL('../apps/web/.brand/', import.meta.url);
mkdirSync(brand, {recursive:true});
for (const file of ['nos-tree.png','google-g.png']) {
  copyFileSync(new URL('../public/brand/' + file, import.meta.url), new URL(file, brand));
}
