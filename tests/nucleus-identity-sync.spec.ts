import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";

test("identidade tenta novamente enquanto a renderização não confirma a nova versão", async () => {
  let observed = "version-a", refreshes = 0;
  let tick: (() => void) | undefined;
  let dispose: (() => void) | undefined;
  const source = stripTypeScriptTypes(readFileSync("src/features/nuclei/components/nucleus-identity-sync.tsx", "utf8"))
    .replace(/^import .*;\r?\n/gm, "").replace("export function", "function");
  const Sync = runInNewContext(`${source}\nNucleusIdentitySync;`, {
    useEffect: (effect: () => () => void) => { dispose = effect(); },
    usePathname: () => "/nucleos/example",
    // A solicitação não altera a prop: representa refresh perdido/falho.
    useRouter: () => ({ refresh: () => { refreshes++; } }),
    getNucleusIdentityVersion: async () => observed,
    document: { hidden: false, addEventListener() {}, removeEventListener() {} },
    navigator: { onLine: true },
    window: { setInterval(callback: () => void) { tick = callback; return 1; }, clearInterval() {}, addEventListener() {}, removeEventListener() {} },
  });
  const settle = () => new Promise(resolve => setImmediate(resolve));
  Sync({ version: "version-a" });
  await settle();
  expect(refreshes).toBe(1);
  observed = "version-b";
  tick!(); await settle();
  expect(refreshes).toBe(2);
  tick!(); await settle();
  expect(refreshes).toBe(3);
  dispose!();
  Sync({ version: "version-b" });
  await settle();
  const confirmed = refreshes;
  tick!(); await settle();
  expect(refreshes).toBe(confirmed);
  dispose!();
});
