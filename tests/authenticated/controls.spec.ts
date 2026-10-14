import { test, expect, localSql } from "./fixtures";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

test("controles, reservas e saída da conta preservam o vínculo", async ({ page, account }, testInfo) => {
  const nucleus = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Jardim de exemplo','Cultivar presença','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','creator');`);
  // Fixture local cria contexto real; visitar a orientação não executa remoção.
  await page.goto("/configuracoes");
  await expect(page.getByRole("heading", { name: "Configurações", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Privacidade e visibilidade/ }).click();
  await expect(page.getByText(/momentos do Hábito com humor e nota/)).toBeVisible();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  const gallery = process.env.NOS_CONTROLS_GALLERY;
  if (gallery) mkdirSync(gallery, { recursive: true });
  for (const [id, route, title] of [[12,"/nucleos","Seus Núcleos"],[13,`/nucleos/${nucleus}`,"Jardim de exemplo"],[66,"/configuracoes","Configurações"],[67,"/configuracoes/privacidade","Privacidade e visibilidade"],[69,"/configuracoes/conta","Conta e segurança"],[70,"/ajuda","Ajuda e suporte"],[71,`/nucleos/${nucleus}/sair`,"Sair de um Núcleo"]] as const) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (gallery) await page.screenshot({ path: path.join(gallery, `app-${id}-${testInfo.project.name}.png`), fullPage: true });
  }
  await expect(page.getByRole("heading", { name: "Você é o criador deste Núcleo" })).toBeVisible();
  await expect(page.getByRole("button", { name: /confirmar|transferir/i })).toHaveCount(0);
  await page.getByRole("link", { name: "Voltar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Jardim de exemplo" })).toBeVisible();
  await page.goto("/configuracoes/conta");
  await page.getByRole("link", { name: "Solicitar recuperação de acesso" }).click();
  await expect(page.locator('input[name="next"]')).toHaveValue("/configuracoes/conta");
  await page.goto("/configuracoes/conta");
  await page.getByRole("button", { name: "Sair da conta", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  await page.goto("/configuracoes");
  await expect(page.getByRole("heading", { name: "Sua conta no Nós" })).toBeVisible();
  expect(localSql(`select count(*) from public.nucleus_members where nucleus_id='${nucleus}' and user_id='${account.id}';`).trim()).toBe("1");
});

test("saída não revela outro Núcleo e exige associação", async ({ page, account }) => {
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_LOCAL_SERVICE_KEY!, { auth: { persistSession: false } });
  const { data, error } = await admin.auth.admin.createUser({ email: `controls-${randomUUID()}@example.test`, password: `Aa1!${randomUUID()}`, email_confirm: true });
  if (error || !data.user) throw new Error("Falha ao criar segunda conta local.");
  const nucleus = randomUUID();
  try {
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Outro jardim privado','Não revelar','${data.user.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${data.user.id}','creator');`);
    await page.goto(`/nucleos/${nucleus}/sair`);
    // loading.tsx pode iniciar streaming com HTTP 200; conferir a negativa no conteúdo final.
    await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content="noindex"]').first()).toBeAttached();
    await expect(page.getByText("Outro jardim privado")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Sair de um Núcleo" })).toHaveCount(0);
    // Participante real consulta orientação, mas não recebe o contexto exclusivo de criador.
    localSql(`insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','member');`);
    await page.goto(`/nucleos/${nucleus}/sair`);
    await expect(page.getByRole("heading", { name: "Sair de um Núcleo" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Você é o criador deste Núcleo" })).toHaveCount(0);
  } finally {
    localSql(`delete from public.nuclei where id='${nucleus}';`);
    const removed = await admin.auth.admin.deleteUser(data.user.id);
    if (removed.error) throw new Error("Falha ao limpar segunda conta local.");
  }
});
