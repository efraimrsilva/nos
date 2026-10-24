import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { test, expect, localSql } from "./fixtures";
import { withPeer } from "./peer";

test("totais gerais discretos, acessíveis e atualizados no desktop e celular", async ({ page, account }, info) => {
  await withPeer(page, async peer => {
    const a = randomUUID(), b = randomUUID(), agreement = randomUUID(), event = randomUUID();
    localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values
      ('${a}','amigos','Jardim de teste','Convivência','${account.id}'),('${b}','amigos','Outro jardim','Presença','${account.id}');
      insert into public.nucleus_members(nucleus_id,user_id,role) values
      ('${a}','${account.id}','admin'),('${b}','${account.id}','admin'),('${a}','${peer.id}','member'),('${b}','${peer.id}','member');
      insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,terms_version) values
      ('${agreement}','${b}','${account.id}','habit','Caminhar','Presença','Manhã','Diária','active',2);
      insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version) values('${agreement}','${account.id}','accepted',2);
      insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values
      ('${event}','${b}','${account.id}','Encontro',now()+interval '1 hour',now()+interval '2 hours','UTC');
      insert into public.nucleus_event_participants(event_id,user_id,response) values('${event}','${account.id}','pending');`);
    await page.setViewportSize(info.project.name === "desktop" ? { width: 1440, height: 1000 } : { width: 390, height: 844 });
    await page.goto(`/nucleos/${a}`);
    const nav = page.locator(info.project.name === "desktop" ? ".desktop-navigation" : ".mobile-navigation");
    const expected = { agreements: "1", events: "1", people: "1" };
    for (const [key, value] of Object.entries(expected)) {
      await expect(nav.locator(`[data-count=${key}]`)).toHaveText(value);
      await expect(nav.locator(`[data-count=${key}]`)).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    }
    await expect(nav.getByRole("link", { name: "Acordos", exact: true })).toHaveAccessibleDescription(/1 · .*todos os seus Núcleos/);
    const gallery = process.env.NOS_COUNTS_GALLERY;
    if (gallery) {
      mkdirSync(gallery, { recursive: true });
      const before = await page.addStyleTag({ content: ".nav-count{display:none!important}" });
      await page.screenshot({ path: path.join(gallery, `referencia-sem-totais-${info.project.name}.png`), fullPage: true });
      await before.evaluate(element => (element as HTMLStyleElement).remove());
      await page.screenshot({ path: path.join(gallery, `app-${info.project.name}.png`), fullPage: true });
    }
    if (info.project.name === "mobile") {
      await nav.getByRole("button", { name: "Mais áreas e preferências" }).click();
      await expect(page.getByRole("dialog").locator("[data-count=nuclei]")).toHaveText("2");
      if (gallery) await page.screenshot({ path: path.join(gallery, "app-mobile-mais.png") });
      await page.keyboard.press("Escape");
      await page.setViewportSize({ width: 320, height: 740 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const key of Object.keys(expected)) await expect(nav.locator(`[data-count=${key}]`)).toBeVisible();
      if (gallery) await page.screenshot({ path: path.join(gallery, "app-mobile-320.png") });
    } else await expect(nav.locator("[data-count=nuclei]")).toHaveText("2");
    // Acordos e compromissos pertencem ao outro Núcleo, comprovando o alcance geral.
    await nav.getByRole("link", { name: "Acordos", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/nucleos/${a}/acordos`));
    await expect(nav.locator("[data-count=agreements]")).toHaveText("1");
    localSql(`update public.nucleus_agreements set terms_version=3 where id='${agreement}'; update public.nucleus_event_participants set response='declined' where event_id='${event}' and user_id='${account.id}'; delete from public.nucleus_members where nucleus_id='${b}' and user_id='${account.id}';`);
    await page.reload();
    await expect(nav.locator("[data-count=agreements]")).toHaveText("0");
    await expect(nav.locator("[data-count=events]")).toHaveText("0");
    await expect(nav.locator("[data-count=people]")).toHaveText("1");
    await page.goto("/nucleos");
    await expect(nav.locator("[data-count=nuclei]")).toHaveText("1");
  });
});

test("falha da consulta mantém links e informa total indisponível", async ({ page }, info) => {
  const definition = localSql("select pg_get_functiondef('public.get_navigation_counts()'::regprocedure)").trim();
  try {
    // Somente no banco local serializado: exercita falha real da fronteira servidor/banco.
    localSql("create or replace function public.get_navigation_counts() returns jsonb language plpgsql stable security definer set search_path='' as $$ begin raise exception 'indisponível'; end; $$");
    await page.goto("/nucleos");
    const nav = page.locator(info.project.name === "desktop" ? ".desktop-navigation" : ".mobile-navigation");
    await expect(nav.locator("[data-count=nuclei]")).toHaveText("—");
    const link = nav.getByRole("link", { name: info.project.name === "desktop" ? "Seus Núcleos" : "Núcleos", exact: true });
    await expect(link).toHaveAccessibleDescription("Total indisponível. Tente atualizar a página.");
    await link.click();
    await expect(page.getByRole("heading", { name: "Seus Núcleos", exact: true })).toBeVisible();
  } finally { localSql(definition); }
  await page.reload();
  const nav = page.locator(info.project.name === "desktop" ? ".desktop-navigation" : ".mobile-navigation");
  await expect(nav.locator("[data-count=nuclei]")).toHaveText("0");
});

test("pessoa sem Núcleo vê zero real e totais grandes cabem no celular", async ({ page, account }, info) => {
  await page.goto("/nucleos");
  const nav = page.locator(info.project.name === "desktop" ? ".desktop-navigation" : ".mobile-navigation");
  await expect(nav.locator("[data-count=nuclei]")).toHaveText("0");
  const nucleus = randomUUID();
  localSql(`insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','amigos','Muitos acordos','Convivência','${account.id}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin');
    with agreements as (insert into public.nucleus_agreements(nucleus_id,created_by,category,title,description,timing,frequency,status,terms_version)
    select '${nucleus}','${account.id}','habit','Caminhar','Presença','Manhã','Diária','active',1 from generate_series(1,1201) returning id)
    insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version) select id,'${account.id}','accepted',1 from agreements;`);
  await page.goto(`/nucleos/${nucleus}`);
  if (info.project.name === "mobile") await page.setViewportSize({ width: 320, height: 740 });
  await expect(nav.locator("[data-count=agreements]")).toHaveText(info.project.name === "desktop" ? "1.201" : "1,2 mil");
  await expect(nav.getByRole("link", { name: "Acordos", exact: true })).toHaveAccessibleDescription(/^1\.201 ·/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
