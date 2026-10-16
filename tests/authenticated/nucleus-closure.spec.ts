import { test, expect, localSql } from "./fixtures";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { withPeer } from "./peer";
import { mkdirSync } from "node:fs";
import path from "node:path";

test("encerramento exige administrador e confirmação, preserva história e bloqueia todos", async ({ page, account }, testInfo) => {
  const nucleus = randomUUID();
  await withPeer(page, async peer => {
    try {
      localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','amigos','Jardim de encerramento','Presença','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'),('${nucleus}','${peer.id}','member');`);
      await peer.page.goto(`http://127.0.0.1:3200/nucleos/${nucleus}/pessoas`);
      await expect(peer.page.getByRole("heading", { name: "Pessoas e administração", exact: true })).toBeVisible();
      await expect(peer.page.getByText("Quero encerrar este Núcleo", { exact: true })).toHaveCount(0);
      expect((await peer.client.rpc("close_nucleus", { target_nucleus: nucleus, confirmation_name: "Jardim de encerramento" })).error?.code).toBe("42501");

      await page.goto(`/nucleos/${nucleus}/pessoas`);
      await page.getByText("Quero encerrar este Núcleo", { exact: true }).click();
      const button = page.getByRole("button", { name: "Encerrar Núcleo", exact: true });
      await button.click();
      expect(localSql(`select closed_at is null from public.nuclei where id='${nucleus}'`).trim()).toBe("t");
      await page.getByLabel(/Digite o nome do Núcleo para confirmar/).fill("Nome incorreto");
      await page.getByLabel("Entendi que todos perderão acesso, os convites serão revogados e o histórico permanecerá armazenado.").check();
      await button.click();
      await expect(page.getByRole("alert").filter({ hasText: "O nome informado não corresponde" })).toBeVisible();
      await page.getByText("Quero encerrar este Núcleo", { exact: true }).click();
      expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${nucleus}'`).trim()).toBe("2");
      await page.getByText("Quero encerrar este Núcleo", { exact: true }).click();
      await page.getByLabel(/Digite o nome do Núcleo para confirmar/).fill("Jardim de encerramento");
      // React reinicia os campos após a ação; a tentativa corrigida exige nova ciência explícita.
      await page.getByLabel("Entendi que todos perderão acesso, os convites serão revogados e o histórico permanecerá armazenado.").check();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const gallery = process.env.NOS_CLOSURE_GALLERY;
      if (gallery) {
        mkdirSync(gallery, { recursive: true });
        await page.screenshot({ path: path.join(gallery, `app-73-${testInfo.project.name}.png`), fullPage: true });
      }
      await button.click();
      await expect(page).toHaveURL(/\/nucleos\?resultado=encerrado$/);
      await expect(page.getByRole("status").filter({ hasText: "Núcleo encerrado." })).toBeVisible();
      await expect(page.getByRole("link", { name: /Jardim de encerramento/ })).toHaveCount(0);
      expect(localSql(`select closed_at is not null from public.nuclei where id='${nucleus}'`).trim()).toBe("t");
      expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${nucleus}'`).trim()).toBe("0");
      for (const target of [page, peer.page]) {
        await target.goto(`http://127.0.0.1:3200/nucleos/${nucleus}/pessoas`);
        await expect(target.getByRole("heading", { name: "404", exact: true })).toBeVisible();
      }
    } finally { localSql(`delete from public.nuclei where id='${nucleus}';`); }
  });
});

test("administradores equivalentes encerram sem duplicação em chamadas concorrentes", async ({ page, account }) => {
  const nucleus = randomUUID();
  await withPeer(page, async peer => {
    const own = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
    try {
      localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','amigos','Jardim concorrente','Presença','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin'),('${nucleus}','${peer.id}','admin');`);
      expect((await own.auth.signInWithPassword({ email: account.email, password: account.password })).error).toBeNull();
      const outcomes = await Promise.all([own, peer.client].map(client => client.rpc("close_nucleus", { target_nucleus: nucleus, confirmation_name: "Jardim concorrente" })));
      expect(outcomes.filter(result => result.error === null)).toHaveLength(1);
      expect(outcomes.find(result => result.error)?.error?.code).toBe("42501");
      expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${nucleus}'`).trim()).toBe("0");
    } finally { own.auth.stopAutoRefresh(); localSql(`delete from public.nuclei where id='${nucleus}';`); }
  });
});
