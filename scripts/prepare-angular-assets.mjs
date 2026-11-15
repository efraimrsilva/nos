import { copyFileSync, mkdirSync } from 'node:fs';

// Angular restringe assets ao seu workspace. Gera uma cópia de build da marca mantida pelo projeto.
const brand = new URL('../apps/web/.brand/', import.meta.url);
mkdirSync(brand, {recursive:true});
copyFileSync(new URL('../public/brand/nos-tree.png', import.meta.url), new URL('nos-tree.png', brand));
