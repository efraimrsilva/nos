import { test, expect } from "@playwright/test";
import { readNavigationCounts } from "../src/features/navigation/counts";

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
