import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { test as base, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

export { expect };
export function localSql(query: string) {
  if (!/^http:\/\/(?:127\.0\.0\.1|localhost):/.test(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")) throw new Error("Banco remoto não permitido.");
  return execFileSync("docker", ["exec", "supabase_db_nos", "psql", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-At", "-c", query], { encoding: "utf8" });
}
export const test = base.extend<{ account: { email: string; password: string; id: string } }>({
  account: async ({}, use) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    if (!/^http:\/\/(?:127\.0\.0\.1|localhost):/.test(url)) throw new Error("A suíte autenticada exige Supabase local.");
    const admin = createClient(url, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
    const email = `routing-${randomUUID()}@example.test`, password = `Aa1!${randomUUID()}`;
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error || !data.user) throw new Error("Não foi possível criar a conta temporária local.");
    try {
      await use({ email, password, id: data.user.id });
    } finally {
      if (!/^[0-9a-f-]{36}$/.test(data.user.id)) throw new Error("Identificador de limpeza inválido.");
      // As tabelas não concedem escrita ao service_role; fixtures usam SQL somente no contêiner local.
      localSql(`delete from public.nuclei where created_by='${data.user.id}';`);
      const cleanup = await admin.auth.admin.deleteUser(data.user.id);
      // O teste de exclusão já remove a conta; 404 confirma a limpeza nesse caso.
      if (cleanup.error && cleanup.error.status !== 404) throw new Error("Falha ao remover a conta temporária local.");
    }
  },
  page: async ({ page, context, account }, use) => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      // Usa o mesmo codec SSR do aplicativo; não há bypass de autenticação no código de produção.
      const client = createServerClient(url, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
        cookies: { getAll: () => [], setAll: async entries => {
          await context.addCookies(entries.map(({ name, value }) => ({ name, value, url: "http://127.0.0.1:3200", httpOnly: true, sameSite: "Lax" as const })));
        } },
      });
      const result = await client.auth.signInWithPassword({ email: account.email, password: account.password });
      if (result.error) throw new Error("Não foi possível autenticar a conta temporária local.");
      await use(page);
  },
});
