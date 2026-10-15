import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { Page } from "@playwright/test";
export async function withPeer(page: Page, run: (peer: { page: Page; id: string; client: ReturnType<typeof createServerClient> }) => Promise<void>) {
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
  const email = `administration-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) throw new Error("Não foi possível criar a segunda conta local.");
  const context = await page.context().browser()!.newContext({ viewport: page.viewportSize()! });
  try {
    const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { cookies: { getAll: () => [], setAll: async entries => {
      await context.addCookies(entries.map(({ name, value }) => ({ name, value, url: "http://127.0.0.1:3200", httpOnly: true, sameSite: "Lax" as const })));
    } } });
    if ((await client.auth.signInWithPassword({ email, password })).error) throw new Error("Falha ao autenticar segunda conta.");
    await run({ page: await context.newPage(), id: data.user.id, client });
  } finally {
    await context.close();
    if ((await admin.auth.admin.deleteUser(data.user.id)).error) throw new Error("Falha ao limpar segunda conta local.");
  }
}
