import { rmSync } from "node:fs";
import path from "node:path";

// O cache do compilador pode reter valores do ambiente de build. Não é necessário ao runtime.
// Limpar as duas localizações antes do adaptador/varredura mantém a proteção de segredos ativa.
const root = path.resolve(process.cwd());
for (const relative of [".next/cache", ".netlify/.next/cache"]) {
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep) || path.basename(target) !== "cache") throw new Error("Destino de cache inválido.");
  rmSync(target, { recursive: true, force: true });
}
console.log("Caches descartáveis do Next removidos; servidor e arquivos públicos preservados.");
