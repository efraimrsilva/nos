import { test, expect } from "@playwright/test";
import { readNavigationCounts } from "../src/features/navigation/counts";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

test("totais válidos preservam zero e valores acima do limite de uma página", async () => {
  const counts = { nuclei: 24, agreements: 1201, events: 0, people: 3100 };
  expect(await readNavigationCounts({ rpc: async () => ({ data: counts, error: null }) } as never)).toEqual(counts);
});

test("falha ou resposta incompleta nunca se apresenta como zero", async () => {
  for (const data of [null, {}, { nuclei: 0, agreements: 0, events: 0 }, { nuclei: -1, agreements: 0, events: 0, people: 0 }, { nuclei: 1.5, agreements: 0, events: 0, people: 0 }, { nuclei: "2", agreements: 0, events: 0, people: 0 }]) {
    expect(await readNavigationCounts({ rpc: async () => ({ data, error: null }) } as never)).toBeNull();
  }
  expect(await readNavigationCounts({ rpc: async () => ({ data: null, error: { code: "PGRST202" } }) } as never)).toBeNull();
  expect(await readNavigationCounts({ rpc: async () => { throw new Error("offline"); } } as never)).toBeNull();
});

test("cache de build é descartado sem remover servidor ou arquivos públicos", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "nos-cache-test-"));
  try {
    for (const file of [".next/cache/turbopack/sample.sst", ".netlify/.next/cache/turbopack/sample.sst", ".next/server/page.js", "public/logo.svg"]) {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      writeFileSync(path.join(root, file), "fixture sem dados reais");
    }
    let succeeded = false;
    try { execFileSync(process.execPath, [path.resolve("scripts/clean-build-cache.mjs")], { cwd: root, stdio: "pipe" }); succeeded = true; } catch {}
    expect(succeeded).toBe(true);
    expect(existsSync(path.join(root, ".next/cache"))).toBe(false);
    expect(existsSync(path.join(root, ".netlify/.next/cache"))).toBe(false);
    expect(existsSync(path.join(root, ".next/server/page.js"))).toBe(true);
    expect(existsSync(path.join(root, "public/logo.svg"))).toBe(true);
  } finally {
    if (path.dirname(root) !== path.resolve(tmpdir()) || !path.basename(root).startsWith("nos-cache-test-")) throw new Error("Destino de limpeza inválido.");
    rmSync(root, { recursive: true, force: true });
  }
});
